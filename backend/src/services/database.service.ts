import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';
import { 
  ProjectInfo, 
  Service, 
  ContactInquiry, 
  Notice, 
  Resource,
  Survey,
  SurveyResponse,
  FileUpload
} from '../types';

class DatabaseService {
  // Check if Supabase is configured
  private checkConfig() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    }
  }

  // Project Info
  async getProjectInfo(): Promise<ProjectInfo | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('project_info')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching project info:', error);
      return null;
    }
    return data;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data || [];
  }

  async getServiceById(id: string): Promise<Service | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching service:', error);
      return null;
    }
    return data;
  }

  // Contact Inquiries
  async createContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactInquiry | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('contact_inquiries')
      .insert([inquiry])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact inquiry:', error);
      return null;
    }
    return data;
  }

  // Notices
  async getAllNotices(limit: number = 20, offset: number = 0): Promise<Notice[]> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching notices:', error);
      return [];
    }
    return data || [];
  }

  async getNoticeById(id: string): Promise<Notice | null> {
    this.checkConfig();
    
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }
    
    // First get the current view count
    const { data: currentNotice } = await supabaseAdmin
      .from('notices')
      .select('view_count')
      .eq('id', id)
      .single();
    
    if (currentNotice) {
      // Increment view count
      await supabaseAdmin
        .from('notices')
        .update({ view_count: (currentNotice.view_count || 0) + 1 })
        .eq('id', id);
    }
    
    const { data, error } = await supabaseAdmin
      .from('notices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching notice:', error);
      return null;
    }
    return data;
  }

  // Resources
  async getAllResources(category?: string): Promise<Resource[]> {
    this.checkConfig();
    let query = supabaseAdmin!
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
    return data || [];
  }

  async incrementResourceDownload(id: string): Promise<void> {
    this.checkConfig();
    
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }
    
    // First get the current download count
    const { data: currentResource } = await supabaseAdmin
      .from('resources')
      .select('download_count')
      .eq('id', id)
      .single();
    
    if (currentResource) {
      // Increment download count
      await supabaseAdmin
        .from('resources')
        .update({ download_count: (currentResource.download_count || 0) + 1 })
        .eq('id', id);
    }
  }

  // Surveys
  async getActiveSurveys(): Promise<Survey[]> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('surveys')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching surveys:', error);
      return [];
    }
    return data || [];
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching survey:', error);
      return null;
    }
    return data;
  }

  async createSurveyResponse(response: Omit<SurveyResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<SurveyResponse | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('survey_responses')
      .insert([response])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating survey response:', error);
      return null;
    }
    return data;
  }

  // File Uploads
  async createFileUpload(fileData: Omit<FileUpload, 'id' | 'createdAt'>): Promise<FileUpload | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('file_uploads')
      .insert([fileData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating file upload record:', error);
      return null;
    }
    return data;
  }

  async getFileUpload(id: string): Promise<FileUpload | null> {
    this.checkConfig();
    const { data, error } = await supabaseAdmin!
      .from('file_uploads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching file upload:', error);
      return null;
    }
    return data;
  }
}

export default new DatabaseService();