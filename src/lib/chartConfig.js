import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement
);

export const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-revenue))",
  },
  expense: {
    label: "Expense", 
    color: "hsl(var(--chart-expense))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-profit))",
  },
  xero: {
    label: "Xero",
    color: "hsl(var(--chart-xero))",
  },
  paypal: {
    label: "PayPal", 
    color: "hsl(var(--chart-paypal))",
  },
};

export const chartColors = {
  revenue: '#6366f1',
  expense: '#f97316', 
  profit: '#10b981',
  xero: '#8b5cf6',
  paypal: '#06b6d4',
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
      beginAtZero: true,
    },
  },
};