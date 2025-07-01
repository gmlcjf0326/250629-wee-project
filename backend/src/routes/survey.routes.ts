import { Router } from 'express';
import { surveyController } from '../controllers/survey.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateCreateSurvey, validateSurveyResponse, validateUUID, validatePagination } from '../middleware/validation';

const router = Router();

// Public routes
// GET /api/surveys - Get all surveys
router.get('/', ...validatePagination, surveyController.getSurveys);

// GET /api/surveys/:id - Get survey by ID
router.get('/:id', ...validateUUID('id'), surveyController.getSurveyById);

// POST /api/surveys/:id/responses - Submit survey response
router.post('/:id/responses', ...validateUUID('id'), ...validateSurveyResponse, surveyController.submitResponse);

// Admin routes
// POST /api/surveys - Create new survey
router.post('/', authenticate, requireRole(['admin', 'manager']), ...validateCreateSurvey, surveyController.createSurvey);

// PUT /api/surveys/:id - Update survey
router.put('/:id', authenticate, requireRole(['admin', 'manager']), ...validateUUID('id'), ...validateCreateSurvey, surveyController.updateSurvey);

// DELETE /api/surveys/:id - Delete survey
router.delete('/:id', authenticate, requireRole(['admin', 'manager']), ...validateUUID('id'), surveyController.deleteSurvey);

// GET /api/surveys/:id/responses - Get survey responses
router.get('/:id/responses', authenticate, requireRole(['admin', 'manager']), ...validateUUID('id'), surveyController.getSurveyResponses);

// GET /api/surveys/:id/statistics - Get survey statistics
router.get('/:id/statistics', authenticate, requireRole(['admin', 'manager']), ...validateUUID('id'), surveyController.getSurveyStatistics);

export default router;