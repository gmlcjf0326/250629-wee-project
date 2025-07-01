import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const popularPages = [
    { path: '/about/intro', title: 'Wee 프로젝트 소개', icon: '📖' },
    { path: '/institution/guide', title: '기관 안내', icon: '🏢' },
    { path: '/resources/manual', title: '자료실', icon: '📚' },
    { path: '/survey', title: '설문조사', icon: '📊' },
    { path: '/newsletter', title: '뉴스레터', icon: '📰' },
    { path: '/community', title: '커뮤니티', icon: '💬' }
  ];

  return (
    <div className="page-wrapper">
      <div className="content-container min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-wee-light to-blue-100 rounded-full">
              <span className="text-6xl">🔍</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-8xl font-bold bg-gradient-to-r from-wee-main to-wee-blue bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            아래 인기 페이지를 방문해보시거나 홈으로 돌아가세요.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center mb-12"
        >
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            이전 페이지
          </button>
          <Link to="/" className="btn-primary">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            홈으로 돌아가기
          </Link>
        </motion.div>

        {/* Popular Pages */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">인기 페이지</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularPages.map((page, index) => (
              <motion.div
                key={page.path}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={page.path}
                  className="block p-4 bg-white rounded-xl shadow-soft hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{page.icon}</div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-wee-main transition-colors">
                    {page.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-gray-500"
        >
          계속해서 문제가 발생한다면{' '}
          <Link to="/contact" className="text-wee-main hover:underline">
            문의하기
          </Link>
          를 통해 알려주세요.
        </motion.p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;