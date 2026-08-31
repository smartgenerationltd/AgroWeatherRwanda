import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
  WeatherData, 
  Location, 
  Language, 
  NavigationTab, 
  UserProfile, 
  Farm, 
  Crop, 
  FarmingTask, 
  WeatherCondition 
} from './types';
import { ALL_RWANDA_LOCATIONS } from './services/rwandaLocationsData';
import { getMockWeatherData } from './services/weatherService';
import { getRecommendations, RecommendationResult } from './services/geminiService';
import { 
  getCurrentUserProfile, 
  subscribeToAuthChanges, 
  logoutUser, 
  startDemoSession 
} from './services/authService';
import { 
  getFarms, 
  getCrops, 
  getTasks 
} from './services/firestoreService';

// UI Components
import Header from './components/Header';
import SkyBackground from './components/SkyBackground';
import AuthModal from './components/AuthModal';
import HomeDashboard from './components/HomeDashboard';
import WeatherIntelligenceView from './components/WeatherIntelligenceView';
import MyFarmView from './components/MyFarmView';
import CropsManagementView from './components/CropsManagementView';
import AIAgronomistChatView from './components/AIAgronomistChatView';
import AgriculturalAlertsView from './components/AgriculturalAlertsView';
import FarmingCalendarView from './components/FarmingCalendarView';
import LearnCenterView from './components/LearnCenterView';
import AdminDashboardView from './components/AdminDashboardView';
import ProfileView from './components/ProfileView';

import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('rw'); // Default Kinyarwanda

  // Location & Weather State
  const [currentLocation, setCurrentLocation] = useState<Location>(ALL_RWANDA_LOCATIONS[3]); // Musanze
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [simulatedConditionOverride, setSimulatedConditionOverride] = useState<string>('DEFAULT');

  // AI & Agro Decision State
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  // Firestore Collections State
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [tasks, setTasks] = useState<FarmingTask[]>([]);

  // 1. Initialize Auth Subscription & Load User Data
  useEffect(() => {
    // Check if user already in session or start initial demo user
    const initialUser = getCurrentUserProfile();
    if (initialUser) {
      setUser(initialUser);
      setLang(initialUser.preferredLanguage || 'rw');
    } else {
      // Default to demo session for instant high-fidelity experience
      const demoUser = startDemoSession(UserRole.Farmer, currentLocation.name);
      setUser(demoUser);
    }

    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Firestore Data (Farms, Crops, Tasks) whenever user or location updates
  const loadFirestoreData = useCallback(async () => {
    const ownerId = user ? user.uid : 'demo-farmer-rwanda-001';
    try {
      const [fetchedFarms, fetchedCrops, fetchedTasks] = await Promise.all([
        getFarms(ownerId),
        getCrops(ownerId),
        getTasks(ownerId)
      ]);
      setFarms(fetchedFarms);
      setCrops(fetchedCrops);
      setTasks(fetchedTasks);
    } catch (err) {
      console.warn("Notice: Loaded offline cache for farms & crops:", err);
    }
  }, [user]);

  useEffect(() => {
    loadFirestoreData();
  }, [loadFirestoreData]);

  // 3. Load Real-Time / Simulated Weather Telemetry for selected Location
  const loadWeatherData = useCallback((location: Location) => {
    setLoadingWeather(true);
    const data = getMockWeatherData(location);
    setWeatherData(data);
    setLoadingWeather(false);
  }, []);

  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // 4. Fetch Gemini AI Recommendations & Decision Briefing
  const fetchRecommendations = useCallback(async (
    role: UserRole,
    weather: WeatherData,
    location: Location,
    currentLang: Language
  ) => {
    setLoadingRecommendations(true);
    try {
      const recs = await getRecommendations(role, weather, location, currentLang);
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      const activeRole = user?.role || UserRole.Farmer;
      fetchRecommendations(activeRole, weatherData, currentLocation, lang);
    }
  }, [user?.role, weatherData, currentLocation, lang, fetchRecommendations]);

  const handleLocationChange = (newLocation: Location) => {
    setCurrentLocation(newLocation);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  const handleRefreshRecommendations = () => {
    if (weatherData) {
      const activeRole = user?.role || UserRole.Farmer;
      fetchRecommendations(activeRole, weatherData, currentLocation, lang);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setCurrentTab('home');
  };

  // Weather Condition for animated sky canvas
  const activeCondition: WeatherCondition | undefined = weatherData
    ? simulatedConditionOverride === 'RAIN'
      ? { id: 500, main: 'Rain', description: 'Imvura n\'Igihu', descriptionEn: 'Rain showers', icon: 'rain' }
      : simulatedConditionOverride === 'STORM'
      ? { id: 200, main: 'Thunderstorm', description: 'Imvura y\'Umurabyo', descriptionEn: 'Thunderstorm', icon: 'thunderstorm' }
      : simulatedConditionOverride === 'SUNNY'
      ? { id: 800, main: 'Clear', description: 'Izuba ryinshi', descriptionEn: 'Clear Sky', icon: 'clear-day' }
      : weatherData.current.condition
    : undefined;

  const unreadAlertCount = weatherData?.alerts?.length || 0;

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden font-sans bg-slate-950">
      
      {/* Animated Sky Canvas & Rwanda Mountain Ridge Line */}
      <SkyBackground weatherCondition={activeCondition} />

      {/* Top Application Header & Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentLocation={currentLocation}
        onLocationChange={handleLocationChange}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        unreadAlertCount={unreadAlertCount}
      />

      {/* Main Applet Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {loadingWeather || !weatherData ? (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center text-white flex flex-col items-center justify-center space-y-4 shadow-2xl">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold">
              {lang === 'rw' 
                ? 'Guhuza amakuru na Sitasiyo za Meteo Rwanda...' 
                : 'Synchronizing with Meteo Rwanda station telemetry...'}
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeDashboard
                user={user}
                weatherData={weatherData}
                location={currentLocation}
                lang={lang}
                recommendations={recommendations}
                loadingRecommendations={loadingRecommendations}
                onRefreshRecommendations={handleRefreshRecommendations}
                onNavigate={setCurrentTab}
                farms={farms}
                crops={crops}
                tasks={tasks}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentTab === 'weather' && (
              <WeatherIntelligenceView
                weatherData={weatherData}
                location={currentLocation}
                lang={lang}
                onSelectConditionOverride={setSimulatedConditionOverride}
                activeConditionOverride={simulatedConditionOverride}
              />
            )}

            {currentTab === 'farms' && (
              <MyFarmView
                farms={farms}
                crops={crops}
                user={user}
                lang={lang}
                onRefreshFarms={loadFirestoreData}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentTab === 'crops' && (
              <CropsManagementView
                crops={crops}
                farms={farms}
                weatherData={weatherData}
                user={user}
                lang={lang}
                onRefreshCrops={loadFirestoreData}
              />
            )}

            {currentTab === 'ai-agronomist' && (
              <AIAgronomistChatView
                weatherData={weatherData}
                location={currentLocation}
                role={user?.role || UserRole.Farmer}
                user={user}
                lang={lang}
              />
            )}

            {currentTab === 'alerts' && (
              <AgriculturalAlertsView
                weatherData={weatherData}
                location={currentLocation}
                lang={lang}
                role={user?.role || UserRole.Farmer}
                user={user}
              />
            )}

            {currentTab === 'calendar' && (
              <FarmingCalendarView
                tasks={tasks}
                crops={crops}
                farms={farms}
                weatherData={weatherData}
                user={user}
                lang={lang}
                onRefreshTasks={loadFirestoreData}
              />
            )}

            {currentTab === 'learn' && (
              <LearnCenterView
                lang={lang}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboardView
                lang={lang}
                user={user}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                user={user}
                lang={lang}
                onLanguageChange={handleLanguageChange}
                onUpdateUser={(updated) => setUser(updated)}
                onSignOut={handleSignOut}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setLang(loggedUser.preferredLanguage || 'rw');
          loadFirestoreData();
        }}
        lang={lang}
      />

      {/* Footer with Brand & Partner Logos */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/95 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
            
            {/* App Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30 p-1 flex-shrink-0 shadow-md">
                <img 
                  src="/favicon.svg" 
                  alt="AgroWeather Rwanda Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-white tracking-tight">
                  AgroWeather <span className="text-sky-400">Rwanda</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'rw' ? 'Ihuriro ry\'Umuhinzi & AI mu Iteganyagihe ry\'Ubuhinzi' : 'Farmer & Agricultural Climate Intelligence Platform'}
                </div>
              </div>
            </div>

            {/* Partner Agency Badges with Logos */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5">
                <img src="/meteo_rwanda_logo.svg" alt="Meteo Rwanda" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                <span className="text-[11px] font-semibold text-slate-300">Meteo Rwanda</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5">
                <img src="/minagri_logo.svg" alt="MINAGRI" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                <span className="text-[11px] font-semibold text-slate-300">MINAGRI</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5">
                <img src="/rab_logo.svg" alt="RAB" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                <span className="text-[11px] font-semibold text-slate-300">RAB</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>
              AgroWeather Rwanda © {new Date().getFullYear()} • Powered by Rwanda Meteorology Agency & Rwanda Agriculture Board.
            </p>
            <div className="flex items-center gap-3">
              <span>🇷🇼 Republic of Rwanda</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Climate-Smart Agriculture</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
