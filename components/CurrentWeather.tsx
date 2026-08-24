import React from 'react';
import { CurrentWeather as CurrentWeatherType, Location, Language } from '../types';
import { WeatherIcon } from './WeatherIcons';
import { Droplets, Wind, Thermometer, Sun, Compass, Gauge } from 'lucide-react';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  location: Location;
  lang: Language;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, location, lang }) => {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
      {/* Top Bar: Station status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest">
              {lang === 'rw' ? 'Sitasiyo y\'Iteganyagihe Ikora' : 'Active Weather Station'}
            </h2>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {location.stationName}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>{location.name}</span>
            <span className="text-sm font-normal text-slate-400">
              ({location.provinceRw}, {location.altitudeMeters}m)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-400/30 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>{lang === 'rw' ? 'AMAKURU YA NYAYO (Meteo Rwanda)' : 'LIVE METEO RWANDA FEED'}</span>
          </div>
        </div>
      </div>

      {/* Main Temperature & Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Main Temp & Icon */}
        <div className="md:col-span-6 flex items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 text-sky-400 flex-shrink-0 filter drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]">
            <WeatherIcon iconName={data.condition.icon} />
          </div>
          <div>
            <div className="text-6xl sm:text-7xl font-black tracking-tighter text-white">
              {data.temp.toFixed(0)}
              <span className="text-3xl font-light text-sky-300">°C</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-sky-200 capitalize mt-1">
              {lang === 'rw' ? data.condition.description : data.condition.descriptionEn}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {lang === 'rw' ? `Uko byumvikana: ${data.feels_like.toFixed(0)}°C` : `Feels like: ${data.feels_like.toFixed(0)}°C`}
            </div>
          </div>
        </div>

        {/* Right: Key Agro Metrics */}
        <div className="md:col-span-6 grid grid-cols-3 gap-2.5">
          {/* Soil Moisture */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Ububobere' : 'Soil Moisture'}</div>
            <div className="text-lg font-black text-emerald-300">{data.soil_moisture_percentage}%</div>
          </div>

          {/* Rain Today */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-sky-400 mb-1">
              <Gauge className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Imvura (mm)' : 'Rain Today'}</div>
            <div className="text-lg font-black text-sky-300">{data.rainfall_mm.toFixed(1)} <span className="text-[10px] font-normal">mm</span></div>
          </div>

          {/* Wind Speed */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-yellow-400 mb-1">
              <Wind className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Umuyaga' : 'Wind'}</div>
            <div className="text-lg font-black text-yellow-300">{data.wind_speed.toFixed(1)} <span className="text-[10px] font-normal">km/h</span></div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-indigo-400 mb-1">
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Ubushuhe' : 'Humidity'}</div>
            <div className="text-lg font-black text-indigo-300">{data.humidity}%</div>
          </div>

          {/* Solar Radiation */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Izuba (UV)' : 'Solar UV'}</div>
            <div className="text-lg font-black text-amber-300">{data.solar_radiation_uv.toFixed(1)}</div>
          </div>

          {/* Evapotranspiration */}
          <div className="bg-slate-950/70 border border-slate-700/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center text-teal-400 mb-1">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{lang === 'rw' ? 'Ubwumure' : 'Evapo (ET0)'}</div>
            <div className="text-lg font-black text-teal-300">{data.evapotranspiration} <span className="text-[10px] font-normal">mm</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
