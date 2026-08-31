import React, { useState } from 'react';
import { FarmingTask, Crop, Farm, Language, UserProfile, WeatherData } from '../types';
import { createTask, updateTask, deleteTask } from '../services/firestoreService';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Filter, 
  Sprout, 
  X, 
  Save, 
  Check,
  ShieldCheck,
  Droplets,
  Sun
} from 'lucide-react';

interface FarmingCalendarViewProps {
  tasks: FarmingTask[];
  crops: Crop[];
  farms: Farm[];
  weatherData: WeatherData;
  user: UserProfile | null;
  lang: Language;
  onRefreshTasks: () => void;
}

const FarmingCalendarView: React.FC<FarmingCalendarViewProps> = ({
  tasks,
  crops,
  farms,
  weatherData,
  user,
  lang,
  onRefreshTasks
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'pending' | 'completed'>('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [titleRw, setTitleRw] = useState('');
  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || 'crop-01');
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || 'farm-01');
  const [category, setCategory] = useState<FarmingTask['category']>('Fertilizer');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<FarmingTask['priority']>('high');
  const [weatherSuitability, setWeatherSuitability] = useState<FarmingTask['weatherSuitability']>('Optimal');
  const [loading, setLoading] = useState(false);

  const handleToggleTaskStatus = async (task: FarmingTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
    onRefreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm(lang === 'rw' ? 'Gusiba uyu murimo?' : 'Delete this task?')) {
      await deleteTask(taskId);
      onRefreshTasks();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const ownerId = user ? user.uid : 'demo-farmer-rwanda-001';

    try {
      await createTask({
        ownerId,
        farmId: selectedFarmId,
        cropId: selectedCropId,
        title,
        titleRw: titleRw || title,
        category,
        dueDate,
        status: 'pending',
        priority,
        weatherSuitability
      });
      onRefreshTasks();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterCategory !== 'ALL' && t.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold rounded-full">
              {lang === 'rw' ? 'Kalandari y\'Imirimo y\'Ubuhinzi (Weather-Driven)' : 'Smart Agrometeorological Calendar'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {lang === 'rw' ? 'Gahunda y\'Imirimo mu Murima' : 'Farming Schedule & Field Tasks'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'rw'
              ? 'Tegura imirimo yo gutera, gushyira ifumbire, kubagara, no gusarura uhuje n\'iteganyagihe rya Meteo Rwanda.'
              : 'Synchronize daily field actions with 7-day soil moisture and precipitation forecasts.'}
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setTitleRw('');
            setDueDate(new Date().toISOString().split('T')[0]);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Ongeraho Umurimo' : 'Add Field Task'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'rw' ? 'Imirimo Yose' : 'All Tasks'} ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'pending' ? 'bg-yellow-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'rw' ? 'Itegerejwe' : 'Pending'} ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'completed' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'rw' ? 'Yarangiye' : 'Done'} ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-yellow-500"
        >
          <option value="ALL">{lang === 'rw' ? 'Ibyiciro Byose (All Categories)' : 'All Categories'}</option>
          <option value="Planting">Planting (Gutera)</option>
          <option value="Fertilizer">Fertilizer (Ifumbire)</option>
          <option value="Spraying">Spraying (Kwirinda indwara)</option>
          <option value="Weeding">Weeding (Kubagara)</option>
          <option value="Harvesting">Harvesting (Isarura)</option>
          <option value="Scouting">Pest Scouting (Igenzura)</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              {lang === 'rw' ? 'Nta mirimo ihari muri iki cyiciro.' : 'No tasks match current filter criteria.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const crop = crops.find(c => c.id === task.cropId);
            const farm = farms.find(f => f.id === task.farmId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border backdrop-blur-md transition-all flex items-center justify-between gap-4 shadow ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/85 border-slate-800 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskStatus(task)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'border-2 border-slate-600 hover:border-emerald-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                        {lang === 'rw' ? task.titleRw || task.title : task.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {task.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span>{task.dueDate}</span>
                      </span>
                      {crop && (
                        <span className="flex items-center gap-1 text-teal-300">
                          <Sprout className="w-3 h-3" />
                          <span>{crop.cropNameRw || crop.cropType}</span>
                        </span>
                      )}
                      {farm && (
                        <span>• {farm.farmName}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Weather Suitability Pill */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold hidden sm:inline ${
                    task.weatherSuitability === 'Optimal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    task.weatherSuitability === 'Caution' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {task.weatherSuitability} Weather
                  </span>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Creating Task */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white">
            
            <div className="bg-gradient-to-r from-yellow-900/60 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-xl">
                  📅
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {lang === 'rw' ? 'Ongeraho Umurimo Mushya' : 'Add Farming Task'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'rw' ? 'Ujyanishwe n\'imvura n\'ububobere bw\'ubutaka' : 'Assigned to crop and synchronized with climate'}
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

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Umutwe w\'Umurimo (Kinyarwanda)' : 'Task Title (Kinyarwanda)'}
                </label>
                <input
                  type="text"
                  required
                  value={titleRw}
                  onChange={(e) => setTitleRw(e.target.value)}
                  placeholder="Urugero: Gushyira UREA mu bigori bya Musanze"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'rw' ? 'Umutwe w\'Umurimo (English)' : 'Task Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apply UREA top-dressing on Maize"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Icyiciro (Category)' : 'Task Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Planting">Planting (Gutera)</option>
                    <option value="Fertilizer">Fertilizer (Ifumbire)</option>
                    <option value="Spraying">Spraying (Kwirinda indwara)</option>
                    <option value="Weeding">Weeding (Kubagara)</option>
                    <option value="Harvesting">Harvesting (Isarura)</option>
                    <option value="Scouting">Scouting (Kureba ibyonnyi)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Itariki yo Gukora' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Umurima' : 'Assign Farm'}
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.farmName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'rw' ? 'Igihingwa' : 'Assign Crop'}
                  </label>
                  <select
                    value={selectedCropId}
                    onChange={(e) => setSelectedCropId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    {crops.map(c => (
                      <option key={c.id} value={c.id}>{c.cropNameRw || c.cropType}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Bika...' : (lang === 'rw' ? 'Bika Umurimo' : 'Save Task')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmingCalendarView;
