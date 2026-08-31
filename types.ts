export enum UserRole {
  Farmer = 'Farmer',                 // Abahinzi (Smallholder & Commercial)
  Agronomist = 'Agronomist',         // Abajyanama n'Inzobere mu buhinzi
  Cooperative = 'Cooperative',       // Koperative z'Abahinzi
  BusinessLeader = 'Trader',         // Abacuruzi n'Abatunganya umusaruro
  LocalLeader = 'Leader',            // Abayobozi b'Inzego z'Ibanze (Umurenge/Akarere)
  Researcher = 'Researcher',         // Abashakashatsi (RAB / Universities)
  NGO = 'NGO',                       // Imiryango itari iya Leta
  Admin = 'Admin',                   // Abayobozi ba Sisitemu
}

export type Language = 'rw' | 'en' | 'fr';

export type NavigationTab = 
  | 'home' 
  | 'weather' 
  | 'farms' 
  | 'crops' 
  | 'ai-agronomist' 
  | 'alerts' 
  | 'calendar' 
  | 'learn' 
  | 'admin' 
  | 'profile';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  preferredLanguage: Language;
  province?: string;
  district?: string;
  sector?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Farm {
  id: string;
  ownerId: string;
  farmName: string;
  province: string;
  district: string;
  sector: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number;
  farmSizeHectares: number;
  soilType: string;
  irrigationType: 'Rainfed' | 'Canal/Marshland' | 'Drip/Sprinkler' | 'Pumping' | 'None';
  terraced: boolean;
  agroEcoZone?: string;
  createdAt: string;
  updatedAt: string;
}

export type CropGrowthStage = 
  | 'Land Preparation'
  | 'Planting'
  | 'Germination'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'Maturity'
  | 'Harvest';

export interface Crop {
  id: string;
  farmId: string;
  ownerId: string;
  cropType: string;
  cropNameRw: string;
  variety: string;
  season: 'Season A' | 'Season B' | 'Season C';
  plantingDate: string;
  expectedHarvestDate: string;
  growthStage: CropGrowthStage;
  acreage: number;
  healthStatus: 'Excellent' | 'Good' | 'Attention Needed' | 'Risk Alert';
  targetYieldKg?: number;
  waterNeed: 'Low' | 'Moderate' | 'High';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmingTask {
  id: string;
  ownerId: string;
  farmId?: string;
  cropId?: string;
  cropName?: string;
  title: string;
  titleRw: string;
  description: string;
  descriptionRw: string;
  dueDate: string;
  category: 'Planting' | 'Fertilizer' | 'Spraying' | 'Weeding' | 'Irrigation' | 'Scouting' | 'Harvesting' | 'Storage' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'postponed';
  weatherSuitability: 'optimal' | 'caution' | 'avoid';
  weatherReason?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  district?: string;
  cropContext?: string;
  createdAt: string;
  updatedAt: string;
}

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
  sectors?: string[];
}

export interface WeatherCondition {
  id?: number;
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
  visibilityKm?: number;
  airPressureHpa?: number;
  dewPoint?: number;
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
  category: 'RAIN' | 'LANDSLIDE' | 'DROUGHT' | 'PEST' | 'WIND' | 'HEAT' | 'DISEASE' | 'PLANTING' | 'HARVEST';
  timestamp: string;
  recommendedAction?: string;
  recommendedActionRw?: string;
  affectedSectors?: string[];
  read?: boolean;
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

export interface EducationArticle {
  id: string;
  category: string;
  titleRw: string;
  titleEn: string;
  titleFr?: string;
  summaryRw: string;
  summaryEn: string;
  summaryFr?: string;
  contentRw: string;
  contentEn: string;
  contentFr?: string;
  readTimeMinutes?: number;
  readingTimeMinutes?: number;
  icon?: string;
  tags?: string[];
  author?: string;
  sourceUrl?: string;
}

export type EducationalArticle = EducationArticle;
