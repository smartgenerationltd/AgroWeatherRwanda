import React, { useState } from 'react';
import { WeatherData, Location, Language } from '../types';
import { 
  ShieldAlert, 
  Send, 
  Check, 
  Copy, 
  MapPin, 
  Users, 
  Waves, 
  Mountain, 
  Shovel, 
  Radio, 
  BellRing 
} from 'lucide-react';

interface LeaderDecisionsProps {
  weatherData: WeatherData;
  location: Location;
  lang: Language;
}

const LeaderDecisions: React.FC<LeaderDecisionsProps> = ({ weatherData, location, lang }) => {
  const { leaderMetrics, current, alerts } = weatherData;
  const [broadcastText, setBroadcastText] = useState<string>(leaderMetrics.recommendedBroadcastSms);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const isHighland = location.altitudeMeters > 1800;

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSimulated = () => {
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Institutional User Role Priority */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-blue-950/90 to-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-indigo-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-3xl">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-indigo-400 text-indigo-950 px-2.5 py-0.5 rounded-full">
                  {lang === 'rw' ? 'Inzego z\'Ibanze n\'Abashinzwe Ibiza (Institutional)' : 'Institutional Leadership Dashboard'}
                </span>
                <span className="text-xs text-indigo-200">
                  {location.name} Administrative District
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {lang === 'rw' ? 'Gucunga Ibiza, Kurengera Amaterasi & Gutangaza Iburira' : 'Disaster Early-Warning & Watershed Protection Console'}
              </h2>
            </div>
          </div>
        </div>

        {/* 3 High-Impact Leadership Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Landslide / Inkangu Hazard Index */}
          <div className="bg-indigo-950/70 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-rose-400" />
                {lang === 'rw' ? 'Ibyago by\'Inkangu (Landslides)' : 'Landslide Hazard Index'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                leaderMetrics?.landslideRiskLevel === 'Severe' ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {lang === 'rw' ? (leaderMetrics?.landslideRiskRw || 'MUTO').toUpperCase() : (leaderMetrics?.landslideRiskLevel || 'LOW').toUpperCase()}
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {isHighland ? (lang === 'rw' ? 'Imisozi Ihanamye Yinjije Amazi' : 'High Slope Soil Saturation') : (lang === 'rw' ? 'Imisozi Ifite Umutekano' : 'Stable Slope Terrain')}
            </div>
            <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed">
              {isHighland 
                ? (lang === 'rw' ? 'Ububobere bwo hejuru mu butaka burongera ibyago by\'inkangu mu mirenge y\'imisozi. Kwimura abaturage bari mu manegeka.' : 'Continuous rainfall saturates steep slope mantle. Monitor vulnerable steep settlement clusters.')
                : (lang === 'rw' ? 'Ubutaka buracyari butuje nta nkomyi y\'inkangu yitezwe muri uyu mwanya.' : 'Low risk of mass movements in lower undulating topography.')}
            </p>
          </div>

          {/* Card 2: Valley Flash Flood Vulnerability */}
          <div className="bg-indigo-950/70 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                {lang === 'rw' ? 'Ibyago by\'Imyuzure (Floods)' : 'Flood Vulnerability'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                {lang === 'rw' ? (leaderMetrics?.floodRiskRw || 'MUTO').toUpperCase() : (leaderMetrics?.floodRiskLevel || 'LOW').toUpperCase()}
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {current.rainfall_mm > 15 ? (lang === 'rw' ? 'Imibande Yuzuyemo Amazi' : 'Valley Marsh Runoff') : (lang === 'rw' ? 'Imiyoboro Iracyakora Neza' : 'Controlled Drainage')}
            </div>
            <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed">
              {lang === 'rw'
                ? 'Genzura imigezi n\'imiyoboro y\'amazi mu bishanga by\'umuceri n\'imboga kugira ngo amazi atarenga inkombe.'
                : 'Scout culverts and drainage canals in agricultural marshlands to prevent crop inundation.'}
            </p>
          </div>

          {/* Card 3: Soil Erosion & Terrace Care */}
          <div className="bg-indigo-950/70 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Shovel className="w-4 h-4 text-amber-400" />
                {lang === 'rw' ? 'Amaterasi n\'Imiringoti' : 'Terrace Maintenance'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                UMUGANDA PRIORITY
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {lang === 'rw' ? 'Gusibura Imiyoboro' : 'Erosion Control'}
            </div>
            <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed">
              {lang === 'rw' ? leaderMetrics.erosionVulnerabilityRw : leaderMetrics.erosionVulnerability}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Community Broadcast SMS & Radio Dispatch Generator */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-sky-100 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'rw' ? 'Iteganyirizwa ry\'Ubutumwa bwa SMS & Radiyo ku Baturage' : 'Official Emergency SMS & Community Radio Broadcast Generator'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'rw' ? 'Ubutumwa buhita bwoherezwa ku Bakuru b\'Imidugudu, Abajyanama b\'Ubuhinzi, n\'Abaturage' : 'Rapid dispatch template for village chiefs (Abakuru b\'Imidugudu) and agronomists'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-3 py-1 rounded-full">
            MINAGRI / MIDIMAR Format
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {lang === 'rw' ? 'Ubutumwa bugenewe koherezwa (Editable Text):' : 'Official Broadcast Message Payload:'}
          </label>
          <textarea
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'rw' ? 'Bigeze ku baturage bo mu mirenge yose ya ' : 'Targets all registered farmers in '} <strong>{location.name}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'rw' ? 'Byakoporowe!' : 'Copied!') : (lang === 'rw' ? 'Koporora Ubutumwa' : 'Copy Message')}</span>
              </button>

              <button
                onClick={handleSendSimulated}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{sentSuccess ? (lang === 'rw' ? 'Bwoherejwe!' : 'Broadcast Dispatched!') : (lang === 'rw' ? 'Ohereza SMS mu Karere' : 'Dispatch Broadcast')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Sector Actions Checklist */}
      <div className="bg-sky-950/80 backdrop-blur-md border border-sky-600/30 rounded-2xl p-5 text-white shadow-xl">
        <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-indigo-400" />
          {lang === 'rw' ? 'Ingamba z\'Ihuse ku Bayobozi b\'Imirenge n\'Utugari' : 'Priority Action Checklist for Sector Officials'}
        </h4>

        <div className="bg-sky-900/40 border border-sky-700/50 rounded-xl p-4 space-y-2.5 text-xs text-sky-100">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed font-medium">
              {lang === 'rw' ? leaderMetrics.urgentActionRw : leaderMetrics.urgentAction}
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed font-medium">
              {lang === 'rw' 
                ? 'Kugenzura sitasiyo z\'amazi n\'imiyoboro y\'imvura mu bigo by\'amashuri no mu masoko y\'ubuhinzi.'
                : 'Inspect rainwater harvesting catchments and school/market drainage outlets.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDecisions;
