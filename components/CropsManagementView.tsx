import React, { useState } from 'react';
import { Crop, Farm, CropGrowthStage, Language, UserProfile, WeatherData } from '../types';
import { createCrop, updateCrop, deleteCrop } from '../services/firestoreService';
import { 
  Sprout, 
  Plus, 
  Calendar, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Clock, 
  TrendingUp,
  Sun,
  CloudRain
} from 'lucide-react';

interface CropsManagementViewProps {
  crops: Crop[];
  farms: Farm[];
  weatherData: WeatherData;
  user: UserProfile | null;
  lang: Language;
  onRefreshCrops: () => void;
}

const STAGES_ORDER: CropGrowthStage[] = [
  'Land Preparation',
  'Planting',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity',
  'Harvest'
];

const CROPS_VARIETY_PRESETS = [
  { type: 'Irish Potatoes', nameRw: 'Ibirayi bya Kinigi', varieties: ['Kinigi (Super Seed)', 'Victoria', 'Cruza', 'Rwangume'] },
  { type: 'Maize (Hybrid)', nameRw: 'Ibigori bya RHM', varieties: ['RHM 104', 'RHM 1407', 'Pool 8A', 'ZM 607'] },
  { type: 'Climbing Beans', nameRw: 'Ibishyimbo by\'Imitego', varieties: ['RWV 1129 (Biofortified Iron)', 'RWV 2070', 'MAC 44', 'CAB 2'] },
  { type: 'Bush Beans', nameRw: 'Ibishyimbo by\'Imikundano', varieties: ['RWR 2245', 'RWR 2154', 'SER 16'] },
  { type: 'Specialty Coffee', nameRw: 'Ikawa ya Arabica', varieties: ['Arabica Bourbon', 'Jackson', 'BM 139'] },
  { type: 'Rice', nameRw: 'Umuceri wo mu Bishanga', varieties: ['Wat 54', 'Yunyin', 'Kigori Rice'] },
  { type: 'Cassava', nameRw: 'Imyumbati ya Garukunsubire', varieties: ['Garukunsubire (CBSD Tolerant)', 'Ndamirabana', 'Gahene'] },
  { type: 'Vegetables', nameRw: 'Imboga n\'Inyanya', varieties: ['Anna F1 Tomatoes', 'Gloria F1 Cabbage', 'Carrots Kuroda'] },
];

const CropsManagementView: React.FC<CropsManagementViewProps> = ({
  crops,
  farms,
  weatherData,
  user,
  lang,
  onRefreshCrops
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Form states
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || 'farm-01');
  const [cropType, setCropType] = useState('Irish Potatoes (Ibirayi)');
  const [cropNameRw, setCropNameRw] = useState('Ibirayi bya Kinigi');
  const [variety, setVariety] = useState('Kinigi Super Seed (RAB Certified)');
  const [season, setSeason] = useState<'Season A' | 'Season B' | 'Season C'>('Season A');
  const [plantingDate, setPlantingDate] = useState('2026-08-15');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('2026-11-25');
  const [growthStage, setGrowthStage] = useState<CropGrowthStage>('Vegetative');
  const [acreage, setAcreage] = useState('1.2');
  const [healthStatus, setHealthStatus] = useState<Crop['healthStatus']>('Excellent');
  const [targetYieldKg, setTargetYieldKg] = useState('24000');
  const [waterNeed, setWaterNeed] = useState<Crop['waterNeed']>('Moderate');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenAddModal = () => {
    setEditingCrop(null);
    setSelectedFarmId(farms[0]?.id || 'farm-01');
    setCropType('Irish Potatoes');
    setCropNameRw('Ibirayi bya Kinigi');
    setVariety('Kinigi Super Seed');
    setSeason('Season A');
    setPlantingDate(new Date().toISOString().split('T')[0]);
    setExpectedHarvestDate(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]);
    setGrowthStage('Vegetative');
    setAcreage('1.0');
    setHealthStatus('Good');
    setTargetYieldKg('15000');
    setWaterNeed('Moderate');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setSelectedFarmId(crop.farmId);
    setCropType(crop.cropType);
    setCropNameRw(crop.cropNameRw);
    setVariety(crop.variety);
    setSeason(crop.season);
    setPlantingDate(crop.plantingDate);
    setExpectedHarvestDate(crop.expectedHarvestDate);
    setGrowthStage(crop.growthStage);
    setAcreage(String(crop.acreage));
    setHealthStatus(crop.healthStatus);
    setTargetYieldKg(String(crop.targetYieldKg || 10000));
    setWaterNeed(crop.waterNeed);
    setNotes(crop.notes || '');
    setModalOpen(true);
  };

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ownerId = user ? user.uid : 'demo-farmer-rwanda-001';

    try {
      if (editingCrop) {
        await updateCrop(editingCrop.id, {
          farmId: selectedFarmId,
          cropType,
          cropNameRw,
          variety,
          season,
          plantingDate,
          expectedHarvestDate,
          growthStage,
          acreage: parseFloat(acreage) || 1.0,
          healthStatus,
          targetYieldKg: parseFloat(targetYieldKg) || 1000,
          waterNeed,
          notes
        });
      } else {
        await createCrop({
          farmId: selectedFarmId,
          ownerId,
          cropType,
          cropNameRw,
          variety,
          season,
          plantingDate,
          expectedHarvestDate,
          growthStage,
          acreage: parseFloat(acreage) || 1.0,
          healthStatus,
          targetYieldKg: parseFloat(targetYieldKg) || 1000,
          waterNeed,
          notes
        });
      }
      onRefreshCrops();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save crop:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (cropId: string) => {
    if (window.confirm(lang === 'rw' ? 'Ese wifuza gusiba iki gihingwa?' : 'Are you sure you want to delete this crop?')) {
      await deleteCrop(cropId);
      onRefreshCrops();
    }
  };

  const calculateDaysRemaining = (harvestDateStr: string) => {
    const diffTime = new Date(harvestDateStr).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold rounded-full">
              {lang === 'rw' ? 'Gukurikirana Ibyiciro by\'Ibihingwa (8 Stages)' : 'Crop Lifecycle & Health Intelligence'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {lang === 'rw' ? 'Ibihingwa by\'Imirima & Isarura' : 'Active Crop Batches'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'rw'
              ? 'Kurikirana aho igihingwa kigeze (Itera -> Isarura), imvura yacyo, n\'umuti ukwiriye.'
              : 'Track crop growth from seedbed to harvest with weather-synchronized advisory.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Ongeraho Igihingwa' : 'Register Crop'}</span>
        </button>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => {
          const farm = farms.find(f => f.id === crop.farmId);
          const daysLeft = calculateDaysRemaining(crop.expectedHarvestDate);
          const stageIndex = STAGES_ORDER.indexOf(crop.growthStage);
          const progressPercent = Math.round(((stageIndex + 1) / STAGES_ORDER.length) * 100);

          return (
            <div
              key={crop.id}
              className="bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-teal-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl">
                      🌱
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white line-clamp-1">{crop.cropNameRw || crop.cropType}</h2>
                      <p className="text-[11px] text-teal-300 font-medium">{crop.variety}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(crop)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit crop"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete crop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Location & Season */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span>{farm ? `${farm.farmName} (${farm.sector})` : 'Farm Parcel'}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[10px]">
                    {crop.season}
                  </span>
                </div>

                {/* Stage Progress Bar (8 Stages) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{lang === 'rw' ? 'Icyiciro cyo gukura:' : 'Growth Stage:'}</span>
                    <span className="font-extrabold text-sky-400">{crop.growthStage}</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{lang === 'rw' ? 'Itegurwa' : 'Land Prep'}</span>
                    <span>{progressPercent}% Complete</span>
                    <span>{lang === 'rw' ? 'Isarura' : 'Harvest'}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Ingano' : 'Area'}</span>
                    <span className="font-bold text-white">{crop.acreage} Ha</span>
                  </div>

                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Ubusaruro' : 'Target'}</span>
                    <span className="font-bold text-emerald-400">{(crop.targetYieldKg || 1000).toLocaleString()} kg</span>
                  </div>

                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Isarura' : 'Harvest In'}</span>
                    <span className="font-bold text-yellow-300">~{daysLeft} days</span>
                  </div>
                </div>

                {/* Stage-Specific Weather Action Insight */}
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'rw' ? 'Inama y\'Iki Cyiciro:' : 'Stage Weather Directive:'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {crop.growthStage === 'Land Preparation' && (lang === 'rw' ? 'Tunganya amaterasi n\'imiringoti mbere y\'itangira ry\'imvura.' : 'Finalize contour trenches before steady seasonal onset.')}
                    {crop.growthStage === 'Planting' && (lang === 'rw' ? 'Tera imbuto ubutaka bufite ububobere >60%.' : 'Sow with certified seeds into moist soil beds.')}
                    {crop.growthStage === 'Germination' && (lang === 'rw' ? 'Genzura udukoko n\'umuyaga w\'imvura nkeya.' : 'Monitor seedling emergence and guard against early pests.')}
                    {crop.growthStage === 'Vegetative' && (lang === 'rw' ? 'Igihe cyo gushyiramo UREA yo hejuru no kurwanya nkongwa.' : 'Window for nitrogen top-dressing and weed management.')}
                    {crop.growthStage === 'Flowering' && (lang === 'rw' ? 'Irinde ko ubutaka bukama; genzura umusonga n\'uruhumbu.' : 'Avoid moisture stress during pollination; scout foliar blight.')}
                    {crop.growthStage === 'Fruiting' && (lang === 'rw' ? 'Kuhira ku buryo buhoraho ngo ibirayi n\'ibigori bibyibuhe.' : 'Maintain steady root zone moisture for optimal kernel/tuber filling.')}
                    {crop.growthStage === 'Maturity' && (lang === 'rw' ? 'Hagarika kuhira; teka amashitingi yo kwanika.' : 'Taper supplemental watering; prepare clean solar drying tarps.')}
                    {crop.growthStage === 'Harvest' && (lang === 'rw' ? 'Sarura ku munsi w\'izuba ryinshi; anika kugeza munsi ya 13.5%.' : 'Harvest during dry sunny days to prevent mold and rot.')}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'rw' ? 'Ubuzima bw\'Igihingwa:' : 'Crop Health:'}</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                  crop.healthStatus === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                  crop.healthStatus === 'Good' ? 'bg-teal-500/20 text-teal-300' :
                  crop.healthStatus === 'Attention Needed' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {crop.healthStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding/Editing Crop */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
            
            <div className="bg-gradient-to-r from-teal-900/60 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xl">
                  🌱
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingCrop ? (lang === 'rw' ? 'Hindura Igihingwa' : 'Edit Crop Batch') : (lang === 'rw' ? 'Ongeraho Igihingwa Gishya' : 'Register Crop Batch')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'rw' ? 'Bika amakuru muri Firestore agahuzwa n\'iteganyagihe' : 'Synchronized with real-time Meteo Rwanda telemetry'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCrop} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Hitamo Umurima' : 'Assign to Farm'}
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.farmName} ({f.sector}, {f.district})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Ubwoko bw\'Igihingwa' : 'Crop Category'}
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => {
                      setCropType(e.target.value);
                      const preset = CROPS_VARIETY_PRESETS.find(p => p.type.includes(e.target.value.split(' ')[0]));
                      if (preset) {
                        setCropNameRw(preset.nameRw);
                        setVariety(preset.varieties[0]);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Irish Potatoes (Ibirayi)">Irish Potatoes (Ibirayi)</option>
                    <option value="Maize (Ibigori)">Maize (Ibigori)</option>
                    <option value="Climbing Beans (Ibishyimbo by'Imitego)">Climbing Beans (Ibishyimbo)</option>
                    <option value="Bush Beans (Ibishyimbo by'Imikundano)">Bush Beans (Ibyo hasi)</option>
                    <option value="Specialty Coffee (Ikawa)">Arabica Coffee (Ikawa)</option>
                    <option value="Rice (Umuceri)">Rice (Umuceri)</option>
                    <option value="Cassava (Imyumbati)">Cassava (Imyumbati)</option>
                    <option value="Vegetables & Tomatoes (Imboga)">Vegetables & Tomatoes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Imbuto y\'Indobanure (Variety)' : 'Certified Variety'}
                  </label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Urugero: Kinigi, RHM 104, RWV 1129"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Igihembwe (Season)' : 'Season'}
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Season A">Season A (Nzeri - Mutarama)</option>
                    <option value="Season B">Season B (Gashyantare - Kamena)</option>
                    <option value="Season C">Season C (Nyakanga - Kanama)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Icyiciro kiriho (Stage)' : 'Current Growth Stage'}
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as CropGrowthStage)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    {STAGES_ORDER.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Itariki yo Gutera' : 'Planting Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Itariki y\'Isarura' : 'Expected Harvest'}
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Ingano (Hectares)' : 'Area (Hectares)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Umusaruro witezwe (Kg)' : 'Target Yield (Kg)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={targetYieldKg}
                    onChange={(e) => setTargetYieldKg(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Bika...' : (lang === 'rw' ? 'Bika Amakuru y\'Igihingwa' : 'Save Crop Batch')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CropsManagementView;
