import FarmAction from '../models/FarmAction.js';
import { isMongoConnected } from '../config/db.js';

let memoryActions = [
  {
    id: 'act_1',
    userId: 'farmer_demo_101',
    date: '2026-10-22',
    crop: 'tomato',
    actionType: 'followed',
    advisoryTitle: 'Delayed Irrigation Cycle ahead of 14mm rain',
    actualWater: 0,
    actualCost: 0,
    waterSaved: 50,
    costSaved: 220,
    notes: 'Rain occurred as forecast (11mm actual). Saved 4 hours pumping.',
    rating: 5,
  },
  {
    id: 'act_2',
    userId: 'farmer_demo_101',
    date: '2026-10-18',
    crop: 'tomato',
    actionType: 'modified',
    advisoryTitle: 'Prophylactic Copper Spray for Early Blight',
    actualWater: 15,
    actualCost: 350,
    waterSaved: 10,
    costSaved: 50,
    notes: 'Applied copper oxychloride at 2.5g/L early morning before wind.',
    rating: 4,
  },
];

export async function getImpactSummary(req, res) {
  try {
    const userId = req.user?.id || 'farmer_demo_101';
    let actionsList = [];

    if (isMongoConnected) {
      actionsList = await FarmAction.find({ userId }).sort({ createdAt: -1 });
    } else {
      actionsList = memoryActions.filter((a) => a.userId === userId || !a.userId);
    }

    const totalWaterSaved = actionsList.reduce((acc, a) => acc + (a.waterSaved || 0), 0);
    const totalCostSaved = actionsList.reduce((acc, a) => acc + (a.costSaved || 0), 0);
    const actionsCount = actionsList.length;

    res.json({
      totalWaterSaved,
      totalCostSaved,
      actionsCount,
      actions: actionsList,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving impact summary', error: err.message });
  }
}

export async function recordActionHandler(req, res) {
  try {
    const userId = req.user?.id || 'farmer_demo_101';
    const actionData = req.body;

    if (isMongoConnected) {
      const created = await FarmAction.create({
        userId,
        ...actionData,
      });
      return res.status(201).json(created);
    } else {
      const newAction = {
        id: 'act_' + Date.now(),
        userId,
        ...actionData,
      };
      memoryActions.unshift(newAction);
      return res.status(201).json(newAction);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recording farm action', error: err.message });
  }
}
