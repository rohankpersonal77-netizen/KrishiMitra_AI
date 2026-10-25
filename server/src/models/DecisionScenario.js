import mongoose from 'mongoose';

const DecisionScenarioSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    crop: { type: String, default: 'tomato' },
    stage: { type: String, default: 'flowering' },
    rainForecast: { type: Number, default: 0 },
    soilMoisture: { type: Number, default: 50 },
    waterSaved_kL: { type: Number, default: 0 },
    costSaved_inr: { type: Number, default: 0 },
    recommendation: { type: String, default: 'B' },
  },
  { timestamps: true }
);

export default mongoose.models.DecisionScenario || mongoose.model('DecisionScenario', DecisionScenarioSchema);
