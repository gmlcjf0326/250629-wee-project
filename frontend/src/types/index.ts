// Project Info
export interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  vision?: string;
  mission?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'wee-class' | 'wee-center' | 'wee-school' | 'home-wee';
  features: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Inquiry
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Center
export interface Center {
  id: string;
  name: string;
  type: 'wee-class' | 'wee-center' | 'wee-school' | 'home-wee';
  region?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  services: string[];
  operatingHours?: {
    [key: string]: { open: string; close: string };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notice
export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'recruitment' | 'education';
  author?: string;
  isPinned: boolean;
  isPublished: boolean;
  viewCount: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Resource
export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: 'manual' | 'program' | 'case-study' | 'form' | 'video';
  type: 'document' | 'video' | 'image' | 'archive';
  fileUrl?: string;
  fileSize?: number;
  downloadCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Survey
export interface Survey {
  id: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: string;
  isActive: boolean;
  isRequired: boolean;
  questions: SurveyQuestion[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Survey Question
export interface SurveyQuestion {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'date' | 'file';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: number;
  };
  order: number;
}

// Survey Response
export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  respondentInfo?: any;
  answers: Record<string, any>;
  isComplete: boolean;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// File Upload
export interface FileUpload {
  id: string;
  originalName: string;
  storedName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  entityType?: string;
  entityId?: string;
  uploadedBy?: string;
  isPublic: boolean;
  metadata?: any;
  createdAt: Date;
}

// User
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'counselor' | 'user';
  organization?: string;
  department?: string;
  position?: string;
  epkiCertId?: string;
  epkiVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}