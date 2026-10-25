import FarmProfile from '../models/FarmProfile.js';
import { isMongoConnected } from '../config/db.js';

let memoryProfiles = [
  {
    userId: 'farmer_demo_101',
    farmName: 'Sahyadri Bio-Farms (Plot A)',
    state: 'Maharashtra',
    district: 'Nashik',
    cropType: 'tomato',
    area: 2.5,
    areaUnit: 'acres',
    growthStage: 'flowering',
    soilType: 'Black Cotton Soil (Heavy Vertisol)',
    irrigationType: 'Drip Irrigation',
    soilMoisture: 42,
    sowingDate: '2026-08-20',
  },
];

export async function getFarmProfile(req, res) {
  try {
    const userId = req.user?.id || 'farmer_demo_101';
    if (isMongoConnected) {
      let profile = await FarmProfile.findOne({ userId });
      if (!profile) {
        profile = await FarmProfile.create({
          userId,
          farmName: 'My Farm Plot',
          state: 'Maharashtra',
          district: 'Nashik',
          cropType: 'tomato',
          area: 2.5,
          growthStage: 'flowering',
        });
      }
      return res.json(profile);
    } else {
      let profile = memoryProfiles.find((p) => p.userId === userId) || memoryProfiles[0];
      return res.json(profile);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving farm profile', error: err.message });
  }
}

export async function saveFarmProfile(req, res) {
  try {
    const userId = req.user?.id || 'farmer_demo_101';
    const updateData = req.body;

    if (isMongoConnected) {
      const profile = await FarmProfile.findOneAndUpdate(
        { userId },
        { ...updateData, userId },
        { upsert: true, new: true }
      );
      return res.json(profile);
    } else {
      let index = memoryProfiles.findIndex((p) => p.userId === userId);
      const updated = { userId, ...updateData };
      if (index >= 0) {
        memoryProfiles[index] = { ...memoryProfiles[index], ...updated };
      } else {
        memoryProfiles.push(updated);
      }
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error saving farm profile', error: err.message });
  }
}
