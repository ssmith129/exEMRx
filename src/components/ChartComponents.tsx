import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Filler
} from 'chart.js';
import {
  Line,
  Bar,
  Pie,
  Doughnut
} from 'react-chartjs-2';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  height?: string;
  loading?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  icon,
  actions,
  height = "h-80",
  loading = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-primary-600">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
      <div className={`${height} relative`}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-sm text-gray-500">Loading chart...</span>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Common chart options with accessibility and responsiveness
const getBaseOptions = (title?: string): ChartOptions<any> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12,
          family: 'Inter'
        }
      }
    },
    title: {
      display: !!title,
      text: title,
      font: {
        size: 16,
        weight: 'bold',
        family: 'Inter'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        family: 'Inter'
      },
      bodyFont: {
        size: 13,
        family: 'Inter'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter'
        }
      }
    },
    y: {
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter'
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  }
});

interface PatientFlowChartProps {
  data?: ChartData<'line'>;
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export const PatientFlowChart: React.FC<PatientFlowChartProps> = ({
  data,
  timeframe = 'week',
  onTimeframeChange
}) => {
  const defaultData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patients Seen',
        data: [12, 19, 8, 15, 22, 8, 14],
        borderColor: '#0066CC',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0066CC',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Appointments Scheduled',
        data: [8, 14, 12, 18, 25, 12, 16],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    ...getBaseOptions(),
    scales: {
      ...getBaseOptions().scales,
      y: {
        ...getBaseOptions().scales?.y,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Patients',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      }
    }
  };

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  return (
    <ChartContainer
      title="Patient Flow Trends"
      icon={<TrendingUp className="h-5 w-5" />}
      actions={
        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange?.(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {timeframes.map(tf => (
            <option key={tf.value} value={tf.value}>{tf.label}</option>
          ))}
        </select>
      }
    >
      <Line data={data || defaultData} options={options} />
    </ChartContainer>
  );
};

interface ComplianceChartProps {
  data?: ChartData<'doughnut'>;
}

export const ComplianceChart: React.FC<ComplianceChartProps> = ({ data }) => {
  const defaultData: ChartData<'doughnut'> = {
    labels: ['Complete', 'In Progress', 'Needs Attention', 'Overdue'],
    datasets: [
      {
        data: [75, 15, 8, 2],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444'
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#D97706',
          '#DC2626'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    ...getBaseOptions(),
    plugins: {
      ...getBaseOptions().plugins,
      tooltip: {
        ...getBaseOptions().plugins?.tooltip,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <ChartContainer
      title="Compliance Overview"
      icon={<PieChart className="h-5 w-5" />}
      height="h-64"
    >
      <Doughnut data={data || defaultData} options={options} />
    </ChartContainer>
  );
};

interface ActivityMetricsProps {
  data?: ChartData<'bar'>;
}

export const ActivityMetricsChart: React.FC<ActivityMetricsProps> = ({ data }) => {
  const defaultData: ChartData<'bar'> = {
    labels: ['Charting', 'Referrals', 'Compliance', 'Appointments', 'Reports'],
    datasets: [
      {
        label: 'AI Assisted',
        data: [85, 92, 78, 65, 88],
        backgroundColor: '#0066CC',
        borderColor: '#0052A3',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Manual',
        data: [15, 8, 22, 35, 12],
        backgroundColor: '#6B7280',
        borderColor: '#4B5563',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    ...getBaseOptions(),
    scales: {
      ...getBaseOptions().scales,
      x: {
        ...getBaseOptions().scales?.x,
        stacked: true
      },
      y: {
        ...getBaseOptions().scales?.y,
        stacked: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      }
    }
  };

  return (
    <ChartContainer
      title="AI vs Manual Activity"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <Bar data={data || defaultData} options={options} />
    </ChartContainer>
  );
};

interface GrowthChartProps {
  heightData: Array<{ date: string; value: number; percentile: number }>;
  weightData: Array<{ date: string; value: number; percentile: number }>;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ heightData, weightData }) => {
  const data: ChartData<'line'> = {
    labels: heightData.map(d => d.date),
    datasets: [
      {
        label: 'Height (cm)',
        data: heightData.map(d => d.value),
        borderColor: '#0066CC',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#0066CC',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Weight (kg)',
        data: weightData.map(d => d.value),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    ...getBaseOptions(),
    scales: {
      x: {
        ...getBaseOptions().scales?.x,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Height (cm)',
          font: {
            size: 12,
            family: 'Inter'
          }
        },
        grid: {
          color: '#f3f4f6'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Weight (kg)',
          font: {
            size: 12,
            family: 'Inter'
          }
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  return (
    <ChartContainer
      title="Growth Tracking"
      icon={<Activity className="h-5 w-5" />}
      height="h-96"
    >
      <Line data={data} options={options} />
    </ChartContainer>
  );
};

export default ChartContainer;