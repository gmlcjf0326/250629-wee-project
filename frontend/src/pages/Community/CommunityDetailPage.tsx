import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi, CommunityComment } from '../../api/community';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Fetch post
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['community-post', id],
    queryFn: async () => {
      try {
        return await communityApi.getPost(id!);
      } catch (error) {
        // Use mock data from localStorage when API fails
        const mockPosts = JSON.parse(localStorage.getItem('mockCommunityPosts') || '[]');
        const foundPost = mockPosts.find((p: any) => p.id === id);
        
        if (foundPost) {
          return foundPost;
        }
        
        // Return a default post if not found
        throw new Error('Post not found');
      }
    },
    enabled: !!id,
    retry: false
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['community-comments', id],
    queryFn: async () => {
      try {
        return await communityApi.getComments(id!);
      } catch (error) {
        // Return empty array for comments when API fails
        return [];
      }
    },
    enabled: !!id,
    retry: false
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: () => communityApi.likePost(id!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['community-post', id] });
      toast.success(data.liked ? '추천했습니다.' : '추천을 취소했습니다.');
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      try {
        return await communityApi.deletePost(id!);
      } catch (error) {
        // Handle deletion in localStorage
        const mockPosts = JSON.parse(localStorage.getItem('mockCommunityPosts') || '[]');
        const updatedPosts = mockPosts.filter((p: any) => p.id !== id);
        localStorage.setItem('mockCommunityPosts', JSON.stringify(updatedPosts));
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('게시글이 삭제되었습니다.');
      navigate('/community');
    }
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: ({ content, parent_id }: { content: string; parent_id?: string }) => 
      communityApi.createComment(id!, content, parent_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['community-post', id] });
      setComment('');
      setReplyContent('');
      setReplyingTo(null);
      toast.success('댓글이 작성되었습니다.');
    }
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      communityApi.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', id] });
      setEditingComment(null);
      toast.success('댓글이 수정되었습니다.');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => communityApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['community-post', id] });
      toast.success('댓글이 삭제되었습니다.');
    }
  });

  if (postLoading || !post) {
    return (
      <div className="page-wrapper">
        <div className="content-wide">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-500">게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;
  const authorName = post.author_name || post.author?.full_name || post.author?.email || 'Anonymous';

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
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeletePost = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate();
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('댓글을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate({ content: comment });
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error('답글을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate({ content: replyContent, parent_id: parentId });
  };

  const handleUpdateComment = () => {
    if (!editingComment || !editingComment.content.trim()) {
      toast.error('댓글을 입력해주세요.');
      return;
    }
    updateCommentMutation.mutate({
      commentId: editingComment.id,
      content: editingComment.content
    });
  };

  const renderComment = (comment: CommunityComment, depth: number = 0) => {
    const replies = comments.filter(c => c.parent_id === comment.id);
    const isCommentAuthor = user?.id === comment.author_id;
    const commentAuthorName = comment.author_name || comment.author?.full_name || comment.author?.email || 'Anonymous';

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-12' : ''}`}>
        <div className="border-b border-gray-100 py-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-gray-900">{commentAuthorName}</span>
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(comment.created_at)}
              </span>
            </div>
            {isCommentAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
                      deleteCommentMutation.mutate(comment.id);
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          
          {editingComment?.id === comment.id ? (
            <div className="mt-2">
              <textarea
                value={editingComment.content}
                onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent resize-none"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleUpdateComment}
                  className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-main/90"
                >
                  수정하기
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              {user && depth === 0 && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="mt-2 text-sm text-wee-main hover:text-wee-main/80"
                >
                  답글 쓰기
                </button>
              )}
            </>
          )}
          
          {replyingTo === comment.id && (
            <div className="mt-4 ml-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent resize-none"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-main/90"
                >
                  답글 작성
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
        
        {replies.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link to="/community" className="text-gray-500 hover:text-gray-700">
              자유게시판
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          {/* Post Content */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${getCategoryBadge(post.category || 'general').class}`}>
                  {getCategoryBadge(post.category || 'general').text}
                </span>
                {post.is_pinned && (
                  <span className="badge bg-yellow-100 text-yellow-700">
                    고정됨
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{authorName}</span>
                  <span>{formatDate(post.created_at)}</span>
                  <span>조회 {post.view_count}</span>
                </div>
                
                {isAuthor && (
                  <div className="flex gap-2">
                    <Link
                      to={`/community/${post.id}/edit`}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      수정
                    </Link>
                    <button
                      onClick={handleDeletePost}
                      className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
              
              {/* Like Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => user ? likeMutation.mutate() : toast.error('로그인이 필요합니다.')}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
                    ${user ? 'hover:scale-105' : 'cursor-not-allowed opacity-70'}
                    border-2 border-wee-main text-wee-main hover:bg-wee-main hover:text-white
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  추천 {post.like_count}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              댓글 {post.comment_count}개
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={createCommentMutation.isPending}
                    className="btn-primary"
                  >
                    댓글 작성
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
                <Link to="/login" className="text-wee-main hover:underline">
                  로그인하기
                </Link>
              </div>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </p>
            ) : (
              <div>
                {comments
                  .filter(c => !c.parent_id)
                  .map(comment => renderComment(comment))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
};