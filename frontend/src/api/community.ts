import api from './client';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  author_name?: string;
  author?: {
    id: string;
    email: string;
    full_name?: string;
  };
  category?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  is_pinned: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_id?: string;
  author_name?: string;
  author?: {
    id: string;
    email: string;
    full_name?: string;
  };
  content: string;
  like_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PostQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'comments';
  author_id?: string;
}

export interface PostsResponse {
  posts: CommunityPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface UserStats {
  postCount: number;
  commentCount: number;
  likedPosts: string[];
}

export const communityApi = {
  // Posts
  getPosts: async (query: PostQuery = {}): Promise<PostsResponse> => {
    // Always throw error to use mock data
    throw new Error('API not available - using mock data');
    
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const response = await api.get(`/community/posts?${params}`);
    return response.data.data;
  },

  getPost: async (id: string): Promise<CommunityPost> => {
    // Always throw error to use mock data
    throw new Error('API not available - using mock data');
    
    const response = await api.get(`/community/posts/${id}`);
    return response.data.data;
  },

  createPost: async (post: { title: string; content: string; category?: string; author_name?: string }): Promise<CommunityPost> => {
    // Always throw error to use mock data
    throw new Error('API not available - using mock data');
    
    const response = await api.post('/community/posts', post);
    return response.data.data;
  },

  updatePost: async (id: string, post: { title?: string; content?: string; category?: string; author_name?: string }): Promise<CommunityPost> => {
    const response = await api.put(`/community/posts/${id}`, post);
    return response.data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    // Always throw error to use mock data
    throw new Error('API not available - using mock data');
    
    await api.delete(`/community/posts/${id}`);
  },

  likePost: async (id: string): Promise<{ liked: boolean }> => {
    const response = await api.post(`/community/posts/${id}/like`);
    return response.data.data;
  },

  // Comments
  getComments: async (postId: string): Promise<CommunityComment[]> => {
    // Always throw error to use mock data
    throw new Error('API not available - using mock data');
    
    const response = await api.get(`/community/posts/${postId}/comments`);
    return response.data.data;
  },

  createComment: async (postId: string, content: string, parent_id?: string): Promise<CommunityComment> => {
    const response = await api.post(`/community/posts/${postId}/comments`, { content, parent_id });
    return response.data.data;
  },

  updateComment: async (id: string, content: string): Promise<CommunityComment> => {
    const response = await api.put(`/community/comments/${id}`, { content });
    return response.data.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/community/comments/${id}`);
  },

  // User stats
  getUserStats: async (userId?: string): Promise<UserStats> => {
    const url = userId ? `/community/users/${userId}/stats` : '/community/users/me/stats';
    const response = await api.get(url);
    return response.data.data;
  }
};