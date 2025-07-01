import { Request, Response } from 'express';
import newsletterService from '../services/newsletter.service';
import { asyncHandler } from '../utils/asyncHandler';

export const newsletterController = {
  // Get all newsletters with filters
  getNewsletters: asyncHandler(async (req: Request, res: Response) => {
    const query = {
      year: req.query.year as string,
      limit: parseInt(req.query.limit as string) || 20,
      page: parseInt(req.query.page as string) || 1,
      sort: req.query.sort as 'date' | 'downloads'
    };

    const result = await newsletterService.getNewsletters(query);

    res.json({
      success: true,
      data: result.newsletters,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  }),

  // Get single newsletter
  getNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newsletter = await newsletterService.getNewsletterById(id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: '뉴스레터를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: newsletter
    });
  }),

  // Get latest newsletter
  getLatestNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const newsletter = await newsletterService.getLatestNewsletter();

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: '최신 뉴스레터가 없습니다.'
      });
    }

    res.json({
      success: true,
      data: newsletter
    });
  }),

  // Download newsletter (increment download count)
  downloadNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const newsletter = await newsletterService.getNewsletterById(id);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: '뉴스레터를 찾을 수 없습니다.'
      });
    }

    // Increment download count
    await newsletterService.incrementDownloadCount(id);

    // Generate download URL (in production, this would be a signed URL from storage)
    const downloadUrl = newsletter.file_url || `/api/newsletters/${id}/file`;

    res.json({
      success: true,
      data: {
        downloadUrl,
        fileName: `${newsletter.issue}.pdf`
      }
    });
  }),

  // Create newsletter (admin only)
  createNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const newsletter = req.body;
    const result = await newsletterService.createNewsletter(newsletter);

    res.json({
      success: true,
      data: result,
      message: '뉴스레터가 성공적으로 등록되었습니다.'
    });
  }),

  // Update newsletter (admin only)
  updateNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const result = await newsletterService.updateNewsletter(id, updates);

    res.json({
      success: true,
      data: result,
      message: '뉴스레터가 성공적으로 수정되었습니다.'
    });
  }),

  // Delete newsletter (admin only)
  deleteNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await newsletterService.deleteNewsletter(id);

    res.json({
      success: true,
      message: '뉴스레터가 성공적으로 삭제되었습니다.'
    });
  }),

  // Get newsletter statistics
  getNewsletterStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await newsletterService.getNewsletterStats();

    res.json({
      success: true,
      data: stats
    });
  }),

  // Subscribe to newsletter
  subscribeNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    // In production, this would add email to mailing list
    // For now, just return success
    res.json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다.',
      data: { email }
    });
  })
};