import { Router } from 'express';
import { surveyController } from '../controllers/survey.controller';

const router = Router();

// GET /api/surveys - Get all active surveys
router.get('/', surveyController.getActiveSurveys);

// GET /api/surveys/:id - Get survey by ID
router.get('/:id', surveyController.getSurveyById);

// POST /api/surveys/:surveyId/responses - Submit survey response
router.post('/:surveyId/responses', surveyController.submitSurveyResponse);

export default router;