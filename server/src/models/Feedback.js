import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    advisoryId: { type: String, required: true },
    feedbackType: { type: String, enum: ['helpful', 'not_helpful'], required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
