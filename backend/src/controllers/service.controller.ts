import { Request, Response, NextFunction } from 'express';
import { Service } from '../types';

// Mock data - will be replaced with database
const services: Service[] = [
  {
    id: '1',
    name: 'Wee 클래스',
    description: '학교 내 설치된 상담실로, 전문상담교사가 상주하여 학생들의 심리·정서적 지원을 제공합니다.',
    category: 'wee-class',
    features: [
      '개인 상담 및 집단 상담',
      '심리검사 및 해석',
      '위기 상황 개입',
      '학교 적응 프로그램 운영'
    ],
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Wee 센터',
    description: '교육지원청 단위로 설치된 전문적인 상담 기관으로, 학교에서 해결하기 어려운 사례를 지원합니다.',
    category: 'wee-center',
    features: [
      '전문적인 심리 상담',
      '정신과 자문의 지원',
      '학부모 상담 및 교육',
      '교사 컨설팅'
    ],
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Wee 스쿨',
    description: '장기 위탁교육 기관으로, 학교 부적응 학생들을 위한 대안교육을 제공합니다.',
    category: 'wee-school',
    features: [
      '개별화된 교육과정',
      '진로·직업 교육',
      '치료 프로그램',
      '기숙형 운영'
    ],
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: '가정형 Wee 센터',
    description: '가정과 같은 환경에서 치료와 교육을 병행하는 기숙형 대안교육 시설입니다.',
    category: 'home-wee',
    features: [
      '24시간 보호 및 지원',
      '개별 맞춤형 치료',
      '가족 상담',
      '사회 적응 훈련'
    ],
    isActive: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, isActive } = req.query;
    
    let filteredServices = services;
    
    if (category) {
      filteredServices = filteredServices.filter(s => s.category === category);
    }
    
    if (isActive !== undefined) {
      filteredServices = filteredServices.filter(s => s.isActive === (isActive === 'true'));
    }
    
    // Sort by order
    filteredServices.sort((a, b) => a.order - b.order);
    
    return res.json({
      success: true,
      data: filteredServices
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    return res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    
    const newService: Service = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    services.push(newService);
    
    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    
    const { id } = req.params;
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...req.body,
      id,
      updatedAt: new Date()
    };
    
    return res.json({
      success: true,
      message: 'Service updated successfully',
      data: services[serviceIndex]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    
    const { id } = req.params;
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    services.splice(serviceIndex, 1);
    
    return res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};