import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  agree: boolean;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
    agree: false
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: '일반 문의', icon: '💬' },
    { value: 'program', label: '프로그램 문의', icon: '📚' },
    { value: 'technical', label: '기술 지원', icon: '🔧' },
    { value: 'partnership', label: '협력/제휴', icon: '🤝' },
    { value: 'complaint', label: '불편 신고', icon: '⚠️' },
    { value: 'other', label: '기타', icon: '📋' }
  ];

  const contactInfo = [
    {
      title: '전화 상담',
      icon: '📞',
      content: '1588-7179',
      description: '평일 09:00 - 18:00',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '이메일',
      icon: '✉️',
      content: 'wee@moe.go.kr',
      description: '24시간 접수 가능',
      color: 'from-green-500 to-green-600'
    },
    {
      title: '방문 상담',
      icon: '🏢',
      content: '전국 Wee 센터',
      description: '사전 예약 필요',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.agree) {
      toast.error('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success('문의가 성공적으로 접수되었습니다.');
      
      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
        agree: false
      });
    } catch (error) {
      toast.error('문의 접수에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-wee-main to-wee-blue text-white py-20"
      >
        <div className="content-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">문의하기</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Wee 프로젝트에 대한 궁금한 점이나 제안사항을 알려주세요.
            전문 상담사가 친절하게 답변해드립니다.
          </p>
        </div>
      </motion.div>

      <div className="content-wide py-16">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all p-6"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mb-4`}>
                <span className="text-3xl">{info.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{info.content}</p>
              <p className="text-sm text-gray-600">{info.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">온라인 문의</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">문의 유형</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <label
                      key={category.value}
                      className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        form.category === category.value
                          ? 'border-wee-main bg-wee-light/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={form.category === category.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="홍길동"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="문의 제목을 입력해주세요"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="form-input resize-none"
                  placeholder="문의하실 내용을 자세히 작성해주세요"
                />
              </div>

              {/* Privacy Agreement */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="mt-1 mr-3"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">개인정보 수집 및 이용에 동의합니다</span>
                    <p className="text-gray-600 mt-1">
                      수집된 개인정보는 문의 답변을 위해서만 사용되며, 답변 완료 후 안전하게 폐기됩니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-gradient-to-r from-wee-main to-wee-blue text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      접수 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      문의 접수하기
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">자주 묻는 질문</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: 'Wee 센터는 어떻게 찾을 수 있나요?',
                  a: '기관안내 > 기관찾기 메뉴에서 지역별 Wee 센터를 검색하실 수 있습니다.'
                },
                {
                  q: '상담 비용이 있나요?',
                  a: 'Wee 프로젝트의 모든 상담 서비스는 무료로 제공됩니다.'
                },
                {
                  q: '답변은 언제 받을 수 있나요?',
                  a: '평일 기준 1-3일 이내에 등록하신 이메일로 답변을 보내드립니다.'
                },
                {
                  q: '전화 상담은 익명으로도 가능한가요?',
                  a: '네, 전화 상담은 익명으로도 가능합니다. 편하게 연락주세요.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Q. {faq.q}</h4>
                  <p className="text-gray-600">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;