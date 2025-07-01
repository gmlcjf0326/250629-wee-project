import apiClient from './client';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  status?: 'draft' | 'active' | 'closed' | 'archived';
  start_date?: string;
  end_date?: string;
  is_anonymous?: boolean;
  max_responses?: number;
  allow_multiple_responses?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  questions?: SurveyQuestion[];
}

export interface SurveyQuestion {
  id?: string;
  survey_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'single_choice' | 'text' | 'textarea' | 'rating' | 'yes_no' | 'number';
  options?: any;
  is_required?: boolean;
  order_index: number;
}

export interface SurveyAnswer {
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_options?: any;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  respondent_id?: string;
  submitted_at: string;
  is_complete: boolean;
}

export interface SurveyStatistics {
  total_responses: number;
  statistics: Array<{
    question_id: string;
    question_text: string;
    question_type: string;
    total_answers: number;
    [key: string]: any;
  }>;
}

export const surveyAPI = {
  // Get all surveys
  getSurveys: async (status?: string): Promise<Survey[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`/surveys${params}`);
    return response.data.data;
  },

  // Alias for backward compatibility
  getActiveSurveys: async (): Promise<Survey[]> => {
    return surveyAPI.getSurveys('active');
  },

  // Get single survey with questions
  getSurveyById: async (id: string): Promise<Survey> => {
    const response = await apiClient.get(`/surveys/${id}`);
    return response.data.data;
  },

  // Submit survey response
  submitSurveyResponse: async (
    surveyId: string,
    answers: SurveyAnswer[]
  ): Promise<SurveyResponse> => {
    const response = await apiClient.post(`/surveys/${surveyId}/responses`, { answers });
    return response.data.data;
  },

  // Admin functions
  createSurvey: async (survey: Omit<Survey, 'id'>, questions: Omit<SurveyQuestion, 'id' | 'survey_id'>[]): Promise<Survey> => {
    const response = await apiClient.post('/surveys', { survey, questions });
    return response.data.data;
  },

  updateSurvey: async (id: string, survey: Partial<Survey>, questions?: Omit<SurveyQuestion, 'id' | 'survey_id'>[]): Promise<Survey> => {
    const response = await apiClient.put(`/surveys/${id}`, { survey, questions });
    return response.data.data;
  },

  deleteSurvey: async (id: string): Promise<void> => {
    await apiClient.delete(`/surveys/${id}`);
  },

  getSurveyResponses: async (id: string): Promise<any[]> => {
    const response = await apiClient.get(`/surveys/${id}/responses`);
    return response.data.data;
  },

  getSurveyStatistics: async (id: string): Promise<SurveyStatistics> => {
    const response = await apiClient.get(`/surveys/${id}/statistics`);
    return response.data.data;
  }
};