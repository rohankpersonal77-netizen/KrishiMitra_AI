import { Router } from 'express';
import { login, signup, me } from '../controllers/authController.js';
import { getWeatherForecast } from '../controllers/weatherController.js';
import { getFarmProfile, saveFarmProfile } from '../controllers/farmController.js';
import {
  generateAdvisoryHandler,
  riskAssessmentHandler,
  compareDecisionsHandler,
  feedbackHandler,
} from '../controllers/aiController.js';
import { getImpactSummary, recordActionHandler } from '../controllers/impactController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// 1. Auth Endpoints
router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.get('/auth/me', authMiddleware, me);

// 2. Weather Endpoint (Open-Meteo Integration)
router.get('/weather/forecast', getWeatherForecast);

// 3. Farm Profile Endpoints
router.get('/farms', authMiddleware, getFarmProfile);
router.post('/farms', authMiddleware, saveFarmProfile);
router.put('/farms', authMiddleware, saveFarmProfile);

// 4. Explainable AI Decision Engine
router.post('/ai/advisory', authMiddleware, generateAdvisoryHandler);
router.post('/ai/risk-assessment', authMiddleware, riskAssessmentHandler);
router.post('/decisions/compare', authMiddleware, compareDecisionsHandler);
router.post('/advisories/feedback', authMiddleware, feedbackHandler);

// 5. Impact & Field Action Ledger
router.get('/impact/summary', authMiddleware, getImpactSummary);
router.post('/impact/action', authMiddleware, recordActionHandler);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KrishiMitra AI Agricultural Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
