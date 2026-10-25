import mongoose from 'mongoose';

const FarmActionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    crop: { type: String, default: 'tomato' },
    actionType: { type: String, enum: ['followed', 'modified', 'skipped'], default: 'followed' },
    advisoryTitle: { type: String, required: true },
    actualWater: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
    costSaved: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.FarmAction || mongoose.model('FarmAction', FarmActionSchema);
