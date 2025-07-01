import api from './client';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author?: string;
  category: string;
  views?: number;
  posted_date?: string;
  created_at?: string;
  is_important?: boolean;
  attachments?: string[];
}

export interface NoticeQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'oldest' | 'views';
}

export interface NoticeResponse {
  notices: Notice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const noticeAPI = {
  // Get single notice by ID
  getNotice: async (id: string): Promise<Notice> => {
    const response = await api.get(`/notices/${id}`);
    return response.data.data;
  },
  // Get all notices with pagination and filters
  getNotices: async (query: NoticeQuery = {}): Promise<NoticeResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);
    if (query.sort) params.append('sort', query.sort);

    const response = await api.get(`/notices?${params.toString()}`);
    return response.data.data;
  },

  // Get single notice
  getNoticeById: async (id: string): Promise<Notice> => {
    const response = await api.get(`/notices/${id}`);
    return response.data.data;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/notices/categories');
    return response.data.data;
  },

  // Create notice (admin only)
  createNotice: async (notice: Omit<Notice, 'id'>): Promise<Notice> => {
    const response = await api.post('/notices', notice);
    return response.data.data;
  },

  // Update notice (admin only)
  updateNotice: async (id: string, notice: Partial<Notice>): Promise<Notice> => {
    const response = await api.put(`/notices/${id}`, notice);
    return response.data.data;
  },

  // Delete notice (admin only)
  deleteNotice: async (id: string): Promise<void> => {
    await api.delete(`/notices/${id}`);
  },

  // Delete multiple notices (admin only)
  deleteMultipleNotices: async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map(id => api.delete(`/notices/${id}`)));
  }
};

// Keep the old export name for backward compatibility
export const noticeApi = noticeAPI;