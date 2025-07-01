import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  getCategories
} from '../controllers/notice.controller';

const router = Router();

// Public routes
router.get('/', getNotices);
router.get('/categories', getCategories);
router.get('/:id', getNoticeById);

// Admin routes
router.post('/', authenticate, requireRole(['admin', 'manager']), createNotice);
router.put('/:id', authenticate, requireRole(['admin', 'manager']), updateNotice);
router.delete('/:id', authenticate, requireRole(['admin', 'manager']), deleteNotice);

export default router;