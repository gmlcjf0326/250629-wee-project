import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', contactController.createContact);

// Protected routes (require authentication)
router.get('/', authenticate, contactController.getContacts);
router.get('/stats', authenticate, contactController.getContactStats);
router.get('/:id', authenticate, contactController.getContact);
router.put('/:id', authenticate, contactController.updateContact);
router.post('/:id/reply', authenticate, contactController.replyToContact);
router.post('/:id/assign', authenticate, contactController.assignContact);
router.delete('/:id', authenticate, contactController.deleteContact);

export default router;