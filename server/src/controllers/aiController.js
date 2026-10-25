import { buildAdvisory } from '../services/advisoryEngine.js';
import Advisory from '../models/Advisory.js';
import Feedback from '../models/Feedback.js';
import DecisionScenario from '../models/DecisionScenario.js';
import { isMongoConnected } from '../config/db.js';

export async function generateAdvisoryHandler(req, res) {
  try {
    const { farmProfile, weather } = req.body;
    const advisory = buildAdvisory(farmProfile, weather);
    
    // Save to DB if authenticated
    if (isMongoConnected && req.user?.id) {
      await Advisory.create({
        userId: req.user.id,
        ...advisory,
      });
    }

    res.json(advisory);
  } catch (err) {
    res.status(500).json({ message: 'Error generating advisory', error: err.message });
  }
}

export function riskAssessmentHandler(req, res) {
  const { farmProfile = {}, weather = {} } = req.body;
  const temp = weather.currentTemp || 28;
  const humidity = weather.humidity || 65;
  const rain48h = weather.rainSum48h || 0;
  const windSpeed = weather.windSpeed || 8;

  let blightLevel = humidity > 80 && temp >= 20 && temp <= 29 ? 'HIGH' : humidity > 70 ? 'MODERATE' : 'LOW';
  let heatLevel = temp > 38 ? 'HIGH' : temp > 33 ? 'MODERATE' : 'LOW';
  let sprayLevel = windSpeed > 15 || rain48h > 15 ? 'HIGH' : windSpeed > 10 ? 'MODERATE' : 'LOW';
  let pestLevel = temp > 32 && humidity < 50 ? 'HIGH' : temp > 28 ? 'MODERATE' : 'LOW';

  const overall = blightLevel === 'HIGH' || heatLevel === 'HIGH' ? 'HIGH' : blightLevel === 'MODERATE' ? 'MODERATE' : 'LOW';

  res.json({
    overall,
    indicators: [
      { id: 'blight', title: 'Fungal Blight & Downy Mildew', level: blightLevel },
      { id: 'heat', title: 'High Temperature Moisture Stress', level: heatLevel },
      { id: 'spray', title: 'Spraying Wash-off & Drift Risk', level: sprayLevel },
      { id: 'pest', title: 'Thrips & Sucking Pest Pressure', level: pestLevel },
    ],
    timestamp: new Date().toISOString(),
  });
}

export async function compareDecisionsHandler(req, res) {
  const { area = 2, rainForecast = 16, soilMoisture = 45, waterDepthA = 25, pumpingHoursA = 4, powerCostPerHour = 50 } = req.body;

  const litersPerAcrePerMm = 4046;
  const waterVolumeA_kL = Math.round((area * waterDepthA * litersPerAcrePerMm) / 1000);
  const costA = Math.round(pumpingHoursA * powerCostPerHour);

  const effectiveRain_mm = Math.min(rainForecast * 0.75, waterDepthA);
  const supplementalDepthB = Math.max(0, waterDepthA - effectiveRain_mm);
  const waterVolumeB_kL = Math.round((area * supplementalDepthB * litersPerAcrePerMm) / 1000);
  const pumpingHoursB = Math.max(0, Math.round((pumpingHoursA * (supplementalDepthB / (waterDepthA || 1))) * 10) / 10);
  const costB = Math.round(pumpingHoursB * powerCostPerHour);

  const waterSaved_kL = Math.max(0, waterVolumeA_kL - waterVolumeB_kL);
  const moneySaved = Math.max(0, costA - costB);

  const recommendation = (rainForecast >= 10 && soilMoisture >= 35) ? 'B' : 'A';

  res.json({
    scenarioA: { waterVolume_kL: waterVolumeA_kL, cost: costA, pumpingHours: pumpingHoursA },
    scenarioB: { waterVolume_kL: waterVolumeB_kL, cost: costB, pumpingHours: pumpingHoursB },
    savings: { water_kL: waterSaved_kL, cost_inr: moneySaved },
    recommendation,
  });
}

export async function feedbackHandler(req, res) {
  try {
    const { advisoryId, feedbackType, comment } = req.body;
    const userId = req.user?.id || 'farmer_demo_101';

    if (isMongoConnected) {
      await Feedback.create({ userId, advisoryId, feedbackType, comment: comment || '' });
    }

    res.json({ message: 'Feedback recorded successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error saving feedback', error: err.message });
  }
}
