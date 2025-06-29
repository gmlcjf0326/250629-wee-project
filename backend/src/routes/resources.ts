import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkPermission } from '../middleware/permission.middleware';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/resources');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
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
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents, images, and archives are allowed.'));
    }
  },
});

// Mock database for resources
let resources: any[] = [
  {
    id: '1',
    category: 'manual',
    title: 'Wee 프로젝트 운영 매뉴얼',
    description: '2024년 개정판 Wee 프로젝트 운영 매뉴얼입니다.',
    file_path: '/uploads/samples/wee-manual-sample.txt',
    file_name: 'wee-manual-sample.txt',
    file_size: 1024,
    download_count: 156,
    created_at: new Date('2024-01-15'),
    created_by: 'admin',
  },
  {
    id: '2',
    category: 'program',
    title: '자존감 향상 프로그램 가이드',
    description: '초등학생 대상 자존감 향상 프로그램 운영 가이드입니다.',
    file_path: '/uploads/samples/wee-program-guide.txt',
    file_name: 'wee-program-guide.txt',
    file_size: 2048,
    download_count: 89,
    created_at: new Date('2024-02-20'),
    created_by: 'admin',
  },
  {
    id: '3',
    category: 'case',
    title: '게임 과몰입 학생 상담 우수사례',
    description: '게임 과몰입 학생 상담 성공 사례 분석 자료입니다.',
    file_path: '/uploads/samples/wee-case-study.txt',
    file_name: 'wee-case-study.txt',
    file_size: 3072,
    download_count: 234,
    created_at: new Date('2024-03-10'),
    created_by: 'admin',
  },
];

// Get all resources with filtering
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredResources = [...resources];
    
    if (category && category !== 'all') {
      filteredResources = filteredResources.filter(r => r.category === category);
    }
    
    if (search) {
      const searchLower = search.toString().toLowerCase();
      filteredResources = filteredResources.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({
      success: true,
      data: filteredResources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
    });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = resources.find(r => r.id === req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }
    
    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
    });
  }
});

// Download resource file
router.get('/:id/download', async (req, res) => {
  try {
    const resource = resources.find(r => r.id === req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }
    
    // Increment download count
    resource.download_count = (resource.download_count || 0) + 1;
    
    // Construct file path
    const filePath = path.join(__dirname, '../..', resource.file_path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${resource.file_name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resource',
    });
  }
});

// Create new resource (Admin only)
router.post(
  '/',
  authenticateToken,
  checkPermission(['admin', 'manager']),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File is required',
        });
      }
      
      const { category, title, description } = req.body;
      
      if (!category || !title) {
        return res.status(400).json({
          success: false,
          message: 'Category and title are required',
        });
      }
      
      const newResource = {
        id: uuidv4(),
        category,
        title,
        description,
        file_path: `/uploads/resources/${req.file.filename}`,
        file_name: req.file.originalname,
        file_size: req.file.size,
        download_count: 0,
        created_at: new Date(),
        created_by: (req as any).user.username,
      };
      
      resources.push(newResource);
      
      res.status(201).json({
        success: true,
        data: newResource,
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create resource',
      });
    }
  }
);

// Update resource (Admin only)
router.put(
  '/:id',
  authenticateToken,
  checkPermission(['admin', 'manager']),
  upload.single('file'),
  async (req, res) => {
    try {
      const resourceIndex = resources.findIndex(r => r.id === req.params.id);
      
      if (resourceIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }
      
      const { category, title, description } = req.body;
      const resource = resources[resourceIndex];
      
      // Update fields
      if (category) resource.category = category;
      if (title) resource.title = title;
      if (description) resource.description = description;
      
      // Update file if new one is uploaded
      if (req.file) {
        // Delete old file if exists
        const oldFilePath = path.join(__dirname, '../..', resource.file_path);
        if (fs.existsSync(oldFilePath) && !resource.file_path.includes('/samples/')) {
          fs.unlinkSync(oldFilePath);
        }
        
        resource.file_path = `/uploads/resources/${req.file.filename}`;
        resource.file_name = req.file.originalname;
        resource.file_size = req.file.size;
      }
      
      resource.updated_at = new Date();
      
      res.json({
        success: true,
        data: resource,
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update resource',
      });
    }
  }
);

// Delete resource (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  checkPermission(['admin', 'manager']),
  async (req, res) => {
    try {
      const resourceIndex = resources.findIndex(r => r.id === req.params.id);
      
      if (resourceIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }
      
      const resource = resources[resourceIndex];
      
      // Delete file if not a sample
      if (!resource.file_path.includes('/samples/')) {
        const filePath = path.join(__dirname, '../..', resource.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      // Remove from array
      resources.splice(resourceIndex, 1);
      
      res.json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete resource',
      });
    }
  }
);

export default router;