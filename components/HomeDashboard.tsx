import React from 'react';
import { 
  UserRole, 
  WeatherData, 
  Location, 
  Language, 
  UserProfile, 
  NavigationTab, 
  Farm, 
  Crop, 
  FarmingTask 
} from '../types';
import { RecommendationResult } from '../services/geminiService';
import { evaluateAgroDecisions } from '../services/agroDecisionEngine';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Sprout, 
  Tractor, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Bot,
  Thermometer,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile | null;
  weatherData: WeatherData;
  location: Location;
  lang: Language;
  recommendations: RecommendationResult | null;
  loadingRecommendations: boolean;
  onRefreshRecommendations: () => void;
  onNavigate: (tab: NavigationTab) => void;
  farms: Farm[];
  crops: Crop[];
  tasks: FarmingTask[];
  onOpenAuth: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  weatherData,
  location,
  lang,
  recommendations,
  loadingRecommendations,
  onRefreshRecommendations,
  onNavigate,
  farms,
  crops,
  tasks,
  onOpenAuth
}) => {
  const currentHour = new Date().getHours();
  const greeting = lang === 'rw'
    ? currentHour < 12 ? 'Mwaramutse' : currentHour < 17 ? 'Mwiriwe' : 'Mwirirwe'
    : lang === 'fr'
    ? currentHour < 18 ? 'Bonjour' : 'Bonsoir'
    : currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const userName = user ? user.fullName.split(' ')[0] : (lang === 'rw' ? 'Muhinzi' : 'Farmer');

  const decisions = evaluateAgroDecisions(weatherData.current, weatherData.forecast, location);
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const urgentAlerts = weatherData.alerts?.filter(a => a.severity === 'danger' || a.severity === 'warning') || [];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Location Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🇷🇼 {location.name} ({location.altitudeMeters}m) • {location.stationName}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, <span className="text-emerald-400">{userName}</span> 👋
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              {lang === 'rw'
                ? `Ikirere muri ${location.name} uyu munsi kiragaragaza ${weatherData.current.condition.description}. Ububobere bw'ubutaka buri kuri ${weatherData.current.soil_moisture_percentage}%.`
                : `Current conditions at ${location.name} report ${weatherData.current.condition.descriptionEn} with soil moisture at ${weatherData.current.soil_moisture_percentage}%.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-agronomist')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Baza AI Agronome' : 'Ask AI Agronomist'}</span>
            </button>

            <button
              onClick={() => onNavigate('weather')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-sm transition-all"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>{lang === 'rw' ? 'Iteganyagihe Ryose' : 'Detailed Weather'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Disaster / Agro Alert Banner */}
      {urgentAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-pulse-subtle">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                  {urgentAlerts[0].severity}
                </span>
                <h2 className="text-sm font-bold text-amber-200">
                  {lang === 'rw' ? urgentAlerts[0].title : urgentAlerts[0].titleEn}
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'rw' ? urgentAlerts[0].message : urgentAlerts[0].messageEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            {lang === 'rw' ? 'Ingamba zose' : 'View Action'}
          </button>
        </div>
      )}

      {/* 4-Pillar Decision Intelligence Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Planting Suitability */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'rw' ? 'Gutera Imbuto' : 'Planting Window'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
              decisions.plantingStatus === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              decisions.plantingStatus === 'FAIR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {decisions.plantingStatus}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2">
            {lang === 'rw' ? decisions.plantingReasonRw : decisions.plantingReasonEn}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'rw' ? 'Ububobere:' : 'Soil Moisture:'} {weatherData.current.soil_moisture_percentage}%</span>
            <span className="font-bold text-emerald-400">{decisions.plantingScore}/100</span>
          </div>
        </div>

        {/* 2. Spraying Suitability */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💨</span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'rw' ? 'Gutera Imiti' : 'Spraying Safety'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
              decisions.sprayingStatus === 'GOOD' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              decisions.sprayingStatus === 'MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {decisions.sprayingStatus}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2">
            {lang === 'rw' ? decisions.sprayingReasonRw : decisions.sprayingReasonEn}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'rw' ? 'Umuyaga:' : 'Wind:'} {weatherData.current.wind_speed} km/h</span>
            <span className="font-bold text-sky-400">{decisions.sprayingScore}/100</span>
          </div>
        </div>

        {/* 3. Fertilizer Wash-Off Risk */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧪</span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'rw' ? 'Ifumbire (Wash-off)' : 'Fertilizer Loss'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
              decisions.fertilizerWashOffRisk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              decisions.fertilizerWashOffRisk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {decisions.fertilizerWashOffRisk} RISK
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2">
            {lang === 'rw' ? decisions.fertilizerReasonRw : decisions.fertilizerReasonEn}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'rw' ? 'Imvura ya none:' : 'Rain today:'} {weatherData.current.rainfall_mm}mm</span>
            <span className="font-bold text-amber-400">{decisions.fertilizerWashOffRisk === 'LOW' ? 'SAFE' : 'CAUTION'}</span>
          </div>
        </div>

        {/* 4. Solar Grain Drying */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white hover:border-yellow-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'rw' ? 'Kwanika Umusaruro' : 'Solar Drying'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
              decisions.dryingSuitability === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              decisions.dryingSuitability === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {decisions.dryingSuitability}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2">
            {lang === 'rw' ? decisions.dryingReasonRw : decisions.dryingReasonEn}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'rw' ? 'Amasaha y\'izuba:' : 'Sun Hours:'} ~{decisions.dryingHoursToday}h</span>
            <span className="font-bold text-yellow-400">UV {weatherData.current.solar_radiation_uv}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Weather Telemetry + AI Farm Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Weather Telemetry Box */}
        <div className="lg:col-span-5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-white space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-5 h-5 text-sky-400" />
              <div>
                <h2 className="text-sm font-bold">{lang === 'rw' ? 'Uko Ikirere Cyifashe' : 'Live Station Telemetry'}</h2>
                <p className="text-[10px] text-slate-400">{location.stationName}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
              {weatherData.current.temp.toFixed(1)}°C
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Ubushyuhe' : 'Temperature'}</span>
              <span className="text-lg font-bold text-white">{weatherData.current.temp.toFixed(0)}°C</span>
              <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Byumvikana:' : 'Feels:'} {weatherData.current.feels_like.toFixed(0)}°C</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Ububobere bw\'Ubutaka' : 'Soil Moisture'}</span>
              <span className="text-lg font-bold text-emerald-400">{weatherData.current.soil_moisture_percentage}%</span>
              <span className="text-[10px] text-slate-400 block">{weatherData.current.soil_temp}°C at 10cm</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Imvura & Ibyago' : 'Rainfall & Chance'}</span>
              <span className="text-lg font-bold text-sky-400">{weatherData.current.rainfall_mm} mm</span>
              <span className="text-[10px] text-slate-400 block">{weatherData.current.precipitation_chance}% probability</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Umuyaga & Ububobere' : 'Wind & Humidity'}</span>
              <span className="text-lg font-bold text-amber-300">{weatherData.current.wind_speed} km/h</span>
              <span className="text-[10px] text-slate-400 block">{weatherData.current.humidity}% humidity</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{lang === 'rw' ? 'Reba Iteganyagihe ry\'Iminsi 7' : 'View 7-Day Agricultural Forecast'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Agro Advisory Briefing */}
        <div className="lg:col-span-7 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold">
                  {lang === 'rw' ? 'Inama y\'Ibyemezo ya Gemini AI & Meteo Rwanda' : 'AI Agro Advisory & Decision Briefing'}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {lang === 'rw' ? 'Yubakiye ku mabwiriza ya RAB & MINAGRI' : 'Grounded on RAB and Meteo Rwanda bulletins'}
                </p>
              </div>
            </div>

            <button
              onClick={onRefreshRecommendations}
              disabled={loadingRecommendations}
              className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-emerald-300 transition-all"
            >
              {loadingRecommendations ? '...' : (lang === 'rw' ? 'Vugurura' : 'Refresh')}
            </button>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 max-h-60 overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {recommendations?.text || (lang === 'rw' ? 'Inama z\'ubuhinzi ziri gutegurwa...' : 'Generating agricultural advisories...')}
          </div>

          {recommendations?.sources && recommendations.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">{lang === 'rw' ? 'Aho bikomoka:' : 'Sources:'}</span>
              {recommendations.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-sky-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <span>{s.title}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Farm Status & Quick Tasks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Registered Farms Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tractor className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {lang === 'rw' ? 'Imirima Yanjye' : 'My Farms'}
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded">
              {farms.length}
            </span>
          </div>

          <div className="space-y-2">
            {farms.slice(0, 2).map((farm) => (
              <div key={farm.id} className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-xs">
                <div className="font-semibold text-white">{farm.farmName}</div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                  <span>{farm.sector}, {farm.district}</span>
                  <span className="text-emerald-400 font-mono">{farm.farmSizeHectares} Ha</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('farms')}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold rounded-lg transition-colors"
          >
            {lang === 'rw' ? 'Cunga Imirima yose' : 'Manage All Farms'}
          </button>
        </div>

        {/* Registered Crops Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-teal-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {lang === 'rw' ? 'Ibihingwa Byatewe' : 'Active Crops'}
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-xs font-bold rounded">
              {crops.length}
            </span>
          </div>

          <div className="space-y-2">
            {crops.slice(0, 2).map((crop) => (
              <div key={crop.id} className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-xs">
                <div className="font-semibold text-white">{crop.cropNameRw || crop.cropType}</div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                  <span>Stage: <strong className="text-sky-300">{crop.growthStage}</strong></span>
                  <span className="text-emerald-400 font-mono">{crop.acreage} Ha</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('crops')}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg transition-colors"
          >
            {lang === 'rw' ? 'Kugenzura Ibihingwa' : 'Track Crop Stages'}
          </button>
        </div>

        {/* Pending Calendar Tasks */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {lang === 'rw' ? 'Imirimo Iteganyijwe' : 'Upcoming Tasks'}
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs font-bold rounded">
              {pendingTasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {pendingTasks.slice(0, 2).map((task) => (
              <div key={task.id} className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/40 text-xs">
                <div className="font-semibold text-white truncate">{task.titleRw || task.title}</div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                  <span>{task.dueDate}</span>
                  <span className="text-yellow-400 font-bold capitalize">{task.priority}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 text-xs font-semibold rounded-lg transition-colors"
          >
            {lang === 'rw' ? 'Fungura Kalandari' : 'Open Calendar'}
          </button>
        </div>
      </div>

      {/* Farmer Education Knowledge Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl flex-shrink-0">
            📚
          </div>
          <div>
            <h2 className="text-base font-bold">
              {lang === 'rw' ? 'Inyigisho z\'Ubuhinzi n\'Ikirere (Learn Center)' : 'Agricultural Knowledge & Climate-Smart Guides'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'rw' 
                ? 'Soma ku kurwanya nkongwa, gukoresha UREA, amaterasi y\'imisozi, no kwanika umusaruro nta Aflatoxin.' 
                : 'Actionable field guides on pest scouting, fertilizer wash-off prevention, terracing, and post-harvest drying.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('learn')}
          className="flex-shrink-0 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
        >
          {lang === 'rw' ? 'Soma Inyigisho' : 'Browse Guides'}
        </button>
      </div>

      {/* Institutional Partner Logos & National Agricultural Framework */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-extrabold tracking-wide uppercase text-emerald-400">
              {lang === 'rw' ? 'Inzego Z\'Ubuhinzi n\'Iteganyagihe mu Rwanda' : 'National Agrometeorology & Institutional Framework'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'rw' 
                ? 'Amakuru yizewe ashingiye ku kigo cy\'iteganyagihe Meteo Rwanda, MINAGRI na RAB' 
                : 'Verified telemetry and agricultural standards backed by Meteo Rwanda, MINAGRI, and RAB'}
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            🇷🇼 Rwanda AgriTech Mission
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. AgroWeather Rwanda Logo */}
          <div className="bg-slate-950/60 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-sky-500/30 p-1 flex-shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-sky-500/10">
              <img 
                src="/favicon.svg" 
                alt="AgroWeather Rwanda Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white group-hover:text-sky-300 transition-colors">
                AgroWeather Rwanda
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'rw' ? 'Ihuriro ry\'Umuhinzi & AI' : 'Farmer AI & Telemetry Platform'}
              </div>
            </div>
          </div>

          {/* 2. Meteo Rwanda Logo */}
          <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-blue-500/30 p-1 flex-shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/10">
              <img 
                src="/meteo_rwanda_logo.svg" 
                alt="Meteo Rwanda Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white group-hover:text-blue-300 transition-colors">
                Meteo Rwanda
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'rw' ? 'Sitasiyo z\'Ikirere (30 Districts)' : 'National Meteorological Agency'}
              </div>
            </div>
          </div>

          {/* 3. MINAGRI Logo */}
          <div className="bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30 p-1 flex-shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-emerald-500/10">
              <img 
                src="/minagri_logo.svg" 
                alt="MINAGRI Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition-colors">
                MINAGRI
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'rw' ? 'Minisiteri y\'Ubuhinzi n\'Ubworozi' : 'Ministry of Agriculture & Resources'}
              </div>
            </div>
          </div>

          {/* 4. RAB Logo */}
          <div className="bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/30 p-1 flex-shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-amber-500/10">
              <img 
                src="/rab_logo.svg" 
                alt="RAB Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                RAB
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {lang === 'rw' ? 'Ikigo cy\'Ubuhinzi n\'Ubworozi' : 'Agriculture & Animal Resources Board'}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeDashboard;
