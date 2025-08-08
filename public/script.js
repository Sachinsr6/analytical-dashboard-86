// Dummy Data - Keep this modular for easy API replacement
const financeData = {
    months: ['July', 'August', 'September', 'October', 'November', 'December'],
    revenue: [45000, 52000, 48000, 61000, 55000, 67000],
    expenses: [32000, 35000, 31000, 42000, 38000, 45000]
};

// Calculate derived data
function calculateFinancials(data) {
    const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
    const totalExpenses = data.expenses.reduce((sum, val) => sum + val, 0);
    const netProfit = totalRevenue - totalExpenses;
    const monthlyProfit = data.revenue.map((rev, index) => rev - data.expenses[index]);
    
    return {
        totalRevenue,
        totalExpenses,
        netProfit,
        monthlyProfit
    };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Update summary cards
function updateSummaryCards() {
    const calculations = calculateFinancials(financeData);
    
    document.getElementById('totalRevenue').textContent = formatCurrency(calculations.totalRevenue);
    document.getElementById('totalExpenses').textContent = formatCurrency(calculations.totalExpenses);
    document.getElementById('netProfit').textContent = formatCurrency(calculations.netProfit);
}

// Create Revenue vs Expenses Bar Chart
function createRevenueExpenseChart() {
    const ctx = document.getElementById('revenueExpenseChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: financeData.months,
            datasets: [
                {
                    label: 'Revenue',
                    data: financeData.revenue,
                    backgroundColor: '#27ae60',
                    borderColor: '#27ae60',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: financeData.expenses,
                    backgroundColor: '#e74c3c',
                    borderColor: '#e74c3c',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create Net Profit Line Chart
function createProfitTrendChart() {
    const ctx = document.getElementById('profitTrendChart').getContext('2d');
    const calculations = calculateFinancials(financeData);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: financeData.months,
            datasets: [{
                label: 'Net Profit',
                data: calculations.monthlyProfit,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#3498db',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Net Profit: ₹' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSummaryCards();
    createRevenueExpenseChart();
    createProfitTrendChart();
});
