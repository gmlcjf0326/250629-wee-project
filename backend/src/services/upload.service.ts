import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';
import databaseService from './database.service';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (_req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and archives are allowed.'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

class UploadService {
  // Upload to Supabase Storage
  async uploadToSupabase(file: Express.Multer.File, bucket: string = 'uploads'): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using local storage only');
      return null;
    }

    try {
      const fileBuffer = fs.readFileSync(file.path);
      const fileName = `${Date.now()}-${file.filename}`;
      
      const { data, error } = await supabaseAdmin!
        .storage
        .from(bucket)
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Error uploading to Supabase:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin!
        .storage
        .from(bucket)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadToSupabase:', error);
      return null;
    }
  }

  // Save file metadata to database
  async saveFileMetadata(
    file: Express.Multer.File,
    additionalData: {
      entityType?: string;
      entityId?: string;
      uploadedBy?: string;
      isPublic?: boolean;
      metadata?: any;
    } = {}
  ) {
    const fileData = {
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      ...additionalData
    };

    return await databaseService.createFileUpload(fileData);
  }

  // Delete file
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const fileRecord = await databaseService.getFileUpload(fileId);
      if (!fileRecord) {
        return false;
      }

      // Delete from local storage
      if (fs.existsSync(fileRecord.filePath)) {
        fs.unlinkSync(fileRecord.filePath);
      }

      // TODO: Delete from Supabase storage if needed

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Get file path
  getFilePath(filename: string): string {
    return path.join(uploadDir, filename);
  }

  // Check if file exists
  fileExists(filename: string): boolean {
    return fs.existsSync(this.getFilePath(filename));
  }
}

export default new UploadService();