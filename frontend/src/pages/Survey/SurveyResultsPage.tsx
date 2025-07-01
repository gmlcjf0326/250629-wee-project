import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
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

export const SurveyResultsPage: React.FC = () => {
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
      
      // Mock data - 실제로는 API에서 가져와야 함
      const mockSurvey: Survey = {
        id: id || '1',
        title: '2024년 Wee 프로젝트 만족도 조사',
        description: 'Wee 프로젝트 서비스 이용자를 대상으로 한 만족도 조사입니다.',
        status: 'active',
        start_date: '2024-06-01',
        end_date: '2024-12-31',
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
            '예': 220,
            '아니오': 25
          }
        },
        {
          question_id: '2',
          question_text: '이용하신 서비스는 무엇인가요? (복수 선택 가능)',
          question_type: 'multiple_choice',
          total_responses: 220,
          stats: {
            'Wee 클래스': 180,
            'Wee 센터': 120,
            'Wee 스쿨': 45,
            '온라인 상담': 89,
            '전화 상담': 67
          }
        },
        {
          question_id: '3',
          question_text: '서비스 이용 목적은 무엇이었나요?',
          question_type: 'single_choice',
          total_responses: 220,
          stats: {
            '개인상담': 78,
            '집단상담': 45,
            '심리검사': 38,
            '위기상담': 25,
            '진로상담': 34
          }
        },
        {
          question_id: '4',
          question_text: '전반적인 서비스 만족도를 평가해 주세요.',
          question_type: 'rating',
          total_responses: 220,
          stats: {
            '1점': 5,
            '2점': 12,
            '3점': 45,
            '4점': 98,
            '5점': 60
          }
        },
        {
          question_id: '5',
          question_text: '서비스 개선을 위한 의견이나 제안이 있다면 자유롭게 작성해 주세요.',
          question_type: 'textarea',
          total_responses: 154,
          stats: {
            type: 'text_responses',
            sample_responses: [
              '서비스가 매우 도움이 되었습니다.',
              '상담사 선생님께서 친절하게 대해주셔서 감사했습니다.',
              '프로그램이 다양해서 좋았습니다.',
              '접근성이 더 좋아졌으면 좋겠습니다.',
              '온라인 상담 시스템이 편리했습니다.'
            ],
            keywords: {
              '도움': 45,
              '친절': 38,
              '프로그램': 32,
              '접근성': 28,
              '온라인': 25,
              '편리': 22,
              '개선': 18
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

  const renderChart = (stat: QuestionStats) => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
      },
    };

    switch (stat.question_type) {
      case 'yes_no':
      case 'single_choice':
        const pieData = {
          labels: Object.keys(stat.stats),
          datasets: [
            {
              data: Object.values(stat.stats),
              backgroundColor: [
                '#0066B2',
                '#00A9E0',
                '#71C5E8',
                '#B9DDF1',
                '#E0F2F9',
                '#FFA500',
                '#FFD700',
              ],
              borderWidth: 0,
            },
          ],
        };
        return (
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        );

      case 'multiple_choice':
        const barData = {
          labels: Object.keys(stat.stats),
          datasets: [
            {
              label: '응답 수',
              data: Object.values(stat.stats),
              backgroundColor: '#0066B2',
              borderRadius: 8,
            },
          ],
        };
        return (
          <div className="h-64">
            <Bar data={barData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
        );

      case 'rating':
        const ratingData = {
          labels: Object.keys(stat.stats),
          datasets: [
            {
              label: '응답 수',
              data: Object.values(stat.stats),
              fill: true,
              backgroundColor: 'rgba(0, 102, 178, 0.2)',
              borderColor: '#0066B2',
              tension: 0.4,
            },
          ],
        };
        return (
          <div className="h-64">
            <Line data={ratingData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
        );

      case 'textarea':
        if (stat.stats.type === 'text_responses') {
          return (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">주요 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stat.stats.keywords).map(([keyword, count]) => (
                    <span 
                      key={keyword}
                      className="px-3 py-1 bg-wee-light text-wee-main rounded-full text-sm font-medium"
                    >
                      {keyword} ({count})
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">샘플 응답</h4>
                <div className="space-y-2">
                  {stat.stats.sample_responses.map((response: string, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                      "{response}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  const getResponseRate = () => {
    if (!survey) return 0;
    return Math.round((survey.total_responses / 300) * 100); // 목표 응답 수를 300으로 가정
  };

  const getAverageSatisfaction = () => {
    const satisfactionStat = stats.find(s => s.question_type === 'rating');
    if (!satisfactionStat) return 0;
    
    let totalScore = 0;
    let totalResponses = 0;
    
    Object.entries(satisfactionStat.stats).forEach(([score, count]) => {
      const numScore = parseInt(score.replace('점', ''));
      totalScore += numScore * (count as number);
      totalResponses += count as number;
    });
    
    return totalResponses > 0 ? (totalScore / totalResponses).toFixed(1) : '0';
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content-wide">
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">설문조사 결과를 불러오는 중...</p>
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
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{survey.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{survey.description}</p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="w-16 h-16 bg-wee-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{survey.total_responses}</h3>
                <p className="text-gray-600">총 응답 수</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{getResponseRate()}%</h3>
                <p className="text-gray-600">응답률</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{getAverageSatisfaction()}</h3>
                <p className="text-gray-600">평균 만족도</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {Math.ceil((new Date(survey.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </h3>
                <p className="text-gray-600">남은 일수</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Question Results */}
        <div className="space-y-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.question_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-soft p-8"
            >
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {index + 1}. {stat.question_text}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {stat.total_responses}명 응답
                  </span>
                </div>
              </div>

              {renderChart(stat)}
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-center gap-4">
          <Link to="/survey" className="btn-secondary">
            목록으로 돌아가기
          </Link>
          {survey.status === 'active' && (
            <Link to={`/survey/${survey.id}`} className="btn-primary">
              설문 참여하기
            </Link>
          )}
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            결과 다운로드
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};