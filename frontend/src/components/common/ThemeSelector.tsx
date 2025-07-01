import React, { useState, useEffect } from 'react';

export type ThemeType = 'modern' | 'portal' | 'magazine';

interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('modern');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('wee-theme') as ThemeType;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: ThemeType) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-modern', 'theme-portal', 'theme-magazine');
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    
    // Apply theme-specific body classes for layout changes
    document.body.classList.remove('layout-sidebar', 'layout-mega-menu', 'layout-magazine');
    
    if (theme === 'modern') {
      document.body.classList.add('layout-sidebar');
    } else if (theme === 'portal') {
      document.body.classList.add('layout-mega-menu');
    } else if (theme === 'magazine') {
      document.body.classList.add('layout-magazine');
    }
  };

  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    localStorage.setItem('wee-theme', theme);
    applyTheme(theme);
    setIsOpen(false);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new Event('themeChanged'));
  };

  const themes = [
    {
      id: 'modern',
      name: '모던 대시보드',
      description: '좌측 사이드바와 카드 기반의 현대적 레이아웃',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      id: 'portal',
      name: '정부 포털',
      description: '메가메뉴와 정보 중심의 전통적 공공기관 레이아웃',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      preview: 'bg-gradient-to-br from-blue-900 to-gray-800'
    },
    {
      id: 'magazine',
      name: '시민 매거진',
      description: '이미지 중심의 스토리텔링 매거진 레이아웃',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      preview: 'bg-gradient-to-br from-orange-400 to-pink-500'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-button"
        aria-label="레이아웃 테마 선택"
      >
        {themes.find(t => t.id === selectedTheme)?.icon}
        <span className="hidden sm:inline">레이아웃 변경</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-selector-dropdown">
          <h3 className="text-lg font-semibold mb-4">레이아웃 테마 선택</h3>
          <p className="text-sm text-gray-600 mb-4">
            전체 사이트의 레이아웃과 디자인이 변경됩니다
          </p>
          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as ThemeType)}
                className={`theme-option ${selectedTheme === theme.id ? 'active' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`theme-icon ${theme.preview}`}>
                    {theme.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium">{theme.name}</h4>
                    <p className="text-sm opacity-75 mt-1">{theme.description}</p>
                  </div>
                  {selectedTheme === theme.id && (
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;