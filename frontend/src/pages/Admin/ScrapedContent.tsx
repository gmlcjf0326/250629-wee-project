import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface ScrapedContent {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  source_url: string;
  scraped_at: string;
}

interface ScrapingStats {
  totalContents: number;
  totalInstitutions: number;
  totalAnnouncements: number;
  recentScrapes: Array<{
    scraped_at: string;
    category: string;
  }>;
}

const ScrapedContent: React.FC = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<ScrapedContent[]>([]);
  const [stats, setStats] = useState<ScrapingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('main');
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'main', label: '메인 페이지' },
    { value: 'about', label: '사업소개' },
    { value: 'history', label: '사업연혁' },
    { value: 'system', label: '추진체계' },
  ];

  useEffect(() => {
    fetchStats();
    fetchContents();
  }, [selectedCategory]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/scraper/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchContents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/scraper/content/${selectedCategory}`);
      setContents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!confirm('Wee 웹사이트에서 콘텐츠를 크롤링하시겠습니까?')) {
      return;
    }

    setScraping(true);
    setMessage('');
    
    try {
      const response = await api.post('/scraper/scrape/wee');
      setMessage('크롤링이 완료되었습니다!');
      
      // Refresh data
      await fetchStats();
      await fetchContents();
    } catch (error) {
      setMessage('크롤링 중 오류가 발생했습니다.');
      console.error('Scraping error:', error);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">크롤링 콘텐츠 관리</h2>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-sm font-medium text-gray-500">전체 콘텐츠</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalContents}</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-sm font-medium text-gray-500">기관 정보</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalInstitutions}</p>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-sm font-medium text-gray-500">공지사항</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalAnnouncements}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">크롤링 작업</h3>
              <p className="text-sm text-gray-600 mt-1">
                Wee 공식 웹사이트에서 최신 콘텐츠를 가져옵니다
              </p>
            </div>
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="btn-primary"
            >
              {scraping ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  크롤링 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  크롤링 시작
                </>
              )}
            </button>
          </div>
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('오류') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">카테고리:</label>
            <div className="flex space-x-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-wee-main text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <svg className="animate-spin h-8 w-8 text-wee-main mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500 mt-4">로딩 중...</p>
            </div>
          ) : contents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">아직 크롤링된 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {contents.map((content) => (
                <div key={content.id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {content.title}
                      </h3>
                      {content.content && (
                        <p className="text-gray-600 line-clamp-3 mb-3">
                          {content.content}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {content.subcategory || content.category}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(content.scraped_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                    <a
                      href={content.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-wee-main hover:text-wee-dark"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapedContent;