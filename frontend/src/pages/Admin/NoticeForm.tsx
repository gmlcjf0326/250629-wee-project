import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NoticeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: '',
    isImportant: false,
    attachments: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log('Form submitted:', formData);
    navigate('/admin/notices');
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 계속하시겠습니까?')) {
      navigate('/admin/notices');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? '공지사항 수정' : '새 공지사항 작성'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="form-label">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>

            {/* Category and Important */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="form-label">
                  카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="general">일반</option>
                  <option value="education">교육</option>
                  <option value="operation">운영</option>
                  <option value="recruitment">채용</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isImportant"
                    checked={formData.isImportant}
                    onChange={handleChange}
                    className="rounded text-wee-main focus:ring-wee-main mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">중요 공지로 설정</span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="form-label">
                내용 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className="form-input"
                placeholder="공지사항 내용을 입력하세요"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                HTML 태그를 사용할 수 있습니다.
              </p>
            </div>

            {/* Attachments */}
            <div>
              <label htmlFor="attachments" className="form-label">
                첨부파일
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-wee-light file:text-wee-main
                    hover:file:bg-wee-main hover:file:text-white
                    file:cursor-pointer file:transition-colors"
                />
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">선택된 파일:</p>
                  <ul className="mt-1 text-sm text-gray-500">
                    {formData.attachments.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost"
          >
            취소
          </button>
          <button
            type="submit"
            name="action"
            value="draft"
            className="btn-secondary"
          >
            임시저장
          </button>
          <button
            type="submit"
            name="action"
            value="publish"
            className="btn-primary"
          >
            {isEdit ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;