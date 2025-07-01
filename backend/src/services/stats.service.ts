import { supabaseAdmin } from '../config/supabase';
import noticeService from './notice.service';
import surveyService from './survey.service';
import resourceService from './resource.service';
import contactService from './contact.service';

interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    activeToday: number;
  };
  notices: {
    total: number;
    published: number;
    draft: number;
    viewsToday: number;
  };
  surveys: {
    total: number;
    active: number;
    completed: number;
    responsesToday: number;
  };
  resources: {
    total: number;
    totalSize: number;
    downloadsToday: number;
    popularCategories: Array<{ category: string; count: number }>;
  };
  contacts: {
    total: number;
    pending: number;
    avgResponseTime: number;
    todayCount: number;
  };
}

interface ActivityLog {
  id: string;
  type: 'user' | 'notice' | 'survey' | 'resource' | 'contact';
  action: string;
  description: string;
  user?: string;
  timestamp: string;
}

class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // User stats
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: newUsersThisMonth } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonth.toISOString());

    const { count: activeUsersToday } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', today.toISOString());

    // Notice stats
    const noticeStats = await noticeService.getNoticeStats();

    // Survey stats
    const surveyStats = await surveyService.getSurveyStats();
    const { count: responsesToday } = await supabaseAdmin
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Resource stats
    const resourceStats = await resourceService.getResourceStats();
    
    // Get downloads today
    const { data: downloadLogs } = await supabaseAdmin
      .from('files')
      .select('metadata')
      .gte('updated_at', today.toISOString());

    let downloadsToday = 0;
    downloadLogs?.forEach(log => {
      if (log.metadata?.last_download && new Date(log.metadata.last_download) >= today) {
        downloadsToday++;
      }
    });

    // Contact stats
    const contactStats = await contactService.getContactStats();
    const { count: contactsToday } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    return {
      users: {
        total: totalUsers || 0,
        newThisMonth: newUsersThisMonth || 0,
        activeToday: activeUsersToday || 0,
      },
      notices: {
        total: noticeStats.totalNotices,
        published: noticeStats.publishedNotices,
        draft: noticeStats.draftNotices,
        viewsToday: noticeStats.viewsToday || 0,
      },
      surveys: {
        total: surveyStats.totalSurveys,
        active: surveyStats.activeSurveys,
        completed: surveyStats.completedSurveys,
        responsesToday: responsesToday || 0,
      },
      resources: {
        total: resourceStats.totalResources,
        totalSize: 0, // Would need to calculate from file sizes
        downloadsToday,
        popularCategories: [],
      },
      contacts: {
        total: contactStats.totalContacts,
        pending: contactStats.statusStats.pending,
        avgResponseTime: contactStats.avgResponseTimeHours,
        todayCount: contactsToday || 0,
      },
    };
  }

  async getActivityLogs(limit: number = 20): Promise<ActivityLog[]> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const activities: ActivityLog[] = [];

    // Get recent notices
    const { data: recentNotices } = await supabaseAdmin
      .from('notices')
      .select('id, title, created_at, created_by')
      .order('created_at', { ascending: false })
      .limit(5);

    recentNotices?.forEach(notice => {
      activities.push({
        id: `notice-${notice.id}`,
        type: 'notice',
        action: 'created',
        description: `공지사항 "${notice.title}" 등록`,
        user: notice.created_by,
        timestamp: notice.created_at,
      });
    });

    // Get recent survey responses
    const { data: recentResponses } = await supabaseAdmin
      .from('survey_responses')
      .select('id, survey_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    recentResponses?.forEach(response => {
      activities.push({
        id: `response-${response.id}`,
        type: 'survey',
        action: 'responded',
        description: '설문조사 응답 제출',
        timestamp: response.created_at,
      });
    });

    // Get recent contacts
    const { data: recentContacts } = await supabaseAdmin
      .from('contacts')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    recentContacts?.forEach(contact => {
      activities.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        action: 'created',
        description: `문의 "${contact.title}" 접수`,
        timestamp: contact.created_at,
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return activities.slice(0, limit);
  }

  async getChartData(type: string, range: string = '7days') {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(endDate.getDate() - 6);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 29);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 89);
        break;
    }

    const data: { date: string; count: number }[] = [];

    switch (type) {
      case 'users':
        // Get user registrations by day
        const { data: users } = await supabaseAdmin
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        // Group by date
        const userCounts: Record<string, number> = {};
        users?.forEach(user => {
          const date = new Date(user.created_at).toISOString().split('T')[0];
          userCounts[date] = (userCounts[date] || 0) + 1;
        });

        // Fill in missing dates
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          data.push({
            date: dateStr,
            count: userCounts[dateStr] || 0,
          });
        }
        break;

      case 'pageviews':
        // This would require implementing page view tracking
        // For now, return mock data
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          data.push({
            date: d.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 100) + 50,
          });
        }
        break;

      case 'responses':
        // Get survey responses by day
        const { data: responses } = await supabaseAdmin
          .from('survey_responses')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        // Group by date
        const responseCounts: Record<string, number> = {};
        responses?.forEach(response => {
          const date = new Date(response.created_at).toISOString().split('T')[0];
          responseCounts[date] = (responseCounts[date] || 0) + 1;
        });

        // Fill in missing dates
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          data.push({
            date: dateStr,
            count: responseCounts[dateStr] || 0,
          });
        }
        break;
    }

    return data;
  }

  async getContentStats() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get content counts by type
    const { count: noticeCount } = await supabaseAdmin
      .from('notices')
      .select('*', { count: 'exact', head: true });

    const { count: surveyCount } = await supabaseAdmin
      .from('surveys')
      .select('*', { count: 'exact', head: true });

    const { count: resourceCount } = await supabaseAdmin
      .from('wee_resources')
      .select('*', { count: 'exact', head: true });

    const { count: contactCount } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    return {
      notices: noticeCount || 0,
      surveys: surveyCount || 0,
      resources: resourceCount || 0,
      contacts: contactCount || 0,
    };
  }

  async getUserGrowth(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'weekly':
        startDate.setDate(endDate.getDate() - 84); // 12 weeks
        break;
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 12);
        break;
    }

    const { data: users } = await supabaseAdmin
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    const growth: Array<{ period: string; count: number; total: number }> = [];
    let total = 0;

    if (period === 'daily') {
      const dailyCounts: Record<string, number> = {};
      users?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const count = dailyCounts[dateStr] || 0;
        total += count;
        growth.push({
          period: dateStr,
          count,
          total,
        });
      }
    }
    // Similar logic for weekly and monthly

    return growth;
  }
}

export default new StatsService();