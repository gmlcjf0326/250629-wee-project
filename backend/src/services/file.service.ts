import { supabaseAdmin } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export interface FileUploadResult {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  bucket: string;
  path: string;
  publicUrl?: string;
}

export interface FileMetadata {
  uploadedBy: string;
  originalName: string;
  mimeType: string;
  size: number;
  category?: string;
}

class FileService {
  private buckets = {
    public: 'public-files',
    resources: 'resources',
    notices: 'notice-attachments',
    private: 'private-files'
  };

  async uploadFile(
    file: Express.Multer.File,
    bucket: keyof typeof this.buckets,
    userId: string,
    category?: string
  ): Promise<FileUploadResult> {
    if (!supabaseAdmin) {
      throw new Error('Storage not configured');
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = category ? `${category}/${fileName}` : fileName;

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(this.buckets[bucket])
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL if bucket is public
      let publicUrl: string | undefined;
      if (bucket === 'public') {
        const { data: urlData } = supabaseAdmin.storage
          .from(this.buckets[bucket])
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // Save file metadata to database
      const metadata: FileMetadata = {
        uploadedBy: userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        category
      };

      const fileRecord = {
        id: uuidv4(),
        file_name: fileName,
        original_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        bucket: this.buckets[bucket],
        path: filePath,
        uploaded_by: userId,
        category,
        metadata,
        public_url: publicUrl
      };

      // Insert file record to database
      const { error: dbError } = await supabaseAdmin
        .from('files')
        .insert(fileRecord);

      if (dbError) {
        // Rollback: delete uploaded file
        await supabaseAdmin.storage
          .from(this.buckets[bucket])
          .remove([filePath]);
        throw dbError;
      }

      return {
        id: fileRecord.id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        bucket: this.buckets[bucket],
        path: filePath,
        publicUrl
      };
    } catch (error) {
      throw error;
    }
  }

  async getFileUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
    if (!supabaseAdmin) {
      throw new Error('Storage not configured');
    }

    // Get file metadata from database
    const { data: file, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error || !file) {
      throw new Error('File not found');
    }

    // If file has public URL, return it
    if (file.public_url) {
      return file.public_url;
    }

    // Generate signed URL for private files
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from(file.bucket)
      .createSignedUrl(file.path, expiresIn);

    if (urlError || !signedUrlData) {
      throw urlError || new Error('Failed to generate signed URL');
    }

    return signedUrlData.signedUrl;
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Storage not configured');
    }

    // Get file metadata
    const { data: file, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error || !file) {
      throw new Error('File not found');
    }

    // Check permission
    if (file.uploaded_by !== userId) {
      // Check if user is admin
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
        throw new Error('Unauthorized to delete this file');
      }
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from(file.bucket)
      .remove([file.path]);

    if (storageError) {
      throw storageError;
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw dbError;
    }
  }

  async listFiles(
    bucket?: keyof typeof this.buckets,
    category?: string,
    userId?: string
  ) {
    if (!supabaseAdmin) {
      throw new Error('Storage not configured');
    }

    let query = supabaseAdmin.from('files').select('*');

    if (bucket) {
      query = query.eq('bucket', this.buckets[bucket]);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (userId) {
      query = query.eq('uploaded_by', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async createBucketsIfNotExist() {
    if (!supabaseAdmin) {
      return;
    }

    for (const [key, bucketName] of Object.entries(this.buckets)) {
      try {
        const { data: existingBucket } = await supabaseAdmin.storage
          .getBucket(bucketName);

        if (!existingBucket) {
          const { error } = await supabaseAdmin.storage
            .createBucket(bucketName, {
              public: key === 'public',
              fileSizeLimit: 10485760, // 10MB
              allowedMimeTypes: key === 'resources' 
                ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
                : undefined
            });

          if (error) {
            console.error(`Failed to create bucket ${bucketName}:`, error);
          } else {
            console.log(`Created bucket: ${bucketName}`);
          }
        }
      } catch (error) {
        console.error(`Error checking/creating bucket ${bucketName}:`, error);
      }
    }
  }
}

export default new FileService();