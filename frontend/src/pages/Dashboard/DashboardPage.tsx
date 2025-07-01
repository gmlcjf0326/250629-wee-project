import React, { useState } from 'react';
import { StatCard } from '../../components/charts/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '../../api/stats';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Fetch stats data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: statsAPI.getDashboardStats,
  });

  // Mock data for now - will be replaced with API calls
  const mockStats = {
    totalCenters: 4520,
    totalConsultations: 125340,
    totalStudents: 89200,
    satisfactionRate: 92.5,
  };

  const mockMonthlyData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    consultations: [10234, 11342, 12456, 13678, 14892, 15340],
    students: [7234, 7892, 8456, 8923, 9234, 9200],
  };

  const mockServiceDistribution = {
    labels: ['Wee 클래스', 'Wee 센터', 'Wee 스쿨', '가정형 Wee'],
    data: [45, 30, 15, 10],
  };

  const mockRegionData = {
    labels: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산'],
    centers: [520, 680, 220, 340, 280, 180, 160, 140],
  };

  const recentActivities = [
    { id: 1, type: 'consultation', title: '상담 완료', description: '김○○ 학생 진로상담', time: '10분 전', icon: '💬' },
    { id: 2, type: 'program', title: '프로그램 참여', description: '집단상담 프로그램 신청', time: '1시간 전', icon: '👥' },
    { id: 3, type: 'survey', title: '설문 응답', description: '만족도 조사 참여', time: '3시간 전', icon: '📊' },
    { id: 4, type: 'resource', title: '자료 다운로드', description: '상담 매뉴얼 다운로드', time: '5시간 전', icon: '📚' },
  ];

  const quickLinks = [
    { path: '/survey', title: '설문조사', icon: '📝', color: 'from-blue-500 to-blue-600' },
    { path: '/resources/manual', title: '자료실', icon: '📚', color: 'from-green-500 to-green-600' },
    { path: '/community', title: '커뮤니티', icon: '💬', color: 'from-purple-500 to-purple-600' },
    { path: '/profile', title: '내 정보', icon: '👤', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="page-wrapper">
      <div className="content-wide">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-wee-main to-wee-blue rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            안녕하세요, {user?.name || '사용자'}님! 👋
          </h1>
          <p className="text-lg opacity-90">
            오늘도 Wee 프로젝트와 함께 행복한 하루 되세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-sm opacity-90">마지막 접속</span>
              <p className="font-semibold">2024.06.30 14:32</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-sm opacity-90">회원 등급</span>
              <p className="font-semibold">{user?.role === 'admin' ? '관리자' : '일반회원'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.path}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link
              to={link.path}
              className="block bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all p-6 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{link.icon}</span>
              </div>
              <p className="font-medium text-gray-900">{link.title}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Period Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">통계 현황</h2>
        <div className="bg-white rounded-full shadow-soft p-1 flex">
          {['week', 'month', 'year'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-wee-main text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === 'week' ? '주간' : period === 'month' ? '월간' : '연간'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="전체 기관 수"
          value={mockStats.totalCenters.toLocaleString()}
          description="운영 중인 Wee 기관"
          color="primary"
          trend={{ value: 5.2, isPositive: true }}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        
        <StatCard
          title="총 상담 건수"
          value={mockStats.totalConsultations.toLocaleString()}
          description="이번 달 상담 진행"
          color="success"
          trend={{ value: 12.8, isPositive: true }}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="이용 학생 수"
          value={mockStats.totalStudents.toLocaleString()}
          description="누적 이용 학생"
          color="info"
          trend={{ value: 8.4, isPositive: true }}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        
        <StatCard
          title="만족도"
          value={`${mockStats.satisfactionRate}%`}
          description="서비스 만족도"
          color="warning"
          trend={{ value: 2.1, isPositive: true }}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">월별 이용 현황</h3>
          <LineChart
            data={{
              labels: mockMonthlyData.labels,
              datasets: [
                {
                  label: '상담 건수',
                  data: mockMonthlyData.consultations,
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                },
                {
                  label: '이용 학생',
                  data: mockMonthlyData.students,
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.5)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">서비스별 이용 분포</h3>
          <PieChart
            data={{
              labels: mockServiceDistribution.labels,
              datasets: [
                {
                  data: mockServiceDistribution.data,
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                  ],
                  borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 146, 60, 1)',
                    'rgba(147, 51, 234, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regional Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">지역별 기관 분포</h3>
          <BarChart
            data={{
              labels: mockRegionData.labels,
              datasets: [
                {
                  label: '운영 기관 수',
                  data: mockRegionData.centers,
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/profile"
            className="block mt-6 text-center text-sm text-wee-main hover:underline font-medium"
          >
            모든 활동 보기 →
          </Link>
        </motion.div>
      </div>
      </div>
    </div>
  );
};