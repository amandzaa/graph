import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  categories: any[];
  products: any[];
}

const ProductsBarChart: React.FC<BarChartProps> = ({ categories, products }) => {
  const productsPerCategory = categories.map((category) => {
    const count = products.filter(
      (product) => product.category.id === category.id
    ).length;
    return { category: category.name, count };
  });

  const maxY = Math.ceil(Math.max(...productsPerCategory.map((item) => item.count)) * 1.2);

  const barChartData = {
    labels: productsPerCategory.map((item) => item.category),
    datasets: [
      {
        label: "Products per Category",
        data: productsPerCategory.map((item) => item.count),
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        minBarLength: 2, 
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    aspectRatio: 1.5, 
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          weight: "bold" as "bold",
        },
        bodyFont: {
          size: 12,
        },
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6B7280",
          maxRotation: 45, 
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6B7280",
          beginAtZero: true,
        },
        max: maxY,
      },
    },
  };

  return <Bar data={barChartData} options={barChartOptions} />;
};

export default ProductsBarChart;