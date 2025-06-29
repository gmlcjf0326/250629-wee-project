import React, { useState, useRef } from 'react';
import { uploadAPI, UploadResponse } from '../../api/uploads';

interface FileUploadProps {
  onUploadSuccess?: (files: UploadResponse[]) => void;
  onUploadError?: (error: Error) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  entityType?: string;
  entityId?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  entityType,
  entityId
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`;
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let result: UploadResponse[];
      
      if (multiple && files.length > 1) {
        result = await uploadAPI.uploadMultiple(files, {
          entityType,
          entityId
        });
      } else {
        const uploadResult = await uploadAPI.uploadSingle(files[0], {
          entityType,
          entityId
        });
        result = [uploadResult];
      }

      setUploadProgress(100);
      onUploadSuccess?.(result);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error as Error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        multiple={multiple}
        accept={accept}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      
      <label
        htmlFor="file-upload"
        className={`
          inline-flex items-center justify-center px-4 py-2 border border-gray-300 
          rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-wee-main cursor-pointer
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            업로드 중... {uploadProgress}%
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            파일 선택
          </>
        )}
      </label>
      
      <p className="mt-2 text-xs text-gray-500">
        {multiple ? '여러 파일을 선택할 수 있습니다. ' : ''}
        최대 파일 크기: {formatFileSize(maxSize)}
      </p>
    </div>
  );
};