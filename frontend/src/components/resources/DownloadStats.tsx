import React from 'react';

interface DownloadStatsProps {
  downloads: number;
  lastDownload?: string;
  showTrend?: boolean;
  previousDownloads?: number;
}

const DownloadStats: React.FC<DownloadStatsProps> = ({
  downloads,
  lastDownload,
  showTrend = false,
  previousDownloads = 0
}) => {
  const calculateTrend = () => {
    if (!showTrend || previousDownloads === 0) return null;
    const change = ((downloads - previousDownloads) / previousDownloads) * 100;
    return change;
  };

  const trend = calculateTrend();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          {formatNumber(downloads)}
        </span>
      </div>

      {trend !== null && (
        <div className={`flex items-center gap-0.5 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}

      {lastDownload && (
        <span className="text-xs text-gray-500">
          • 마지막: {formatDate(lastDownload)}
        </span>
      )}
    </div>
  );
};

export default DownloadStats;