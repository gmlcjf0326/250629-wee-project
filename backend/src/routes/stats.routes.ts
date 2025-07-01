import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All stats routes require authentication
router.use(authenticate);

// GET /api/stats/dashboard - Get dashboard statistics
router.get('/dashboard', statsController.getDashboardStats);

// GET /api/stats/activities - Get activity logs
router.get('/activities', statsController.getActivityLogs);

// GET /api/stats/chart - Get chart data
router.get('/chart', statsController.getChartData);

// GET /api/stats/content - Get content statistics
router.get('/content', statsController.getContentStats);

// GET /api/stats/users/growth - Get user growth data
router.get('/users/growth', statsController.getUserGrowth);

// Legacy endpoints (keeping for compatibility)
// GET /api/stats/services - Get service statistics
router.get('/services', statsController.getServiceStats);

// GET /api/stats/consultations - Get consultation statistics
router.get('/consultations', statsController.getConsultationStats);

// GET /api/stats/surveys - Get survey statistics
router.get('/surveys', statsController.getSurveyStats);

// GET /api/stats/export - Export statistics data
router.get('/export', statsController.exportStats);

export default router;