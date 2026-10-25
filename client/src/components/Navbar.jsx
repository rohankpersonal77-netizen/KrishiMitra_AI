import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Globe2, 
  Wifi, 
  WifiOff, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useFarm } from '../context/FarmContext';

export default function Navbar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { isOffline, isSimulatedOffline, toggleSimulatedOffline } = useOffline();
  const { farmProfile } = useFarm();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const languages = [
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', short: 'HI', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', short: 'MR', flag: '🌾' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onMobileMenuToggle}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-agri-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-agri-500"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl agri-gradient-header flex items-center justify-center text-white shadow-md shadow-agri-900/10 group-hover:scale-105 transition-transform duration-200">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-bold tracking-tight text-agri-950 font-poppins">
                    Krishi<span className="text-agri-600">Mitra</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {t('app_tagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Right: Agricultural Context, Language, Offline Simulation & User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Farm Location Badge (Tablet & Desktop) */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-agri-50 border border-agri-200/70 rounded-full text-xs text-agri-900">
              <span className="w-2 h-2 rounded-full bg-agri-500 animate-pulse"></span>
              <span className="font-semibold">{farmProfile.farmName}</span>
              <span className="text-slate-400">|</span>
              <span className="text-agri-700 capitalize">{farmProfile.district}, {farmProfile.cropType}</span>
            </div>

            {/* Offline Simulation Toggle Button */}
            <button
              onClick={toggleSimulatedOffline}
              title={isOffline ? 'Offline mode active (Click to simulate online)' : 'Online (Click to preview offline mode)'}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isOffline
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">{t('nav.offline_preview')}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
                aria-expanded={langMenuOpen}
                aria-label="Language selector"
              >
                <Globe2 className="w-4 h-4 text-agri-700" />
                <span className="font-semibold">
                  {languages.find((l) => l.code === language)?.short || 'EN'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('settings.language')}
                  </div>
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        language === item.code
                          ? 'bg-agri-50 text-agri-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {language === item.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-agri-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-agri-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-agri-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
                  </div>
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {user.isDemo && (
                        <span className="inline-block mt-1 text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {t('nav.demo_mode')}
                        </span>
                      )}
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Layers className="w-4 h-4 mr-2 text-slate-400" />
                      {t('nav.settings')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-agri-700 text-white hover:bg-agri-800 transition-colors shadow-xs"
              >
                {t('auth.sign_in')}
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
