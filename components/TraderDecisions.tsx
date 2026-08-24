import React from 'react';
import { WeatherData, Location, Language } from '../types';
import { 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  PackageCheck, 
  Warehouse, 
  DollarSign, 
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

interface TraderDecisionsProps {
  weatherData: WeatherData;
  location: Location;
  lang: Language;
}

const TraderDecisions: React.FC<TraderDecisionsProps> = ({ weatherData, location, lang }) => {
  const { current, forecast, marketCommodities } = weatherData;
  const isRainy = current.rainfall_mm > 5;

  const transportCorridors = [
    {
      routeRw: `${location.name} ➔ Umujyi wa Kigali (Nyabugogo)`,
      routeEn: `${location.name} ➔ Kigali Wholesale Hub (Nyabugogo)`,
      status: isRainy ? 'WARNING' : 'CLEAR',
      statusRw: isRainy ? 'IBURIRA: Ibinyabiziga bishobora gukererwa' : 'NZIZA: Nta nkomyi mu muhanda',
      statusEn: isRainy ? 'Caution: Wet road conditions & heavy rain' : 'Clear: Safe transit conditions',
      riskFactorRw: isRainy ? 'Kunyereka ku misozi n\'imyuzure mu bishanga' : 'Umuhanda wifashe neza',
      estimatedDelay: isRainy ? '+45 min' : 'On Time'
    },
    {
      routeRw: `${location.name} ➔ Masoko y\'Uturere Duturanye`,
      routeEn: `${location.name} ➔ Regional Cross-District Markets`,
      status: 'CLEAR',
      statusRw: 'NZIZA: Ubwikorezi bw\'umusaruro buragenda neza',
      statusEn: 'Clear: Optimal commodity transport',
      riskFactorRw: 'Umuvuduko mwiza w\'amakamyo n\'imodoka zitwaye imboga',
      estimatedDelay: 'On Time'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Secondary Trader Decision Priority */}
      <div className="bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-amber-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/30 text-3xl">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
                  {lang === 'rw' ? 'Icyiciro cya Kabiri (Secondary)' : 'Secondary User Role'}
                </span>
                <span className="text-xs text-amber-200">
                  {location.name} Agri-Business Hub
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {lang === 'rw' ? 'Iteganyagihe ry\'Ubucuruzi, Ubwikorezi & Ubuhunikiro' : 'Agri-Trade, Logistics & Storage Decision Engine'}
              </h2>
            </div>
          </div>
        </div>

        {/* 3 Core Trade Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Road & Transport Safety */}
          <div className="bg-amber-950/70 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                {lang === 'rw' ? 'Umutekano w\'Imihanda' : 'Corridor Logistics'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isRainy ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isRainy ? (lang === 'rw' ? 'IBURIRA' : 'CAUTION') : (lang === 'rw' ? 'NTANKOMYI' : 'CLEAR')}
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {isRainy ? (lang === 'rw' ? 'Imihanda Iranyerera' : 'Wet Pavement & Fog') : (lang === 'rw' ? 'Iteganyagihe Ryiza' : 'Dry Transit Windows')}
            </div>
            <p className="text-xs text-amber-100/80 mt-2 leading-relaxed">
              {isRainy 
                ? (lang === 'rw' ? 'Imvura n\'igihu bishobora gukereza amakamyo atwaye ibirayi n\'imboga.' : 'Heavy showers may cause transit delays for perishable cargo.')
                : (lang === 'rw' ? 'Ikirere cyiza cyo gutwara umusaruro uva mu cyaro werekeza mu masoko manini.' : 'Safe conditions for bulk commodity distribution and inter-district trade.')}
            </p>
          </div>

          {/* Card 2: Grain Drying & Safe Warehousing Moisture */}
          <div className="bg-amber-950/70 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Warehouse className="w-4 h-4 text-orange-400" />
                {lang === 'rw' ? 'Kwanika & Guhunika' : 'Safe Storage Moisture'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                &lt;13.5% Target
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {forecast[0].drying_suitability === 'HIGH' ? (lang === 'rw' ? 'Izuba Rirahagije' : 'Ideal Drying Sun') : (lang === 'rw' ? 'Ubushuhe bwinshi' : 'Moisture Risk')}
            </div>
            <p className="text-xs text-amber-100/80 mt-2 leading-relaxed">
              {lang === 'rw' 
                ? 'Koresha imifuka ya PICS irinda udukoko n\'umwuka ngo ibinyampeke bidasarara cyangwa bikazamo uruhumbu (Aflatoxin).'
                : 'Maintain grain drying standard under 13.5% moisture before sealing in hermetic PICS bags.'}
            </p>
          </div>

          {/* Card 3: Agro-Input Demand Index */}
          <div className="bg-amber-950/70 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-yellow-400" />
                {lang === 'rw' ? 'Guteza Imbere Inyongeramusaruro' : 'Input Demand Surge'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                HIGH DEMAND
              </span>
            </div>
            <div className="text-xl font-bold text-white">
              {lang === 'rw' ? 'Ubwiyongere bw\'Imbuto' : 'Seed & Fertilizer Restock'}
            </div>
            <p className="text-xs text-amber-100/80 mt-2 leading-relaxed">
              {lang === 'rw'
                ? 'Abacuruzi b\'ifumbire (Agro-dealers) barasabwa kongera stoke ya DAP, UREA n\'imbuto z\'indobanure mu maduka.'
                : 'Agro-dealers are advised to maintain robust inventory of certified hybrid seeds & DAP fertilizers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Commodity Market Price & Weather Shock Board */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-sky-100 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm">💰</span>
              {lang === 'rw' ? 'Ibiciro by\'Umusaruro w\'Ubuhinzi & Imiterere y\'Isoko' : 'Wholesale Commodity Prices & Weather Shock Index'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'rw' ? 'Amakuru ahuza ibiciro by\'amasoko y\'u Rwanda n\'iteganyagihe rya Meteo Rwanda' : 'Real-time market price monitoring cross-referenced with weather patterns'}
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            Rwandan Francs (RWF)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketCommodities.map((item) => (
            <div key={item.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 hover:border-amber-400 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {lang === 'rw' ? item.nameRw : item.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {item.unit}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-amber-700">
                    {item.currentPriceRwf} RWF
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs font-semibold">
                    {item.priceTrend === 'up' ? (
                      <span className="text-emerald-600 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{item.changePercentage}%
                      </span>
                    ) : item.priceTrend === 'down' ? (
                      <span className="text-rose-600 flex items-center">
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {item.changePercentage}%
                      </span>
                    ) : (
                      <span className="text-slate-600">Stable</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{lang === 'rw' ? 'Ibyago by\'Ubwikorezi:' : 'Transit Weather Risk:'}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    item.transportRisk === 'High' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {lang === 'rw' ? item.transportRiskRw : item.transportRisk}
                  </span>
                </div>
                <p className="text-slate-700 italic bg-amber-50/60 p-2 rounded border border-amber-200/50">
                  {lang === 'rw' ? item.dryingStatusRw : item.dryingStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor Road Condition Watch */}
      <div className="bg-sky-950/80 backdrop-blur-md border border-sky-600/30 rounded-2xl p-5 text-white shadow-xl">
        <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-sky-400" />
          {lang === 'rw' ? 'Igenzura ry\'Imihanda y\'Ubwikorezi bw\'Umusaruro' : 'Agri-Logistics Corridor Early Warning'}
        </h4>

        <div className="space-y-3">
          {transportCorridors.map((c, i) => (
            <div key={i} className="bg-sky-900/40 border border-sky-700/50 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="font-bold text-sky-100 text-sm">{lang === 'rw' ? c.routeRw : c.routeEn}</div>
                <div className="text-xs text-sky-300 mt-0.5">{lang === 'rw' ? c.riskFactorRw : c.statusEn}</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-sky-800 text-sky-200 px-2.5 py-1 rounded-md font-mono">
                  {c.estimatedDelay}
                </span>
                <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                  c.status === 'WARNING' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {lang === 'rw' ? (c.status === 'WARNING' ? 'IBURIRA' : 'NTANKOMYI') : c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraderDecisions;
