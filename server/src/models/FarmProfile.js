import mongoose from 'mongoose';

const FarmProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    farmName: { type: String, required: true },
    state: { type: String, default: 'Maharashtra' },
    district: { type: String, default: 'Nashik' },
    cropType: { type: String, default: 'tomato' },
    area: { type: Number, default: 2.5 },
    areaUnit: { type: String, default: 'acres' },
    growthStage: { type: String, default: 'flowering' },
    soilType: { type: String, default: 'Black Cotton Soil (Heavy Vertisol)' },
    irrigationType: { type: String, default: 'Drip Irrigation' },
    soilMoisture: { type: Number, default: 42 },
    sowingDate: { type: String, default: '2026-08-20' },
  },
  { timestamps: true }
);

export default mongoose.models.FarmProfile || mongoose.model('FarmProfile', FarmProfileSchema);
