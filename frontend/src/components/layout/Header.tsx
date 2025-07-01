import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      name: '사업소개',
      path: '/about',
      children: [
        { name: '사업소개', path: '/about/intro' },
        { name: '추진체계', path: '/about/system' },
        { name: '사업연혁', path: '/about/history' },
        { name: '조직구성', path: '/about/organization' },
        { name: 'CI 안내', path: '/about/ci' },
      ]
    },
    {
      name: '기관찾기',
      path: '/institution',
      children: [
        { name: '이용안내', path: '/institution/guide' },
        { name: '지도 찾기', path: '/institution/map' },
      ]
    },
    {
      name: '자료실',
      path: '/resources',
      children: [
        { name: '매뉴얼', path: '/resources/manual' },
        { name: '프로그램 자료실', path: '/resources/program' },
        { name: '우수사례집', path: '/resources/cases' },
      ]
    },
    {
      name: '뉴스레터',
      path: '/newsletter',
    },
    {
      name: '알림',
      path: '/notice',
      children: [
        { name: '공지사항', path: '/notice/announcement' },
        { name: '설문조사', path: '/notice/survey' },
      ]
    },
    {
      name: '커뮤니티',
      path: '/community',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [userMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-soft">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-wee-main to-wee-blue text-white py-2">
        <div className="content-wide">
          <div className="flex justify-end items-center text-sm space-x-4">
            <span>한국청소년정책연구원</span>
            <span>|</span>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center hover:text-gray-200"
                >
                  <span>{user?.fullName || user?.email}</span>
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 animate-slide-down">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-wee-light hover:text-wee-main transition-all duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      내 프로필
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-wee-light hover:text-wee-main transition-all duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      대시보드
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-gray-200">로그인</Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="content-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-wee-main to-wee-blue rounded-2xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wee-main to-wee-blue">Wee</span>
                <span className="text-2xl font-light text-gray-700 ml-1">프로젝트</span>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">We + Education + Emotion</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`nav-link flex items-center ${location.pathname === '/dashboard' ? 'nav-link-active' : ''}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              대시보드
            </Link>
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                >
                  {item.name}
                </Link>
                
                {/* Dropdown */}
                {item.children && openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 animate-slide-down">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-wee-light hover:text-wee-main transition-all duration-200"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-wee-light text-gray-700 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/dashboard"
              className={`block py-2 px-3 text-base font-medium ${
                location.pathname === '/dashboard'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:bg-gray-50'
              } mb-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              대시보드
            </Link>
            {navItems.map((item) => (
              <div key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`block py-2 px-3 text-base font-medium ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block py-1 px-3 text-sm text-gray-600 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {user?.fullName || user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    내 프로필
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="block w-full text-left py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;