import React from 'react';
import { motion } from 'framer-motion';

const AboutSystem: React.FC = () => {
  const systemLevels = [
    {
      level: '교육부',
      color: 'from-blue-600 to-blue-700',
      icon: '🏛️',
      role: '정책 수립 및 총괄',
      responsibilities: [
        'Wee 프로젝트 기본계획 수립',
        '예산 편성 및 지원',
        '법령 및 제도 정비',
        '성과 평가 및 환류'
      ]
    },
    {
      level: '시·도교육청',
      color: 'from-teal-600 to-teal-700',
      icon: '🏢',
      role: '지역 단위 운영 관리',
      responsibilities: [
        'Wee 센터 설치 및 운영',
        '전문인력 채용 및 관리',
        '지역별 특화 프로그램 개발',
        '교육지원청 지도·감독'
      ]
    },
    {
      level: '교육지원청',
      color: 'from-green-600 to-green-700',
      icon: '🏤',
      role: '지역 학교 지원',
      responsibilities: [
        'Wee 센터 운영 지원',
        '학교 상담 활동 지원',
        '위기학생 연계 지원',
        '교사 연수 프로그램 운영'
      ]
    },
    {
      level: '단위학교',
      color: 'from-purple-600 to-purple-700',
      icon: '🏫',
      role: '직접 서비스 제공',
      responsibilities: [
        'Wee 클래스 운영',
        '학생 상담 및 지원',
        '예방 프로그램 실시',
        '학부모 상담 제공'
      ]
    }
  ];

  const cooperativeSystem = [
    {
      title: '유관기관 협력',
      items: [
        { name: '정신건강복지센터', role: '전문 치료 연계' },
        { name: '청소년상담복지센터', role: '통합 지원 서비스' },
        { name: '병원 및 의료기관', role: '의료 서비스 제공' },
        { name: '경찰서', role: '위기상황 대응' }
      ]
    },
    {
      title: '전문가 네트워크',
      items: [
        { name: '상담심리전문가', role: '전문 상담 지원' },
        { name: '임상심리전문가', role: '심리평가 및 진단' },
        { name: '정신건강전문의', role: '의학적 치료' },
        { name: '사회복지사', role: '복지 서비스 연계' }
      ]
    }
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-wee-main to-wee-blue text-white py-20"
      >
        <div className="content-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">추진체계</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            교육부부터 단위학교까지 체계적인 지원 시스템을 구축하여
            모든 학생이 행복한 학교생활을 할 수 있도록 지원합니다.
          </p>
        </div>
      </motion.div>

      {/* System Structure */}
      <div className="content-wide py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">운영 체계</h2>
          <p className="text-lg text-gray-600">
            중앙정부부터 학교 현장까지 유기적인 협력 체계를 구축합니다
          </p>
        </motion.div>

        <div className="grid gap-6 max-w-5xl mx-auto">
          {systemLevels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection Line */}
              {index < systemLevels.length - 1 && (
                <div className="absolute left-12 top-full h-6 w-0.5 bg-gray-300 transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all p-6 relative z-10">
                <div className="flex items-start gap-6">
                  <div className={`w-24 h-24 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-4xl">{level.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.level}</h3>
                    <p className="text-lg text-wee-main font-medium mb-4">{level.role}</p>
                    <ul className="space-y-2">
                      {level.responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-wee-main mr-2 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cooperative System */}
      <div className="bg-gray-50 py-16">
        <div className="content-wide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">협력 체계</h2>
            <p className="text-lg text-gray-600">
              다양한 전문기관과 협력하여 통합적인 지원 서비스를 제공합니다
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cooperativeSystem.map((system, index) => (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">{system.title}</h3>
                <div className="space-y-4">
                  {system.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-sm text-gray-600">{item.role}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Flow */}
      <div className="content-wide py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">지원 프로세스</h2>
          <p className="text-lg text-gray-600">
            학생 발견부터 사후관리까지 체계적인 프로세스로 지원합니다
          </p>
        </motion.div>

        <div className="bg-gradient-to-r from-wee-light to-blue-50 rounded-3xl p-8">
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: '발견', desc: '위기학생 조기 발견' },
              { step: '2', title: '상담', desc: '전문상담 실시' },
              { step: '3', title: '진단', desc: '심층 평가 진행' },
              { step: '4', title: '개입', desc: '맞춤형 지원 제공' },
              { step: '5', title: '관리', desc: '지속적 사후관리' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-wee-main text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {process.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{process.title}</h4>
                <p className="text-sm text-gray-600">{process.desc}</p>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <svg className="w-8 h-8 text-wee-main mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Factors */}
      <div className="bg-white py-16">
        <div className="content-wide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">성공 요인</h2>
            <p className="text-lg text-gray-600">
              Wee 프로젝트의 성공적인 운영을 위한 핵심 요소들
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '👥',
                title: '전문인력 확보',
                desc: '전문상담교사, 전문상담사, 임상심리사 등 우수한 전문인력 배치'
              },
              {
                icon: '🏗️',
                title: '인프라 구축',
                desc: 'Wee 클래스, Wee 센터, Wee 스쿨 등 단계별 지원 인프라 확충'
              },
              {
                icon: '🤝',
                title: '협력 네트워크',
                desc: '학교-가정-지역사회가 함께하는 통합 지원 네트워크 구축'
              }
            ].map((factor, index) => (
              <motion.div
                key={factor.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center"
              >
                <div className="text-6xl mb-4">{factor.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{factor.title}</h3>
                <p className="text-gray-600">{factor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;