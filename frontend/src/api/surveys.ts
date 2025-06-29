import apiClient from './client';
import { Survey, SurveyResponse } from '../types';

export const surveyAPI = {
  // Get all active surveys
  getActiveSurveys: async (): Promise<Survey[]> => {
    const response = await apiClient.get('/surveys');
    return response.data.data;
  },

  // Get survey by ID
  getSurveyById: async (id: string): Promise<Survey> => {
    const response = await apiClient.get(`/surveys/${id}`);
    return response.data.data;
  },

  // Submit survey response
  submitSurveyResponse: async (
    surveyId: string,
    data: {
      respondentId?: string;
      respondentInfo?: any;
      answers: any;
    }
  ): Promise<{ id: string; submittedAt: Date }> => {
    const response = await apiClient.post(`/surveys/${surveyId}/responses`, data);
    return response.data.data;
  }
};