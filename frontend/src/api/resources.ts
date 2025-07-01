import apiClient from './client';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'manual' | 'program' | 'case';
  file_url?: string;
  file_size?: number;
  download_count?: number;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  uploaded_by?: string;
  version?: string;
  file_name?: string;
  mime_type?: string;
}

export interface CreateResourceDto {
  title: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  version?: string;
  file?: File;
}

export interface UpdateResourceDto {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  version?: string;
  is_active?: boolean;
}

export interface ResourceFilters {
  category?: string;
  type?: string;
  search?: string;
  tags?: string[];
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'popular' | 'name';
}

export interface ResourceStats {
  totalDownloads: number;
  totalResources: number;
  popularResources: Resource[];
  recentResources: Resource[];
}

export const resourcesAPI = {
  // Get all resources with filters
  getResources: async (filters?: ResourceFilters) => {
    const response = await apiClient.get('/resources', { params: filters });
    return response.data;
  },

  // Get single resource
  getResource: async (id: string) => {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data.data;
  },

  // Create new resource (with file upload)
  createResource: async (data: CreateResourceDto) => {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'file' && value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add file if provided
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await apiClient.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update resource
  updateResource: async (id: string, data: UpdateResourceDto) => {
    const response = await apiClient.put(`/resources/${id}`, data);
    return response.data.data;
  },

  // Delete resource
  deleteResource: async (id: string) => {
    await apiClient.delete(`/resources/${id}`);
  },

  // Download resource (increment download count)
  downloadResource: async (id: string) => {
    const response = await apiClient.get(`/resources/${id}/download`);
    return response.data.data;
  },

  // Get resource statistics
  getResourceStats: async () => {
    const response = await apiClient.get('/resources/stats');
    return response.data.data;
  },

  // Get download history for a resource
  getDownloadHistory: async (id: string) => {
    const response = await apiClient.get(`/resources/${id}/downloads`);
    return response.data.data;
  },

  // Search resources
  searchResources: async (query: string) => {
    const response = await apiClient.get('/resources/search', {
      params: { q: query }
    });
    return response.data.data;
  },

  // Get resource categories
  getCategories: async (type?: string) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/resources/categories', { params });
    return response.data.data;
  }
};