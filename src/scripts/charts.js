// Chart Generation and Visualization

class ChartManager {
    constructor() {
        this.charts = {};
        this.initCharts();
    }

    initCharts() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.createPerformanceChart();
            this.createGradeDistributionChart();
        });
    }

    createPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Class Average',
                data: [72, 75, 78, 76, 79, 82],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.drawLineChart(ctx, data, {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        });
    }

    createGradeDistributionChart() {
        const canvas = document.getElementById('gradeDistribution');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = {
            labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'E (0-59)'],
            datasets: [{
                data: [8, 12, 15, 5, 2],
                backgroundColor: [
                    '#10b981', // Success green
                    '#3b82f6', // Primary blue
                    '#f59e0b', // Warning yellow
                    '#f97316', // Accent orange
                    '#ef4444'  // Error red
                ]
            }]
        };

        this.drawBarChart(ctx, data);
    }

    drawLineChart(ctx, data, options = {}) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart dimensions
        const chartArea = {
            left: 50,
            top: 20,
            right: width - 20,
            bottom: height - 40
        };
        
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        
        // Draw grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = chartArea.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        const pointSpacing = chartWidth / (data.labels.length - 1);
        for (let i = 0; i < data.labels.length; i++) {
            const x = chartArea.left + pointSpacing * i;
            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
        }
        
        // Draw data line
        const dataset = data.datasets[0];
        const maxValue = Math.max(...dataset.data);
        const points = [];
        
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        dataset.data.forEach((value, index) => {
            const x = chartArea.left + pointSpacing * index;
            const y = chartArea.bottom - (value / maxValue) * chartHeight;
            points.push({x, y});
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw fill area
        if (dataset.fill) {
            ctx.fillStyle = dataset.backgroundColor;
            ctx.beginPath();
            ctx.moveTo(points[0].x, chartArea.bottom);
            points.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.lineTo(points[points.length - 1].x, chartArea.bottom);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw data points
        ctx.fillStyle = dataset.borderColor;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        data.labels.forEach((label, index) => {
            const x = chartArea.left + pointSpacing * index;
            ctx.fillText(label, x, chartArea.bottom + 20);
        });
        
        // Draw y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue / 5) * (5 - i);
            const y = chartArea.top + (chartHeight / 5) * i;
            ctx.fillText(Math.round(value), chartArea.left - 10, y + 4);
        }
    }

    drawBarChart(ctx, data) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart dimensions
        const chartArea = {
            left: 80,
            top: 20,
            right: width - 20,
            bottom: height - 60
        };
        
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        
        const dataset = data.datasets[0];
        const maxValue = Math.max(...dataset.data);
        const barWidth = chartWidth / data.labels.length * 0.8;
        const barSpacing = chartWidth / data.labels.length * 0.2;
        
        // Draw bars
        dataset.data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = chartArea.left + (chartWidth / data.labels.length) * index + barSpacing / 2;
            const y = chartArea.bottom - barHeight;
            
            ctx.fillStyle = dataset.backgroundColor[index];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top of bar
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);
        });
        
        // Draw labels
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        
        data.labels.forEach((label, index) => {
            const x = chartArea.left + (chartWidth / data.labels.length) * index + (chartWidth / data.labels.length) / 2;
            const words = label.split(' ');
            words.forEach((word, wordIndex) => {
                ctx.fillText(word, x, chartArea.bottom + 15 + (wordIndex * 12));
            });
        });
        
        // Draw title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Grade Distribution', width / 2, 15);
    }

    updatePerformanceChart() {
        this.createPerformanceChart();
    }

    updateGradeDistribution() {
        this.createGradeDistributionChart();
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Export functions for global access
window.updatePerformanceChart = () => chartManager.updatePerformanceChart();
window.updateGradeDistribution = () => chartManager.updateGradeDistribution();