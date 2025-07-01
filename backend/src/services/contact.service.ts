import { supabaseAdmin } from '../config/supabase';

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
  ip_address?: string;
  user_agent?: string;
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

class ContactService {
  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'status'>) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const newContact = {
      ...contact,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert(newContact)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send notification email to admin
    // This would be implemented with an email service
    
    return data;
  }

  async getContacts(query: ContactQuery) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const {
      status,
      category,
      assigned_to,
      search,
      from_date,
      to_date,
      page = 1,
      limit = 20
    } = query;

    let dbQuery = supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    if (assigned_to) {
      dbQuery = dbQuery.eq('assigned_to', assigned_to);
    }

    if (search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,title.ilike.%${search}%,message.ilike.%${search}%`
      );
    }

    if (from_date) {
      dbQuery = dbQuery.gte('created_at', from_date);
    }

    if (to_date) {
      dbQuery = dbQuery.lte('created_at', to_date);
    }

    // Order by created date
    dbQuery = dbQuery.order('created_at', { ascending: false });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    dbQuery = dbQuery.range(startIndex, startIndex + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return {
      contacts: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getContactById(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateContact(id: string, updates: Partial<Contact>) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async replyToContact(id: string, reply: { message: string; userId: string }) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const updateData = {
      reply_message: reply.message,
      replied_at: new Date().toISOString(),
      status: 'completed' as const,
      assigned_to: reply.userId,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send reply email to the contact
    // This would be implemented with an email service

    return data;
  }

  async deleteContact(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { error } = await supabaseAdmin
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async getContactStats() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get total contacts by status
    const { data: statusCounts } = await supabaseAdmin
      .from('contacts')
      .select('status')
      .order('status');

    const statusStats = {
      pending: 0,
      in_progress: 0,
      completed: 0
    };

    statusCounts?.forEach(contact => {
      if (contact.status && contact.status in statusStats) {
        statusStats[contact.status as keyof typeof statusStats]++;
      }
    });

    // Get contacts by category
    const { data: categoryCounts } = await supabaseAdmin
      .from('contacts')
      .select('category')
      .order('category');

    const categoryStats: Record<string, number> = {};
    categoryCounts?.forEach(contact => {
      if (contact.category) {
        categoryStats[contact.category] = (categoryStats[contact.category] || 0) + 1;
      }
    });

    // Get recent contacts
    const { data: recentContacts } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get response time stats
    const { data: completedContacts } = await supabaseAdmin
      .from('contacts')
      .select('created_at, replied_at')
      .eq('status', 'completed')
      .not('replied_at', 'is', null);

    let totalResponseTime = 0;
    let responseCount = 0;

    completedContacts?.forEach(contact => {
      if (contact.created_at && contact.replied_at) {
        const created = new Date(contact.created_at).getTime();
        const replied = new Date(contact.replied_at).getTime();
        totalResponseTime += replied - created;
        responseCount++;
      }
    });

    const avgResponseTime = responseCount > 0 
      ? Math.round(totalResponseTime / responseCount / (1000 * 60 * 60)) // in hours
      : 0;

    return {
      statusStats,
      categoryStats,
      recentContacts: recentContacts || [],
      avgResponseTimeHours: avgResponseTime,
      totalContacts: statusCounts?.length || 0
    };
  }

  async assignContact(id: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const updateData = {
      assigned_to: userId,
      status: 'in_progress' as const,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

export default new ContactService();