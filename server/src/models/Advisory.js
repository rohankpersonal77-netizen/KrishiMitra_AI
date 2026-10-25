import mongoose from 'mongoose';

const AdvisorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    ruleId: { type: String, required: true },
    crop: { type: String, required: true },
    growthStage: { type: String, required: true },
    actionTitle: { type: String, required: true },
    actionSummary: { type: String, required: true },
    evidenceQuality: { type: String, default: 'High' },
    timeWindow: { type: String, default: 'Next 24-48 hours' },
    sprayStatus: { type: String, default: 'Optimal' },
    inputsUsed: [{ type: String }],
    ruleApplied: { type: String },
    whyMatters: { type: String },
    assumptions: { type: String },
    verifyBefore: { type: String },
    source: { type: String, default: 'KrishiMitra AI Decision Engine' },
  },
  { timestamps: true }
);

export default mongoose.models.Advisory || mongoose.model('Advisory', AdvisorySchema);
