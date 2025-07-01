import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date: string;
  total_responses: number;
  is_anonymous: boolean;
}

interface QuestionStats {
  question_id: string;
  question_text: string;
  question_type: string;
  total_responses: number;
  stats: any;
}

export const SurveyStatsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveyStats();
  }, [id]);

  const fetchSurveyStats = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      const mockSurvey: Survey = {
        id: id || '1',
        title: '2024년 Wee 프로젝트 만족도 조사',
        description: 'Wee 프로젝트 서비스 이용자를 대상으로 한 만족도 조사입니다.',
        status: 'closed',
        start_date: '2024-06-01',
        end_date: '2024-07-31',
        total_responses: 245,
        is_anonymous: true,
      };
      
      const mockStats: QuestionStats[] = [
        {
          question_id: '1',
          question_text: 'Wee 프로젝트 서비스를 이용해 보신 적이 있나요?',
          question_type: 'yes_no',
          total_responses: 245,
          stats: {
            '예': { count: 203, percentage: 82.9 },
            '아니오': { count: 42, percentage: 17.1 }
          }
        },
        {
          question_id: '2',
          question_text: '이용하신 서비스는 무엇인가요? (복수 선택 가능)',
          question_type: 'multiple_choice',
          total_responses: 203,
          stats: {
            'Wee 클래스': { count: 89, percentage: 43.8 },
            'Wee 센터': { count: 156, percentage: 76.8 },
            'Wee 스쿨': { count: 67, percentage: 33.0 },
            '온라인 상담': { count: 134, percentage: 66.0 },
            '전화 상담': { count: 98, percentage: 48.3 }
          }
        },
        {
          question_id: '3',
          question_text: '서비스 이용 목적은 무엇이었나요?',
          question_type: 'single_choice',
          total_responses: 203,
          stats: {
            '개인상담': { count: 78, percentage: 38.4 },
            '집단상담': { count: 23, percentage: 11.3 },
            '심리검사': { count: 45, percentage: 22.2 },
            '위기상담': { count: 12, percentage: 5.9 },
            '진로상담': { count: 34, percentage: 16.7 },
            '기타': { count: 11, percentage: 5.4 }
          }
        },
        {
          question_id: '4',
          question_text: '전반적인 서비스 만족도를 평가해 주세요.',
          question_type: 'rating',
          total_responses: 203,
          stats: {
            average: 4.2,
            distribution: {
              '1': { count: 3, percentage: 1.5 },
              '2': { count: 8, percentage: 3.9 },
              '3': { count: 34, percentage: 16.7 },
              '4': { count: 89, percentage: 43.8 },
              '5': { count: 69, percentage: 34.0 }
            }
          }
        }
      ];
      
      setSurvey(mockSurvey);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch survey stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionStats = (questionStats: QuestionStats) => {
    const { question_type, stats } = questionStats;
    
    switch (question_type) {
      case 'yes_no':
      case 'single_choice':
        return (
          <div className="space-y-3">
            {Object.entries(stats).map(([option, data]: [string, any]) => (
              <div key={option} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{option}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-wee-main">{data.count}명</span>
                    <span className="text-sm text-gray-500 ml-2">({data.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-wee-main to-wee-blue h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {Object.entries(stats).map(([option, data]: [string, any]) => (
              <div key={option} className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{option}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-wee-blue">{data.count}명</span>
                    <span className="text-sm text-gray-500 ml-2">({data.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-wee-blue to-wee-skyblue h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'rating':
        return (
          <div className="space-y-6">
            {/* Average Score */}
            <div className="text-center bg-gradient-to-r from-wee-light to-blue-50 rounded-xl p-6">
              <div className="text-5xl font-bold text-wee-main mb-2">{stats.average}</div>
              <div className="text-gray-600">평균 점수 (5점 만점)</div>
              <div className="flex justify-center mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${star <= Math.round(stats.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Distribution */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">점수별 응답 분포</h4>
              {Object.entries(stats.distribution).map(([rating, data]: [string, any]) => (
                <div key={rating} className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{rating}점</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= parseInt(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-wee-green">{data.count}명</span>
                      <span className="text-sm text-gray-500 ml-2">({data.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-wee-green to-green-400 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">텍스트 응답은 별도로 관리됩니다.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-wide">
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">통계를 불러오는 중...</p>
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

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/survey" className="hover:text-wee-main">설문조사</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900">결과보기</span>
            </div>
          </nav>

          {/* Survey Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft p-8 mb-8"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
                <span className="badge bg-gray-100 text-gray-700">결과</span>
              </div>
              <p className="text-lg text-gray-600 mb-6">{survey.description}</p>
              
              {/* Summary Stats */}
              <div className="grid md:grid-cols-4 gap-6 bg-gradient-to-r from-wee-light to-blue-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-wee-main mb-2">{survey.total_responses}</div>
                  <div className="text-sm text-gray-600">총 응답 수</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {new Date(survey.start_date).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="text-sm text-gray-600">시작일</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {new Date(survey.end_date).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="text-sm text-gray-600">종료일</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {survey.is_anonymous ? '익명' : '실명'}
                  </div>
                  <div className="text-sm text-gray-600">조사 방식</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question Statistics */}
          <div className="space-y-8">
            {stats.map((questionStats, index) => (
              <motion.div
                key={questionStats.question_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <span className="bg-wee-main text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {questionStats.question_text}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        총 {questionStats.total_responses}명 응답
                      </p>
                    </div>
                  </div>
                  
                  {renderQuestionStats(questionStats)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">조사 결과 요약</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  주요 발견사항
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 응답자의 82.9%가 Wee 프로젝트 서비스 이용 경험 보유</li>
                  <li>• Wee 센터 이용률이 76.8%로 가장 높음</li>
                  <li>• 개인상담 목적 이용이 38.4%로 최다</li>
                  <li>• 전반적 만족도 평균 4.2점으로 높은 수준</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  개선 제안사항
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Wee 클래스, Wee 스쿨 홍보 및 접근성 강화</li>
                  <li>• 개인상담 서비스 품질 지속 향상</li>
                  <li>• 온라인 상담 시스템 사용성 개선</li>
                  <li>• 만족도 5점 응답자 비율 증대 방안 모색</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/survey" className="btn-secondary">
              설문조사 목록으로
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              결과 인쇄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};