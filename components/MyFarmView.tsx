import React, { useState } from 'react';
import { Farm, Crop, Location, Language, UserProfile } from '../types';
import { RWANDA_DISTRICTS } from '../services/rwandaLocationsData';
import { createFarm, updateFarm, deleteFarm } from '../services/firestoreService';
import { 
  Tractor, 
  Plus, 
  MapPin, 
  Mountain, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Sprout,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface MyFarmViewProps {
  farms: Farm[];
  crops: Crop[];
  user: UserProfile | null;
  lang: Language;
  onRefreshFarms: () => void;
  onOpenAuth: () => void;
}

const MyFarmView: React.FC<MyFarmViewProps> = ({
  farms,
  crops,
  user,
  lang,
  onRefreshFarms,
  onOpenAuth
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // Form State
  const [farmName, setFarmName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('musanze');
  const [selectedSector, setSelectedSector] = useState('Kinigi');
  const [village, setVillage] = useState('');
  const [farmSizeHectares, setFarmSizeHectares] = useState('1.5');
  const [soilType, setSoilType] = useState('Andosols (Volcanic)');
  const [irrigationType, setIrrigationType] = useState<Farm['irrigationType']>('Rainfed');
  const [terraced, setTerraced] = useState(true);
  const [altitudeMeters, setAltitudeMeters] = useState('1850');
  const [loading, setLoading] = useState(false);

  const currentDistrictObj = RWANDA_DISTRICTS.find(d => d.id === selectedDistrict) || RWANDA_DISTRICTS[3];

  const handleOpenAddModal = () => {
    setEditingFarm(null);
    setFarmName('');
    setSelectedDistrict('musanze');
    setSelectedSector('Kinigi');
    setVillage('');
    setFarmSizeHectares('1.5');
    setSoilType('Andosols (Volcanic)');
    setIrrigationType('Rainfed');
    setTerraced(true);
    setAltitudeMeters('1850');
    setModalOpen(true);
  };

  const handleOpenEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmName(farm.farmName);
    const distMatch = RWANDA_DISTRICTS.find(d => d.name.toLowerCase() === farm.district.toLowerCase())?.id || 'musanze';
    setSelectedDistrict(distMatch);
    setSelectedSector(farm.sector);
    setVillage(farm.village || '');
    setFarmSizeHectares(String(farm.farmSizeHectares));
    setSoilType(farm.soilType);
    setIrrigationType(farm.irrigationType);
    setTerraced(farm.terraced);
    setAltitudeMeters(String(farm.altitudeMeters || 1850));
    setModalOpen(true);
  };

  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;
    setLoading(true);

    const ownerId = user ? user.uid : 'demo-farmer-rwanda-001';

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, {
          farmName,
          province: currentDistrictObj.province,
          district: currentDistrictObj.name,
          sector: selectedSector,
          village,
          farmSizeHectares: parseFloat(farmSizeHectares) || 1.0,
          soilType,
          irrigationType,
          terraced,
          altitudeMeters: parseInt(altitudeMeters) || 1850
        });
      } else {
        await createFarm({
          ownerId,
          farmName,
          province: currentDistrictObj.province,
          district: currentDistrictObj.name,
          sector: selectedSector,
          village,
          farmSizeHectares: parseFloat(farmSizeHectares) || 1.0,
          soilType,
          irrigationType,
          terraced,
          altitudeMeters: parseInt(altitudeMeters) || 1850,
          agroEcoZone: currentDistrictObj.agroEcoZone
        });
      }
      onRefreshFarms();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save farm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async (farmId: string) => {
    if (window.confirm(lang === 'rw' ? 'Ese wifuza gusiba uyu murima?' : 'Are you sure you want to delete this farm?')) {
      await deleteFarm(farmId);
      onRefreshFarms();
    }
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* View Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full">
              {lang === 'rw' ? 'Gucunga Imirima (Firestore Database)' : 'Farm Holdings & Spatial Registry'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {lang === 'rw' ? 'Imirima n\'Imiterere y\'Ubutaka' : 'My Farm Holdings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'rw'
              ? 'Bika aho imirima iherereye, ubwoko bw\'ubutaka, amaterasi, n\'uburyo bwo kuhira.'
              : 'Manage registered farm parcels across Rwanda districts, soil composition, and terracing.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Ongeraho Umurima Mushya' : 'Add New Farm'}</span>
        </button>
      </div>

      {/* Farm Holdings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const farmCrops = crops.filter(c => c.farmId === farm.id);
          const isHighAltitude = (farm.altitudeMeters || 1800) > 1900;

          return (
            <div
              key={farm.id}
              className="bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl">
                      🚜
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white line-clamp-1">{farm.farmName}</h2>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{farm.sector}, {farm.district}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(farm)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit farm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFarm(farm.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete farm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Ingano' : 'Acreage'}</span>
                    <span className="font-bold text-emerald-400">{farm.farmSizeHectares} Hectares</span>
                  </div>

                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Uburebure' : 'Elevation'}</span>
                    <span className="font-bold text-sky-300">{farm.altitudeMeters || 1850}m</span>
                  </div>

                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Kuhira' : 'Irrigation'}</span>
                    <span className="font-semibold text-slate-200">{farm.irrigationType}</span>
                  </div>

                  <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">{lang === 'rw' ? 'Amaterasi' : 'Terraced'}</span>
                    <span className={`font-semibold ${farm.terraced ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {farm.terraced ? (lang === 'rw' ? 'Yego (Amaterasi)' : 'Yes') : (lang === 'rw' ? 'Oya (Ihanamye)' : 'No')}
                    </span>
                  </div>
                </div>

                {/* Soil Profile */}
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-slate-400">{lang === 'rw' ? 'Ubutaka:' : 'Soil:'}</span>
                  <span className="font-bold text-emerald-300">{farm.soilType}</span>
                </div>

                {/* Crops in this farm */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {lang === 'rw' ? `Ibihingwa biri muri uyu murima (${farmCrops.length})` : `Planted Crops (${farmCrops.length})`}
                  </span>
                  {farmCrops.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      {lang === 'rw' ? 'Nta gihingwa cyanditswe hano' : 'No active crop batch registered'}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {farmCrops.map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs flex items-center gap-1 font-medium">
                          <Sprout className="w-3 h-3 text-emerald-400" />
                          <span>{c.cropNameRw || c.cropType}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Climate Risk Badge */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'rw' ? 'Umutekano w\'Ikirere:' : 'Climate Risk:'}</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                  isHighAltitude ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isHighAltitude ? (lang === 'rw' ? 'Ubukonje & Igihu' : 'Highland Frost Risk') : (lang === 'rw' ? 'Umutekano Mwiza' : 'Low Erosion Risk')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding/Editing Farm */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
            
            <div className="bg-gradient-to-r from-emerald-900/60 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl">
                  🚜
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingFarm ? (lang === 'rw' ? 'Hindura Umurima' : 'Edit Farm Holding') : (lang === 'rw' ? 'Ongeraho Umurima Mushya' : 'Add New Farm Holding')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'rw' ? 'Amakuru y\'umurima abikwa muri Cloud Firestore' : 'Farm profile stored securely in Firestore'}
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

            <form onSubmit={handleSaveFarm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Izina ry\'Umurima' : 'Farm Name'}
                </label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Urugero: Umurima w'Ibirayi wa Kinigi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Akarere (District)' : 'District'}
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      const d = RWANDA_DISTRICTS.find(item => item.id === e.target.value);
                      if (d && d.sectors.length > 0) {
                        setSelectedSector(d.sectors[0]);
                        setAltitudeMeters(String(d.altitudeMeters));
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {RWANDA_DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.provinceRw})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Umurenge (Sector)' : 'Sector'}
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {currentDistrictObj.sectors.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Ingano (Hectares)' : 'Size (Hectares)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={farmSizeHectares}
                    onChange={(e) => setFarmSizeHectares(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Uburebure (Altitude m)' : 'Altitude (Meters)'}
                  </label>
                  <input
                    type="number"
                    value={altitudeMeters}
                    onChange={(e) => setAltitudeMeters(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Ubwoko bw\'Ubutaka' : 'Soil Classification'}
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Andosols (Volcanic Rich)">Andosols (Volcanic Soil - Musanze/Nyabihu)</option>
                    <option value="Ferralsols (Clay Loam)">Ferralsols (Acidic Highlands - Gicumbi/Nyamagabe)</option>
                    <option value="Acrisols (Central Plateau)">Acrisols (Central Plateau - Huye/Muhanga)</option>
                    <option value="Vertisols (Valley Black Cotton)">Vertisols (Eastern Savanna - Nyagatare/Bugesera)</option>
                    <option value="Alluvial Marshland">Alluvial Marshland (Igishanga)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Uburyo bwo Kuhira' : 'Irrigation Method'}
                  </label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Rainfed">Rainfed (Imvura gusa)</option>
                    <option value="Drip/Sprinkler">Drip / Sprinkler (Igitonyanga)</option>
                    <option value="Canal/Marshland">Canal Gravity (Imiyoboro y'igishanga)</option>
                    <option value="Pumping">River/Lake Pumping (Kuhira n'amapompo)</option>
                    <option value="None">None (Nta buhiriro)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <input
                  type="checkbox"
                  id="terraced"
                  checked={terraced}
                  onChange={(e) => setTerraced(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded border-slate-600 focus:ring-emerald-500"
                />
                <label htmlFor="terraced" className="text-slate-200 cursor-pointer font-medium">
                  {lang === 'rw' ? 'Umurima ufite Amaterasi n\'imiringoti ifata amazi (Terraced & Ditched)' : 'Farm has anti-erosion progressive/radical terraces'}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Bika...' : (lang === 'rw' ? 'Bika Amakuru y\'Umurima' : 'Save Farm Parcel')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyFarmView;
