/**
 * KrishiMitra Explainable Agricultural Decision Engine
 * Transparent agronomic rule sets based on ICAR, agricultural university guidelines,
 * and micro-climatic inputs (Open-Meteo).
 */

export const CROPS_CONFIG = {
  tomato: {
    id: 'tomato',
    name: { en: 'Tomato (टोमॅटो)', hi: 'टमाटर', mr: 'टोमॅटो' },
    stages: [
      { id: 'seedling', name: { en: 'Seedling (0-20d)', hi: 'अंकुरण / रोपाई', mr: 'रोपे / पुनर्लागवड' } },
      { id: 'vegetative', name: { en: 'Vegetative Growth (20-45d)', hi: 'वानस्पतिक वृद्धि', mr: 'शाकीय वाढ' } },
      { id: 'flowering', name: { en: 'Flowering & Fruit Set (45-65d)', hi: 'फूल व फल लगने की अवस्था', mr: 'फुलकळी व फळधारणा' } },
      { id: 'fruiting', name: { en: 'Fruit Development & Harvest (65d+)', hi: 'फल विकास व तुड़ाई', mr: 'फळ विकास व काढणी' } },
    ],
    kcValues: { seedling: 0.6, vegetative: 0.85, flowering: 1.15, fruiting: 0.95 },
    moistureThreshold: { critical: 45, optimal: 65 },
    diseases: ['Early Blight', 'Late Blight', 'Blossom End Rot', 'Fruit Borer'],
  },
  onion: {
    id: 'onion',
    name: { en: 'Onion (कांदा)', hi: 'प्याज', mr: 'कांदा' },
    stages: [
      { id: 'seedling', name: { en: 'Transplanting (0-25d)', hi: 'रोपण अवस्था', mr: 'पुनर्लागवड अवस्था' } },
      { id: 'vegetative', name: { en: 'Vegetative (Foliage 25-60d)', hi: 'वानस्पतिक विकास', mr: 'पातीची वाढ' } },
      { id: 'bulb_init', name: { en: 'Bulb Initiation (60-85d)', hi: 'कंद बनना शुरू', mr: 'कांदा पोसणे सुरुवात' } },
      { id: 'bulb_dev', name: { en: 'Bulb Development & Maturity (85d+)', hi: 'कंद परिपक्वता', mr: 'कांदा पक्वता व काढणी' } },
    ],
    kcValues: { seedling: 0.5, vegetative: 0.75, bulb_init: 1.05, bulb_dev: 0.8 },
    moistureThreshold: { critical: 40, optimal: 60 },
    diseases: ['Purple Blotch', 'Stemphylium Blight', 'Thrips Infestation'],
  },
  grapes: {
    id: 'grapes',
    name: { en: 'Grapes (द्राक्षे)', hi: 'अंगूर', mr: 'द्राक्षे' },
    stages: [
      { id: 'sprouting', name: { en: 'Shoot Growth (Post-Pruning)', hi: 'कटाई उपरांत फुटाव', mr: 'छाटणीनंतर नवीन फूट' } },
      { id: 'flowering', name: { en: 'Flowering & Cap Fall', hi: 'फूल आने की अवस्था', mr: 'फुलोरा व मणी धारणा' } },
      { id: 'berry_dev', name: { en: 'Berry Development (Pea to Marble)', hi: 'दाने का विकास', mr: 'मणी विकास (वाटाणा-गोळी)' } },
      { id: 'veraison', name: { en: 'Veraison & Ripening', hi: 'मिठास व रंग बदलना', mr: 'मण्यात साखर उतरणे व पक्वता' } },
    ],
    kcValues: { sprouting: 0.45, flowering: 0.75, berry_dev: 0.9, veraison: 0.65 },
    moistureThreshold: { critical: 50, optimal: 70 },
    diseases: ['Downy Mildew', 'Powdery Mildew', 'Anthracnose', 'Berry Cracking'],
  },
  cotton: {
    id: 'cotton',
    name: { en: 'Cotton (कापूस)', hi: 'कपास', mr: 'कापूस' },
    stages: [
      { id: 'seedling', name: { en: 'Seedling Emergence', hi: 'अंकुरण अवस्था', mr: 'उगवण अवस्था' } },
      { id: 'vegetative', name: { en: 'Square Formation', hi: 'शाकीय विकास', mr: 'पात्या लागणे' } },
      { id: 'flowering', name: { en: 'Flowering & Boll Formation', hi: 'फूल व ढोंडे लगना', mr: 'फुलोरा व बोंड धारणा' } },
      { id: 'boll_dev', name: { en: 'Boll Bursting & Maturity', hi: 'कपास फटना', mr: 'बोंडे फुटणे व वेचणी' } },
    ],
    kcValues: { seedling: 0.4, vegetative: 0.75, flowering: 1.1, boll_dev: 0.7 },
    moistureThreshold: { critical: 40, optimal: 60 },
    diseases: ['Pink Bollworm', 'Leaf Curl Virus', 'Para-Wilt'],
  },
  sugarcane: {
    id: 'sugarcane',
    name: { en: 'Sugarcane (ऊस)', hi: 'गन्ना', mr: 'ऊस' },
    stages: [
      { id: 'germination', name: { en: 'Germination Phase (0-35d)', hi: 'अंकुरण अवस्था', mr: 'उगवण अवस्था' } },
      { id: 'tillering', name: { en: 'Tillering Phase (35-100d)', hi: 'कल्ले फूटने की अवस्था', mr: 'फुटवे फुटण्याची अवस्था' } },
      { id: 'grand_growth', name: { en: 'Grand Growth Phase (100-270d)', hi: 'तीव्र बढ़वार काल', mr: 'कांडी वाढीचा काळ' } },
      { id: 'maturity', name: { en: 'Ripening Phase (270-360d)', hi: 'परिपक्वता काल', mr: 'साखर पक्वता काळ' } },
    ],
    kcValues: { germination: 0.5, tillering: 0.85, grand_growth: 1.25, maturity: 0.7 },
    moistureThreshold: { critical: 55, optimal: 75 },
    diseases: ['Red Rot', 'Smut', 'Early Shoot Borer'],
  },
};

/**
 * Generate Explainable Advisory based on crop profile and weather conditions
 */
export function generateAdvisory(cropProfile, weather) {
  const crop = CROPS_CONFIG[cropProfile.cropType] || CROPS_CONFIG.tomato;
  const stage = cropProfile.growthStage || crop.stages[1].id;
  const rain48h = weather?.rainSum48h || 0;
  const maxTemp = weather?.currentTemp || 28;
  const humidity = weather?.humidity || 65;
  const windSpeed = weather?.windSpeed || 8;
  const moisture = Number(cropProfile.soilMoisture) || 50;

  // Decision Logic
  let actionTitle = '';
  let actionSummary = '';
  let evidenceQuality = 'High (Multi-parameter Rule Match)';
  let timeWindow = 'Next 24 to 36 hours';
  let ruleId = '';
  let whyMatters = '';
  let assumptions = 'Calculated for medium clay loam soil, active root zone depth, and standard crop coefficient (Kc).';
  let verifyBefore = 'Verify topsoil dryness (depth 5cm) and check local IMD radar rain clouds before starting irrigation pump.';

  if (rain48h >= 12) {
    ruleId = `RULE-HYDRA-RAIN-${crop.id.toUpperCase()}-01`;
    actionTitle = 'Postpone Irrigation — Rain Predicted';
    actionSummary = `Forecast indicates ${rain48h.toFixed(1)} mm rainfall in the next 48 hours. Postpone scheduled irrigation cycle.`;
    whyMatters = `Applying water immediately before rainfall can waterlog the root zone, cause nutrient leaching, and induce root asphyxiation, especially during the ${stage} stage.`;
    timeWindow = 'Hold irrigation for 48 hours until rain subsides';
  } else if (moisture < 40 && rain48h < 5) {
    ruleId = `RULE-DEFICIT-IRR-${crop.id.toUpperCase()}-02`;
    actionTitle = 'Apply Timed Irrigation Cycle';
    actionSummary = `Observed soil moisture (${moisture}%) has dropped below critical threshold. Minimal rain predicted (${rain48h} mm).`;
    whyMatters = `At the ${stage} stage, water stress causes stomatal closure, reducing photosynthesis and leading to premature flower/fruit drop.`;
    timeWindow = 'Early morning (06:00 - 09:30 AM) to minimize evaporation';
  } else if (humidity > 78 && maxTemp >= 22 && maxTemp <= 30) {
    ruleId = `RULE-PATHOGEN-MICRO-${crop.id.toUpperCase()}-03`;
    actionTitle = 'Microclimate Fungal Blight Alert';
    actionSummary = `Elevated relative humidity (${humidity}%) and warm temperatures (${maxTemp}°C) create optimal conditions for fungal spores.`;
    whyMatters = `High humidity combined with leaf wetness promotes rapid germination of fungal conidia (Blight/Downy Mildew) within 6-8 hours.`;
    timeWindow = 'Inspect field leaves within next 12 hours';
    verifyBefore = 'Check underside of lower leaves for water-soaked lesions or white mildew patches.';
  } else {
    ruleId = `RULE-MAINT-CYCLE-${crop.id.toUpperCase()}-04`;
    actionTitle = 'Maintain Controlled Irrigation & Monitor Canopy';
    actionSummary = `Weather is stable (${maxTemp}°C, ${humidity}% RH). Soil moisture is adequate at ${moisture}%.`;
    whyMatters = `Stable microclimate supports continuous vegetative and reproductive growth. Over-watering should be avoided.`;
    timeWindow = 'Next 48 hours routine monitoring';
  }

  // Spraying suitability
  let sprayStatus = 'Optimal';
  let sprayAdvice = 'Favorable spray window: Winds are calm (< 12 km/h) and no heavy rain expected.';
  if (windSpeed > 14) {
    sprayStatus = 'Unfavorable (High Wind)';
    sprayAdvice = `Wind velocity (${windSpeed} km/h) exceeds safe threshold (12 km/h). Spray droplets will drift, reducing efficacy.`;
  } else if (rain48h > 8) {
    sprayStatus = 'Unfavorable (Rain Expected)';
    sprayAdvice = 'Rain expected within 24-48 hours will wash off active chemical residues before absorption.';
  }

  return {
    id: `adv_${Date.now()}`,
    ruleId,
    crop: cropProfile.cropType,
    cropName: crop.name,
    growthStage: stage,
    actionTitle,
    actionSummary,
    evidenceQuality,
    timeWindow,
    sprayStatus,
    sprayAdvice,
    inputsUsed: [
      `Crop: ${crop.name.en} at ${stage} stage`,
      `Soil Moisture: ${moisture}%`,
      `48-Hour Rain Forecast: ${rain48h.toFixed(1)} mm`,
      `Ambient Temperature: ${maxTemp}°C (Feels like ${(maxTemp + 1).toFixed(1)}°C)`,
      `Relative Humidity: ${humidity}%`,
      `Wind Velocity: ${windSpeed} km/h`,
    ],
    ruleApplied: `${ruleId} (Agronomic Decision Matrix v2.4)`,
    whyMatters,
    assumptions,
    verifyBefore,
    timestamp: new Date().toISOString(),
    source: 'KrishiMitra AI Decision Engine + Open-Meteo',
  };
}

/**
 * Compare two farm scenarios side-by-side
 */
export function simulateScenarios({
  area = 2,
  cropType = 'tomato',
  growthStage = 'flowering',
  soilMoisture = 45,
  rainForecast = 16,
  irrigationMethod = 'drip',
  waterDepthA = 25, // mm
  pumpingHoursA = 4,
  powerCostPerHour = 50, // Rs/hr
}) {
  // Scenario A: Irrigate now
  // 1 mm depth over 1 acre = ~4046 * 0.001 m3 = ~4.046 m3 = ~4,046 liters
  // Over 2 acres with 25 mm depth = 2 * 25 * 4046 = 202,300 liters = ~202 kL
  const litersPerAcrePerMm = 4046;
  const waterVolumeA_kL = Math.round((area * waterDepthA * litersPerAcrePerMm) / 1000);
  const costA = Math.round(pumpingHoursA * powerCostPerHour);

  // Scenario B: Defer and reassess rain
  // If rainForecast >= 15mm, nature provides ~60-80% of required depth
  const effectiveRain_mm = Math.min(rainForecast * 0.75, waterDepthA);
  const supplementalDepthB = Math.max(0, waterDepthA - effectiveRain_mm);
  const waterVolumeB_kL = Math.round((area * supplementalDepthB * litersPerAcrePerMm) / 1000);
  const pumpingHoursB = Math.max(0, Math.round((pumpingHoursA * (supplementalDepthB / (waterDepthA || 1))) * 10) / 10);
  const costB = Math.round(pumpingHoursB * powerCostPerHour);

  const waterSaved_kL = Math.max(0, waterVolumeA_kL - waterVolumeB_kL);
  const moneySaved = Math.max(0, costA - costB);

  let recommendation = 'B';
  let rationale = '';
  if (rainForecast >= 10 && soilMoisture >= 35) {
    recommendation = 'B';
    rationale = `Scenario B recommended. Forecasted rain (${rainForecast} mm) can satisfy crop transpiration needs without risking nitrogen leaching. Estimated water conservation: ${waterSaved_kL} kL (saving ₹${moneySaved}).`;
  } else if (soilMoisture < 30) {
    recommendation = 'A';
    rationale = `Scenario A recommended. Soil moisture is critically low (${soilMoisture}%). Waiting for uncertain rain risks irreversible wilting or blossom drop. Apply light irrigation.`;
  } else {
    recommendation = 'B';
    rationale = `Scenario B is climate-adaptive. Monitor topsoil for 24h. If rain fails to materialize, initiate brief supplemental cycle.`;
  }

  return {
    scenarioA: {
      name: 'Irrigate Now (Scheduled)',
      waterVolume_kL: waterVolumeA_kL,
      pumpingHours: pumpingHoursA,
      cost: costA,
      tradeoff: 'Guarantees immediate moisture but wastes electricity and water if rain occurs. Risk of waterlogged roots.',
      moistureOutcome: 'Saturated (85-95%)',
    },
    scenarioB: {
      name: 'Wait & Reassess After Rain',
      waterVolume_kL: waterVolumeB_kL,
      pumpingHours: pumpingHoursB,
      cost: costB,
      tradeoff: 'Saves pump power and groundwater. Slight risk if rain prediction is delayed or underperforms.',
      moistureOutcome: 'Optimal Root Zone (60-70%)',
    },
    comparison: [
      { metric: 'Water Consumed (kL)', scenarioA: waterVolumeA_kL, scenarioB: waterVolumeB_kL },
      { metric: 'Energy Cost (₹)', scenarioA: costA, scenarioB: costB },
      { metric: 'Pumping Time (Hrs)', scenarioA: pumpingHoursA, scenarioB: pumpingHoursB },
    ],
    savings: {
      water_kL: waterSaved_kL,
      cost_inr: moneySaved,
    },
    recommendation,
    rationale,
  };
}

/**
 * Compute Early Risk Radar parameters
 */
export function calculateRiskRadar(cropProfile, weather) {
  const crop = CROPS_CONFIG[cropProfile.cropType] || CROPS_CONFIG.tomato;
  const temp = weather?.currentTemp || 28;
  const humidity = weather?.humidity || 65;
  const rain48h = weather?.rainSum48h || 0;
  const windSpeed = weather?.windSpeed || 8;

  // Blight risk score
  let blightLevel = 'LOW';
  let blightScore = 25;
  if (humidity > 80 && temp >= 20 && temp <= 29) {
    blightLevel = 'HIGH';
    blightScore = 88;
  } else if (humidity > 70 || rain48h > 10) {
    blightLevel = 'MODERATE';
    blightScore = 58;
  }

  // Heat / Water Stress
  let heatLevel = 'LOW';
  let heatScore = 20;
  if (temp > 38) {
    heatLevel = 'HIGH';
    heatScore = 92;
  } else if (temp > 33) {
    heatLevel = 'MODERATE';
    heatScore = 60;
  }

  // Spray wash-off / drift
  let sprayLevel = 'LOW';
  let sprayScore = 15;
  if (windSpeed > 15 || rain48h > 15) {
    sprayLevel = 'HIGH';
    sprayScore = 85;
  } else if (windSpeed > 10 || rain48h > 5) {
    sprayLevel = 'MODERATE';
    sprayScore = 55;
  }

  // Sucking pest
  let pestLevel = 'LOW';
  let pestScore = 25;
  if (temp > 32 && humidity < 50) {
    pestLevel = 'HIGH';
    pestScore = 80;
  } else if (temp > 28 && humidity < 60) {
    pestLevel = 'MODERATE';
    pestScore = 50;
  }

  // Overall risk category
  const maxScore = Math.max(blightScore, heatScore, sprayScore, pestScore);
  let overall = 'LOW';
  if (maxScore >= 75) overall = 'HIGH';
  else if (maxScore >= 45) overall = 'MODERATE';

  return {
    overall,
    overallScore: maxScore,
    modelStatus: 'Prototype v2.4 (Open-Meteo & Agromet Rules)',
    indicators: [
      {
        id: 'blight',
        title: 'Fungal Blight & Downy Mildew',
        level: blightLevel,
        score: blightScore,
        factors: `RH: ${humidity}%, Temp: ${temp}°C, 48h Rain: ${rain48h}mm`,
        checklist: [
          'Inspect bottom leaves for water-soaked greasy spots.',
          'Ensure furrow or drip lines do not puddle under the plant canopy.',
          'If symptoms appear, prepare protective contact copper fungicide.',
        ],
        explanation: 'Fungal zoospore germination requires at least 4-6 hours of leaf wetness and warm ambient temperatures.',
      },
      {
        id: 'heat',
        title: 'High Temperature Moisture Stress',
        level: heatLevel,
        score: heatScore,
        factors: `Max Temp: ${temp}°C, Soil Moisture: ${cropProfile.soilMoisture}%`,
        checklist: [
          'Observe midday leaf curling in tomato/onion foliage.',
          'Consider running micro-sprinklers for 15 minutes during peak heat (1 PM - 3 PM) to lower canopy temperature.',
          'Maintain organic mulch to insulate root zone.',
        ],
        explanation: 'Extreme heat accelerates evapotranspiration (ET) beyond the root xylem uptake rate, causing temporary wilting.',
      },
      {
        id: 'spray',
        title: 'Spraying Wash-off & Drift Risk',
        level: sprayLevel,
        score: sprayScore,
        factors: `Wind: ${windSpeed} km/h, 48h Rain: ${rain48h}mm`,
        checklist: [
          'Do not spray if wind exceeds 12 km/h to prevent spray drift onto neighboring fields.',
          'Check rain radar before mixing expensive systemic agrochemicals.',
          'Use an agricultural surfactant (spreader/sticker) if light showers are anticipated.',
        ],
        explanation: 'Wind velocities over 12 km/h cause droplet dispersion, while rain within 4 hours physically removes chemical deposits.',
      },
      {
        id: 'pest',
        title: 'Thrips & Sucking Pest Pressure',
        level: pestLevel,
        score: pestScore,
        factors: `Warm dry microclimate (${temp}°C, ${humidity}% RH)`,
        checklist: [
          'Install yellow and blue sticky traps (15-20 traps/acre).',
          'Inspect growing tips and inner whorls for thrips or whitefly colonies.',
          'Spray neem oil (5 ml/L) as a prophylactic organic deterrent.',
        ],
        explanation: 'Low humidity and warm conditions accelerate the reproductive cycle of thrips and mites.',
      },
    ],
  };
}
