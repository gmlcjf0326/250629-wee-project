import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resourcesAPI, Resource } from '../../api/resources';
import FileUploadModal from '../../components/resources/FileUploadModal';
import FileTypeIcon from '../../components/resources/FileTypeIcon';
import DownloadStats from '../../components/resources/DownloadStats';
import { motion, AnimatePresence } from 'framer-motion';

const ResourcesProgram: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [programs, setPrograms] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('popular');

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'emotion', label: '정서·사회성' },
    { value: 'study', label: '학습·진로' },
    { value: 'prevention', label: '예방·교육' },
    { value: 'crisis', label: '위기개입' },
    { value: 'family', label: '가족상담' },
  ];

  const targets = [
    { value: 'all', label: '전체' },
    { value: 'elementary', label: '초등학생' },
    { value: 'middle', label: '중학생' },
    { value: 'high', label: '고등학생' },
    { value: 'parent', label: '학부모' },
  ];

  useEffect(() => {
    fetchPrograms();
  }, [selectedCategory, selectedTarget, sortBy]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const filters = {
        type: 'program',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        is_active: true
      };
      const response = await resourcesAPI.getResources(filters);
      
      // Filter by target if needed (this would ideally be done on backend)
      let filteredData = response.data || [];
      if (selectedTarget !== 'all') {
        filteredData = filteredData.filter((p: any) => 
          p.tags?.includes(selectedTarget) || p.metadata?.target === selectedTarget
        );
      }
      
      setPrograms(filteredData);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      // Use mock data for now if API fails
      setPrograms([
        {
          id: '1',
          title: '마음 튼튼 자존감 UP 프로그램',
          category: 'emotion',
          type: 'program',
          created_at: '2024-01-20',
          file_size: 25000000,
          download_count: 3421,
          description: '초등학생의 자존감 향상을 위한 체계적인 집단상담 프로그램입니다.',
          file_url: '/uploads/program1.zip',
          file_name: 'self-esteem-program.zip',
          tags: ['elementary', '정서', '자존감', '집단상담'],
          is_active: true,
          updated_at: '2024-01-20'
        },
        {
          id: '2',
          title: '진로 탐색 드림캐처',
          category: 'study',
          type: 'program',
          created_at: '2024-01-15',
          file_size: 18000000,
          download_count: 2156,
          description: '중학생의 진로 탐색과 목표 설정을 돕는 구조화된 프로그램입니다.',
          file_url: '/uploads/program2.zip',
          file_name: 'career-exploration.zip',
          tags: ['middle', '진로', '탐색'],
          is_active: true,
          updated_at: '2024-01-15'
        },
        {
          id: '3',
          title: '학교폭력 예방 어깨동무',
          category: 'prevention',
          type: 'program',
          created_at: '2023-12-10',
          file_size: 32000000,
          download_count: 4892,
          description: '또래관계 개선과 학교폭력 예방을 위한 참여형 프로그램입니다.',
          file_url: '/uploads/program3.zip',
          file_name: 'violence-prevention.zip',
          tags: ['elementary', '학교폭력', '예방'],
          is_active: true,
          updated_at: '2023-12-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchQuery === '' || 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDownload = async (program: Resource) => {
    try {
      const downloadData = await resourcesAPI.downloadResource(program.id);
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl || program.file_url;
      link.download = program.file_name || program.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local download count
      setPrograms(prev => prev.map(p => 
        p.id === program.id 
          ? { ...p, download_count: p.download_count + 1 }
          : p
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

  const getProgramMaterials = (program: Resource) => {
    // Extract materials from tags or metadata
    if (program.tags) {
      const materialTags = ['워크북', 'PPT', '활동지', '가이드', '자료'];
      return program.tags.filter(tag => 
        materialTags.some(mat => tag.includes(mat))
      ).slice(0, 4);
    }
    return [];
  };

  const getProgramInfo = (program: Resource) => {
    // Extract program info from metadata or use defaults
    const metadata = (program as any).metadata || {};
    return {
      sessions: metadata.sessions || 6,
      duration: metadata.duration || '50분',
      rating: metadata.rating || 4.5
    };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      emotion: 'from-pink-400 to-pink-600',
      study: 'from-blue-400 to-blue-600',
      prevention: 'from-green-400 to-green-600',
      crisis: 'from-red-400 to-red-600',
      family: 'from-purple-400 to-purple-600',
    };
    return colors[category] || 'from-gray-400 to-gray-600';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">프로그램 자료집</h1>
            <p className="text-lg text-gray-600">
              검증된 상담 프로그램과 교육 자료를 제공합니다
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
                새 프로그램 업로드
              </button>
            </motion.div>
          )}
        </div>

        {/* Filters */}
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
                  placeholder="프로그램명, 설명, 태그 검색"
                  className="form-input pl-10"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* Category and Sort */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="form-label">프로그램 유형</label>
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
                      {cat.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="form-label">정렬</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-input"
                >
                  <option value="popular">인기순</option>
                  <option value="newest">최신순</option>
                  <option value="name">이름순</option>
                </select>
              </div>
            </div>

            {/* Target Filter */}
            <div>
              <label className="form-label">대상</label>
              <div className="flex flex-wrap gap-2">
                {targets.map(target => (
                  <motion.button
                    key={target.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTarget(target.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedTarget === target.value
                        ? 'bg-wee-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {target.label}
                  </motion.button>
                ))}
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

        {/* Programs Grid */}
        {!loading && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {filteredPrograms.map((program, index) => {
                const programInfo = getProgramInfo(program);
                const materials = getProgramMaterials(program);
                const isPopular = program.download_count > 3000;
                
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${getCategoryColor(program.category)}`}></div>
                    
                    <div className="p-6">
                      {/* Title and Badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <FileTypeIcon fileName={program.file_name || 'program.zip'} size="md" />
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{program.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl">{getTargetIcon(program.tags?.[0] || 'all')}</span>
                                {isPopular && (
                                  <span className="badge badge-warning animate-pulse">인기</span>
                                )}
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="text-sm text-gray-600">{programInfo.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>

                      {/* Program Info */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">회기</p>
                          <p className="font-semibold text-gray-900">{programInfo.sessions}회</p>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">시간</p>
                          <p className="font-semibold text-gray-900">{programInfo.duration}</p>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">다운로드</p>
                          <DownloadStats downloads={program.download_count} />
                        </div>
                      </div>

                      {/* Materials */}
                      {materials.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">포함 자료</p>
                          <div className="flex flex-wrap gap-2">
                            {materials.map((material, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* File Info */}
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>파일 크기: {formatFileSize(program.file_size)}</span>
                        <span>업데이트: {new Date(program.updated_at).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownload(program)}
                          className="btn-primary flex-1"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          다운로드
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-secondary flex-1"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          미리보기
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredPrograms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 프로그램이 없습니다.'}
            </p>
          </motion.div>
        )}

        {/* Program Development Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">프로그램 개발 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 text-center cursor-pointer"
            >
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold text-gray-900 mb-1">기획</h4>
              <p className="text-xs text-gray-600">대상 분석 및 목표 설정</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 text-center cursor-pointer"
            >
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold text-gray-900 mb-1">개발</h4>
              <p className="text-xs text-gray-600">구조화 및 내용 구성</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 text-center cursor-pointer"
            >
              <div className="text-3xl mb-2">🧪</div>
              <h4 className="font-semibold text-gray-900 mb-1">시범운영</h4>
              <p className="text-xs text-gray-600">효과성 검증 및 수정</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 text-center cursor-pointer"
            >
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 mb-1">보급</h4>
              <p className="text-xs text-gray-600">매뉴얼화 및 확산</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Upload Modal */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchPrograms();
          }}
          resourceType="program"
        />
      </div>
    </div>
  );
};

export default ResourcesProgram;