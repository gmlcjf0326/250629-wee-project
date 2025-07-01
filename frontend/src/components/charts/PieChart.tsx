import React from 'react';
import { Pie } from 'react-chartjs-2';
import { defaultChartOptions, getChartColors } from '../../config/chartConfig';

interface PieChartProps {
  title?: string;
  labels: string[];
  data: number[];
  height?: number;
  options?: any;
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  data,
  height = 300,
  options = {},
}) => {
  // Handle undefined or empty data
  if (!labels || !data || labels.length === 0 || data.length === 0) {
    return <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>No data available</p>
    </div>;
  }
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: getChartColors(labels.length),
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    ...defaultChartOptions,
    ...options,
    plugins: {
      ...defaultChartOptions.plugins,
      ...options.plugins,
      title: {
        ...defaultChartOptions.plugins.title,
        display: !!title,
        text: title,
        ...options.plugins?.title,
      },
      legend: {
        ...defaultChartOptions.plugins.legend,
        position: 'right' as const,
        ...options.plugins?.legend,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};