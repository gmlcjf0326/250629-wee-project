import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  createdAt: string;
  isImportant: boolean;
  status: 'published' | 'draft';
}

const NoticesAdmin: React.FC = () => {
  const [notices] = useState<Notice[]>([
    {
      id: 1,
      title: '2024년 상반기 교육 프로그램 안내',
      content: '2024년 상반기 교육 프로그램을 안내드립니다.',
      author: '관리자',
      category: '교육',
      views: 234,
      createdAt: '2024-01-15',
      isImportant: true,
      status: 'published',
    },
    {
      id: 2,
      title: 'Wee 클래스 운영 매뉴얼 개정',
      content: 'Wee 클래스 운영 매뉴얼이 개정되었습니다.',
      author: '관리자',
      category: '운영',
      views: 156,
      createdAt: '2024-01-10',
      isImportant: true,
      status: 'published',
    },
    {
      id: 3,
      title: '신규 상담사 모집 공고',
      content: '2024년 신규 상담사를 모집합니다.',
      author: '인사팀',
      category: '채용',
      views: 89,
      createdAt: '2024-01-05',
      isImportant: false,
      status: 'published',
    },
  ]);

  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedNotices(notices.map(n => n.id));
    } else {
      setSelectedNotices([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedNotices(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (selectedNotices.length === 0) return;
    if (confirm(`선택한 ${selectedNotices.length}개의 공지사항을 삭제하시겠습니까?`)) {
      // Delete logic here
      setSelectedNotices([]);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
        <Link
          to="/admin/notices/new"
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 공지사항
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select className="form-input">
            <option>전체 카테고리</option>
            <option>교육</option>
            <option>운영</option>
            <option>채용</option>
            <option>기타</option>
          </select>
          <select className="form-input">
            <option>전체 상태</option>
            <option>게시됨</option>
            <option>임시저장</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="form-input flex-1"
          />
          <button className="btn-secondary">검색</button>
        </div>
      </div>

      {/* Actions */}
      {selectedNotices.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-blue-700">
            {selectedNotices.length}개 선택됨
          </span>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            삭제
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedNotices.length === notices.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedNotices.includes(notice.id)}
                    onChange={() => handleSelect(notice.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {notice.isImportant && (
                      <span className="badge badge-danger mr-2">중요</span>
                    )}
                    <span className="text-gray-900 font-medium">{notice.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {notice.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {notice.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {notice.views}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {notice.createdAt}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${notice.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                    {notice.status === 'published' ? '게시됨' : '임시저장'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    to={`/admin/notices/${notice.id}/edit`}
                    className="text-wee-main hover:text-wee-dark mr-3"
                  >
                    수정
                  </Link>
                  <button className="text-red-600 hover:text-red-700">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <nav className="flex space-x-2">
          <button className="px-3 py-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100">
            이전
          </button>
          <button className="px-3 py-2 bg-wee-main text-white rounded-lg">1</button>
          <button className="px-3 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">2</button>
          <button className="px-3 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">3</button>
          <button className="px-3 py-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100">
            다음
          </button>
        </nav>
      </div>
    </div>
  );
};

export default NoticesAdmin;