import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesAPI, Resource, ResourceFilters } from '../../api/resources';
import { toast } from 'react-hot-toast';
import ResourceForm from './ResourceForm';

const ResourcesAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ResourceFilters>({
    page: 1,
    limit: 20,
    sort: 'newest',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Fetch resources
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-resources', filters],
    queryFn: () => resourcesAPI.getResources(filters),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourcesAPI.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success('자료가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('자료 삭제에 실패했습니다.');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 자료를 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const typeLabels = {
    manual: '매뉴얼',
    program: '프로그램',
    case: '사례',
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600">자료를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">자료실 관리</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-dark transition-colors"
        >
          새 자료 등록
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-soft mb-6">
        <div className="flex gap-4 items-center">
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
          >
            <option value="">전체 유형</option>
            <option value="manual">매뉴얼</option>
            <option value="program">프로그램</option>
            <option value="case">사례</option>
          </select>

          <select
            value={filters.sort || 'newest'}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as any, page: 1 })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
          >
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
            <option value="name">이름순</option>
          </select>

          <input
            type="text"
            placeholder="검색어 입력"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
          />
        </div>
      </div>

      {/* Resources Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wee-main"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일 크기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    다운로드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((resource: Resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-gray-500">{resource.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-wee-bg text-wee-main rounded-full">
                        {typeLabels[resource.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(resource.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.download_count || 0}회
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="text-wee-main hover:text-wee-dark mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                {[...Array(data.pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      filters.page === i + 1
                        ? 'z-10 bg-wee-bg border-wee-main text-wee-main'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
                  disabled={filters.page === data.pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <ResourceForm
          resource={editingResource}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
          }}
        />
      )}
    </div>
  );
};

export default ResourcesAdmin;