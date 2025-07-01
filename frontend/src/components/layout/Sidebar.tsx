import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      name: '대시보드',
      path: '/dashboard',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: '사업소개',
      path: '/about',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      children: [
        { name: '사업소개', path: '/about/intro', icon: null },
        { name: '추진체계', path: '/about/system', icon: null },
        { name: '사업연혁', path: '/about/history', icon: null },
        { name: '조직구성', path: '/about/organization', icon: null },
        { name: 'CI 안내', path: '/about/ci', icon: null },
      ]
    },
    {
      name: '기관찾기',
      path: '/institution',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: '자료실',
      path: '/resources',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: '뉴스레터',
      path: '/newsletter',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: '알림',
      path: '/notice',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      name: '커뮤니티',
      path: '/community',
      icon: (
        <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Wee</h1>
            <p className="text-xs text-gray-400">프로젝트 대시보드</p>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <div key={item.path}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className={`sidebar-nav-item w-full ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedItems.includes(item.path) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedItems.includes(item.path) && (
                  <div className="ml-8 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`sidebar-nav-item text-sm ${isActive(child.path) ? 'active' : ''}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer mt-auto p-4 border-t border-gray-700">
        {isAuthenticated ? (
          <Link to="/profile" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">내 프로필</span>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;