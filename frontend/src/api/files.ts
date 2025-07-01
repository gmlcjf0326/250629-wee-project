import api from './client';

export interface FileUploadResult {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  bucket: string;
  path: string;
  publicUrl?: string;
}

export interface FileListItem {
  id: string;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  bucket: string;
  path: string;
  category?: string;
  public_url?: string;
  created_at: string;
  uploaded_by: string;
}

export const fileApi = {
  // Upload single file
  uploadFile: async (
    file: File,
    bucket: 'public' | 'resources' | 'notices' | 'private' = 'public',
    category?: string
  ): Promise<FileUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    if (category) {
      formData.append('category', category);
    }

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    bucket: 'public' | 'resources' | 'notices' | 'private' = 'public',
    category?: string
  ): Promise<FileUploadResult[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('bucket', bucket);
    if (category) {
      formData.append('category', category);
    }

    const response = await api.post('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get file URL
  getFileUrl: async (fileId: string, expiresIn?: number): Promise<string> => {
    const params = expiresIn ? `?expiresIn=${expiresIn}` : '';
    const response = await api.get(`/files/${fileId}/url${params}`);
    return response.data.data.url;
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },

  // List files
  listFiles: async (params?: {
    bucket?: string;
    category?: string;
    userId?: string;
  }): Promise<FileListItem[]> => {
    const queryParams = new URLSearchParams();
    if (params?.bucket) queryParams.append('bucket', params.bucket);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.userId) queryParams.append('userId', params.userId);

    const response = await api.get(`/files?${queryParams.toString()}`);
    return response.data.data;
  },
};