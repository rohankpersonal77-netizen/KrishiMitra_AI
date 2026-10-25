import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    preferredLanguage: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    state: { type: String, default: 'Maharashtra' },
    district: { type: String, default: 'Nashik' },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
