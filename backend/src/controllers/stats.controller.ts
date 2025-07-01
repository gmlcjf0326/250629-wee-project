import { Request, Response } from 'express';
import statsService from '../services/stats.service';
import { asyncHandler } from '../utils/asyncHandler';

export const statsController = {
  // Get dashboard statistics
  getDashboardStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await statsService.getDashboardStats();
    
    res.json({
      success: true,
      data: stats,
    });
  }),

  // Get activity logs
  getActivityLogs: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const activities = await statsService.getActivityLogs(limit);
    
    res.json({
      success: true,
      data: activities,
    });
  }),

  // Get chart data
  getChartData: asyncHandler(async (req: Request, res: Response) => {
    const { type, range } = req.query;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Chart type is required',
      });
    }
    
    const data = await statsService.getChartData(
      type as string,
      range as string || '7days'
    );
    
    res.json({
      success: true,
      data,
    });
  }),

  // Get content statistics
  getContentStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await statsService.getContentStats();
    
    res.json({
      success: true,
      data: stats,
    });
  }),

  // Get user growth data
  getUserGrowth: asyncHandler(async (req: Request, res: Response) => {
    const period = req.query.period as 'daily' | 'weekly' | 'monthly' || 'daily';
    const growth = await statsService.getUserGrowth(period);
    
    res.json({
      success: true,
      data: growth,
    });
  }),

  // Get service statistics (legacy - keeping for compatibility)
  getServiceStats: asyncHandler(async (req: Request, res: Response) => {
    // Mock data for legacy endpoint
    const serviceStats = {
      serviceId: req.query.serviceId,
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
  }),

  // Get consultation statistics (legacy - keeping for compatibility)
  getConsultationStats: asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate, region, serviceType } = req.query;

    // Mock data for legacy endpoint
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
  }),

  // Get survey statistics
  getSurveyStats: asyncHandler(async (req: Request, res: Response) => {
    const { surveyId } = req.query;

    if (!surveyId) {
      return res.status(400).json({
        success: false,
        message: 'Survey ID is required',
      });
    }

    // Use the survey service to get real stats
    const surveyService = (await import('../services/survey.service')).default;
    const stats = await surveyService.getSurveyStatistics(surveyId as string);

    res.json({
      success: true,
      data: stats,
    });
  }),

  // Export statistics
  exportStats: asyncHandler(async (req: Request, res: Response) => {
    const { type, format = 'csv' } = req.query;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Export type is required',
      });
    }

    // Get data based on type
    let data: any;
    let headers: string[] = [];
    let rows: any[][] = [];

    switch (type) {
      case 'dashboard':
        data = await statsService.getDashboardStats();
        headers = ['Category', 'Total', 'Active', 'Today'];
        rows = [
          ['Users', data.users.total, data.users.activeToday, data.users.newThisMonth],
          ['Notices', data.notices.total, data.notices.published, data.notices.viewsToday],
          ['Surveys', data.surveys.total, data.surveys.active, data.surveys.responsesToday],
          ['Resources', data.resources.total, '-', data.resources.downloadsToday],
          ['Contacts', data.contacts.total, data.contacts.pending, data.contacts.todayCount],
        ];
        break;

      case 'users':
        const userGrowth = await statsService.getUserGrowth('daily');
        headers = ['Date', 'New Users', 'Total Users'];
        rows = userGrowth.map(g => [g.period, g.count, g.total]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type',
        });
    }

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=wee-stats-${type}-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvContent);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=wee-stats-${type}-${new Date().toISOString().split('T')[0]}.json`);
      res.json({
        headers,
        data: rows,
        metadata: {
          type,
          exportedAt: new Date().toISOString(),
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid export format. Use csv or json',
      });
    }
  }),
};