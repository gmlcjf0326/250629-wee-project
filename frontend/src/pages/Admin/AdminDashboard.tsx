import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: '전체 사용자',
      value: '1,234',
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: '공지사항',
      value: '56',
      change: '+3',
      color: 'from-green-500 to-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      title: '설문조사',
      value: '12',
      change: '진행중 3개',
      color: 'from-purple-500 to-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: '자료실',
      value: '89',
      change: '342MB',
      color: 'from-orange-500 to-orange-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const recentActivities = [
    { type: 'user', message: '새로운 사용자가 가입했습니다.', time: '5분 전' },
    { type: 'notice', message: '공지사항이 등록되었습니다.', time: '1시간 전' },
    { type: 'survey', message: '설문조사가 완료되었습니다.', time: '2시간 전' },
    { type: 'file', message: '새로운 파일이 업로드되었습니다.', time: '3시간 전' },
  ];

  const quickLinks = [
    { title: '공지사항 작성', path: '/admin/notices/new', icon: '📝' },
    { title: '설문조사 생성', path: '/admin/surveys/new', icon: '📊' },
    { title: '사용자 관리', path: '/admin/users', icon: '👥' },
    { title: '자료 업로드', path: '/admin/resources/new', icon: '📁' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-wee-main rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;