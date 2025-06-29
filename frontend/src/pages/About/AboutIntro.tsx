import React from 'react';
import { motion } from 'framer-motion';

const AboutIntro: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wee 프로젝트 사업소개</h1>
          <p className="text-lg text-gray-600">
            학생들의 건강하고 행복한 학교생활을 위한 통합 지원 체계
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-wee-main to-wee-blue rounded-3xl p-8 text-white mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Wee 프로젝트</h2>
              <p className="text-lg mb-6 text-blue-100">
                We(우리들) + Education(교육) + Emotion(감성)
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>학교-교육청-지역사회 연계 지원</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>위기학생 조기 발견 및 지원</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>맞춤형 상담 서비스 제공</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">2008년~</div>
                <div className="text-lg">사업 운영 시작</div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold">2,847</div>
                    <div>운영 기관</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">523,847</div>
                    <div>누적 상담 학생</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* What is Wee */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-soft p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wee 프로젝트란?
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-6 text-lg leading-relaxed">
                Wee 프로젝트는 <strong className="text-wee-main">학교부적응, 학교폭력, 학업중단, 인터넷·스마트폰 중독</strong> 등 
                학생들이 겪을 수 있는 다양한 위기상황을 예방하고, 조기에 발견하여 적절한 개입과 지원을 제공하는 
                <strong className="text-wee-main">학생 상담·복지 통합지원 서비스</strong>입니다.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="font-bold text-gray-900 mb-2">예방</h3>
                  <p className="text-sm text-gray-600">위기상황 사전 예방을 위한 교육 및 프로그램 운영</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-900 mb-2">발견</h3>
                  <p className="text-sm text-gray-600">위기학생 조기 발견을 위한 선별 및 진단</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-900 mb-2">지원</h3>
                  <p className="text-sm text-gray-600">맞춤형 상담 및 치료 서비스 제공</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Vision & Mission */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-soft p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">비전과 목표</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-wee-light to-blue-50 rounded-xl p-8">
                <div className="text-center mb-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-wee-main">비전</h3>
                </div>
                <p className="text-gray-700 text-center leading-relaxed">
                  <strong>모든 학생이 행복한 학교생활을 영위할 수 있는</strong><br/>
                  <strong className="text-wee-main">안전하고 건강한 교육환경 조성</strong>
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <div className="text-center mb-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-blue-600">목표</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    위기학생 조기 발견 및 지원 체계 구축
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    학교부적응 및 학교폭력 예방
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    학생 개별 맞춤형 상담 서비스 제공
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    전문 상담인력의 역량 강화
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 3-Tier System */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-soft p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Wee 프로젝트 3단계 지원체계</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Wee 클래스 */}
              <div className="text-center group">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wee 클래스</h3>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-green-700 font-semibold mb-1">1단계: 학교</div>
                  <div className="text-xs text-green-600">예방 및 기초상담</div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 모든 초·중·고등학교 설치</li>
                  <li>• 전문상담교사 배치</li>
                  <li>• 개인·집단상담 운영</li>
                  <li>• 심리검사 및 진단</li>
                  <li>• 학교적응 프로그램</li>
                </ul>
              </div>

              {/* Wee 센터 */}
              <div className="text-center group">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wee 센터</h3>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-blue-700 font-semibold mb-1">2단계: 교육청</div>
                  <div className="text-xs text-blue-600">전문상담 및 치료</div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 시·도교육청 및 교육지원청 설치</li>
                  <li>• 전문상담사 배치</li>
                  <li>• 심층 개인·가족상담</li>
                  <li>• 위기개입 및 치료</li>
                  <li>• 대안교육 프로그램</li>
                </ul>
              </div>

              {/* Wee 스쿨 */}
              <div className="text-center group">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wee 스쿨</h3>
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-purple-700 font-semibold mb-1">3단계: 지역사회</div>
                  <div className="text-xs text-purple-600">전문치료 및 보호</div>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 기숙형 치료학교</li>
                  <li>• 정신건강 전문의 배치</li>
                  <li>• 24시간 보호·관찰</li>
                  <li>• 집중 치료 프로그램</li>
                  <li>• 사회복귀 지원</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Key Services */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-soft p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">주요 서비스</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                <svg className="w-12 h-12 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-2">개인상담</h3>
                <p className="text-sm text-gray-600">1:1 맞춤형 상담을 통한 개별 문제 해결</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-2">집단상담</h3>
                <p className="text-sm text-gray-600">또래관계 개선 및 사회성 향상 프로그램</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <svg className="w-12 h-12 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-2">심리검사</h3>
                <p className="text-sm text-gray-600">학생의 심리상태 진단 및 평가</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
                <svg className="w-12 h-12 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-2">위기개입</h3>
                <p className="text-sm text-gray-600">응급상황 대응 및 즉시 지원</p>
              </div>
            </div>
          </motion.section>

          {/* Statistics */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-wee-main to-wee-blue rounded-2xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Wee 프로젝트 현황 (2024년 기준)</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">11,562</div>
                <div className="text-blue-100">Wee 클래스 운영교</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">223</div>
                <div className="text-blue-100">Wee 센터</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">62</div>
                <div className="text-blue-100">Wee 스쿨</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">94.7%</div>
                <div className="text-blue-100">학생 만족도</div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AboutIntro;