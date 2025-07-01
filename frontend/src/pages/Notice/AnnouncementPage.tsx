import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noticeAPI } from '../../api/notices';
import { motion } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  view_count: number;
  is_important: boolean;
  created_at: string;
}

const AnnouncementPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const noticesPerPage = 10;

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticeAPI.getNotices({
        page: currentPage,
        limit: noticesPerPage,
        sort: 'latest'
      });
      
      // Map the API response to match the component's interface
      const mappedNotices = response.notices.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        category: notice.category,
        author: notice.author || '관리자',
        view_count: notice.views || 0,
        is_important: notice.is_important || false,
        created_at: notice.created_at || notice.posted_date || new Date().toISOString(),
      }));
      
      setNotices(mappedNotices);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      // Fallback to mock data if API fails
      const mockNotices: Notice[] = [
        {
          id: '1',
          title: '[중요] 2024년 하반기 Wee 프로젝트 연수 일정 안내',
          content: '2024년 하반기 Wee 프로젝트 관련 연수 일정을 안내드립니다.',
          category: '연수',
          author: '관리자',
          view_count: 523,
          is_important: true,
          created_at: '2024-06-25T10:00:00Z',
        },
        {
          id: '2',
          title: 'Wee 클래스 운영 매뉴얼 개정판 배포',
          content: '2024년 개정된 Wee 클래스 운영 매뉴얼을 배포합니다.',
          category: '자료',
          author: '관리자',
          view_count: 342,
          is_important: false,
          created_at: '2024-06-24T14:30:00Z',
        },
        {
          id: '3',
          title: '7월 전문상담교사 역량강화 연수 신청 안내',
          content: '7월에 진행되는 전문상담교사 역량강화 연수 신청을 받습니다.',
          category: '연수',
          author: '교육지원팀',
          view_count: 289,
          is_important: false,
          created_at: '2024-06-23T09:15:00Z',
        },
        {
          id: '4',
          title: '2024년 상반기 우수사례 공모전 결과 발표',
          content: '2024년 상반기 Wee 프로젝트 우수사례 공모전 결과를 발표합니다.',
          category: '공모',
          author: '관리자',
          view_count: 456,
          is_important: true,
          created_at: '2024-06-22T16:45:00Z',
        },
        {
          id: '5',
          title: 'Wee 센터 신규 개소 안내 (서울 강남구)',
          content: '서울 강남구에 새로운 Wee 센터가 개소합니다.',
          category: '안내',
          author: '운영지원팀',
          view_count: 198,
          is_important: false,
          created_at: '2024-06-21T11:20:00Z',
        },
      ];
      
      setNotices(mockNotices);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getCategoryBadge = (category: string) => {
    const badges: { [key: string]: string } = {
      '연수': 'bg-blue-100 text-blue-700',
      '자료': 'bg-green-100 text-green-700',
      '공모': 'bg-purple-100 text-purple-700',
      '안내': 'bg-gray-100 text-gray-700',
    };
    return badges[category] || 'bg-gray-100 text-gray-700';
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  return (
    <div className="page-wrapper">
      <div className="content-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">공지사항</h1>
          <p className="text-gray-600">
            Wee 프로젝트의 주요 소식과 안내사항을 확인하세요.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="공지사항 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">공지사항을 불러오는 중...</p>
          </div>
        ) : currentNotices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all p-6"
              >
                <Link to={`/notice/announcement/${notice.id}`} className="block">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {notice.is_important && (
                          <span className="badge bg-red-100 text-red-700">중요</span>
                        )}
                        <span className={`badge ${getCategoryBadge(notice.category)}`}>
                          {notice.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notice.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {notice.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {notice.author}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(notice.created_at)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {notice.view_count}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-wee-main text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPage;