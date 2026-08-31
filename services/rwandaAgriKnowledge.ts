export interface RwandaCropProfile {
  id: string;
  nameRw: string;
  nameEn: string;
  category: 'Cereals' | 'Legumes' | 'Roots & Tubers' | 'Cash & Export' | 'Vegetables & Fruits' | 'Bananas';
  icon: string;
  suitableDistricts: string[];
  altitudeRange: string;
  seasons: {
    seasonA?: string;
    seasonB?: string;
    seasonC?: string;
  };
  certifiedVarieties: {
    name: string;
    description: string;
    yieldPotential: string;
    maturityDays: string;
  }[];
  fertilizerGuide: {
    basal: string; // DAP / NPK
    topDressing: string; // Urea
    organicManure: string;
    limeNeeded: boolean;
  };
  spacingAndSeedRate: {
    seedRateKgHa: string;
    spacing: string;
  };
  waterAndClimate: {
    waterNeed: 'Low' | 'Moderate' | 'High';
    soilMoistureMin: number;
    optimalTemp: string;
  };
  pestsAndDiseases: {
    nameRw: string;
    nameEn: string;
    symptoms: string;
    treatmentRw: string;
    treatmentEn: string;
    preventative: string;
  }[];
  postHarvestAndStorage: {
    safeMoisturePercentage: string;
    tipsRw: string;
    tipsEn: string;
  };
}

export interface InstitutionalNewsItem {
  id: string;
  institution: 'MINAGRI' | 'RAB' | 'METEO RWANDA' | 'NAIS';
  titleRw: string;
  titleEn: string;
  date: string;
  category: 'Advisory' | 'Subsidies' | 'Weather Warning' | 'Pest Alert' | 'Policy';
  summaryRw: string;
  summaryEn: string;
  actionableRw: string;
  actionableEn: string;
  officialLink: string;
  badgeColor: string;
}

export const RWANDA_INSTITUTIONS = {
  MINAGRI: {
    nameRw: "Minisiteri y'Ubuhinzi n'Ubworozi",
    nameEn: "Ministry of Agriculture and Animal Resources",
    hotline: "1221",
    ussd: "*774#",
    website: "https://www.minagri.gov.rw",
    keyPrograms: [
      "Smart Nkunganire System (SNS) - Ifumbire n'imbuto zunganiwe na Leta",
      "NAIS (Tekana Urishingiwe) - Bwishingizi bw'ibihingwa n'amatungo (85% yishyurwa na Leta)",
      "PSTA 5 - Gahunda y'Iterambere ry'Ubuhinzi n'Ubworozi mu Rwanda",
      "Gushyira Ishwagara mu Butaka Busarira (Nyamagabe, Nyaruguru, Karongi, Rutsiro, Gicumbi)"
    ]
  },
  RAB: {
    nameRw: "Ikigo cy'Igihugu Gishinzwe Iterambere ry'Ubuhinzi n'Ubworozi",
    nameEn: "Rwanda Agriculture and Animal Resources Development Board",
    hotline: "4455",
    website: "https://www.rab.gov.rw",
    keyPrograms: [
      "Imbuto z'indobanure zujuje ubuziranenge (Certified Seeds)",
      "Kwirinda no kurwanya Nkongwa idasanzwe (Fall Armyworm) na Kirabiranya (BXW)",
      "Amashuri y'Abahinzi mu Mirima (Farmer Field Schools - FFS)",
      "Gahunda yo gutera imiti ku myaka n'ibishanga by'umuceri"
    ]
  },
  METEO_RWANDA: {
    nameRw: "Ikigo cy'Igihugu cy'Iteganyagihe mu Rwanda",
    nameEn: "Rwanda Meteorology Agency",
    hotline: "4322",
    website: "https://www.meteorwanda.gov.rw",
    keyPrograms: [
      "Iteganyagihe ry'iminsi 10 (Dekadal Agrometeorological Bulletins)",
      "Iteganyagihe ry'igihembwe cy'ihinga (Seasonal Climate Forecasts)",
      "Iburira ry'ibiza by'imvura idasanzwe, umuyaga n'inkangu",
      "Sitasiyo 30 z'ikirere zikwirakwije mu turere twose tw'igihugu"
    ]
  }
};

export const RWANDA_CROPS_DATABASE: RwandaCropProfile[] = [
  {
    id: 'maize',
    nameRw: 'Ibigori',
    nameEn: 'Maize / Corn',
    category: 'Cereals',
    icon: '🌽',
    suitableDistricts: ['Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Rwamagana', 'Bugesera', 'Musanze', 'Ruhango', 'Nyanza', 'Gisagara', 'Rubavu'],
    altitudeRange: '1,200m - 2,000m',
    seasons: {
      seasonA: 'Nzeri – Ukwakira (September – October)',
      seasonB: 'Gashyantare – Werurwe (February – March)',
      seasonC: 'Kamena – Nyakanga mu bishanga bifite kuhira'
    },
    certifiedVarieties: [
      { name: 'SC 637 / SC 403', description: 'Imbuto yihanganira amapfa n\'ubushyuhe, itanga umusaruro mwinshi mu burasirazuba.', yieldPotential: '6.0 - 7.5 T/Ha', maturityDays: '120 - 135 iminsi' },
      { name: 'PAN 53 / PAN 12', description: 'Ibigori byiza by\'imisozi yo hagati n\'iy\'amajyaruguru, bifite ibihingwa bikomeye.', yieldPotential: '5.5 - 7.0 T/Ha', maturityDays: '130 - 145 iminsi' },
      { name: 'RHM 1407 / RHM 104', description: 'Imbuto yakorewe mu Rwanda na RAB, yihanganira indwara z\'amababi n\'ubushyuhe.', yieldPotential: '6.0 - 8.0 T/Ha', maturityDays: '125 - 140 iminsi' },
      { name: 'Pool 8A', description: 'Imbuto ifunguye (OPV) ikunzwe mu turere tw\'uburasirazuba.', yieldPotential: '4.0 - 5.0 T/Ha', maturityDays: '110 - 120 iminsi' }
    ],
    fertilizerGuide: {
      basal: 'DAP (100 kg/Ha) cyangwa NPK 17-17-17 (150 kg/Ha) ishyirwa mu mwobo mbere yo gutera imbuto.',
      topDressing: 'UREA (100 kg/Ha) ishyirwa mu butaka buhehereye igihe ibigori bimaze kugira amababi 6-8 (iminsi 30-35 nyuma yo gutera).',
      organicManure: 'Itoni 10 kugeza kuri 20/Ha z\'ifumbire y\'imborera iboze neza.',
      limeNeeded: true
    },
    spacingAndSeedRate: {
      seedRateKgHa: '25 kg/Ha (imbuto 1 cyangwa 2 mu mwobo)',
      spacing: '75 cm hagati y\'imirongo na 25 cm cyangwa 50 cm hagati y\'imyobo'
    },
    waterAndClimate: {
      waterNeed: 'Moderate',
      soilMoistureMin: 55,
      optimalTemp: '18°C - 30°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Nkongwa idasanzwe (Fall Armyworm)',
        nameEn: 'Fall Armyworm (Spodoptera frugiperda)',
        symptoms: 'Imyobo mu mababi y\'ibigori ameze nk\'ayarashe amasasu, imyanda y\'umukara mu mutima w\'ikigori.',
        treatmentRw: 'Tera umuti wemewe na RAB nka Emamectin Benzoate (Rocket, Prove, Titan, Delegate) kare mu gitondo cyangwa ku gicamunsi mu mutima w\'ikigori.',
        treatmentEn: 'Apply approved insecticide (Emamectin benzoate, Chlorantraniliprole) directed into the whorl early morning or late evening.',
        preventative: 'Gusuzuma umurima kabiri mu cyumweru, gutera ku gihe kimwe n\'abaturanyi, guhinga uruvange na desmodium (Push-Pull).'
      },
      {
        nameRw: 'Icyorezo cy\'Ibigori (Maize Lethal Necrosis - MLND)',
        nameEn: 'Maize Lethal Necrosis Disease',
        symptoms: 'Amababi ahinduka umuhondo akumira ku mpera, ikigori kikagwingira kikitanga insina.',
        treatmentRw: 'Kurandura no gutwika ibiti byafashwe byose, kurwanya uburukidonge n\'utunyamatwi.',
        treatmentEn: 'Rogue and burn infected plants immediately; control vector vectors (thrips/aphids).',
        preventative: 'Gukoresha imbuto z\'indobanure zujuje ubuziranenge gusa zaturutse kuri RAB/Nkunganire.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Munsi ya 13.5%',
      tipsRw: 'Anika ku mashitingi n\'ibiti (hangars/cribs) kugira ngo birinde Aflatoxin (uruhumbu). Shyira mu mifuka ya Hermetic (PICS bags) idakenera imiti.',
      tipsEn: 'Dry on tarpaulins to <13.5% moisture to prevent aflatoxin contamination. Store in hermetic PICS bags.'
    }
  },
  {
    id: 'irish_potatoes',
    nameRw: 'Ibirayi',
    nameEn: 'Irish Potatoes',
    category: 'Roots & Tubers',
    icon: '🥔',
    suitableDistricts: ['Musanze', 'Nyabihu', 'Rubavu', 'Burera', 'Gicumbi', 'Nyamagabe', 'Nyaruguru', 'Rutsiro'],
    altitudeRange: '1,800m - 2,600m',
    seasons: {
      seasonA: 'Nzeri – Mutarama (September – January)',
      seasonB: 'Gashyantare – Kamena (February – June)',
      seasonC: 'Nyakanga – Nzeri mu bishanga byo mu misozi miremire'
    },
    certifiedVarieties: [
      { name: 'Kinigi', description: 'Imbuto y\'umwimerere y\'u Rwanda, iryoha cyane, ikunzwe ku isoko no gukora ifiriti.', yieldPotential: '25 - 35 T/Ha', maturityDays: '110 - 125 iminsi' },
      { name: 'Cruza', description: 'Yihanganira cyane ikirere cy\'imvura n\'indwara y\'ikibagarira, ikunzwe mu biribwa by\'ingo.', yieldPotential: '28 - 40 T/Ha', maturityDays: '100 - 115 iminsi' },
      { name: 'Victoria', description: 'Ibirayi byera kare, bitanga umusaruro ushimishije mu gihe gito.', yieldPotential: '20 - 30 T/Ha', maturityDays: '90 - 105 iminsi' },
      { name: 'Kirundo / Mabondo', description: 'Ibirayi by\'ibara ryera n\'umutuku bishobora guhingwa mu misozi ihanamye.', yieldPotential: '22 - 32 T/Ha', maturityDays: '105 - 120 iminsi' }
    ],
    fertilizerGuide: {
      basal: 'NPK 17-17-17 (300 kg/Ha) ishyirwa mu miyoboro mbere yo gutera imbuto.',
      topDressing: 'UREA (50 - 75 kg/Ha) igihe cyo kubagara bwa mbere no gusasira (hilling up).',
      organicManure: 'Itoni 20 kugeza kuri 30/Ha z\'imborera isesuye neza.',
      limeNeeded: true
    },
    spacingAndSeedRate: {
      seedRateKgHa: '2,000 - 2,500 kg/Ha (imbuto ifite ingemwe 3-4)',
      spacing: '75 cm hagati y\'imirongo na 30 cm hagati y\'ibirayi'
    },
    waterAndClimate: {
      waterNeed: 'High',
      soilMoistureMin: 65,
      optimalTemp: '15°C - 20°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Umusonga w\'Ibirayi / Ikibagarira (Late Blight)',
        nameEn: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Amabara y\'ikigina n\'umukara ku mababi afite uruhu rwera munsi mu gihe cy\'ubushuhe n\'ibicu.',
        treatmentRw: 'Tera Mancozeb 80WP (mu kwirinda) cyangwa Ridomil Gold / Acrobat (mu kuvura) buri minsi 7-10 mu gihe cy\'imvura.',
        treatmentEn: 'Preventative Mancozeb 80WP, curative systemic fungicide (Ridomil Gold / Metalaxyl + Mancozeb) every 7-10 days.',
        preventative: 'Gukoresha imbuto zifite ubudahangarwa nka Cruza, gutera ku ndiba no kubagara neza.'
      },
      {
        nameRw: 'Ububore bw\'ibirayi mu butaka (Bacterial Wilt)',
        nameEn: 'Bacterial Wilt (Ralstonia solanacearum)',
        symptoms: 'Ikirayi kirarabirana kikitwikira amababi kikiri icyatsi, igitumbwe kikazamo amashyira y\'umweru.',
        treatmentRw: 'Nta muti uvura mu butaka. Kurandura ibirwaye, kurindira imyaka 3 utahahinze ibirayi cyangwa inyanya.',
        treatmentEn: 'No chemical cure. Practice 3-year crop rotation with maize/beans, sanitize farm tools.',
        preventative: 'Gukoresha imbuto zizewe gusa ziturutse muri RAB n\'abayobozi b\'imbuto bunganirwa.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Guhumeka no gukomera (Curing)',
      tipsRw: 'Reka ibirayi bibe mu butaka iminsi 10-14 nyuma yo guca amababi (dehaulming) kugira ngo uruhu rukomere. Bika ahantu hijimye, hafutse hafite umwuka mwiza.',
      tipsEn: 'Dehaulm 10-14 days before harvest to harden skins. Store in diffused light stores (DLS) with good ventilation.'
    }
  },
  {
    id: 'beans',
    nameRw: 'Ibishyimbo',
    nameEn: 'Beans (Climbing & Bush)',
    category: 'Legumes & Pulses',
    icon: '🫘',
    suitableDistricts: ['Gicumbi', 'Musanze', 'Burera', 'Rulindo', 'Gakenke', 'Nyamagabe', 'Nyaruguru', 'Huye', 'Muhanga', 'Ngoma', 'Kirehe', 'Gatsibo'],
    altitudeRange: '1,300m - 2,300m',
    seasons: {
      seasonA: 'Nzeri – Ukwakira (September – October)',
      seasonB: 'Gashyantare – Werurwe (February – March)',
      seasonC: 'Kamena mu bishanga bikama'
    },
    certifiedVarieties: [
      { name: 'RWV 1129 / RWV 2070 (Umukororombya)', description: 'Ibishyimbo by\'imikore bikungahaye ku Butare (Iron-biofortified), bitanga umusaruro urenze.', yieldPotential: '3.5 - 5.0 T/Ha', maturityDays: '90 - 110 iminsi' },
      { name: 'MAC 44 / CAB 19', description: 'Ibishyimbo by\'imikore byiza cyane mu misozi miremire n\'amaterasi.', yieldPotential: '3.0 - 4.5 T/Ha', maturityDays: '100 - 120 iminsi' },
      { name: 'RWR 2245 / RWR 2154 (Urubwiza - Bush)', description: 'Ibishyimbo by\'ibihuru bitagira imikore, byera kare kandi byihanganira amapfa.', yieldPotential: '2.0 - 3.0 T/Ha', maturityDays: '75 - 85 iminsi' },
      { name: 'Gasirida', description: 'Ibishyimbo biryoha cyane kandi byihanganira indwara z\'amababi.', yieldPotential: '2.5 - 3.5 T/Ha', maturityDays: '85 - 95 iminsi' }
    ],
    fertilizerGuide: {
      basal: 'DAP (100 kg/Ha) cyangwa NPK 17-17-17 (100 kg/Ha). Ibishyimbo byongera Azote mu butaka (Nitrogen fixation).',
      topDressing: 'Nta Urea ikenerwa cyane; ushobora gutera ifumbire y\'amazi (Foliar fertilizer) ifite Zinc na Boron igihe cy\'indabyo.',
      organicManure: 'Itoni 10/Ha z\'imborera isukuye.',
      limeNeeded: true
    },
    spacingAndSeedRate: {
      seedRateKgHa: 'Umukororombya: 50-60 kg/Ha; Ibihuru: 70-80 kg/Ha',
      spacing: 'Umukororombya: 50 cm x 20 cm; Ibihuru: 40 cm x 20 cm'
    },
    waterAndClimate: {
      waterNeed: 'Moderate',
      soilMoistureMin: 50,
      optimalTemp: '16°C - 24°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Uruhara / Anthracnose y\'ibishyimbo',
        nameEn: 'Bean Anthracnose (Colletotrichum lindemuthianum)',
        symptoms: 'Amabara y\'umukara mu mitsi y\'amababi no ku bishogabaliko, imbuto zikagira amabara y\'ikigina.',
        treatmentRw: 'Tera umuti wica uduhumyo nka Mancozeb cyangwa Copper Oxychloride ku minsi 21 nyuma yo gutera.',
        treatmentEn: 'Apply Mancozeb or Copper Oxychloride at flowering and pod setting stages.',
        preventative: 'Koresha imbuto zatewe umuti (seed dressing with Thiram), gukoresha imiti yica uduhumyo.'
      },
      {
        nameRw: 'Isazi y\'ibishyimbo (Bean Fly / Ophiomyia)',
        nameEn: 'Bean Stem Maggot / Bean Fly',
        symptoms: 'Ibiti bito by\'ibishyimbo biruma bikananyuka ku ndiba, bigacika intege bikuma.',
        treatmentRw: 'Kuvura imbuto mbere yo gutera na Imidacloprid cyangwa gutera Cypermethrin ibishyimbo bikimara kumera.',
        treatmentEn: 'Seed dressing with imidacloprid; foliar spray with cypermethrin 7-14 days after emergence.',
        preventative: 'Gutwikira ubutaka (mulching) no gutera ku gihe imvura ikitangira.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Munsi ya 13.0%',
      tipsRw: 'Anika ku mashitingi kugeza igihe imbuto idondotse ku ryinyo. Shyira mu mifuka ya PICS kugira ngo wirinde udukoko tw\'ubuhungiro (Bruchilds / Imungu).',
      tipsEn: 'Dry until seed moisture is below 13%. Store in triple-layer PICS bags to protect against bruchid weevils.'
    }
  },
  {
    id: 'rice',
    nameRw: 'Umuceri',
    nameEn: 'Paddy Rice',
    category: 'Cereals',
    icon: '🌾',
    suitableDistricts: ['Bugarama (Rusizi)', 'Nyagatare', 'Gatsibo', 'Bugesera', 'Rwamagana', 'Gisagara', 'Huye', 'Kirehe'],
    altitudeRange: '900m - 1,500m (Ibishanga n\'imibande yubatsweho imiyoboro)',
    seasons: {
      seasonA: 'Nzeri – Mutarama (September – January)',
      seasonB: 'Gashyantare – Nyakanga (February – July)',
      seasonC: 'Urugendo rwo gusimburanya n\'imboga'
    },
    certifiedVarieties: [
      { name: 'Basmati 370 / Basmati Pusa', description: 'Umuceri ufite impumuro nziza cyane, ugurishwa ku giciro cyo hejuru ku isoko.', yieldPotential: '4.5 - 6.0 T/Ha', maturityDays: '120 - 135 iminsi' },
      { name: 'WAT 1395 / Gakire', description: 'Umuceri mwiza cyane utanga umusaruro mwinshi mu bishanga binini bya Bugarama na Rwamagana.', yieldPotential: '6.5 - 8.5 T/Ha', maturityDays: '130 - 145 iminsi' },
      { name: 'Facagro / Intsindagirabigori', description: 'Yihanganira ubukonje n\'indwara y\'Icyozi cy\'umuceri (Rice Blast).', yieldPotential: '5.5 - 7.5 T/Ha', maturityDays: '135 - 150 iminsi' }
    ],
    fertilizerGuide: {
      basal: 'NPK 17-17-17 (150 kg/Ha) + DAP (50 kg/Ha) igihe cyo gutera ingemwe mu butaka.',
      topDressing: 'UREA (150 kg/Ha) igabanyijwemo kabiri: igice cya 1 ku minsi 21 nyuma yo gutera, igice cya 2 igihe cyo gutangira kurabya.',
      organicManure: 'Itoni 10/Ha cyangwa ibisigazwa by\'umuceri byaboze.',
      limeNeeded: false
    },
    spacingAndSeedRate: {
      seedRateKgHa: '30 - 40 kg/Ha mu buhumbikiro (nursery bed)',
      spacing: '20 cm x 20 cm (ingemwe 2 cyangwa 3 ku mwobo)'
    },
    waterAndClimate: {
      waterNeed: 'High',
      soilMoistureMin: 90,
      optimalTemp: '22°C - 32°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Icyozi cy\'Umuceri (Rice Blast)',
        nameEn: 'Rice Blast (Pyricularia oryzae)',
        symptoms: 'Amabara ameze nk\'ijisho ku mababi no mu masoko y\'impeke, amatungo agacika intege agahinduka umweru.',
        treatmentRw: 'Tera Tricyclazole (Beam 75WP) cyangwa Isoprothiolane igihe ubonye ibimenyetso bya mbere.',
        treatmentEn: 'Apply Tricyclazole 75WP or Azoxystrobin fungicide at early leaf symptom stage.',
        preventative: 'Kugabanya ifumbire ya Azote irenze urugero, gucunga neza urugero rw\'amazi mu gishanga.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: '12.5% - 13.0%',
      tipsRw: 'Kwanika buhoro buhoro ku zuba riciriritse ku mashitingi kugira ngo umuceri utavunika igihe uzaba uri gusyirwa mu nganda.',
      tipsEn: 'Gradual sun-drying on tarpaulins to 13% moisture to avoid grain cracking during milling.'
    }
  },
  {
    id: 'coffee',
    nameRw: 'Ikawa',
    nameEn: 'Arabica Coffee',
    category: 'Cash & Export',
    icon: '☕',
    suitableDistricts: ['Huye', 'Nyanza', 'Muhanga', 'Kamonyi', 'Gakenke', 'Rulindo', 'Rubavu', 'Rutsiro', 'Karongi', 'Nyamasheke', 'Rusizi', 'Ngoma', 'Kirehe'],
    altitudeRange: '1,400m - 2,200m (Highland Specialty Arabica)',
    seasons: {
      seasonA: 'Gupangura no gutera ifumbire (Nzeri – Ugushyingo)',
      seasonB: 'Isarura ry\'ikawa itukura (Werurwe – Kamena)',
      seasonC: 'Gusasira no gukorera amashami (Nyakanga – Kanama)'
    },
    certifiedVarieties: [
      { name: 'Jackson 2/1257 / Bourbon Mayaguez', description: 'Ikawa ya Arabica ifite uburyohe bwa mbere ku isoko mpuzamahanga (Specialty Coffee).', yieldPotential: '1.5 - 2.5 T/Ha ikawa yumye', maturityDays: 'Ibiti biramba imyaka 30+' },
      { name: 'BM 139 / POP 3303', description: 'Yihanganira indwara ya Coffee Leaf Rust n\'uburebure bw\'imisozi y\'u Rwanda.', yieldPotential: '2.0 - 3.0 T/Ha', maturityDays: 'Ibiti biramba' }
    ],
    fertilizerGuide: {
      basal: 'NPK 22-6-12 cyangwa NPK 17-17-17 (250g - 300g kuri buri giti) mu gitondo cy\'imvura y\'umuhindo n\'iy\'itumba.',
      topDressing: 'UREA (100g kuri buri giti) mu gihe cyo gukuza ibitumbwe.',
      organicManure: 'Ibiro 20 - 30 by\'ifumbire y\'imborera yaboze neza kuri buri giti buri mwaka.',
      limeNeeded: true
    },
    spacingAndSeedRate: {
      seedRateKgHa: 'Ibiti 2,500 kugeza ku 3,333 kuri Hegitari',
      spacing: '2.5m x 1.5m cyangwa 2m x 2m'
    },
    waterAndClimate: {
      waterNeed: 'Moderate',
      soilMoistureMin: 60,
      optimalTemp: '18°C - 24°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Inyenzi y\'Ikawa (Coffee Berry Borer - CBB)',
        nameEn: 'Coffee Berry Borer (Hypothenemus hampei)',
        symptoms: 'Akatobora gato ku ndiba y\'igitumbwe cy\'ikawa, imbere ikawa ikaba yarariwe ikagira ifu.',
        treatmentRw: 'Gutoragura imyero yose yaguye hasi (Sanitation), gushyiraho imitego ya Brocap itega inyenzi ikoresheje inzoga ya Alukolo.',
        treatmentEn: 'Strict strip-picking of remaining cherries; deploy alcohol-baited Brocap traps.',
        preventative: 'Gupangura amashami kugira ngo izuba n\'umuyaga binjire neza mu giti.'
      },
      {
        nameRw: 'Uruhumbu rw\'Amababi (Coffee Leaf Rust)',
        nameEn: 'Coffee Leaf Rust (Hemileia vastatrix)',
        symptoms: 'Amabara y\'ifu y\'umuhondo n\'ironji munsi y\'amababi y\'ikawa, amababi agahunguka igiti kigasigara cyambaye ubusa.',
        treatmentRw: 'Tera umuti wa Copper Oxychloride 50WP cyangwa Bayleton mbere y\'uko imvura nyinshi itangira.',
        treatmentEn: 'Foliar spray with Copper Oxychloride or Triadimefon before peak rainy season.',
        preventative: 'Gusasira neza no gushyira ifumbire ku gipimo gikwiye.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: '10.5% - 11.5% (Ikawa y\'ibishishwa - Parchment)',
      tipsRw: 'Kugeza ikawa itukura ku ruganda ruyitunganya (Coffee Washing Station - CWS) mu masaha atarenze 8 isaruwe. Kuyanika ku ntebe z\'umuyaga (raised African beds).',
      tipsEn: 'Deliver ripe red cherries to washing station within 8 hours. Dry parchment on raised African drying beds to 11% moisture.'
    }
  },
  {
    id: 'banana',
    nameRw: 'Ibitoki / Insina',
    nameEn: 'Cooking & Dessert Bananas (Matooke)',
    category: 'Bananas',
    icon: '🍌',
    suitableDistricts: ['Ngoma', 'Kirehe', 'Rwamagana', 'Gatsibo', 'Kayonza', 'Gakenke', 'Rulindo', 'Muhanga', 'Kamonyi', 'Rubavu', 'Huye'],
    altitudeRange: '1,300m - 1,900m',
    seasons: {
      seasonA: 'Igihe cyiza cyo gutera ingemwe z\'insina (Nzeri – Ugushyingo)',
      seasonB: 'Gukorera no gusasira urutoki (Gashyantare – Mata)',
      seasonC: 'Gufata amazi n\'amaterasi mu mpeshyi'
    },
    certifiedVarieties: [
      { name: 'Injagi / Mpologoma (Ibitoki byo guteka)', description: 'Insina zera ibitoki binini cyane, biryoha kandi byifashishwa mu birori n\'isoko.', yieldPotential: '30 - 50 T/Ha/Umwaka', maturityDays: 'Isarura rihoraho' },
      { name: 'FHIA 17 & FHIA 25', description: 'Insina zifite ubudahangarwa bwo hejuru ku ndwara ya Kirabiranya n\'imvura nkeya.', yieldPotential: '40 - 60 T/Ha', maturityDays: 'Isarura rihoraho' },
      { name: 'Igisubi / Intuntu (Inzoga n\'Umutobe)', description: 'Ibitoki by\'umwimerere bikorwamo umutobe n\'urwagwa rwa kinyarwanda.', yieldPotential: '25 - 35 T/Ha', maturityDays: 'Isarura rihoraho' }
    ],
    fertilizerGuide: {
      basal: 'Ibiro 30 - 50 by\'ifumbire y\'imborera iboze mu mwobo wa 90cm x 90cm x 90cm mbere yo gutera.',
      topDressing: 'NPK 17-17-17 (200g ku kimera) buri mezi 6 hamwe n\'ifumbire y\'ivu (Potassium rich ash).',
      organicManure: 'Gusasira urutoki hose n\'ibyatsi byumye cyangwa ibishishwa by\'ikawa.',
      limeNeeded: false
    },
    spacingAndSeedRate: {
      seedRateKgHa: 'Insina 1,111 kugeza ku 1,666 kuri Hegitari',
      spacing: '3m x 3m cyangwa 3m x 2m'
    },
    waterAndClimate: {
      waterNeed: 'High',
      soilMoistureMin: 70,
      optimalTemp: '20°C - 28°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Kirabiranya y\'Insina (Banana Xanthomonas Wilt - BXW)',
        nameEn: 'Banana Xanthomonas Wilt',
        symptoms: 'Amababi ahinduka umuhondo akumira ku mashami, igitoki kikarinduka kigitoya kikarura, ikijumba cyasatuye kigasohora amashyira y\'umuhondo.',
        treatmentRw: 'Kurandura insina irwaye ku ndiba (SDSR technique), guca umwanana (male bud) ukoresheje igiti cy\'ingobe, no kutazana ibyuma byakoreshejwe ahandi utabitwitse ku muriro cyangwa ngo ubisukure na Javel.',
        treatmentEn: 'Single Diseased Stem Removal (SDSR), debudding male flowers with forked stick, sterilize tools with fire or bleach.',
        preventative: 'Gukuraho umwanana ku gihe izuba rigisohoka, gukorera urutoki kenshi.'
      },
      {
        nameRw: 'Icyonnyi cy\'Imbunda y\'Insina (Banana Weevil / Imungu)',
        nameEn: 'Banana Weevil Borer (Cosmopolites sordidus)',
        symptoms: 'Imyobo n\'imiyoboro mu gishyitsi cy\'insina munsi y\'ubutaka, insina ikarandurwa n\'umuyaga woroheje.',
        treatmentRw: 'Gushyiraho imitego y\'ibiti by\'insina bisatuye mu murima, gusukura ingemwe mbere yo kuzitera (parring).',
        treatmentEn: 'Paring and hot-water treatment of suckers; deploy split pseudostem traps.',
        preventative: 'Gukoresha ingemwe zizewe ziturutse muri laboratory (Tissue culture).'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Gucunga ubukonje',
      tipsRw: 'Guca igitoki kitaragwa hasi, kukirinda gukoboka, kugitwara ku mashitingi acukuye neza kugira ngo kitabora mbere yo kugera ku isoko.',
      tipsEn: 'Harvest carefully without bruising; transport on padded trucks to maintain fresh market value.'
    }
  },
  {
    id: 'cassava',
    nameRw: 'Imyumbati',
    nameEn: 'Cassava',
    category: 'Roots & Tubers',
    icon: '🪵',
    suitableDistricts: ['Bugesera', 'Ruhango', 'Kamonyi', 'Muhanga', 'Nyanza', 'Gisagara', 'Kayonza', 'Gatsibo', 'Kirehe', 'Rwamagana', 'Rusizi', 'Nyamasheke'],
    altitudeRange: '1,000m - 1,700m',
    seasons: {
      seasonA: 'Nzeri – Ugushyingo (September – November)',
      seasonB: 'Gashyantare – Mata (February – April)',
      seasonC: 'Gufata ingeri n\'imbuto'
    },
    certifiedVarieties: [
      { name: 'Gahene / Ndamirabana', description: 'Imyumbati yakorewe muri RAB ifite ubudahangarwa bwo hejuru ku ndwara ya Kabore (CBSD) na Ububembe (CMD).', yieldPotential: '25 - 35 T/Ha', maturityDays: 'Miezi 10 - 12' },
      { name: 'Bwanakweli / Mavumbuko', description: 'Imyumbati ifite ifu nyinshi cyane yera (high starch), ikunzwe n\'inganda zitunganya ifu y\'imyumbati (Kinazi Cassava Plant).', yieldPotential: '28 - 40 T/Ha', maturityDays: 'Miezi 11 - 14' }
    ],
    fertilizerGuide: {
      basal: 'NPK 17-17-17 (100 kg/Ha) igihe ubutaka bwashegeshwe cyane.',
      topDressing: 'Potassium Chloride (MOP) 50 kg/Ha ituma ibijumba bikura neza.',
      organicManure: 'Itoni 10/Ha z\'imborera.',
      limeNeeded: false
    },
    spacingAndSeedRate: {
      seedRateKgHa: 'Ingeri 10,000 kuri Hegitari',
      spacing: '1m x 1m (ingeri 1 ifite ubutambike bwa cm 20-25)'
    },
    waterAndClimate: {
      waterNeed: 'Low',
      soilMoistureMin: 35,
      optimalTemp: '22°C - 32°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Kabore y\'Imyumbati (Cassava Brown Streak Disease - CBSD)',
        nameEn: 'Cassava Brown Streak Disease',
        symptoms: 'Amabara y\'umuhondo ku mitsi y\'amababi mato, uduti twijimye ku mababi, no kubora kw\'ibijumba imbere mu butaka bikagira umwobo w\'umukara.',
        treatmentRw: 'Kurandura ingeri n\'ibihingwa byose birwaye, ntugakoreshe ingeri zaturutse mu murima urwaye.',
        treatmentEn: 'Rogue infected plants immediately; plant only certified clean cuttings from RAB.',
        preventative: 'Gukoresha imbuto zizewe nka Gahene na Ndamirabana.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Munsi ya 12% (Ku myumbati yumishijwe - Cossettes)',
      tipsRw: 'Gutonora no kwanika vuba mu minsi 2 isaruwe kugira ngo itahinduka umukara (vascular streaking).',
      tipsEn: 'Process/peel within 48 hours of harvest or dry into clean white cossettes.'
    }
  },
  {
    id: 'vegetables',
    nameRw: 'Imboga n\'Imbuto (Inyanya, Amashu, Karoti, Urusenda)',
    nameEn: 'Horticulture & Vegetables (Tomatoes, Cabbage, Carrots, Chili)',
    category: 'Vegetables & Fruits',
    icon: '🍅',
    suitableDistricts: ['Musanze', 'Rubavu', 'Rulindo', 'Bugesera', 'Gasabo', 'Kicukiro', 'Rwamagana', 'Nyabihu', 'Gicumbi'],
    altitudeRange: '1,300m - 2,400m',
    seasons: {
      seasonA: 'Nzeri – Mutarama',
      seasonB: 'Gashyantare – Kamena',
      seasonC: 'Kamena – Nzeri mu bishanga n\'ahafite kuhira (Gahunda y\'ingenzi)'
    },
    certifiedVarieties: [
      { name: 'Inyanya (Anna F1 / Rambo F1 / Eden F1)', description: 'Inyanya zifite amakoko akomeye, zishobora gutwarwa mu modoka zitangiritse kandi zitanga umusaruro mwinshi.', yieldPotential: '40 - 70 T/Ha', maturityDays: '75 - 90 iminsi nyuma yo gutera' },
      { name: 'Urusenda (Bird\'s Eye Chili / Habanero)', description: 'Urusenda rw\'ubwoko bwo kohereza mu mahanga (Export Quality) rurura cyane.', yieldPotential: '12 - 20 T/Ha', maturityDays: '90 - 120 iminsi' },
      { name: 'Amashu (Gloria F1 / Copenhagen Market)', description: 'Amashu afite imitwe ikomeye cyane, yihanganira indwara z\'amababi.', yieldPotential: '35 - 55 T/Ha', maturityDays: '70 - 85 iminsi' }
    ],
    fertilizerGuide: {
      basal: 'DAP (150 kg/Ha) + NPK 17-17-17 (200 kg/Ha) ishyirwa mu myobo y\'ingemwe.',
      topDressing: 'CAN (100 kg/Ha) cyangwa Calcium Nitrate na Potassium Nitrate mu kuhira (Fertigation).',
      organicManure: 'Itoni 20 kugeza kuri 30/Ha z\'imborera iseye neza.',
      limeNeeded: true
    },
    spacingAndSeedRate: {
      seedRateKgHa: 'Garama 150 - 300 kuri Hegitari mu buhumbikiro',
      spacing: 'Inyanya: 60 cm x 50 cm; Amashu: 50 cm x 50 cm'
    },
    waterAndClimate: {
      waterNeed: 'High',
      soilMoistureMin: 70,
      optimalTemp: '18°C - 26°C'
    },
    pestsAndDiseases: [
      {
        nameRw: 'Kirabiranya y\'Inyanya (Bacterial Wilt) & Ikibagarira (Late Blight)',
        nameEn: 'Tomato Late Blight & Bacterial Wilt',
        symptoms: 'Amababi aruma agashirira, inyanya zikagira amabara y\'ikigina n\'umukara.',
        treatmentRw: 'Gukoresha Ridomil Gold ku kibagarira, gusasira ubutaka no kwirinda kuhira hejuru ku mababi mu masaha y\'umugoroba.',
        treatmentEn: 'Foliar application of Mancozeb / Metalaxyl; drip irrigation to keep foliage dry.',
        preventative: 'Simburanya ibihingwa n\'ibinyampeke cyangwa ibishyimbo.'
      }
    ],
    postHarvestAndStorage: {
      safeMoisturePercentage: 'Gukonjesha (Cold chain)',
      tipsRw: 'Gusarura mu gitondo kare cyangwa ku mugoroba izuba ritari ryinshi. Gupakira mu masanduku y\'ibiti cyangwa plastiki (crates) aho gushyira mu mifuka ihetswe.',
      tipsEn: 'Harvest in cool morning/evening hours; pack into rigid plastic crates rather than overloaded sacks.'
    }
  }
];

export const LATEST_RWANDA_AGRI_NEWS: InstitutionalNewsItem[] = [
  {
    id: 'news-minagri-01',
    institution: 'MINAGRI',
    titleRw: 'Gahunda ya Smart Nkunganire (SNS): Gutanga Ifumbire n\'Imbuto z\'Igihembwe gishya',
    titleEn: 'Smart Nkunganire System (SNS): Seed & Fertilizer Subsidies Rolled Out',
    date: '2026-08-28',
    category: 'Subsidies',
    summaryRw: 'MINAGRI iramenyesha abahinzi bose mu Rwanda ko kwiyandikisha ku ifumbire n\'imbuto zunganiwe byatangiye binyuze kuri USSD *774#. Ifumbire ya DAP, NPK na UREA iraboneka ku giciro kigabanyijeho kugeza kuri 45%.',
    summaryEn: 'MINAGRI announces nationwide input distribution via Smart Nkunganire USSD *774#. Subsidized DAP, NPK, and UREA available at certified agro-dealers.',
    actionableRw: 'Kanda *774# kuri telefone yawe, wemeze umurima wawe n\'ingano y\'ifumbire wifuza, maze wishyure ku mucuruzi w\'inyongeramusaruro (Agro-dealer) ukwegereye.',
    actionableEn: 'Dial *774# on mobile phone, confirm farm voucher code, and collect certified inputs at your nearest agro-dealer.',
    officialLink: 'https://www.minagri.gov.rw',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'news-rab-02',
    institution: 'RAB',
    titleRw: 'Iburira ry\'Indwara y\'Umusonga w\'Ibirayi (Late Blight) mu Misozi y\'Amajyaruguru n\'Iburengerazuba',
    titleEn: 'RAB Pest & Disease Alert: Potato Late Blight Advisory for Northern & Western Highlands',
    date: '2026-08-25',
    category: 'Pest Alert',
    summaryRw: 'RAB iraburira abahinzi b\'ibirayi muri Musanze, Nyabihu, Burera, Rubavu na Gicumbi ko ubushuhe bukabije n\'ibicu byongereye ibyago by\'indwara y\'umusonga w\'ibirayi (Late Blight).',
    summaryEn: 'RAB cautions potato farmers across high-altitude districts regarding heightened late blight fungus risk due to elevated humidity and temperature fluctuations.',
    actionableRw: 'Tera umuti wo mu bwoko bwa Mancozeb 80WP cyangwa Ridomil Gold buri minsi 7-10. Irinde gutera imiti igihe imvura iri kugwa ngo itayitwara.',
    actionableEn: 'Apply preventive fungicide (Mancozeb or Ridomil Gold) at 7-10 day intervals. Ensure spraying during dry morning hours.',
    officialLink: 'https://www.rab.gov.rw',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'news-meteo-03',
    institution: 'METEO RWANDA',
    titleRw: 'Iteganyagihe ry\'Igihembwe cy\'Imvura y\'Umuhindo: Imiterere y\'Imvura mu Turere Twose',
    titleEn: 'Meteo Rwanda: Seasonal Rainfall Outlook & Agro-meteorological Onset Dates',
    date: '2026-08-20',
    category: 'Weather Warning',
    summaryRw: 'Meteo Rwanda yashyize ahagaragara iteganyagihe ry\'imvura y\'umuhindo. Mu ntara y\'Amajyaruguru n\'Iburengerazuba imvura izatangira kare, mu gihe mu Burasirazuba (Nyagatare, Kayonza, Bugesera) hateganyijwe imvura iciriritse.',
    summaryEn: 'Meteo Rwanda releases seasonal rainfall forecast. Early onset expected in Northern and Western regions, with moderate to normal rains in Eastern plains.',
    actionableRw: 'Abahinzi bo mu Burasirazuba baragirwa inama yo guhitamo imbuto zera kare (Early maturing varieties nka SC 403 cyangwa ibishyimbo by\'urubwiza).',
    actionableEn: 'Farmers in Eastern lowlands are advised to plant early-maturing, drought-tolerant varieties and prepare water-harvesting trenches.',
    officialLink: 'https://www.meteorwanda.gov.rw',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'news-nais-04',
    institution: 'NAIS',
    titleRw: 'Ubwishingizi bw\'Ibihingwa n\'Amatungo (Tekana Urishingiwe): 85% Yishyurwa na Leta',
    titleEn: 'National Agricultural Insurance Scheme (NAIS): 85% Government Premium Subsidy',
    date: '2026-08-15',
    category: 'Policy',
    summaryRw: 'Gahunda ya Tekana Urishingiwe ifasha abahinzi b\'ibigori, umuceri, ibirayi, inka z\'amata n\'ingurube kwishingira ibihombo biterwa n\'amapfa, imyuzure, n\'indwara z\'ibyorezo.',
    summaryEn: 'NAIS protects smallholders and cooperatives against extreme weather losses, floods, pests, and livestock mortality with 85% government co-payment.',
    actionableRw: 'Gana ikigo cy\'ubwishingizi (Radiant, Prime, BK Insurance, Sonarwa) cyangwa usabe umufashamyumvire w\'ubuhinzi mu murenge kugufasha kwiyandikisha.',
    actionableEn: 'Register your crop acreage with approved insurance providers or visit your Sector Agronomist for registration support.',
    officialLink: 'https://www.minagri.gov.rw',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  }
];
