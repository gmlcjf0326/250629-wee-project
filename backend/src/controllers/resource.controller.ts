import { Request, Response } from 'express';
import resourceService from '../services/resource.service';
import { asyncHandler } from '../utils/asyncHandler';

export const resourceController = {
  // Get all resources with filters
  getResources: asyncHandler(async (req: Request, res: Response) => {
    const query = {
      type: req.query.type as string,
      category: req.query.category as string,
      sort: req.query.sort as 'newest' | 'popular' | 'name',
      search: req.query.search as string,
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) as string[] : undefined,
      is_active: req.query.is_active !== 'false',
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };

    const result = await resourceService.getResources(query);

    res.json({
      success: true,
      data: result.resources,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  }),

  // Get single resource
  getResource: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: '자료를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  }),

  // Create new resource (with file upload)
  createResource: asyncHandler(async (req: Request, res: Response) => {
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

    const resource = {
      title,
      description,
      category,
      type,
      tags: parsedTags,
      version
    };

    const userId = (req as any).user?.id || 'anonymous';
    const result = await resourceService.createResource(resource, file, userId);

    res.json({
      success: true,
      data: result,
      message: '자료가 성공적으로 업로드되었습니다.'
    });
  }),

  // Update resource
  updateResource: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, type, tags, version } = req.body;

    const updates = {
      title,
      description,
      category,
      type,
      tags,
      version
    };

    const result = await resourceService.updateResource(id, updates);

    res.json({
      success: true,
      data: result,
      message: '자료가 성공적으로 수정되었습니다.'
    });
  }),

  // Delete resource
  deleteResource: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'anonymous';

    await resourceService.deleteResource(id, userId);

    res.json({
      success: true,
      message: '자료가 성공적으로 삭제되었습니다.'
    });
  }),

  // Download resource (increment download count)
  downloadResource: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const resource = await resourceService.getResourceById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: '자료를 찾을 수 없습니다.'
      });
    }

    // Increment download count
    await resourceService.incrementDownloadCount(id);

    res.json({
      success: true,
      data: {
        downloadUrl: resource.file_url,
        fileName: resource.file_name || resource.title
      }
    });
  }),

  // Get resource statistics
  getResourceStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await resourceService.getResourceStats();

    res.json({
      success: true,
      data: stats
    });
  }),

  // Get resource categories
  getCategories: asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const categories = await resourceService.getCategories(type as string);

    res.json({
      success: true,
      data: categories
    });
  }),

  // Search resources
  searchResources: asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: '검색어를 입력해주세요.'
      });
    }

    const result = await resourceService.getResources({
      search: q as string,
      is_active: true,
      sort: 'popular',
      limit: 20
    });

    res.json({
      success: true,
      data: result.resources
    });
  })
};