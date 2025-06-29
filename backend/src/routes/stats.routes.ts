import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';

const router = Router();

// GET /api/stats/dashboard - Get dashboard statistics
router.get('/dashboard', statsController.getDashboardStats);

// GET /api/stats/services - Get service statistics
router.get('/services', statsController.getServiceStats);

// GET /api/stats/consultations - Get consultation statistics
router.get('/consultations', statsController.getConsultationStats);

// GET /api/stats/surveys - Get survey statistics
router.get('/surveys', statsController.getSurveyStats);

// GET /api/stats/export - Export statistics data
router.get('/export', statsController.exportStats);

export default router;