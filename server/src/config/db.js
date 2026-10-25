import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krishimitra';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[KrishiMitra Backend] Connected to MongoDB at ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[KrishiMitra Backend] MongoDB connection notice: ${err.message}. Running with resilient in-memory database fallback.`);
  }
}
