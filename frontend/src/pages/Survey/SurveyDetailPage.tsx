import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Survey {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date: string;
  is_anonymous: boolean;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'single_choice' | 'text' | 'textarea' | 'rating' | 'yes_no' | 'number';
  options?: any;
  is_required: boolean;
  order_index: number;
}

interface Answer {
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_options?: string[];
}

export const SurveyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockSurvey: Survey = {
        id: id || '1',
        title: '2024년 Wee 프로젝트 만족도 조사',
        description: 'Wee 프로젝트 서비스 이용자를 대상으로 한 만족도 조사입니다.',
        instructions: '각 질문에 성실하게 답변해 주시기 바랍니다. 응답 내용은 서비스 개선을 위해서만 활용됩니다.',
        status: 'active',
        start_date: '2024-06-01',
        end_date: '2024-07-31',
        is_anonymous: true,
      };
      
      const mockQuestions: Question[] = [
        {
          id: '1',
          question_text: 'Wee 프로젝트 서비스를 이용해 보신 적이 있나요?',
          question_type: 'yes_no',
          is_required: true,
          order_index: 1,
        },
        {
          id: '2',
          question_text: '이용하신 서비스는 무엇인가요? (복수 선택 가능)',
          question_type: 'multiple_choice',
          options: ['Wee 클래스', 'Wee 센터', 'Wee 스쿨', '온라인 상담', '전화 상담'],
          is_required: true,
          order_index: 2,
        },
        {
          id: '3',
          question_text: '서비스 이용 목적은 무엇이었나요?',
          question_type: 'single_choice',
          options: ['개인상담', '집단상담', '심리검사', '위기상담', '진로상담', '기타'],
          is_required: true,
          order_index: 3,
        },
        {
          id: '4',
          question_text: '전반적인 서비스 만족도를 평가해 주세요.',
          question_type: 'rating',
          options: { min: 1, max: 5, labels: ['매우 불만족', '불만족', '보통', '만족', '매우 만족'] },
          is_required: true,
          order_index: 4,
        },
        {
          id: '5',
          question_text: '서비스 개선을 위한 의견이나 제안이 있다면 자유롭게 작성해 주세요.',
          question_type: 'textarea',
          is_required: false,
          order_index: 5,
        },
      ];
      
      setSurvey(mockSurvey);
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Failed to fetch survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!survey) return;
    
    // Validate required questions
    const requiredQuestions = questions.filter(q => q.is_required);
    const missingAnswers = requiredQuestions.filter(q => !answers[q.id]);
    
    if (missingAnswers.length > 0) {
      alert('필수 질문에 답변해 주세요.');
      return;
    }
    
    try {
      setSubmitting(true);
      // Mock submission for now
      console.log('Submitting survey:', { surveyId: survey.id, answers });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('설문조사가 성공적으로 제출되었습니다. 참여해 주셔서 감사합니다!');
      navigate('/survey');
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];
    
    switch (question.question_type) {
      case 'yes_no':
        return (
          <div className="space-y-3">
            {['예', '아니오'].map(option => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option}
                  checked={answer?.answer_text === option}
                  onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_text: e.target.value })}
                  className="mr-3 w-4 h-4 text-wee-main focus:ring-wee-main border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'single_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option}
                  checked={answer?.answer_text === option}
                  onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_text: e.target.value })}
                  className="mr-3 w-4 h-4 text-wee-main focus:ring-wee-main border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={answer?.answer_options?.includes(option) || false}
                  onChange={(e) => {
                    const currentOptions = answer?.answer_options || [];
                    const newOptions = e.target.checked
                      ? [...currentOptions, option]
                      : currentOptions.filter(o => o !== option);
                    handleAnswerChange(question.id, { question_id: question.id, answer_options: newOptions });
                  }}
                  className="mr-3 w-4 h-4 text-wee-main focus:ring-wee-main border-gray-300 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'rating':
        const { min, max, labels } = question.options || { min: 1, max: 5 };
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(value => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={value}
                    checked={answer?.answer_number === value}
                    onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_number: parseInt(e.target.value) })}
                    className="mb-2 w-5 h-5 text-wee-main"
                  />
                  <span className="text-sm font-medium text-wee-main">{value}</span>
                  {labels && labels[value - min] && (
                    <span className="text-xs text-gray-500 text-center mt-1">{labels[value - min]}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );
        
      case 'text':
        return (
          <input
            type="text"
            value={answer?.answer_text || ''}
            onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_text: e.target.value })}
            className="w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none"
            placeholder="답변을 입력해 주세요"
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={answer?.answer_text || ''}
            onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none resize-none"
            placeholder="의견을 자유롭게 작성해 주세요"
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={answer?.answer_number || ''}
            onChange={(e) => handleAnswerChange(question.id, { question_id: question.id, answer_number: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none"
            placeholder="숫자를 입력해 주세요"
          />
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-wide">
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">설문조사를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="page-wrapper">
        <div className="content-wide">
          <div className="text-center py-12">
            <p className="text-gray-500">설문조사를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        <div className="max-w-3xl mx-auto">
          {/* Survey Header */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{survey.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{survey.description}</p>
              {survey.instructions && (
                <div className="bg-wee-light rounded-lg p-4">
                  <p className="text-sm text-gray-700">{survey.instructions}</p>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">진행상황</span>
                <span className="text-sm font-medium text-wee-main">{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-wee-main h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Anonymous Participation Notice */}
          {!user && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">익명 참여 안내</h3>
                  <p className="text-blue-800 mb-3">
                    현재 로그인하지 않은 상태입니다. 익명으로 설문조사에 참여하실 수 있습니다.
                  </p>
                  <p className="text-sm text-blue-700">
                    로그인하시면 설문 참여 기록을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Question Card */}
          {questions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <span className="bg-wee-main text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">
                    {currentQuestion + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {questions[currentQuestion].question_text}
                      {questions[currentQuestion].is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                  </div>
                </div>
                
                {renderQuestion(questions[currentQuestion])}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? '제출 중...' : '제출하기'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    className="btn-primary"
                  >
                    다음
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Survey Info */}
          <div className="bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-wee-main rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">개인정보 보호</p>
                <p className="text-xs text-gray-600">{survey.is_anonymous ? '익명 조사' : '실명 조사'}</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-wee-blue rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">조사 기간</p>
                <p className="text-xs text-gray-600">
                  ~ {new Date(survey.end_date).toLocaleDateString('ko-KR')}
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-wee-green rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">소요 시간</p>
                <p className="text-xs text-gray-600">약 5-10분</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};