import { Request, Response } from 'express';
import noticeService from '../services/notice.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getNotices = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    category: req.query.category as string,
    search: req.query.search as string,
    sort: req.query.sort as 'latest' | 'oldest' | 'views'
  };

  const result = await noticeService.getNotices(query);

  res.json({
    success: true,
    data: result
  });
});

export const getNoticeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notice = await noticeService.getNoticeById(id);

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: 'Notice not found'
    });
  }

  res.json({
    success: true,
    data: notice
  });
});

export const createNotice = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const notice = await noticeService.createNotice(req.body, userId);

  res.status(201).json({
    success: true,
    data: notice,
    message: 'Notice created successfully'
  });
});

export const updateNotice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notice = await noticeService.updateNotice(id, req.body);

  res.json({
    success: true,
    data: notice,
    message: 'Notice updated successfully'
  });
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await noticeService.deleteNotice(id);

  res.json({
    success: true,
    message: 'Notice deleted successfully'
  });
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await noticeService.getCategories();

  res.json({
    success: true,
    data: categories
  });
});