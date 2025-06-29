import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { resourcesAPI, CreateResourceDto } from '../../api/resources';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resourceType: 'manual' | 'program' | 'case';
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  resourceType
}) => {
  const [formData, setFormData] = useState<CreateResourceDto>({
    title: '',
    description: '',
    category: '',
    type: resourceType,
    tags: [],
    version: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');

  const getCategoryOptions = () => {
    switch (resourceType) {
      case 'manual':
        return [
          { value: 'operation', label: '운영 매뉴얼' },
          { value: 'counseling', label: '상담 매뉴얼' },
          { value: 'program', label: '프로그램 매뉴얼' },
          { value: 'crisis', label: '위기대응 매뉴얼' }
        ];
      case 'program':
        return [
          { value: 'emotion', label: '정서·사회성' },
          { value: 'study', label: '학습·진로' },
          { value: 'prevention', label: '예방·교육' },
          { value: 'crisis', label: '위기개입' },
          { value: 'family', label: '가족상담' }
        ];
      case 'case':
        return [
          { value: 'counseling', label: '상담 사례' },
          { value: 'program', label: '프로그램 운영' },
          { value: 'crisis', label: '위기개입' },
          { value: 'collaboration', label: '협력 사례' }
        ];
      default:
        return [];
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await resourcesAPI.createResource({
        ...formData,
        file
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          type: resourceType,
          tags: [],
          version: ''
        });
        setFile(null);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {resourceType === 'manual' && '매뉴얼 업로드'}
              {resourceType === 'program' && '프로그램 자료 업로드'}
              {resourceType === 'case' && '우수사례 업로드'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="form-label">파일 선택</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-wee-main bg-wee-light' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-wee-main mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    파일 제거
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">
                    {isDragActive ? '파일을 놓으세요' : '파일을 드래그하거나 클릭하여 선택하세요'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR (최대 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="form-label">제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
              placeholder="자료 제목을 입력하세요"
            />
          </div>

          {/* Category */}
          <div>
            <label className="form-label">카테고리 *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {getCategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Version (for manuals) */}
          {resourceType === 'manual' && (
            <div>
              <label className="form-label">버전</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="form-input"
                placeholder="예: v2.0"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="form-label">설명 *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows={4}
              required
              placeholder="자료에 대한 설명을 입력하세요"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="form-input flex-1"
                placeholder="태그를 입력하고 추가를 클릭하세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-secondary"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">업로드 중...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-wee-main h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="btn-primary flex-1"
            >
              {isUploading ? '업로드 중...' : '업로드'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="btn-ghost flex-1"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;