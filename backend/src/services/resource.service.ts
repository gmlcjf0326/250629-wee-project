import { supabaseAdmin } from '../config/supabase';
import fileService from './file.service';

export interface Resource {
  id?: string;
  title: string;
  description?: string;
  category: string;
  type: 'manual' | 'program' | 'case';
  tags?: string[];
  version?: string;
  file_id?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  download_count?: number;
  is_active?: boolean;
  uploaded_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResourceQuery {
  type?: string;
  category?: string;
  sort?: 'newest' | 'popular' | 'name';
  search?: string;
  tags?: string[];
  is_active?: boolean;
  page?: number;
  limit?: number;
}

class ResourceService {
  async getResources(query: ResourceQuery) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const {
      type,
      category,
      sort = 'newest',
      search,
      tags,
      is_active = true,
      page = 1,
      limit = 20
    } = query;

    let dbQuery = supabaseAdmin
      .from('wee_resources')
      .select('*', { count: 'exact' });

    // Apply filters
    if (type) {
      dbQuery = dbQuery.eq('category', type);
    }

    if (category && category !== 'all') {
      dbQuery = dbQuery.eq('subcategory', category);
    }

    if (search) {
      dbQuery = dbQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (tags && tags.length > 0) {
      dbQuery = dbQuery.contains('tags', tags);
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        dbQuery = dbQuery.order('download_count', { ascending: false });
        break;
      case 'name':
        dbQuery = dbQuery.order('title', { ascending: true });
        break;
      case 'newest':
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    dbQuery = dbQuery.range(startIndex, startIndex + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return {
      resources: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async getResourceById(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('wee_resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createResource(resource: Resource, file: Express.Multer.File, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Upload file to storage
    const fileResult = await fileService.uploadFile(
      file,
      'resources',
      userId,
      resource.type
    );

    // Create resource record
    const newResource = {
      title: resource.title,
      description: resource.description,
      category: resource.type,
      subcategory: resource.category,
      tags: resource.tags || [],
      version: resource.version,
      file_url: fileResult.publicUrl || fileResult.path,
      file_size: String(fileResult.fileSize),
      file_type: fileResult.mimeType,
      author: userId,
      download_count: 0,
      source_url: 'admin',
      scraped_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('wee_resources')
      .insert(newResource)
      .select()
      .single();

    if (error) {
      // Rollback file upload
      await fileService.deleteFile(fileResult.id, userId);
      throw error;
    }

    // Update file metadata with resource ID
    await supabaseAdmin
      .from('files')
      .update({
        metadata: {
          ...fileResult,
          resource_id: data.id
        }
      })
      .eq('id', fileResult.id);

    return data;
  }

  async updateResource(id: string, updates: Partial<Resource>) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.category) updateData.subcategory = updates.category;
    if (updates.type) updateData.category = updates.type;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.version) updateData.version = updates.version;

    const { data, error } = await supabaseAdmin
      .from('wee_resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteResource(id: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get resource to find associated file
    const resource = await this.getResourceById(id);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('wee_resources')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Try to delete associated file
    if (resource.file_id) {
      try {
        await fileService.deleteFile(resource.file_id, userId);
      } catch (fileError) {
        console.error('Error deleting associated file:', fileError);
      }
    }

    return { success: true };
  }

  async incrementDownloadCount(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get current count
    const { data: resource } = await supabaseAdmin
      .from('wee_resources')
      .select('download_count')
      .eq('id', id)
      .single();

    if (resource) {
      await supabaseAdmin
        .from('wee_resources')
        .update({
          download_count: (parseInt(resource.download_count || '0') + 1).toString()
        })
        .eq('id', id);
    }
  }

  async getResourceStats() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Get total resources and downloads
    const { data: resources } = await supabaseAdmin
      .from('wee_resources')
      .select('download_count');

    const totalResources = resources?.length || 0;
    const totalDownloads = resources?.reduce(
      (sum, r) => sum + parseInt(r.download_count || '0'), 
      0
    ) || 0;

    // Get popular resources
    const { data: popularResources } = await supabaseAdmin
      .from('wee_resources')
      .select('*')
      .order('download_count', { ascending: false })
      .limit(5);

    // Get recent resources
    const { data: recentResources } = await supabaseAdmin
      .from('wee_resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      totalResources,
      totalDownloads,
      popularResources: popularResources || [],
      recentResources: recentResources || []
    };
  }

  async getCategories(type?: string) {
    const categoryMap: Record<string, Array<{ value: string; label: string }>> = {
      manual: [
        { value: 'operation', label: '운영 매뉴얼' },
        { value: 'counseling', label: '상담 매뉴얼' },
        { value: 'program', label: '프로그램 매뉴얼' },
        { value: 'crisis', label: '위기대응 매뉴얼' }
      ],
      program: [
        { value: 'emotion', label: '정서·사회성' },
        { value: 'study', label: '학습·진로' },
        { value: 'prevention', label: '예방·교육' },
        { value: 'crisis', label: '위기개입' },
        { value: 'family', label: '가족상담' }
      ],
      case: [
        { value: 'counseling', label: '상담 사례' },
        { value: 'program', label: '프로그램 운영' },
        { value: 'crisis', label: '위기개입' },
        { value: 'collaboration', label: '협력 사례' }
      ]
    };

    if (!type) {
      return categoryMap;
    }

    const categories = categoryMap[type] || [];

    if (supabaseAdmin) {
      // Get counts for each category
      for (const cat of categories) {
        const { count } = await supabaseAdmin
          .from('wee_resources')
          .select('*', { count: 'exact', head: true })
          .eq('category', type)
          .eq('subcategory', cat.value);

        (cat as any).count = count || 0;
      }
    }

    return categories;
  }
}

export default new ResourceService();