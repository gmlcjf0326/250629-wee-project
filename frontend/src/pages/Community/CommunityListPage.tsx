import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  content: string;
  author_name: string;
  category: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  is_pinned: boolean;
  created_at: string;
}

export const CommunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'general' | 'question' | 'case' | 'notice'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  useEffect(() => {
    fetchPosts();
  }, [category, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockPosts: Post[] = [
        {
          id: '1',
          title: '[공지] 2024년 하반기 Wee 프로젝트 연수 일정 안내',
          content: '2024년 하반기 Wee 프로젝트 관련 연수 일정을 안내드립니다.',
          author_name: '관리자',
          category: 'notice',
          view_count: 523,
          like_count: 0,
          comment_count: 0,
          is_notice: true,
          is_pinned: true,
          created_at: '2024-06-25T10:00:00Z',
        },
        {
          id: '2',
          title: 'Wee 프로젝트 활용 후기 공유합니다',
          content: '안녕하세요. 올해 처음으로 Wee 클래스를 운영하게 된 교사입니다.',
          author_name: '김교사',
          category: 'general',
          view_count: 234,
          like_count: 18,
          comment_count: 5,
          is_notice: false,
          is_pinned: false,
          created_at: '2024-06-24T14:30:00Z',
        },
        {
          id: '3',
          title: '중학생 대상 진로상담 프로그램 추천해주세요',
          content: '중학교 2학년 담임을 맡고 있는데요, 학생들이 진로에 대해 고민이 많은 것 같습니다.',
          author_name: '박상담사',
          category: 'question',
          view_count: 156,
          like_count: 7,
          comment_count: 12,
          is_notice: false,
          is_pinned: false,
          created_at: '2024-06-23T09:15:00Z',
        },
        {
          id: '4',
          title: '게임 과몰입 학생 상담 사례 공유',
          content: '최근 게임 과몰입으로 학교생활에 어려움을 겪는 학생을 상담하게 되었습니다.',
          author_name: '이상담교사',
          category: 'case',
          view_count: 412,
          like_count: 32,
          comment_count: 8,
          is_notice: false,
          is_pinned: false,
          created_at: '2024-06-22T16:45:00Z',
        },
        {
          id: '5',
          title: '초등학생 또래관계 개선 프로그램 효과',
          content: '또래관계에 어려움을 겪는 초등학생들을 대상으로 8주간 프로그램을 진행했습니다.',
          author_name: '최상담사',
          category: 'case',
          view_count: 298,
          like_count: 24,
          comment_count: 6,
          is_notice: false,
          is_pinned: false,
          created_at: '2024-06-21T11:20:00Z',
        },
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'notice':
        return { text: '공지', class: 'bg-red-100 text-red-700' };
      case 'question':
        return { text: '질문', class: 'bg-blue-100 text-blue-700' };
      case 'case':
        return { text: '사례', class: 'bg-green-100 text-green-700' };
      default:
        return { text: '일반', class: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    } else if (days < 7) {
      return `${days}일 전`;
    }
    
    return date.toLocaleDateString('ko-KR');
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = category === 'all' || post.category === category;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    // Pinned posts first
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    // Then by date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">자유게시판</h1>
          <p className="text-gray-600">
            Wee 프로젝트 관련 경험을 자유롭게 공유하고 소통하는 공간입니다.
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: '전체' },
                { key: 'general', label: '일반' },
                { key: 'question', label: '질문' },
                { key: 'case', label: '사례' },
                { key: 'notice', label: '공지' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    category === cat.key
                      ? 'bg-wee-main text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none"
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

            {/* Write Button */}
            {user && (
              <button
                onClick={() => navigate('/community/write')}
                className="btn-primary whitespace-nowrap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                글쓰기
              </button>
            )}
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">게시글을 불러오는 중...</p>
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 mb-4">등록된 게시글이 없습니다.</p>
            {user && (
              <button onClick={() => navigate('/community/write')} className="btn-primary">
                첫 게시글 작성하기
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      작성자
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      조회
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      추천
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      날짜
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPosts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/community/${post.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {post.is_pinned && (
                            <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`badge text-xs ${getCategoryBadge(post.category).class}`}>
                                {getCategoryBadge(post.category).text}
                              </span>
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {post.title}
                              </h3>
                              {post.comment_count > 0 && (
                                <span className="text-xs text-wee-main font-medium">
                                  [{post.comment_count}]
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate md:hidden">
                              {post.author_name} · {formatDate(post.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 hidden md:table-cell">
                        {post.author_name}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 hidden lg:table-cell">
                        {post.view_count}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 hidden lg:table-cell">
                        {post.like_count}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
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
          </>
        )}

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <div className="mt-6 bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-blue-900 mb-4">
              게시글을 작성하려면 로그인이 필요합니다.
            </p>
            <Link to="/login" className="btn-primary">
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};