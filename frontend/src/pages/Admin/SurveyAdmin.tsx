import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date: string;
  is_anonymous: boolean;
  response_count: number;
  created_at: string;
}

const SurveyAdmin: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'active' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
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
          created_at: '2024-05-25',
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
          created_at: '2024-06-10',
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
          created_at: '2024-04-25',
        },
        {
          id: '4',
          title: '2024년 하반기 프로그램 수요 조사',
          description: '하반기 프로그램 계획을 위한 수요 조사입니다.',
          status: 'draft',
          start_date: '2024-07-01',
          end_date: '2024-07-15',
          is_anonymous: true,
          response_count: 0,
          created_at: '2024-06-20',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 설문조사를 삭제하시겠습니까?')) {
      try {
        // await api.delete(`/surveys/${id}`);
        setSurveys(surveys.filter(survey => survey.id !== id));
      } catch (error) {
        console.error('Failed to delete survey:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // await api.patch(`/surveys/${id}`, { status: newStatus });
      setSurveys(surveys.map(survey => 
        survey.id === id ? { ...survey, status: newStatus as any } : survey
      ));
    } catch (error) {
      console.error('Failed to update survey status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
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
      case 'archived': return '보관됨';
      default: return status;
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesFilter = filter === 'all' || survey.status === filter;
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">설문조사 관리</h1>
          <Link
            to="/admin/surveys/new"
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 설문조사
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'draft', label: '준비중' },
              { key: 'active', label: '진행중' },
              { key: 'closed', label: '종료' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === item.key
                    ? 'bg-wee-main text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="설문조사 제목 또는 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Survey List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto"></div>
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-500 mb-4">등록된 설문조사가 없습니다.</p>
          <Link to="/admin/surveys/new" className="btn-primary">
            첫 설문조사 만들기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                    <span className={`badge ${getStatusColor(survey.status)}`}>
                      {getStatusText(survey.status)}
                    </span>
                    {survey.is_anonymous && (
                      <span className="badge badge-info">익명</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{survey.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(survey.start_date).toLocaleDateString('ko-KR')} ~ {new Date(survey.end_date).toLocaleDateString('ko-KR')}
                    </span>
                    
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {survey.response_count}명 응답
                    </span>
                    
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      생성일: {new Date(survey.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Change */}
                  <select
                    value={survey.status}
                    onChange={(e) => handleStatusChange(survey.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg shadow-soft text-sm focus:ring-2 focus:ring-wee-main focus:outline-none"
                  >
                    <option value="draft">준비중</option>
                    <option value="active">진행중</option>
                    <option value="closed">종료</option>
                    <option value="archived">보관</option>
                  </select>

                  {/* View Results */}
                  <Link
                    to={`/survey/${survey.id}/results`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="결과 보기"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </Link>

                  {/* Edit */}
                  <Link
                    to={`/admin/surveys/${survey.id}/edit`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="수정"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(survey.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="삭제"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyAdmin;