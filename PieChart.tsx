import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  categories: any[];
  products: any[];
}

const ProductsPieChart: React.FC<PieChartProps> = ({ categories, products }) => {
  const productsPerCategory = categories.map((category) => {
    const count = products.filter(
      (product) => product.category.id === category.id
    ).length;
    return { category: category.name, count };
  });

  const pieChartData = {
    labels: productsPerCategory.map((item) => item.category),
    datasets: [
      {
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
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        cornerRadius: 6,
      },
    },
  };

  return <Pie data={pieChartData} options={pieChartOptions} />;
};

export default ProductsPieChart;