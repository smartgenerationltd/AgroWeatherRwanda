import { CurrentWeather, ForecastDay, Location, UserRole, Language } from '../types';

export interface AgroDecisionMetrics {
  plantingScore: number; // 0-100
  plantingStatus: 'OPTIMAL' | 'FAIR' | 'WAIT';
  plantingReasonRw: string;
  plantingReasonEn: string;
  
  sprayingStatus: 'GOOD' | 'MODERATE' | 'POOR';
  sprayingScore: number;
  sprayingReasonRw: string;
  sprayingReasonEn: string;
  
  fertilizerWashOffRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  fertilizerReasonRw: string;
  fertilizerReasonEn: string;
  
  dryingSuitability: 'HIGH' | 'MEDIUM' | 'LOW';
  dryingHoursToday: number;
  dryingReasonRw: string;
  dryingReasonEn: string;
  
  erosionRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  erosionReasonRw: string;
  erosionReasonEn: string;
  
  lateBlightRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  fallArmywormRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const evaluateAgroDecisions = (
  weather: CurrentWeather,
  forecast: ForecastDay[] = [],
  location: Location
): AgroDecisionMetrics => {
  const soilMoisture = weather.soil_moisture_percentage || 50;
  const rainToday = weather.rainfall_mm || 0;
  const precipProb = weather.precipitation_chance || 0;
  const windSpeed = weather.wind_speed || 8;
  const temp = weather.temp || 22;
  const uv = weather.solar_radiation_uv || 6;
  const isHighland = (location?.altitudeMeters || 1500) > 1750;
  const next3DaysRain = forecast.slice(0, 3).reduce((acc, d) => acc + (d.rainfall_mm || 0), 0);

  // 1. Planting Suitability Evaluation
  let plantingScore = 50;
  let plantingStatus: 'OPTIMAL' | 'FAIR' | 'WAIT' = 'FAIR';
  let plantingReasonRw = "Ububobere bw'ubutaka buri mu kigero cyiza cyo gutera imbuto.";
  let plantingReasonEn = "Soil moisture and moisture forecast are balanced for sowing.";

  if (soilMoisture >= 60 && soilMoisture <= 85 && (rainToday > 2 || next3DaysRain > 10)) {
    plantingScore = 90;
    plantingStatus = 'OPTIMAL';
    plantingReasonRw = `Ububobere bw'ubutaka buri hejuru (${soilMoisture}%) kandi imvura iragenda neza. Igihe cyiza cyo gutera ibishyimbo, ibigori n'imboga.`;
    plantingReasonEn = `Optimal soil moisture (${soilMoisture}%) with steady rainfall outlook. Excellent window for sowing.`;
  } else if (soilMoisture < 45 && rainToday === 0 && next3DaysRain < 5) {
    plantingScore = 20;
    plantingStatus = 'WAIT';
    plantingReasonRw = `Ubutaka burumye cyane (${soilMoisture}%). Tegereza imvura yisukiranye cyangwa wuhire mbere yo gutera ngo imbuto zizotse.`;
    plantingReasonEn = `Soil is dry (${soilMoisture}%). Wait for steady seasonal rain or irrigate prior to seeding.`;
  } else if (soilMoisture > 90 || rainToday > 35) {
    plantingScore = 30;
    plantingStatus = 'WAIT';
    plantingReasonRw = `Ubutaka bwararengewe n'amazi (${soilMoisture}%). Tegereza amazi abanze akame kugira ngo imbuto zitaborera mu butaka.`;
    plantingReasonEn = `Soil is waterlogged (${soilMoisture}%). Allow fields to drain to avoid seed rot.`;
  }

  // 2. Spraying Suitability (Pesticides / Fungicides)
  let sprayingStatus: 'GOOD' | 'MODERATE' | 'POOR' = 'GOOD';
  let sprayingScore = 85;
  let sprayingReasonRw = "Umuyaga uri hasi kandi nta mvura y'akavubi iteganyijwe. Igihe cyiza cyo gutera imiti mu gitondo.";
  let sprayingReasonEn = "Low wind velocity with no immediate storm front. Safe window for foliar applications.";

  if (windSpeed > 15 || rainToday > 5 || precipProb > 65) {
    sprayingStatus = 'POOR';
    sprayingScore = 25;
    sprayingReasonRw = `Umuyaga urakaze (${windSpeed} km/h) cyangwa imvura (${rainToday}mm) iratuma umuti utakara mu kirere cyangwa ugasukwa hasi.`;
    sprayingReasonEn = `High wind speeds (${windSpeed} km/h) or rainfall risk cause spray drift and immediate chemical wash-off.`;
  } else if (windSpeed > 10 || precipProb > 40) {
    sprayingStatus = 'MODERATE';
    sprayingScore = 60;
    sprayingReasonRw = `Tera umuti hakiri kare mu gitondo (6:00 - 8:30 AM) mbere y'uko umuyaga n'ubushyuhe bizamuka.`;
    sprayingReasonEn = `Spray in the early morning calm before midday thermal drafts and convective clouds build.`;
  }

  // 3. Fertilizer Wash-Off Risk (UREA / NPK)
  let fertilizerWashOffRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let fertilizerReasonRw = "Nta mvura nyinshi iteganyijwe; ifumbire ntabwo iri burohame cyangwa ngo itembane.";
  let fertilizerReasonEn = "Low rainfall probability ensures granular fertilizer remains absorbed at root depth.";

  if (rainToday > 15 || next3DaysRain > 35) {
    fertilizerWashOffRisk = 'HIGH';
    fertilizerReasonRw = `Icyitonderwa: Imvura ikaze iri kugwa cyangwa iteganyijwe (${rainToday}mm) iratwara ifumbire yo hejuru (UREA/NPK). Hagarika gushyiramo ifumbire uyu munsi.`;
    fertilizerReasonEn = `Warning: Heavy rain outlook (${rainToday}mm) will cause severe runoff and nutrient leaching. Postpone top-dressing.`;
  } else if (rainToday > 5 || precipProb > 50) {
    fertilizerWashOffRisk = 'MEDIUM';
    fertilizerReasonRw = `Tabira ifumbire hasi mu butaka (nibura 3-5cm) aho kuyisasira hejuru gusa.`;
    fertilizerReasonEn = `Incorporate fertilizer granules 3-5cm below topsoil rather than surface broadcasting.`;
  }

  // 4. Solar Grain Drying Suitability
  let dryingSuitability: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  let dryingHoursToday = 7;
  let dryingReasonRw = "Izuba riracyeye neza; anika ibigori, ibishyimbo n'ikawa ku mashitingi.";
  let dryingReasonEn = "Strong solar radiation window; ideal for open-air tarpaulin drying.";

  if (rainToday > 8 || precipProb > 60 || uv < 3) {
    dryingSuitability = 'LOW';
    dryingHoursToday = 2;
    dryingReasonRw = `Imvura n'ibihu byinshi; bika umusaruro mu nzu cyangwa ukoreshe ibyuma byumisha (Dryers) kwirinda Aflatoxin.`;
    dryingReasonEn = `Persistent overcast and rain showers. Protect harvested grains under shelter to prevent mold and mycotoxins.`;
  } else if (rainToday > 1 || precipProb > 30 || uv < 5) {
    dryingSuitability = 'MEDIUM';
    dryingHoursToday = 4;
    dryingReasonRw = `Anika ku zuba ariko ube hafi kuryegeranya niba ibicu byirabuye.`;
    dryingReasonEn = `Intermittent sunshine. Maintain readiness to tarp over if sudden afternoon showers appear.`;
  }

  // 5. Landslide & Erosion Risk
  let erosionRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  let erosionReasonRw = "Ubutaka bwifashe neza; amaterasi n'imiringoti biri mu mutekano.";
  let erosionReasonEn = "Stable ground conditions with baseline drainage capacity.";

  if (isHighland && (rainToday > 30 || next3DaysRain > 60)) {
    erosionRisk = 'CRITICAL';
    erosionReasonRw = `Iburira ry'Ikabije: Imisozi miremire ya ${location.name} ifite ibyago byo gusenyuka (Inkangu). Abaturage bari mu manegeka bagomba kuba maso.`;
    erosionReasonEn = `Critical Alert: Steep slopes in ${location.name} exceed saturation capacity. High risk of landslides.`;
  } else if (isHighland && (rainToday > 15 || next3DaysRain > 30)) {
    erosionRisk = 'HIGH';
    erosionReasonRw = `Imisozi ifite ububobere bwinshi; genzura niba imiringoti ifata amazi idasibye.`;
    erosionReasonEn = `Saturated high-altitude topsoil. Clear all contour ditches and retention trenches.`;
  } else if (rainToday > 20) {
    erosionRisk = 'MODERATE';
    erosionReasonRw = `Imigezi n'imibande bishobora kuzura; genzura imiyoboro y'amazi mu mirima.`;
    erosionReasonEn = `Valley bottoms and marshland plots vulnerable to localized flash pooling.`;
  }

  // 6. Disease & Pest Risk
  const lateBlightRisk: 'LOW' | 'MEDIUM' | 'HIGH' = (isHighland && weather.humidity > 75 && temp < 21) ? 'HIGH' : (weather.humidity > 65) ? 'MEDIUM' : 'LOW';
  const fallArmywormRisk: 'LOW' | 'MEDIUM' | 'HIGH' = (temp > 22 && weather.humidity < 70 && rainToday < 5) ? 'HIGH' : 'MEDIUM';

  return {
    plantingScore,
    plantingStatus,
    plantingReasonRw,
    plantingReasonEn,
    sprayingStatus,
    sprayingScore,
    sprayingReasonRw,
    sprayingReasonEn,
    fertilizerWashOffRisk,
    fertilizerReasonRw,
    fertilizerReasonEn,
    dryingSuitability,
    dryingHoursToday,
    dryingReasonRw,
    dryingReasonEn,
    erosionRisk,
    erosionReasonRw,
    erosionReasonEn,
    lateBlightRisk,
    fallArmywormRisk
  };
};
