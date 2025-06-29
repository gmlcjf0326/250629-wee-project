import { Request, Response } from 'express';
import databaseService from '../services/database.service';

export const surveyController = {
  // Get all active surveys
  async getActiveSurveys(_req: Request, res: Response) {
    try {
      const surveys = await databaseService.getActiveSurveys();
      return res.json({
        success: true,
        data: surveys
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch surveys'
      });
    }
  },

  // Get survey by ID
  async getSurveyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const survey = await databaseService.getSurveyById(id);
      
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found'
        });
      }

      return res.json({
        success: true,
        data: survey
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch survey'
      });
    }
  },

  // Submit survey response
  async submitSurveyResponse(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const { respondentId, respondentInfo, answers } = req.body;

      // Validate survey exists and is active
      const survey = await databaseService.getSurveyById(surveyId);
      if (!survey || !survey.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found or inactive'
        });
      }

      // Check if survey period is valid
      const now = new Date();
      if (survey.startDate && new Date(survey.startDate) > now) {
        return res.status(400).json({
          success: false,
          message: 'Survey has not started yet'
        });
      }
      if (survey.endDate && new Date(survey.endDate) < now) {
        return res.status(400).json({
          success: false,
          message: 'Survey has ended'
        });
      }

      // Create survey response
      const response = await databaseService.createSurveyResponse({
        surveyId,
        respondentId,
        respondentInfo,
        answers,
        isComplete: true,
        submittedAt: new Date()
      });

      if (!response) {
        throw new Error('Failed to save survey response');
      }

      return res.status(201).json({
        success: true,
        message: 'Survey response submitted successfully',
        data: {
          id: response.id,
          submittedAt: response.submittedAt
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit survey response'
      });
    }
  }
};