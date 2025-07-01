import { supabaseAdmin } from '../config/supabase';

export interface Survey {
  id?: string;
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

export interface SurveyResponse {
  id?: string;
  survey_id: string;
  respondent_id?: string;
  ip_address?: string;
  user_agent?: string;
  submitted_at?: string;
  is_complete?: boolean;
}

export interface SurveyAnswer {
  id?: string;
  response_id: string;
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_options?: any;
}

export interface SurveyWithQuestions extends Survey {
  questions?: SurveyQuestion[];
}

class SurveyService {
  async getSurveys(status?: string, userId?: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    let query = supabaseAdmin
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getSurveyById(id: string): Promise<SurveyWithQuestions | null> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get survey
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();

    if (surveyError) {
      throw surveyError;
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('survey_questions')
      .select('*')
      .eq('survey_id', id)
      .order('order_index');

    if (questionsError) {
      throw questionsError;
    }

    return {
      ...survey,
      questions: questions || []
    };
  }

  async createSurvey(survey: Survey, questions: SurveyQuestion[], userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Start transaction
    const { data: newSurvey, error: surveyError } = await supabaseAdmin
      .from('surveys')
      .insert({
        ...survey,
        created_by: userId
      })
      .select()
      .single();

    if (surveyError) {
      throw surveyError;
    }

    // Insert questions
    if (questions && questions.length > 0) {
      const questionsWithSurveyId = questions.map(q => ({
        ...q,
        survey_id: newSurvey.id
      }));

      const { error: questionsError } = await supabaseAdmin
        .from('survey_questions')
        .insert(questionsWithSurveyId);

      if (questionsError) {
        // Rollback by deleting the survey
        await supabaseAdmin
          .from('surveys')
          .delete()
          .eq('id', newSurvey.id);
        throw questionsError;
      }
    }

    return newSurvey;
  }

  async updateSurvey(id: string, survey: Partial<Survey>, questions?: SurveyQuestion[]) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Update survey
    const { data: updatedSurvey, error: surveyError } = await supabaseAdmin
      .from('surveys')
      .update({
        ...survey,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (surveyError) {
      throw surveyError;
    }

    // Update questions if provided
    if (questions) {
      // Delete existing questions
      await supabaseAdmin
        .from('survey_questions')
        .delete()
        .eq('survey_id', id);

      // Insert new questions
      if (questions.length > 0) {
        const questionsWithSurveyId = questions.map(q => ({
          ...q,
          survey_id: id
        }));

        const { error: questionsError } = await supabaseAdmin
          .from('survey_questions')
          .insert(questionsWithSurveyId);

        if (questionsError) {
          throw questionsError;
        }
      }
    }

    return updatedSurvey;
  }

  async deleteSurvey(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { error } = await supabaseAdmin
      .from('surveys')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async submitResponse(surveyId: string, answers: any[], userId?: string, ipAddress?: string, userAgent?: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check if survey is active
    const { data: survey } = await supabaseAdmin
      .from('surveys')
      .select('status, allow_multiple_responses')
      .eq('id', surveyId)
      .single();

    if (!survey || survey.status !== 'active') {
      throw new Error('Survey is not active');
    }

    // Check for existing response if multiple responses not allowed
    if (!survey.allow_multiple_responses && userId) {
      const { data: existingResponse } = await supabaseAdmin
        .from('survey_responses')
        .select('id')
        .eq('survey_id', surveyId)
        .eq('respondent_id', userId)
        .single();

      if (existingResponse) {
        throw new Error('You have already submitted a response to this survey');
      }
    }

    // Create response
    const { data: response, error: responseError } = await supabaseAdmin
      .from('survey_responses')
      .insert({
        survey_id: surveyId,
        respondent_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_complete: true
      })
      .select()
      .single();

    if (responseError) {
      throw responseError;
    }

    // Insert answers
    const answersWithResponseId = answers.map(answer => ({
      response_id: response.id,
      question_id: answer.question_id,
      answer_text: answer.answer_text,
      answer_number: answer.answer_number,
      answer_options: answer.answer_options
    }));

    const { error: answersError } = await supabaseAdmin
      .from('survey_answers')
      .insert(answersWithResponseId);

    if (answersError) {
      // Rollback
      await supabaseAdmin
        .from('survey_responses')
        .delete()
        .eq('id', response.id);
      throw answersError;
    }

    return response;
  }

  async getSurveyResponses(surveyId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('survey_responses')
      .select(`
        *,
        survey_answers (
          *,
          survey_questions (
            question_text,
            question_type,
            options
          )
        )
      `)
      .eq('survey_id', surveyId)
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getSurveyStatistics(surveyId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get total responses
    const { count: totalResponses } = await supabaseAdmin
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', surveyId);

    // Get questions with answers
    const { data: questions } = await supabaseAdmin
      .from('survey_questions')
      .select(`
        *,
        survey_answers (
          answer_text,
          answer_number,
          answer_options
        )
      `)
      .eq('survey_id', surveyId)
      .order('order_index');

    // Process statistics for each question
    const statistics = questions?.map(question => {
      const answers = question.survey_answers || [];
      
      if (question.question_type === 'single_choice' || question.question_type === 'multiple_choice') {
        // Count occurrences of each option
        const optionCounts: Record<string, number> = {};
        
        answers.forEach((answer: any) => {
          if (question.question_type === 'single_choice' && answer.answer_text) {
            optionCounts[answer.answer_text] = (optionCounts[answer.answer_text] || 0) + 1;
          } else if (question.question_type === 'multiple_choice' && answer.answer_options) {
            answer.answer_options.forEach((option: string) => {
              optionCounts[option] = (optionCounts[option] || 0) + 1;
            });
          }
        });

        return {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          total_answers: answers.length,
          option_counts: optionCounts
        };
      } else if (question.question_type === 'rating') {
        // Calculate average rating
        const ratings = answers
          .map((a: any) => a.answer_number)
          .filter((r: any) => r !== null && r !== undefined);
        
        const average = ratings.length > 0
          ? ratings.reduce((sum: number, r: any) => sum + r, 0) / ratings.length
          : 0;

        return {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          total_answers: ratings.length,
          average_rating: average,
          rating_distribution: this.calculateDistribution(ratings)
        };
      } else {
        // Text responses
        return {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          total_answers: answers.length,
          responses: answers.map((a: any) => a.answer_text).filter(Boolean)
        };
      }
    });

    return {
      total_responses: totalResponses || 0,
      statistics: statistics || []
    };
  }

  private calculateDistribution(values: number[]): Record<number, number> {
    const distribution: Record<number, number> = {};
    values.forEach(value => {
      distribution[value] = (distribution[value] || 0) + 1;
    });
    return distribution;
  }

  async getSurveyStats() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { count: totalSurveys } = await supabaseAdmin
      .from('surveys')
      .select('*', { count: 'exact', head: true });

    const { count: activeSurveys } = await supabaseAdmin
      .from('surveys')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: completedSurveys } = await supabaseAdmin
      .from('surveys')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    return {
      totalSurveys: totalSurveys || 0,
      activeSurveys: activeSurveys || 0,
      completedSurveys: completedSurveys || 0
    };
  }
}

export default new SurveyService();