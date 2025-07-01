import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactApi, Contact } from '../../api/contact';
import { toast } from 'react-hot-toast';

interface ContactReplyModalProps {
  contact: Contact;
  onClose: () => void;
  onSuccess: () => void;
}

const ContactReplyModal: React.FC<ContactReplyModalProps> = ({
  contact,
  onClose,
  onSuccess,
}) => {
  const [replyMessage, setReplyMessage] = useState('');

  const replyMutation = useMutation({
    mutationFn: () => contactApi.replyToContact(contact.id!, replyMessage),
    onSuccess: () => {
      toast.success('답변이 전송되었습니다.');
      onSuccess();
    },
    onError: () => {
      toast.error('답변 전송에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }
    replyMutation.mutate();
  };

  const categoryLabels = {
    general: '일반문의',
    counseling: '상담문의',
    program: '프로그램문의',
    support: '지원문의',
    other: '기타',
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">문의 답변</h3>

        {/* Contact Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-sm font-medium text-gray-500">문의자:</span>
              <p className="text-sm text-gray-900">
                {contact.name} ({contact.email})
                {contact.phone && ` / ${contact.phone}`}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">카테고리:</span>
              <p className="text-sm text-gray-900">{categoryLabels[contact.category]}</p>
            </div>
          </div>
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-500">제목:</span>
            <p className="text-sm text-gray-900 font-medium">{contact.title}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">문의 내용:</span>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{contact.message}</p>
          </div>
          {contact.created_at && (
            <div className="mt-3 text-xs text-gray-500">
              문의일시: {new Date(contact.created_at).toLocaleString()}
            </div>
          )}
        </div>

        {/* Previous Reply */}
        {contact.reply_message && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">이전 답변</h4>
            <p className="text-sm text-blue-800 whitespace-pre-wrap">{contact.reply_message}</p>
            {contact.replied_at && (
              <p className="text-xs text-blue-600 mt-2">
                답변일시: {new Date(contact.replied_at).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Reply Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              답변 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wee-main focus:border-transparent"
              placeholder="답변 내용을 입력하세요..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={replyMutation.isPending}
              className="px-4 py-2 bg-wee-main text-white rounded-lg hover:bg-wee-dark transition-colors disabled:opacity-50"
            >
              {replyMutation.isPending ? '전송중...' : '답변 전송'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactReplyModal;