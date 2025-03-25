"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/firebaseService";
import * as XLSX from "xlsx";

export default function InventoryReport() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("Error al cargar el reporte de inventario.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateTotalStockValue = () => {
    return products.reduce(
      (total, product) => total + parseFloat(product.price || 0) * parseInt(product.stock || 0),
      0
    ).toFixed(2);
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["Producto", "Precio Unitario", "Stock", "Valor Total"],
      ...products.map((p) => [
        p.name,
        parseFloat(p.price || 0).toFixed(2),
        p.stock,
        (parseFloat(p.price || 0) * parseInt(p.stock || 0)).toFixed(2),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Inventario");

    XLSX.writeFile(workbook, "reporte_inventario.xlsx");
  };

  return (
    <div className="p-8 text-black bg-blue-200 min-h-screen">
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Reporte de Inventario
      </h1>
      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4"
      >
        Exportar a Excel
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-gray-600">Cargando reporte de inventario...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No se encontraron productos registrados.</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">
              Valor Total del Inventario: ${calculateTotalStockValue()}
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3 text-left">Producto</th>
                  <th className="border p-3 text-left">Precio Unitario</th>
                  <th className="border p-3 text-left">Stock</th>
                  <th className="border p-3 text-left">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border p-3">{product.name}</td>
                    <td className="border p-3">${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td className="border p-3">{product.stock}</td>
                    <td className="border p-3">
                      ${(parseFloat(product.price || 0) * parseInt(product.stock || 0)).toFixed(2)}
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
