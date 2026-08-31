import React from 'react';
import { UserRole, Language } from '../types';
import { USER_ROLES_CONFIG } from '../constants';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import AgroWeatherLogo from './AgroWeatherLogo';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, lang, onLanguageChange }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-8 px-4 relative z-10">
      {/* Title & Introduction with Official Symbols */}
      <div className="text-center max-w-3xl mx-auto mb-8 flex flex-col items-center">
        <div className="mb-5">
          <AgroWeatherLogo size="xl" lang={lang} variant="light" />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-md border border-sky-200 px-4 py-1.5 rounded-full text-xs font-bold text-sky-900 mb-4 shadow-sm">
          <span>🇷🇼</span>
          <span>{lang === 'rw' ? 'Ihuriro ry\'Iteganyagihe n\'Ubuhinzi mu Rwanda' : 'Rwanda Climate-Smart Agrometeorology Platform'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <p className="text-base sm:text-lg text-slate-800 font-medium max-w-2xl mx-auto leading-relaxed">
          {lang === 'rw'
            ? 'Guha abahinzi b\'u Rwanda inama zifatika z\'iteganyagihe rya Meteo Rwanda na AI kugira ngo bafate ibyemezo bikwiriye byo gutera, gushyira ifumbire, gusarura no kurinda ibihingwa.'
            : 'AI-powered climate-smart decision-support platform turning localized Meteo Rwanda data into practical, season-ready farming actions.'}
        </p>

        {/* Language switch button */}
        <div className="mt-4">
          <button
            onClick={() => onLanguageChange(lang === 'rw' ? 'en' : 'rw')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/60 hover:bg-white text-slate-700 border border-slate-300/80 transition-all shadow-sm"
          >
            <span>{lang === 'rw' ? '🇷🇼 Ikinyarwanda (Hindura muri English)' : '🇬🇧 English (Switch to Ikinyarwanda)'}</span>
          </button>
        </div>
      </div>

      {/* Role Selection Cards (Prioritized Order) */}
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block border border-white/50">
            {lang === 'rw' ? 'Hitamo icyiciro urimo kugira ngo utangire' : 'Select your user category to access tailored decision tools'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {USER_ROLES_CONFIG.map((config) => {
            const isPrimary = config.priority === 1;
            return (
              <div
                key={config.role}
                onClick={() => onSelectRole(config.role)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer shadow-xl group border text-left ${
                  isPrimary
                    ? 'bg-gradient-to-b from-emerald-900/90 via-teal-900/90 to-emerald-950/95 border-emerald-400/60 ring-2 ring-emerald-400/40 transform hover:-translate-y-1 hover:shadow-2xl text-white'
                    : 'bg-white/85 backdrop-blur-lg hover:bg-white border-white/80 hover:border-sky-300 transform hover:-translate-y-1 hover:shadow-2xl text-slate-900'
                }`}
              >
                {/* Priority Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-2 rounded-2xl bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    {config.icon}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isPrimary
                        ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lang === 'rw' ? config.tagRw : config.tagEn}
                  </span>
                </div>

                <div>
                  <h3 className={`text-2xl font-black mb-2 ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
                    {lang === 'rw' ? config.titleRw : config.titleEn}
                  </h3>
                  <p className={`text-xs sm:text-sm mb-5 leading-relaxed ${isPrimary ? 'text-emerald-100/90' : 'text-slate-600'}`}>
                    {lang === 'rw' ? config.descriptionRw : config.descriptionEn}
                  </p>

                  {/* Bullet features */}
                  <div className="space-y-2 mb-6">
                    {config.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPrimary ? 'text-emerald-400' : 'text-sky-600'}`} />
                        <span className={isPrimary ? 'text-emerald-100' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <div className="pt-4 border-t border-white/15 mt-auto">
                  <button
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isPrimary
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-900 hover:bg-sky-600 text-white shadow-sm'
                    }`}
                  >
                    <span>{lang === 'rw' ? 'Tangira Nka ' + config.titleRw : 'Launch ' + config.titleEn}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-10 text-center text-xs text-slate-700 font-medium">
        <span>🇷🇼 Rwanda Meteorology Agency (Meteo Rwanda) • MINAGRI • RAB Agro-Advisories</span>
      </div>
    </div>
  );
};

export default RoleSelector;
