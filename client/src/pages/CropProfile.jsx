import React, { useState } from 'react';
import {
  Sprout,
  Save,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Droplet,
  Info,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { CROPS_CONFIG } from '../utils/agriEngine';

export default function CropProfile() {
  const { t } = useLanguage();
  const { farmProfile, updateFarmProfile } = useFarm();

  const [farmName, setFarmName] = useState(farmProfile.farmName || '');
  const [district, setDistrict] = useState(farmProfile.district || 'Nashik');
  const [cropType, setCropType] = useState(farmProfile.cropType || 'tomato');
  const [area, setArea] = useState(farmProfile.area || 2.5);
  const [areaUnit, setAreaUnit] = useState(farmProfile.areaUnit || 'acres');
  const [growthStage, setGrowthStage] = useState(farmProfile.growthStage || 'flowering');
  const [soilType, setSoilType] = useState(farmProfile.soilType || 'Black Cotton Soil (Heavy Vertisol)');
  const [irrigationType, setIrrigationType] = useState(farmProfile.irrigationType || 'Drip Irrigation');
  const [soilMoisture, setSoilMoisture] = useState(farmProfile.soilMoisture || 42);
  const [sowingDate, setSowingDate] = useState(farmProfile.sowingDate || '2026-08-20');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedCrop = CROPS_CONFIG[cropType] || CROPS_CONFIG.tomato;

  const handleSave = (e) => {
    e.preventDefault();
    updateFarmProfile({
      farmName,
      district,
      cropType,
      area: Number(area),
      areaUnit,
      growthStage,
      soilType,
      irrigationType,
      soilMoisture: Number(soilMoisture),
      sowingDate,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Phenological Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('crop_profile.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('crop_profile.subtitle')}
            </p>
          </div>

          {saveSuccess && (
            <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t('crop_profile.profile_saved')}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Farm & Plot Identity */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-agri-700" />
            <span>Farm Location & Landholding</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.farm_name')} *
            </label>
            <input
              type="text"
              required
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="e.g. Godavari Orchard (Block 2)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('crop_profile.state')}
              </label>
              <input
                type="text"
                disabled
                value="Maharashtra"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('crop_profile.district')} *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
              >
                {['Nashik', 'Pune', 'Ahmednagar', 'Solapur', 'Kolhapur', 'Chhatrapati Sambhajinagar', 'Jalgaon', 'Nagpur'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('crop_profile.area')} *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('crop_profile.area_unit')}
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
              >
                <option value="acres">{t('common.acres')}</option>
                <option value="guntha">{t('common.guntha')}</option>
                <option value="hectares">{t('common.hectares')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.soil_type')}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
            >
              <option value="Black Cotton Soil (Heavy Vertisol)">Black Cotton Soil (Heavy Vertisol - High moisture retention)</option>
              <option value="Medium Clay Loam">Medium Clay Loam (Balanced drainage & nutrient buffer)</option>
              <option value="Sandy Loam">Sandy Loam (Fast drainage, frequent light cycles)</option>
              <option value="Red Laterite Soil">Red Laterite Soil (Low water retention, acid-neutral)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('crop_profile.irrigation_type')}
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
            >
              <option value="Drip Irrigation">Drip Irrigation (High efficiency 85-90%)</option>
              <option value="Micro-Sprinkler">Micro-Sprinkler (Microclimate cooling & frost relief)</option>
              <option value="Furrow / Ridge">Furrow / Ridge Basin (Traditional gravity flow)</option>
              <option value="Flood Irrigation">Flood Basin (Unmonitored high volume)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Crop Phenology & Observed Moisture */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-agri-700" />
              <span>Crop Type & Growth Phenology</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('crop_profile.crop_type')} *
              </label>
              <select
                value={cropType}
                onChange={(e) => {
                  setCropType(e.target.value);
                  const c = CROPS_CONFIG[e.target.value];
                  if (c) setGrowthStage(c.stages[1].id);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
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
                {t('crop_profile.growth_stage')} *
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none bg-white"
              >
                {selectedCrop.stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop_profile.sowing_date')}
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop_profile.soil_moisture')} (%)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="1"
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(e.target.value)}
                    className="w-full accent-agri-700"
                  />
                  <span className="text-xs font-bold text-slate-800 w-10 text-right">
                    {soilMoisture}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Phenology Recalibration Notice:</strong>
              Changing the crop or growth stage immediately adjusts the crop coefficient (Kc), root depth parameters, and fungal pathogen vulnerability thresholds across the decision simulator and advisory modules.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs bg-agri-700 hover:bg-agri-800 text-white shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('crop_profile.save_profile')}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
