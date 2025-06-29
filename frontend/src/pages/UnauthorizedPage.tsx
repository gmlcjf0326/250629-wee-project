import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            접근 권한이 없습니다
          </h1>
          
          <p className="text-gray-600 mb-8">
            이 페이지에 접근할 수 있는 권한이 없습니다.<br />
            권한이 필요한 경우 관리자에게 문의하세요.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              이전 페이지로 돌아가기
            </button>
            
            <Link
              to="/"
              className="block w-full px-4 py-2 bg-wee-main text-white rounded-md hover:bg-wee-dark"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;