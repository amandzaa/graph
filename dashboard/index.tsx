import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ProductsBarChart from "@/components/ui/BarChart";
import ProductsPieChart from "@/components/ui/PieChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(
          "https://api.escuelajs.co/api/v1/products"
        );
        const categoriesResponse = await axios.get(
          "https://api.escuelajs.co/api/v1/categories"
        );
        const usersResponse = await axios.get(
          "https://api.escuelajs.co/api/v1/users"
        );

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const generateFakeMonthlyPurchases = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const purchases = months.map((month, index) => {
      const base = index === 11 || index === 6 ? 300 : 200;
      return Math.floor(base + Math.random() * 100);
    });
    return { months, purchases };
  };

  const { months, purchases } = generateFakeMonthlyPurchases();

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Purchased Products",
        data: purchases,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-40 pt-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-pink-600">Dashboard</h1>
        <p className="text-gray-600">Visualize your data at a glance.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800">Total Products</h2>
          <p className="text-3xl font-extrabold text-pink-600">
            {products.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800">Total Categories</h2>
          <p className="text-3xl font-extrabold text-pink-600">
            {categories.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800">Total Users</h2>
          <p className="text-3xl font-extrabold text-pink-600">
            {users.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 lg:grid-cols-1 gap-6">
        {/* Line Chart for Purchased Products */}
        <div className="lg:col-span-full bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Purchased Products (Last 12 Months)
          </h3>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Products per Category
          </h3>
          <ProductsBarChart categories={categories} products={products} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Products per Category
          </h3>
          <ProductsPieChart categories={categories} products={products} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
