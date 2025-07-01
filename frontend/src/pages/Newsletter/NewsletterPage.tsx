import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Newsletter {
  id: number;
  title: string;
  issue: string;
  date: string;
  coverImage: string;
  highlights: string[];
  downloads: number;
  isLatest?: boolean;
}

const NewsletterPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [email, setEmail] = useState('');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestNewsletter, setLatestNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, [selectedYear]);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/newsletters', {
        params: { year: selectedYear === 'all' ? undefined : selectedYear }
      });
      setNewsletters(response.data.data || []);
      
      // Find latest newsletter
      const latest = response.data.data.find((n: Newsletter) => n.isLatest) || response.data.data[0];
      setLatestNewsletter(latest);
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
      // Use mock data for now
      const mockNewsletters: Newsletter[] = [
    {
      id: 1,
      title: 'Wee 프로젝트 소식지',
      issue: '2024년 3월호',
      date: '2024-03-01',
      coverImage: '🌸',
      highlights: [
        '새학기 적응 프로그램 특집',
        '전문상담교사 인터뷰',
        '우수 Wee 클래스 탐방기',
        '3월 연수 일정 안내',
      ],
      downloads: 1234,
      isLatest: true,
    },
    {
      id: 2,
      title: 'Wee 프로젝트 소식지',
      issue: '2024년 2월호',
      date: '2024-02-01',
      coverImage: '❄️',
      highlights: [
        '2024년 사업 계획 발표',
        '겨울방학 프로그램 성과',
        '신규 상담사 연수 후기',
        '학부모 상담 가이드',
      ],
      downloads: 987,
    },
    {
      id: 3,
      title: 'Wee 프로젝트 소식지',
      issue: '2024년 1월호',
      date: '2024-01-01',
      coverImage: '🎊',
      highlights: [
        '2023년 성과 보고',
        '우수사례 시상식',
        '새해 인사말',
        '1월 주요 일정',
      ],
      downloads: 1543,
    },
    {
      id: 4,
      title: 'Wee 프로젝트 소식지',
      issue: '2023년 12월호',
      date: '2023-12-01',
      coverImage: '🎄',
      highlights: [
        '한 해를 마무리하며',
        '연말 특별 프로그램',
        '상담 통계 분석',
        '2024년 전망',
      ],
      downloads: 876,
    },
    {
      id: 5,
      title: 'Wee 프로젝트 소식지',
      issue: '2023년 11월호',
      date: '2023-11-01',
      coverImage: '🍂',
      highlights: [
        '수능 대비 심리지원',
        '가을 연수 프로그램',
        '학교폭력 예방 캠페인',
        '전문가 칼럼',
      ],
      downloads: 765,
    },
    {
      id: 6,
      title: 'Wee 프로젝트 소식지',
      issue: '2023년 10월호',
      date: '2023-10-01',
      coverImage: '🎃',
      highlights: [
        '정신건강의 날 특집',
        '위기개입 사례 공유',
        '상담 기법 소개',
        '10월 행사 안내',
      ],
      downloads: 654,
    },
  ];
      setNewsletters(mockNewsletters);
      setLatestNewsletter(mockNewsletters[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (newsletter: Newsletter) => {
    try {
      const response = await api.post(`/newsletters/${newsletter.id}/download`);
      const { downloadUrl, fileName } = response.data.data;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('다운로드가 시작되었습니다.');
      
      // Refresh to update download count
      fetchNewsletters();
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('다운로드에 실패했습니다.');
    }
  };

  const years = ['2024', '2023', '2022', '2021'];
  
  const filteredNewsletters = selectedYear === 'all' 
    ? newsletters 
    : newsletters.filter(n => n.date.startsWith(selectedYear));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('구독 신청이 완료되었습니다!');
      setEmail('');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">뉴스레터</h1>
          <p className="text-lg text-gray-600">
            Wee 프로젝트의 최신 소식과 유용한 정보를 전해드립니다
          </p>
        </div>

        {/* Latest Issue Hero */}
        {latestNewsletter && (
          <div className="bg-gradient-to-r from-wee-main to-wee-blue rounded-3xl shadow-xl p-8 mb-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-warning">최신호</span>
                  <span className="text-white/80">{latestNewsletter.issue}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{latestNewsletter.title}</h2>
                <div className="space-y-2 mb-6">
                  {latestNewsletter.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDownload(latestNewsletter)}
                    className="bg-white text-wee-main px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF 다운로드
                  </button>
                  <button className="bg-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                    온라인으로 보기
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[200px] animate-pulse">
                  {latestNewsletter.coverImage}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Year Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-soft p-1 inline-flex">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-wee-main text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {year}년
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
          </div>
        )}

        {/* Newsletter Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredNewsletters.map(newsletter => (
            <div key={newsletter.id} className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all">
              {/* Cover */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">{newsletter.coverImage}</div>
                  <p className="text-gray-600 font-medium">{newsletter.issue}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">{newsletter.title}</h3>
                
                {/* Highlights */}
                <ul className="space-y-1 mb-4">
                  {newsletter.highlights.slice(0, 3).map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-wee-main mr-2">•</span>
                      <span className="line-clamp-1">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{newsletter.date}</span>
                  <span>다운로드 {newsletter.downloads}회</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(newsletter)}
                    className="btn-primary btn-sm flex-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    다운로드
                  </button>
                  <button className="btn-ghost btn-sm flex-1">
                    읽기
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-wee-light to-blue-50 rounded-3xl p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">뉴스레터 구독 신청</h2>
            <p className="text-gray-600 mb-6">
              매월 발행되는 Wee 프로젝트 소식지를 이메일로 받아보세요
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력하세요"
                className="form-input flex-1"
                required
              />
              <button type="submit" className="btn-primary">
                구독하기
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              구독은 언제든지 취소하실 수 있습니다
            </p>
          </div>
        </div>

        {/* Newsletter Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-wee-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">최신 정보</h3>
            <p className="text-sm text-gray-600">
              Wee 프로젝트의 최신 동향과 정책 변화를 빠르게 전달
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">전문가 인사이트</h3>
            <p className="text-sm text-gray-600">
              상담 전문가들의 노하우와 최신 연구 결과 공유
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">유용한 자료</h3>
            <p className="text-sm text-gray-600">
              바로 활용 가능한 상담 도구와 프로그램 자료 제공
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;