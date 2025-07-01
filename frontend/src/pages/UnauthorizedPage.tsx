import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleMessages = {
    default: {
      title: '접근 권한이 없습니다',
      message: '이 페이지에 접근할 수 있는 권한이 없습니다.',
      icon: '🔒'
    },
    admin: {
      title: '관리자 권한 필요',
      message: '이 페이지는 관리자만 접근할 수 있습니다.',
      icon: '👨‍💼'
    },
    login: {
      title: '로그인이 필요합니다',
      message: '이 페이지를 보려면 먼저 로그인해주세요.',
      icon: '🔑'
    }
  };

  const currentMessage = !user ? roleMessages.login : roleMessages.default;

  const quickActions = user ? [
    { path: '/dashboard', title: '대시보드', description: '내 활동 보기', icon: '📊' },
    { path: '/profile', title: '프로필', description: '계정 정보 관리', icon: '👤' },
    { path: '/contact', title: '문의하기', description: '권한 요청하기', icon: '📧' }
  ] : [
    { path: '/login', title: '로그인', description: '계정에 로그인', icon: '🔑' },
    { path: '/register', title: '회원가입', description: '새 계정 만들기', icon: '📝' },
    { path: '/contact', title: '문의하기', description: '도움 요청하기', icon: '📧' }
  ];

  return (
    <div className="page-wrapper min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="content-container py-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            {/* Icon */}
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">{currentMessage.icon}</span>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentMessage.title}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {currentMessage.message}
              </p>
              {user && (
                <p className="text-sm text-gray-500">
                  현재 권한: <span className="font-medium text-gray-700">{user.role === 'admin' ? '관리자' : '일반 사용자'}</span>
                </p>
              )}
            </motion.div>

            {/* Main Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center mb-12"
            >
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                이전 페이지
              </button>
              <Link 
                to="/" 
                className="px-6 py-3 bg-gradient-to-r from-wee-main to-wee-blue text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                홈으로 가기
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-center text-sm font-semibold text-gray-900 mb-6">빠른 작업</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.path}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      to={action.path}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <h4 className="font-medium text-gray-900 group-hover:text-wee-main transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {action.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200 text-center"
            >
              <p className="text-sm text-gray-500">
                권한이 필요하신가요?{' '}
                <Link to="/contact" className="text-wee-main hover:underline font-medium">
                  관리자에게 문의
                </Link>
                하거나{' '}
                <a href="tel:1588-7179" className="text-wee-main hover:underline font-medium">
                  1588-7179
                </a>
                로 전화주세요.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
};

export default UnauthorizedPage;