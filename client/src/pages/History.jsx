import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Filter,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';

export default function History() {
  const { t } = useLanguage();
  const { savedAdvisories, savedScenarios, actions } = useFarm();
  const [activeTab, setActiveTab] = useState('all');

  const combinedRecords = [
    ...savedAdvisories.map((a) => ({ ...a, recordCategory: 'advisory', displayDate: a.timestamp })),
    ...savedScenarios.map((s) => ({ ...s, recordCategory: 'scenario', displayDate: s.date })),
    ...actions.map((act) => ({ ...act, recordCategory: 'action', displayDate: act.date })),
  ].sort((a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0));

  const filtered = combinedRecords.filter((rec) => {
    if (activeTab === 'all') return true;
    return rec.recordCategory === activeTab;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <HistoryIcon className="w-4 h-4 text-emerald-600" />
              <span>Audit Trail & Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('history.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('history.subtitle')}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {[
              { id: 'all', label: t('history.filter_all') },
              { id: 'advisory', label: t('history.filter_advisories') },
              { id: 'scenario', label: t('history.filter_scenarios') },
              { id: 'action', label: t('history.filter_actions') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-agri-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">{t('history.empty')}</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isAdvisory = item.recordCategory === 'advisory';
            const isScenario = item.recordCategory === 'scenario';
            const isAction = item.recordCategory === 'action';

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isAdvisory ? 'bg-purple-50 text-purple-700' : isScenario ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isAdvisory && <Sparkles className="w-4 h-4" />}
                    {isScenario && <SlidersHorizontal className="w-4 h-4" />}
                    {isAction && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.recordCategory}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.displayDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {item.actionTitle || item.title || item.advisoryTitle || 'Record entry'}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.actionSummary || item.rationale || item.notes || `Logged for ${item.crop}`}
                    </p>
                  </div>
                </div>

                {isAction && (
                  <div className="text-right text-xs font-semibold text-emerald-700 flex-shrink-0">
                    +{item.waterSaved} kL / ₹{item.costSaved} saved
                  </div>
                )}
                {isScenario && (
                  <div className="text-right text-xs font-semibold text-slate-600 flex-shrink-0">
                    Rec: Scenario {item.recommendation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
