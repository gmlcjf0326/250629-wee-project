import React from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions, getChartColors } from '../../config/chartConfig';

interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
  height?: number;
  options?: any;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  labels,
  datasets,
  height = 300,
  options = {},
}) => {
  const colors = getChartColors(datasets.length);

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || colors[index],
      backgroundColor: dataset.backgroundColor || `${colors[index]}20`,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: dataset.fill !== undefined ? dataset.fill : true,
      tension: dataset.tension !== undefined ? dataset.tension : 0.4,
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};