import React, { useMemo } from 'react';
import { WeatherCondition } from '../types';

interface SkyBackgroundProps {
  weatherCondition?: WeatherCondition;
  isRainy?: boolean;
}

const SkyBackground: React.FC<SkyBackgroundProps> = ({ weatherCondition, isRainy = false }) => {
  const isRain = isRainy || weatherCondition?.main === 'Rain' || weatherCondition?.main === 'Thunderstorm';
  const isStorm = weatherCondition?.main === 'Thunderstorm';
  const isClear = weatherCondition?.main === 'Clear';

  // Generate rain drops
  const raindrops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 2.5 + Math.random() * 2)}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${0.6 + Math.random() * 0.4}s`,
      opacity: 0.3 + Math.random() * 0.5,
      height: `${12 + Math.random() * 16}px`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Sky Gradient Base */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          isStorm 
            ? 'bg-gradient-to-b from-slate-700 via-sky-800 to-slate-900' 
            : isRain 
            ? 'bg-gradient-to-b from-sky-400 via-sky-600 to-indigo-900' 
            : 'bg-gradient-to-b from-sky-400 via-sky-300 via-sky-200 to-emerald-50/40'
        }`}
      />

      {/* Sun & Light Flare (Visible in Clear / Mild Clouds) */}
      {!isStorm && (
        <div className="absolute top-6 right-16 sm:right-32 w-64 h-64 md:w-96 md:h-96 rounded-full pointer-events-none">
          {/* Outer Sun Glow */}
          <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          {/* Inner Golden Sun Core */}
          <div className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-100 shadow-[0_0_80px_rgba(251,191,36,0.8)] opacity-90" />
          
          {/* Shimmering Sun Rays */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-yellow-200/20 blur-xl animate-spin" style={{ animationDuration: '25s' }} />
        </div>
      )}

      {/* Layer 1: Distant Slow Clouds */}
      <div className="absolute top-10 -left-64 w-[200vw] h-48 opacity-40 animate-cloud-slow">
        <svg className="w-full h-full text-white/50 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 Q150,10 300,45 T600,30 T900,50 T1200,35 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Layer 2: Medium Clouds (Fluffy SVG drifting) */}
      <div className="absolute top-24 -left-96 w-[180vw] h-64 opacity-60 animate-cloud-medium">
        <svg className="w-full h-full text-white/70 fill-current" viewBox="0 0 1400 150" preserveAspectRatio="none">
          <path d="M0,80 C100,30 220,20 320,60 C420,10 580,20 680,70 C780,20 940,30 1040,65 C1150,15 1300,35 1400,80 L1400,150 L0,150 Z" />
        </svg>
      </div>

      {/* Layer 3: Closer Faster Clouds */}
      <div className="absolute top-36 -left-48 w-[160vw] h-56 opacity-50 animate-cloud-fast">
        <svg className="w-full h-full text-white/80 fill-current" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,50 Q200,10 400,55 T800,40 T1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>

      {/* Soaring Birds Animation in Sunny Sky */}
      {isClear && (
        <div className="absolute top-28 left-1/4 opacity-60 animate-birds-flight">
          <svg className="w-8 h-4 text-sky-900 fill-current" viewBox="0 0 40 20">
            <path d="M0,10 Q10,0 20,10 Q30,0 40,10 Q30,6 20,10 Q10,6 0,10 Z" />
          </svg>
        </div>
      )}

      {/* Raindrops Animation */}
      {isRain && (
        <div className="absolute inset-0 overflow-hidden">
          {raindrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute bg-gradient-to-b from-white/30 to-blue-200/80 rounded-full animate-rainfall"
              style={{
                left: drop.left,
                top: '-20px',
                width: '1.5px',
                height: drop.height,
                opacity: drop.opacity,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                animationIterationCount: 'infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning Flash for Stormy Weather */}
      {isStorm && (
        <div className="absolute inset-0 bg-white/15 animate-lightning pointer-events-none" />
      )}

      {/* Rwanda "Land of 1,000 Hills" (Igihugu cy'Imisozi Igihumbi) Terraced Silhouette Landscape */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-72 pointer-events-none overflow-hidden">
        {/* Far Background Blue-Green Ridge */}
        <svg className="absolute bottom-0 w-full h-full text-emerald-900/20 fill-current" viewBox="0 0 1200 240" preserveAspectRatio="none">
          <path d="M0,140 Q250,50 500,120 T1000,80 Q1100,100 1200,140 L1200,240 L0,240 Z" />
        </svg>
        {/* Mid-range Rwandan Terraced Hills */}
        <svg className="absolute bottom-0 w-full h-40 sm:h-56 text-emerald-800/30 fill-current" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,100 Q180,30 380,80 T780,50 Q980,100 1200,70 L1200,200 L0,200 Z" />
        </svg>
        {/* Foreground Rich Lush Hills with Terrace Lines */}
        <svg className="absolute bottom-0 w-full h-28 sm:h-40 text-emerald-950/40 fill-current" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path d="M0,80 Q220,10 460,60 T920,40 Q1060,70 1200,50 L1200,160 L0,160 Z" />
        </svg>
      </div>

      {/* Light Mist / Horizon Blur */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />
    </div>
  );
};

export default SkyBackground;
