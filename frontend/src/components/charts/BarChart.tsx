import React from 'react';
import { Bar } from 'react-chartjs-2';
import { defaultChartOptions, getChartColors } from '../../config/chartConfig';

interface BarChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
  height?: number;
  options?: any;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  datasets,
  height = 300,
  options = {},
}) => {
  // Handle undefined or empty data
  if (!labels || !datasets || labels.length === 0 || datasets.length === 0) {
    return <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>No data available</p>
    </div>;
  }
  
  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || getChartColors(labels.length)[index],
      borderColor: dataset.borderColor || getChartColors(labels.length)[index],
      borderWidth: 1,
    })),
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
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};