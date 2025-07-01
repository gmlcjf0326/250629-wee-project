import { Request, Response } from 'express';
import surveyService from '../services/survey.service';
import { asyncHandler } from '../utils/asyncHandler';

export const surveyController = {
  // Get all surveys
  getSurveys: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const userId = (req as any).user?.id;
    
    const surveys = await surveyService.getSurveys(status as string, userId);

    res.json({
      success: true,
      data: surveys
    });
  }),

  // Get survey by ID
  getSurveyById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const survey = await surveyService.getSurveyById(id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      data: survey
    });
  }),

  // Create survey (admin)
  createSurvey: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { survey, questions } = req.body;

    const newSurvey = await surveyService.createSurvey(survey, questions, userId);

    res.status(201).json({
      success: true,
      data: newSurvey,
      message: 'Survey created successfully'
    });
  }),

  // Update survey (admin)
  updateSurvey: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { survey, questions } = req.body;

    const updatedSurvey = await surveyService.updateSurvey(id, survey, questions);

    res.json({
      success: true,
      data: updatedSurvey,
      message: 'Survey updated successfully'
    });
  }),

  // Delete survey (admin)
  deleteSurvey: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await surveyService.deleteSurvey(id);

    res.json({
      success: true,
      message: 'Survey deleted successfully'
    });
  }),

  // Submit survey response
  submitResponse: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = (req as any).user?.id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const response = await surveyService.submitResponse(
      id, 
      answers, 
      userId, 
      ipAddress, 
      userAgent
    );

    res.status(201).json({
      success: true,
      data: response,
      message: 'Response submitted successfully'
    });
  }),

  // Get survey responses (admin)
  getSurveyResponses: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const responses = await surveyService.getSurveyResponses(id);

    res.json({
      success: true,
      data: responses
    });
  }),

  // Get survey statistics (admin)
  getSurveyStatistics: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const statistics = await surveyService.getSurveyStatistics(id);

    res.json({
      success: true,
      data: statistics
    });
  })
};