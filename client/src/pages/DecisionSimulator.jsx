import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CloudRain,
  Droplet,
  Zap,
  Save,
  CheckCircle2,
  Info,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Scale
} from 'lucide-react';
import { 
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
import { simulateScenarios, CROPS_CONFIG } from '../utils/agriEngine';

export default function DecisionSimulator() {
  const { t } = useLanguage();
  const { farmProfile, weather, saveScenario } = useFarm();

  // Inputs
  const [area, setArea] = useState(farmProfile.area || 2.5);
  const [cropType, setCropType] = useState(farmProfile.cropType || 'tomato');
  const [growthStage, setGrowthStage] = useState(farmProfile.growthStage || 'flowering');
  const [soilMoisture, setSoilMoisture] = useState(farmProfile.soilMoisture || 42);
  const [rainForecast, setRainForecast] = useState(weather.rainSum48h || 14);
  const [irrigationMethod, setIrrigationMethod] = useState(farmProfile.irrigationType || 'Drip Irrigation');
  const [waterDepth, setWaterDepth] = useState(25); // mm
  const [pumpingHours, setPumpingHours] = useState(4.0); // hrs
  const [powerCostPerHour, setPowerCostPerHour] = useState(50); // Rs/hr
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Run simulation
  const simulation = simulateScenarios({
    area: Number(area),
    cropType,
    growthStage,
    soilMoisture: Number(soilMoisture),
    rainForecast: Number(rainForecast),
    irrigationMethod,
    waterDepthA: Number(waterDepth),
    pumpingHoursA: Number(pumpingHours),
    powerCostPerHour: Number(powerCostPerHour),
  });

  const handleSave = () => {
    saveScenario({
      title: `${simulation.scenarioA.name} vs ${simulation.scenarioB.name}`,
      crop: cropType,
      stage: growthStage,
      rainForecast,
      soilMoisture,
      waterSaved_kL: simulation.savings.water_kL,
      costSaved_inr: simulation.savings.cost_inr,
      recommendation: simulation.recommendation,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const crop = CROPS_CONFIG[cropType] || CROPS_CONFIG.tomato;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Interactive Decision Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('decision_simulator.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('decision_simulator.subtitle')}
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{t('decision_simulator.scenario_saved')}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t('decision_simulator.save_scenario')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulator Inputs Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <span>{t('decision_simulator.current_context')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.crop_type')}
            </label>
            <select
              value={cropType}
              onChange={(e) => {
                setCropType(e.target.value);
                const c = CROPS_CONFIG[e.target.value];
                if (c) setGrowthStage(c.stages[1].id);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
            >
              {Object.keys(CROPS_CONFIG).map((cKey) => (
                <option key={cKey} value={cKey}>
                  {CROPS_CONFIG[cKey].name.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.growth_stage')}
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
            >
              {crop.stages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.area')} ({farmProfile.areaUnit})
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('decision_simulator.rainfall_expected')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={rainForecast}
                onChange={(e) => setRainForecast(e.target.value)}
                className="w-full accent-agri-700"
              />
              <span className="text-xs font-bold text-slate-800 w-12 text-right">
                {rainForecast} mm
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('decision_simulator.soil_moisture')} (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10"
                max="90"
                step="2"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                className="w-full accent-agri-700"
              />
              <span className="text-xs font-bold text-slate-800 w-10 text-right">
                {soilMoisture}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('decision_simulator.irrigation_amount')}
            </label>
            <input
              type="number"
              min="5"
              max="60"
              step="1"
              value={waterDepth}
              onChange={(e) => setWaterDepth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('decision_simulator.pumping_hours')}
            </label>
            <input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={pumpingHours}
              onChange={(e) => setPumpingHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('decision_simulator.electricity_cost')}
            </label>
            <input
              type="number"
              min="10"
              max="250"
              step="5"
              value={powerCostPerHour}
              onChange={(e) => setPowerCostPerHour(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
            />
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario A Card */}
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all ${
          simulation.recommendation === 'A'
            ? 'bg-white border-agri-500 ring-2 ring-agri-400/30 shadow-card'
            : 'bg-white border-slate-200/80 shadow-soft opacity-95'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('decision_simulator.scenario_a')}
            </span>
            {simulation.recommendation === 'A' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-agri-100 text-agri-800 border border-agri-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-agri-700" />
                <span>Recommended</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {t('decision_simulator.scenario_a_name')}
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500">{t('decision_simulator.water_volume')}</span>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {simulation.scenarioA.waterVolume_kL} <span className="text-xs font-normal">kL</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500">{t('decision_simulator.est_cost')}</span>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                ₹{simulation.scenarioA.cost}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 mb-3 space-y-1.5">
            <p><strong>Pumping Duration:</strong> {simulation.scenarioA.pumpingHours} hours</p>
            <p><strong>Soil Moisture Outcome:</strong> {simulation.scenarioA.moistureOutcome}</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
            <strong>{t('decision_simulator.risk_tradeoff')}:</strong> {simulation.scenarioA.tradeoff}
          </div>
        </div>

        {/* Scenario B Card */}
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all ${
          simulation.recommendation === 'B'
            ? 'bg-white border-emerald-500 ring-2 ring-emerald-400/30 shadow-card'
            : 'bg-white border-slate-200/80 shadow-soft'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {t('decision_simulator.scenario_b')}
            </span>
            {simulation.recommendation === 'B' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>AI Recommended</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {t('decision_simulator.scenario_b_name')}
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] text-emerald-800">{t('decision_simulator.water_volume')}</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-0.5">
                {simulation.scenarioB.waterVolume_kL} <span className="text-xs font-normal">kL</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] text-emerald-800">{t('decision_simulator.est_cost')}</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-0.5">
                ₹{simulation.scenarioB.cost}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 mb-3 space-y-1.5">
            <p><strong>Supplemental Pumping:</strong> {simulation.scenarioB.pumpingHours} hours</p>
            <p><strong>Soil Moisture Outcome:</strong> {simulation.scenarioB.moistureOutcome}</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <strong>{t('decision_simulator.risk_tradeoff')}:</strong> {simulation.scenarioB.tradeoff}
          </div>
        </div>

      </div>

      {/* Comparison Chart and Engine Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Comparison Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Side-by-Side Resource Consumption
          </h3>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={simulation.comparison}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="scenarioA" name="Scenario A (Irrigate Now)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="scenarioB" name="Scenario B (Adaptive Rain)" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engine Verdict and Agronomic Limitation Note */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              <span>{t('decision_simulator.recommendation_verdict')}</span>
            </div>

            <div className="p-4 rounded-2xl bg-agri-50 border border-agri-200 text-agri-950 mb-4">
              <h4 className="text-sm font-bold mb-1">
                {simulation.recommendation === 'B' ? 'Adopt Climate-Smart Delay (Scenario B)' : 'Proceed With Irrigation (Scenario A)'}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {simulation.rationale}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-4">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Potential Water Conservation:</span>
                <strong className="text-emerald-700">{simulation.savings.water_kL} kL</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Potential Energy Savings:</span>
                <strong className="text-emerald-700">₹{simulation.savings.cost_inr}</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 leading-relaxed">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Agronomic Notice:</strong> {t('decision_simulator.missing_info')} A rainfall forecast alone does not replace on-field tactile verification.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
