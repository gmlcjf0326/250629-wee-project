import React from 'react';

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ title, description }) => {
  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-gray-600 mb-8">{description}</p>
        )}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">준비 중입니다</h2>
            <p className="text-gray-600">
              이 페이지는 현재 개발 중입니다. 곧 서비스를 제공할 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePlaceholder;