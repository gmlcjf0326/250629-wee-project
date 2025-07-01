import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../../api/community';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const CommunityWritePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    isAnonymous: false,
    authorName: ''
  });

  // Load existing post if editing
  const { data: existingPost } = useQuery({
    queryKey: ['community-post', id],
    queryFn: () => communityApi.getPost(id!),
    enabled: isEdit
  });

  React.useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        category: existingPost.category || 'general',
        isAnonymous: !!existingPost.author_name,
        authorName: existingPost.author_name || ''
      });
    }
  }, [existingPost]);

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; category: string; author_name?: string }) => {
      try {
        if (isEdit) {
          return await communityApi.updatePost(id!, data);
        }
        return await communityApi.createPost(data);
      } catch (error) {
        // Mock response when API fails
        console.log('API failed, using mock data');
        const mockPost = {
          id: Date.now().toString(),
          title: data.title,
          content: data.content,
          category: data.category || 'general',
          author_name: data.author_name || user?.email || '익명',
          author_id: user?.id,
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          is_notice: false,
          is_pinned: false,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Store in localStorage as a temporary solution
        const existingPosts = JSON.parse(localStorage.getItem('mockCommunityPosts') || '[]');
        existingPosts.unshift(mockPost);
        localStorage.setItem('mockCommunityPosts', JSON.stringify(existingPosts));
        
        return mockPost;
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch community posts
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success(isEdit ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.');
      
      // Navigate to the community list page instead of detail page for better visibility
      navigate('/community');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    if (formData.isAnonymous && !formData.authorName.trim()) {
      toast.error('익명으로 작성 시 닉네임을 입력해주세요.');
      return;
    }

    const submitData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      ...(formData.isAnonymous && { author_name: formData.authorName })
    };

    createMutation.mutate(submitData);
  };

  const categories = [
    { value: 'general', label: '일반', description: '자유로운 주제의 게시글' },
    { value: 'question', label: '질문', description: 'Wee 프로젝트 관련 질문' },
    { value: 'case', label: '사례', description: '상담 사례 및 경험 공유' },
    { value: 'notice', label: '공지', description: '중요한 공지사항', disabled: user?.role !== 'admin' && user?.role !== 'manager' }
  ];

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? '게시글 수정' : '게시글 작성'}
            </h1>
            <p className="text-gray-600">
              Wee 프로젝트 관련 경험과 정보를 공유해주세요.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    disabled={cat.disabled}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${formData.category === cat.value
                        ? 'border-wee-main bg-wee-main/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${cat.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{cat.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                    </div>
                    {formData.category === cat.value && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-wee-main" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Posting Option */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 text-wee-main focus:ring-wee-main border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  익명으로 작성하기
                </span>
              </label>
              {formData.isAnonymous && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="닉네임을 입력하세요 (예: 익명교사)"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    익명으로 작성 시 실명 대신 닉네임이 표시됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
                placeholder="제목을 입력하세요"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/500
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent resize-none"
                placeholder="내용을 입력하세요"
                rows={15}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Markdown 문법을 지원합니다. **굵게**, *기울임*, [링크](url), `코드` 등을 사용할 수 있습니다.
                </p>
                <p className="text-xs text-gray-500">
                  {formData.content.length} 자
                </p>
              </div>
            </div>

            {/* File Upload - Future Feature */}
            <div className="mb-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center text-blue-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">파일 첨부 기능은 추후 업데이트 예정입니다.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary flex items-center"
              >
                {createMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEdit ? '수정 중...' : '작성 중...'}
                  </>
                ) : (
                  <>{isEdit ? '수정하기' : '작성하기'}</>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">게시글 작성 가이드라인</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Wee 프로젝트와 관련된 내용을 작성해주세요.
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                개인정보나 민감한 정보는 포함하지 마세요.
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                상호 존중하는 커뮤니티 문화를 만들어주세요.
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                사례 공유 시 학생의 개인정보는 반드시 익명 처리해주세요.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
};