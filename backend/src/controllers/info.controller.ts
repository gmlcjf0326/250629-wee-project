import { Request, Response, NextFunction } from 'express';
import { ProjectInfo } from '../types';

// Mock data - will be replaced with database queries
const mockProjectInfo: ProjectInfo = {
  id: '1',
  title: '위(Wee) 프로젝트',
  description: 'We(우리들) + Education(교육) + Emotion(감성)의 합성어로, 학생들의 건강하고 즐거운 학교생활을 위해 학교, 교육청, 지역사회가 연계하여 학생들의 학교생활 적응을 돕는 다중 통합지원 서비스망입니다.',
  vision: '모든 학생이 행복한 학교생활을 영위할 수 있는 교육환경 조성',
  mission: '학생 개개인의 특성과 요구에 맞는 맞춤형 상담 및 교육 서비스 제공',
  createdAt: new Date('2008-01-01'),
  updatedAt: new Date()
};

export const getProjectInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: mockProjectInfo
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    // TODO: Validate input data
    // TODO: Update database

    res.json({
      success: true,
      message: 'Project information updated successfully',
      data: { ...mockProjectInfo, ...req.body, updatedAt: new Date() }
    });
  } catch (error) {
    next(error);
  }
};