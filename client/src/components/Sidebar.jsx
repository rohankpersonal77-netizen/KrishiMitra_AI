import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  BarChart3,
  Sprout,
  History,
  Settings,
  LogOut,
  Leaf,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useFarm } from '../context/FarmContext';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { farmProfile } = useFarm();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/weather', icon: CloudSun, label: t('nav.weather') },
    { to: '/decision-simulator', icon: SlidersHorizontal, label: t('nav.decision_simulator'), badge: 'Compare' },
    { to: '/advisory', icon: Sparkles, label: t('nav.advisory'), badge: 'AI' },
    { to: '/risk-radar', icon: ShieldAlert, label: t('nav.risk_radar') },
    { to: '/farm-impact', icon: BarChart3, label: t('nav.farm_impact') },
    { to: '/crop-profile', icon: Sprout, label: t('nav.crop_profile') },
    { to: '/history', icon: History, label: t('nav.history') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 w-64 select-none">
      
      {/* Brand Subheader */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-agri-950">Farmer Portal</h2>
            <p className="text-[11px] text-slate-500 capitalize">{farmProfile.cropType} • {farmProfile.district}</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-agri-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-agri-900 hover:bg-agri-50/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-agri-700'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Decision Engine Status Card */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-agri-50 to-emerald-50/60 border border-agri-200/60 text-xs text-agri-950">
        <div className="flex items-center justify-between font-semibold mb-1">
          <span className="flex items-center space-x-1 text-agri-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Decision Engine</span>
          </span>
          <span className="text-[9px] bg-agri-600 text-white px-1.5 py-0.2 rounded font-mono">v2.4</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Hybrid ICAR rules & Open-Meteo hyper-local forecast integration.
        </p>
      </div>

      {/* User Info & Logout Button */}
      {user && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-agri-800 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t('nav.logout')}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop and Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
