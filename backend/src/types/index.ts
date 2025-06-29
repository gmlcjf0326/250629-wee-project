// Project Info Types
export interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'wee-class' | 'wee-center' | 'wee-school' | 'home-wee';
  features: string[];
  imageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notice Types
export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'news' | 'event';
  author: string;
  viewCount: number;
  isPinned: boolean;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'manual' | 'program' | 'case-study';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Institution Types
export interface Institution {
  id: string;
  name: string;
  type: 'wee-class' | 'wee-center' | 'wee-school' | 'home-wee';
  region: string;
  address: string;
  phone: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  services: string[];
  operatingHours: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  viewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter Types
export interface Newsletter {
  id: string;
  title: string;
  content: string;
  issueNumber: number;
  publishedAt: Date;
  attachmentUrl?: string;
  subscriberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Attachment Types
export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

// Statistics Types
export interface Statistics {
  totalInstitutions: {
    weeClass: number;
    weeCenter: number;
    weeSchool: number;
    homeWee: number;
  };
  yearlyGrowth: {
    year: number;
    count: number;
  }[];
  regionalDistribution: {
    region: string;
    count: number;
  }[];
}

// Contact Inquiry Types (alias for Contact)
export type ContactInquiry = Contact;

// Survey Types
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'scale' | 'textarea';
  options?: string[];
  required: boolean;
  order: number;
}

// Survey Response Types
export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  respondentInfo?: Record<string, any>;
  answers?: Record<string, any>;
  responses?: Record<string, any>;
  isComplete?: boolean;
  completedAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// File Upload Types
export interface FileUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string;
  createdAt: Date;
  originalName?: string;
  storedName?: string;
  filePath?: string;
  entityType?: string;
  entityId?: string;
  isPublic?: boolean;
  metadata?: any;
}