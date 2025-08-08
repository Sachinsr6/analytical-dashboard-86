import { useEffect, useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import ChartTypeSelector from '@/components/ui/chart-type-selector';

// Register Chart.js components immediately
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

// Icons
const DollarSignIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
    <polyline points="16,7 22,7 22,13"></polyline>
  </svg>
);

const CreditCardIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const BarChart3Icon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

// StatCard component
const StatCard = ({ title, value, description, trend, icon }) => {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">
        {description}
        {trend && (
          <span className={trend.isPositive ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
            {trend.isPositive ? "↗" : "↘"} {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};

// Revenue Chart
const RevenueChart = ({ data, chartType = 'line' }) => {
  const sampleData = data && data.labels ? data : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    xeroRevenue: [12000, 19000, 15000, 25000, 22000, 30000],
    paypalRevenue: [8000, 12000, 18000, 15000, 20000, 25000],
  };

  const lineData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Xero Revenue',
        data: sampleData.xeroRevenue,
        borderColor: 'hsl(268 83% 58%)', // Purple
        backgroundColor: 'hsl(268 83% 58% / 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(268 83% 58%)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'PayPal Revenue',
        data: sampleData.paypalRevenue,
        borderColor: 'hsl(188 95% 43%)', // Cyan
        backgroundColor: 'hsl(188 95% 43% / 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(188 95% 43%)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Transform data for pie chart
  const pieData = {
    labels: ['Xero Revenue', 'PayPal Revenue'],
    datasets: [
      {
        data: [
          sampleData.xeroRevenue.reduce((sum, val) => sum + val, 0),
          sampleData.paypalRevenue.reduce((sum, val) => sum + val, 0)
        ],
        backgroundColor: ['hsl(268 83% 58%)', 'hsl(188 95% 43%)'],
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  // Transform data for horizontal bar
  const horizontalBarData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Xero Revenue',
        data: sampleData.xeroRevenue,
        backgroundColor: 'hsl(268 83% 58%)', // Purple
        borderColor: 'hsl(268 83% 58%)',
        borderWidth: 1,
      },
      {
        label: 'PayPal Revenue',
        data: sampleData.paypalRevenue,
        backgroundColor: 'hsl(188 95% 43%)', // Cyan
        borderColor: 'hsl(188 95% 43%)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: chartType === 'pie' ? {} : {
      x: {
        type: 'category',
        display: true,
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={horizontalBarData} options={options} />;
      case 'horizontalBar':
        return <Bar data={horizontalBarData} options={options} />;
      case 'pie':
        return <Doughnut data={pieData} options={options} />;
      default:
        return <Line data={lineData} options={options} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Revenue Trends</CardTitle>
            <CardDescription>
              Monthly revenue comparison between Xero and PayPal
            </CardDescription>
          </div>
          <ChartTypeSelector
            value={chartType}
            onValueChange={data?.onChartTypeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

// Expense Chart
const ExpenseChart = ({ data, chartType = 'doughnut', onChartTypeChange }) => {
  // Dynamic expense data based on time period
  const getExpenseData = () => {
    if (data?.timePeriod === 'Annually') {
      return {
        categories: ['Office Supplies', 'Marketing', 'Travel', 'Software', 'Utilities'],
        amounts: [180000, 350000, 120000, 180000, 79000], // Annual amounts totaling ₹909,000
      };
    } else if (data?.timePeriod === 'Quarterly') {
      return {
        categories: ['Office Supplies', 'Marketing', 'Travel', 'Software', 'Utilities'],
        amounts: [45000, 87500, 30000, 45000, 19750], // Quarterly amounts totaling ~₹227,250
      };
    } else {
      return {
        categories: ['Office Supplies', 'Marketing', 'Travel', 'Software', 'Utilities'],
        amounts: [3500, 8200, 2100, 4800, 1900], // Monthly amounts totaling ₹20,500
      };
    }
  };

  const sampleData = getExpenseData();

  const doughnutData = {
    labels: sampleData.categories,
    datasets: [
      {
        data: sampleData.amounts,
        backgroundColor: [
          'hsl(25 95% 53%)',    // Orange for Office Supplies
          'hsl(249 83% 67%)',   // Indigo for Marketing  
          'hsl(142 76% 36%)',   // Green for Travel
          'hsl(268 83% 58%)',   // Purple for Software
          'hsl(188 95% 43%)',   // Cyan for Utilities
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  // Transform data for bar charts
  const barData = {
    labels: sampleData.categories,
    datasets: [
      {
        label: 'Expenses',
        data: sampleData.amounts,
        backgroundColor: [
          'hsl(25 95% 53%)',    // Orange for Office Supplies
          'hsl(249 83% 67%)',   // Indigo for Marketing  
          'hsl(142 76% 36%)',   // Green for Travel
          'hsl(268 83% 58%)',   // Purple for Software
          'hsl(188 95% 43%)',   // Cyan for Utilities
        ],
        borderColor: [
          'hsl(25 95% 53%)',    // Orange for Office Supplies
          'hsl(249 83% 67%)',   // Indigo for Marketing  
          'hsl(142 76% 36%)',   // Green for Travel
          'hsl(268 83% 58%)',   // Purple for Software
          'hsl(188 95% 43%)',   // Cyan for Utilities
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: chartType === 'doughnut' || chartType === 'pie' ? {} : {
      x: {
        display: true,
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={barData} options={options} />;
      case 'horizontalBar':
        return <Bar data={barData} options={options} />;
      case 'line':
        // For line chart, show expense trends over time periods instead of individual categories
        const getExpenseTrendData = () => {
          if (data?.timePeriod === 'Annually') {
            return {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              officeSupplies: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
              marketing: [29000, 29000, 29000, 29000, 29000, 29000, 29000, 29000, 29000, 29000, 29500, 29500],
              travel: [8000, 12000, 15000, 10000, 8000, 5000, 12000, 15000, 10000, 8000, 12000, 15000],
              software: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
              utilities: [6500, 6750, 7000, 6000, 5500, 7500, 8000, 7500, 6500, 6000, 6750, 7000]
            };
          } else if (data?.timePeriod === 'Quarterly') {
            return {
              labels: ['Month 1', 'Month 2', 'Month 3'],
              officeSupplies: [15000, 15000, 15000],
              marketing: [29000, 29000, 29500],
              travel: [10000, 10000, 10000],
              software: [15000, 15000, 15000],
              utilities: [6750, 6750, 6750]
            };
          } else {
            return {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              officeSupplies: [875, 875, 875, 875],
              marketing: [2050, 2050, 2050, 2050],
              travel: [525, 525, 525, 525],
              software: [1200, 1200, 1200, 1200],
              utilities: [475, 475, 475, 475]
            };
          }
        };

        const trendData = getExpenseTrendData();
        const lineData = {
          labels: trendData.labels,
          datasets: [
            {
              label: 'Office Supplies',
              data: trendData.officeSupplies,
              borderColor: 'hsl(25 95% 53%)',
              backgroundColor: 'hsl(25 95% 53% / 0.2)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Marketing',
              data: trendData.marketing,
              borderColor: 'hsl(249 83% 67%)',
              backgroundColor: 'hsl(249 83% 67% / 0.2)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Travel',
              data: trendData.travel,
              borderColor: 'hsl(142 76% 36%)',
              backgroundColor: 'hsl(142 76% 36% / 0.2)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Software',
              data: trendData.software,
              borderColor: 'hsl(268 83% 58%)',
              backgroundColor: 'hsl(268 83% 58% / 0.2)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Utilities',
              data: trendData.utilities,
              borderColor: 'hsl(188 95% 43%)',
              backgroundColor: 'hsl(188 95% 43% / 0.2)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
            },
          ],
        };
        return <Line data={lineData} options={options} />;
      default:
        return <Doughnut data={doughnutData} options={options} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Expense Breakdown</CardTitle>
            <CardDescription>
              Distribution of expenses by category
            </CardDescription>
          </div>
          <ChartTypeSelector
            value={chartType}
            onValueChange={onChartTypeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

// Cash Flow Chart
const CashFlowChart = ({ data, chartType = 'bar' }) => {
  const sampleData = data && data.labels ? data : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income: [20000, 31000, 33000, 40000, 42000, 55000],
    expenses: [15000, 18000, 21000, 25000, 28000, 32000],
  };

  const barData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Income',
        data: sampleData.income,
        backgroundColor: 'hsl(249 83% 67%)', // Indigo
        borderColor: 'hsl(249 83% 67%)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: sampleData.expenses,
        backgroundColor: 'hsl(25 95% 53%)', // Orange
        borderColor: 'hsl(25 95% 53%)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Transform data for line chart
  const lineData = {
    labels: sampleData.labels,
    datasets: [
      {
        label: 'Income',
        data: sampleData.income,
        borderColor: 'hsl(249 83% 67%)', // Indigo
        backgroundColor: 'hsl(249 83% 67% / 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: sampleData.expenses,
        borderColor: 'hsl(25 95% 53%)', // Orange
        backgroundColor: 'hsl(25 95% 53% / 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Transform data for pie chart
  const pieData = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        data: [
          sampleData.income.reduce((sum, val) => sum + val, 0),
          sampleData.expenses.reduce((sum, val) => sum + val, 0)
        ],
        backgroundColor: ['hsl(249 83% 67%)', 'hsl(25 95% 53%)'],
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: chartType === 'pie' ? {} : {
      x: {
        type: 'category',
        display: true,
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={lineData} options={options} />;
      case 'horizontalBar':
        return <Bar data={barData} options={options} />;
      case 'pie':
        return <Doughnut data={pieData} options={options} />;
      default:
        return <Bar data={barData} options={options} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Cash Flow Analysis</CardTitle>
            <CardDescription>
              Monthly income vs expenses comparison
            </CardDescription>
          </div>
          <ChartTypeSelector
            value={chartType}
            onValueChange={data?.onChartTypeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard = () => {
  const [timePeriod, setTimePeriod] = useState('Monthly');
  const [selectedPeriod, setSelectedPeriod] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [revenueChartType, setRevenueChartType] = useState('line');
  const [expenseChartType, setExpenseChartType] = useState('doughnut');
  const [cashFlowChartType, setCashFlowChartType] = useState('bar');

  // Generate options based on time period
  const getPeriodOptions = () => {
    switch (timePeriod) {
      case 'Monthly':
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      case 'Quarterly':
        return ['Q1', 'Q2', 'Q3', 'Q4'];
      case 'Annually':
        return ['2024', '2025'];
      default:
        return [];
    }
  };

  // Generate year options
  const getYearOptions = () => {
    return ['2024', '2025'];
  };

  // Get chart data based on selections
  const getChartData = () => {
    const key = timePeriod === 'Annually' ? selectedPeriod : `${selectedPeriod}_${selectedYear}`;
    
    if (timePeriod === 'Monthly') {
      const monthData = {
        // 2024 Data
        'January_2024': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [3000, 4750, 3750, 6250],
          paypalRevenue: [2000, 3000, 4500, 3750],
          income: [5000, 7750, 8250, 10000],
          expenses: [3750, 4500, 5250, 6250],
        },
        'February_2024': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [3500, 5250, 4250, 7000],
          paypalRevenue: [2500, 3500, 5000, 4250],
          income: [6000, 8750, 9250, 11250],
          expenses: [4000, 5000, 5750, 6750],
        },
        'March_2024': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [4000, 6000, 5000, 8000],
          paypalRevenue: [3000, 4000, 5500, 5000],
          income: [7000, 10000, 10500, 13000],
          expenses: [4500, 5500, 6250, 7500],
        },
        // 2025 Data
        'January_2025': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [4500, 6000, 5500, 8500],
          paypalRevenue: [3200, 4500, 6000, 5200],
          income: [7700, 10500, 11500, 13700],
          expenses: [4200, 5800, 6500, 7800],
        },
        'February_2025': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [5000, 7000, 6000, 9000],
          paypalRevenue: [3500, 5000, 6500, 5800],
          income: [8500, 12000, 12500, 14800],
          expenses: [4800, 6200, 7000, 8500],
        },
        'March_2025': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          xeroRevenue: [5500, 7500, 6500, 9500],
          paypalRevenue: [4000, 5500, 7000, 6200],
          income: [9500, 13000, 13500, 15700],
          expenses: [5200, 6800, 7500, 9000],
        },
      };
      return monthData[key] || monthData['January_2024'];
    } else if (timePeriod === 'Quarterly') {
      const quarterData = {
        'Q1_2024': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [36000, 57000, 45000],
          paypalRevenue: [24000, 36000, 54000],
          income: [60000, 93000, 99000],
          expenses: [45000, 54000, 63000],
        },
        'Q2_2024': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [42000, 63000, 51000],
          paypalRevenue: [28000, 42000, 60000],
          income: [70000, 105000, 111000],
          expenses: [52000, 61000, 70000],
        },
        'Q3_2024': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [48000, 69000, 57000],
          paypalRevenue: [32000, 48000, 66000],
          income: [80000, 117000, 123000],
          expenses: [58000, 68000, 77000],
        },
        'Q4_2024': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [54000, 75000, 63000],
          paypalRevenue: [36000, 54000, 72000],
          income: [90000, 129000, 135000],
          expenses: [65000, 75000, 85000],
        },
        'Q1_2025': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [60000, 81000, 69000],
          paypalRevenue: [40000, 60000, 78000],
          income: [100000, 141000, 147000],
          expenses: [72000, 82000, 92000],
        },
        'Q2_2025': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [66000, 87000, 75000],
          paypalRevenue: [44000, 66000, 84000],
          income: [110000, 153000, 159000],
          expenses: [78000, 88000, 98000],
        },
        'Q3_2025': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [72000, 93000, 81000],
          paypalRevenue: [48000, 72000, 90000],
          income: [120000, 165000, 171000],
          expenses: [84000, 94000, 104000],
        },
        'Q4_2025': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          xeroRevenue: [78000, 99000, 87000],
          paypalRevenue: [52000, 78000, 96000],
          income: [130000, 177000, 183000],
          expenses: [90000, 100000, 110000],
        }
      };
      return quarterData[key] || quarterData['Q1_2024'];
    } else { // Annually
      const yearData = {
        '2024': {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          xeroRevenue: [36000, 57000, 45000, 42000, 63000, 51000, 48000, 69000, 57000, 54000, 72000, 60000],
          paypalRevenue: [24000, 36000, 54000, 28000, 42000, 60000, 32000, 48000, 66000, 36000, 54000, 75000],
          income: [60000, 93000, 99000, 70000, 105000, 111000, 80000, 117000, 123000, 90000, 126000, 135000],
          expenses: [45000, 54000, 63000, 52000, 61000, 70000, 58000, 68000, 77000, 65000, 73000, 83000],
        },
        '2025': {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          xeroRevenue: [66000, 87000, 75000, 72000, 93000, 81000, 78000, 99000, 87000, 84000, 102000, 90000],
          paypalRevenue: [44000, 66000, 84000, 48000, 72000, 90000, 52000, 78000, 96000, 56000, 84000, 105000],
          income: [110000, 153000, 159000, 120000, 165000, 171000, 130000, 177000, 183000, 140000, 186000, 195000],
          expenses: [78000, 88000, 98000, 84000, 94000, 104000, 90000, 100000, 110000, 96000, 106000, 116000],
        }
      };
      return yearData[selectedPeriod] || yearData['2024'];
    }
  };

  // Get stats data based on selections
  const getStatsData = () => {
    const key = timePeriod === 'Annually' ? `${selectedPeriod}_${selectedYear}` : `${selectedPeriod}_${selectedYear}`;
    
    if (timePeriod === 'Monthly') {
      const monthStats = {
        'January_2024': {
          totalRevenue: '₹17,750',
          totalExpense: '₹20,500',
          netProfit: '₹2,500',
          netCashflow: '₹31,000',
          trends: {
            revenue: { value: 12.5, isPositive: true },
            expense: { value: 5.4, isPositive: false },
            profit: { value: 18.7, isPositive: true },
            cashflow: { value: 15.2, isPositive: true }
          }
        },
        'February_2024': {
          totalRevenue: '₹20,250',
          totalExpense: '₹17,500',
          netProfit: '₹2,750',
          netCashflow: '₹35,250',
          trends: {
            revenue: { value: 14.1, isPositive: true },
            expense: { value: 14.8, isPositive: false },
            profit: { value: 10.0, isPositive: true },
            cashflow: { value: 13.7, isPositive: true }
          }
        },
        'March_2024': {
          totalRevenue: '₹23,000',
          totalExpense: '₹19,750',
          netProfit: '₹3,250',
          netCashflow: '₹40,500',
          trends: {
            revenue: { value: 13.6, isPositive: true },
            expense: { value: 12.9, isPositive: false },
            profit: { value: 18.2, isPositive: true },
            cashflow: { value: 14.9, isPositive: true }
          }
        },
        'January_2023': {
          totalRevenue: '₹15,200',
          totalExpense: '₹13,100',
          netProfit: '₹2,100',
          netCashflow: '₹26,900',
          trends: {
            revenue: { value: 8.7, isPositive: true },
            expense: { value: 4.2, isPositive: false },
            profit: { value: 16.8, isPositive: true },
            cashflow: { value: 12.3, isPositive: true }
          }
        },
        'February_2023': {
          totalRevenue: '₹16,400',
          totalExpense: '₹14,200',
          netProfit: '₹2,200',
          netCashflow: '₹30,400',
          trends: {
            revenue: { value: 9.2, isPositive: true },
            expense: { value: 5.1, isPositive: false },
            profit: { value: 17.5, isPositive: true },
            cashflow: { value: 13.8, isPositive: true }
          }
        },
        'March_2023': {
          totalRevenue: '₹18,500',
          totalExpense: '₹15,800',
          netProfit: '₹2,700',
          netCashflow: '₹34,000',
          trends: {
            revenue: { value: 11.8, isPositive: true },
            expense: { value: 7.3, isPositive: false },
            profit: { value: 19.2, isPositive: true },
            cashflow: { value: 15.4, isPositive: true }
          }
        },
        // 2022 Monthly Stats
        'January_2022': {
          totalRevenue: '₹12,200',
          totalExpense: '₹10,000',
          netProfit: '₹2,200',
          netCashflow: '₹21,600',
          trends: {
            revenue: { value: 6.8, isPositive: true },
            expense: { value: 3.2, isPositive: false },
            profit: { value: 14.1, isPositive: true },
            cashflow: { value: 10.8, isPositive: true }
          }
        },
        'February_2022': {
          totalRevenue: '₹13,600',
          totalExpense: '₹11,200',
          netProfit: '₹2,400',
          netCashflow: '₹24,100',
          trends: {
            revenue: { value: 7.5, isPositive: true },
            expense: { value: 4.1, isPositive: false },
            profit: { value: 15.3, isPositive: true },
            cashflow: { value: 12.2, isPositive: true }
          }
        },
        'March_2022': {
          totalRevenue: '₹14,800',
          totalExpense: '₹12,600',
          netProfit: '₹2,200',
          netCashflow: '₹27,500',
          trends: {
            revenue: { value: 8.9, isPositive: true },
            expense: { value: 5.8, isPositive: false },
            profit: { value: 13.7, isPositive: true },
            cashflow: { value: 13.1, isPositive: true }
          }
        },
        // 2021 Monthly Stats
        'January_2021': {
          totalRevenue: '₹10,700',
          totalExpense: '₹8,800',
          netProfit: '₹1,900',
          netCashflow: '₹18,700',
          trends: {
            revenue: { value: 5.2, isPositive: true },
            expense: { value: 2.8, isPositive: false },
            profit: { value: 12.4, isPositive: true },
            cashflow: { value: 9.1, isPositive: true }
          }
        },
        'February_2021': {
          totalRevenue: '₹11,900',
          totalExpense: '₹9,900',
          netProfit: '₹2,000',
          netCashflow: '₹20,500',
          trends: {
            revenue: { value: 6.1, isPositive: true },
            expense: { value: 3.5, isPositive: false },
            profit: { value: 13.2, isPositive: true },
            cashflow: { value: 10.4, isPositive: true }
          }
        },
        'March_2021': {
          totalRevenue: '₹13,200',
          totalExpense: '₹11,000',
          netProfit: '₹2,200',
          netCashflow: '₹24,400',
          trends: {
            revenue: { value: 7.3, isPositive: true },
            expense: { value: 4.2, isPositive: false },
            profit: { value: 14.8, isPositive: true },
            cashflow: { value: 11.7, isPositive: true }
          }
        }
      };
      return monthStats[key] || monthStats['January_2024'];
    } else if (timePeriod === 'Quarterly') {
      const quarterStats = {
        'Q1_2024': {
          totalRevenue: '₹252,000',
          totalExpense: '₹162,000',
          netProfit: '₹90,000',
          netCashflow: '₹252,000',
          trends: {
            revenue: { value: 8.3, isPositive: true },
            expense: { value: 12.1, isPositive: false },
            profit: { value: 15.5, isPositive: true },
            cashflow: { value: 22.8, isPositive: true }
          }
        },
        'Q2_2024': {
          totalRevenue: '₹286,000',
          totalExpense: '₹183,000',
          netProfit: '₹103,000',
          netCashflow: '₹286,000',
          trends: {
            revenue: { value: 13.5, isPositive: true },
            expense: { value: 13.0, isPositive: false },
            profit: { value: 14.4, isPositive: true },
            cashflow: { value: 13.5, isPositive: true }
          }
        },
        'Q3_2024': {
          totalRevenue: '₹320,000',
          totalExpense: '₹203,000',
          netProfit: '₹117,000',
          netCashflow: '₹320,000',
          trends: {
            revenue: { value: 11.9, isPositive: true },
            expense: { value: 10.9, isPositive: false },
            profit: { value: 13.6, isPositive: true },
            cashflow: { value: 11.9, isPositive: true }
          }
        },
        'Q1_2023': {
          totalRevenue: '₹224,000',
          totalExpense: '₹144,000',
          netProfit: '₹80,000',
          netCashflow: '₹224,000',
          trends: {
            revenue: { value: 7.1, isPositive: true },
            expense: { value: 10.8, isPositive: false },
            profit: { value: 12.5, isPositive: true },
            cashflow: { value: 18.9, isPositive: true }
          }
        },
        'Q2_2023': {
          totalRevenue: '₹258,000',
          totalExpense: '₹162,000',
          netProfit: '₹96,000',
          netCashflow: '₹258,000',
          trends: {
            revenue: { value: 8.8, isPositive: true },
            expense: { value: 12.5, isPositive: false },
            profit: { value: 20.0, isPositive: true },
            cashflow: { value: 15.2, isPositive: true }
          }
        },
        'Q3_2023': {
          totalRevenue: '₹278,000',
          totalExpense: '₹177,000',
          netProfit: '₹101,000',
          netCashflow: '₹278,000',
          trends: {
            revenue: { value: 7.8, isPositive: true },
            expense: { value: 9.3, isPositive: false },
            profit: { value: 5.2, isPositive: true },
            cashflow: { value: 7.8, isPositive: true }
          }
        },
        'Q4_2023': {
          totalRevenue: '₹304,000',
          totalExpense: '₹192,000',
          netProfit: '₹112,000',
          netCashflow: '₹304,000',
          trends: {
            revenue: { value: 9.4, isPositive: true },
            expense: { value: 8.5, isPositive: false },
            profit: { value: 10.9, isPositive: true },
            cashflow: { value: 9.4, isPositive: true }
          }
        },
        // 2022 Quarterly Stats
        'Q1_2022': {
          totalRevenue: '₹195,000',
          totalExpense: '₹126,000',
          netProfit: '₹69,000',
          netCashflow: '₹195,000',
          trends: {
            revenue: { value: 6.0, isPositive: true },
            expense: { value: 9.5, isPositive: false },
            profit: { value: 10.2, isPositive: true },
            cashflow: { value: 16.1, isPositive: true }
          }
        },
        'Q2_2022': {
          totalRevenue: '₹222,000',
          totalExpense: '₹142,000',
          netProfit: '₹80,000',
          netCashflow: '₹222,000',
          trends: {
            revenue: { value: 13.8, isPositive: true },
            expense: { value: 12.7, isPositive: false },
            profit: { value: 15.9, isPositive: true },
            cashflow: { value: 13.8, isPositive: true }
          }
        },
        'Q3_2022': {
          totalRevenue: '₹249,000',
          totalExpense: '₹158,000',
          netProfit: '₹91,000',
          netCashflow: '₹249,000',
          trends: {
            revenue: { value: 12.2, isPositive: true },
            expense: { value: 11.3, isPositive: false },
            profit: { value: 13.8, isPositive: true },
            cashflow: { value: 12.2, isPositive: true }
          }
        },
        'Q4_2022': {
          totalRevenue: '₹276,000',
          totalExpense: '₹174,000',
          netProfit: '₹102,000',
          netCashflow: '₹276,000',
          trends: {
            revenue: { value: 10.8, isPositive: true },
            expense: { value: 10.1, isPositive: false },
            profit: { value: 12.1, isPositive: true },
            cashflow: { value: 10.8, isPositive: true }
          }
        },
        // 2021 Quarterly Stats
        'Q1_2021': {
          totalRevenue: '₹168,000',
          totalExpense: '₹108,000',
          netProfit: '₹60,000',
          netCashflow: '₹168,000',
          trends: {
            revenue: { value: 5.0, isPositive: true },
            expense: { value: 8.0, isPositive: false },
            profit: { value: 8.8, isPositive: true },
            cashflow: { value: 13.5, isPositive: true }
          }
        },
        'Q2_2021': {
          totalRevenue: '₹192,000',
          totalExpense: '₹124,000',
          netProfit: '₹68,000',
          netCashflow: '₹192,000',
          trends: {
            revenue: { value: 14.3, isPositive: true },
            expense: { value: 14.8, isPositive: false },
            profit: { value: 13.3, isPositive: true },
            cashflow: { value: 14.3, isPositive: true }
          }
        },
        'Q3_2021': {
          totalRevenue: '₹217,000',
          totalExpense: '₹140,000',
          netProfit: '₹77,000',
          netCashflow: '₹217,000',
          trends: {
            revenue: { value: 13.0, isPositive: true },
            expense: { value: 12.9, isPositive: false },
            profit: { value: 13.2, isPositive: true },
            cashflow: { value: 13.0, isPositive: true }
          }
        },
        'Q4_2021': {
          totalRevenue: '₹244,000',
          totalExpense: '₹156,000',
          netProfit: '₹88,000',
          netCashflow: '₹244,000',
          trends: {
            revenue: { value: 12.4, isPositive: true },
            expense: { value: 11.4, isPositive: false },
            profit: { value: 14.3, isPositive: true },
            cashflow: { value: 12.4, isPositive: true }
          }
        }
      };
      return quarterStats[key] || quarterStats['Q1_2024'];
    } else { // Annually
      const yearStats = {
        '2024_2024': {
          totalRevenue: '₹1,371,000',
          totalExpense: '₹909,000',
          netProfit: '₹462,000',
          netCashflow: '₹1,371,000',
          trends: {
            revenue: { value: 25.4, isPositive: true },
            expense: { value: 18.9, isPositive: false },
            profit: { value: 32.1, isPositive: true },
            cashflow: { value: 28.7, isPositive: true }
          }
        },
        '2025_2025': {
          totalRevenue: '₹1,875,000',
          totalExpense: '₹1,164,000',
          netProfit: '₹711,000',
          netCashflow: '₹1,875,000',
          trends: {
            revenue: { value: 54.7, isPositive: true },
            expense: { value: 28.1, isPositive: false },
            profit: { value: 134.7, isPositive: true },
            cashflow: { value: 54.7, isPositive: true }
          }
        }
      };
      return yearStats[key] || yearStats['2024_2024'];
    }
  };

  const chartData = getChartData();
  const statsData = getStatsData();

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>

        {/* Time Period Selectors */}
        <div className="mb-6 flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between">
                {timePeriod}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]">
              <DropdownMenuItem onClick={() => {
                setTimePeriod('Monthly');
                setSelectedPeriod('January');
              }}>
                Monthly
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setTimePeriod('Quarterly');
                 setSelectedPeriod('Q1');
               }}>
                Quarterly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setTimePeriod('Annually');
                setSelectedPeriod('2024');
              }}>
                Annually
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between">
                {selectedPeriod}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]">
              {getPeriodOptions().map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSelectedPeriod(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year Dropdown - Show only for Monthly and Quarterly */}
          {(timePeriod === 'Monthly' || timePeriod === 'Quarterly') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between">
                  {selectedYear}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]">
                {getYearOptions().map((year) => (
                  <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-4 mb-6">
          <StatCard
            title="Total Revenue"
            value={statsData.totalRevenue}
            description={`This ${timePeriod.toLowerCase().slice(0, -2)}`}
            trend={statsData.trends.revenue}
            icon={<DollarSignIcon />}
          />
          <StatCard
            title="Total Expense"
            value={statsData.totalExpense}
            description={`This ${timePeriod.toLowerCase().slice(0, -2)}`}
            trend={statsData.trends.expense}
            icon={<CreditCardIcon />}
          />
          <StatCard
            title="Net Profit"
            value={statsData.netProfit}
            description={`This ${timePeriod.toLowerCase().slice(0, -2)}`}
            trend={statsData.trends.profit}
            icon={<TrendingUpIcon />}
          />
          <StatCard
            title="Net Cashflow"
            value={statsData.netCashflow}
            description={`Net this ${timePeriod.toLowerCase().slice(0, -2)}`}
            trend={statsData.trends.cashflow}
            icon={<BarChart3Icon />}
          />
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <RevenueChart 
            data={{
              ...chartData,
              onChartTypeChange: setRevenueChartType
            }}
            chartType={revenueChartType}
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <ExpenseChart 
              data={{
                ...chartData,
                timePeriod: timePeriod
              }}
              chartType={expenseChartType}
              onChartTypeChange={setExpenseChartType}
            />
            <CashFlowChart 
              data={{
                ...chartData,
                onChartTypeChange: setCashFlowChartType
              }}
              chartType={cashFlowChartType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;