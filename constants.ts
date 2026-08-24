import { UserRole, Location, AgroEcoZone } from './types';

export const USER_ROLES_CONFIG = [
  {
    role: UserRole.Farmer,
    priority: 1,
    titleRw: 'Abahinzi',
    titleEn: 'Farmers & Cooperatives',
    tagRw: 'Icyiciro cy\'ibanze (Primary)',
    tagEn: 'Primary Group',
    descriptionRw: 'Iteganyagihe rikoreshwa mu gufata ibyemezo byo gutera imbuto, gushyira ifumbire, gusarura, no kurinda ibihingwa indwara n\'ibyonnyi.',
    descriptionEn: 'Actionable agro-meteorological advisories for planting dates, fertilizer application windows, pest protection, and post-harvest management.',
    icon: '👨‍🌾',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    accentColor: 'from-emerald-600 to-teal-700',
    keyFeatures: [
      'Igihe gikwiriye cyo gutera (Planting Windows)',
      'Igenzura ry\'imvura n\'ububobere bw\'ubutaka (Soil Moisture)',
      'Igihe cyo gutera imiti n\'ifumbire (Spraying & Fertilizer Timing)',
      'Iburira ry\'ibyonnyi (Pest & Disease Alerts)'
    ]
  },
  {
    role: UserRole.BusinessLeader,
    priority: 2,
    titleRw: 'Abacuruzi',
    titleEn: 'Agri-Traders & Processors',
    tagRw: 'Icyiciro cya kabiri (Secondary)',
    tagEn: 'Secondary Group',
    descriptionRw: 'Iteganyagihe ry\'ubwikorezi bw\'umusaruro, kwanika no guhunika ibinyampeke, n\'isoko ry\'ibicuruzwa by\'ubuhinzi.',
    descriptionEn: 'Logistics weather risks, grain drying & safe moisture thresholds, market corridor forecasts, and agro-input supply planning.',
    icon: '🛒',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    accentColor: 'from-amber-600 to-orange-700',
    keyFeatures: [
      'Umutekano w\'imihanda y\'ubwikorezi (Corridor Logistics)',
      'Ibihe byo kwanika no guhunika (Drying & Storage Risk)',
      'Ibiciro by\'isoko n\'imiterere y\'ikirere (Market Prices)',
      'Itegurwa ry\'inyongeramusaruro (Input Supply Demand)'
    ]
  },
  {
    role: UserRole.LocalLeader,
    priority: 3,
    titleRw: 'Abayobozi',
    titleEn: 'Local Leaders & Agronomists',
    tagRw: 'Inzego n\'Inzego z\'Ibanze (Institutional)',
    tagEn: 'Institutional Users',
    descriptionRw: 'Iburira ry\'ibiza (inkangu, imyuzure), kurengera amaterasi n\'imikingo, no gutangaza ubutumwa bwihuse ku baturage.',
    descriptionEn: 'Disaster early-warning (landslides & floods), sector-level food security monitoring, erosion prevention, and broadcast advisories.',
    icon: '🏛️',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    accentColor: 'from-indigo-600 to-blue-700',
    keyFeatures: [
      'Iburira ry\'inkangu n\'imyuzure (Disaster Early Warning)',
      'Ubutumwa bwihuse bwo kohereza (Emergency Alert Broadcast)',
      'Kurengera ibikorwaremezo n\'amaterasi (Terrace & Watershed Care)',
      'Imicungire y\'ibiribwa mu karere (Food Security Monitoring)'
    ]
  },
];

export const AGRO_ECO_ZONES: Record<string, AgroEcoZone> = {
  'volcanic': {
    code: 'VOL',
    nameRw: 'Akarere k\'Ibirunga',
    nameEn: 'Volcanic Soil Highlands',
    altitudeRange: '1,800m - 2,500m',
    dominantCrops: ['Ibirayi (Irish Potatoes)', 'Imboga (Vegetables)', 'Iparetre (Pyrethrum)', 'Icyayi (Tea)'],
    soilType: 'Andosols (Volcanic rich)',
    rainfallPattern: 'High (1,400 - 1,800 mm/year)'
  },
  'buberuka': {
    code: 'BUB',
    nameRw: 'Imisozi miremire ya Buberuka',
    nameEn: 'Buberuka Highlands',
    altitudeRange: '1,700m - 2,300m',
    dominantCrops: ['Ingano (Wheat)', 'Ibishyimbo (Climbing Beans)', 'Icyayi (Tea)', 'Ibirayi (Potatoes)'],
    soilType: 'Ferralsols on steep slopes (High erosion risk)',
    rainfallPattern: 'Bimodal High (1,200 - 1,500 mm/year)'
  },
  'central_plateau': {
    code: 'CEN',
    nameRw: 'Ikibaya cyo Hagati (Plateau Central)',
    nameEn: 'Central Plateau',
    altitudeRange: '1,400m - 1,800m',
    dominantCrops: ['Ibitoki (Bananas)', 'Ikawa (Arabica Coffee)', 'Ibishyimbo (Beans)', 'Ibigori (Maize)'],
    soilType: 'Acrisols & Ferralsols',
    rainfallPattern: 'Moderate (1,000 - 1,200 mm/year)'
  },
  'eastern_savanna': {
    code: 'EAS',
    nameRw: 'Uburasirazuba (Ikibaya n\'Ubutayu bw\'Amashyamba)',
    nameEn: 'Eastern Lowlands & Savanna',
    altitudeRange: '1,200m - 1,500m',
    dominantCrops: ['Ibigori (Maize)', 'Urusyo/Amasaka (Sorghum)', 'Soya (Soybeans)', 'Umuceri (Rice in valleys)'],
    soilType: 'Vertisols & Arenosols',
    rainfallPattern: 'Low to erratic (700 - 950 mm/year, Drought-prone)'
  },
  'kivu_belt': {
    code: 'KIV',
    nameRw: 'Inkengero z\'Ikiyaga cya Kivu',
    nameEn: 'Lake Kivu Belt',
    altitudeRange: '1,450m - 1,900m',
    dominantCrops: ['Ikawa (Specialty Coffee)', 'Ibitoki (Bananas)', 'Imyumbati (Cassava)', 'Imboga'],
    soilType: 'Rich Humic Ferralsols',
    rainfallPattern: 'High (1,200 - 1,600 mm/year, Lake microclimate)'
  },
  'congo_nile': {
    code: 'CNR',
    nameRw: 'Uruhererekane rwa Congo-Nil',
    nameEn: 'Congo-Nile Divide',
    altitudeRange: '1,900m - 2,600m',
    dominantCrops: ['Icyayi (Highland Tea)', 'Ibiti n\'amashyamba', 'Ibirayi'],
    soilType: 'Acidic humic soils',
    rainfallPattern: 'Very high (1,600 - 2,000 mm/year)'
  }
};

export const RWANDA_LOCATIONS: Location[] = [
  // Northern Province (Amajyaruguru)
  { id: 'musanze', name: 'Musanze', province: 'Northern', provinceRw: 'Amajyaruguru', zone: 'volcanic', lat: -1.5042, lon: 29.6350, altitudeMeters: 1850, stationName: 'Ruhengeri Meteo Station', dominantCrops: ['Ibirayi', 'Imboga', 'Icyayi', 'Ibigori'] },
  { id: 'burera', name: 'Burera', province: 'Northern', provinceRw: 'Amajyaruguru', zone: 'buberuka', lat: -1.4500, lon: 29.8000, altitudeMeters: 1920, stationName: 'Butaro Climate Post', dominantCrops: ['Ingano', 'Ibishyimbo', 'Ibirayi', 'Icyayi'] },
  { id: 'gicumbi', name: 'Gicumbi', province: 'Northern', provinceRw: 'Amajyaruguru', zone: 'buberuka', lat: -1.6133, lon: 30.0100, altitudeMeters: 2100, stationName: 'Byumba Meteo Radar', dominantCrops: ['Icyayi', 'Ibishyimbo', 'Ingano', 'Ibirayi'] },
  { id: 'gakenke', name: 'Gakenke', province: 'Northern', provinceRw: 'Amajyaruguru', zone: 'buberuka', lat: -1.7000, lon: 29.7833, altitudeMeters: 1650, stationName: 'Gakenke Agrometeorological Station', dominantCrops: ['Ikawa', 'Ibitoki', 'Ibishyimbo', 'Ibigori'] },
  { id: 'rulindo', name: 'Rulindo', province: 'Northern', provinceRw: 'Amajyaruguru', zone: 'central_plateau', lat: -1.7333, lon: 30.0000, altitudeMeters: 1720, stationName: 'Tare Station', dominantCrops: ['Ikawa', 'Ibitoki', 'Ibirayi', 'Imboga'] },

  // Eastern Province (Iburasirazuba)
  { id: 'nyagatare', name: 'Nyagatare', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -1.3000, lon: 30.3300, altitudeMeters: 1350, stationName: 'Nyagatare Agro Station', dominantCrops: ['Ibigori', 'Soya', 'Ubworozi', 'Umuceri'] },
  { id: 'gatsibo', name: 'Gatsibo', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -1.6000, lon: 30.4500, altitudeMeters: 1420, stationName: 'Kabarore Meteo Post', dominantCrops: ['Ibigori', 'Ibishyimbo', 'Amasaka', 'Ibitoki'] },
  { id: 'kayonza', name: 'Kayonza', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -1.9333, lon: 30.5000, altitudeMeters: 1400, stationName: 'Mukarange Climate Station', dominantCrops: ['Ibigori', 'Soya', 'Imyumbati', 'Ibitoki'] },
  { id: 'bugesera', name: 'Bugesera', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -2.1833, lon: 30.0833, altitudeMeters: 1380, stationName: 'Nyamata Met Station', dominantCrops: ['Imyumbati', 'Ibigori', 'Ibishyimbo', 'Imboga'] },
  { id: 'kirehe', name: 'Kirehe', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -2.2667, lon: 30.6500, altitudeMeters: 1390, stationName: 'Mahama Agro Station', dominantCrops: ['Ibitoki', 'Ibigori', 'Soya', 'Umuceri'] },
  { id: 'ngoma', name: 'Ngoma', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -2.1620, lon: 30.4624, altitudeMeters: 1470, stationName: 'Kibungo Met Station', dominantCrops: ['Ibitoki', 'Ikawa', 'Ibigori', 'Ibishyimbo'] },
  { id: 'rwamagana', name: 'Rwamagana', province: 'Eastern', provinceRw: 'Iburasirazuba', zone: 'eastern_savanna', lat: -1.9500, lon: 30.4333, altitudeMeters: 1510, stationName: 'Rwamagana Central Post', dominantCrops: ['Ibitoki', 'Ibigori', 'Ikawa', 'Ibishyimbo'] },

  // Southern Province (Amajyepfo)
  { id: 'huye', name: 'Huye', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -2.5160, lon: 29.7401, altitudeMeters: 1750, stationName: 'RAB Rubona Agrometeorological Observatory', dominantCrops: ['Ikawa', 'Ibishyimbo', 'Ibitoki', 'Soya'] },
  { id: 'muhanga', name: 'Muhanga', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -2.0833, lon: 29.7500, altitudeMeters: 1800, stationName: 'Gitarama Met Station', dominantCrops: ['Ikawa', 'Ibitoki', 'Imyumbati', 'Ibishyimbo'] },
  { id: 'kamonyi', name: 'Kamonyi', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -1.9167, lon: 29.9333, altitudeMeters: 1600, stationName: 'Ruyenzi Weather Post', dominantCrops: ['Ibitoki', 'Imyumbati', 'Ikawa', 'Imboga'] },
  { id: 'nyamagabe', name: 'Nyamagabe', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'congo_nile', lat: -2.4764, lon: 29.5694, altitudeMeters: 2050, stationName: 'Kitabi Nyungwe Station', dominantCrops: ['Icyayi', 'Ingano', 'Ibirayi', 'Ibishyimbo'] },
  { id: 'nyanza', name: 'Nyanza', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -2.3500, lon: 29.7500, altitudeMeters: 1780, stationName: 'Nyanza Met Station', dominantCrops: ['Ikawa', 'Ibitoki', 'Ibishyimbo', 'Imyumbati'] },
  { id: 'nyaruguru', name: 'Nyaruguru', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'congo_nile', lat: -2.7167, lon: 29.5833, altitudeMeters: 2150, stationName: 'Kibeho Met Station', dominantCrops: ['Icyayi', 'Ingano', 'Ibirayi', 'Ibishyimbo'] },
  { id: 'gisagara', name: 'Gisagara', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -2.6167, lon: 29.8500, altitudeMeters: 1680, stationName: 'Ndora Met Post', dominantCrops: ['Ibitoki', 'Umuceri', 'Ibishyimbo', 'Imyumbati'] },
  { id: 'ruhango', name: 'Ruhango', province: 'Southern', provinceRw: 'Amajyepfo', zone: 'central_plateau', lat: -2.2167, lon: 29.7833, altitudeMeters: 1720, stationName: 'Ruhango Station', dominantCrops: ['Imyumbati', 'Ikawa', 'Ibitoki', 'Ibishyimbo'] },

  // Western Province (Iburengerazuba)
  { id: 'rubavu', name: 'Rubavu', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'kivu_belt', lat: -1.6934, lon: 29.2618, altitudeMeters: 1500, stationName: 'Gisenyi Aerodrome Met Station', dominantCrops: ['Imboga', 'Ibirayi', 'Ibitoki', 'Ikawa'] },
  { id: 'karongi', name: 'Karongi', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'kivu_belt', lat: -2.1578, lon: 29.3731, altitudeMeters: 1530, stationName: 'Kibuye Lake Met Station', dominantCrops: ['Ikawa', 'Icyayi', 'Ibitoki', 'Ibishyimbo'] },
  { id: 'rusizi', name: 'Rusizi', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'kivu_belt', lat: -2.4846, lon: 28.9067, altitudeMeters: 1480, stationName: 'Kamembe Airport Met Station', dominantCrops: ['Umuceri', 'Icyayi', 'Ikawa', 'Ibitoki'] },
  { id: 'nyabihu', name: 'Nyabihu', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'volcanic', lat: -1.6500, lon: 29.5000, altitudeMeters: 2200, stationName: 'Mukamira Met Post', dominantCrops: ['Ibirayi', 'Icyayi', 'Imboga', 'Ingano'] },
  { id: 'ngororero', name: 'Ngororero', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'congo_nile', lat: -1.8667, lon: 29.6333, altitudeMeters: 1750, stationName: 'Ngororero Agro Station', dominantCrops: ['Ikawa', 'Icyayi', 'Ibishyimbo', 'Ibitoki'] },
  { id: 'nyamasheke', name: 'Nyamasheke', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'kivu_belt', lat: -2.3500, lon: 29.1333, altitudeMeters: 1600, stationName: 'Kagano Met Station', dominantCrops: ['Ikawa', 'Icyayi', 'Ibitoki', 'Ibishyimbo'] },
  { id: 'rutsiro', name: 'Rutsiro', province: 'Western', provinceRw: 'Iburengerazuba', zone: 'congo_nile', lat: -1.9333, lon: 29.3167, altitudeMeters: 1900, stationName: 'Kivumu Climate Post', dominantCrops: ['Ikawa', 'Icyayi', 'Ibirayi', 'Ibishyimbo'] },

  // City of Kigali (Umujyi wa Kigali)
  { id: 'gasabo', name: 'Gasabo', province: 'Kigali', provinceRw: 'Umujyi wa Kigali', zone: 'central_plateau', lat: -1.9167, lon: 30.1333, altitudeMeters: 1560, stationName: 'Kigali International Airport Met Station', dominantCrops: ['Imboga', 'Ibitoki', 'Ibigori'] },
  { id: 'kicukiro', name: 'Kicukiro', province: 'Kigali', provinceRw: 'Umujyi wa Kigali', zone: 'central_plateau', lat: -1.9833, lon: 30.1167, altitudeMeters: 1520, stationName: 'Gahanga Agrometeorology Post', dominantCrops: ['Imboga', 'Ibitoki', 'Ibigori'] },
  { id: 'nyarugenge', name: 'Nyarugenge', province: 'Kigali', provinceRw: 'Umujyi wa Kigali', zone: 'central_plateau', lat: -1.9500, lon: 30.0500, altitudeMeters: 1500, stationName: 'Nyarugenge Urban Met Post', dominantCrops: ['Imboga', 'Ibitoki'] },
];

export const LOCATIONS = RWANDA_LOCATIONS;
export const USER_ROLES = USER_ROLES_CONFIG.map(c => ({
  role: c.role,
  description: c.descriptionRw,
  icon: c.icon
}));

export const RWANDA_AGRICULTURAL_SEASONS = [
  {
    nameRw: 'Igihembwe cy\'Ihinga A (Season A)',
    nameEn: 'Agricultural Season A',
    periodRw: 'Nzeri – Mutarama (September – January)',
    focusRw: 'Ihingwa ry\'ingenzi ry\'Ibigori, Ibishyimbo, Soya, n\'Ibirayi',
    rainfallExpected: 'Heavy Initial Rains (Umuhindo)'
  },
  {
    nameRw: 'Igihembwe cy\'Ihinga B (Season B)',
    nameEn: 'Agricultural Season B',
    periodRw: 'Gashyantare – Kamena (February – June)',
    focusRw: 'Imvura nyinshi y\'Itumba, ihingwa ry\'ibinyampeke n\'ibinyamisogwe',
    rainfallExpected: 'Peak Annual Rains (Itumba)'
  },
  {
    nameRw: 'Igihembwe cy\'Ihinga C (Season C)',
    nameEn: 'Agricultural Season C (Marshlands & Irrigation)',
    periodRw: 'Nyakanga – Kanama (July – August)',
    focusRw: 'Ubuhinzi bwo mu bishanga: Imboga, Umuceri, n\'Ibirayi byo kuhira',
    rainfallExpected: 'Dry Season (Icyi) - Irrigation dependent'
  }
];

export const QUICK_FARMER_QUESTIONS = [
  {
    id: '1',
    labelRw: '🌱 Ese ntere ibishyimbo/ibigori muri iki cyumweru?',
    labelEn: 'Should I plant beans/maize this week based on rain?',
    queryRw: 'Reba iteganyagihe ry\'iyi minsi 7 muri aka karere, umbwire niba natera ibishyimbo cyangwa ibigori muri iyi minsi, n\'uko ubutaka bufite ububobere buhagije.'
  },
  {
    id: '2',
    labelRw: '🧪 Ese uyu munsi niteraho ifumbire (UREA / DAP)?',
    labelEn: 'Is today suitable to apply top-dressing fertilizer?',
    queryRw: 'Ese umunsi w\'uyu munsi n\'ejo birakwiriye gutera ifumbire yo hejuru (Urea / NPK), cyangwa imvura yaza ikayitwara (wash-off risk)?'
  },
  {
    id: '3',
    labelRw: '🐛 Uko nakwirinda nkongwa n\'indwara y\'ibirayi',
    labelEn: 'Fall armyworm and late blight disease prevention advice',
    queryRw: 'Bitewe n\'ubushyuhe n\'ububobere biri muri aka karere, ni ibihe byago by\'indwara y\'umusonga w\'ibirayi (Late Blight) n\'inkongwa mu bigori, kandi nakwirinda nte?'
  },
  {
    id: '4',
    labelRw: '☀️ Ese nzarangiza kwanika imyaka yanjye ku zuba?',
    labelEn: 'Is the sun window sufficient to dry harvested grain?',
    queryRw: 'Muri iyi minsi 3 iri mbere, ese izuba rirahagije kwanika ibishyimbo cyangwa ibigori ngo biticwa n\'uruhumbu (aflatoxin)?'
  }
];
