import React, { useState } from 'react';
import { UserProfile, UserRole, Language } from '../types';
import { RWANDA_DISTRICTS } from '../services/rwandaLocationsData';
import { updateProfileData, logoutUser } from '../services/authService';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Tractor,
  Layers
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  lang,
  onLanguageChange,
  onUpdateUser,
  onSignOut,
  onOpenAuth
}) => {
  const [fullName, setFullName] = useState(user?.fullName || 'Gilbert Niyomugabo');
  const [phone, setPhone] = useState(user?.phone || '+250 788 123 456');
  const [role, setRole] = useState<UserRole>(user?.role || UserRole.Farmer);
  const [district, setDistrict] = useState(user?.district || 'Musanze');
  const [sector, setSector] = useState(user?.sector || 'Kinigi');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentDistObj = RWANDA_DISTRICTS.find(d => d.name.toLowerCase() === district.toLowerCase()) || RWANDA_DISTRICTS[3];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      await updateProfileData(user.uid, {
        fullName,
        phone,
        role,
        district,
        sector
      });

      const updatedUser: UserProfile = {
        ...user,
        fullName,
        phone,
        role,
        district,
        sector
      };

      onUpdateUser(updatedUser);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl text-center space-y-4 text-white shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-3xl mx-auto">
          👨‍🌾
        </div>
        <h2 className="text-xl font-bold">
          {lang === 'rw' ? 'Ntabwo winjiye muri Sisitemu' : 'Not Signed In'}
        </h2>
        <p className="text-xs text-slate-300">
          {lang === 'rw' 
            ? 'Injira cyangwa wiyandikishe kugira ngo ubike amakuru y\'imirima, ibihingwa n\'iteganyagihe.' 
            : 'Sign in to sync your registered farms, crops, calendar, and AI recommendations with Cloud Firestore.'}
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all hover:scale-105"
        >
          {lang === 'rw' ? 'Injira / Iyandikishe' : 'Sign In / Register'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white">
      
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{user.fullName}</h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user.sector}, {user.district} (Rwanda)</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-900/60 border border-slate-700 text-slate-300 hover:text-rose-200 text-xs font-semibold rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'rw' ? 'Sohoka' : 'Sign Out'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'rw' ? 'Amakuru yawe yavuguruwe neza muri Firestore!' : 'Profile updated successfully in Cloud Firestore!'}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {lang === 'rw' ? 'Amazina Yose' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {lang === 'rw' ? 'Telefone (+250)' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {lang === 'rw' ? 'Icyiciro (Role / Perspective)' : 'Agricultural Role'}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={UserRole.Farmer}>👨‍🌾 Umuhinzi (Farmer)</option>
              <option value={UserRole.Agronomist}>🔬 Agronome (Agronomist)</option>
              <option value={UserRole.Cooperative}>🤝 Koperative (Cooperative)</option>
              <option value={UserRole.BusinessLeader}>🛒 Umucuruzi (Agri-Trader)</option>
              <option value={UserRole.LocalLeader}>🏛️ Umuyobozi (Local Leader)</option>
              <option value={UserRole.Researcher}>📚 Umushakashatsi (Researcher)</option>
              <option value={UserRole.Admin}>🛡️ Administrator</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {lang === 'rw' ? 'Akarere k\'Ibanze' : 'Primary District'}
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                const d = RWANDA_DISTRICTS.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());
                if (d && d.sectors.length > 0) {
                  setSector(d.sectors[0]);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              {RWANDA_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.provinceRw})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {lang === 'rw' ? 'Umurenge' : 'Primary Sector'}
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              {currentDistObj.sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            {lang === 'rw' ? 'Ururimi Uhitamo' : 'Preferred Language'}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onLanguageChange('rw')}
              className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                lang === 'rw'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              🇷🇼 Ikinyarwanda (Default)
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                lang === 'en'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('fr')}
              className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                lang === 'fr'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              🇫🇷 Français
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Bika...' : (lang === 'rw' ? 'Bika Impinduka muri Firestore' : 'Save Changes')}</span>
        </button>

      </form>

    </div>
  );
};

export default ProfileView;
