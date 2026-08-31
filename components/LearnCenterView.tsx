import React, { useState } from 'react';
import { EducationalArticle, Language } from '../types';
import { EDUCATIONAL_LIBRARY } from '../services/educationData';
import { 
  BookOpen, 
  Search, 
  Tag, 
  ExternalLink, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Sprout, 
  Layers, 
  ShieldCheck, 
  Compass, 
  BookMarked 
} from 'lucide-react';

interface LearnCenterViewProps {
  lang: Language;
}

const CATEGORIES = [
  { id: 'ALL', labelRw: 'Byose', labelEn: 'All Guides' },
  { id: 'CLIMATE_SMART', labelRw: 'Guhangana n\'Imihindagurikire', labelEn: 'Climate-Smart' },
  { id: 'FERTILIZER', labelRw: 'Ifumbire n\'Ubutaka', labelEn: 'Fertilizer & Soil' },
  { id: 'PEST_MANAGEMENT', labelRw: 'Kurwanya Nkongwa n\'Indwara', labelEn: 'Pest & Disease' },
  { id: 'POST_HARVEST', labelRw: 'Kwanika & Guhunika', labelEn: 'Post-Harvest' },
  { id: 'SOIL_CONSERVATION', labelRw: 'Amaterasi n\'Imiringoti', labelEn: 'Soil & Terracing' }
];

const LearnCenterView: React.FC<LearnCenterViewProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  const filteredArticles = EDUCATIONAL_LIBRARY.filter(article => {
    if (selectedCategory !== 'ALL' && article.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRw = article.titleRw.toLowerCase().includes(q) || article.summaryRw.toLowerCase().includes(q);
      const matchEn = article.titleEn.toLowerCase().includes(q) || article.summaryEn.toLowerCase().includes(q);
      return matchRw || matchEn;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>RAB & MINAGRI FARMER KNOWLEDGE REPOSITORY</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {lang === 'rw' ? 'Isomero ry\'Ubuhinzi n\'Ikirere' : 'Agricultural Knowledge & Learning Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'rw'
              ? 'Inyigisho zifatika ku gukoresha ifumbire, amaterasi y\'imisozi, kurwanya nkongwa idasanzwe, no kwanika umusaruro.'
              : 'Certified agronomic training modules and field best practices adapted for Rwandan agro-ecological conditions.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'rw' ? 'Shakisha inyigisho...' : 'Search agro guides...'}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 shadow-inner"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'rw' ? cat.labelRw : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-teal-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-lg flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {article.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{article.readingTimeMinutes} min read</span>
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                {lang === 'rw' ? article.titleRw : article.titleEn}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {lang === 'rw' ? article.summaryRw : article.summaryEn}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{article.author}</span>
              <span className="text-teal-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                <span>{lang === 'rw' ? 'Soma Byose' : 'Read Guide'}</span>
                <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-teal-950 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {activeArticle.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
                  {lang === 'rw' ? activeArticle.titleRw : activeArticle.titleEn}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  By {activeArticle.author} • {activeArticle.readingTimeMinutes} min practical reading
                </p>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {lang === 'rw' ? activeArticle.contentRw : activeArticle.contentEn}

              {activeArticle.sourceUrl && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Inkomoko yemewe:</span>
                  <a
                    href={activeArticle.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-teal-300 hover:text-white"
                  >
                    <span>RAB Official Bulletin</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                {lang === 'rw' ? 'Funga' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LearnCenterView;
