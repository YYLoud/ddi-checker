/*
 * DDI 比對引擎
 * 依賴: DRUGS, CLASS_TREE (drug-dictionary.js) 與 DDI_RULES (ddi-rules.js)
 */
(function (global) {
  "use strict";

  // ---- 建立查詢索引 (學名 id / 中文 / 商品名 → drug) ----
  function norm(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }
  // 取商品名主字 (英文商標,去掉中文與說明) 以利模糊比對
  function brandKeys(brand) {
    const keys = [norm(brand)];
    const eng = brand.match(/[A-Za-z][A-Za-z0-9\-]+/g);
    if (eng) eng.forEach((w) => keys.push(norm(w)));
    const zh = brand.match(/[一-鿿]+/g);
    if (zh) zh.forEach((w) => keys.push(norm(w)));
    return keys;
  }

  const INDEX = new Map(); // key → drug
  function addKey(k, drug) {
    k = norm(k);
    if (k && !INDEX.has(k)) INDEX.set(k, drug);
  }
  DRUGS.forEach((d) => {
    addKey(d.id, d);
    // 中文欄位可能含 "english 中文" 形式,拆開加入
    norm(d.zh).split(/[\/,()（）]| /).forEach((p) => { if (p.length >= 2) addKey(p, d); });
    (d.brands || []).forEach((b) => brandKeys(b).forEach((k) => { if (k.length >= 2) addKey(k, d); }));
  });

  // ---- 類別展開: 父類別 → 全部葉節點 (含自身) ----
  function expandClass(cls) {
    const out = new Set();
    (function rec(c) {
      if (out.has(c)) return;
      out.add(c);
      (CLASS_TREE[c] || []).forEach(rec);
    })(cls);
    return out;
  }
  function drugHasClass(drug, cls) {
    const needed = Array.isArray(cls) ? cls : [cls];
    const drugClasses = new Set(drug.classes || []);
    return needed.some((c) => {
      for (const leaf of expandClass(c)) if (drugClasses.has(leaf)) return true;
      return false;
    });
  }

  // ---- 解析輸入 → 已辨識 / 未辨識 ----
  function parseInput(list) {
    const recognized = [];
    const unresolved = [];
    const seen = new Set();
    list.forEach((raw) => {
      const term = String(raw || "").trim();
      if (!term) return;
      const key = norm(term);
      let drug = INDEX.get(key);
      if (!drug) {
        // 寬鬆比對: 輸入包含索引鍵,或索引鍵包含輸入 (長度>=4避免誤判)
        for (const [k, d] of INDEX) {
          if (k.length >= 4 && (key.includes(k) || k.includes(key))) { drug = d; break; }
        }
      }
      if (drug) {
        if (!seen.has(drug.id)) {
          seen.add(drug.id);
          recognized.push({ input: term, drug });
        }
      } else {
        unresolved.push(term);
      }
    });
    return { recognized, unresolved };
  }

  // 一個 participant 由哪些 (已辨識藥的索引) 滿足
  function matchingIndices(participant, recognized) {
    const idx = [];
    recognized.forEach((r, i) => {
      if (participant.any && participant.any.includes(r.drug.id)) idx.push(i);
      else if (participant.cls && drugHasClass(r.drug, participant.cls)) idx.push(i);
    });
    return idx;
  }

  // 為 pair/多角色規則尋找「不同藥」的指派 (participants <=3, 直接回溯)
  function assignDistinct(participants, recognized) {
    const lists = participants.map((p) => matchingIndices(p, recognized));
    if (lists.some((l) => l.length === 0)) return null;
    const used = new Set();
    const chosen = [];
    function bt(k) {
      if (k === lists.length) return true;
      for (const i of lists[k]) {
        if (used.has(i)) continue;
        used.add(i); chosen[k] = i;
        if (bt(k + 1)) return true;
        used.delete(i);
      }
      return false;
    }
    return bt(0) ? chosen.slice() : null;
  }

  // ---- 主評估 ----
  function evaluate(inputList) {
    const { recognized, unresolved } = parseInput(inputList);
    const hits = [];

    DDI_RULES.forEach((rule) => {
      // 計數型規則
      const countP = rule.participants.find((p) => p.count);
      if (countP) {
        const members = recognized.filter((r) => drugHasClass(r.drug, countP.count.cls));
        if (members.length >= countP.count.min) {
          const burden = members.reduce((s, m) => s + (m.drug.abs || 0), 0);
          hits.push({ rule, drugs: members.map((m) => m.drug), involved: members.map((m) => m.input), burden });
        }
        return;
      }
      // pair / 多角色
      const assign = assignDistinct(rule.participants, recognized);
      if (assign) {
        const drugs = assign.map((i) => recognized[i].drug);
        hits.push({ rule, drugs, involved: assign.map((i) => recognized[i].input) });
      }
    });

    // 依嚴重度排序 (高→低)
    hits.sort((a, b) => (b.rule.severity || 0) - (a.rule.severity || 0));
    return { recognized, unresolved, hits };
  }

  // ---- 自動完成建議 ----
  // 回傳與 query 相符的藥物 (依相關度排序): 前綴 > 子字串
  function suggest(query, limit) {
    limit = limit || 8;
    const q = norm(query);
    if (!q) return [];
    const seen = new Set();
    const scored = [];
    DRUGS.forEach((d) => {
      const labels = [norm(d.id)];
      norm(d.zh).split(/[\/,()（）]| /).forEach((p) => { if (p) labels.push(p); });
      (d.brands || []).forEach((b) => brandKeys(b).forEach((k) => { if (k) labels.push(k); }));
      let best = Infinity;
      for (const l of labels) {
        const idx = l.indexOf(q);
        if (idx === 0) { best = 0; break; }
        if (idx > 0) best = Math.min(best, 1);
      }
      if (best < Infinity && !seen.has(d.id)) {
        seen.add(d.id);
        scored.push({ d, best });
      }
    });
    scored.sort((a, b) => a.best - b.best || a.d.id.localeCompare(b.d.id));
    return scored.slice(0, limit).map((s) => s.d);
  }

  // 解析單一詞 → drug 或 null
  function resolveOne(term) {
    const r = parseInput([term]);
    return r.recognized.length ? r.recognized[0].drug : null;
  }

  global.DDIEngine = { evaluate, parseInput, suggest, resolveOne };
})(typeof window !== "undefined" ? window : globalThis);
