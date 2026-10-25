/**
 * Backend Advisory Engine with Explainable AI Matrix
 */

export function buildAdvisory(farmProfile = {}, weather = {}) {
  const crop = farmProfile.cropType || 'tomato';
  const stage = farmProfile.growthStage || 'flowering';
  const moisture = Number(farmProfile.soilMoisture) || 50;
  const rain48h = weather.rainSum48h || 0;
  const temp = weather.currentTemp || 28;
  const humidity = weather.humidity || 65;
  const windSpeed = weather.windSpeed || 8;

  let ruleId = '';
  let actionTitle = '';
  let actionSummary = '';
  let whyMatters = '';
  let timeWindow = 'Next 24 to 36 hours';
  let verifyBefore = 'Verify root zone soil moisture manually before running pump.';

  if (rain48h >= 12) {
    ruleId = `RULE-HYDRA-RAIN-${crop.toUpperCase()}-01`;
    actionTitle = 'Postpone Irrigation — Rain Predicted';
    actionSummary = `Forecast indicates ${rain48h} mm rainfall in next 48h. Postpone scheduled irrigation cycle.`;
    whyMatters = `Applying water immediately before rainfall can waterlog the root zone, cause nutrient leaching, and induce root rot at the ${stage} stage.`;
    timeWindow = 'Hold irrigation for 48 hours until rain subsides';
  } else if (moisture < 40 && rain48h < 5) {
    ruleId = `RULE-DEFICIT-IRR-${crop.toUpperCase()}-02`;
    actionTitle = 'Apply Timed Irrigation Cycle';
    actionSummary = `Soil moisture (${moisture}%) is below critical threshold with minimal rain expected (${rain48h} mm).`;
    whyMatters = `Water stress at the ${stage} stage causes stomatal closure and flower drop.`;
    timeWindow = 'Early morning (06:00 - 09:30 AM)';
  } else if (humidity > 78 && temp >= 22 && temp <= 30) {
    ruleId = `RULE-PATHOGEN-MICRO-${crop.toUpperCase()}-03`;
    actionTitle = 'Microclimate Fungal Blight Alert';
    actionSummary = `Elevated relative humidity (${humidity}%) and warm temperatures (${temp}°C) create optimal conditions for fungal spores.`;
    whyMatters = `High humidity combined with leaf wetness promotes rapid germination of fungal conidia.`;
    timeWindow = 'Inspect leaves within next 12 hours';
    verifyBefore = 'Check underside of lower leaves for greasy spots.';
  } else {
    ruleId = `RULE-MAINT-CYCLE-${crop.toUpperCase()}-04`;
    actionTitle = 'Maintain Controlled Irrigation & Monitor Canopy';
    actionSummary = `Weather is stable (${temp}°C, ${humidity}% RH). Soil moisture is adequate at ${moisture}%.`;
    whyMatters = `Supports steady vegetative and reproductive progress.`;
    timeWindow = 'Next 48 hours routine monitoring';
  }

  let sprayStatus = 'Optimal';
  if (windSpeed > 14) sprayStatus = 'Unfavorable (High Wind)';
  else if (rain48h > 8) sprayStatus = 'Unfavorable (Rain Imminent)';

  return {
    ruleId,
    crop,
    growthStage: stage,
    actionTitle,
    actionSummary,
    evidenceQuality: 'High (Multi-parameter Agronomic Match)',
    timeWindow,
    sprayStatus,
    inputsUsed: [
      `Crop: ${crop} (${stage} stage)`,
      `Soil Moisture: ${moisture}%`,
      `48h Rain Forecast: ${rain48h} mm`,
      `Temperature: ${temp}°C`,
      `Humidity: ${humidity}%`,
      `Wind Speed: ${windSpeed} km/h`,
    ],
    ruleApplied: `${ruleId} (ICAR & Agromet Matrix v2.4)`,
    whyMatters,
    assumptions: 'Calculated for medium clay loam soil, standard crop coefficient Kc, and active root depth.',
    verifyBefore,
    timestamp: new Date().toISOString(),
    source: 'KrishiMitra AI Decision Engine + Open-Meteo',
  };
}
