import apiClient from './client';

export interface DashboardStats {
  totalCenters: number;
  totalConsultations: number;
  totalStudents: number;
  satisfactionRate: number;
  monthlyTrend: {
    labels: string[];
    consultations: number[];
    students: number[];
  };
  serviceDistribution: {
    label: string;
    value: number;
  }[];
  regionDistribution: {
    region: string;
    centers: number;
    consultations: number;
  }[];
}

export const statsAPI = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/stats/dashboard');
    return response.data.data;
  },

  // Get service statistics
  getServiceStats: async (serviceId?: string) => {
    const response = await apiClient.get('/stats/services', {
      params: { serviceId }
    });
    return response.data.data;
  },

  // Get consultation statistics
  getConsultationStats: async (params?: {
    startDate?: string;
    endDate?: string;
    region?: string;
    serviceType?: string;
  }) => {
    const response = await apiClient.get('/stats/consultations', { params });
    return response.data.data;
  },

  // Get survey statistics
  getSurveyStats: async (surveyId?: string) => {
    const response = await apiClient.get('/stats/surveys', {
      params: { surveyId }
    });
    return response.data.data;
  },

  // Export statistics data
  exportStats: async (type: 'dashboard' | 'consultations' | 'services', format: 'csv' | 'excel' = 'csv') => {
    const response = await apiClient.get(`/stats/export`, {
      params: { type, format },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wee-stats-${type}-${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};