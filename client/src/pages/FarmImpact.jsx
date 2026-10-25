import React, { useState } from 'react';
import {
  BarChart3,
  Droplets,
  Coins,
  CheckCircle2,
  Calendar,
  Star,
  PlusCircle,
  Filter,
  TrendingDown,
  Info,
  Clock,
  Sparkles
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';

export default function FarmImpact() {
  const { t } = useLanguage();
  const { farmProfile, actions, addAction, advisory } = useFarm();

  const [isRecording, setIsRecording] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Form State for new action
  const [actionType, setActionType] = useState('followed');
  const [advisoryTitle, setAdvisoryTitle] = useState(advisory.actionTitle || 'Irrigation adjustment');
  const [actualWater, setActualWater] = useState(25);
  const [actualCost, setActualCost] = useState(120);
  const [waterSaved, setWaterSaved] = useState(30);
  const [costSaved, setCostSaved] = useState(150);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [toastMsg, setToastMsg] = useState('');

  // Aggregated totals
  const totalWaterSaved = actions.reduce((sum, a) => sum + (a.waterSaved || 0), 0);
  const totalCostSaved = actions.reduce((sum, a) => sum + (a.costSaved || 0), 0);
  const followedCount = actions.filter((a) => a.actionType === 'followed').length;
  const modifiedCount = actions.filter((a) => a.actionType === 'modified').length;
  const skippedCount = actions.filter((a) => a.actionType === 'skipped').length;

  const handleSubmitAction = (e) => {
    e.preventDefault();
    addAction({
      crop: farmProfile.cropType,
      actionType,
      advisoryTitle,
      actualWater: Number(actualWater),
      actualCost: Number(actualCost),
      waterSaved: Number(waterSaved),
      costSaved: Number(costSaved),
      notes: notes || 'Action executed as planned on the field.',
      rating: Number(rating),
    });

    setIsRecording(false);
    setToastMsg(t('farm_impact.action_saved'));
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Monthly trend chart data
  const monthlyData = [
    { month: 'Jul', standardUsage: 140, actualUsage: 95, saved: 45 },
    { month: 'Aug', standardUsage: 160, actualUsage: 110, saved: 50 },
    { month: 'Sep', standardUsage: 130, actualUsage: 80, saved: 50 },
    { month: 'Oct', standardUsage: 150, actualUsage: 85, saved: 65 },
  ];

  const filteredActions = actions.filter((a) => {
    if (filterType === 'all') return true;
    return a.actionType === filterType;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Measurable Resource Accountability</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('farm_impact.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('farm_impact.subtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isRecording ? 'Cancel Recording' : t('farm_impact.record_new_action')}</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Recording Form Modal / Drawer */}
      {isRecording && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-300 shadow-card animate-in fade-in">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-agri-700" />
            <span>{t('farm_impact.record_new_action')}</span>
          </h2>

          <form onSubmit={handleSubmitAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('farm_impact.action_type')}
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
                >
                  <option value="followed">{t('farm_impact.followed')}</option>
                  <option value="modified">{t('farm_impact.modified')}</option>
                  <option value="skipped">{t('farm_impact.skipped')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advisory Topic / Reference
                </label>
                <input
                  type="text"
                  value={advisoryTitle}
                  onChange={(e) => setAdvisoryTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('farm_impact.actual_water')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={actualWater}
                  onChange={(e) => setActualWater(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('farm_impact.actual_cost')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Water Saved (kL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={waterSaved}
                  onChange={(e) => setWaterSaved(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Cost Saved (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={costSaved}
                  onChange={(e) => setCostSaved(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('farm_impact.notes')}
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention crop observations, soil condition, or yield quality..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
              ></textarea>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-700">
                {t('farm_impact.rating')}:
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-500"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-agri-700 text-white hover:bg-agri-800 shadow-xs"
              >
                {t('farm_impact.save_action')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <span className="text-xs font-medium text-slate-500">{t('farm_impact.water_conserved_kl')}</span>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{totalWaterSaved} kL</p>
          <span className="text-[11px] text-slate-400">Total verified savings</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <span className="text-xs font-medium text-slate-500">{t('farm_impact.cost_savings_inr')}</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">₹{totalCostSaved}</p>
          <span className="text-[11px] text-slate-400">Pump & labor efficiency</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <span className="text-xs font-medium text-slate-500">{t('farm_impact.actions_completed')}</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{actions.length}</p>
          <span className="text-[11px] text-slate-400">{followedCount} followed, {modifiedCount} modified</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
          <span className="text-xs font-medium text-slate-500">Adoption Compliance</span>
          <p className="text-2xl font-extrabold text-agri-800 mt-1">
            {actions.length ? Math.round(((followedCount + modifiedCount * 0.5) / actions.length) * 100) : 100}%
          </p>
          <span className="text-[11px] text-slate-400">Advisory adherence rate</span>
        </div>
      </div>

      {/* Impact Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            {t('farm_impact.water_trend')}
          </h3>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="standardUsage" name="Regional Unmonitored Baseline (kL)" stroke="#94a3b8" fill="#f1f5f9" />
                <Area type="monotone" dataKey="actualUsage" name="KrishiMitra Optimized Irrigation (kL)" stroke="#3b82f6" fill="url(#colorActual)" />
                <Area type="monotone" dataKey="saved" name="Water Conserved (kL)" stroke="#15803d" fill="url(#colorSaved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Compliance Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Decision Breakdown
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900">{t('farm_impact.followed')}</span>
                  <p className="text-[11px] text-emerald-700">Executed exactly as advised</p>
                </div>
                <span className="text-lg font-extrabold text-emerald-800">{followedCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900">{t('farm_impact.modified')}</span>
                  <p className="text-[11px] text-amber-700">Adapted for specific plot</p>
                </div>
                <span className="text-lg font-extrabold text-amber-800">{modifiedCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">{t('farm_impact.skipped')}</span>
                  <p className="text-[11px] text-slate-500">Overridden due to ground factor</p>
                </div>
                <span className="text-lg font-extrabold text-slate-700">{skippedCount}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-tight italic">
            {t('farm_impact.disclaimer')}
          </p>
        </div>

      </div>

      {/* Field Actions Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base font-bold text-slate-900">
            Recorded Farm Actions Ledger
          </h3>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white"
            >
              <option value="all">All Actions</option>
              <option value="followed">Followed</option>
              <option value="modified">Modified</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Decision</th>
                <th className="py-3 px-3">Advisory Action</th>
                <th className="py-3 px-3">Water Applied</th>
                <th className="py-3 px-3">Savings (Water / ₹)</th>
                <th className="py-3 px-3">Farmer Notes</th>
                <th className="py-3 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActions.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-medium whitespace-nowrap">{act.date}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      act.actionType === 'followed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : act.actionType === 'modified'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {act.actionType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">{act.advisoryTitle}</td>
                  <td className="py-3 px-3">{act.actualWater} kL</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold whitespace-nowrap">
                    +{act.waterSaved} kL / ₹{act.costSaved}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-500">{act.notes}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-amber-500 font-bold">★ {act.rating}/5</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
