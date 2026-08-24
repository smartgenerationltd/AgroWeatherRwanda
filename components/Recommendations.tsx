import React, { useState } from 'react';
import { UserRole, WeatherData, Location, Language } from '../types';
import { RecommendationResult } from '../services/geminiService';
import { Sparkles, RefreshCw, ExternalLink, Bot, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';

interface RecommendationsProps {
  recommendations: RecommendationResult | null;
  loading: boolean;
  userRole: UserRole;
  weatherData: WeatherData;
  location: Location;
  lang: Language;
  onRefresh: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  loading,
  userRole,
  location,
  lang,
  onRefresh,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioReadout = () => {
    if (!recommendations?.text) return;
    setIsPlaying(!isPlaying);
    if (!isPlaying && 'speechSynthesis' in window) {
      const cleanText = recommendations.text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-sky-500 rounded-xl text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base sm:text-lg">
                {lang === 'rw' ? 'Isesengura n\'Inama za AI (Gemini Decision Engine)' : 'AI Agrometeorological Climate Intelligence'}
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'rw'
                ? `Inama zishingiye ku bipimo bya Meteo Rwanda muri ${location.name}`
                : `Tailored actionable guidance based on ${location.name} sensor observations`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAudioReadout}
            disabled={loading || !recommendations}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlaying ? (lang === 'rw' ? 'Ihagarike' : 'Stop') : (lang === 'rw' ? 'Soma (Voice)' : 'Listen')}</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? (lang === 'rw' ? 'Gusesengura...' : 'Analyzing...') : (lang === 'rw' ? 'Vugurura Inama' : 'Refresh AI')}</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <Bot className="w-5 h-5 text-sky-400 absolute inset-0 m-auto" />
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {lang === 'rw' 
              ? 'AI irimo gusesengura amakuru ya Meteo Rwanda n\'amabwiriza ya RAB...' 
              : 'Synthesizing Meteo Rwanda agrometeorological feeds with RAB agronomic advisories...'}
          </p>
          <span className="text-xs text-slate-500">Connecting to Gemini 3.7 Intelligence</span>
        </div>
      ) : recommendations ? (
        <div className="space-y-5">
          {/* Formatted Markdown/Text rendering */}
          <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal space-y-3">
            {recommendations.text}
          </div>

          {/* Grounding & Verified Sources */}
          {recommendations.sources && recommendations.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'rw' ? 'Inkomoko y\'Amakuru Yemejwe:' : 'Verified Grounding Sources:'}
              </span>
              {recommendations.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-sky-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Recommendations;
