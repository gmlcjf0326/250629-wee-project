import apiClient from './client';

// Project Info API
export const projectInfoApi = {
  getInfo: () => apiClient.get('/info'),
  updateInfo: (data: any) => apiClient.put('/info', data),
};

// Contact API
export const contactApi = {
  create: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => apiClient.post('/contact', data),
  getAll: (params?: { status?: string; page?: number; limit?: number }) => 
    apiClient.get('/contact', { params }),
  getById: (id: string) => apiClient.get(`/contact/${id}`),
  updateStatus: (id: string, status: string) => 
    apiClient.patch(`/contact/${id}/status`, { status }),
};

// Service API
export const serviceApi = {
  getAll: (params?: { category?: string; isActive?: boolean }) => 
    apiClient.get('/services', { params }),
  getById: (id: string) => apiClient.get(`/services/${id}`),
  create: (data: any) => apiClient.post('/services', data),
  update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),
  delete: (id: string) => apiClient.delete(`/services/${id}`),
};

// Notice API
export const noticeApi = {
  getAll: (params?: { type?: string; page?: number; limit?: number }) => 
    apiClient.get('/notices', { params }),
  getById: (id: string) => apiClient.get(`/notices/${id}`),
  create: (data: any) => apiClient.post('/notices', data),
  update: (id: string, data: any) => apiClient.put(`/notices/${id}`, data),
  delete: (id: string) => apiClient.delete(`/notices/${id}`),
};

// Resource API
export const resourceApi = {
  getAll: (params?: { type?: string; page?: number; limit?: number }) => 
    apiClient.get('/resources', { params }),
  getById: (id: string) => apiClient.get(`/resources/${id}`),
  upload: (formData: FormData) => 
    apiClient.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => apiClient.delete(`/resources/${id}`),
};