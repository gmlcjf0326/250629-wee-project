// User type
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

// User Role type
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// User Session type
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

// EPKI Certificate type
export interface EPKICertificate {
  id: string;
  userId?: string;
  certId: string;
  certDn: string;
  issuerDn: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  createdAt: Date;
}

// Permission type
export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
}

// Audit Log type
export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Auth Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface EPKILoginRequest {
  certData: string;
  signature: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  organization?: string;
  position?: string;
  purpose?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

// Permission check types
export interface PermissionCheck {
  resource: string;
  action: string;
}

export interface HasPermissionResult {
  allowed: boolean;
  reason?: string;
}