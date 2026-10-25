import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe2,
  WifiOff,
  Trash2,
  CheckCircle2,
  Info,
  Cpu,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { isOffline, isSimulatedOffline, toggleSimulatedOffline } = useOffline();
  const [cacheClearedMsg, setCacheClearedMsg] = useState('');

  const handleClearCache = () => {
    localStorage.removeItem('krishi_weather_Nashik');
    localStorage.removeItem('krishi_weather_Pune');
    localStorage.removeItem('krishi_saved_advisories');
    setCacheClearedMsg(t('settings.storage_cleared'));
    setTimeout(() => setCacheClearedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4 text-emerald-600" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {cacheClearedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{cacheClearedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Language Selection Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
          <div className="flex items-center space-x-2.5 mb-4">
            <Globe2 className="w-5 h-5 text-agri-700" />
            <h2 className="text-base font-bold text-slate-900">{t('settings.language')}</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Switch UI labels, advisories, risk checklists, and forms across all 3 supported Indian languages.
          </p>

          <div className="space-y-2.5">
            {[
              { code: 'en', name: 'English', desc: 'Standard Agricultural English' },
              { code: 'hi', name: 'हिन्दी (Hindi)', desc: 'राष्ट्रीय मानक हिन्दी' },
              { code: 'mr', name: 'मराठी (Marathi)', desc: 'महाराष्ट्रातील शेतकऱ्यांसाठी अस्सल मराठी' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  language === item.code
                    ? 'bg-agri-50 border-agri-500 ring-2 ring-agri-500/20 shadow-2xs font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                {language === item.code && (
                  <CheckCircle2 className="w-4 h-4 text-agri-700" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Simulation (PWA Companion) Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <WifiOff className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">{t('settings.offline_toggle')}</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {t('settings.offline_desc')}. In this state, KrishiMitra AI displays cached farm profiles and cached Open-Meteo forecasts with distinct freshness warnings.
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950">
                  {isSimulatedOffline ? 'Offline Mode Active' : 'Online Mode Active'}
                </span>
                <p className="text-[11px] text-amber-800">
                  {isSimulatedOffline ? 'Serving locally cached advisories & weather' : 'Live network synchronization enabled'}
                </p>
              </div>

              <button
                onClick={toggleSimulatedOffline}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isSimulatedOffline
                    ? 'bg-amber-800 text-white hover:bg-amber-900'
                    : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                }`}
              >
                {isSimulatedOffline ? 'Disable Offline' : 'Enable Offline'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
            <div>
              <span className="text-xs font-semibold text-slate-700">Cache Management</span>
              <p className="text-[11px] text-slate-400">Purge local weather cache</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('settings.clear_cache')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* AI/ML Agricultural Decision Engine Transparency Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex items-center space-x-2 text-agri-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Architecture & Model Documentation</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          AI/ML Agricultural Decision Engine
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {t('settings.engine_info')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500">Model Framework</span>
            <p className="font-bold text-slate-900 mt-0.5">Hybrid Rule-Base & Open-Meteo</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500">Agronomic Calibration</span>
            <p className="font-bold text-slate-900 mt-0.5">ICAR & MPKV Rahuri Benchmarks</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500">Extensibility</span>
            <p className="font-bold text-slate-900 mt-0.5">Modular Python / Scikit-learn Ready</p>
          </div>
        </div>
      </div>

    </div>
  );
}
