import { Request, Response } from 'express';
import contactService from '../services/contact.service';
import { asyncHandler } from '../utils/asyncHandler';

export const contactController = {
  // Create new contact inquiry
  createContact: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, title, message, category } = req.body;

    // Validation
    if (!name || !email || !title || !message || !category) {
      return res.status(400).json({
        success: false,
        message: '필수 항목을 모두 입력해주세요.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 주소를 입력해주세요.'
      });
    }

    const contact = await contactService.createContact({
      name,
      email,
      phone,
      title,
      message,
      category,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다.',
      data: contact
    });
  }),

  // Get all contacts (admin)
  getContacts: asyncHandler(async (req: Request, res: Response) => {
    const query = {
      status: req.query.status as string,
      category: req.query.category as string,
      assigned_to: req.query.assigned_to as string,
      search: req.query.search as string,
      from_date: req.query.from_date as string,
      to_date: req.query.to_date as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };

    const result = await contactService.getContacts(query);

    res.json({
      success: true,
      data: result.contacts,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  }),

  // Get single contact
  getContact: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '문의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  }),

  // Update contact
  updateContact: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const updates: any = {};
    if (status) updates.status = status;
    if (assigned_to) updates.assigned_to = assigned_to;

    const contact = await contactService.updateContact(id, updates);

    res.json({
      success: true,
      message: '문의가 업데이트되었습니다.',
      data: contact
    });
  }),

  // Reply to contact
  replyToContact: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;
    const userId = (req as any).user?.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: '답변 내용을 입력해주세요.'
      });
    }

    const contact = await contactService.replyToContact(id, {
      message,
      userId: userId || 'admin'
    });

    res.json({
      success: true,
      message: '답변이 전송되었습니다.',
      data: contact
    });
  }),

  // Delete contact
  deleteContact: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await contactService.deleteContact(id);

    res.json({
      success: true,
      message: '문의가 삭제되었습니다.'
    });
  }),

  // Get contact statistics
  getContactStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await contactService.getContactStats();

    res.json({
      success: true,
      data: stats
    });
  }),

  // Assign contact to staff
  assignContact: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '담당자를 선택해주세요.'
      });
    }

    const contact = await contactService.assignContact(id, userId);

    res.json({
      success: true,
      message: '담당자가 지정되었습니다.',
      data: contact
    });
  })
};