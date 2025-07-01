import { Router } from 'express';
import { resourceController } from '../controllers/resource.controller';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', resourceController.getResources);
router.get('/search', resourceController.searchResources);
router.get('/categories', resourceController.getCategories);
router.get('/stats', resourceController.getResourceStats);
router.get('/:id', resourceController.getResource);
router.get('/:id/download', resourceController.downloadResource);

// Protected routes (require authentication)
router.post('/', authenticate, upload.single('file'), resourceController.createResource);
router.put('/:id', authenticate, resourceController.updateResource);
router.delete('/:id', authenticate, resourceController.deleteResource);

export default router;