import api from './client';

export interface Contact {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  message: string;
  category: 'general' | 'counseling' | 'program' | 'support' | 'other';
  status?: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  replied_at?: string;
  reply_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactQuery {
  status?: string;
  category?: string;
  assigned_to?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface ContactStats {
  statusStats: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  categoryStats: Record<string, number>;
  recentContacts: Contact[];
  avgResponseTimeHours: number;
  totalContacts: number;
}

export const contactApi = {
  // Create new contact (public)
  createContact: async (contact: Omit<Contact, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/contact', contact);
    return response.data.data;
  },

  // Get all contacts (admin)
  getContacts: async (query?: ContactQuery) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/contact?${params.toString()}`);
    return response.data;
  },

  // Get single contact
  getContact: async (id: string) => {
    const response = await api.get(`/contact/${id}`);
    return response.data.data;
  },

  // Update contact
  updateContact: async (id: string, updates: { status?: string; assigned_to?: string }) => {
    const response = await api.put(`/contact/${id}`, updates);
    return response.data.data;
  },

  // Reply to contact
  replyToContact: async (id: string, message: string) => {
    const response = await api.post(`/contact/${id}/reply`, { message });
    return response.data.data;
  },

  // Assign contact to staff
  assignContact: async (id: string, userId: string) => {
    const response = await api.post(`/contact/${id}/assign`, { userId });
    return response.data.data;
  },

  // Delete contact
  deleteContact: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  // Get contact statistics
  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data.data;
  },
};