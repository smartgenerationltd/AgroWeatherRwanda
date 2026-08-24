import React from 'react';
import { UserRole, Location, Language } from '../types';
import { USER_ROLES_CONFIG } from '../constants';
import { MapPin, Globe, Sparkles, CloudSun } from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  currentLocation: Location;
  locations: Location[];
  lang: Language;
  onLocationChange: (location: Location) => void;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: Language) => void;
  onOpenRoleModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userRole,
  currentLocation,
  locations,
  lang,
  onLocationChange,
  onRoleChange,
  onLanguageChange,
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl text-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-yellow-400 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              🇷🇼
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AgroWeather</span>
                <span className="text-sky-400">Rwanda</span>
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Meteo AI
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {lang === 'rw' 
                ? 'Iteganyagihe ry\'Ubuhinzi Bwubakiye ku Mihindagurikire y\'Ikirere (Climate-Smart Agriculture)' 
                : 'AI-Powered Climate-Smart Agriculture Decision Support'}
            </p>
          </div>
        </div>

        {/* User Role Navigation Pills (Prioritized Order) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-white/10 w-full lg:w-auto">
          {USER_ROLES_CONFIG.map((config) => {
            const isActive = userRole === config.role;
            return (
              <button
                key={config.role}
                onClick={() => onRoleChange(config.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-600 text-white shadow-md ring-1 ring-white/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{config.icon}</span>
                <span>{lang === 'rw' ? config.titleRw : config.titleEn.split(' ')[0]}</span>
                {config.priority === 1 && (
                  <span className="text-[9px] bg-emerald-400 text-slate-950 font-black px-1 rounded ml-0.5">
                    1st
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Location & Language Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* District Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="flex items-center bg-slate-800/90 border border-slate-700 hover:border-sky-400 rounded-xl px-3 py-1.5 transition-all text-xs">
              <MapPin className="w-3.5 h-3.5 text-sky-400 mr-2 flex-shrink-0" />
              <select
                value={currentLocation.id}
                onChange={(e) => {
                  const loc = locations.find((l) => l.id === e.target.value);
                  if (loc) onLocationChange(loc);
                }}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-4"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.name} ({loc.provinceRw})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === 'rw' ? 'en' : 'rw')}
            className="flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-300 transition-all flex-shrink-0"
            title="Hindura Ururimi / Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'rw' ? 'RW' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
