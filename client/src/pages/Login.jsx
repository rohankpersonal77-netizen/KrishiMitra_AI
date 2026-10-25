import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Eye, 
  EyeOff, 
  CloudSun, 
  BrainCircuit, 
  Droplets, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { login, exploreDemo, loading, authError } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoModal, setInfoModal] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.error || t('auth.invalid_credentials'));
    }
  };

  const handleExploreDemo = () => {
    exploreDemo();
    navigate('/dashboard');
  };

  const handleForgotPassword = () => {
    setInfoModal(t('auth.forgot_password_demo'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      
      {/* Top Bar Language Selector */}
      <div className="max-w-5xl mx-auto w-full flex justify-end items-center mb-4 space-x-2">
        <span className="text-xs text-slate-500 font-medium">Language:</span>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
          {['en', 'hi', 'mr'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === lang
                  ? 'bg-agri-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl shadow-card overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Section: Rich Agricultural Visual & Brand Identity */}
        <div className="lg:col-span-5 agri-gradient-header text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Decorative Geometry */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Logo Badge */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Krishi<span className="text-emerald-300">Mitra</span>
                  <span className="text-xs uppercase bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-1.5 py-0.5 rounded ml-2">AI</span>
                </h1>
                <p className="text-xs text-emerald-100 font-medium">{t('app_tagline')}</p>
              </div>
            </div>

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-8">
              {t('app_subtext')}
            </p>

            {/* Three Compact Value Props */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300 flex-shrink-0">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">{t('auth.weather_intel')}</h2>
                  <p className="text-[11px] text-emerald-100/80 leading-normal">{t('auth.weather_intel_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300 flex-shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">{t('auth.explainable_ai')}</h2>
                  <p className="text-[11px] text-emerald-100/80 leading-normal">{t('auth.explainable_ai_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300 flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">{t('auth.climate_smart')}</h2>
                  <p className="text-[11px] text-emerald-100/80 leading-normal">{t('auth.climate_smart_desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Transparent & Open Agronomy</span>
            </span>
            <span className="font-mono text-[10px]">ICAR-Calibrated</span>
          </div>
        </div>

        {/* Right Section: Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('auth.sign_in')}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your crop-specific advisories, simulators, and impact ledgers.
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {(errorMsg || authError) && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{errorMsg || authError}</span>
              </div>
            )}

            {/* Instant Demo Alert */}
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <p className="text-xs font-bold text-emerald-900">New visitor or testing prototype?</p>
                  <p className="text-[11px] text-emerald-700">Explore instantly with our Nashik sample farmer account.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExploreDemo}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-1 flex-shrink-0"
              >
                <span>{t('auth.explore_demo')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.patil@krishimitra.ai"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t('auth.password')}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-agri-700 hover:text-agri-800 underline"
                  >
                    {t('auth.forgot_password')}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-agri-600 focus:ring-agri-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">{t('auth.remember_me')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-agri-700 hover:bg-agri-800 active:bg-agri-900 text-white shadow-md shadow-agri-800/15 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{t('auth.sign_in')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Navigation Link */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              {t('auth.no_account')}{' '}
              <Link to="/signup" className="font-bold text-agri-700 hover:text-agri-800 underline">
                {t('auth.sign_up')}
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Info / Forgot Password Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Password Assistance</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">{infoModal}</p>
            <button
              onClick={() => setInfoModal('')}
              className="w-full py-2 bg-agri-700 text-white rounded-xl text-xs font-semibold hover:bg-agri-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
