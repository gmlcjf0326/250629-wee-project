import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    organization: '',
    position: '',
    purpose: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다.';
      }

      // Password validation
      if (formData.password.length < 8) {
        newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    } else if (step === 2) {
      // Name validation
      if (formData.fullName.trim().length < 2) {
        newErrors.fullName = '이름은 2자 이상이어야 합니다.';
      }

      // Phone validation
      if (formData.phone && !/^[0-9-]+$/.test(formData.phone)) {
        newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
      }

      if (!formData.position) {
        newErrors.position = '직책을 선택해주세요.';
      }
    } else if (step === 3) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = '이용약관에 동의해주세요.';
      }
      if (!formData.agreePrivacy) {
        newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        organization: formData.organization || undefined,
        position: formData.position,
        purpose: formData.purpose,
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || '회원가입에 실패했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return '약함';
    if (passwordStrength <= 3) return '보통';
    return '강함';
  };

  const steps = [
    { number: 1, title: '계정 정보' },
    { number: 2, title: '개인 정보' },
    { number: 3, title: '약관 동의' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wee-light via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-wee-main to-wee-skyblue rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Wee
              </motion.div>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Wee 프로젝트 회원가입
            </h2>
            <p className="mt-2 text-gray-600">
              더 나은 교육 환경을 함께 만들어갑니다
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <motion.div
                    className={`flex items-center ${
                      currentStep >= step.number ? 'text-wee-main' : 'text-gray-400'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step.number
                          ? 'bg-wee-main text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium hidden sm:block">{step.title}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-1 mx-2 ${
                        currentStep > step.number ? 'bg-wee-main' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit}>
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-lg bg-red-50 p-4"
                >
                  <div className="text-sm text-red-800">{errors.submit}</div>
                </motion.div>
              )}

              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 주소 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.email ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.password ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="8자 이상, 영문 대소문자, 숫자, 특수문자 포함"
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">비밀번호 강도</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength <= 2 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 확인 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.fullName ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="실명을 입력하세요"
                    />
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      전화번호
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.phone ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="010-0000-0000"
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                      소속 기관
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all"
                      placeholder="예: OO초등학교, OO교육청"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                      직책 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="position"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all ${
                        errors.position ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      <option value="">선택하세요</option>
                      <option value="teacher">교사</option>
                      <option value="counselor">상담사</option>
                      <option value="administrator">교육행정직</option>
                      <option value="parent">학부모</option>
                      <option value="student">학생</option>
                      <option value="other">기타</option>
                    </select>
                    {errors.position && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.position}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                      가입 목적
                    </label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      rows={3}
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg shadow-soft focus:ring-2 focus:ring-wee-main focus:outline-none transition-all resize-none"
                      placeholder="Wee 프로젝트를 통해 기대하는 점을 간단히 작성해주세요"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Terms Agreement */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">약관 동의</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          id="agreeAll"
                          type="checkbox"
                          checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData({
                              ...formData,
                              agreeTerms: checked,
                              agreePrivacy: checked,
                              agreeMarketing: checked,
                            });
                          }}
                          className="mt-1 w-4 h-4 text-wee-main rounded focus:ring-wee-main"
                        />
                        <label htmlFor="agreeAll" className="ml-3 text-sm font-medium text-gray-900">
                          전체 동의
                        </label>
                      </div>
                      
                      <hr className="border-gray-300" />
                      
                      <div className="flex items-start">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-wee-main rounded focus:ring-wee-main"
                        />
                        <div className="ml-3">
                          <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                            [필수] 이용약관에 동의합니다.
                          </label>
                          <a href="#" className="text-xs text-wee-main hover:text-wee-dark ml-2">
                            내용보기
                          </a>
                        </div>
                      </div>
                      {errors.agreeTerms && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-7 text-sm text-red-600"
                        >
                          {errors.agreeTerms}
                        </motion.p>
                      )}
                      
                      <div className="flex items-start">
                        <input
                          id="agreePrivacy"
                          name="agreePrivacy"
                          type="checkbox"
                          checked={formData.agreePrivacy}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-wee-main rounded focus:ring-wee-main"
                        />
                        <div className="ml-3">
                          <label htmlFor="agreePrivacy" className="text-sm text-gray-700">
                            [필수] 개인정보처리방침에 동의합니다.
                          </label>
                          <a href="#" className="text-xs text-wee-main hover:text-wee-dark ml-2">
                            내용보기
                          </a>
                        </div>
                      </div>
                      {errors.agreePrivacy && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-7 text-sm text-red-600"
                        >
                          {errors.agreePrivacy}
                        </motion.p>
                      )}
                      
                      <div className="flex items-start">
                        <input
                          id="agreeMarketing"
                          name="agreeMarketing"
                          type="checkbox"
                          checked={formData.agreeMarketing}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-wee-main rounded focus:ring-wee-main"
                        />
                        <div className="ml-3">
                          <label htmlFor="agreeMarketing" className="text-sm text-gray-700">
                            [선택] 마케팅 정보 수신에 동의합니다.
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Wee 프로젝트의 유용한 소식과 이벤트 정보를 받아보실 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900">개인정보 수집 및 이용 안내</h4>
                        <p className="mt-1 text-sm text-blue-700">
                          수집 항목: 이메일, 이름, 전화번호, 소속기관, 직책<br />
                          수집 목적: 회원 관리 및 서비스 제공<br />
                          보유 기간: 회원 탈퇴 시까지
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    이전
                  </motion.button>
                )}
                
                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary ml-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    다음
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary ml-auto disabled:opacity-50"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        가입 중...
                      </div>
                    ) : (
                      '가입 완료'
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Login Link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="font-medium text-wee-main hover:text-wee-dark transition-colors"
              >
                로그인하기
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};