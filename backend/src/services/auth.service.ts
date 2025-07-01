import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  JWTPayload,
  UserSession,
  EPKILoginRequest,
  EPKICertificate
} from '../types/auth.types';

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
  private readonly JWT_EXPIRES_IN = '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin!.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName,
          phone: data.phone,
          organization: data.organization,
          position: data.position,
          purpose: data.purpose
        }
      });

      if (authError) {
        // Check for specific Supabase errors
        if (authError.message?.includes('duplicate key value') || 
            authError.message?.includes('already registered') ||
            authError.code === '23505') { // PostgreSQL unique violation
          throw new Error('Email already registered');
        }
        throw authError;
      }

      // Update user profile in public.users table
      const { data: user, error: userError } = await supabaseAdmin!
        .from('users')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          organization: data.organization,
          position: data.position
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (userError) {
        console.error('Error updating user profile:', userError);
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(authData.user.id, data.email, 'user');
      
      return {
        user: this.mapSupabaseUserToUser(authData.user, user),
        accessToken,
        expiresIn: 86400 // 24 hours in seconds
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Login with email and password
  async login(data: LoginRequest): Promise<AuthResponse | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      // Sign in with Supabase using regular client for user authentication
      const { data: authData, error: authError } = await supabase!.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        throw authError;
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabaseAdmin!
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Update last login
      await supabaseAdmin!
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authData.user.id);

      // Generate tokens
      const accessToken = this.generateAccessToken(
        authData.user.id,
        authData.user.email!,
        userProfile?.role || 'user'
      );

      // Create session
      await this.createSession(authData.user.id, accessToken);

      return {
        user: this.mapSupabaseUserToUser(authData.user, userProfile),
        accessToken,
        expiresIn: 86400
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // EPKI Certificate login
  async loginWithEPKI(data: EPKILoginRequest): Promise<AuthResponse | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      // Verify EPKI certificate
      const certificate = await this.verifyEPKICertificate(data.certData, data.signature);
      if (!certificate) {
        throw new Error('Invalid certificate');
      }

      // Find user by certificate ID
      const { data: user, error: userError } = await supabaseAdmin!
        .from('users')
        .select('*')
        .eq('epki_cert_id', certificate.certId)
        .single();

      if (userError || !user) {
        throw new Error('User not found for this certificate');
      }

      // Update last login
      await supabaseAdmin!
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          epki_verified: true
        })
        .eq('id', user.id);

      // Generate token
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);

      // Create session
      await this.createSession(user.id, accessToken);

      return {
        user: this.mapDatabaseUserToUser(user),
        accessToken,
        expiresIn: 86400
      };
    } catch (error) {
      console.error('EPKI login error:', error);
      throw error;
    }
  }

  // Verify EPKI Certificate (mock implementation)
  private async verifyEPKICertificate(certData: string, signature: string): Promise<EPKICertificate | null> {
    // TODO: Implement actual EPKI verification logic
    // This is a mock implementation
    
    // In real implementation, you would:
    // 1. Verify certificate signature
    // 2. Check certificate validity
    // 3. Verify against trusted CA
    // 4. Extract certificate information
    
    const mockCert: EPKICertificate = {
      id: 'mock-cert-id',
      certId: 'EPKI-' + Date.now(),
      certDn: 'CN=Test User,OU=Test Dept,O=Test Org,C=KR',
      issuerDn: 'CN=Test CA,O=Test CA Org,C=KR',
      serialNumber: '1234567890',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isRevoked: false,
      createdAt: new Date()
    };

    return mockCert;
  }

  // Logout
  async logout(userId: string, token: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      // Invalidate session
      await supabaseAdmin!
        .from('user_sessions')
        .delete()
        .eq('user_id', userId)
        .eq('token', token);

      // Note: signOut() is a client-side method and not available on admin client
      // Session invalidation is handled by deleting from user_sessions table above
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      
      // Check if session exists
      const { data: session, error } = await supabaseAdmin!
        .from('user_sessions')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !session || new Date(session.expires_at) < new Date()) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data: user, error } = await supabaseAdmin!
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return null;
      }

      return this.mapDatabaseUserToUser(user);
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, profileData: {
    fullName?: string;
    phone?: string;
    organization?: string;
    department?: string;
    position?: string;
  }): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (profileData.fullName !== undefined) {
        updateData.full_name = profileData.fullName;
      }
      if (profileData.phone !== undefined) {
        updateData.phone = profileData.phone;
      }
      if (profileData.organization !== undefined) {
        updateData.organization = profileData.organization;
      }
      if (profileData.department !== undefined) {
        updateData.department = profileData.department;
      }
      if (profileData.position !== undefined) {
        updateData.position = profileData.position;
      }

      const { data: user, error } = await supabaseAdmin!
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.mapDatabaseUserToUser(user);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Check email availability
  async checkEmailAvailability(email: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    try {
      // First check in auth.users via admin API
      const { data: authUsers, error: authError } = await supabaseAdmin!.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error checking auth users:', authError);
        // Fallback to checking users table
        const { data, error } = await supabaseAdmin!
          .from('users')
          .select('id')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        // If no user found, email is available
        return !data;
      }

      // Check if email exists in auth users
      const emailExists = authUsers.users.some(user => 
        user.email?.toLowerCase() === email.toLowerCase()
      );

      return !emailExists;
    } catch (error) {
      console.error('Check email availability error:', error);
      // In case of error, assume email is not available to prevent duplicate registrations
      return false;
    }
  }

  // Check user permissions
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false;
    }

    try {
      // Get user role
      const { data: user, error: userError } = await supabaseAdmin!
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return false;
      }

      // Admin has all permissions
      if (user.role === 'admin') {
        return true;
      }

      // Check role permissions
      const { data: rolePerms, error: roleError } = await supabaseAdmin!
        .from('user_roles')
        .select('permissions')
        .eq('name', user.role)
        .single();

      if (roleError || !rolePerms) {
        return false;
      }

      // Check if role has wildcard permission
      if (rolePerms.permissions.includes('*')) {
        return true;
      }

      // Check specific permission
      const permissionString = `${action}:${resource}`;
      const wildcardPermission = `${action}:*`;
      
      return rolePerms.permissions.includes(permissionString) || 
             rolePerms.permissions.includes(wildcardPermission);
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Private helper methods
  private generateAccessToken(userId: string, email: string, role: string): string {
    const payload: JWTPayload = {
      sub: userId,
      email,
      role
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  private async createSession(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    await supabaseAdmin!
      .from('user_sessions')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt.toISOString()
      });
  }

  private mapSupabaseUserToUser(supabaseUser: any, profileData?: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      fullName: profileData?.full_name || supabaseUser.user_metadata?.full_name,
      phone: profileData?.phone || supabaseUser.user_metadata?.phone,
      role: profileData?.role || 'user',
      organization: profileData?.organization,
      department: profileData?.department,
      position: profileData?.position,
      epkiCertId: profileData?.epki_cert_id,
      epkiVerified: profileData?.epki_verified || false,
      isActive: profileData?.is_active ?? true,
      lastLoginAt: profileData?.last_login_at ? new Date(profileData.last_login_at) : undefined,
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: profileData?.updated_at ? new Date(profileData.updated_at) : new Date()
    };
  }

  private mapDatabaseUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.full_name,
      phone: dbUser.phone,
      role: dbUser.role,
      organization: dbUser.organization,
      department: dbUser.department,
      position: dbUser.position,
      epkiCertId: dbUser.epki_cert_id,
      epkiVerified: dbUser.epki_verified || false,
      isActive: dbUser.is_active,
      lastLoginAt: dbUser.last_login_at ? new Date(dbUser.last_login_at) : undefined,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at)
    };
  }
}

export default new AuthService();