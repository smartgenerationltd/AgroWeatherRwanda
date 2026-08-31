import React from 'react';

interface AgroWeatherLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  lang?: 'rw' | 'en';
  className?: string;
  variant?: 'dark' | 'light' | 'transparent';
}

export const AgroWeatherLogo: React.FC<AgroWeatherLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  lang = 'rw',
  className = '',
  variant = 'dark',
}) => {
  // Dimension maps
  const dimensionMap = {
    sm: { box: 'w-8 h-8', icon: 32, text: 'text-base', subtext: 'text-[9px]', badge: 'text-[8px] px-1 py-0.2' },
    md: { box: 'w-11 h-11', icon: 44, text: 'text-lg sm:text-xl', subtext: 'text-[10px] sm:text-xs', badge: 'text-[9px] px-1.5 py-0.5' },
    lg: { box: 'w-14 h-14', icon: 56, text: 'text-2xl sm:text-3xl', subtext: 'text-xs sm:text-sm', badge: 'text-[10px] px-2 py-0.5' },
    xl: { box: 'w-20 h-20', icon: 80, text: 'text-3xl sm:text-4xl', subtext: 'text-sm sm:text-base', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Visual Emblem Symbol */}
      <div 
        className={`relative ${currentSize.box} rounded-2xl flex-shrink-0 flex items-center justify-center p-0.5 shadow-lg group transition-transform duration-300 hover:scale-105 ${
          variant === 'light' 
            ? 'bg-gradient-to-tr from-sky-400 via-emerald-400 to-amber-300 shadow-sky-500/20 ring-1 ring-sky-300' 
            : 'bg-gradient-to-tr from-emerald-500 via-sky-500 to-amber-400 shadow-emerald-950/40 ring-1 ring-white/20'
        }`}
      >
        <svg 
          viewBox="0 0 64 64" 
          className="w-full h-full rounded-[14px] overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`rwSky_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <radialGradient id={`rwSun_${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id={`agLeaf_${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>

            <linearGradient id={`rwHills_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <linearGradient id={`agRain_${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Sky Canvas */}
          <rect width="64" height="64" rx="14" fill={`url(#rwSky_${size})`} />

          {/* Rwanda Golden Sun with Radiant Rays (Top Right) */}
          <g transform="translate(42, 17)">
            <circle cx="0" cy="0" r="11" fill="none" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="2, 2.5" opacity="0.85" />
            <circle cx="0" cy="0" r="7.5" fill={`url(#rwSun_${size})`} />
          </g>

          {/* Meteorology Rain Cloud */}
          <path 
            d="M16 28 C16 24 19 21 23 21 C24.5 18 28 16 32 17 C35.5 18 38 21 38.5 24 C41.5 24 44 26.5 44 29.5 C44 32.5 41.5 35 38.5 35 L19.5 35 C17.5 35 16 33.5 16 31.5 Z" 
            fill="#ffffff" 
            fillOpacity="0.95"
          />

          {/* Rain Drops */}
          <path d="M21 38 L19.5 42 A1.2 1.2 0 0 0 21.8 42.8 L22.5 38 Z" fill={`url(#agRain_${size})`} />
          <path d="M28 38 L26.5 43 A1.2 1.2 0 0 0 28.8 43.8 L29.5 38 Z" fill={`url(#agRain_${size})`} />
          <path d="M35 38 L33.5 42 A1.2 1.2 0 0 0 35.8 42.8 L36.5 38 Z" fill={`url(#agRain_${size})`} />

          {/* Rolling Rwandan Green Hills */}
          <path d="M0 46 Q18 36 36 44 T64 40 L64 64 L0 64 Z" fill={`url(#rwHills_${size})`} opacity="0.95" />
          <path d="M0 53 Q24 44 48 51 T64 49 L64 64 L0 64 Z" fill="#042f2e" />

          {/* Rising Agricultural Sprout / Coffee-Tea Leaf */}
          <g transform="translate(32, 48)">
            <path d="M0 6 Q1 0 0 -13" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M0 -5 C5 -12 14 -11 14 -2 C14 4 6 5 0 -3 Z" fill={`url(#agLeaf_${size})`} />
            <path d="M0 0 C-4 -5 -11 -4 -11 2 C-11 6 -4 7 0 1 Z" fill={`url(#agLeaf_${size})`} />
            <circle cx="8" cy="-4" r="1.1" fill="#ffffff" opacity="0.9" />
          </g>
        </svg>

        {/* Small Rwandan Flag Dot */}
        <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-slate-900 border border-white/40 rounded-full px-1 py-0.2 shadow-sm text-[9px] leading-none select-none">
          🇷🇼
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${currentSize.text} ${variant === 'light' ? 'text-slate-900' : 'text-white'}`}>
              AgroWeather <span className="text-sky-400">Rwanda</span>
            </span>
            <span className={`font-black rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 ${currentSize.badge}`}>
              Meteo AI
            </span>
          </div>

          {showTagline && (
            <p className={`font-medium leading-tight ${currentSize.subtext} ${variant === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
              {lang === 'rw' 
                ? 'Iteganyagihe ry\'Ubuhinzi • Meteo Rwanda & RAB' 
                : 'Climate-Smart Agrometeorology • Meteo Rwanda & RAB'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AgroWeatherLogo;
