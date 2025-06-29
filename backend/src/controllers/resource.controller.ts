import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const resourceController = {
  // Get all resources with filters
  async getResources(req: Request, res: Response) {
    try {
      const { 
        type, 
        category, 
        sort = 'newest', 
        search,
        tags,
        is_active = true,
        page = 1,
        limit = 20 
      } = req.query;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      let query = supabase
        .from('resources')
        .select('*')
        .eq('is_active', is_active);

      // Apply filters
      if (type) {
        query = query.eq('type', type);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (tags && Array.isArray(tags)) {
        query = query.contains('tags', tags);
      }

      // Apply sorting
      switch (sort) {
        case 'popular':
          query = query.order('download_count', { ascending: false });
          break;
        case 'name':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      query = query.range(startIndex, startIndex + Number(limit) - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return res.json({
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      return res.status(500).json({
        success: false,
        message: '자료를 불러오는데 실패했습니다.'
      });
    }
  },

  // Get single resource
  async getResource(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: '자료를 찾을 수 없습니다.'
        });
      }

      return res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
      return res.status(500).json({
        success: false,
        message: '자료를 불러오는데 실패했습니다.'
      });
    }
  },

  // Create new resource (with file upload)
  async createResource(req: Request, res: Response) {
    try {
      const { title, description, category, type, tags, version } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: '파일이 업로드되지 않았습니다.'
        });
      }

      // Parse tags if it's a string
      const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      // Create resource record
      const { data: resource, error } = await supabase
        .from('resources')
        .insert({
          title,
          description,
          category,
          type,
          tags: parsedTags,
          version,
          file_url: `/uploads/${file.filename}`,
          file_size: file.size,
          file_name: file.originalname,
          mime_type: file.mimetype,
          uploaded_by: (req as any).user?.email || 'anonymous'
        })
        .select()
        .single();

      if (error) throw error;

      // Also create a record in file_uploads table
      await supabase
        .from('file_uploads')
        .insert({
          original_name: file.originalname,
          stored_name: file.filename,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          entity_type: 'resource',
          entity_id: resource.id,
          uploaded_by: (req as any).user?.email || 'anonymous',
          is_public: true,
          metadata: { resource_type: type, category }
        });

      return res.json({
        success: true,
        data: resource,
        message: '자료가 성공적으로 업로드되었습니다.'
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      return res.status(500).json({
        success: false,
        message: '자료 업로드에 실패했습니다.'
      });
    }
  },

  // Update resource
  async updateResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, category, tags, version, is_active } = req.body;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      const { data, error } = await supabase
        .from('resources')
        .update({
          title,
          description,
          category,
          tags,
          version,
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        data,
        message: '자료가 성공적으로 수정되었습니다.'
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      return res.status(500).json({
        success: false,
        message: '자료 수정에 실패했습니다.'
      });
    }
  },

  // Delete resource
  async deleteResource(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      // Get resource info first
      const { data: resource, error: fetchError } = await supabase
        .from('resources')
        .select('file_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the resource record
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Try to delete the physical file
      if (resource?.file_url) {
        const fileName = resource.file_url.split('/').pop();
        const filePath = path.join(process.cwd(), 'uploads', fileName);
        try {
          await fs.unlink(filePath);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
        }
      }

      return res.json({
        success: true,
        message: '자료가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      return res.status(500).json({
        success: false,
        message: '자료 삭제에 실패했습니다.'
      });
    }
  },

  // Download resource (increment download count)
  async downloadResource(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      // Get resource info
      const { data: resource, error: fetchError } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: '자료를 찾을 수 없습니다.'
        });
      }

      // Increment download count
      await supabase
        .from('resources')
        .update({ 
          download_count: resource.download_count + 1 
        })
        .eq('id', id);

      // Log download in file_uploads table
      await supabase
        .from('file_uploads')
        .update({
          metadata: {
            ...resource.metadata,
            last_download: new Date().toISOString(),
            total_downloads: resource.download_count + 1
          }
        })
        .eq('entity_type', 'resource')
        .eq('entity_id', id);

      return res.json({
        success: true,
        data: {
          downloadUrl: resource.file_url,
          fileName: resource.file_name || resource.title
        }
      });
    } catch (error) {
      console.error('Error processing download:', error);
      return res.status(500).json({
        success: false,
        message: '다운로드 처리에 실패했습니다.'
      });
    }
  },

  // Get resource statistics
  async getResourceStats(req: Request, res: Response) {
    try {
      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      // Get total downloads
      const { data: resources, error: resourceError } = await supabase
        .from('resources')
        .select('download_count');

      if (resourceError) throw resourceError;

      const totalDownloads = resources?.reduce((sum, r) => sum + r.download_count, 0) || 0;
      const totalResources = resources?.length || 0;

      // Get popular resources
      const { data: popularResources, error: popularError } = await supabase
        .from('resources')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(5);

      if (popularError) throw popularError;

      // Get recent resources
      const { data: recentResources, error: recentError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      return res.json({
        success: true,
        data: {
          totalDownloads,
          totalResources,
          popularResources: popularResources || [],
          recentResources: recentResources || []
        }
      });
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      return res.status(500).json({
        success: false,
        message: '통계를 불러오는데 실패했습니다.'
      });
    }
  },

  // Get resource categories
  async getCategories(req: Request, res: Response) {
    try {
      const { type } = req.query;

      let categories: any[] = [];

      if (type === 'manual') {
        categories = [
          { value: 'operation', label: '운영 매뉴얼', count: 0 },
          { value: 'counseling', label: '상담 매뉴얼', count: 0 },
          { value: 'program', label: '프로그램 매뉴얼', count: 0 },
          { value: 'crisis', label: '위기대응 매뉴얼', count: 0 }
        ];
      } else if (type === 'program') {
        categories = [
          { value: 'emotion', label: '정서·사회성', count: 0 },
          { value: 'study', label: '학습·진로', count: 0 },
          { value: 'prevention', label: '예방·교육', count: 0 },
          { value: 'crisis', label: '위기개입', count: 0 },
          { value: 'family', label: '가족상담', count: 0 }
        ];
      } else if (type === 'case') {
        categories = [
          { value: 'counseling', label: '상담 사례', count: 0 },
          { value: 'program', label: '프로그램 운영', count: 0 },
          { value: 'crisis', label: '위기개입', count: 0 },
          { value: 'collaboration', label: '협력 사례', count: 0 }
        ];
      }

      // Get counts for each category
      for (const cat of categories) {
        const { count, error } = await supabase!
          .from('resources')
          .select('*', { count: 'exact', head: true })
          .eq('type', type)
          .eq('category', cat.value)
          .eq('is_active', true);

        if (!error) {
          cat.count = count || 0;
        }
      }

      return res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        message: '카테고리를 불러오는데 실패했습니다.'
      });
    }
  },

  // Search resources
  async searchResources(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: '검색어를 입력해주세요.'
        });
      }

      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Database connection not available'
        });
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .eq('is_active', true)
        .order('download_count', { ascending: false })
        .limit(20);

      if (error) throw error;

      return res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Error searching resources:', error);
      return res.status(500).json({
        success: false,
        message: '검색에 실패했습니다.'
      });
    }
  }
};