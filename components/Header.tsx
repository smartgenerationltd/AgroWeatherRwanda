import React, { useState } from 'react';
import { 
  UserRole, 
  Location, 
  Language, 
  NavigationTab, 
  UserProfile 
} from '../types';
import { ALL_RWANDA_LOCATIONS } from '../services/rwandaLocationsData';
import { 
  CloudSun, 
  Sprout, 
  Bot, 
  Bell, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  User, 
  MapPin, 
  Globe, 
  Menu, 
  X, 
  Shield, 
  LogIn, 
  Tractor,
  Home as HomeIcon,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentLocation: Location;
  onLocationChange: (loc: Location) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  unreadAlertCount: number;
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentLocation,
  onLocationChange,
  lang,
  onLanguageChange,
  user,
  onOpenAuth,
  unreadAlertCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const navItems: { id: NavigationTab; labelRw: string; labelEn: string; labelFr: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelRw: 'Ahabanza', labelEn: 'Home', labelFr: 'Accueil', icon: HomeIcon },
    { id: 'weather', labelRw: 'Ikirere', labelEn: 'Weather', labelFr: 'Météo', icon: CloudSun },
    { id: 'farms', labelRw: 'Imirima', labelEn: 'My Farms', labelFr: 'Mes Champs', icon: Tractor },
    { id: 'crops', labelRw: 'Ibihingwa', labelEn: 'Crops', labelFr: 'Cultures', icon: Sprout },
    { id: 'ai-agronomist', labelRw: 'AI Agronome', labelEn: 'AI Agronomist', labelFr: 'Agronome IA', icon: Bot },
    { id: 'calendar', labelRw: 'Kalandari', labelEn: 'Calendar', labelFr: 'Calendrier', icon: Calendar },
    { id: 'alerts', labelRw: 'Iburira', labelEn: 'Alerts', labelFr: 'Alertes', icon: Bell },
    { id: 'learn', labelRw: 'Inyigisho', labelEn: 'Learn', labelFr: 'Formation', icon: BookOpen },
    { id: 'admin', labelRw: 'Ubusesenguzi', labelEn: 'Analytics', labelFr: 'Analytique', icon: BarChart3 },
  ];

  const getLabel = (item: typeof navItems[0]) => {
    if (lang === 'rw') return item.labelRw;
    if (lang === 'fr') return item.labelFr;
    return item.labelEn;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 shadow-lg text-white">
      {/* Rwanda Color Top Accent Line (Blue, Yellow, Green) */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-sky-400"></div>
        <div className="bg-yellow-400"></div>
        <div className="bg-emerald-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <img 
                  src="/favicon.svg" 
                  alt="AgroWeather Rwanda Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    AgroWeather
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    RWANDA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-none">
                  {lang === 'rw' ? 'Meteo Rwanda & Gemini AI' : 'Meteo Rwanda & RAB Intelligence'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{getLabel(item)}</span>
                  {item.id === 'alerts' && unreadAlertCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Location Switcher, Language, Profile/Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* District Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                title="Select Rwanda District"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{currentLocation.name}</span>
                <span className="text-[10px] text-slate-400 hidden md:inline">({currentLocation.altitudeMeters}m)</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    {lang === 'rw' ? 'Hitamo Akarere (30 Districts)' : 'Select District'}
                  </div>
                  {ALL_RWANDA_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onLocationChange(loc);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        loc.id === currentLocation.id
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-semibold">{loc.name}</span>
                        <span className="text-[10px] text-slate-400 block">{loc.provinceRw} • {loc.stationName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{loc.altitudeMeters}m</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher (RW, EN, FR) */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => onLanguageChange('rw')}
                className={`px-2 py-1 rounded font-bold text-[11px] transition-all ${
                  lang === 'rw' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Kinyarwanda"
              >
                RW
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded font-bold text-[11px] transition-all ${
                  lang === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-1 rounded font-bold text-[11px] transition-all ${
                  lang === 'fr' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
            </div>

            {/* User Profile / Auth Button */}
            {user ? (
              <button
                onClick={() => onTabChange('profile')}
                className="flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">{user.fullName.split(' ')[0]}</span>
                {user.role === UserRole.Admin && (
                  <Shield className="w-3 h-3 text-amber-400" />
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'rw' ? 'Injira' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900/95 border-t border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{getLabel(item)}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{currentLocation.stationName}</span>
            <span>Meteo Rwanda Live</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
