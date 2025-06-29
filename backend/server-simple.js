const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Wee Project API',
    version: '1.0.0',
    endpoints: {
      info: '/api/info',
      contact: '/api/contact',
      services: '/api/services',
      notices: '/api/notices',
      resources: '/api/resources'
    }
  });
});

// Mock data
const mockProjectInfo = {
  id: '1',
  title: '위(Wee) 프로젝트',
  description: 'We(우리들) + Education(교육) + Emotion(감성)의 합성어로, 학생들의 건강하고 즐거운 학교생활을 위해 학교, 교육청, 지역사회가 연계하여 학생들의 학교생활 적응을 돕는 다중 통합지원 서비스망입니다.',
  vision: '모든 학생이 행복한 학교생활을 영위할 수 있는 교육환경 조성',
  mission: '학생 개개인의 특성과 요구에 맞는 맞춤형 상담 및 교육 서비스 제공',
  createdAt: new Date('2008-01-01'),
  updatedAt: new Date()
};

// Project Info API
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: mockProjectInfo
  });
});

// Contact API
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: name, email, subject, message'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Contact inquiry submitted successfully',
    data: {
      id: Date.now().toString(),
      name,
      email,
      phone,
      subject,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

// Services API
const services = [
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
    order: 1
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
    order: 2
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
    order: 3
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
    order: 4
  }
];

app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: services
  });
});

app.get('/api/services/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  res.json({
    success: true,
    data: service
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});