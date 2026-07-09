# 藥物交互作用檢核系統 (DDI Checker)

輸入多種藥物（學名或台灣常見商品名），自動比對是否存在潛在臨床顯著的藥物交互作用（Drug-Drug Interaction, DDI）。

## 依據來源

比對規則完全依據以下國際共識清單（針對 **≥65 歲老年人**，共 66 條 DDI）：

> Anrys P, Petit AE, Thevelin S, et al. **An International Consensus List of Potentially Clinically Significant Drug-Drug Interactions in Older People.** *JAMDA*. 2021;22(11):2121-2133. doi:10.1016/j.jamda.2021.03.019

## 使用方式

以瀏覽器開啟 `index.html` 即可（純前端、本機執行，無需伺服器）。
於欄位輸入藥物清單（每行一種，或用逗號／分號／頓號分隔），按「檢核交互作用」。

## 專案結構

| 檔案 | 說明 |
|------|------|
| `index.html` | 使用者介面 |
| `data/ddi-rules.js` | 66 條 DDI 規則（參與者、交互作用類型、潛在危害、建議處置、嚴重度） |
| `data/drug-dictionary.js` | 藥物字典（學名／中文／台灣商品名／藥類），**草稿待審核** |
| `data/ddi-engine.js` | 比對引擎（支援成分配對、藥類、CYP3A4/P-gp 屬性群組、計數型規則） |

## 比對邏輯

規則分為四種型態：
- **成分 + 成分**：如 Digoxin + Amiodarone
- **成分 + 藥類**：如 Digoxin + 巨環類抗生素
- **藥類 + 藥類**：如 ACEI/ARB + 口服 NSAID
- **計數型**：如併用 ≥3 種中樞神經作用藥、≥2 種留鉀藥

## ⚠ 重要限制

- 本清單標示的是**潛在**而非**絕對**的交互作用，且針對 **≥65 歲**族群制定。
- 本工具不涵蓋所有可能的 DDI，**不能取代**完整用藥審查與專業判斷。
- 藥物字典與台灣商品名對應為**初版草稿**，臨床使用前請由藥師／醫師逐筆核對。
- 僅供臨床決策輔助與教育用途。

## 版本

v0.1 原型
