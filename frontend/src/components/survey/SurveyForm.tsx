import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { surveyAPI } from '../../api/surveys';
import { Survey } from '../../types';

export const SurveyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(0);

  const { data: survey, isLoading } = useQuery(
    ['survey', id],
    () => surveyAPI.getSurveyById(id!),
    { enabled: !!id }
  );

  const submitMutation = useMutation(
    (data: any) => surveyAPI.submitSurveyResponse(id!, data),
    {
      onSuccess: () => {
        alert('설문이 성공적으로 제출되었습니다.');
        navigate('/surveys');
      },
      onError: () => {
        alert('설문 제출에 실패했습니다. 다시 시도해주세요.');
      }
    }
  );

  if (isLoading || !survey) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
      </div>
    );
  }

  const questions = survey.questions || [];
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required questions
    const requiredQuestions = questions.filter((q: any) => q.required);
    const missingAnswers = requiredQuestions.filter((q: any) => !answers[q.id]);
    
    if (missingAnswers.length > 0) {
      alert('모든 필수 질문에 답변해주세요.');
      return;
    }

    submitMutation.mutate({ answers });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{survey.title}</h2>
      {survey.description && (
        <p className="text-gray-600 mb-6">{survey.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentQuestions.map((question: any) => (
          <QuestionField
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        ))}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            페이지 {currentPage + 1} / {totalPages}
          </div>
          
          <div className="flex gap-3">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={handlePrevPage}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                이전
              </button>
            )}
            
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={handleNextPage}
                className="px-4 py-2 bg-wee-main text-white rounded hover:bg-wee-dark"
              >
                다음
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitMutation.isLoading}
                className="px-6 py-2 bg-wee-main text-white rounded hover:bg-wee-dark disabled:opacity-50"
              >
                {submitMutation.isLoading ? '제출 중...' : '제출하기'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

interface QuestionFieldProps {
  question: any;
  value: any;
  onChange: (value: any) => void;
}

const QuestionField: React.FC<QuestionFieldProps> = ({ question, value, onChange }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wee-main"
            required={question.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wee-main"
            required={question.required}
          />
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="mr-2"
                  required={question.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={value?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wee-main"
            required={question.required}
          >
            <option value="">선택하세요</option>
            {question.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={question.min}
            max={question.max}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wee-main"
            required={question.required}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wee-main"
            required={question.required}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">
        {question.title}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-sm text-gray-600">{question.description}</p>
      )}
      {renderInput()}
    </div>
  );
};