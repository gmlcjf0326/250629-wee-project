import { Request, Response } from 'express';
import uploadService, { upload } from '../services/upload.service';
import path from 'path';
import fs from 'fs';

export const uploadController = {
  // Single file upload
  uploadSingle: [
    upload.single('file'),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No file uploaded'
          });
        }

        // Upload to Supabase if configured
        const supabaseUrl = await uploadService.uploadToSupabase(req.file);

        // Save metadata to database
        const fileRecord = await uploadService.saveFileMetadata(req.file, {
          entityType: req.body.entityType,
          entityId: req.body.entityId,
          uploadedBy: req.body.uploadedBy,
          isPublic: req.body.isPublic === 'true',
          metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null
        });

        return res.json({
          success: true,
          message: 'File uploaded successfully',
          data: {
            id: fileRecord?.id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            localUrl: `/uploads/${req.file.filename}`,
            supabaseUrl
          }
        });
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to upload file'
        });
      }
    }
  ],

  // Multiple file upload
  uploadMultiple: [
    upload.array('files', 10), // Max 10 files
    async (req: Request, res: Response) => {
      try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'No files uploaded'
          });
        }

        const uploadResults = await Promise.all(
          req.files.map(async (file) => {
            const supabaseUrl = await uploadService.uploadToSupabase(file);
            const fileRecord = await uploadService.saveFileMetadata(file, {
              entityType: req.body.entityType,
              entityId: req.body.entityId,
              uploadedBy: req.body.uploadedBy,
              isPublic: req.body.isPublic === 'true'
            });

            return {
              id: fileRecord?.id,
              filename: file.filename,
              originalName: file.originalname,
              size: file.size,
              mimeType: file.mimetype,
              localUrl: `/uploads/${file.filename}`,
              supabaseUrl
            };
          })
        );

        return res.json({
          success: true,
          message: 'Files uploaded successfully',
          data: uploadResults
        });
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to upload files'
        });
      }
    }
  ],

  // Download file
  async downloadFile(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const filePath = uploadService.getFilePath(filename);

      if (!uploadService.fileExists(filename)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      return res.download(filePath);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to download file'
      });
    }
  },

  // Delete file
  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await uploadService.deleteFile(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'File not found or already deleted'
        });
      }

      return res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete file'
      });
    }
  }
};