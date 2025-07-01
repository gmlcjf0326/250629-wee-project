import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { name: '사업소개', path: '/about/intro' },
      { name: '추진체계', path: '/about/system' },
      { name: '사업연혁', path: '/about/history' },
      { name: '조직구성', path: '/about/organization' },
    ],
    services: [
      { name: '이용안내', path: '/institution/guide' },
      { name: '기관찾기', path: '/institution' },
      { name: '자주 묻는 질문', path: '/institution/faq' },
      { name: '설문조사', path: '/notice/survey' },
    ],
    resources: [
      { name: '매뉴얼', path: '/resources/manual' },
      { name: '프로그램 자료실', path: '/resources/program' },
      { name: '우수사례집', path: '/resources/cases' },
      { name: '뉴스레터', path: '/newsletter' },
    ],
    etc: [
      { name: '공지사항', path: '/notice/announcement' },
      { name: '이용약관', path: '/terms' },
      { name: '개인정보처리방침', path: '/privacy' },
      { name: '사이트맵', path: '/sitemap' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      {/* Main Footer */}
      <div className="content-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-wee-main to-wee-blue rounded-xl flex items-center justify-center mr-3 shadow-md">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wee-main to-wee-blue">Wee</span>
                <span className="text-xl font-light text-gray-700 ml-1">프로젝트</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We + Education + Emotion<br />
              학생들의 건강하고 즐거운<br />
              학교생활을 지원합니다.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 bg-gray-200 hover:bg-wee-main hover:text-white rounded-lg flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 bg-gray-200 hover:bg-wee-main hover:text-white rounded-lg flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" 
                className="w-8 h-8 bg-gray-200 hover:bg-wee-main hover:text-white rounded-lg flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">사업소개</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-600 hover:text-wee-main transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-600 hover:text-wee-main transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">자료실</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-600 hover:text-wee-main transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">기타</h3>
            <ul className="space-y-2">
              {footerLinks.etc.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-600 hover:text-wee-main transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900 mb-2">한국청소년정책연구원</p>
              <p>주소: 세종특별자치시 시청대로 370 세종국책연구단지 사회정책동</p>
              <p>전화: 044-415-2114 | 팩스: 044-415-2369</p>
            </div>
            <div className="text-sm text-gray-600 md:text-right">
              <p className="font-semibold text-gray-900 mb-2">고객센터</p>
              <p className="text-2xl font-bold text-wee-main mb-1">1644-6367</p>
              <p>평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 text-white py-4">
        <div className="content-wide">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © {currentYear} Wee 프로젝트. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a href="https://www.nypi.re.kr" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors">
                한국청소년정책연구원
              </a>
              <span className="text-gray-600">|</span>
              <a href="https://www.moe.go.kr" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors">
                교육부
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;