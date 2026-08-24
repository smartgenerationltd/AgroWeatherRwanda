import React from 'react';
import { WeatherAlert, Language } from '../types';
import { AlertTriangle, Info, AlertOctagon, Bell } from 'lucide-react';

interface AlertsProps {
  alerts: WeatherAlert[];
  lang: Language;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, lang }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isSevere = alert.severity === 'Severe';
        const isModerate = alert.severity === 'Moderate';

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex items-start gap-3.5 ${
              isSevere
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-100 ring-1 ring-rose-500/30'
                : isModerate
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-100'
                : 'bg-sky-950/80 border-sky-500/50 text-sky-100'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              isSevere ? 'bg-rose-500/20 text-rose-400' : isModerate ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
            }`}>
              {isSevere ? <AlertOctagon className="w-5 h-5 animate-pulse" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  {lang === 'rw' ? alert.titleRw : alert.titleEn}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    isSevere ? 'bg-rose-500 text-white' : isModerate ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-slate-950'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {alert.validUntil}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-200">
                {lang === 'rw' ? alert.descriptionRw : alert.descriptionEn}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-white/90 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>{lang === 'rw' ? 'Ingamba: ' + alert.actionRw : 'Action: ' + alert.actionEn}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Alerts;
