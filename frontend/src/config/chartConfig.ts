import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: "'Noto Sans KR', sans-serif",
          size: 12,
        },
      },
    },
    title: {
      display: false,
      font: {
        family: "'Noto Sans KR', sans-serif",
        size: 16,
        weight: 'bold',
      },
    },
    tooltip: {
      bodyFont: {
        family: "'Noto Sans KR', sans-serif",
      },
      titleFont: {
        family: "'Noto Sans KR', sans-serif",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: "'Noto Sans KR', sans-serif",
          size: 11,
        },
      },
    },
    y: {
      ticks: {
        font: {
          family: "'Noto Sans KR', sans-serif",
          size: 11,
        },
      },
    },
  },
};

// Wee project color palette
export const chartColors = {
  primary: '#0066CC',
  secondary: '#4A90E2',
  success: '#5CB85C',
  warning: '#F0AD4E',
  danger: '#D9534F',
  info: '#5BC0DE',
  gray: '#6C757D',
  lightGray: '#F8F9FA',
  darkGray: '#343A40',
};

// Generate color array for charts
export const getChartColors = (count: number): string[] => {
  const colors = Object.values(chartColors);
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};