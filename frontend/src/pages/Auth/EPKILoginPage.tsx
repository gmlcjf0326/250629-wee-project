import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const EPKILoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEPKI } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [certificateDetected, setCertificateDetected] = useState(false);
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Check if EPKI module is available
    checkEPKIModule();
  }, []);

  const checkEPKIModule = () => {
    // In real implementation, check if EPKI browser plugin is installed
    // This is a mock implementation
    setTimeout(() => {
      setCertificateDetected(true);
    }, 1000);
  };

  const handleEPKILogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // In real implementation, this would:
      // 1. Call EPKI browser plugin to get certificate
      // 2. Create signature with private key
      // 3. Send certificate data and signature to server
      
      // Mock implementation
      const mockCertData = btoa('mock-certificate-data-' + Date.now());
      const mockSignature = btoa('mock-signature-' + Date.now());
      
      await loginWithEPKI(mockCertData, mockSignature);
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || '인증서 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCertificate = () => {
    // In real implementation, open certificate selection dialog
    setError('');
    handleEPKILogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-wee-main to-wee-skyblue rounded-full flex items-center justify-center text-white font-bold text-2xl">
              Wee
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            공동인증서 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            등록된 공동인증서(EPKI)로 안전하게 로그인하세요
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-wee-light">
                <svg className="h-12 w-12 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              {!certificateDetected ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">인증서 모듈을 확인하는 중...</p>
                  <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wee-main mx-auto"></div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    인증서가 준비되었습니다
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    아래 버튼을 클릭하여 인증서를 선택하세요
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSelectCertificate}
                disabled={!certificateDetected || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wee-main hover:bg-wee-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wee-main disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '인증 중...' : '인증서 선택'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  인증서 사용 안내
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>공동인증서가 PC에 설치되어 있어야 합니다</li>
                    <li>인증서 비밀번호를 준비해주세요</li>
                    <li>만료되지 않은 유효한 인증서만 사용 가능합니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-wee-main hover:text-wee-dark"
            >
              일반 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};