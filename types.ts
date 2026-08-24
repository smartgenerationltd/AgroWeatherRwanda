export enum UserRole {
  Farmer = 'Farmer',           // Abahinzi (Primary)
  BusinessLeader = 'Trader',   // Abacuruzi (Secondary)
  LocalLeader = 'Leader',      // Abayobozi (Institutional)
}

export type Language = 'rw' | 'en';

export interface AgroEcoZone {
  code: string;
  nameRw: string;
  nameEn: string;
  altitudeRange: string;
  dominantCrops: string[];
  soilType: string;
  rainfallPattern: string;
}

export interface Location {
  id: string;
  name: string;
  province: 'Kigali' | 'Northern' | 'Southern' | 'Eastern' | 'Western';
  provinceRw: string;
  zone: string;
  lat: number;
  lon: number;
  altitudeMeters: number;
  stationName: string;
  dominantCrops: string[];
}

export interface WeatherCondition {
  main: string;
  description: string;
  descriptionEn: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  precipitation_chance: number;
  rainfall_mm: number;
  solar_radiation_uv: number;
  soil_moisture_percentage: number;
  soil_temp: number;
  evapotranspiration: number; // mm/day
  condition: WeatherCondition;
}

export interface ForecastDay {
  date: string;
  dayRw: string;
  dayEn: string;
  temp_max: number;
  temp_min: number;
  rainfall_mm: number;
  precipitation_probability: number;
  humidity: number;
  wind_speed: number;
  spraying_suitability: 'GOOD' | 'MODERATE' | 'POOR';
  planting_suitability: 'OPTIMAL' | 'FAIR' | 'WAIT';
  drying_suitability: 'HIGH' | 'MEDIUM' | 'LOW';
  condition: WeatherCondition;
}

export interface HistoricalDataPoint {
  date: string;
  temp: number;
  rainfall: number;
  soilMoisture: number;
}

export interface Alert {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  severity: 'warning' | 'danger' | 'info';
  category: 'RAIN' | 'LANDSLIDE' | 'DROUGHT' | 'PEST' | 'WIND';
  timestamp: string;
  affectedSectors?: string[];
}

export interface CropAdvisory {
  cropName: string;
  cropNameRw: string;
  icon: string;
  currentStage: string;
  currentStageRw: string;
  actionRequired: string;
  actionRequiredRw: string;
  status: 'optimal' | 'warning' | 'action_needed';
  waterNeed: 'Low' | 'Moderate' | 'High';
  waterNeedRw: 'Nke' | 'Iringaniye' | 'Nyinshi';
  pestRisk: string;
  pestRiskRw: string;
}

export interface MarketCommodity {
  id: string;
  name: string;
  nameRw: string;
  unit: string;
  currentPriceRwf: number;
  priceTrend: 'up' | 'down' | 'stable';
  changePercentage: number;
  dryingStatus: string;
  dryingStatusRw: string;
  transportRisk: 'Low' | 'Medium' | 'High';
  transportRiskRw: 'Muto' | 'Iringaniye' | 'Mwinshi';
}

export interface LeaderDisasterMetric {
  floodRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  floodRiskRw: 'Muto' | 'Iringaniye' | 'Mwinshi' | 'Ikabije';
  landslideRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  landslideRiskRw: 'Muto' | 'Iringaniye' | 'Mwinshi' | 'Ikabije';
  erosionVulnerability: string;
  erosionVulnerabilityRw: string;
  urgentAction: string;
  urgentActionRw: string;
  recommendedBroadcastSms: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  historical: HistoricalDataPoint[];
  alerts: Alert[];
  cropAdvisories: CropAdvisory[];
  marketCommodities: MarketCommodity[];
  leaderMetrics: LeaderDisasterMetric;
}
