import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-600 border-blue-200',
    secondary: 'bg-gray-50 text-gray-600 border-gray-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  };

  const iconColorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    info: 'text-cyan-500',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && (
            <p className="mt-1 text-sm opacity-75">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 opacity-75">전월 대비</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`ml-4 ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};