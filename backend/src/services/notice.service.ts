import { supabaseAdmin } from '../config/supabase';

export interface Notice {
  id?: string;
  title: string;
  content: string;
  author?: string;
  posted_date?: string;
  views?: number;
  attachments?: string[];
  category: string;
  is_important?: boolean;
}

export interface NoticeQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'oldest' | 'views';
}

class NoticeService {
  async getNotices(query: NoticeQuery) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('wee_announcements')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.category) {
      dbQuery = dbQuery.eq('category', query.category);
    }

    if (query.search) {
      dbQuery = dbQuery.or(`title.ilike.%${query.search}%,content.ilike.%${query.search}%`);
    }

    // Apply sorting
    switch (query.sort) {
      case 'oldest':
        dbQuery = dbQuery.order('posted_date', { ascending: true });
        break;
      case 'views':
        dbQuery = dbQuery.order('views', { ascending: false });
        break;
      case 'latest':
      default:
        dbQuery = dbQuery.order('posted_date', { ascending: false });
        break;
    }

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return {
      notices: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getNoticeById(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('wee_announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Increment view count
    await this.incrementViews(id);

    return data;
  }

  async createNotice(notice: Notice, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const newNotice = {
      ...notice,
      posted_date: new Date().toISOString(),
      views: 0,
      source_url: 'admin',
      scraped_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('wee_announcements')
      .insert(newNotice)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateNotice(id: string, notice: Partial<Notice>) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('wee_announcements')
      .update({
        ...notice,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteNotice(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { error } = await supabaseAdmin
      .from('wee_announcements')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async incrementViews(id: string) {
    if (!supabaseAdmin) {
      return;
    }

    try {
      await supabaseAdmin.rpc('increment', {
        table_name: 'wee_announcements',
        row_id: id,
        column_name: 'views'
      });
    } catch (error) {
      // Fallback if RPC doesn't exist
      const { data } = await supabaseAdmin
        .from('wee_announcements')
        .select('views')
        .eq('id', id)
        .single();

      if (data) {
        await supabaseAdmin
          .from('wee_announcements')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }
    }
  }

  async getCategories() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('wee_announcements')
      .select('category')
      .order('category');

    if (error) {
      throw error;
    }

    const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
    return uniqueCategories;
  }

  async getNoticeStats() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { count: totalNotices } = await supabaseAdmin
      .from('wee_announcements')
      .select('*', { count: 'exact', head: true });

    const { count: publishedNotices } = await supabaseAdmin
      .from('wee_announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    const { count: draftNotices } = await supabaseAdmin
      .from('wee_announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', false);

    // Get views today - this would require tracking views by date
    // For now, return 0
    const viewsToday = 0;

    return {
      totalNotices: totalNotices || 0,
      publishedNotices: publishedNotices || 0,
      draftNotices: draftNotices || 0,
      viewsToday
    };
  }
}

export default new NoticeService();