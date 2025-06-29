import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutHistory: React.FC = () => {
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const historyData = [
    {
      year: '2024',
      title: 'Wee 프로젝트 혁신과 도약',
      events: [
        { month: '06', content: '인공지능(AI) 기반 학생 위기 예측 시스템 도입' },
        { month: '04', content: '전국 Wee 클래스 5,500개 돌파' },
        { month: '03', content: '교육부 장관상 수상 - Wee 프로젝트 우수 운영 기관 10곳 선정' },
        { month: '02', content: '메타버스 활용 비대면 집단상담 프로그램 런칭' },
        { month: '01', content: '디지털 상담 플랫폼 전면 개편 - 모바일 최적화 완료' },
      ],
    },
    {
      year: '2023',
      title: 'Wee 프로젝트 15주년',
      events: [
        { month: '12', content: 'Wee 클래스 전국 5,000개 설치 완료 - 설치율 98% 달성' },
        { month: '11', content: '한국교육개발원과 Wee 프로젝트 효과성 연구 MOU 체결' },
        { month: '09', content: '학생정서·행동특성검사 온라인 시스템 전면 개편' },
        { month: '06', content: '위기학생 통합지원 시스템(Wee-SOS) 2.0 업그레이드' },
        { month: '03', content: 'Wee 프로젝트 15주년 기념 국제 심포지엄 개최' },
        { month: '01', content: '전문상담교사 및 전문상담사 총 12,000명 배치' },
      ],
    },
    {
      year: '2022',
      title: '포스트 코로나 시대 대응',
      events: [
        { month: '12', content: '학업중단 위기학생 특별지원 프로그램 신설' },
        { month: '11', content: '코로나19 대응 심리·정서 회복 프로그램 전국 확대' },
        { month: '09', content: '가정형 Wee센터 25개소 운영 - 24시간 보호체계 구축' },
        { month: '07', content: '전문상담교사 1,200명 추가 배치 - 총 11,000명 돌파' },
        { month: '04', content: '가족 단위 상담 프로그램 전면 도입' },
        { month: '02', content: '화상상담 시스템 고도화 - 전국 Wee센터 100% 구축' },
      ],
    },
    {
      year: '2021',
      title: '디지털 전환 가속화',
      events: [
        { month: '12', content: '교육부-보건복지부 연계 통합 사례관리 시스템 구축' },
        { month: '10', content: 'Wee스쿨 운영 매뉴얼 전면 개정 - 대안교육 과정 강화' },
        { month: '08', content: '빅데이터 기반 학생 위기 징후 조기발견 시스템 시범 운영' },
        { month: '05', content: '학교폭력 예방 프로그램 개편 - 회복적 생활교육 중심' },
        { month: '03', content: '모바일 상담 앱 "Wee 톡톡" 출시' },
        { month: '02', content: '온라인 상담 플랫폼 정식 런칭 - 비대면 상담 본격화' },
      ],
    },
    {
      year: '2020',
      title: '코로나19 위기 대응',
      events: [
        { month: '12', content: '코로나19 심리방역 지원단 전국 17개 시·도 운영' },
        { month: '10', content: '학생 자살예방 및 생명존중 캠페인 전국 전개' },
        { month: '08', content: '24시간 위기상담 핫라인(1588-7179) 개설' },
        { month: '06', content: '온라인 개학 대응 심리지원 프로그램 긴급 개발' },
        { month: '04', content: '코로나 블루 극복 프로젝트 추진' },
        { month: '03', content: '비대면 상담 서비스 긴급 도입 - 화상상담 시스템 구축' },
      ],
    },
    {
      year: '2015-2019',
      isCollapsed: true,
      title: 'Wee 프로젝트 안정화 및 확대기',
      summary: '전국적 인프라 구축 및 전문성 강화',
      events: [
        { month: '2019', content: 'Wee센터 전국 200개소 돌파, Wee클래스 4,000개 설치' },
        { month: '2018', content: '전문상담교사 자격 기준 강화 및 연수 체계 개편' },
        { month: '2017', content: '학생정서·행동특성검사 초1·4, 중1, 고1 전면 실시' },
        { month: '2016', content: 'Wee클래스 설치율 90% 달성, 전문상담교사 8,000명 배치' },
        { month: '2015', content: '위기학생 조기경보시스템 구축, Wee스쿨 15개 운영' },
      ],
    },
    {
      year: '2010-2014',
      isCollapsed: true,
      title: 'Wee 프로젝트 성장기',
      summary: '3단계 안전망 체계 확립',
      events: [
        { month: '2014', content: 'Wee스쿨 전국 확대(13개), 가정형 Wee센터 시범 운영' },
        { month: '2013', content: '학교폭력 근절 종합대책 연계 Wee프로젝트 역할 강화' },
        { month: '2012', content: 'Wee센터 100개소 달성, 전문상담교사 5,000명 돌파' },
        { month: '2011', content: 'Wee클래스 2,000개 설치, 진로상담 기능 추가' },
        { month: '2010', content: '전문상담교사 정규 배치 시작(1,500명)' },
      ],
    },
    {
      year: '2008-2009',
      isCollapsed: true,
      title: 'Wee 프로젝트 태동기',
      summary: '학생 상담 지원 체계의 시작',
      events: [
        { month: '2009.12', content: 'Wee센터 전국 50개 설치, Wee클래스 530개 운영' },
        { month: '2009.09', content: '전문상담 인턴교사 배치(500명)' },
        { month: '2009.03', content: 'Wee클래스 시범학교 100개교 운영' },
        { month: '2008.12', content: 'Wee프로젝트 1차년도 사업 평가 및 개선 방안 마련' },
        { month: '2008.07', content: 'Wee센터 10개 시범 운영 시작' },
        { month: '2008.03', content: 'Wee프로젝트 공식 출범 - "We + Education + Emotion"' },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const newVisibleItems: number[] = [];
      historyData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 200);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container-custom py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Wee 프로젝트 연혁</h1>
          <p className="text-xl text-gray-600">
            2008년부터 시작된 대한민국 학생 상담·복지 지원의 역사
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-wee-light rounded-full">
            <span className="w-3 h-3 bg-wee-main rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-wee-dark">16년의 여정, 계속되는 성장</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline Line */}
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-1 overflow-hidden"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="h-full w-full bg-gradient-to-b from-wee-main via-wee-blue to-wee-green"></div>
          </motion.div>

          {/* History Items */}
          <div className="space-y-10">
            {historyData.map((yearData, yearIndex) => (
              <motion.div 
                key={yearIndex} 
                className="relative"
                variants={itemVariants}
                custom={yearIndex}
                initial="hidden"
                animate={visibleItems.includes(yearIndex) ? "visible" : "hidden"}
              >
                {/* Year Badge */}
                <motion.div 
                  className="absolute left-0 w-16 h-16 bg-gradient-to-br from-wee-main to-wee-blue rounded-full flex items-center justify-center shadow-lg z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-bold text-sm">{yearData.year.split('-')[0]}</span>
                </motion.div>

                {/* Content */}
                <div className="ml-24">
                  <motion.div 
                    className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">{yearData.year}년</h2>
                      {yearData.title && (
                        <span className="text-sm font-medium text-wee-main bg-wee-light px-3 py-1 rounded-full">
                          {yearData.title}
                        </span>
                      )}
                    </div>
                    
                    {yearData.isCollapsed ? (
                      <div className="space-y-3">
                        <p className="text-gray-600 font-medium">{yearData.summary}</p>
                        <details 
                          className="group"
                          onToggle={(e) => {
                            if ((e.target as HTMLDetailsElement).open) {
                              setActiveYear(yearData.year);
                            } else if (activeYear === yearData.year) {
                              setActiveYear(null);
                            }
                          }}
                        >
                          <summary className="cursor-pointer text-wee-main hover:text-wee-dark font-medium flex items-center justify-between">
                            <span>주요 성과 보기</span>
                            <motion.span 
                              className="text-xl"
                              animate={{ rotate: activeYear === yearData.year ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              ⌄
                            </motion.span>
                          </summary>
                          <motion.div 
                            className="mt-4 space-y-3 pl-4 border-l-2 border-wee-light"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {yearData.events.map((event, eventIndex) => (
                              <motion.div 
                                key={eventIndex} 
                                className="flex items-start space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: eventIndex * 0.1 }}
                              >
                                <span className="text-sm font-semibold text-wee-main min-w-[4rem]">
                                  {event.month}
                                </span>
                                <p className="text-gray-600">{event.content}</p>
                              </motion.div>
                            ))}
                          </motion.div>
                        </details>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {yearData.events.map((event, eventIndex) => (
                          <motion.div 
                            key={eventIndex} 
                            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 cursor-pointer group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: yearIndex * 0.1 + eventIndex * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex-shrink-0">
                              <motion.div 
                                className="w-12 h-12 bg-gradient-to-br from-wee-light to-blue-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <span className="text-xs font-bold text-wee-main">{event.month}월</span>
                              </motion.div>
                            </div>
                            <p className="text-gray-700 flex-1 pt-2 leading-relaxed">{event.content}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* End Marker */}
          <motion.div 
            className="relative mt-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: "spring" }}
          >
            <motion.div 
              className="absolute left-0 w-16 h-16 bg-gradient-to-br from-wee-coral to-wee-purple rounded-full flex items-center justify-center shadow-lg z-10"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <div className="ml-24">
              <motion.div 
                className="bg-gradient-to-r from-wee-light via-blue-50 to-purple-50 rounded-2xl p-8 shadow-soft"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-lg text-gray-800 font-medium mb-2">
                  Wee 프로젝트는 대한민국 모든 학생의 행복한 학교생활을 위해
                </p>
                <p className="text-gray-600">
                  오늘도 끊임없이 혁신하고 발전하고 있습니다.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">2024년 현재 주요 성과</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '16년', label: '지속 운영', color: 'text-wee-main', icon: '📅' },
                { value: '5,500+', label: 'Wee 클래스', color: 'text-wee-blue', icon: '🏫' },
                { value: '200+', label: 'Wee 센터', color: 'text-wee-green', icon: '🏢' },
                { value: '150만+', label: '연간 상담', color: 'text-wee-coral', icon: '💬' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="text-4xl mb-3"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      delay: index * 0.2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-10 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">12,000+</div>
                  <p className="text-sm text-gray-600">전문상담 인력</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">98%</div>
                  <p className="text-sm text-gray-600">학교 설치율</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">25개</div>
                  <p className="text-sm text-gray-600">가정형 Wee센터</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHistory;