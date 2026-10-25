import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Compass,
  Eye
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { useOffline } from '../context/OfflineContext';
import { DISTRICT_COORDINATES } from '../services/weatherService';

export default function Weather() {
  const { t } = useLanguage();
  const { farmProfile, weather, weatherLoading, weatherError, refreshWeather, updateFarmProfile } = useFarm();
  const { isOffline } = useOffline();

  const [selectedDistrict, setSelectedDistrict] = useState(farmProfile.district || 'Nashik');

  const handleDistrictChange = (d) => {
    setSelectedDistrict(d);
    updateFarmProfile({ district: d });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header with District Selector & Refresh */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <CloudSun className="w-4 h-4 text-emerald-600" />
              <span>{weather.isLive ? t('weather.live_data') : t('weather.fallback_data')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('weather.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('weather.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* District Selector */}
            <div className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <MapPin className="w-4 h-4 text-agri-700" />
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none"
              >
                {Object.keys(DISTRICT_COORDINATES).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={refreshWeather}
              disabled={weatherLoading}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
              <span>{t('weather.refresh')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agro-meteorological Warning Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex items-start space-x-3 ${
        weather.rainSum48h > 8
          ? 'bg-blue-50 border-blue-200 text-blue-950'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          weather.rainSum48h > 8 ? 'text-blue-600' : 'text-amber-600'
        }`} />
        <div>
          <h3 className="text-xs sm:text-sm font-bold mb-1">
            {t('weather.warning_alert')} ({weather.district})
          </h3>
          <p className="text-xs leading-relaxed">
            {weather.rainSum48h > 8 ? t('weather.rain_alert') : t('weather.no_rain_alert')}
          </p>
        </div>
      </div>

      {/* Current Conditions Dashboard Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-agri-950 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Current Microclimate • {weather.district}
            </span>
            <div className="flex items-baseline space-x-3 my-2">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                {weather.currentTemp}°C
              </span>
              <span className="text-sm sm:text-base text-slate-300">
                {t('weather.apparent_temp')}: {weather.apparentTemp}°C
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-100">
              {weather.conditionText}
            </p>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="flex items-center space-x-1.5 text-slate-300 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>48h Rain</span>
              </div>
              <p className="text-base font-bold text-white">{weather.rainSum48h} mm</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="flex items-center space-x-1.5 text-slate-300 mb-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('weather.humidity')}</span>
              </div>
              <p className="text-base font-bold text-white">{weather.humidity}%</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="flex items-center space-x-1.5 text-slate-300 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('weather.wind_speed')}</span>
              </div>
              <p className="text-base font-bold text-white">{weather.windSpeed} km/h</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t('weather.spray_condition')}:</span>
                <span className={`font-bold ${
                  weather.windSpeed < 12 && weather.rainSum48h < 10
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}>
                  {weather.windSpeed < 12 && weather.rainSum48h < 10 ? t('weather.spray_safe') : t('weather.spray_unsafe')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hourly 24-Hour Forecast Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-agri-700" />
          <span>{t('weather.hourly_forecast')} (Temperature & Rain Probability)</span>
        </h3>

        <div className="h-60 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weather.hourly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" fill="url(#colorTemp)" />
              <Area type="monotone" dataKey="rainProb" name="Rain Probability (%)" stroke="#3b82f6" fill="url(#colorRain)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Farm Outlook Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-agri-700" />
          <span>{t('weather.daily_forecast')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(weather.daily || []).map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-agri-50 border-agri-300 ring-2 ring-agri-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold text-slate-900">{day.day}</p>
              <p className="text-[10px] text-slate-400 mb-2">{day.date}</p>
              
              <div className="my-2">
                <span className="text-base font-extrabold text-slate-800">{day.maxTemp}°</span>
                <span className="text-xs text-slate-400 ml-1">/ {day.minTemp}°</span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-0.5">
                <p className="text-blue-600 font-semibold">{day.rainMm} mm</p>
                <p className="text-slate-500 text-[10px] truncate">{day.condition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
