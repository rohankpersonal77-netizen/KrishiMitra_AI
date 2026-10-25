import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Droplets,
  Coins,
  CheckCircle2,
  Calendar,
  MapPin,
  ChevronRight,
  RefreshCw,
  Clock,
  Wind,
  Thermometer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { useOffline } from '../context/OfflineContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { farmProfile, weather, advisory, riskRadar, actions, refreshWeather, weatherLoading } = useFarm();
  const { isOffline } = useOffline();

  // Aggregate metrics
  const totalWaterSaved = actions.reduce((acc, a) => acc + (a.waterSaved || 0), 0);
  const totalCostSaved = actions.reduce((acc, a) => acc + (a.costSaved || 0), 0);
  const actionsCount = actions.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Welcome & Farm Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-agri-100/60 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{farmProfile.farmName}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-0.5" />
                {farmProfile.district}, {farmProfile.state}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('dashboard.welcome_back')}, <span className="text-agri-800">{user?.name || 'Farmer'}</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('dashboard.active_crop')}: <strong className="text-slate-800 capitalize">{farmProfile.cropType}</strong> ({farmProfile.area} {farmProfile.areaUnit}) | {t('dashboard.growth_stage')}: <span className="font-semibold text-agri-700 capitalize">{farmProfile.growthStage}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/crop-profile"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
            >
              {t('dashboard.update_stage')}
            </Link>
            <Link
              to="/decision-simulator"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-agri-700 hover:bg-agri-800 text-white shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('dashboard.compare_decisions')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{t('dashboard.water_saved')}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{totalWaterSaved} <span className="text-xs font-normal text-slate-500">kL</span></div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Groundwater conserved</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{t('dashboard.cost_saved')}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">₹{totalCostSaved}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Pump electricity saved</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{t('dashboard.actions_recorded')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{actionsCount}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Actions verified in log</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{t('risk_radar.overall_risk')}</span>
            <div className={`p-2 rounded-xl ${
              riskRadar.overall === 'HIGH' ? 'bg-red-50 text-red-600' : riskRadar.overall === 'MODERATE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${
            riskRadar.overall === 'HIGH' ? 'text-red-700' : riskRadar.overall === 'MODERATE' ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            {riskRadar.overall}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Based on 48h forecast</p>
        </div>
      </div>

      {/* 3. Main Split: Today's AI Advisory & Hyperlocal Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today's Primary Advisory */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('dashboard.today_advisory')}
                </h2>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-agri-50 text-agri-800 border border-agri-200">
                {advisory.evidenceQuality}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-agri-50/80 to-emerald-50/40 border border-agri-200/80 mb-4">
              <h3 className="text-base font-bold text-agri-950 mb-1">
                {advisory.actionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {advisory.actionSummary}
              </p>
            </div>

            {/* Quick Context Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate"><strong>Window:</strong> {advisory.timeWindow}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center space-x-2">
                <Wind className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate"><strong>Spray:</strong> {advisory.sprayStatus}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 line-clamp-2 italic mb-4">
              " {advisory.whyMatters} "
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Source: {advisory.source}
            </span>
            <Link
              to="/advisory"
              className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center space-x-1"
            >
              <span>{t('dashboard.view_reasoning')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Weather Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <CloudSun className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {weather.district} Weather
                </h2>
              </div>
              <button
                onClick={refreshWeather}
                disabled={weatherLoading}
                title="Refresh Weather"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Current Weather Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mb-4">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {weather.currentTemp}°C
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Feels like {weather.apparentTemp}°C • {weather.conditionText}
                </p>
              </div>
              <div className="text-right text-xs space-y-1 text-slate-300">
                <p>Rain (48h): <strong className="text-white">{weather.rainSum48h} mm</strong></p>
                <p>Humidity: <strong className="text-white">{weather.humidity}%</strong></p>
                <p>Wind: <strong className="text-white">{weather.windSpeed} km/h</strong></p>
              </div>
            </div>

            {/* Micro 3-day strip */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {(weather.daily || []).slice(0, 3).map((d, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-600">{d.day}</p>
                  <p className="text-xs font-bold text-slate-900 my-0.5">{d.maxTemp}° / {d.minTemp}°</p>
                  <p className="text-[10px] text-blue-600 font-medium">{d.rainMm} mm rain</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {weather.isLive ? 'Live Open-Meteo' : 'Cached / Sample Data'}
            </span>
            <Link
              to="/weather"
              className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center space-x-1"
            >
              <span>Full 7-Day Forecast</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Feature Shortcut Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Shortcut 1: Decision Simulator */}
        <Link
          to="/decision-simulator"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-agri-300 transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-800 transition-colors">
              {t('dashboard.decision_simulator_title')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {t('dashboard.decision_simulator_desc')}
            </p>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-xs font-bold text-agri-700">
            <span>{t('dashboard.open_simulator')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Shortcut 2: Early Risk Radar */}
        <Link
          to="/risk-radar"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-agri-300 transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-800 transition-colors">
              {t('dashboard.risk_radar_title')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {t('dashboard.risk_radar_desc')}
            </p>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-xs font-bold text-agri-700">
            <span>View 4 Microclimate Risks</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Shortcut 3: Farm Impact Tracker */}
        <Link
          to="/farm-impact"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-agri-300 transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-800 transition-colors">
              {t('dashboard.farm_impact_title')}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Log followed or modified recommendations and track estimated savings over time.
            </p>
          </div>
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center text-xs font-bold text-agri-700">
            <span>{t('dashboard.record_action')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

    </div>
  );
}
