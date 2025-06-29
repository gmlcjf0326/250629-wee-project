import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { surveyAPI } from '../../api/surveys';
import { Survey } from '../../types';
import { Link } from 'react-router-dom';

export const SurveyList: React.FC = () => {
  const { data: surveys, isLoading, error } = useQuery(
    'surveys',
    surveyAPI.getActiveSurveys
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">설문조사를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  if (!surveys || surveys.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">진행 중인 설문조사가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </div>
  );
};

const SurveyCard: React.FC<{ survey: Survey }> = ({ survey }) => {
  const getStatusLabel = () => {
    const now = new Date();
    const startDate = survey.startDate ? new Date(survey.startDate) : null;
    const endDate = survey.endDate ? new Date(survey.endDate) : null;

    if (startDate && startDate > now) {
      return { text: '예정', color: 'bg-gray-500' };
    }
    if (endDate && endDate < now) {
      return { text: '종료', color: 'bg-gray-400' };
    }
    return { text: '진행중', color: 'bg-green-500' };
  };

  const status = getStatusLabel();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
          <span className={`px-2 py-1 text-xs text-white rounded ${status.color}`}>
            {status.text}
          </span>
        </div>
        
        {survey.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {survey.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          {survey.targetAudience && (
            <div>대상: {survey.targetAudience}</div>
          )}
          {survey.startDate && (
            <div>시작일: {new Date(survey.startDate).toLocaleDateString()}</div>
          )}
          {survey.endDate && (
            <div>종료일: {new Date(survey.endDate).toLocaleDateString()}</div>
          )}
        </div>

        {survey.isRequired && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              필수
            </span>
          </div>
        )}

        <Link
          to={`/survey/${survey.id}`}
          className="block w-full text-center bg-wee-main text-white py-2 px-4 rounded hover:bg-wee-dark transition-colors"
        >
          설문 참여하기
        </Link>
      </div>
    </div>
  );
};