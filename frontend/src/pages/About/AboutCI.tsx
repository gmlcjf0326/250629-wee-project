import React from 'react';

const AboutCI: React.FC = () => {
  const colorData = [
    { name: 'Wee Green', hex: '#4CAF50', rgb: 'RGB(76, 175, 80)', usage: '희망과 성장' },
    { name: 'Wee Blue', hex: '#2196F3', rgb: 'RGB(33, 150, 243)', usage: '신뢰와 안정' },
    { name: 'Wee Orange', hex: '#FF9800', rgb: 'RGB(255, 152, 0)', usage: '활력과 소통' },
    { name: 'Wee Purple', hex: '#9C27B0', rgb: 'RGB(156, 39, 176)', usage: '창의와 포용' },
  ];

  const applications = [
    { title: '명함', icon: '💳' },
    { title: '서식', icon: '📄' },
    { title: '현수막', icon: '🏳️' },
    { title: '홍보물', icon: '📢' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CI 소개</h1>
          <p className="text-lg text-gray-600">
            Wee 프로젝트의 정체성을 담은 통합 이미지
          </p>
        </div>

        {/* Logo Section */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl shadow-soft p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Wee 로고</h2>
            
            {/* Main Logo Display */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mb-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-wee-main to-wee-blue bg-clip-text text-transparent mb-4">
                  Wee
                </div>
                <p className="text-gray-600">We + Education + Emotion</p>
              </div>
            </div>

            {/* Logo Variations */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-8 mb-3">
                  <div className="text-4xl font-bold text-wee-main">Wee</div>
                </div>
                <p className="text-sm text-gray-600">기본형</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 rounded-xl p-8 mb-3">
                  <div className="text-4xl font-bold text-white">Wee</div>
                </div>
                <p className="text-sm text-gray-600">반전형</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-8 mb-3">
                  <div className="text-4xl font-bold text-gray-400">Wee</div>
                </div>
                <p className="text-sm text-gray-600">단색형</p>
              </div>
            </div>

            {/* Logo Meaning */}
            <div className="bg-gradient-to-r from-wee-light to-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">로고의 의미</h3>
              <p className="text-gray-700 mb-2">
                <strong>Wee</strong>는 우리(We), 교육(Education), 감성(Emotion)의 합성어로,
                학생과 함께하는 따뜻한 교육을 상징합니다.
              </p>
              <p className="text-gray-700">
                둥근 형태는 포용과 소통을, 밝은 색상은 희망과 성장을 나타냅니다.
              </p>
            </div>
          </div>
        </section>

        {/* Color System */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">컬러 시스템</h2>
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {colorData.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="h-32 rounded-xl mb-4 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <h4 className="font-semibold text-gray-900 mb-1">{color.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{color.hex}</p>
                  <p className="text-xs text-gray-500 mb-2">{color.rgb}</p>
                  <p className="text-sm font-medium text-gray-700">{color.usage}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">색상 사용 지침</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>주색상은 Wee Green을 사용하며, 희망적이고 긍정적인 이미지를 전달합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>보조색상은 용도와 상황에 맞게 적절히 활용합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>색상 조합 시 가독성과 조화를 고려하여 사용합니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">타이포그래피</h2>
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">주 사용 서체</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-display text-2xl mb-2">Noto Sans KR</h4>
                    <p className="text-gray-600 mb-3">노토 산스 코리안</p>
                    <div className="space-y-1 text-sm">
                      <p>가나다라마바사 ABCDEFG 1234567890</p>
                      <p className="font-light">Light: 가벼운 텍스트</p>
                      <p className="font-normal">Regular: 일반 텍스트</p>
                      <p className="font-bold">Bold: 강조 텍스트</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-4">보조 사용 서체</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-kopub text-2xl mb-2">KoPub 돋움</h4>
                    <p className="text-gray-600 mb-3">코펍 돋움</p>
                    <div className="space-y-1 text-sm font-kopub">
                      <p>가나다라마바사 ABCDEFG 1234567890</p>
                      <p className="font-light">Light: 가벼운 텍스트</p>
                      <p className="font-normal">Medium: 일반 텍스트</p>
                      <p className="font-bold">Bold: 강조 텍스트</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">사용 규정</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                올바른 사용 예시
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span>규정된 색상과 비율 준수</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span>충분한 여백 확보</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span>명확한 가독성 유지</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">•</span>
                  <span>지정된 서체 사용</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-red-500 mr-2">✕</span>
                잘못된 사용 예시
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span>임의로 색상 변경</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span>비율 왜곡 또는 변형</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span>복잡한 배경 위 사용</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                  <span>그림자나 효과 추가</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Application Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">활용 예시</h2>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8">
            <div className="grid md:grid-cols-4 gap-4">
              {applications.map((app, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <h4 className="font-semibold text-gray-900">{app.title}</h4>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="btn-primary">
                CI 가이드라인 다운로드
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutCI;