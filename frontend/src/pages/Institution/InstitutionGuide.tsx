import React, { useState } from 'react';

const InstitutionGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('class');

  const services = {
    class: {
      title: 'Wee 클래스',
      icon: '🏫',
      description: '학교 내 전문상담실',
      target: '해당 학교 재학생',
      hours: '월-금 09:00-17:00',
      process: [
        '담임교사 또는 직접 방문 신청',
        '초기 상담 및 욕구 파악',
        '상담 계획 수립',
        '개인/집단 상담 진행',
        '사후 관리 및 모니터링',
      ],
      services: [
        '개인상담 (학업, 진로, 교우관계 등)',
        '집단상담 프로그램',
        '심리검사 실시 및 해석',
        '위기개입 상담',
        '학부모 상담',
      ],
    },
    center: {
      title: 'Wee 센터',
      icon: '🏛️',
      description: '교육지원청 전문상담기관',
      target: '관내 초·중·고 학생 및 학부모',
      hours: '월-금 09:00-18:00',
      process: [
        '학교 또는 개인 의뢰',
        '접수 상담 진행',
        '종합 심리평가 (필요시)',
        '전문상담 서비스 제공',
        '연계 서비스 안내',
      ],
      services: [
        '심층 개인상담',
        '놀이/미술/음악 치료',
        '가족상담',
        '정신건강 전문의 상담',
        '학업중단 예방 프로그램',
      ],
    },
    school: {
      title: 'Wee 스쿨',
      icon: '🎓',
      description: '장기 위탁교육 기관',
      target: '학교 부적응 중·고등학생',
      hours: '월-금 09:00-16:00',
      process: [
        '학교장 추천 및 신청',
        '입교 상담 및 평가',
        '학부모 동의',
        '위탁교육 결정',
        '맞춤형 교육과정 운영',
      ],
      services: [
        '대안교육 과정',
        '치유 중심 프로그램',
        '진로·직업 교육',
        '기숙형 생활지도',
        '원적교 복귀 지원',
      ],
    },
  };

  const faqs = [
    {
      question: '상담 비용이 있나요?',
      answer: 'Wee 프로젝트의 모든 상담 서비스는 무료로 제공됩니다.',
    },
    {
      question: '상담 내용이 비밀로 유지되나요?',
      answer: '상담 내용은 철저히 비밀이 보장됩니다. 단, 자해·타해의 위험이 있는 경우에는 보호자에게 알릴 수 있습니다.',
    },
    {
      question: '상담 신청은 어떻게 하나요?',
      answer: 'Wee 클래스는 학교 내 직접 방문, Wee 센터는 전화 예약 후 방문하시면 됩니다.',
    },
    {
      question: '부모도 상담을 받을 수 있나요?',
      answer: '네, 자녀 양육과 관련된 상담을 받으실 수 있습니다.',
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">이용안내</h1>
          <p className="text-lg text-gray-600">
            Wee 프로젝트 서비스를 이용하는 방법을 안내해드립니다
          </p>
        </div>

        {/* Service Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-wee-main to-wee-blue text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
                }`}
              >
                <span className="mr-2">{service.icon}</span>
                {service.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Service Content */}
        <div className="mb-12">
          {Object.entries(services).map(([key, service]) => (
            <div
              key={key}
              className={`${activeTab === key ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-3xl shadow-soft p-8">
                {/* Service Header */}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h2>
                  <p className="text-lg text-gray-600">{service.description}</p>
                </div>

                {/* Basic Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">이용 대상</h3>
                    <p className="text-gray-700">{service.target}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">운영 시간</h3>
                    <p className="text-gray-700">{service.hours}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">상담 방법</h3>
                    <p className="text-gray-700">대면 상담 / 전화 상담</p>
                  </div>
                </div>

                {/* Process */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">이용 절차</h3>
                  <div className="relative">
                    <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    {service.process.map((step, index) => (
                      <div key={index} className="relative flex items-start mb-6">
                        <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-wee-main to-wee-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="ml-24 bg-gray-50 rounded-xl p-4 flex-1">
                          <p className="text-gray-700">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">제공 서비스</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.services.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                        <div className="w-2 h-2 bg-wee-main rounded-full flex-shrink-0"></div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">문의 및 신청</h2>
          <div className="bg-gradient-to-r from-wee-light to-blue-50 rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-wee-main rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">전화 문의</h3>
                <p className="text-2xl font-bold text-wee-main mb-1">1588-7179</p>
                <p className="text-sm text-gray-600">평일 09:00-18:00</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-wee-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">이메일 문의</h3>
                <p className="text-lg font-medium text-wee-blue">wee@moe.go.kr</p>
                <p className="text-sm text-gray-600">24시간 접수</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-wee-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">방문 상담</h3>
                <p className="text-sm text-gray-700">가까운 Wee 클래스/센터</p>
                <button className="text-wee-main hover:text-wee-dark font-medium text-sm mt-1">
                  기관 찾기 →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">자주 묻는 질문</h2>
          <div className="bg-white rounded-3xl shadow-soft p-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex justify-between items-center">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 text-gray-700">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstitutionGuide;