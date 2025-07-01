import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi, Contact, ContactQuery } from '../../api/contact';
import { toast } from 'react-hot-toast';
import ContactReplyModal from './ContactReplyModal';

const ContactAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ContactQuery>({
    page: 1,
    limit: 20,
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  // Fetch contacts
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-contacts', filters],
    queryFn: () => contactApi.getContacts(filters),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: () => contactApi.getContactStats(),
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      contactApi.updateContact(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('상태가 업데이트되었습니다.');
    },
    onError: () => {
      toast.error('상태 업데이트에 실패했습니다.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('문의가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('문의 삭제에 실패했습니다.');
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact);
    setShowReplyModal(true);
  };

  const categoryLabels = {
    general: '일반문의',
    counseling: '상담문의',
    program: '프로그램문의',
    support: '지원문의',
    other: '기타',
  };

  const statusLabels = {
    pending: '대기중',
    in_progress: '처리중',
    completed: '완료',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600">문의 내역을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">문의 관리</h2>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-1">전체 문의</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-1">대기중</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.statusStats.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-1">처리중</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.statusStats.in_progress}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <h3 className="text-sm font-medium text-gray-500 mb-1">평균 응답시간</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTimeHours}시간</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-soft mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
            >
              <option value="">전체 상태</option>
              <option value="pending">대기중</option>
              <option value="in_progress">처리중</option>
              <option value="completed">완료</option>
            </select>

            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
            >
              <option value="">전체 카테고리</option>
              <option value="general">일반문의</option>
              <option value="counseling">상담문의</option>
              <option value="program">프로그램문의</option>
              <option value="support">지원문의</option>
              <option value="other">기타</option>
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
      </div>

      {/* Contacts Table */}
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
                    문의정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
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
                {data?.data?.map((contact: Contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.title}</div>
                        <div className="text-sm text-gray-500">
                          {contact.name} ({contact.email})
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {contact.message}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {categoryLabels[contact.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id!, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          statusColors[contact.status!]
                        }`}
                      >
                        <option value="pending">대기중</option>
                        <option value="in_progress">처리중</option>
                        <option value="completed">완료</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.created_at
                        ? new Date(contact.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleReply(contact)}
                        className="text-wee-main hover:text-wee-dark mr-3"
                      >
                        답변
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id!)}
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

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <ContactReplyModal
          contact={selectedContact}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedContact(null);
          }}
          onSuccess={() => {
            setShowReplyModal(false);
            setSelectedContact(null);
            queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
            queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
          }}
        />
      )}
    </div>
  );
};

export default ContactAdmin;