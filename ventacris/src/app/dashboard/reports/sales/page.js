"use client";

import { useEffect, useState } from "react";
import { getSales } from "@/services/firebaseService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChart, setShowChart] = useState(false); // Estado para mostrar/ocultar el gráfico

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const salesData = await getSales();
        setSales(salesData);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
        setError("Error al cargar el reporte de ventas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => total + (sale.total || 0), 0).toFixed(2);
  };

  const salesChartData = {
    labels: sales.map((sale) => new Date(sale.date).toLocaleDateString()),
    datasets: [
      {
        label: "Ventas Totales",
        data: sales.map((sale) => sale.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-8 text-black bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mr-3 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Reporte de Ventas
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-gray-600">Cargando reporte de ventas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : sales.length === 0 ? (
          <p className="text-gray-600">No se encontraron ventas registradas.</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">
              Total de Ventas: ${calculateTotalSales()}
            </h2>
            <button
              onClick={() => setShowChart(!showChart)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
            >
              {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
            </button>
            {showChart && <Bar data={salesChartData} />}
            <table className="w-full border-collapse mt-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Cliente</th>
                  <th className="border p-3 text-left">Producto</th>
                  <th className="border p-3 text-left">Cantidad</th>
                  <th className="border p-3 text-left">Total</th>
                  <th className="border p-3 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-100">
                    <td className="border p-3">{sale.customerName}</td>
                    <td className="border p-3">{sale.product}</td>
                    <td className="border p-3">{sale.quantity}</td>
                    <td className="border p-3">${(sale.total || 0).toFixed(2)}</td>
                    <td className="border p-3">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
