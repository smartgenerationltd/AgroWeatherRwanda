import React, { useState } from 'react';
import { WeatherData, Location, Language, WeatherCondition } from '../types';
import { AGRO_ECO_ZONES } from '../constants';
import CurrentWeather from './CurrentWeather';
import WeeklyForecast from './WeeklyForecast';
import HistoricalChart from './HistoricalChart';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Compass, 
  Mountain, 
  Activity, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Gauge, 
  CloudLightning,
  Eye,
  ThermometerSun
} from 'lucide-react';

interface WeatherIntelligenceViewProps {
  weatherData: WeatherData;
  location: Location;
  lang: Language;
  onSelectConditionOverride: (cond: string) => void;
  activeConditionOverride: string;
}

const WeatherIntelligenceView: React.FC<WeatherIntelligenceViewProps> = ({
  weatherData,
  location,
  lang,
  onSelectConditionOverride,
  activeConditionOverride
}) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'soil' | 'radar' | 'zones'>('forecast');
  const zoneInfo = AGRO_ECO_ZONES[location.zone] || AGRO_ECO_ZONES['volcanic'];

  return (
    <div className="space-y-6 text-white">
      
      {/* Top Station Overview Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>METEO RWANDA LIVE RADAR & TELEMETRY</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {location.name} <span className="text-sky-400">({location.altitudeMeters}m)</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {location.stationName} • {location.provinceRw} • {zoneInfo.nameRw} ({zoneInfo.code})
          </p>
        </div>

        {/* Sky Simulation & Radar Switchers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => onSelectConditionOverride('DEFAULT')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeConditionOverride === 'DEFAULT' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Meteo Live
            </button>
            <button
              onClick={() => onSelectConditionOverride('SUNNY')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                activeConditionOverride === 'SUNNY' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-300" />
              <span>{lang === 'rw' ? 'Izuba' : 'Sunny'}</span>
            </button>
            <button
              onClick={() => onSelectConditionOverride('RAIN')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                activeConditionOverride === 'RAIN' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3 h-3 text-sky-200" />
              <span>{lang === 'rw' ? 'Imvura' : 'Rain'}</span>
            </button>
            <button
              onClick={() => onSelectConditionOverride('STORM')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                activeConditionOverride === 'STORM' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudLightning className="w-3 h-3 text-yellow-300" />
              <span>{lang === 'rw' ? 'Inkuba' : 'Storm'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Current Weather & 7-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CurrentWeather 
            data={weatherData.current} 
            location={location} 
            lang={lang} 
          />
        </div>
        <div className="lg:col-span-5">
          <WeeklyForecast 
            data={weatherData.forecast} 
            lang={lang} 
          />
        </div>
      </div>

      {/* Advanced Agricultural Agrometeorological Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <Droplets className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Ububobere bw\'ubutaka' : 'Soil Moisture'}</span>
          <span className="text-xl font-black text-emerald-400">{weatherData.current.soil_moisture_percentage}%</span>
          <span className="text-[10px] text-slate-500 block mt-1">Depth: 10-30cm</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <ThermometerSun className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Ubushyuhe bw\'itaka' : 'Soil Temp'}</span>
          <span className="text-xl font-black text-amber-300">{weatherData.current.soil_temp}°C</span>
          <span className="text-[10px] text-slate-500 block mt-1">Optimum root zone</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Imirasire y\'Izuba' : 'Solar UV'}</span>
          <span className="text-xl font-black text-yellow-400">{weatherData.current.solar_radiation_uv} UV</span>
          <span className="text-[10px] text-slate-500 block mt-1">Drying Index</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <Activity className="w-5 h-5 text-sky-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Gukama kw\'amazi' : 'Evapotranspiration'}</span>
          <span className="text-xl font-black text-sky-300">{weatherData.current.evapotranspiration} mm</span>
          <span className="text-[10px] text-slate-500 block mt-1">mm / day loss</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <Wind className="w-5 h-5 text-teal-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Umuyaga' : 'Wind Speed'}</span>
          <span className="text-xl font-black text-teal-300">{weatherData.current.wind_speed} km/h</span>
          <span className="text-[10px] text-slate-500 block mt-1">Direction: ESE</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center">
          <Mountain className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
          <span className="text-[11px] text-slate-400 block">{lang === 'rw' ? 'Uburebure' : 'Altitude'}</span>
          <span className="text-xl font-black text-indigo-300">{location.altitudeMeters}m</span>
          <span className="text-[10px] text-slate-500 block mt-1">Highland Zone</span>
        </div>

      </div>

      {/* Agro-Ecological Profile for Selected Rwanda Zone */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold">
                {lang === 'rw' ? 'Imiterere y\'Akarere k\'Ubuhinzi (Agro-Ecological Zone)' : 'Agro-Ecological Zone Profile'}
              </h2>
              <p className="text-[10px] text-slate-400">{zoneInfo.nameRw} ({zoneInfo.nameEn})</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded">
            {zoneInfo.code}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-slate-400 block font-semibold">{lang === 'rw' ? 'Ibihingwa Bikunze Kwerera Hano:' : 'Dominant Crop Systems:'}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {zoneInfo.dominantCrops.map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-700 text-emerald-300 rounded text-[11px] font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-slate-400 block font-semibold">{lang === 'rw' ? 'Imiterere y\'Ubutaka:' : 'Soil Classification:'}</span>
            <p className="text-slate-200 font-medium">{zoneInfo.soilType}</p>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-slate-400 block font-semibold">{lang === 'rw' ? 'Imiterere y\'Imvura:' : 'Rainfall Pattern:'}</span>
            <p className="text-slate-200 font-medium">{zoneInfo.rainfallPattern}</p>
          </div>
        </div>
      </div>

      {/* 30-Day Agrometeorological Climate History Chart */}
      <HistoricalChart 
        data={weatherData.historical} 
        lang={lang} 
      />

    </div>
  );
};

export default WeatherIntelligenceView;
