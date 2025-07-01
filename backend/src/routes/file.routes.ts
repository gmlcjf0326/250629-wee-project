import { Router } from 'express';
import { fileController } from '../controllers/file.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All file operations require authentication
router.use(authenticate);

// POST /api/files/upload - Upload single file
router.post('/upload', fileController.uploadFile);

// POST /api/files/upload-multiple - Upload multiple files
router.post('/upload-multiple', fileController.uploadMultiple);

// GET /api/files/:id/url - Get file URL
router.get('/:id/url', fileController.getFileUrl);

// DELETE /api/files/:id - Delete file
router.delete('/:id', fileController.deleteFile);

// GET /api/files - List files
router.get('/', fileController.listFiles);

export default router;