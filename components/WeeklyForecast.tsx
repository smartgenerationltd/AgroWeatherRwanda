import React from 'react';
import { ForecastDay, Language } from '../types';
import { WeatherIcon } from './WeatherIcons';
import { Calendar, CloudRain, Droplet } from 'lucide-react';

interface WeeklyForecastProps {
  data: ForecastDay[];
  lang: Language;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ data, lang }) => {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>{lang === 'rw' ? 'Iteganyagihe ry\'Iminsi 7' : '7-Day Agro Forecast'}</span>
          </h3>
          <span className="text-[10px] text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
            Meteo Rwanda
          </span>
        </div>

        <div className="space-y-3">
          {data.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 transition-colors text-xs"
            >
              {/* Day Name */}
              <div className="w-24">
                <span className={`font-bold block ${index === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {lang === 'rw' ? day.dayRw : day.dayEn}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {day.date.split('-').slice(1).join('/')}
                </span>
              </div>

              {/* Weather Icon & Rain */}
              <div className="flex items-center gap-2 w-20 justify-center">
                <div className="w-6 h-6 text-sky-400">
                  <WeatherIcon iconName={day.condition.icon} />
                </div>
                {day.rainfall_mm > 0 && (
                  <span className="text-[10px] text-sky-300 font-mono flex items-center">
                    <CloudRain className="w-2.5 h-2.5 mr-0.5" />
                    {day.rainfall_mm.toFixed(0)}m
                  </span>
                )}
              </div>

              {/* Spraying & Agro Suitability Badge */}
              <div className="hidden sm:block">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    day.spraying_suitability === 'GOOD'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : day.spraying_suitability === 'MODERATE'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {lang === 'rw' 
                    ? (day.spraying_suitability === 'GOOD' ? 'IMVURA NKE' : day.spraying_suitability === 'MODERATE' ? 'IRINGANIYE' : 'IMVURA NYINSHI') 
                    : (day.spraying_suitability === 'GOOD' ? 'SPRAY SAFE' : day.spraying_suitability === 'MODERATE' ? 'MODERATE' : 'RAIN WASH')}
                </span>
              </div>

              {/* Temperature max/min */}
              <div className="text-right w-16">
                <span className="text-white font-bold">{day.temp_max.toFixed(0)}°</span>
                <span className="text-slate-400 ml-1.5">{day.temp_min.toFixed(0)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400 leading-relaxed">
        {lang === 'rw'
          ? '💡 Inama: Iminsi ifite ibimenyetso by\'icyatsi ni yo myiza yo gutera imiti n\'ifumbire yo hejuru.'
          : '💡 Note: Green indicator days represent the safest windows for foliar spray and granular fertilizer.'}
      </div>
    </div>
  );
};

export default WeeklyForecast;
