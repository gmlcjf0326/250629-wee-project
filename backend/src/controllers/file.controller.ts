import { Request, Response } from 'express';
import fileService from '../services/file.service';
import { asyncHandler } from '../utils/asyncHandler';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});

export const fileController = {
  // Upload single file
  uploadFile: [
    upload.single('file'),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const userId = (req as any).user?.id;
      const { bucket = 'public', category } = req.body;

      const result = await fileService.uploadFile(
        req.file,
        bucket as any,
        userId,
        category
      );

      res.json({
        success: true,
        data: result,
        message: 'File uploaded successfully'
      });
    })
  ],

  // Upload multiple files
  uploadMultiple: [
    upload.array('files', 10),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const userId = (req as any).user?.id;
      const { bucket = 'public', category } = req.body;

      const results = await Promise.all(
        req.files.map(file => 
          fileService.uploadFile(file, bucket as any, userId, category)
        )
      );

      res.json({
        success: true,
        data: results,
        message: 'Files uploaded successfully'
      });
    })
  ],

  // Get file URL
  getFileUrl: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { expiresIn } = req.query;

    const url = await fileService.getFileUrl(
      id,
      expiresIn ? parseInt(expiresIn as string) : undefined
    );

    res.json({
      success: true,
      data: { url }
    });
  }),

  // Delete file
  deleteFile: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    await fileService.deleteFile(id, userId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  }),

  // List files
  listFiles: asyncHandler(async (req: Request, res: Response) => {
    const { bucket, category, userId } = req.query;

    const files = await fileService.listFiles(
      bucket as any,
      category as string,
      userId as string
    );

    res.json({
      success: true,
      data: files
    });
  })
};