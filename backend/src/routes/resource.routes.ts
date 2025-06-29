import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { resourceController } from '../controllers/resource.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { checkPermission } from '../middleware/permission.middleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'));
    }
  }
});

// Public routes
router.get('/', resourceController.getResources);
router.get('/stats', resourceController.getResourceStats);
router.get('/categories', resourceController.getCategories);
router.get('/search', resourceController.searchResources);
router.get('/:id', resourceController.getResource);
router.post('/:id/download', resourceController.downloadResource);

// Protected routes (admin only)
router.use(authenticateUser);
router.post('/', checkPermission(['admin']), upload.single('file'), resourceController.createResource);
router.put('/:id', checkPermission(['admin']), resourceController.updateResource);
router.delete('/:id', checkPermission(['admin']), resourceController.deleteResource);

export default router;