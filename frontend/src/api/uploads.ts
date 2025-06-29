import apiClient from './client';

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  localUrl: string;
  supabaseUrl?: string;
}

export const uploadAPI = {
  // Upload single file
  uploadSingle: async (
    file: File,
    options?: {
      entityType?: string;
      entityId?: string;
      uploadedBy?: string;
      isPublic?: boolean;
      metadata?: any;
    }
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await apiClient.post('/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    options?: {
      entityType?: string;
      entityId?: string;
      uploadedBy?: string;
      isPublic?: boolean;
    }
  ): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await apiClient.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete file
  deleteFile: async (id: string): Promise<void> => {
    await apiClient.delete(`/uploads/${id}`);
  },

  // Get download URL
  getDownloadUrl: (filename: string): string => {
    return `${apiClient.defaults.baseURL}/uploads/download/${filename}`;
  }
};