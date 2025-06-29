import React from 'react';
import Layout from '../../components/layout/Layout';
import { StatCard } from '../../components/charts/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '../../api/stats';

export const DashboardPage: React.FC = () => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">대시보드</h1>
          <p className="text-gray-600">
            Wee 프로젝트 전체 현황을 한눈에 확인하세요.
          </p>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 이용 현황</h2>
            <LineChart
              labels={mockMonthlyData.labels}
              datasets={[
                {
                  label: '상담 건수',
                  data: mockMonthlyData.consultations,
                },
                {
                  label: '이용 학생수',
                  data: mockMonthlyData.students,
                },
              ]}
              height={300}
            />
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">서비스별 이용 분포</h2>
            <PieChart
              labels={mockServiceDistribution.labels}
              data={mockServiceDistribution.data}
              height={300}
            />
          </div>
        </div>

        {/* Region Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 기관 현황</h2>
          <BarChart
            labels={mockRegionData.labels}
            datasets={[
              {
                label: '기관 수',
                data: mockRegionData.centers,
              },
            ]}
            height={350}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-4">
            {[
              { time: '10분 전', event: '서울 강남구 Wee센터에서 집단상담 프로그램 시작', type: 'info' },
              { time: '25분 전', event: '경기도 수원시 Wee클래스 신규 개설', type: 'success' },
              { time: '1시간 전', event: '부산광역시 해운대구 Wee스쿨 상담사 연수 완료', type: 'warning' },
              { time: '2시간 전', event: '대전광역시 Wee센터 월간 보고서 제출', type: 'info' },
              { time: '3시간 전', event: '인천광역시 가정형 Wee센터 입소 문의 3건', type: 'primary' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.event}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};