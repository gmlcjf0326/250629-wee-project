import { supabaseAdmin } from '../config/supabase';

export interface Newsletter {
  id?: string;
  title: string;
  issue: string;
  date: string;
  cover_image?: string;
  highlights?: string[];
  file_url?: string;
  file_size?: number;
  downloads?: number;
  is_latest?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterQuery {
  year?: string;
  limit?: number;
  page?: number;
  sort?: 'date' | 'downloads';
}

class NewsletterService {
  // Mock data for when database is not configured
  private getMockNewsletters(): Newsletter[] {
    return [
      {
        id: '1',
        title: '2024년 3월 뉴스레터',
        issue: '제89호',
        date: '2024-03-01',
        cover_image: '/images/newsletter-cover.jpg',
        highlights: [
          '청소년 상담 프로그램 개선 사항',
          '새로운 상담사 교육 과정 안내',
          '우수 상담 사례 공유'
        ],
        file_url: '/files/newsletter-89.pdf',
        file_size: 2500000,
        downloads: 150,
        is_latest: true,
        created_at: '2024-03-01T00:00:00Z',
        updated_at: '2024-03-01T00:00:00Z'
      },
      {
        id: '2',
        title: '2024년 2월 뉴스레터',
        issue: '제88호',
        date: '2024-02-01',
        cover_image: '/images/newsletter-cover.jpg',
        highlights: [
          '겨울방학 특별 프로그램 결과',
          '상담사 연수 후기',
          '2024년 주요 일정 안내'
        ],
        file_url: '/files/newsletter-88.pdf',
        file_size: 2300000,
        downloads: 200,
        is_latest: false,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
      }
    ];
  }

  async getNewsletters(query: NewsletterQuery = {}) {
    if (!supabaseAdmin) {
      console.warn('Supabase Admin client is not configured. Returning mock data.');
      const mockData = this.getMockNewsletters();
      const { limit = 20, page = 1 } = query;
      const startIndex = (page - 1) * limit;
      const paginatedData = mockData.slice(startIndex, startIndex + limit);
      
      return {
        newsletters: paginatedData,
        total: mockData.length,
        page,
        limit,
        totalPages: Math.ceil(mockData.length / limit)
      };
    }

    const { year, limit = 20, page = 1, sort = 'date' } = query;

    let dbQuery = supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact' });

    // Apply year filter
    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      dbQuery = dbQuery.gte('date', startDate).lte('date', endDate);
    }

    // Apply sorting
    if (sort === 'downloads') {
      dbQuery = dbQuery.order('downloads', { ascending: false });
    } else {
      dbQuery = dbQuery.order('date', { ascending: false });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    dbQuery = dbQuery.range(startIndex, startIndex + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return {
      newsletters: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getNewsletterById(id: string) {
    if (!supabaseAdmin) {
      console.warn('Supabase Admin client is not configured. Returning mock data.');
      const mockData = this.getMockNewsletters();
      return mockData.find(n => n.id === id) || null;
    }

    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getLatestNewsletter() {
    if (!supabaseAdmin) {
      console.warn('Supabase Admin client is not configured. Returning mock data.');
      const mockData = this.getMockNewsletters();
      return mockData.find(n => n.is_latest) || mockData[0] || null;
    }

    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('is_latest', true)
      .single();

    if (error) {
      // If no latest marked, get the most recent by date
      const { data: recent, error: recentError } = await supabaseAdmin
        .from('newsletters')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (recentError) {
        throw recentError;
      }

      return recent;
    }

    return data;
  }

  async incrementDownloadCount(id: string) {
    if (!supabaseAdmin) {
      console.warn('Supabase Admin client is not configured. Skipping download count increment.');
      return;
    }

    // Get current count
    const { data: newsletter } = await supabaseAdmin
      .from('newsletters')
      .select('downloads')
      .eq('id', id)
      .single();

    if (newsletter) {
      await supabaseAdmin
        .from('newsletters')
        .update({
          downloads: (newsletter.downloads || 0) + 1
        })
        .eq('id', id);
    }
  }

  async createNewsletter(newsletter: Newsletter) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // If marking as latest, unmark all others
    if (newsletter.is_latest) {
      await supabaseAdmin
        .from('newsletters')
        .update({ is_latest: false })
        .eq('is_latest', true);
    }

    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .insert(newsletter)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateNewsletter(id: string, updates: Partial<Newsletter>) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // If marking as latest, unmark all others
    if (updates.is_latest) {
      await supabaseAdmin
        .from('newsletters')
        .update({ is_latest: false })
        .eq('is_latest', true);
    }

    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .update({
        ...updates,
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

  async deleteNewsletter(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { error } = await supabaseAdmin
      .from('newsletters')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async getNewsletterStats() {
    if (!supabaseAdmin) {
      console.warn('Supabase Admin client is not configured. Returning mock stats.');
      const mockData = this.getMockNewsletters();
      const totalDownloads = mockData.reduce((sum, n) => sum + (n.downloads || 0), 0);
      const currentYear = new Date().getFullYear();
      const currentYearCount = mockData.filter(n => n.date.startsWith(String(currentYear))).length;
      const mostDownloaded = mockData.reduce((max, n) => 
        (n.downloads || 0) > (max.downloads || 0) ? n : max, mockData[0]);
      
      return {
        totalNewsletters: mockData.length,
        totalDownloads,
        currentYearCount,
        mostDownloaded
      };
    }

    const currentYear = new Date().getFullYear();
    
    // Get total downloads
    const { data: newsletters } = await supabaseAdmin
      .from('newsletters')
      .select('downloads');

    const totalDownloads = newsletters?.reduce(
      (sum, n) => sum + (n.downloads || 0), 
      0
    ) || 0;

    // Get current year count
    const { count: currentYearCount } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    // Get most downloaded
    const { data: mostDownloaded } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .order('downloads', { ascending: false })
      .limit(1)
      .single();

    return {
      totalNewsletters: newsletters?.length || 0,
      totalDownloads,
      currentYearCount: currentYearCount || 0,
      mostDownloaded
    };
  }
}

export default new NewsletterService();