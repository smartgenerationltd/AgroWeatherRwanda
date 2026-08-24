import React from 'react';
import { UserRole, WeatherData, Location, Language } from '../types';
import { RecommendationResult } from '../services/geminiService';
import CurrentWeather from './CurrentWeather';
import WeeklyForecast from './WeeklyForecast';
import HistoricalChart from './HistoricalChart';
import Recommendations from './Recommendations';
import Alerts from './Alerts';
import FarmerDecisions from './FarmerDecisions';
import TraderDecisions from './TraderDecisions';
import LeaderDecisions from './LeaderDecisions';
import InteractiveAgriChat from './InteractiveAgriChat';

interface DashboardProps {
  userRole: UserRole;
  weatherData: WeatherData;
  location: Location;
  lang: Language;
  recommendations: RecommendationResult | null;
  loadingRecommendations: boolean;
  onRefreshRecommendations: () => void;
  onSelectRole: (role: UserRole) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userRole,
  weatherData,
  location,
  lang,
  recommendations,
  loadingRecommendations,
  onRefreshRecommendations,
}) => {
  return (
    <div className="space-y-6">
      {/* Weather Alerts / Warnings from Meteo Rwanda */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <Alerts alerts={weatherData.alerts} lang={lang} />
      )}

      {/* Main Meteorological Status (Current Weather + 7-Day Agro Forecast) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CurrentWeather 
            data={weatherData.current} 
            location={location} 
            lang={lang} 
          />
        </div>
        <div className="lg:col-span-5">
          <WeeklyForecast 
            data={weatherData.forecast} 
            lang={lang} 
          />
        </div>
      </div>

      {/* Role-Specific Decision Engine (Prioritized for Farmers, Traders, and Institutional Leaders) */}
      <div className="transition-all duration-300">
        {userRole === UserRole.Farmer && (
          <FarmerDecisions 
            weatherData={weatherData} 
            location={location} 
            lang={lang} 
          />
        )}

        {userRole === UserRole.BusinessLeader && (
          <TraderDecisions 
            weatherData={weatherData} 
            location={location} 
            lang={lang} 
          />
        )}

        {userRole === UserRole.LocalLeader && (
          <LeaderDecisions 
            weatherData={weatherData} 
            location={location} 
            lang={lang} 
          />
        )}
      </div>

      {/* AI Decision Recommendations & Grounded Sources */}
      <Recommendations
        recommendations={recommendations}
        loading={loadingRecommendations}
        userRole={userRole}
        weatherData={weatherData}
        location={location}
        lang={lang}
        onRefresh={onRefreshRecommendations}
      />

      {/* Interactive AI Farm Advisor Chat */}
      <InteractiveAgriChat
        userRole={userRole}
        weatherData={weatherData}
        location={location}
        lang={lang}
      />

      {/* 30-Day Agrometeorological Climate History */}
      <HistoricalChart 
        data={weatherData.historical} 
        lang={lang} 
      />
    </div>
  );
};

export default Dashboard;
