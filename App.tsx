import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, WeatherData, Location, Language, WeatherCondition } from './types';
import { LOCATIONS } from './constants';
import { getMockWeatherData } from './services/weatherService';
import { getRecommendations, RecommendationResult } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RoleSelector from './components/RoleSelector';
import SkyBackground from './components/SkyBackground';
import { CloudRain, Sun, CloudLightning, RefreshCw, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(UserRole.Farmer);
  const [currentLocation, setCurrentLocation] = useState<Location>(LOCATIONS[1]); // Default to Musanze (Rwanda high-altitude farming hub)
  const [lang, setLang] = useState<Language>('rw'); // Default to Kinyarwanda as requested for Rwandan farmers
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [simulatedConditionOverride, setSimulatedConditionOverride] = useState<string>('DEFAULT');

  // Load weather data for the selected location
  const loadWeatherData = useCallback((location: Location) => {
    setLoadingWeather(true);
    const data = getMockWeatherData(location);
    setWeatherData(data);
    setLoadingWeather(false);
  }, []);

  // Fetch AI recommendations whenever role, location, weather, or language changes
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
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  useEffect(() => {
    if (selectedRole && weatherData) {
      fetchRecommendations(selectedRole, weatherData, currentLocation, lang);
    }
  }, [selectedRole, weatherData, currentLocation, lang, fetchRecommendations]);

  const handleLocationChange = (newLocation: Location) => {
    setCurrentLocation(newLocation);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  const handleRefreshRecommendations = () => {
    if (selectedRole && weatherData) {
      fetchRecommendations(selectedRole, weatherData, currentLocation, lang);
    }
  };

  // Determine active weather condition for the animated sky background
  const activeCondition: WeatherCondition | undefined = weatherData
    ? simulatedConditionOverride === 'RAIN'
      ? { id: 500, main: 'Rain', description: 'Imvura n\'Igihu', descriptionEn: 'Rain showers', icon: 'rain' }
      : simulatedConditionOverride === 'STORM'
      ? { id: 200, main: 'Thunderstorm', description: 'Imvura y\'Umurabyo', descriptionEn: 'Thunderstorm', icon: 'thunderstorm' }
      : simulatedConditionOverride === 'SUNNY'
      ? { id: 800, main: 'Clear', description: 'Izuba ryinshi', descriptionEn: 'Clear Sky', icon: 'clear-day' }
      : weatherData.current.condition
    : undefined;

  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden font-sans">
      {/* Animated Blue Sky Background with Clouds, Rain Particles & Rwandan Hills Silhouette */}
      <SkyBackground weatherCondition={activeCondition} />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {selectedRole === null ? (
          <RoleSelector 
            onSelectRole={(role) => setSelectedRole(role)} 
            lang={lang} 
            onLanguageChange={handleLanguageChange} 
          />
        ) : (
          <>
            {/* Header & Controls */}
            <Header
              userRole={selectedRole}
              currentLocation={currentLocation}
              locations={LOCATIONS}
              lang={lang}
              onLocationChange={handleLocationChange}
              onRoleChange={handleRoleChange}
              onLanguageChange={handleLanguageChange}
            />

            {/* Quick Sky Animation & Weather Simulation Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {lang === 'rw' ? 'Imiterere y\'Ikirere (Sky Animation):' : 'Sky Weather Movement:'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSimulatedConditionOverride('DEFAULT')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      simulatedConditionOverride === 'DEFAULT' ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {lang === 'rw' ? 'Meteo Live' : 'Live Station'}
                  </button>
                  <button
                    onClick={() => setSimulatedConditionOverride('SUNNY')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                      simulatedConditionOverride === 'SUNNY' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-yellow-300" />
                    {lang === 'rw' ? 'Izuba' : 'Clear Sky'}
                  </button>
                  <button
                    onClick={() => setSimulatedConditionOverride('RAIN')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                      simulatedConditionOverride === 'RAIN' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <CloudRain className="w-3 h-3 text-sky-200" />
                    {lang === 'rw' ? 'Imvura' : 'Rain'}
                  </button>
                  <button
                    onClick={() => setSimulatedConditionOverride('STORM')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                      simulatedConditionOverride === 'STORM' ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <CloudLightning className="w-3 h-3 text-yellow-300" />
                    {lang === 'rw' ? 'Umurabyo' : 'Thunder'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <span>{currentLocation.name} ({currentLocation.altitudeMeters}m)</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Dashboard Content */}
            {loadingWeather || !weatherData ? (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center text-white flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                <p className="text-sm font-semibold">
                  {lang === 'rw' 
                    ? 'Kwakira amakuru y\'iteganyagihe ya Meteo Rwanda...' 
                    : 'Loading Meteo Rwanda station telemetry...'}
                </p>
              </div>
            ) : (
              <Dashboard
                userRole={selectedRole}
                weatherData={weatherData}
                location={currentLocation}
                lang={lang}
                recommendations={recommendations}
                loadingRecommendations={loadingRecommendations}
                onRefreshRecommendations={handleRefreshRecommendations}
                onSelectRole={handleRoleChange}
              />
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-700 font-medium py-4">
          <p>
            AgroWeather Rwanda © {new Date().getFullYear()} • Powered by Meteo Rwanda, MINAGRI, RAB & Gemini AI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
