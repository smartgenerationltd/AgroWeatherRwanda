import { Location, WeatherData, Alert, CropAdvisory, MarketCommodity, LeaderDisasterMetric, ForecastDay, HistoricalDataPoint } from '../types';

const conditions = [
  { main: 'Clear', description: 'Ikirere gikeye neza (Izuba)', descriptionEn: 'Clear Sunny Sky', icon: 'Sunny' },
  { main: 'Clouds', description: 'Ibicu bike bicagase', descriptionEn: 'Partly Cloudy', icon: 'PartlyCloudy' },
  { main: 'Clouds', description: 'Ibicu byinshi bibundikiye', descriptionEn: 'Overcast Clouds', icon: 'Cloudy' },
  { main: 'Rain', description: 'Imvura y\'urujojo (Nke)', descriptionEn: 'Light Drizzle', icon: 'Rainy' },
  { main: 'Rain', description: 'Imvura nyinshi ifite umuyaga', descriptionEn: 'Heavy Rain & Wind', icon: 'Stormy' },
  { main: 'Thunderstorm', description: 'Inkuba n\'imvura y\'impanguragihingwa', descriptionEn: 'Thunderstorm with Gusts', icon: 'Stormy' },
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(1));

export const getMockWeatherData = (location: Location): WeatherData => {
  const today = new Date();
  const daysOfWeekRw = ['Ku cyumweru', 'Ku wa mbere', 'Ku wa kabiri', 'Ku wa gatatu', 'Ku wa kane', 'Ku wa gatanu', 'Ku wa gatandatu'];
  const daysOfWeekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Altitude & climate profile based on location
  const isHighland = location.altitudeMeters >= 1800;
  const isSavanna = location.zone === 'eastern_savanna';
  const isKivu = location.zone === 'kivu_belt';

  let baseTempMin = 14;
  let baseTempMax = 25;
  let baseSoilMoisture = 65;

  if (isHighland) {
    baseTempMin = 10;
    baseTempMax = 21;
    baseSoilMoisture = 78;
  } else if (isSavanna) {
    baseTempMin = 18;
    baseTempMax = 29;
    baseSoilMoisture = 48;
  } else if (isKivu) {
    baseTempMin = 16;
    baseTempMax = 26;
    baseSoilMoisture = 68;
  }

  const currentMonth = today.getMonth();
  const isRainySeason = [1, 2, 3, 4, 8, 9, 10, 11].includes(currentMonth);

  // Generate current condition
  const condIndex = isRainySeason ? (isHighland ? randomInt(1, 4) : randomInt(0, 3)) : (isSavanna ? randomInt(0, 1) : randomInt(0, 2));
  const currentCondition = conditions[condIndex] || conditions[1];
  const rainfallToday = currentCondition.main === 'Rain' || currentCondition.main === 'Thunderstorm' ? randomFloat(4, 28) : 0;

  // Alerts
  const alerts: Alert[] = [];
  if (isHighland && rainfallToday > 15) {
    alerts.push({
      id: `alert-landslide-${location.id}`,
      category: 'LANDSLIDE',
      severity: 'danger',
      title: `Iburira ry'Inkangu mu misozi ya ${location.name}`,
      titleEn: `Landslide Hazard Warning for ${location.name} Hills`,
      message: `Imvura imaze kugera kuri ${rainfallToday}mm n'ububobere bwo hejuru (85%) birongera ibyago by'inkangu mu mirenge ifite imikingo ihanamye. Kurikirana amaterasi no kwimuka mu manegeka.`,
      messageEn: `Cumulative heavy rainfall and saturated slope soils create high landslide vulnerability in steep sectors. Maintain terrace drainage and avoid high-risk slope dwellings.`,
      timestamp: 'Meteo Rwanda Live Feed',
      affectedSectors: ['Imirenge ihanamye', 'Amaterasi y\'imisozi', 'Imibande']
    });
  } else if (isSavanna && baseSoilMoisture < 45) {
    alerts.push({
      id: `alert-drought-${location.id}`,
      category: 'DROUGHT',
      severity: 'warning',
      title: `Ubushyuhe n'ubwumure buke mu butaka muri ${location.name}`,
      titleEn: `Soil Moisture Deficit Advisory in ${location.name}`,
      message: `Ubushuhe buri hasi ya 45% n'umuyaga wumutse bisaba gukoresha uburyo bwo gutwikira ubutaka (mulching) no gutangira kuhira mu bishanga cyangwa ibyuzi by'amazi.`,
      messageEn: `Soil moisture is at a critical deficit. Mulching and supplemental drip or furrow irrigation are strongly recommended for young crops.`,
      timestamp: 'Meteo Rwanda Live Feed'
    });
  } else if (currentCondition.main === 'Thunderstorm') {
    alerts.push({
      id: `alert-storm-${location.id}`,
      category: 'WIND',
      severity: 'warning',
      title: `Umuyaga n'Imvura idasanzwe iteganyijwe`,
      titleEn: `Severe Wind Gusts & Thunderstorm Alert`,
      message: `Hateganijwe umuyaga ushobora kugera kuri 24 km/h ushobora gusenya insina n'ibigori bikiri bito. Funga neza ibigega kandi wirinde kugama munsi y'ibiti birebire.`,
      messageEn: `Gusts reaching 24 km/h may cause lodging in banana groves and young maize. Secure drying sheds and avoid sheltering under isolated trees.`,
      timestamp: 'Meteo Rwanda Live Feed'
    });
  }

  // 7-day forecast
  const forecast: ForecastDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayRainMm = isRainySeason ? (i % 2 === 0 ? randomFloat(3, 22) : randomFloat(0, 5)) : randomFloat(0, 4);
    const dayCond = dayRainMm > 12 ? conditions[4] : dayRainMm > 3 ? conditions[3] : dayRainMm > 0 ? conditions[1] : conditions[0];
    const precipProb = dayRainMm > 10 ? randomInt(75, 95) : dayRainMm > 0 ? randomInt(40, 70) : randomInt(10, 30);
    
    // Agro decision metrics
    const spraying: 'GOOD' | 'MODERATE' | 'POOR' = dayRainMm > 5 || precipProb > 60 ? 'POOR' : dayRainMm > 0 ? 'MODERATE' : 'GOOD';
    const planting: 'OPTIMAL' | 'FAIR' | 'WAIT' = (dayRainMm >= 8 && dayRainMm <= 25) ? 'OPTIMAL' : dayRainMm > 25 ? 'WAIT' : 'FAIR';
    const drying: 'HIGH' | 'MEDIUM' | 'LOW' = dayRainMm === 0 && precipProb < 35 ? 'HIGH' : dayRainMm < 5 ? 'MEDIUM' : 'LOW';

    return {
      date: d.toISOString().split('T')[0],
      dayRw: i === 0 ? 'Uyu munsi' : daysOfWeekRw[d.getDay()],
      dayEn: i === 0 ? 'Today' : daysOfWeekEn[d.getDay()],
      temp_max: randomFloat(baseTempMax - 1, baseTempMax + 3),
      temp_min: randomFloat(baseTempMin, baseTempMin + 3),
      rainfall_mm: dayRainMm,
      precipitation_probability: precipProb,
      humidity: randomInt(isHighland ? 70 : 50, 92),
      wind_speed: randomFloat(4, 16),
      spraying_suitability: spraying,
      planting_suitability: planting,
      drying_suitability: drying,
      condition: dayCond
    };
  });

  // Historical 30 days
  const historical: HistoricalDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const r = isRainySeason ? (i % 3 === 0 ? randomFloat(4, 25) : randomFloat(0, 6)) : randomFloat(0, 5);
    return {
      date: d.toISOString().split('T')[0],
      temp: randomFloat(baseTempMin + 2, baseTempMax),
      rainfall: r,
      soilMoisture: Math.min(95, Math.max(30, baseSoilMoisture + (r * 1.5) - (randomFloat(1, 3))))
    };
  });

  // Crop Advisories for Farmers (Primary)
  const cropAdvisories: CropAdvisory[] = [
    {
      cropName: 'Ibigori (Maize)',
      cropNameRw: 'Ibigori',
      icon: '🌽',
      currentStage: 'Vegetative / Top-Dressing',
      currentStageRw: 'Gukura / Gushyiramo UREA',
      actionRequired: rainfallToday > 8 
        ? 'Do not apply UREA fertilizer today: heavy rain wash-off risk. Wait for dry window on Wednesday.' 
        : 'Good window for top-dressing fertilizer and weeding. Soil moisture is optimal.',
      actionRequiredRw: rainfallToday > 8 
        ? 'Witera ifumbire ya UREA uyu munsi: imvura ishobora kuyitwara (wash-off). Tegereza umunsi ufite izuba.' 
        : 'Igihe cyiza cyo kubagara no gushyiramo ifumbire ya UREA / NPK. Ubutaka bufite ububobere bwiza.',
      status: rainfallToday > 8 ? 'warning' : 'optimal',
      waterNeed: 'Moderate',
      waterNeedRw: 'Iringaniye',
      pestRisk: 'Nkongwa idasanzwe (Fall Armyworm) - Watch whorls',
      pestRiskRw: 'Kugenzura nkongwa idasanzwe mu mutima w\'ikigori'
    },
    {
      cropName: 'Ibishyimbo (Beans)',
      cropNameRw: 'Ibishyimbo',
      icon: '🫘',
      currentStage: 'Flowering & Pod Setting',
      currentStageRw: 'Kurabya & Kuzana ibishyimbo',
      actionRequired: isHighland 
        ? 'High humidity creates fungal anthracnose risk. Spray copper-based organic protectant during morning sunny window.'
        : 'Ensure stakes are firmly fixed against afternoon wind gusts.',
      actionRequiredRw: isHighland 
        ? 'Ubushuhe bwo hejuru bushobora gutera imiyege y\'ibara (Anthracnose). Tera umuti w\'ibara mu gitondo mbere y\'imvura.' 
        : 'Komeza gushingirira ibishyimbo birikoza ku biti ngo umuyaga utabirambika hasi.',
      status: 'action_needed',
      waterNeed: 'Moderate',
      waterNeedRw: 'Iringaniye',
      pestRisk: 'Imbwebwe n\'Indwara y\'Ibara (Anthracnose)',
      pestRiskRw: 'Uducurama n\'Imiyege y\'ibara ry\'amababi'
    },
    {
      cropName: 'Ibirayi (Irish Potatoes)',
      cropNameRw: 'Ibirayi',
      icon: '🥔',
      currentStage: 'Tuber bulking / Gukura kw\'ibirayi',
      currentStageRw: 'Gukura kw\'Ibirayi munsi y\'ubutaka',
      actionRequired: isHighland 
        ? 'Late Blight (Umusonga w\'ibirayi) risk index is HIGH (88%) due to fog & mist. Apply preventative systemic fungicide immediately.' 
        : 'Maintain good hilling up around potato stems to prevent tuber greening from rain exposure.',
      actionRequiredRw: isHighland 
        ? 'Ibyago by\'Umusonga w\'Ibirayi (Late Blight) biri hejuru (88%) kubera igihu n\'ububobere. Fata ingamba zo gutera umuti urinda.' 
        : 'Runda ubutaka bwinshi ku bitsina by\'ibirayi ngo imvura itamena ubutaka ibirayi bikera.',
      status: isHighland ? 'action_needed' : 'optimal',
      waterNeed: 'High',
      waterNeedRw: 'Nyinshi',
      pestRisk: 'Umusonga w\'Ibirayi (Phytophthora Late Blight)',
      pestRiskRw: 'Umusonga w\'ibirayi (Late Blight)'
    },
    {
      cropName: 'Ikawa n\'Icyayi (Coffee & Tea)',
      cropNameRw: 'Ikawa & Icyayi',
      icon: '☕',
      currentStage: 'Cherry Maturation / Flushes',
      currentStageRw: 'Guhisha ibitumbwe by\'ikawa / Guca icyayi',
      actionRequired: 'Ensure mulch coverage on tree bases to retain water and reduce weed competition. Good harvest conditions.',
      actionRequiredRw: 'Sasira munsi y\'ibiti by\'ikawa kugira ngo ugumane ububobere kandi urinde isuri ku mikingo.',
      status: 'optimal',
      waterNeed: 'High',
      waterNeedRw: 'Nyinshi',
      pestRisk: 'Urumangu (Coffee Berry Borer) monitoring',
      pestRiskRw: 'Gucunga urumangu rw\'ibitumbwe by\'ikawa'
    }
  ];

  // Market Commodities for Traders (Secondary)
  const marketCommodities: MarketCommodity[] = [
    {
      id: 'maize',
      name: 'Dry Maize Grain (Ibigori Byumye)',
      nameRw: 'Ibigori byumye (Icyiciro cya 1)',
      unit: '1 kg',
      currentPriceRwf: isSavanna ? 480 : 540,
      priceTrend: 'up',
      changePercentage: 4.2,
      dryingStatus: forecast[0].drying_suitability === 'HIGH' ? 'Optimal sun-drying (Moisture target: <13.5%)' : 'Caution: High humidity, use covered tarpaulin',
      dryingStatusRw: forecast[0].drying_suitability === 'HIGH' ? 'Igihe cyiza cyo kwanika ku mashitingi (Ubushuhe <13.5%)' : 'Icyitonderwa: Ubushuhe bwinshi, zinga amashitingi hakiri kare',
      transportRisk: isHighland && rainfallToday > 10 ? 'High' : 'Low',
      transportRiskRw: isHighland && rainfallToday > 10 ? 'Mwinshi' : 'Muto'
    },
    {
      id: 'beans',
      name: 'Mixed Beans (Ibishyimbo bivanzemo)',
      nameRw: 'Ibishyimbo bitukura / Umwirasi',
      unit: '1 kg',
      currentPriceRwf: 820,
      priceTrend: 'stable',
      changePercentage: 0.5,
      dryingStatus: 'Store in hermetic PICS bags to protect against weevils',
      dryingStatusRw: 'Hunika mu mifuka ya PICS irinda udukoko n\'umwuka',
      transportRisk: 'Low',
      transportRiskRw: 'Muto'
    },
    {
      id: 'potatoes',
      name: 'Kinigi / Victoria Irish Potatoes',
      nameRw: 'Ibirayi bya Kinigi / Victoria',
      unit: '1 kg (Ikilo)',
      currentPriceRwf: isHighland ? 320 : 450,
      priceTrend: 'down',
      changePercentage: -3.8,
      dryingStatus: 'Perishable supply from Musanze/Nyabihu: Quick transit needed',
      dryingStatusRw: 'Ibirayi biva mu majyaruguru: Bisaba gutwarwa vuba mu masoko ya Kigali',
      transportRisk: isHighland ? 'Medium' : 'Low',
      transportRiskRw: isHighland ? 'Iringaniye' : 'Muto'
    },
    {
      id: 'rice',
      name: 'Bugarama Long Grain Rice (Umuceri)',
      nameRw: 'Umuceri wa Bugarama / Mukunguri',
      unit: '1 kg',
      currentPriceRwf: 1200,
      priceTrend: 'up',
      changePercentage: 2.1,
      dryingStatus: 'Mill storage moisture verified at 12%',
      dryingStatusRw: 'Ububiko bwa koperative bwujuje ubuziranenge (12%)',
      transportRisk: 'Low',
      transportRiskRw: 'Muto'
    }
  ];

  // Institutional Leader Metrics (Institutional)
  const leaderMetrics: LeaderDisasterMetric = {
    floodRiskLevel: rainfallToday > 20 || (isSavanna && rainfallToday > 15) ? 'High' : rainfallToday > 8 ? 'Moderate' : 'Low',
    floodRiskRw: rainfallToday > 20 || (isSavanna && rainfallToday > 15) ? 'Mwinshi' : rainfallToday > 8 ? 'Iringaniye' : 'Muto',
    landslideRiskLevel: isHighland && rainfallToday > 12 ? 'Severe' : isHighland && rainfallToday > 5 ? 'Moderate' : 'Low',
    landslideRiskRw: isHighland && rainfallToday > 12 ? 'Ikabije' : isHighland && rainfallToday > 5 ? 'Iringaniye' : 'Muto',
    erosionVulnerability: isHighland ? 'High on slopes >30%: Anti-erosion ditches must be cleared' : 'Moderate in river valleys',
    erosionVulnerabilityRw: isHighland ? 'Hejuru ku misozi ihanamye: Imiyoboro n\'imiringoti y\'amaterasi igomba gucukurwa' : 'Iringaniye mu bibaya by\'imigezi',
    urgentAction: isHighland && rainfallToday > 12 
      ? 'Alert Umudugudu leaders in high-risk zones (Amanegeka) to monitor slope cracks and relocate vulnerable households.'
      : 'Mobilize community work (Umuganda) to unclog roadside culverts and farm drainage channels ahead of forecasted rainfall.',
    urgentActionRw: isHighland && rainfallToday > 12 
      ? 'Bwira Abakuru b\'Imidugudu n\'Abajyanama b\'Ubuhinzi gukurikirana imikingo mu manegeka no kwimura abaturage bari mu kaga.'
      : 'Gushishikariza abaturage gucukura imiringoti y\'amazi n\'amaterasi arinda isuri mbere y\'imvura y\'itumba.',
    recommendedBroadcastSms: `[IBURIRA RYA METEO RWANDA - ${(location?.name || 'RWANDA').toUpperCase()}]: Bitewe n'imvura iteganyijwe (${rainfallToday.toFixed(0)}mm), abahinzi basabwe kureka gutera ifumbire uyu munsi, n'abatuye mu manegeka kuba maso ku nkangu. Hamagara 112 mu gihe cy'ubutabazi.`
  };

  return {
    current: {
      temp: randomFloat(baseTempMin + 3, baseTempMax),
      feels_like: randomFloat(baseTempMin + 2, baseTempMax + 2),
      humidity: randomInt(isHighland ? 72 : 48, 92),
      wind_speed: randomFloat(3, 16),
      precipitation_chance: currentCondition.main === 'Rain' ? randomInt(70, 95) : randomInt(10, 40),
      rainfall_mm: rainfallToday,
      solar_radiation_uv: currentCondition.main === 'Clear' ? 9.2 : currentCondition.main === 'Clouds' ? 5.5 : 2.8,
      soil_moisture_percentage: Math.min(95, Math.max(35, baseSoilMoisture + (rainfallToday > 0 ? 12 : -4))),
      soil_temp: randomFloat(baseTempMin + 2, baseTempMax - 1),
      evapotranspiration: isSavanna ? 4.8 : 3.2,
      condition: currentCondition
    },
    forecast,
    historical,
    alerts,
    cropAdvisories,
    marketCommodities,
    leaderMetrics
  };
};
