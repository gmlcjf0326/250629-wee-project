import { Router } from 'express';
import { newsletterController } from '../controllers/newsletter.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', newsletterController.getNewsletters);
router.get('/latest', newsletterController.getLatestNewsletter);
router.get('/stats', newsletterController.getNewsletterStats);
router.get('/:id', newsletterController.getNewsletter);
router.post('/:id/download', newsletterController.downloadNewsletter);
router.post('/subscribe', newsletterController.subscribeNewsletter);

// Admin routes
router.post('/', authenticate, requireRole(['admin']), newsletterController.createNewsletter);
router.put('/:id', authenticate, requireRole(['admin']), newsletterController.updateNewsletter);
router.delete('/:id', authenticate, requireRole(['admin']), newsletterController.deleteNewsletter);

export default router;