import React from 'react';

const ThemeShowcase: React.FC = () => {
  return (
    <section className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="content-container">
        <h2 className="section-title">테마 스타일 미리보기</h2>
        <p className="section-subtitle mb-12">
          공공기관의 다양한 사용자를 위한 3가지 디자인 테마를 제공합니다
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* 모던 테마 미리보기 */}
          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">모던 스타일</h3>
              </div>
              <p className="text-gray-600 mb-4">
                현대적이고 깔끔한 디자인으로 직관적인 사용자 경험을 제공합니다. 
                그라디언트와 부드러운 애니메이션이 특징입니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
                  <div className="w-6 h-6 bg-indigo-500 rounded-lg"></div>
                  <div className="w-6 h-6 bg-pink-500 rounded-lg"></div>
                  <span className="text-sm text-gray-500">주요 색상</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Pretendard 폰트 사용
                </div>
              </div>
            </div>
          </div>

          {/* 클래식 테마 미리보기 */}
          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">클래식 스타일</h3>
              </div>
              <p className="text-gray-600 mb-4">
                전통적이고 신뢰감 있는 디자인으로 공공기관의 품격을 표현합니다. 
                세리프 폰트와 차분한 색상이 특징입니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-900 rounded"></div>
                  <div className="w-6 h-6 bg-red-900 rounded"></div>
                  <div className="w-6 h-6 bg-amber-700 rounded"></div>
                  <span className="text-sm text-gray-500">주요 색상</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  나눔명조 & IBM Plex Sans KR
                </div>
              </div>
            </div>
          </div>

          {/* 접근성 테마 미리보기 */}
          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center mr-3 border-2 border-yellow-400">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">접근성 스타일</h3>
              </div>
              <p className="text-gray-600 mb-4">
                고대비와 큰 글씨로 모든 사용자가 쉽게 읽을 수 있는 디자인입니다. 
                WCAG AAA 기준을 준수합니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-black rounded border-2 border-black"></div>
                  <div className="w-6 h-6 bg-yellow-400 rounded border-2 border-black"></div>
                  <div className="w-6 h-6 bg-white rounded border-2 border-black"></div>
                  <span className="text-sm text-gray-500">주요 색상</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Gothic A1 폰트 (큰 크기)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 테마 적용 예시 */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">테마별 컴포넌트 예시</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 버튼 예시 */}
            <div className="text-center">
              <h4 className="font-semibold mb-4">버튼 스타일</h4>
              <div className="space-y-3">
                <button className="btn btn-primary w-full">기본 버튼</button>
                <button className="btn btn-secondary w-full">보조 버튼</button>
                <button className="btn btn-ghost w-full">고스트 버튼</button>
              </div>
            </div>

            {/* 폼 예시 */}
            <div className="text-center">
              <h4 className="font-semibold mb-4">입력 폼</h4>
              <div className="space-y-3">
                <input type="text" placeholder="이름을 입력하세요" className="form-input" />
                <select className="form-input">
                  <option>옵션을 선택하세요</option>
                  <option>옵션 1</option>
                  <option>옵션 2</option>
                </select>
              </div>
            </div>

            {/* 배지 예시 */}
            <div className="text-center">
              <h4 className="font-semibold mb-4">배지 & 알림</h4>
              <div className="space-y-3">
                <div className="flex justify-center space-x-2">
                  <span className="badge badge-primary">신규</span>
                  <span className="badge badge-success">완료</span>
                  <span className="badge badge-warning">진행중</span>
                </div>
                <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  정보 메시지 예시
                </div>
              </div>
            </div>
          </div>

          {/* 사용 안내 */}
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-4">
              <strong>테마 변경 방법:</strong> 상단 헤더의 "테마 변경" 버튼을 클릭하여 
              원하는 스타일을 선택하실 수 있습니다.
            </p>
            <p className="text-sm text-gray-500">
              선택한 테마는 자동으로 저장되어 다음 방문 시에도 유지됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeShowcase;