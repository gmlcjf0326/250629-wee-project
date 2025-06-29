import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resourcesAPI, Resource } from '../../api/resources';
import FileUploadModal from '../../components/resources/FileUploadModal';
import FileTypeIcon from '../../components/resources/FileTypeIcon';
import DownloadStats from '../../components/resources/DownloadStats';
import { motion, AnimatePresence } from 'framer-motion';

const ResourcesCases: React.FC = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cases, setCases] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');

  const years = ['2024', '2023', '2022', '2021'];
  
  const categories = [
    { value: 'all', label: '전체', icon: '📁' },
    { value: 'counseling', label: '상담 사례', icon: '💬' },
    { value: 'program', label: '프로그램 운영', icon: '📋' },
    { value: 'crisis', label: '위기개입', icon: '🚨' },
    { value: 'collaboration', label: '협력 사례', icon: '🤝' },
  ];

  useEffect(() => {
    fetchCases();
  }, [selectedYear, selectedCategory, sortBy]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const filters = {
        type: 'case',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        is_active: true
      };
      const response = await resourcesAPI.getResources(filters);
      
      // Filter by year if needed (this would ideally be done on backend)
      let filteredData = response.data || [];
      filteredData = filteredData.filter((c: any) => {
        const caseYear = new Date(c.created_at).getFullYear().toString();
        return caseYear === selectedYear;
      });
      
      setCases(filteredData);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      // Use mock data for now if API fails
      setCases([
        {
          id: '1',
          title: '게임 과몰입 학생의 성공적인 일상 복귀 사례',
          description: '게임 중독으로 학업을 포기했던 고2 학생이 6개월간의 체계적인 상담을 통해 일상생활로 복귀하고 진로를 찾아가는 과정을 담은 사례입니다.',
          category: 'counseling',
          type: 'case',
          created_at: '2024-01-15',
          file_size: 3500000,
          download_count: 1234,
          file_url: '/uploads/case1.pdf',
          file_name: 'game-addiction-recovery-case.pdf',
          tags: ['게임중독', '개인상담', '가족상담', '진로상담', 'class', '서울'],
          is_active: true,
          updated_at: '2024-01-15',
          uploaded_by: '김상담 전문상담교사'
        },
        {
          id: '2',
          title: '또래상담자 프로그램을 통한 학교폭력 예방 성공 사례',
          description: '또래상담자 30명을 양성하여 학교폭력 발생률을 전년 대비 40% 감소시킨 예방 프로그램 운영 사례입니다.',
          category: 'program',
          type: 'case',
          created_at: '2024-01-10',
          file_size: 4200000,
          download_count: 2156,
          file_url: '/uploads/case2.pdf',
          file_name: 'peer-counseling-case.pdf',
          tags: ['또래상담', '학교폭력예방', '집단프로그램', 'center', '경기도'],
          is_active: true,
          updated_at: '2024-01-10',
          uploaded_by: '이상담 상담사'
        },
        {
          id: '3',
          title: '자해 위기 학생 긴급개입 및 회복 지원 사례',
          description: '자해 행동을 보이는 중학생에 대한 즉각적인 위기개입과 장기적인 치료 연계를 통해 안정화에 성공한 사례입니다.',
          category: 'crisis',
          type: 'case',
          created_at: '2023-12-20',
          file_size: 2800000,
          download_count: 987,
          file_url: '/uploads/case3.pdf',
          file_name: 'self-harm-intervention-case.pdf',
          tags: ['위기개입', '자해', '치료연계', '부모상담', 'center', '부산'],
          is_active: true,
          updated_at: '2023-12-20',
          uploaded_by: '박상담 임상심리사'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchQuery === '' || 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDownload = async (caseItem: Resource) => {
    try {
      const downloadData = await resourcesAPI.downloadResource(caseItem.id);
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl || caseItem.file_url;
      link.download = caseItem.file_name || caseItem.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local download count
      setCases(prev => prev.map(c => 
        c.id === caseItem.id 
          ? { ...c, download_count: c.download_count + 1 }
          : c
      ));
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const getCaseInfo = (caseItem: Resource) => {
    // Extract case info from tags or metadata
    const metadata = (caseItem as any).metadata || {};
    const tags = caseItem.tags || [];
    
    // Extract type from tags
    let type = 'class';
    if (tags.includes('center')) type = 'center';
    else if (tags.includes('school')) type = 'school';
    
    // Extract institution info
    const institution = metadata.institution || tags.find(tag => tag.includes('학교') || tag.includes('센터') || tag.includes('스쿨')) || 'Wee 기관';
    
    return {
      type,
      institution,
      author: caseItem.uploaded_by || metadata.author || '작성자',
      isAward: caseItem.download_count > 1500 || metadata.isAward,
      views: metadata.views || Math.floor(caseItem.download_count * 1.5),
      likes: metadata.likes || Math.floor(caseItem.download_count * 0.07)
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-700';
      case 'center': return 'bg-green-100 text-green-700';
      case 'school': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'class': return 'Wee 클래스';
      case 'center': return 'Wee 센터';
      case 'school': return 'Wee 스쿨';
      default: return '';
    }
  };

  const getTargetIcon = (target: string) => {
    const icons: Record<string, string> = {
      elementary: '🎒',
      middle: '📚',
      high: '🎓',
      parent: '👨‍👩‍👧‍👦',
      all: '👥',
    };
    return icons[target] || '👥';
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">우수사례집</h1>
            <p className="text-lg text-gray-600">
              전국 Wee 프로젝트의 성공적인 상담 및 운영 사례를 공유합니다
            </p>
          </motion.div>
          
          {/* Admin Upload Button */}
          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 사례 업로드
              </button>
            </motion.div>
          )}
        </div>

        {/* Filters and View Mode */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-soft p-6 mb-8"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="form-label">검색</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="사례 제목, 설명, 태그 검색"
                  className="form-input pl-10"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {/* Year Filter */}
              <div>
                <label className="form-label">연도</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="form-input"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>

                {/* Category Filter */}
                <div>
                  <label className="form-label">분류</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <motion.button
                        key={cat.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === cat.value
                            ? 'bg-wee-main text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Sort */}
                <div>
                  <label className="form-label">정렬</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="newest">최신순</option>
                    <option value="popular">인기순</option>
                    <option value="name">제목순</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-wee-main text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-wee-main text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
          </div>
        )}

        {/* Cases Display */}
        {!loading && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {filteredCases.map((caseItem, index) => {
                  const caseInfo = getCaseInfo(caseItem);
                  
                  return (
                    <motion.div
                      key={caseItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <FileTypeIcon fileName={caseItem.file_name || 'case.pdf'} size="md" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(caseInfo.type)}`}>
                                    {getTypeLabel(caseInfo.type)}
                                  </span>
                                  {caseInfo.isAward && (
                                    <span className="badge badge-warning animate-pulse">🏆 우수상</span>
                                  )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{caseItem.title}</h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Institution and Author */}
                        <div className="text-sm text-gray-600 mb-3">
                          <p>{caseInfo.institution}</p>
                          <p>{caseInfo.author}</p>
                        </div>

                        {/* Summary */}
                        <p className="text-gray-700 mb-4 line-clamp-3">{caseItem.description}</p>

                        {/* Tags */}
                        {caseItem.tags && caseItem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {caseItem.tags.slice(0, 4).map((tag, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                #{tag}
                              </span>
                            ))}
                            {caseItem.tags.length > 4 && (
                              <span className="text-xs text-gray-500">+{caseItem.tags.length - 4}</span>
                            )}
                          </div>
                        )}

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {caseInfo.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {caseInfo.likes}
                            </span>
                            <DownloadStats downloads={caseItem.download_count} />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload(caseItem)}
                            className="btn-primary btn-sm"
                          >
                            다운로드
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8"
              >
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        파일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        기관
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작성자
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        조회수
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        다운로드
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((caseItem, index) => {
                      const caseInfo = getCaseInfo(caseItem);
                      
                      return (
                        <motion.tr
                          key={caseItem.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <FileTypeIcon fileName={caseItem.file_name || 'case.pdf'} size="sm" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {caseInfo.isAward && <span className="mr-2">🏆</span>}
                              <div>
                                <p className="font-medium text-gray-900">{caseItem.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{caseItem.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {caseInfo.institution}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {caseInfo.author}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {caseInfo.views}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <DownloadStats downloads={caseItem.download_count} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDownload(caseItem)}
                              className="text-wee-main hover:text-wee-dark"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredCases.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 사례가 없습니다.'}
            </p>
          </motion.div>
        )}

        {/* Case Study Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">우수사례 작성 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-wee-main rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">상황 설명</h4>
              <p className="text-sm text-gray-600">
                대상자의 특성과 주요 문제 상황을 구체적으로 기술
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-wee-blue rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">개입 과정</h4>
              <p className="text-sm text-gray-600">
                적용한 상담 기법과 프로그램의 진행 과정 상세 설명
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-wee-green rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">변화와 성과</h4>
              <p className="text-sm text-gray-600">
                개입 후 나타난 긍정적 변화와 측정 가능한 성과 제시
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-wee-purple rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">시사점</h4>
              <p className="text-sm text-gray-600">
                사례를 통해 얻은 교훈과 다른 기관에 주는 시사점
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Upload Modal */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchCases();
          }}
          resourceType="case"
        />
      </div>
    </div>
  );
};

export default ResourcesCases;