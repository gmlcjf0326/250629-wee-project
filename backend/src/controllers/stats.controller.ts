import { Request, Response } from 'express';
import databaseService from '../services/database.service';

export const statsController = {
  // Get dashboard statistics
  async getDashboardStats(_req: Request, res: Response) {
    try {
      // Mock data for now - will be replaced with actual database queries
      const stats = {
        totalCenters: 4520,
        totalConsultations: 125340,
        totalStudents: 89200,
        satisfactionRate: 92.5,
        monthlyTrend: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          consultations: [10234, 11342, 12456, 13678, 14892, 15340],
          students: [7234, 7892, 8456, 8923, 9234, 9200],
        },
        serviceDistribution: [
          { label: 'Wee 클래스', value: 45 },
          { label: 'Wee 센터', value: 30 },
          { label: 'Wee 스쿨', value: 15 },
          { label: '가정형 Wee', value: 10 },
        ],
        regionDistribution: [
          { region: '서울', centers: 520, consultations: 23450 },
          { region: '경기', centers: 680, consultations: 31200 },
          { region: '인천', centers: 220, consultations: 9800 },
          { region: '부산', centers: 340, consultations: 15600 },
          { region: '대구', centers: 280, consultations: 12300 },
          { region: '광주', centers: 180, consultations: 7900 },
          { region: '대전', centers: 160, consultations: 6800 },
          { region: '울산', centers: 140, consultations: 5900 },
        ],
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard statistics',
      });
    }
  },

  // Get service statistics
  async getServiceStats(req: Request, res: Response) {
    try {
      const { serviceId } = req.query;

      // Mock data - replace with actual queries
      const serviceStats = {
        serviceId,
        totalCenters: 1250,
        totalStaff: 3400,
        totalBeneficiaries: 45000,
        programsOffered: 125,
        monthlyData: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          beneficiaries: [3500, 3800, 4100, 4300, 4500, 4800],
          programs: [95, 98, 105, 110, 118, 125],
        },
        satisfactionByProgram: [
          { program: '개인상담', satisfaction: 94.5 },
          { program: '집단상담', satisfaction: 91.2 },
          { program: '심리검사', satisfaction: 93.8 },
          { program: '부모교육', satisfaction: 89.7 },
        ],
      };

      res.json({
        success: true,
        data: serviceStats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch service statistics',
      });
    }
  },

  // Get consultation statistics
  async getConsultationStats(req: Request, res: Response) {
    try {
      const { startDate, endDate, region, serviceType } = req.query;

      // Mock data - replace with actual queries
      const consultationStats = {
        filters: { startDate, endDate, region, serviceType },
        totalConsultations: 15340,
        averagePerDay: 512,
        topIssues: [
          { issue: '학업/진로', count: 4602, percentage: 30 },
          { issue: '교우관계', count: 3835, percentage: 25 },
          { issue: '가족관계', count: 2301, percentage: 15 },
          { issue: '정서/행동', count: 2301, percentage: 15 },
          { issue: '기타', count: 2301, percentage: 15 },
        ],
        byAgeGroup: [
          { ageGroup: '초등', count: 4602, percentage: 30 },
          { ageGroup: '중등', count: 5369, percentage: 35 },
          { ageGroup: '고등', count: 5369, percentage: 35 },
        ],
        byGender: [
          { gender: '남', count: 7363, percentage: 48 },
          { gender: '여', count: 7977, percentage: 52 },
        ],
        weeklyTrend: {
          labels: ['월', '화', '수', '목', '금'],
          counts: [3068, 3221, 3375, 2914, 2762],
        },
      };

      res.json({
        success: true,
        data: consultationStats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch consultation statistics',
      });
    }
  },

  // Get survey statistics
  async getSurveyStats(req: Request, res: Response) {
    try {
      const { surveyId } = req.query;

      // Mock data - replace with actual queries
      const surveyStats = {
        surveyId,
        totalResponses: 1234,
        completionRate: 87.5,
        averageCompletionTime: '12분 35초',
        responsesByDate: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
          counts: [145, 234, 189, 267, 156, 123, 120],
        },
        questionStats: [
          {
            questionId: 'q1',
            question: '서비스 만족도',
            type: 'rating',
            averageRating: 4.3,
            distribution: [
              { rating: 5, count: 567 },
              { rating: 4, count: 432 },
              { rating: 3, count: 156 },
              { rating: 2, count: 45 },
              { rating: 1, count: 34 },
            ],
          },
          {
            questionId: 'q2',
            question: '가장 도움이 된 프로그램',
            type: 'multiple-choice',
            responses: [
              { option: '개인상담', count: 456, percentage: 37 },
              { option: '집단상담', count: 345, percentage: 28 },
              { option: '심리검사', count: 234, percentage: 19 },
              { option: '부모교육', count: 199, percentage: 16 },
            ],
          },
        ],
      };

      res.json({
        success: true,
        data: surveyStats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch survey statistics',
      });
    }
  },

  // Export statistics
  async exportStats(req: Request, res: Response) {
    try {
      const { type, format = 'csv' } = req.query;

      // Mock CSV data
      const csvData = `날짜,상담건수,이용학생수,만족도
2024-01,10234,7234,91.2
2024-02,11342,7892,92.1
2024-03,12456,8456,92.5
2024-04,13678,8923,92.8
2024-05,14892,9234,93.1
2024-06,15340,9200,92.5`;

      res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename=wee-stats-${type}-${new Date().toISOString().split('T')[0]}.${format}`);
      res.send(csvData);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export statistics',
      });
    }
  },
};