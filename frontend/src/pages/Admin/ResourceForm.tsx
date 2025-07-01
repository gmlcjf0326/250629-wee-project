import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { resourcesAPI, Resource, CreateResourceDto } from '../../api/resources';
import { toast } from 'react-hot-toast';

interface ResourceFormProps {
  resource?: Resource | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateResourceDto>({
    title: '',
    description: '',
    category: '',
    type: 'manual',
    tags: [],
    version: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');

  const isEditing = !!resource;

  // Fetch categories based on type
  const { data: categories } = useQuery({
    queryKey: ['resource-categories', formData.type],
    queryFn: () => resourcesAPI.getCategories(formData.type),
    enabled: !!formData.type,
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description || '',
        category: resource.category,
        type: resource.type,
        tags: resource.tags || [],
        version: resource.version || '',
      });
    }
  }, [resource]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateResourceDto) => resourcesAPI.createResource(data),
    onSuccess: () => {
      toast.success('자료가 등록되었습니다.');
      onSuccess();
    },
    onError: () => {
      toast.error('자료 등록에 실패했습니다.');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Resource>) => resourcesAPI.updateResource(resource!.id, data),
    onSuccess: () => {
      toast.success('자료가 수정되었습니다.');
      onSuccess();
    },
    onError: () => {
      toast.error('자료 수정에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !file) {
      toast.error('파일을 선택해주세요.');
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate({ ...formData, file: file! });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const typeOptions = [
    { value: 'manual', label: '매뉴얼' },
    { value: 'program', label: '프로그램' },
    { value: 'case', label: '사례' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isEditing ? '자료 수정' : '새 자료 등록'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유형 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
                required
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
                required
              >
                <option value="">선택하세요</option>
                {categories?.map((cat: any) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">버전</label>
            <input
              type="text"
              value={formData.version || ''}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="예: v1.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-dark transition-colors"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-wee-bg text-wee-main rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                파일 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-dark transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? '처리중...'
                : isEditing
                ? '수정'
                : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;