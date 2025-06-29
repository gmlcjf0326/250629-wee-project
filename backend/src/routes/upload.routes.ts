import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';

const router = Router();

// POST /api/uploads/single - Upload single file
router.post('/single', uploadController.uploadSingle);

// POST /api/uploads/multiple - Upload multiple files
router.post('/multiple', uploadController.uploadMultiple);

// GET /api/uploads/download/:filename - Download file
router.get('/download/:filename', uploadController.downloadFile);

// DELETE /api/uploads/:id - Delete file
router.delete('/:id', uploadController.deleteFile);

export default router;