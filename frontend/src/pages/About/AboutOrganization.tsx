import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AboutOrganization: React.FC = () => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const organizationData = {
    headquarters: {
      title: '교육부 학생지원국',
      subtitle: 'Wee 프로젝트 총괄',
      departments: [
        {
          name: '학생정신건강정책과',
          icon: '🎯',
          roles: [
            'Wee 프로젝트 기본계획 수립',
            '예산 편성 및 배분',
            '성과 평가 및 환류 체계 구축',
            '시·도교육청 지도·감독',
          ],
        },
        {
          name: '학교생활문화팀',
          icon: '🎓',
          roles: [
            'Wee 클래스/센터/스쿨 운영 지침 개발',
            '전문상담 인력 양성 및 배치',
            '운영 매뉴얼 및 가이드라인 제작',
            '우수사례 발굴 및 확산',
          ],
        },
        {
          name: '교육회복지원팀',
          icon: '💕',
          roles: [
            '상담 프로그램 개발 및 보급',
            '심리검사 도구 개발 및 표준화',
            '위기학생 지원 체계 구축',
            '학생정서·행동특성검사 관리',
          ],
        },
      ],
    },
    regional: [
      {
        id: 'sido',
        title: '시·도교육청',
        subtitle: '17개 시·도',
        icon: '🏢',
        color: 'from-blue-500 to-blue-600',
        units: [
          { name: 'Wee 스쿨', count: '15개', role: '장기 위탁교육 및 치료형 대안교육' },
          { name: '가정형 Wee센터', count: '25개', role: '위기학생 24시간 보호 및 치유' },
          { name: '병원형 Wee센터', count: '12개', role: '정신건강 전문 치료 지원' },
          { name: '학교폭력 예방교육센터', count: '17개', role: '학교폭력 예방 및 대응' },
        ],
      },
      {
        id: 'jiwon',
        title: '교육지원청',
        subtitle: '176개 기초지자체',
        icon: '🏛️',
        color: 'from-green-500 to-green-600',
        units: [
          { name: 'Wee센터', count: '200개+', role: '전문적 상담·치료 서비스 제공' },
          { name: 'Wee클래스 미설치교 지원', count: '전국', role: '소규모 학교 순회상담 지원' },
          { name: 'Wee센터 연계기관', count: '500개+', role: '지역사회 상담기관 협력체계' },
          { name: '학교폭력 예방 프로그램', count: '전국', role: '예방교육 및 캠페인 운영' },
        ],
      },
      {
        id: 'school',
        title: '단위학교',
        subtitle: '전국 초·중·고등학교',
        icon: '🏫',
        color: 'from-purple-500 to-purple-600',
        units: [
          { name: 'Wee클래스', count: '5,500개+', role: '학교 내 상담실 운영' },
          { name: '전문상담교사', count: '6,000명+', role: '학교 전담 상담 및 지도' },
          { name: '전문상담사', count: '6,000명+', role: '학생 상담 및 심리지원' },
          { name: '또래상담자', count: '50,000명+', role: '또래 도움 활동' },
        ],
      },
    ],
    partners: [
      { 
        name: '한국교육개발원(KEDI)', 
        role: 'Wee 프로젝트 연구 및 정책 개발',
        icon: '🏛️'
      },
      { 
        name: '한국청소년상담복지개발원', 
        role: '상담 프로그램 개발 및 보급',
        icon: '🤝'
      },
      { 
        name: '정신건강복지센터', 
        role: '위기 학생 지원 및 치료 연계',
        icon: '🏥'
      },
      { 
        name: '경찰청·법무부', 
        role: '학교폭력 예방 및 대응 협력',
        icon: '🚔'
      },
      { 
        name: '여성가족부', 
        role: '청소년 정책 연계 및 협력',
        icon: '👨‍👩‍👧‍👦'
      },
      { 
        name: '보건복지부', 
        role: '정신건강 지원 체계 연계',
        icon: '🏥'
      },
    ],
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container-custom py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Wee 프로젝트 조직체계</h1>
          <p className="text-xl text-gray-600 mb-6">
            전국 모든 학생을 위한 안전한 교육 환경 조성
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-wee-light rounded-full">
            <span className="text-sm font-medium text-wee-dark">학교-교육청-교육부 3단계 안전망 체계</span>
          </div>
        </motion.div>

        {/* Central Organization */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-wee-main to-wee-blue text-white rounded-3xl shadow-2xl p-10 mb-8 relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <motion.h2 
                className="text-3xl font-bold mb-2 text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {organizationData.headquarters.title}
              </motion.h2>
              <p className="text-center text-white/80 mb-8">{organizationData.headquarters.subtitle}</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {organizationData.headquarters.departments.map((dept, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredDept(dept.name)}
                    onHoverEnd={() => setHoveredDept(null)}
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{dept.icon}</span>
                      <h3 className="text-lg font-semibold">{dept.name}</h3>
                    </div>
                    <ul className="space-y-2">
                      {dept.roles.map((role, roleIndex) => (
                        <motion.li 
                          key={roleIndex} 
                          className="text-sm text-white/90 flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: hoveredDept === dept.name ? 1 : 0.9, x: 0 }}
                          transition={{ delay: roleIndex * 0.05 }}
                        >
                          <span className="mr-2 text-white/60">✓</span>
                          <span>{role}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Regional Organization */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            3단계 안전망 운영 체계
          </motion.h2>
          <div className="space-y-8">
            {organizationData.regional.map((region, index) => (
              <motion.div 
                key={region.id} 
                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedLevel(selectedLevel === region.id ? null : region.id)}
              >
                <div className="flex items-center justify-between mb-6 cursor-pointer">
                  <div className="flex items-center">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${region.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mr-4`}
                      whileHover={{ rotate: 5 }}
                    >
                      {region.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{region.title}</h3>
                      <p className="text-gray-600">{region.subtitle}</p>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ rotate: selectedLevel === region.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="grid md:grid-cols-2 gap-6"
                  initial={false}
                  animate={{ height: selectedLevel === region.id ? "auto" : "0", opacity: selectedLevel === region.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  {region.units.map((unit, unitIndex) => (
                    <motion.div 
                      key={unitIndex} 
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedLevel === region.id ? 1 : 0, y: selectedLevel === region.id ? 0 : 20 }}
                      transition={{ delay: unitIndex * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">{unit.name}</h4>
                        <motion.span 
                          className="text-sm font-bold text-white bg-gradient-to-r from-wee-main to-wee-blue px-3 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                        >
                          {unit.count}
                        </motion.span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{unit.role}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Organization Chart */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">조직 체계도</h2>
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex flex-col items-center">
              {/* Top Level */}
              <motion.div 
                className="bg-gradient-to-r from-wee-main to-wee-blue text-white rounded-2xl p-6 font-bold shadow-2xl relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="text-xl">교육부</div>
                <div className="text-sm font-normal opacity-80">학생지원국</div>
              </motion.div>
              
              {/* Connector Animation */}
              <motion.div 
                className="w-1 h-12 bg-gradient-to-b from-wee-main to-wee-light"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>
              
              {/* Second Level */}
              <motion.div 
                className="bg-gradient-to-r from-wee-light to-blue-100 text-wee-dark rounded-2xl p-6 font-bold mb-12 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-lg">Wee 프로젝트 중앙 지원단</div>
                <div className="text-sm font-normal">기획 · 운영 · 개발</div>
              </motion.div>
              
              {/* Connectors to Third Level */}
              <div className="relative w-full mb-8">
                <svg className="w-full h-12" viewBox="0 0 800 50" preserveAspectRatio="none">
                  <motion.path
                    d="M400 0 L200 50 M400 0 L400 50 M400 0 L600 50"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </svg>
              </div>
              
              {/* Third Level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
                {[
                  {
                    title: '시·도교육청',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'from-blue-50 to-blue-100',
                    items: ['Wee스쿨', '가정형 Wee센터', '병원형 Wee센터']
                  },
                  {
                    title: '교육지원청',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'from-green-50 to-green-100',
                    items: ['Wee센터', '순회상담', '연계기관']
                  },
                  {
                    title: '단위학교',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100',
                    items: ['Wee클래스', '전문상담교사', '전문상담사']
                  }
                ].map((level, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  >
                    <motion.div 
                      className={`bg-gradient-to-r ${level.color} text-white rounded-2xl p-5 font-semibold mb-6 shadow-lg`}
                      whileHover={{ y: -5, scale: 1.05 }}
                    >
                      {level.title}
                    </motion.div>
                    <div className="space-y-3">
                      {level.items.map((item, itemIndex) => (
                        <motion.div 
                          key={itemIndex} 
                          className={`bg-gradient-to-r ${level.bgColor} rounded-xl p-4 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + index * 0.1 + itemIndex * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Partner Organizations */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">협력 기관</h2>
          <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 rounded-3xl p-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizationData.partners.map((partner, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{partner.icon}</span>
                    <h4 className="font-bold text-gray-900 text-lg">{partner.name}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{partner.role}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-gray-700 font-medium text-lg mb-4">
                함께 만들어가는 행복한 학교 문화
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700">지속적인 협력 체계 강화</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutOrganization;