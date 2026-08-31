import React, { useState } from 'react';
import { WeatherData, Location, Language, UserRole, UserProfile } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Send, 
  Share2, 
  Filter, 
  MapPin, 
  Info,
  Calendar,
  CloudRain
} from 'lucide-react';

interface AgriculturalAlertsViewProps {
  weatherData: WeatherData;
  location: Location;
  lang: Language;
  role: UserRole;
  user: UserProfile | null;
}

const AgriculturalAlertsView: React.FC<AgriculturalAlertsViewProps> = ({
  weatherData,
  location,
  lang,
  role,
  user
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [broadcastSector, setBroadcastSector] = useState(location.name);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const alerts = weatherData.alerts || [];

  const filteredAlerts = alerts.filter(a => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    return true;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastMessage('');
    }, 4000);
  };

  const isLeaderOrAdmin = role === UserRole.LocalLeader || role === UserRole.Agronomist || role === UserRole.Admin;

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>METEO RWANDA & MINAGRI EARLY WARNING SYSTEM</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {lang === 'rw' ? 'Iburira ry\'Ikirere n\'Ibyonnyi' : 'Agricultural & Climate Alerts'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'rw'
              ? 'Amakuru yihuse ku mvura nyinshi, inkangu, amapfa, nkongwa idasanzwe, n\'ibiciro by\'umusaruro.'
              : 'Real-time early warning bulletins for highland landslides, heavy rainfall runoff, and pest outbreaks.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedSeverity('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedSeverity === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'rw' ? 'Byose' : 'All'}
            </button>
            <button
              onClick={() => setSelectedSeverity('danger')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedSeverity === 'danger' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'rw' ? 'Ibikomeye' : 'Danger'}
            </button>
            <button
              onClick={() => setSelectedSeverity('warning')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedSeverity === 'warning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'rw' ? 'Iburira' : 'Warning'}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h2 className="text-sm font-bold text-white">
              {lang === 'rw' ? 'Nta burira bukomeye muri aka karere' : 'No Critical Alerts Reported'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'rw' ? 'Ikirere n\'ubuhinzi byifashe neza uyu munsi muri ' + location.name : 'Conditions in ' + location.name + ' are within normal parameters.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isDanger = alert.severity === 'danger';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-6 rounded-2xl border backdrop-blur-md transition-all space-y-4 shadow-lg ${
                  isDanger
                    ? 'bg-rose-950/40 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-950/40 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl text-lg ${
                      isDanger ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      isWarning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {isDanger ? <AlertTriangle className="w-5 h-5" /> : isWarning ? <Bell className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isDanger ? 'bg-rose-600 text-white' :
                          isWarning ? 'bg-amber-500 text-slate-950' :
                          'bg-sky-500 text-slate-950'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {alert.category}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        {lang === 'rw' ? alert.title : alert.titleEn}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {alert.validUntil ? `Valid until: ${alert.validUntil}` : 'Active Today'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {lang === 'rw' ? alert.message : alert.messageEn}
                </p>

                {/* Recommended Mitigation Action */}
                <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'rw' ? 'Ingamba zigomba gufatwa n\'umuhinzi (Required Action):' : 'Recommended Farmer Action:'}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    {lang === 'rw' ? alert.recommendedActionRw : alert.recommendedActionEn}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Institutional Leader / Agronomist SMS Broadcast Tool */}
      {isLeaderOrAdmin && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'rw' ? 'Kohereza Ubutumwa bw\'Iburira ku Bahinzi (SMS & Radio Broadcast)' : 'Institutional Alert Broadcast Console'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'rw'
                  ? 'Urubuga rw\'abayobozi b\'imirenge n\'aba Agronome bo kohereza ubutumwa bwa SMS ku bakuru b\'imidugudu'
                  : 'Transmit verified agrometeorological advisory broadcasts to community leaders and cooperatives'}
              </p>
            </div>
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'rw'
                  ? `Ubutumwa bw'iburira bwoherejwe neza ku bakuru b'imidugudu n'abahinzi 1,420 muri ${broadcastSector}!`
                  : `Broadcast advisory dispatched to 1,420 registered farmers across ${broadcastSector}!`}
              </span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Aho ubutumwa bugera (Target Sector/District)' : 'Target Area'}
                </label>
                <input
                  type="text"
                  value={broadcastSector}
                  onChange={(e) => setBroadcastSector(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Uburyo bwo gutangaza (Channel)' : 'Broadcast Channel'}
                </label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option>📱 SMS Alert (USSD *134# & Push)</option>
                  <option>📻 Radio Community Bulletin (Radio Rwanda / RC Musanze)</option>
                  <option>🤝 Umuganda Community Leader Dispatch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'rw' ? 'Ubutumwa bw\'Iburira (Kinyarwanda / English)' : 'Broadcast Message Content'}
              </label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder={
                  lang === 'rw'
                    ? "Urugero: Iburira rya Meteo Rwanda muri Musanze: Imvura nyinshi y'umurabyo iteganyijwe kuri uyu wa kabiri. Abahinzi basabwe gusibura imiringoti..."
                    : "Official advisory: Heavy runoff rains expected across hill slopes..."
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Ohereza Iburira (Broadcast Now)' : 'Dispatch Broadcast'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AgriculturalAlertsView;
