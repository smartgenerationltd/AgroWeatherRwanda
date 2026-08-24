import React, { useState } from 'react';
import { WeatherData, Location, Language } from '../types';
import { RWANDA_AGRICULTURAL_SEASONS } from '../constants';
import { 
  Sprout, 
  FlaskConical, 
  Bug, 
  SunMedium, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Layers, 
  PhoneCall,
  ChevronRight
} from 'lucide-react';

interface FarmerDecisionsProps {
  weatherData: WeatherData;
  location: Location;
  lang: Language;
}

const FarmerDecisions: React.FC<FarmerDecisionsProps> = ({ weatherData, location, lang }) => {
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedSms, setCopiedSms] = useState<boolean>(false);

  const { current, forecast, cropAdvisories } = weatherData;
  const activeCrop = cropAdvisories[selectedCropIndex] || cropAdvisories[0];

  const isRainyToday = current.rainfall_mm > 5;
  const washOffRisk = isRainyToday ? 'HIGH' : current.rainfall_mm > 0 ? 'MEDIUM' : 'LOW';
  const plantingSuitability = current.soil_moisture_percentage >= 60 && current.soil_moisture_percentage <= 85 ? 'OPTIMAL' : current.soil_moisture_percentage < 50 ? 'DRY_WAIT' : 'TOO_WET';

  const handleCopyUSSD = () => {
    navigator.clipboard.writeText(`*134# -> AgroWeather ${location.name}`);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  const toggleAudioSimulation = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        lang === 'rw' 
          ? `Iteganyagihe ry'ubuhinzi muri ${location.name}. Ubushyuhe ni dogere ${current.temp.toFixed(0)}. Ububobere bw'ubutaka buri ku gipimo cya mirongo ${current.soil_moisture_percentage} ku ijana. ${activeCrop.actionRequiredRw}`
          : `AgroWeather Advisory for ${location.name}. Current temperature is ${current.temp.toFixed(0)} degrees. Soil moisture is at ${current.soil_moisture_percentage} percent. ${activeCrop.actionRequired}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Primary Farmer Decision Priority */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-3xl">
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                  {lang === 'rw' ? 'Icyiciro cy\'Imena (Primary)' : 'Primary User Role'}
                </span>
                <span className="text-xs text-emerald-200">
                  {location.name} • {location.altitudeMeters}m Alt
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {lang === 'rw' ? 'Gufata Ibyemezo by\'Ubuhinzi muri iki Cyumweru' : 'Weekly Farming Decision Action Matrix'}
              </h2>
            </div>
          </div>

          {/* Quick Voice & USSD SMS Advisory for rural farmers */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={toggleAudioSimulation}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 animate-pulse' 
                  : 'bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/40'
              }`}
              title={lang === 'rw' ? 'Tega amatwi inama z\'ubuhinzi (Voice Readout)' : 'Listen to voice agro advisory'}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? (lang === 'rw' ? 'Kuvuga...' : 'Playing...') : (lang === 'rw' ? 'Tega Amatwi (Voice)' : 'Audio Readout')}</span>
            </button>

            <button
              onClick={handleCopyUSSD}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/40 transition-colors"
              title={lang === 'rw' ? 'Kanda hano ukoporore kode ya USSD/SMS' : 'Copy USSD/SMS code'}
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedSms ? (lang === 'rw' ? 'Byakoporowe!' : 'Copied!') : '*134# SMS'}</span>
            </button>
          </div>
        </div>

        {/* 4 Critical Agro-Meteorology Decision Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Planting & Sowing Window */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  {lang === 'rw' ? 'Igihe cyo Gutera' : 'Planting Window'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  plantingSuitability === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {plantingSuitability === 'OPTIMAL' ? (lang === 'rw' ? 'CYIZA CYANE' : 'OPTIMAL') : (lang === 'rw' ? 'TEGEREZA' : 'WAIT')}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {current.soil_moisture_percentage}%
                <span className="text-xs font-normal text-emerald-300 ml-1.5">{lang === 'rw' ? 'Ububobere' : 'Moisture'}</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                {plantingSuitability === 'OPTIMAL'
                  ? (lang === 'rw' ? 'Ubutaka bufite ububobere buhagije bwo gutera ibishyimbo n\'ibigori.' : 'Soil moisture is optimal for germination of legumes & cereals.')
                  : (lang === 'rw' ? 'Ububobere buracyari buke. Tegereza imvura yisukiranye.' : 'Soil moisture deficit. Await sustained seasonal rains.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'rw' ? 'Icyiciro cya RAB cyemejwe' : 'RAB Verified Soil Target'}
            </div>
          </div>

          {/* Card 2: Fertilizer Application & Wash-off Risk */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  {lang === 'rw' ? 'Ifumbire (UREA/NPK)' : 'Fertilizer Timing'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  washOffRisk === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {washOffRisk === 'HIGH' ? (lang === 'rw' ? 'IBYAGO BYINSHI' : 'WASH-OFF RISK') : (lang === 'rw' ? 'BYEMEWE' : 'SAFE WINDOW')}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {current.rainfall_mm.toFixed(0)} mm
                <span className="text-xs font-normal text-emerald-300 ml-1.5">{lang === 'rw' ? 'Imvura ya none' : 'Today\'s Rain'}</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                {washOffRisk === 'HIGH'
                  ? (lang === 'rw' ? 'Witera UREA uyu munsi: amazi menshi y\'isuri ashobora kuyitembana.' : 'Do not top-dress UREA today: high runoff will cause fertilizer leaching.')
                  : (lang === 'rw' ? 'Igihe cyiza cyo gushyiramo ifumbire no kubagara.' : 'Safe atmospheric window to broadcast or bury fertilizer.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/40 text-[11px] text-cyan-300 font-medium">
              {lang === 'rw' ? 'Kwirinda igihombo cy\'amafaranga' : 'Prevents nutrient investment loss'}
            </div>
          </div>

          {/* Card 3: Pest & Disease Warning */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-amber-400" />
                  {lang === 'rw' ? 'Ibyonnyi & Indwara' : 'Pest / Disease Risk'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {current.humidity > 75 ? (lang === 'rw' ? 'HEJURU (85%)' : 'HIGH (85%)') : (lang === 'rw' ? 'IRINGANIYE' : 'MODERATE')}
                </span>
              </div>
              <div className="text-xl font-bold text-amber-200 truncate">
                {location.altitudeMeters > 1800 ? (lang === 'rw' ? 'Umusonga w\'Ibirayi' : 'Late Blight') : (lang === 'rw' ? 'Nkongwa idasanzwe' : 'Fall Armyworm')}
              </div>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                {location.altitudeMeters > 1800
                  ? (lang === 'rw' ? 'Ubushuhe bwo mu misozi butera imiyege y\'ibirayi. Tera umuti wagenwe mbere y\'imvura.' : 'High highland humidity triggers Phytophthora late blight in potato fields.')
                  : (lang === 'rw' ? 'Genzura imitima y\'ibigori kureba niba nta nkongwa irimo.' : 'Scout maize whorls for early signs of Spodoptera frugiperda.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/40 text-[11px] text-amber-300 font-medium">
              {lang === 'rw' ? 'Genzura umurima mu gitondo' : 'Morning field scouting advised'}
            </div>
          </div>

          {/* Card 4: Sun Drying & Post-Harvest Window */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-400/60 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <SunMedium className="w-4 h-4 text-yellow-400" />
                  {lang === 'rw' ? 'Kwanika Umusaruro' : 'Sun Drying Window'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  forecast[0].drying_suitability === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {forecast[0].drying_suitability === 'HIGH' ? (lang === 'rw' ? 'IZUBA RYIZA' : 'FAVORABLE') : (lang === 'rw' ? 'GUTEGEREZA' : 'POOR DRYING')}
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {current.solar_radiation_uv.toFixed(1)} UV
                <span className="text-xs font-normal text-emerald-300 ml-1.5">{lang === 'rw' ? 'Imirasire' : 'Solar Index'}</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                {forecast[0].drying_suitability === 'HIGH'
                  ? (lang === 'rw' ? 'Anika ibishyimbo n\'ibigori ku mashitingi ngo bigere munsi ya 13.5%.' : 'Favorable solar hours for grain drying to prevent mould.')
                  : (lang === 'rw' ? 'Zinga amashitingi hakiri kare ngo imvura itangiza ibinyampeke.' : 'Intermittent showers expected. Keep protective covers ready.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/40 text-[11px] text-yellow-300 font-medium">
              {lang === 'rw' ? 'Kwirinda uruhumbu (Aflatoxin)' : 'Aflatoxin prevention standard'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Crop Specific Agronomic Advisory */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-sky-100 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm">🌾</span>
              {lang === 'rw' ? 'Inama Zihariye ku Buri Gihingwa (Crop Advisories)' : 'Crop Specific Action Protocols'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' ? `Bishingiye ku butaka n'akarere ka ${location.name}` : `Tailored for ${location.name} agro-ecological zone`}
            </p>
          </div>

          {/* Crop Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {cropAdvisories.map((crop, idx) => (
              <button
                key={crop.cropName}
                onClick={() => setSelectedCropIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCropIndex === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{lang === 'rw' ? crop.cropNameRw : crop.cropName.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Crop Action Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-xl p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-200/60">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-white rounded-xl shadow-sm border border-emerald-100">
                {activeCrop.icon}
              </span>
              <div>
                <h4 className="text-xl font-bold text-emerald-950">
                  {lang === 'rw' ? activeCrop.cropNameRw : activeCrop.cropName}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-emerald-800 font-medium">
                  <span>{lang === 'rw' ? 'Icyiciro cy\'Ubuzima:' : 'Current Growth Stage:'}</span>
                  <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    {lang === 'rw' ? activeCrop.currentStageRw : activeCrop.currentStage}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="text-right">
                <span className="text-slate-500 block">{lang === 'rw' ? 'Amazi akenewe:' : 'Water Demand:'}</span>
                <span className="font-bold text-emerald-900">
                  {lang === 'rw' ? activeCrop.waterNeedRw : activeCrop.waterNeed}
                </span>
              </div>
              <div className="w-px h-8 bg-emerald-200" />
              <div>
                <span className="text-slate-500 block">{lang === 'rw' ? 'Icyonnyi cy\'ingenzi:' : 'Primary Pest:'}</span>
                <span className="font-bold text-amber-900">
                  {lang === 'rw' ? activeCrop.pestRiskRw : activeCrop.pestRisk}
                </span>
              </div>
            </div>
          </div>

          {/* Action Recommendation Callout */}
          <div className="mt-4 bg-white/80 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500 text-white rounded-lg mt-0.5">
                <ChevronRight className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                  {lang === 'rw' ? 'Icyemezo n\'Igikorwa Gikwiriye Gukorwa Uyu Munsi:' : 'Recommended Field Action Today:'}
                </h5>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {lang === 'rw' ? activeCrop.actionRequiredRw : activeCrop.actionRequired}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rwanda Agricultural Season Context */}
      <div className="bg-sky-950/80 backdrop-blur-md border border-sky-600/30 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h4 className="font-bold text-white text-base">
              {lang === 'rw' ? 'Ibihembwe by\'Ihinga mu Rwanda (National Agricultural Seasons)' : 'Rwandan Agricultural Seasons Reference'}
            </h4>
          </div>
          <span className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full border border-sky-400/30 font-semibold">
            MINAGRI & RAB Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {RWANDA_AGRICULTURAL_SEASONS.map((season, i) => (
            <div 
              key={season.nameRw} 
              className={`p-3.5 rounded-xl border transition-all ${
                i === 1 
                  ? 'bg-sky-800/50 border-sky-400/60 shadow-md ring-1 ring-sky-400/30' 
                  : 'bg-sky-900/30 border-sky-700/40 text-sky-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{lang === 'rw' ? season.nameRw : season.nameEn}</span>
                {i === 1 && (
                  <span className="text-[9px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.5 rounded">
                    {lang === 'rw' ? 'KURI UBU' : 'CURRENT'}
                  </span>
                )}
              </div>
              <div className="text-sky-300 font-medium mb-1.5">{season.periodRw}</div>
              <p className="text-sky-100/80 leading-relaxed">{lang === 'rw' ? season.focusRw : season.rainfallExpected}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDecisions;
