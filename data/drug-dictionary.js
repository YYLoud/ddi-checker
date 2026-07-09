/*
 * 藥物字典 —— 【草稿版,待專業審核】
 * 每筆: id(英文學名) / zh(中文) / brands(台灣常見商品名,示意用非窮舉) / classes(所屬藥類/屬性群組)
 *
 * classes 使用的「葉節點」類別會被 ddi-engine.js 的 CLASS_TREE 展開成父類別。
 * ⚠ 商品名與藥類成員皆為初版草稿,臨床使用前務必由藥師/醫師逐筆核對。
 */
const CLASS_TREE = {
  oral_anticoagulant: ["vka", "factor_xa_inhibitor", "direct_thrombin_inhibitor"],
  diuretic_any: ["thiazide", "loop", "potassium_sparing_diuretic"],
  diuretic_thiazide_loop: ["thiazide", "loop"],
  antidepressant: ["ssri", "snri", "tca", "other_antidep"],
  serotonergic: ["ssri", "snri", "tca", "serotonergic_other"],
};

const DRUGS = [
  // 抗凝血劑
  { id:"warfarin", zh:"warfarin 華法林", brands:["Coumadin 可邁丁","Orfarin"], classes:["vka"] },
  { id:"acenocoumarol", zh:"acenocoumarol", brands:[], classes:["vka"] },
  { id:"dabigatran", zh:"dabigatran", brands:["Pradaxa 普栓達"], classes:["direct_thrombin_inhibitor"] },
  { id:"rivaroxaban", zh:"rivaroxaban", brands:["Xarelto 拜瑞妥"], classes:["factor_xa_inhibitor"] },
  { id:"apixaban", zh:"apixaban", brands:["Eliquis 艾必克凝"], classes:["factor_xa_inhibitor"] },
  { id:"edoxaban", zh:"edoxaban", brands:["Lixiana 里先安"], classes:["factor_xa_inhibitor"] },
  // 抗血小板
  { id:"aspirin", zh:"aspirin 阿斯匹靈", brands:["Bokey 伯基","Aspirin Protect"], classes:["antiplatelet"] },
  { id:"clopidogrel", zh:"clopidogrel", brands:["Plavix 保栓通"], classes:["antiplatelet"] },
  { id:"ticagrelor", zh:"ticagrelor", brands:["Brilinta 百無凝"], classes:["antiplatelet"] },
  { id:"prasugrel", zh:"prasugrel", brands:["Efient"], classes:["antiplatelet"] },
  { id:"dipyridamole", zh:"dipyridamole", brands:["Persantin"], classes:["antiplatelet"] },
  { id:"ticlopidine", zh:"ticlopidine", brands:["Licodin"], classes:["antiplatelet"] },
  // 口服 NSAID (亦屬留鉀藥群 DDI-21)
  { id:"ibuprofen", zh:"ibuprofen", brands:["Brufen 布洛芬"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"naproxen", zh:"naproxen", brands:["Naposin"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"diclofenac", zh:"diclofenac", brands:["Voren 非炎","Cataflam"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"celecoxib", zh:"celecoxib", brands:["Celebrex 希樂葆"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"etoricoxib", zh:"etoricoxib", brands:["Arcoxia 萬克適"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"meloxicam", zh:"meloxicam", brands:["Mobic 骨敏捷"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"indomethacin", zh:"indomethacin", brands:["Indocin"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"ketorolac", zh:"ketorolac", brands:["Toradol"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"mefenamic-acid", zh:"mefenamic acid", brands:["Ponstan 撲樂癒"], classes:["nsaid_oral","potassium_sparing"] },
  { id:"piroxicam", zh:"piroxicam", brands:["Feldene"], classes:["nsaid_oral","potassium_sparing"] },
  // Fibrate
  { id:"gemfibrozil", zh:"gemfibrozil", brands:["Lopid"], classes:["fibrate"] },
  { id:"fenofibrate", zh:"fenofibrate", brands:["Lipanthyl"], classes:["fibrate"] },
  { id:"bezafibrate", zh:"bezafibrate", brands:["Bezalip"], classes:["fibrate"] },
  // Statin
  { id:"atorvastatin", zh:"atorvastatin", brands:["Lipitor 立普妥"], classes:["statin"] },
  { id:"simvastatin", zh:"simvastatin", brands:["Zocor 素果"], classes:["statin"] },
  { id:"lovastatin", zh:"lovastatin", brands:["Mevacor"], classes:["statin"] },
  { id:"pravastatin", zh:"pravastatin", brands:["Mevalotin 美百樂鎮"], classes:["statin"] },
  { id:"rosuvastatin", zh:"rosuvastatin", brands:["Crestor 冠脂妥"], classes:["statin"] },
  { id:"fluvastatin", zh:"fluvastatin", brands:["Lescol"], classes:["statin"] },
  { id:"pitavastatin", zh:"pitavastatin", brands:["Livalo"], classes:["statin"] },
  // 鈣離子通道阻斷劑
  { id:"amlodipine", zh:"amlodipine", brands:["Norvasc 脈優"], classes:["ccb"] },
  { id:"nifedipine", zh:"nifedipine", brands:["Adalat 冠達悅"], classes:["ccb"] },
  { id:"felodipine", zh:"felodipine", brands:["Plendil 普心寧"], classes:["ccb"] },
  { id:"nicardipine", zh:"nicardipine", brands:["Perdipine"], classes:["ccb"] },
  { id:"lercanidipine", zh:"lercanidipine", brands:["Zanidip"], classes:["ccb"] },
  { id:"verapamil", zh:"verapamil", brands:["Isoptin 心舒平"], classes:["ccb","cyp3a4_inhibitor","pgp_inhibitor","rate_reducing"] },
  { id:"diltiazem", zh:"diltiazem", brands:["Herbesser 合必爽"], classes:["ccb","cyp3a4_inhibitor","pgp_inhibitor","rate_reducing"] },
  // 乙型阻斷劑
  { id:"bisoprolol", zh:"bisoprolol", brands:["Concor 康肯"], classes:["beta_blocker","rate_reducing"] },
  { id:"atenolol", zh:"atenolol", brands:["Tenormin 天諾敏"], classes:["beta_blocker","rate_reducing"] },
  { id:"metoprolol", zh:"metoprolol", brands:["Betaloc 舒壓寧"], classes:["beta_blocker","rate_reducing"] },
  { id:"propranolol", zh:"propranolol", brands:["Inderal 恩特來"], classes:["beta_blocker","rate_reducing"] },
  { id:"carvedilol", zh:"carvedilol", brands:["Dilatrend 達利全"], classes:["beta_blocker","rate_reducing"] },
  { id:"nebivolol", zh:"nebivolol", brands:["Nebilet"], classes:["beta_blocker","rate_reducing"] },
  { id:"sotalol", zh:"sotalol", brands:["Betapace"], classes:["beta_blocker","antiarrhythmic","rate_reducing"] },
  // 抗心律不整 / 其他心臟
  { id:"digoxin", zh:"digoxin", brands:["Lanoxin 隆我心"], classes:["rate_reducing"] },
  { id:"amiodarone", zh:"amiodarone", brands:["Cordarone 臟得樂"], classes:["cyp3a4_inhibitor","pgp_inhibitor","antiarrhythmic","rate_reducing"] },
  { id:"propafenone", zh:"propafenone", brands:["Rytmonorm"], classes:["antiarrhythmic","rate_reducing"] },
  { id:"quinidine", zh:"quinidine", brands:[], classes:["antiarrhythmic","cyp3a4_inhibitor","pgp_inhibitor","rate_reducing"] },
  { id:"disopyramide", zh:"disopyramide", brands:["Norpace"], classes:["antiarrhythmic","rate_reducing","anticholinergic"], abs:3 },
  { id:"procainamide", zh:"procainamide", brands:["Pronestyl"], classes:["antiarrhythmic"] },
  { id:"dronedarone", zh:"dronedarone", brands:["Multaq"], classes:["cyp3a4_inhibitor","pgp_inhibitor","antiarrhythmic","rate_reducing"] },
  // 巨環類抗生素
  { id:"erythromycin", zh:"erythromycin", brands:["Erythrocin"], classes:["macrolide","cyp3a4_inhibitor","pgp_inhibitor"] },
  { id:"clarithromycin", zh:"clarithromycin", brands:["Klaricid 開羅理黴素"], classes:["macrolide","cyp3a4_inhibitor","pgp_inhibitor"] },
  { id:"azithromycin", zh:"azithromycin", brands:["Zithromax"], classes:["macrolide"] },
  { id:"roxithromycin", zh:"roxithromycin", brands:["Rulid"], classes:["macrolide"] },
  { id:"telithromycin", zh:"telithromycin", brands:["Ketek"], classes:["macrolide"] },
  // Quinolone
  { id:"ciprofloxacin", zh:"ciprofloxacin", brands:["Ciproxin"], classes:["quinolone"] },
  { id:"levofloxacin", zh:"levofloxacin", brands:["Cravit 可樂必妥"], classes:["quinolone"] },
  { id:"moxifloxacin", zh:"moxifloxacin", brands:["Avelox"], classes:["quinolone"] },
  { id:"ofloxacin", zh:"ofloxacin", brands:["Tarivid"], classes:["quinolone"] },
  { id:"norfloxacin", zh:"norfloxacin", brands:["Baccidal"], classes:["quinolone"] },
  // Azole 抗黴菌 / 其他 CYP3A4·P-gp 抑制劑
  { id:"ketoconazole", zh:"ketoconazole", brands:["Nizoral"], classes:["cyp3a4_inhibitor","pgp_inhibitor"] },
  { id:"itraconazole", zh:"itraconazole", brands:["Sporanox"], classes:["cyp3a4_inhibitor","pgp_inhibitor"] },
  { id:"voriconazole", zh:"voriconazole", brands:["Vfend"], classes:["cyp3a4_inhibitor"] },
  { id:"posaconazole", zh:"posaconazole", brands:["Noxafil"], classes:["cyp3a4_inhibitor"] },
  { id:"fluconazole", zh:"fluconazole", brands:["Diflucan"], classes:["cyp3a4_inhibitor"] },
  { id:"ciclosporin", zh:"ciclosporin/cyclosporine", brands:["Sandimmun 新體睦"], classes:["cyp3a4_inhibitor","pgp_inhibitor"] },
  { id:"ritonavir", zh:"ritonavir", brands:["Norvir","Paxlovid 含成分"], classes:["cyp3a4_inhibitor","pgp_inhibitor"] },
  // 利尿劑 - Thiazide
  { id:"hydrochlorothiazide", zh:"hydrochlorothiazide (HCTZ)", brands:["Dichlotride"], classes:["thiazide","potassium_reducing"] },
  { id:"chlorthalidone", zh:"chlorthalidone", brands:["Hygroton"], classes:["thiazide","potassium_reducing"] },
  { id:"indapamide", zh:"indapamide", brands:["Natrilix 鈉催離"], classes:["thiazide","potassium_reducing"] },
  { id:"metolazone", zh:"metolazone", brands:["Zaroxolyn"], classes:["thiazide","potassium_reducing"] },
  // 利尿劑 - Loop
  { id:"furosemide", zh:"furosemide", brands:["Lasix 來適泄"], classes:["loop","potassium_reducing"] },
  { id:"torasemide", zh:"torasemide", brands:["Torem"], classes:["loop","potassium_reducing"] },
  { id:"bumetanide", zh:"bumetanide", brands:["Burinex"], classes:["loop","potassium_reducing"] },
  { id:"etacrynic-acid", zh:"etacrynic acid", brands:["Edecrin"], classes:["loop","potassium_reducing"] },
  // 利尿劑 - 留鉀
  { id:"spironolactone", zh:"spironolactone", brands:["Aldactone 安達通"], classes:["potassium_sparing_diuretic","potassium_sparing"] },
  { id:"eplerenone", zh:"eplerenone", brands:["Inspra"], classes:["potassium_sparing_diuretic","potassium_sparing"] },
  { id:"amiloride", zh:"amiloride", brands:["Midamor"], classes:["potassium_sparing_diuretic","potassium_sparing"] },
  { id:"triamterene", zh:"triamterene", brands:["Dyrenium"], classes:["potassium_sparing_diuretic","potassium_sparing"] },
  // ACEI
  { id:"enalapril", zh:"enalapril", brands:["Renitec"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"lisinopril", zh:"lisinopril", brands:["Zestril"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"ramipril", zh:"ramipril", brands:["Tritace 心達舒"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"captopril", zh:"captopril", brands:["Capoten"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"perindopril", zh:"perindopril", brands:["Coversyl 冠脈寧"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"benazepril", zh:"benazepril", brands:["Cibacen"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"fosinopril", zh:"fosinopril", brands:["Monopril"], classes:["ace_inhibitor","potassium_sparing"] },
  { id:"imidapril", zh:"imidapril", brands:["Tanatril"], classes:["ace_inhibitor","potassium_sparing"] },
  // ARB
  { id:"losartan", zh:"losartan", brands:["Cozaar 可悅您"], classes:["arb","potassium_sparing"] },
  { id:"valsartan", zh:"valsartan", brands:["Diovan 得安穩"], classes:["arb","potassium_sparing"] },
  { id:"candesartan", zh:"candesartan", brands:["Blopress 博脈舒"], classes:["arb","potassium_sparing"] },
  { id:"irbesartan", zh:"irbesartan", brands:["Aprovel 安普諾維"], classes:["arb","potassium_sparing"] },
  { id:"telmisartan", zh:"telmisartan", brands:["Micardis 必康平"], classes:["arb","potassium_sparing"] },
  { id:"olmesartan", zh:"olmesartan", brands:["Olmetec"], classes:["arb","potassium_sparing"] },
  // 鉀補充劑
  { id:"potassium-supplement", zh:"鉀補充劑 potassium chloride", brands:["Slow-K","K-Dur"], classes:["potassium_supplement"] },
  // 鋰鹽
  { id:"lithium", zh:"lithium 鋰鹽", brands:["Lithonate"], classes:["mood_stabilizer"] },
  // SSRI
  { id:"fluoxetine", zh:"fluoxetine", brands:["Prozac 百憂解"], classes:["ssri","cns_active"] },
  { id:"sertraline", zh:"sertraline", brands:["Zoloft 樂復得"], classes:["ssri","cns_active","anticholinergic"], abs:2,
    note:"備註:sertraline 依 Yamada ABS2 已納入抗膽鹼負擔計數,惟多數其他量表(如 ACB)評為低/0,屬邊界藥物。" },
  { id:"paroxetine", zh:"paroxetine", brands:["Seroxat 克憂果"], classes:["ssri","cns_active","anticholinergic"], abs:2 },
  { id:"citalopram", zh:"citalopram", brands:["Cipram"], classes:["ssri","cns_active"] },
  { id:"escitalopram", zh:"escitalopram", brands:["Lexapro 立普能"], classes:["ssri","cns_active"] },
  { id:"fluvoxamine", zh:"fluvoxamine", brands:["Luvox 無鬱寧"], classes:["ssri","cns_active"] },
  // SNRI
  { id:"venlafaxine", zh:"venlafaxine", brands:["Efexor 速悅"], classes:["snri","cns_active"] },
  { id:"duloxetine", zh:"duloxetine", brands:["Cymbalta 千憂解"], classes:["snri","cns_active"] },
  { id:"desvenlafaxine", zh:"desvenlafaxine", brands:["Pristiq"], classes:["snri","cns_active"] },
  { id:"milnacipran", zh:"milnacipran", brands:["Ixel"], classes:["snri","cns_active"] },
  // TCA (亦具抗膽鹼作用)
  { id:"amitriptyline", zh:"amitriptyline", brands:["Elavil"], classes:["tca","anticholinergic","cns_active"], abs:3 },
  { id:"nortriptyline", zh:"nortriptyline", brands:["Pamelor"], classes:["tca","anticholinergic","cns_active"], abs:3 },
  { id:"imipramine", zh:"imipramine", brands:["Tofranil"], classes:["tca","anticholinergic","cns_active"], abs:3 },
  { id:"clomipramine", zh:"clomipramine", brands:["Anafranil"], classes:["tca","anticholinergic","cns_active"], abs:3 },
  { id:"doxepin", zh:"doxepin", brands:["Sinequan"], classes:["tca","anticholinergic","cns_active"], abs:3 },
  // 其他血清素能 / 抗憂鬱
  { id:"mirtazapine", zh:"mirtazapine", brands:["Remeron 樂活優"], classes:["other_antidep","serotonergic_other","cns_active","anticholinergic"], abs:2 },
  { id:"trazodone", zh:"trazodone", brands:["Mesyrel 美舒鬱"], classes:["other_antidep","serotonergic_other","cns_active"] },
  { id:"bupropion", zh:"bupropion", brands:["Wellbutrin 威克倓"], classes:["other_antidep","cns_active"] },
  { id:"sumatriptan", zh:"sumatriptan (triptan)", brands:["Imigran"], classes:["serotonergic_other"] },
  { id:"st-johns-wort", zh:"St. John's Wort 聖約翰草", brands:[], classes:["serotonergic_other"] },
  // MAO 抑制劑
  { id:"moclobemide", zh:"moclobemide (MAO-A)", brands:["Aurorix"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"selegiline", zh:"selegiline", brands:["Jumex"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"rasagiline", zh:"rasagiline", brands:["Azilect"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"safinamide", zh:"safinamide", brands:["Xadago"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"phenelzine", zh:"phenelzine", brands:["Nardil"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"linezolid", zh:"linezolid", brands:["Zyvox 采福適"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"tranylcypromine", zh:"tranylcypromine", brands:["Parnate"], classes:["mao_inhibitor","serotonergic_other"] },
  { id:"isocarboxazid", zh:"isocarboxazid", brands:["Marplan"], classes:["mao_inhibitor","serotonergic_other"] },
  // Levodopa
  { id:"levodopa", zh:"levodopa", brands:["Madopar 美道普","Sinemet 心寧美"], classes:["antiparkinson"] },
  // 擬交感神經藥
  { id:"pseudoephedrine", zh:"pseudoephedrine 偽麻黃鹼", brands:["感冒藥常見成分"], classes:["sympathomimetic"] },
  { id:"phenylephrine", zh:"phenylephrine", brands:["感冒藥常見成分"], classes:["sympathomimetic"] },
  { id:"ephedrine", zh:"ephedrine", brands:[], classes:["sympathomimetic"] },
  { id:"methylphenidate", zh:"methylphenidate", brands:["Ritalin 利他能","Concerta 專思達"], classes:["sympathomimetic"] },
  // 鴉片類
  { id:"meperidine", zh:"meperidine/pethidine 配西汀", brands:["Demerol"], classes:["opioid","cns_active","serotonergic_other"] },
  { id:"fentanyl", zh:"fentanyl", brands:["Durogesic 吩坦尼"], classes:["opioid","cns_active","serotonergic_other"] },
  { id:"tramadol", zh:"tramadol", brands:["Tramal","Ultracet 含成分"], classes:["opioid","cns_active","serotonergic_other"] },
  { id:"morphine", zh:"morphine", brands:["MST"], classes:["opioid","cns_active"] },
  { id:"oxycodone", zh:"oxycodone", brands:["OxyContin","Targin"], classes:["opioid","cns_active"] },
  { id:"codeine", zh:"codeine", brands:["止咳藥常見成分"], classes:["opioid","cns_active"] },
  // 抗癲癇 (cns_active)
  { id:"carbamazepine", zh:"carbamazepine", brands:["Tegretol 癲通"], classes:["antiepileptic","cns_active"] },
  { id:"valproate", zh:"valproate/valproic acid", brands:["Depakine 帝拔癲"], classes:["antiepileptic","cns_active"] },
  { id:"phenytoin", zh:"phenytoin", brands:["Dilantin"], classes:["antiepileptic","cns_active"] },
  { id:"gabapentin", zh:"gabapentin", brands:["Neurontin 鎮頑癲"], classes:["antiepileptic","cns_active"] },
  { id:"pregabalin", zh:"pregabalin", brands:["Lyrica 利瑞卡"], classes:["antiepileptic","cns_active"] },
  { id:"levetiracetam", zh:"levetiracetam", brands:["Keppra"], classes:["antiepileptic","cns_active"] },
  { id:"phenobarbital", zh:"phenobarbital", brands:["Luminal"], classes:["barbiturate","cns_active"] },
  // 乙醯膽鹼酯酶抑制劑
  { id:"donepezil", zh:"donepezil", brands:["Aricept 愛憶欣"], classes:["ache_inhibitor","anticholinergic"], abs:2,
    note:"備註:donepezil 為乙醯膽鹼酯酶抑制劑(促膽鹼),依 Yamada muscarinic 結合 ABS2 已納入抗膽鹼負擔計數,但臨床上與抗膽鹼藥併用屬藥效對抗,判讀時併同考量。" },
  { id:"rivastigmine", zh:"rivastigmine", brands:["Exelon 憶思能"], classes:["ache_inhibitor"] },
  { id:"galantamine", zh:"galantamine", brands:["Reminyl 利憶靈"], classes:["ache_inhibitor"] },
  // Theophylline
  { id:"theophylline", zh:"theophylline", brands:["Theo-Dur","Xanthium"], classes:[] },
  // Thiopurine / allopurinol
  { id:"azathioprine", zh:"azathioprine", brands:["Imuran 移護寧"], classes:[] },
  { id:"mercaptopurine", zh:"6-mercaptopurine", brands:["Puri-Nethol"], classes:[] },
  { id:"allopurinol", zh:"allopurinol", brands:["Zyloric"], classes:[] },
  // 皮質類固醇 (口服/注射)
  { id:"prednisolone", zh:"prednisolone", brands:[], classes:["corticosteroid","potassium_reducing"] },
  { id:"prednisone", zh:"prednisone", brands:[], classes:["corticosteroid","potassium_reducing"] },
  { id:"methylprednisolone", zh:"methylprednisolone", brands:["Medrol"], classes:["corticosteroid","potassium_reducing"] },
  { id:"dexamethasone", zh:"dexamethasone", brands:["Decadron"], classes:["corticosteroid","potassium_reducing"] },
  { id:"hydrocortisone", zh:"hydrocortisone", brands:[], classes:["corticosteroid","potassium_reducing"] },
  { id:"betamethasone", zh:"betamethasone", brands:[], classes:["corticosteroid","potassium_reducing"] },
  // 抗膽鹼藥 (DDI-57 計數)
  { id:"oxybutynin", zh:"oxybutynin", brands:["Ditropan"], classes:["anticholinergic"], abs:3 },
  { id:"tolterodine", zh:"tolterodine", brands:["Detrusitol"], classes:["anticholinergic"], abs:3 },
  { id:"solifenacin", zh:"solifenacin", brands:["Vesicare"], classes:["anticholinergic"], abs:3 },
  { id:"diphenhydramine", zh:"diphenhydramine", brands:["Benadryl"], classes:["anticholinergic"], abs:3 },
  { id:"chlorpheniramine", zh:"chlorpheniramine 氯芬尼拉明", brands:["感冒藥常見成分"], classes:["anticholinergic"], abs:2 },
  { id:"hydroxyzine", zh:"hydroxyzine", brands:["Atarax"], classes:["anticholinergic"], abs:2 },
  { id:"scopolamine", zh:"scopolamine/hyoscine hydrobromide", brands:["Scopoderm 貼片"], classes:["anticholinergic"], abs:3 },
  { id:"butylscopolamine", zh:"hyoscine butylbromide (butylscopolamine)", brands:["Buscopan 補斯可胖"], classes:["anticholinergic"], abs:2 },
  { id:"benztropine", zh:"benztropine", brands:["Cogentin"], classes:["anticholinergic"], abs:3 },
  { id:"trihexyphenidyl", zh:"trihexyphenidyl", brands:["Artane"], classes:["anticholinergic"], abs:3 },
  // BZD / Z-drug (cns_active;DDI-37 指定成分)
  { id:"alprazolam", zh:"alprazolam", brands:["Xanax 贊安諾"], classes:["benzodiazepine","cns_active"] },
  { id:"diazepam", zh:"diazepam", brands:["Valium"], classes:["benzodiazepine","cns_active"] },
  { id:"lorazepam", zh:"lorazepam", brands:["Ativan 安定文"], classes:["benzodiazepine","cns_active"] },
  { id:"midazolam", zh:"midazolam", brands:["Dormicum 導眠靜"], classes:["benzodiazepine","cns_active"] },
  { id:"triazolam", zh:"triazolam", brands:["Halcion 酣樂欣"], classes:["benzodiazepine","cns_active"] },
  { id:"clonazepam", zh:"clonazepam", brands:["Rivotril"], classes:["benzodiazepine","cns_active"] },
  { id:"estazolam", zh:"estazolam", brands:["Eurodin 悠樂丁"], classes:["benzodiazepine","cns_active"] },
  { id:"zolpidem", zh:"zolpidem", brands:["Stilnox 使蒂諾斯"], classes:["zdrug","cns_active"] },
  { id:"zopiclone", zh:"zopiclone", brands:["Imovane"], classes:["zdrug","cns_active"] },
  // 抗精神病 (cns_active)
  { id:"haloperidol", zh:"haloperidol", brands:["Haldol"], classes:["antipsychotic","cns_active"] },
  { id:"quetiapine", zh:"quetiapine", brands:["Seroquel 思樂康"], classes:["antipsychotic","cns_active","anticholinergic"], abs:3 },
  { id:"risperidone", zh:"risperidone", brands:["Risperdal 理思必妥"], classes:["antipsychotic","cns_active"] },
  { id:"olanzapine", zh:"olanzapine", brands:["Zyprexa 金普薩"], classes:["antipsychotic","cns_active","anticholinergic"], abs:3 },
  { id:"sulpiride", zh:"sulpiride", brands:["Dogmatyl"], classes:["antipsychotic","cns_active"] },
  // PDE5 抑制劑
  { id:"sildenafil", zh:"sildenafil", brands:["Viagra 威而鋼","Revatio"], classes:["pde5_inhibitor"] },
  { id:"tadalafil", zh:"tadalafil", brands:["Cialis 犀利士","Adcirca"], classes:["pde5_inhibitor"] },
  { id:"vardenafil", zh:"vardenafil", brands:["Levitra 樂威壯"], classes:["pde5_inhibitor"] },
  { id:"avanafil", zh:"avanafil", brands:["Stendra"], classes:["pde5_inhibitor"] },
  // 硝酸鹽
  { id:"nitroglycerin", zh:"nitroglycerin (NTG)", brands:["Nitrostat","Nitroderm TTS"], classes:["nitrate"] },
  { id:"isosorbide-dinitrate", zh:"isosorbide dinitrate", brands:["Isordil"], classes:["nitrate"] },
  { id:"isosorbide-mononitrate", zh:"isosorbide mononitrate", brands:["Imdur"], classes:["nitrate"] },
  // Tamoxifen
  { id:"tamoxifen", zh:"tamoxifen", brands:["Nolvadex"], classes:[] },
  // 麥角
  { id:"ergotamine", zh:"ergotamine", brands:["Cafergot 加非葛"], classes:["ergot"] },
  { id:"dihydroergotamine", zh:"dihydroergotamine", brands:["DHE"], classes:["ergot"] },
  // 其他明確成分
  { id:"methotrexate", zh:"methotrexate", brands:["Trexall"], classes:[] },
  { id:"cimetidine", zh:"cimetidine", brands:["Tagamet"], classes:[] },
  { id:"metronidazole", zh:"metronidazole", brands:["Flagyl"], classes:[] },
  { id:"rifampicin", zh:"rifampicin/rifampin", brands:["Rifadin"], classes:[] },
  { id:"cotrimoxazole", zh:"trimethoprim/sulfamethoxazole (TMP/SMX)", brands:["Baktar","Septrin"], classes:["potassium_sparing"] },
  { id:"trimethoprim", zh:"trimethoprim", brands:[], classes:["potassium_sparing"] },
  // b2-agonist (potassium_reducing)
  { id:"salbutamol", zh:"salbutamol/albuterol", brands:["Ventolin 泛得林"], classes:["b2_agonist","potassium_reducing"] },
  { id:"salmeterol", zh:"salmeterol", brands:["Serevent"], classes:["b2_agonist","potassium_reducing"] },
  { id:"formoterol", zh:"formoterol", brands:["Oxis"], classes:["b2_agonist","potassium_reducing"] },
  { id:"terbutaline", zh:"terbutaline", brands:["Bricanyl"], classes:["b2_agonist","potassium_reducing"] },

  // ===== 抗膽鹼藥擴充 (Yamada 2023 ABS 量表, DDI-57 用 ABS>=2 計數) =====
  // abs = Yamada muscarinic-binding 抗膽鹼負擔分數 (3=明顯, 2=中度)
  // ABS 3
  { id:"promethazine", zh:"promethazine", brands:["Phenergan 非那根"], classes:["anticholinergic"], abs:3 },
  { id:"cyproheptadine", zh:"cyproheptadine", brands:["Periactin"], classes:["anticholinergic"], abs:3 },
  { id:"dicyclomine", zh:"dicyclomine/dicycloverine", brands:["Bentyl"], classes:["anticholinergic"], abs:3 },
  { id:"hyoscyamine", zh:"hyoscyamine", brands:["Levsin"], classes:["anticholinergic"], abs:3 },
  { id:"fesoterodine", zh:"fesoterodine", brands:["Toviaz"], classes:["anticholinergic"], abs:3 },
  { id:"darifenacin", zh:"darifenacin", brands:["Enablex"], classes:["anticholinergic"], abs:3 },
  { id:"propiverine", zh:"propiverine", brands:["BUP-4"], classes:["anticholinergic"], abs:3 },
  { id:"atropine", zh:"atropine", brands:["Atropine"], classes:["anticholinergic"], abs:3 },
  { id:"biperiden", zh:"biperiden", brands:["Akineton"], classes:["anticholinergic"], abs:3 },
  { id:"clozapine", zh:"clozapine", brands:["Clozaril 可致律"], classes:["antipsychotic","cns_active","anticholinergic"], abs:3 },
  // ABS 2
  { id:"chlorpromazine", zh:"chlorpromazine", brands:["Wintermin 溫特敏"], classes:["antipsychotic","cns_active","anticholinergic"], abs:2 },
  { id:"prochlorperazine", zh:"prochlorperazine", brands:["Novamin"], classes:["antipsychotic","anticholinergic"], abs:2 },
  { id:"dimenhydrinate", zh:"dimenhydrinate", brands:["Dramamine 暈車藥"], classes:["anticholinergic"], abs:2 },
  { id:"amoxapine", zh:"amoxapine", brands:["Asendin"], classes:["other_antidep","cns_active","anticholinergic"], abs:2 },
  { id:"maprotiline", zh:"maprotiline", brands:["Ludiomil"], classes:["other_antidep","cns_active","anticholinergic"], abs:2 },
  // 吸入/局部劑型: Yamada 有評分但全身性中樞負擔低,依決策【不納入 DDI-57 計數】(故不給 anticholinergic 類別,僅記錄 abs 供參考)
  { id:"tiotropium", zh:"tiotropium (吸入)", brands:["Spiriva 適喘樂"], classes:[], abs:2, route:"inhaled" },
  { id:"ipratropium", zh:"ipratropium (吸入)", brands:["Atrovent"], classes:[], abs:2, route:"inhaled" },
  // β3 促效劑 (膀胱過動症): Yamada muscarinic 結合評 ABS2,但臨床上為抗膽鹼「替代藥」,依決策【刻意不納入 DDI-57 計數】
  { id:"mirabegron", zh:"mirabegron (β3 促效劑)", brands:["Betmiga 貝坦利"], classes:[], abs:2,
    note:"備註:Yamada ABS2,但 mirabegron 為 β3 促效劑,臨床上正是用來取代抗膽鹼藥治療膀胱過動症,故刻意不計入抗膽鹼負擔。" },
  { id:"vibegron", zh:"vibegron (β3 促效劑)", brands:["Gemtesa"], classes:[], abs:2,
    note:"備註:同 mirabegron,β3 促效劑,刻意不計入抗膽鹼負擔。" },
];

if (typeof module !== "undefined") module.exports = { DRUGS, CLASS_TREE };
