import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Droplet,
  Wind,
  Thermometer,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';

export default function RiskRadar() {
  const { t } = useLanguage();
  const { farmProfile, weather, riskRadar } = useFarm();
  const [selectedRiskId, setSelectedRiskId] = useState(riskRadar.indicators[0]?.id || 'blight');

  const selectedRisk = riskRadar.indicators.find((r) => r.id === selectedRiskId) || riskRadar.indicators[0];

  const getRiskBadgeClass = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>{riskRadar.modelStatus}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('risk_radar.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('risk_radar.subtitle')}
            </p>
          </div>

          {/* Overall Risk Category Pill */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium">Cumulative Field Status:</span>
            <div className={`px-4 py-2 rounded-2xl text-xs font-extrabold tracking-wider border flex items-center space-x-2 ${
              getRiskBadgeClass(riskRadar.overall)
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                riskRadar.overall === 'HIGH' ? 'bg-red-500 animate-ping' : riskRadar.overall === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
              <span>{riskRadar.overall} RISK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Clickable 4 Risk Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskRadar.indicators.map((ind) => {
          const isSelected = ind.id === selectedRiskId;
          return (
            <div
              key={ind.id}
              onClick={() => setSelectedRiskId(ind.id)}
              className={`cursor-pointer rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-agri-600 shadow-card ring-2 ring-agri-500/20'
                  : 'bg-white border-slate-200/80 shadow-soft hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadgeClass(ind.level)}`}>
                    {ind.level}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {ind.score}/100
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {ind.title}
                </h3>

                <p className="text-[11px] text-slate-500 leading-snug">
                  {ind.factors}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-agri-700">
                <span>{isSelected ? 'Inspecting' : 'Inspect Details'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Risk Deep-Dive Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getRiskBadgeClass(selectedRisk.level)}`}>
                {selectedRisk.level} RISK LEVEL
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Score: {selectedRisk.score}/100</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {selectedRisk.title}
            </h2>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Active for: <strong className="text-slate-800 capitalize">{farmProfile.cropType}</strong> ({farmProfile.growthStage} stage)
          </div>
        </div>

        {/* Contributing Environmental Factors */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span>{t('risk_radar.contributing_factors')}</span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            {selectedRisk.factors}
          </div>
        </div>

        {/* Diagnostic Explanation */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-agri-600" />
            <span>Agronomic & Microclimatic Explanation</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            {selectedRisk.explanation}
          </p>
        </div>

        {/* Field Inspection Checklist */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-agri-700" />
            <span>{t('risk_radar.inspection_checklist')}</span>
          </h3>
          <div className="space-y-2.5">
            {selectedRisk.checklist.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-agri-300 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-normal">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent Methodology Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
          <p>
            <strong>Decision Model Notice:</strong> Early Risk Radar computes risk indices from forecast microclimate triggers and university plant pathology thresholds. It is not an in-situ optical diagnosis. Always verify plant foliage personally.
          </p>
        </div>

      </div>

    </div>
  );
}
