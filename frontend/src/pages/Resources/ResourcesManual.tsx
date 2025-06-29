import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resourcesAPI, Resource } from '../../api/resources';
import FileUploadModal from '../../components/resources/FileUploadModal';
import FileTypeIcon from '../../components/resources/FileTypeIcon';
import DownloadStats from '../../components/resources/DownloadStats';
import { motion, AnimatePresence } from 'framer-motion';

const ResourcesManual: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [manuals, setManuals] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { value: 'all', label: '전체', icon: '📚' },
    { value: 'operation', label: '운영 매뉴얼', icon: '⚙️' },
    { value: 'counseling', label: '상담 매뉴얼', icon: '💬' },
    { value: 'program', label: '프로그램 매뉴얼', icon: '📋' },
    { value: 'crisis', label: '위기대응 매뉴얼', icon: '🚨' },
  ];

  useEffect(() => {
    fetchManuals();
  }, [selectedCategory, sortBy]);

  const fetchManuals = async () => {
    setLoading(true);
    try {
      const filters = {
        type: 'manual',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        is_active: true
      };
      const response = await resourcesAPI.getResources(filters);
      setManuals(response.data || []);
    } catch (error) {
      console.error('Failed to fetch manuals:', error);
      // Use mock data for now if API fails
      setManuals([
        {
          id: '1',
          title: 'Wee 클래스 운영 매뉴얼 2024',
          category: 'operation',
          type: 'manual',
          version: 'v3.0',
          created_at: '2024-01-15',
          file_size: 12500000,
          download_count: 2341,
          description: 'Wee 클래스 운영에 필요한 전반적인 가이드라인과 절차를 담은 종합 매뉴얼입니다.',
          file_url: '/uploads/manual1.pdf',
          file_name: 'wee-class-manual-2024.pdf',
          tags: ['운영', '매뉴얼', '2024'],
          is_active: true,
          updated_at: '2024-01-15'
        },
        {
          id: '2',
          title: '학교폭력 예방 및 대응 매뉴얼',
          category: 'crisis',
          type: 'manual',
          version: 'v2.5',
          created_at: '2023-12-20',
          file_size: 8300000,
          download_count: 1892,
          description: '학교폭력 사안 발생 시 단계별 대응 방법과 예방 프로그램 운영 지침입니다.',
          file_url: '/uploads/manual2.pdf',
          file_name: 'violence-prevention-manual.pdf',
          tags: ['학교폭력', '예방', '위기대응'],
          is_active: true,
          updated_at: '2023-12-20'
        },
        {
          id: '3',
          title: '개인상담 진행 가이드북',
          category: 'counseling',
          type: 'manual',
          version: 'v4.1',
          created_at: '2023-11-10',
          file_size: 5700000,
          download_count: 3421,
          description: '효과적인 개인상담을 위한 상담 기법과 사례별 접근 방법을 제시합니다.',
          file_url: '/uploads/manual3.pdf',
          file_name: 'counseling-guide.pdf',
          tags: ['개인상담', '상담기법'],
          is_active: true,
          updated_at: '2023-11-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = searchQuery === '' || 
      manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manual.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manual.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDownload = async (manual: Resource) => {
    try {
      const downloadData = await resourcesAPI.downloadResource(manual.id);
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl || manual.file_url;
      link.download = manual.file_name || manual.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local download count
      setManuals(prev => prev.map(m => 
        m.id === manual.id 
          ? { ...m, download_count: m.download_count + 1 }
          : m
      ));
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isUpdated = (updatedAt: string, createdAt: string) => {
    if (updatedAt === createdAt) return false;
    const date = new Date(updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  };

  const getCategoryInfo = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat || { label: '', icon: '📄' };
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">매뉴얼</h1>
            <p className="text-lg text-gray-600">
              Wee 프로젝트 운영에 필요한 각종 매뉴얼을 제공합니다
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
                새 매뉴얼 업로드
              </button>
            </motion.div>
          )}
        </div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-soft p-6 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="lg:col-span-2">
              <label className="form-label">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
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

            {/* Search and Sort */}
            <div className="space-y-4">
              <div>
                <label className="form-label">검색</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="제목, 설명, 태그 검색"
                    className="form-input pl-10"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-input text-sm"
                >
                  <option value="newest">최신순</option>
                  <option value="popular">인기순</option>
                  <option value="name">이름순</option>
                </select>
                
                <div className="flex gap-1">
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

        {/* Manual Display */}
        {!loading && (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {filteredManuals.map((manual, index) => (
                  <motion.div
                    key={manual.id}
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
                            <FileTypeIcon fileName={manual.file_name || manual.title} size="md" />
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getCategoryInfo(manual.category).icon}</span>
                              {isNew(manual.created_at) && (
                                <span className="badge badge-success animate-pulse">NEW</span>
                              )}
                              {isUpdated(manual.updated_at, manual.created_at) && (
                                <span className="badge badge-info">UPDATE</span>
                              )}
                            </div>
                          </div>
                          <h3 className="font-bold text-gray-900 line-clamp-2">{manual.title}</h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {manual.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-4">
                        {manual.version && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">버전</span>
                            <span className="font-medium text-gray-700">{manual.version}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">업데이트</span>
                          <span className="text-gray-700">
                            {new Date(manual.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">파일 크기</span>
                          <span className="text-gray-700">{formatFileSize(manual.file_size)}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-500">다운로드</span>
                          <DownloadStats downloads={manual.download_count} />
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {manual.tags && manual.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {manual.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {manual.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{manual.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownload(manual)}
                          className="btn-primary flex-1"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          다운로드
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-ghost"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        버전
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        크기
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
                    {filteredManuals.map((manual, index) => (
                      <motion.tr
                        key={manual.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <FileTypeIcon fileName={manual.file_name || manual.title} size="sm" />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{manual.title}</p>
                              {isNew(manual.created_at) && (
                                <span className="badge badge-success text-xs">NEW</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{manual.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {getCategoryInfo(manual.category).label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {manual.version || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {formatFileSize(manual.file_size)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DownloadStats downloads={manual.download_count} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDownload(manual)}
                            className="text-wee-main hover:text-wee-dark"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredManuals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 매뉴얼이 없습니다.'}
            </p>
          </motion.div>
        )}

        {/* Quick Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">빠른 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-wee-main rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">신규 상담사용</h3>
              <p className="text-sm text-gray-600 mb-4">
                처음 Wee 프로젝트에 참여하시는 분들을 위한 기본 매뉴얼
              </p>
              <button className="text-wee-main hover:text-wee-dark font-medium text-sm">
                바로가기 →
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-wee-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">위기대응 가이드</h3>
              <p className="text-sm text-gray-600 mb-4">
                긴급 상황 발생 시 신속한 대응을 위한 핵심 매뉴얼
              </p>
              <button className="text-wee-blue hover:text-blue-700 font-medium text-sm">
                바로가기 →
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-wee-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">프로그램 템플릿</h3>
              <p className="text-sm text-gray-600 mb-4">
                바로 활용 가능한 상담 프로그램 양식과 템플릿 모음
              </p>
              <button className="text-wee-green hover:text-green-700 font-medium text-sm">
                바로가기 →
              </button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Upload Modal */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchManuals();
          }}
          resourceType="manual"
        />
      </div>
    </div>
  );
};

export default ResourcesManual;