import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';

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

const AdminDashboard: React.FC = () => {
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<{ data: DashboardStats }>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/stats/dashboard');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch activity logs
  const { data: activityLogs } = useQuery<{ data: ActivityLog[] }>({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const response = await api.get('/stats/activities?limit=10');
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const stats = dashboardStats?.data;

  const statCards = [
    {
      title: '전체 사용자',
      value: stats?.users.total || 0,
      change: `신규 ${stats?.users.newThisMonth || 0}명`,
      subtext: `오늘 활동 ${stats?.users.activeToday || 0}명`,
      color: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: '공지사항',
      value: stats?.notices.total || 0,
      change: `게시 ${stats?.notices.published || 0}개`,
      subtext: `오늘 조회 ${stats?.notices.viewsToday || 0}회`,
      color: 'from-green-500 to-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      title: '설문조사',
      value: stats?.surveys.total || 0,
      change: `진행중 ${stats?.surveys.active || 0}개`,
      subtext: `오늘 응답 ${stats?.surveys.responsesToday || 0}건`,
      color: 'from-purple-500 to-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: '문의사항',
      value: stats?.contacts.total || 0,
      change: `대기 ${stats?.contacts.pending || 0}건`,
      subtext: `오늘 접수 ${stats?.contacts.todayCount || 0}건`,
      color: 'from-orange-500 to-orange-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { title: '공지사항 작성', path: '/admin/notices/new', icon: '📝' },
    { title: '설문조사 생성', path: '/admin/surveys/new', icon: '📊' },
    { title: '문의 관리', path: '/admin/contacts', icon: '📧' },
    { title: '자료 업로드', path: '/admin/resources', icon: '📁' },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return time.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return '👤';
      case 'notice':
        return '📢';
      case 'survey':
        return '📊';
      case 'resource':
        return '📁';
      case 'contact':
        return '📧';
      default:
        return '📌';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">{link.icon}</div>
                  <p className="text-sm text-gray-700">{link.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activityLogs?.data?.length ? (
                activityLogs.data.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-gray-700">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        {activity.user && (
                          <p className="text-xs text-gray-500">• {activity.user}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">활동 내역이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;