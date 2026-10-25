import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateAdvisory, calculateRiskRadar } from '../utils/agriEngine';
import { fetchDistrictWeather, SAMPLE_WEATHER_DATA } from '../services/weatherService';
import { useOffline } from './OfflineContext';

const FarmContext = createContext();

const DEFAULT_PROFILE = {
  farmName: 'Sahyadri Bio-Farms (Plot A)',
  state: 'Maharashtra',
  district: 'Nashik',
  cropType: 'tomato',
  area: 2.5,
  areaUnit: 'acres',
  growthStage: 'flowering',
  soilType: 'Black Cotton Soil (Heavy Vertisol)',
  irrigationType: 'Drip Irrigation',
  soilMoisture: 42,
  sowingDate: '2026-08-20',
};

const DEFAULT_ACTIONS = [
  {
    id: 'act_1',
    date: '2026-10-22',
    crop: 'tomato',
    actionType: 'followed',
    advisoryTitle: 'Delayed Irrigation Cycle ahead of 14mm rain',
    actualWater: 0,
    actualCost: 0,
    waterSaved: 50, // kL
    costSaved: 220, // Rs
    notes: 'Rain occurred as forecast (11mm actual). Saved 4 hours of pumping and avoided fertilizer leaching.',
    rating: 5,
  },
  {
    id: 'act_2',
    date: '2026-10-18',
    crop: 'tomato',
    actionType: 'modified',
    advisoryTitle: 'Prophylactic Copper Spray for Early Blight',
    actualWater: 15,
    actualCost: 350,
    waterSaved: 10,
    costSaved: 50,
    notes: 'Applied copper oxychloride at 2.5g/L early morning before wind picked up.',
    rating: 4,
  },
  {
    id: 'act_3',
    date: '2026-10-12',
    crop: 'tomato',
    actionType: 'followed',
    advisoryTitle: 'Timed Morning Drip Cycle at Flowering',
    actualWater: 45,
    actualCost: 180,
    waterSaved: 25,
    costSaved: 110,
    notes: 'Ran drip for 2.5 hours early at 7 AM. Flower drop minimized.',
    rating: 5,
  },
];

export const FarmProvider = ({ children }) => {
  const { isOffline, updateSyncTimestamp } = useOffline();

  const [farmProfile, setFarmProfileState] = useState(() => {
    try {
      const stored = localStorage.getItem('krishi_farm_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [weather, setWeather] = useState(SAMPLE_WEATHER_DATA);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [advisory, setAdvisory] = useState(() => generateAdvisory(farmProfile, SAMPLE_WEATHER_DATA));
  const [riskRadar, setRiskRadar] = useState(() => calculateRiskRadar(farmProfile, SAMPLE_WEATHER_DATA));

  const [savedAdvisories, setSavedAdvisories] = useState(() => {
    try {
      const s = localStorage.getItem('krishi_saved_advisories');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [actions, setActions] = useState(() => {
    try {
      const a = localStorage.getItem('krishi_farm_actions');
      return a ? JSON.parse(a) : DEFAULT_ACTIONS;
    } catch {
      return DEFAULT_ACTIONS;
    }
  });

  const [savedScenarios, setSavedScenarios] = useState(() => {
    try {
      const sc = localStorage.getItem('krishi_saved_scenarios');
      return sc ? JSON.parse(sc) : [];
    } catch {
      return [];
    }
  });

  // Load weather when district or offline mode changes
  const loadWeather = async (districtName = farmProfile.district) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const w = await fetchDistrictWeather(districtName, isOffline);
      setWeather(w);
      updateSyncTimestamp();
    } catch (err) {
      console.error(err);
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(farmProfile.district);
  }, [farmProfile.district, isOffline]);

  // Recalculate advisory & risk whenever farmProfile or weather changes
  useEffect(() => {
    if (weather) {
      const adv = generateAdvisory(farmProfile, weather);
      const risk = calculateRiskRadar(farmProfile, weather);
      setAdvisory(adv);
      setRiskRadar(risk);
      // Cache latest advisory for offline access
      localStorage.setItem('krishi_latest_advisory', JSON.stringify(adv));
    }
  }, [farmProfile, weather]);

  const updateFarmProfile = (newProfile) => {
    setFarmProfileState((prev) => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('krishi_farm_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const addAction = (newAction) => {
    const actionObj = {
      id: 'act_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newAction,
    };
    setActions((prev) => {
      const updated = [actionObj, ...prev];
      localStorage.setItem('krishi_farm_actions', JSON.stringify(updated));
      return updated;
    });
    return actionObj;
  };

  const saveScenario = (scenarioData) => {
    const scenarioObj = {
      id: 'scen_' + Date.now(),
      date: new Date().toISOString(),
      ...scenarioData,
    };
    setSavedScenarios((prev) => {
      const updated = [scenarioObj, ...prev];
      localStorage.setItem('krishi_saved_scenarios', JSON.stringify(updated));
      return updated;
    });
    return scenarioObj;
  };

  const toggleSaveAdvisory = (adv) => {
    setSavedAdvisories((prev) => {
      const exists = prev.some((item) => item.id === adv.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== adv.id);
      } else {
        updated = [adv, ...prev];
      }
      localStorage.setItem('krishi_saved_advisories', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FarmContext.Provider
      value={{
        farmProfile,
        updateFarmProfile,
        weather,
        weatherLoading,
        weatherError,
        refreshWeather: () => loadWeather(farmProfile.district),
        advisory,
        riskRadar,
        actions,
        addAction,
        savedScenarios,
        saveScenario,
        savedAdvisories,
        toggleSaveAdvisory,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
