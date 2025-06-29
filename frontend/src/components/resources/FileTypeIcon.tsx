import React from 'react';

interface FileTypeIconProps {
  fileName: string;
  mimeType?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ 
  fileName, 
  mimeType, 
  size = 'md',
  className = '' 
}) => {
  const getFileExtension = (filename: string) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getIconContent = () => {
    const ext = getFileExtension(fileName);
    
    // PDF
    if (ext === 'pdf' || mimeType === 'application/pdf') {
      return (
        <div className={`${getSizeClasses()} ${className} bg-red-100 text-red-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L8,14H10L11.5,17.5L13,14H15L13,19H10Z" />
          </svg>
        </div>
      );
    }
    
    // Word documents
    if (['doc', 'docx'].includes(ext) || mimeType?.includes('word')) {
      return (
        <div className={`${getSizeClasses()} ${className} bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,17H17V15H7V17M7,13H17V11H7V13Z" />
          </svg>
        </div>
      );
    }
    
    // Excel files
    if (['xls', 'xlsx'].includes(ext) || mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) {
      return (
        <div className={`${getSizeClasses()} ${className} bg-green-100 text-green-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,11H10V13H8V11M8,14H10V16H8V14M8,17H10V19H8V17M11,11H16V13H11V11M11,14H16V16H11V14M11,17H16V19H11V17Z" />
          </svg>
        </div>
      );
    }
    
    // PowerPoint files
    if (['ppt', 'pptx'].includes(ext) || mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) {
      return (
        <div className={`${getSizeClasses()} ${className} bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,10V18H10V16H13A2,2 0 0,0 15,14V12A2,2 0 0,0 13,10H8M10,12H13V14H10V12Z" />
          </svg>
        </div>
      );
    }
    
    // ZIP files
    if (['zip', 'rar', '7z'].includes(ext) || mimeType?.includes('zip') || mimeType?.includes('compressed')) {
      return (
        <div className={`${getSizeClasses()} ${className} bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,4V8L16,8M10,10H12V12H10V10M10,14H12V16H10V14M10,18H12V20H10V18Z" />
          </svg>
        </div>
      );
    }
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext) || mimeType?.includes('image')) {
      return (
        <div className={`${getSizeClasses()} ${className} bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center`}>
          <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M13,13L11,18H8L10,13H8L12,8L16,13H13Z" />
          </svg>
        </div>
      );
    }
    
    // Default file icon
    return (
      <div className={`${getSizeClasses()} ${className} bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center`}>
        <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>
    );
  };

  return getIconContent();
};

export default FileTypeIcon;