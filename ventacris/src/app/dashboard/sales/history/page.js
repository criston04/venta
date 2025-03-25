"use client";

import { useEffect, useState } from "react";
import { getSales, deleteSale } from "@/services/firebaseService";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(""); // Estado de error

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const salesData = await getSales(); // Obtener las ventas del usuario autenticado
        setSales(salesData);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
        setError("Error al cargar el historial de ventas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (saleId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta venta?")) return;

    try {
      await deleteSale(saleId);
      setSales(sales.filter((sale) => sale.id !== saleId));
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      setError("Error al eliminar la venta.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-700">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Historial de Ventas</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {sales.length === 0 ? (
          <p className="text-gray-600">No se encontraron ventas registradas.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Cliente</th>
                <th className="border p-3 text-left">Producto</th>
                <th className="border p-3 text-left">Cantidad</th>
                <th className="border p-3 text-left">Precio Unitario</th>
                <th className="border p-3 text-left">Total</th>
                <th className="border p-3 text-left">Fecha</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-100">
                  <td className="border p-3">{sale.customerName}</td>
                  <td className="border p-3">{sale.product}</td>
                  <td className="border p-3">{sale.quantity}</td>
                  <td className="border p-3">${sale.price.toFixed(2)}</td>
                  <td className="border p-3">${(sale.total || 0).toFixed(2)}</td>
                  <td className="border p-3">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => alert("Función de edición no implementada aún.")}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
