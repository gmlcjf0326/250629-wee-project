import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Statistics counter animation
  const [counters, setCounters] = useState({
    weeClass: 0,
    weeCenter: 0,
    weeSchool: 0,
    weeHome: 0,
    students: 0,
    counselors: 0,
    satisfaction: 0,
    programs: 0
  });
  
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  
  useEffect(() => {
    if (isStatsInView) {
      const targets = {
        weeClass: 8294,
        weeCenter: 199,
        weeSchool: 15,
        weeHome: 13,
        students: 523847,
        counselors: 12543,
        satisfaction: 94.7,
        programs: 2847
      };
      
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        const progress = current / steps;
        
        setCounters({
          weeClass: Math.floor(targets.weeClass * progress),
          weeCenter: Math.floor(targets.weeCenter * progress),
          weeSchool: Math.floor(targets.weeSchool * progress),
          weeHome: Math.floor(targets.weeHome * progress),
          students: Math.floor(targets.students * progress),
          counselors: Math.floor(targets.counselors * progress),
          satisfaction: parseFloat((targets.satisfaction * progress).toFixed(1)),
          programs: Math.floor(targets.programs * progress)
        });
        
        if (current >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isStatsInView]);
  
  // Testimonials data
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: "김민수",
      role: "고등학교 2학년 학생",
      content: "Wee클래스 선생님과의 상담을 통해 진로에 대한 고민을 해결할 수 있었어요. 이제는 제 꿈을 향해 자신있게 나아가고 있습니다.",
      avatar: "👦"
    },
    {
      id: 2,
      name: "이정희",
      role: "학부모",
      content: "아이가 학교생활에 어려움을 겪고 있었는데, Wee센터의 전문적인 도움으로 많이 좋아졌습니다. 정말 감사합니다.",
      avatar: "👩"
    },
    {
      id: 3,
      name: "박선영",
      role: "중학교 상담교사",
      content: "Wee프로젝트의 체계적인 지원 덕분에 더 많은 학생들에게 도움을 줄 수 있게 되었습니다. 훌륭한 프로그램입니다.",
      avatar: "👩‍🏫"
    },
    {
      id: 4,
      name: "최준호",
      role: "교육청 담당자",
      content: "Wee프로젝트는 우리 지역 학생들의 정서적 안정과 건강한 성장에 큰 도움이 되고 있습니다. 계속 발전하길 바랍니다.",
      avatar: "👨‍💼"
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);
  
  // Partner logos
  const partners = [
    { name: "교육부", logo: "🏛️" },
    { name: "한국교육개발원", logo: "🎓" },
    { name: "한국청소년상담복지개발원", logo: "🤝" },
    { name: "전국시도교육청", logo: "🏢" },
    { name: "한국학교상담학회", logo: "📚" },
    { name: "한국상담심리학회", logo: "🧠" }
  ];
  
  return (
    <div className="page-wrapper min-h-screen overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: parallaxY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-wee-light via-white to-wee-bg-light">
            <div className="absolute inset-0 hero-pattern opacity-30"></div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-wee-main/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-wee-purple/10 rounded-full blur-3xl"></div>
        </motion.div>
        
        <div className="content-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ opacity }}
            >
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-gradient">함께하는 행복한 학교</span>
              </motion.h1>
              <motion.p 
                className="text-3xl mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                위(Wee) 프로젝트
              </motion.p>
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                We(우리) + Education(교육) + Emotion(감성)<br />
                학생들의 건강하고 즐거운 학교생활을 지원하는 통합 지원 서비스
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link to="/about/intro" className="btn-primary group">
                  Wee 프로젝트 소개
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link to="/institution/guide" className="btn-secondary">
                  이용 안내
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <motion.div 
                    className="card glass hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="card-body text-center">
                      <div className="text-4xl mb-2">🏫</div>
                      <div className="text-3xl font-bold text-wee-main">{counters.weeClass.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Wee클래스</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="card glass hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="card-body text-center">
                      <div className="text-4xl mb-2">🏢</div>
                      <div className="text-3xl font-bold text-wee-green">{counters.weeCenter}</div>
                      <div className="text-sm text-gray-600">Wee센터</div>
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-6 mt-12">
                  <motion.div 
                    className="card glass hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <div className="card-body text-center">
                      <div className="text-4xl mb-2">🎓</div>
                      <div className="text-3xl font-bold text-wee-orange">{counters.weeSchool}</div>
                      <div className="text-sm text-gray-600">Wee스쿨</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="card glass hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <div className="card-body text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-3xl font-bold text-wee-purple">{counters.weeHome}</div>
                      <div className="text-sm text-gray-600">가정형 Wee센터</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section bg-gradient-to-b from-white to-gray-50" ref={statsRef}>
        <div className="content-wide">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Wee 프로젝트의 성과</h2>
            <p className="section-subtitle">
              대한민국 교육의 미래를 만들어가는 숫자들
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-wee-main mb-2">
                {counters.students.toLocaleString()}
              </div>
              <div className="text-gray-600">누적 상담 학생 수</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-wee-green mb-2">
                {counters.counselors.toLocaleString()}
              </div>
              <div className="text-gray-600">전문 상담 인력</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-wee-orange mb-2">
                {counters.satisfaction}%
              </div>
              <div className="text-gray-600">학생 만족도</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-5xl lg:text-6xl font-bold text-wee-purple mb-2">
                {counters.programs.toLocaleString()}
              </div>
              <div className="text-gray-600">운영 프로그램</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Showcase Section */}
      <section className="section bg-white">
        <div className="content-wide">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">주요 서비스</h2>
            <p className="section-subtitle">
              Wee 프로젝트가 제공하는 다양한 서비스를 만나보세요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/resources" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-main to-wee-blue rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-wee-light rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-main transition-colors">자료실</h3>
                  <p className="text-gray-600">
                    매뉴얼, 프로그램 자료, 우수사례집 등 다양한 자료를 제공합니다.
                  </p>
                  <div className="mt-4 flex items-center text-wee-main opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/institution" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-green to-wee-teal rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-green transition-colors">기관 찾기</h3>
                  <p className="text-gray-600">
                    가까운 Wee 프로젝트 기관을 찾아 도움을 받으실 수 있습니다.
                  </p>
                  <div className="mt-4 flex items-center text-wee-green opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/notice/survey" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-purple to-wee-coral rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-purple transition-colors">설문조사</h3>
                  <p className="text-gray-600">
                    Wee 프로젝트 관련 설문조사에 참여하고 결과를 확인하세요.
                  </p>
                  <div className="mt-4 flex items-center text-wee-purple opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/newsletter" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-orange to-wee-yellow rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-orange transition-colors">뉴스레터</h3>
                  <p className="text-gray-600">
                    Wee 프로젝트의 최신 소식과 유용한 정보를 받아보세요.
                  </p>
                  <div className="mt-4 flex items-center text-wee-orange opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/about/intro" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-teal to-wee-skyblue rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-teal transition-colors">사업소개</h3>
                  <p className="text-gray-600">
                    Wee 프로젝트의 비전과 추진체계, 조직구성을 확인하세요.
                  </p>
                  <div className="mt-4 flex items-center text-wee-teal opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/dashboard" className="card-interactive group h-full block">
                <div className="h-2 bg-gradient-to-r from-wee-coral to-wee-purple rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="card-body">
                  <motion.div 
                    className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-8 h-8 text-wee-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-wee-coral transition-colors">대시보드</h3>
                  <p className="text-gray-600">
                    통계와 데이터를 한눈에 확인하고 관리할 수 있습니다.
                  </p>
                  <div className="mt-4 flex items-center text-wee-coral opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Carousel */}
      <section className="section bg-gradient-to-b from-gray-50 to-white">
        <div className="content-wide">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">이용자들의 목소리</h2>
            <p className="section-subtitle">
              Wee 프로젝트를 통해 변화된 삶의 이야기들
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl mb-6">{testimonials[currentTestimonial].avatar}</div>
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'w-8 bg-wee-main'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Logos Section */}
      <section className="section bg-white">
        <div className="content-wide">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">함께하는 기관</h2>
            <p className="section-subtitle">
              Wee 프로젝트와 함께 대한민국 교육의 미래를 만들어갑니다
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-5xl mb-3">{partner.logo}</div>
                <div className="text-sm text-gray-600 text-center">{partner.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary CTA Section */}
      <section className="section bg-gradient-to-r from-wee-main to-wee-blue text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundSize: "60px 60px"
          }}
        />
        <div className="content-wide text-center relative z-10">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            도움이 필요하신가요?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Wee 프로젝트는 학생, 학부모, 교사 모두를 위한 종합적인 지원 서비스를 제공합니다.
          </motion.p>
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/institution/faq"
              className="inline-flex items-center px-8 py-4 bg-white text-wee-main rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              자주 묻는 질문
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-wee-main transition-all duration-300 group"
            >
              회원가입
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Secondary CTA Section */}
      <section className="section bg-gradient-to-b from-gray-50 to-white">
        <div className="content-wide">
          <div className="bg-gradient-to-r from-wee-purple to-wee-coral rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">전문 상담사와 함께하세요</h3>
                <p className="text-lg opacity-90 mb-6">
                  12,000명 이상의 전문 상담사가 여러분의 이야기를 들을 준비가 되어 있습니다.
                </p>
                <Link
                  to="/institution/map"
                  className="inline-flex items-center px-6 py-3 bg-white text-wee-purple rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
                >
                  가까운 기관 찾기
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-full">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section bg-wee-bg-light">
        <div className="content-wide">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">공지사항</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="badge badge-primary mr-2 mt-1">New</span>
                    <Link to="/notice/1" className="text-gray-600 hover:text-wee-main transition-colors">
                      2024년 상반기 교육 프로그램 안내
                    </Link>
                  </li>
                  <li className="flex items-start">
                    <span className="badge badge-warning mr-2 mt-1">중요</span>
                    <Link to="/notice/2" className="text-gray-600 hover:text-wee-main transition-colors">
                      Wee 클래스 운영 매뉴얼 개정
                    </Link>
                  </li>
                  <li>
                    <Link to="/notice/3" className="text-gray-600 hover:text-wee-main transition-colors">
                      신규 상담사 모집 공고
                    </Link>
                  </li>
                </ul>
                <Link to="/notice/announcement" className="inline-flex items-center mt-4 text-wee-main hover:text-wee-dark font-medium">
                  더보기
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">자주 묻는 질문</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/faq/1" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Wee 프로젝트란 무엇인가요?
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq/2" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      상담 신청은 어떻게 하나요?
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq/3" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      교육 프로그램 참여 방법
                    </Link>
                  </li>
                </ul>
                <Link to="/institution/faq" className="inline-flex items-center mt-4 text-wee-main hover:text-wee-dark font-medium">
                  더보기
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">빠른 링크</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/resources/manual" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      매뉴얼 다운로드
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources/program" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      프로그램 자료실
                    </Link>
                  </li>
                  <li>
                    <Link to="/newsletter" className="text-gray-600 hover:text-wee-main transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2 text-wee-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      뉴스레터 구독
                    </Link>
                  </li>
                </ul>
                <Link to="/resources" className="inline-flex items-center mt-4 text-wee-main hover:text-wee-dark font-medium">
                  자료실 바로가기
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;