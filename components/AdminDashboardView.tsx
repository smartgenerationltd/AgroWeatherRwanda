import React from 'react';
import { Language, UserRole, UserProfile } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Tractor, 
  Sprout, 
  ShieldAlert, 
  Radio, 
  Download, 
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface AdminDashboardViewProps {
  lang: Language;
  user: UserProfile | null;
}

const PROVINCE_DATA = [
  { province: 'Amajyaruguru (North)', hectares: 14200, farmers: 28400 },
  { province: 'Uburengerazuba (West)', hectares: 18900, farmers: 35100 },
  { province: 'Amajyepfo (South)', hectares: 16500, farmers: 31200 },
  { province: 'Iburasirazuba (East)', hectares: 24800, farmers: 41800 },
  { province: 'Umujyi wa Kigali', hectares: 3200, farmers: 7400 },
];

const CROP_DISTRIBUTION = [
  { name: 'Irish Potatoes', value: 35, color: '#10b981' },
  { name: 'Maize (Hybrid)', value: 28, color: '#06b6d4' },
  { name: 'Beans (Climbing & Bush)', value: 22, color: '#f59e0b' },
  { name: 'Arabica Coffee', value: 10, color: '#8b5cf6' },
  { name: 'Vegetables & Rice', value: 5, color: '#ec4899' },
];

const QUERY_TRENDS = [
  { month: 'Jan', queries: 4200, alerts: 18 },
  { month: 'Feb', queries: 6800, alerts: 24 },
  { month: 'Mar', queries: 12400, alerts: 42 },
  { month: 'Apr', queries: 15900, alerts: 38 },
  { month: 'May', queries: 11200, alerts: 19 },
  { month: 'Jun', queries: 7800, alerts: 12 },
];

const STATIONS_STATUS = [
  { name: 'Musanze Agro-Station', altitude: '1850m', status: 'Online (100%)', latency: '24ms', lastSync: '1 min ago' },
  { name: 'Rubavu Gisenyi Station', altitude: '1520m', status: 'Online (100%)', latency: '19ms', lastSync: '2 mins ago' },
  { name: 'Nyagatare Eastern Station', altitude: '1380m', status: 'Online (99.8%)', latency: '31ms', lastSync: '1 min ago' },
  { name: 'Huye Southern Station', altitude: '1720m', status: 'Online (100%)', latency: '22ms', lastSync: 'Just now' },
  { name: 'Kigali Kanombe Airport', altitude: '1490m', status: 'Online (100%)', latency: '12ms', lastSync: 'Just now' },
  { name: 'Nyamagabe High Altitude', altitude: '2150m', status: 'Online (98.5%)', latency: '45ms', lastSync: '4 mins ago' },
];

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ lang, user }) => {
  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-blue-500/40 p-1 shadow-md">
              <img src="/meteo_rwanda_logo.svg" alt="Meteo Rwanda" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/40 p-1 shadow-md">
              <img src="/minagri_logo.svg" alt="MINAGRI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-amber-500/40 p-1 shadow-md">
              <img src="/rab_logo.svg" alt="RAB" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold rounded-full flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>MINAGRI • METEO RWANDA • RAB NATIONAL AGRI-ANALYTICS</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              {lang === 'rw' ? 'Ubusesenguzi bw\'Ubuhinzi n\'Ikirere mu Gihugu' : 'National Agro-Climate Analytics'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'rw'
                ? 'Imibare y\'abahinzi, ubuso buhinze mu ntara zose, ibyemezo bya AI, n\'ibipimo bya sitasiyo za Meteo Rwanda.'
                : 'Institutional monitoring dashboard for nationwide agricultural telemetry and decision engine performance.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => alert(lang === 'rw' ? 'Raporo ya PDF iri gutunganywa...' : 'Generating institutional analytical summary...')}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all shadow flex-shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'rw' ? 'Gukuramo Raporo (CSV/PDF)' : 'Export Report'}</span>
        </button>
      </div>

      {/* Top National Stat KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{lang === 'rw' ? 'Abahinzi Banditswe' : 'Registered Farmers'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">143,900+</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +12.4% this season
          </span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{lang === 'rw' ? 'Ubuso buhinzwe' : 'Cultivated Area'}</span>
            <Tractor className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">77,600 Ha</div>
          <span className="text-[10px] text-slate-400">30 Districts tracked</span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{lang === 'rw' ? 'Ibibazo bya AI' : 'AI Agro Queries'}</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">58,300+</div>
          <span className="text-[10px] text-indigo-300">Grounded via Gemini 2.5</span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{lang === 'rw' ? 'Sitasiyo za Meteo' : 'Weather Stations'}</span>
            <Radio className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-400">30 / 30</div>
          <span className="text-[10px] text-teal-300">100% telemetry online</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Province Cultivation Area (Bar Chart) */}
        <div className="lg:col-span-7 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">
            {lang === 'rw' ? 'Ubuso buhinzwe mu Ntara (Hectares)' : 'Cultivated Area by Province (Hectares)'}
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROVINCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="province" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="hectares" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution (Pie Chart) */}
        <div className="lg:col-span-5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">
            {lang === 'rw' ? 'Ibihingwa Bikunze Guhingwa mu Rwanda (%)' : 'National Crop Share (%)'}
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CROP_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CROP_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {CROP_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Station Telemetry Status Table */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white">
              {lang === 'rw' ? 'Imikorere ya Sitasiyo za Meteo Rwanda (Live Nodes)' : 'Meteo Rwanda Live Weather Station Nodes'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">Sync interval: 60s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Station Name</th>
                <th className="pb-3 font-semibold">Altitude</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Latency</th>
                <th className="pb-3 font-semibold">Last Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {STATIONS_STATUS.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 font-semibold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{st.name}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{st.altitude}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {st.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-sky-300">{st.latency}</td>
                  <td className="py-3 text-slate-400">{st.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardView;
