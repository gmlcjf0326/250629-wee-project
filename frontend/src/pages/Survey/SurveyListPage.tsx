import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date: string;
  is_anonymous: boolean;
  max_responses?: number;
  response_count?: number;
}

export const SurveyListPage: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    fetchSurveys();
  }, []); // Remove filter dependency - fetch all surveys once

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/surveys'); // Always fetch all surveys
      setSurveys(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      // Mock data for now
      setSurveys([
        {
          id: '1',
          title: '2024년 Wee 프로젝트 만족도 조사',
          description: 'Wee 프로젝트 서비스 이용자를 대상으로 한 만족도 조사입니다.',
          status: 'active',
          start_date: '2024-06-01',
          end_date: '2024-07-31',
          is_anonymous: true,
          response_count: 245,
        },
        {
          id: '2',
          title: '학교생활 적응 실태 조사',
          description: '학생들의 학교생활 적응 정도와 어려움을 파악하기 위한 조사입니다.',
          status: 'active',
          start_date: '2024-06-15',
          end_date: '2024-08-15',
          is_anonymous: false,
          response_count: 189,
        },
        {
          id: '3',
          title: '상담 서비스 개선 방안 조사',
          description: '상담 서비스 질 향상을 위한 의견 수렴 조사입니다.',
          status: 'closed',
          start_date: '2024-05-01',
          end_date: '2024-05-31',
          is_anonymous: true,
          response_count: 412,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '진행중';
      case 'closed': return '종료';
      case 'draft': return '준비중';
      default: return status;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'all') return true;
    if (filter === 'active') return survey.status === 'active' && !isExpired(survey.end_date);
    if (filter === 'closed') return survey.status === 'closed' || isExpired(survey.end_date);
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">설문조사</h1>
          <p className="text-lg text-gray-600">
            Wee 프로젝트 서비스 개선을 위한 설문조사에 참여해 주세요
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-soft p-1 inline-flex">
            {[
              { key: 'all', label: '전체', count: surveys.length },
              { key: 'active', label: '진행중', count: surveys.filter(s => s.status === 'active' && !isExpired(s.end_date)).length },
              { key: 'closed', label: '종료된 조사', count: surveys.filter(s => s.status === 'closed' || isExpired(s.end_date)).length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-wee-main text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Survey List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">설문조사를 불러오는 중...</p>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-gray-500">현재 {filter === 'active' ? '진행중인' : filter === 'closed' ? '종료된' : ''} 설문조사가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSurveys.map(survey => (
              <div key={survey.id} className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{survey.title}</h3>
                      <span className={`badge ${getStatusColor(survey.status)}`}>
                        {getStatusText(survey.status)}
                      </span>
                      {survey.is_anonymous && (
                        <span className="badge badge-info">익명</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{survey.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(survey.start_date).toLocaleDateString('ko-KR')} ~ {new Date(survey.end_date).toLocaleDateString('ko-KR')}
                      </span>
                      
                      {survey.status === 'active' && !isExpired(survey.end_date) && (
                        <span className="flex items-center text-wee-main font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getDaysRemaining(survey.end_date)}일 남음
                        </span>
                      )}
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {survey.response_count || 0}명 참여
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    {survey.status === 'active' && !isExpired(survey.end_date) ? (
                      <Link 
                        to={`/survey/${survey.id}`}
                        className="btn-primary btn-sm"
                      >
                        참여하기
                      </Link>
                    ) : (
                      <Link 
                        to={`/survey/${survey.id}/results`}
                        className="btn-secondary btn-sm"
                      >
                        결과보기
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">설문조사 참여 안내</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-wee-main rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">간편한 참여</h3>
              <p className="text-sm text-gray-600">
                간단한 질문으로 구성되어 5-10분 내에 완료할 수 있습니다
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-wee-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">개인정보 보호</h3>
              <p className="text-sm text-gray-600">
                익명 조사로 진행되며 개인정보는 철저히 보호됩니다
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-wee-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">서비스 개선</h3>
              <p className="text-sm text-gray-600">
                여러분의 소중한 의견으로 더 나은 서비스를 만들어갑니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};