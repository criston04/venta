"use client";

import { useEffect, useState } from "react";
import { getSales, deleteSale } from "@/services/firebaseService";
import * as XLSX from "xlsx";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ date: "", customer: "", product: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const salesData = await getSales();
        setSales(salesData);
        setFilteredSales(salesData);
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
      setFilteredSales(filteredSales.filter((sale) => sale.id !== saleId));
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      setError("Error al eliminar la venta.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    const filtered = sales.filter((sale) => {
      const matchesDate = filters.date
        ? new Date(sale.date).toLocaleDateString() === new Date(value).toLocaleDateString()
        : true;
      const matchesCustomer = filters.customer
        ? sale.customerName.toLowerCase().includes(value.toLowerCase())
        : true;
      const matchesProduct = filters.product
        ? sale.product.toLowerCase().includes(value.toLowerCase())
        : true;

      return matchesDate && matchesCustomer && matchesProduct;
    });

    setFilteredSales(filtered);
    setCurrentPage(1); // Reiniciar a la primera página
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["Cliente", "Producto", "Cantidad", "Precio Unitario", "Total", "Fecha"],
      ...filteredSales.map((sale) => [
        sale.customerName,
        sale.product,
        sale.quantity,
        sale.price.toFixed(2),
        sale.total.toFixed(2),
        new Date(sale.date).toLocaleDateString(),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial de Ventas");

    XLSX.writeFile(workbook, "historial_ventas.xlsx");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedSales = [...filteredSales].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSales(sortedSales);
  };

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-black">
      <h1 className="text-3xl font-bold mb-6">Historial de Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="customer"
          placeholder="Buscar por cliente"
          value={filters.customer}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="product"
          placeholder="Buscar por producto"
          value={filters.product}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </div>
      <div>
        {loading ? (
          <p className="text-gray-600">Cargando ventas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredSales.length === 0 ? (
          <p className="text-gray-600">No se encontraron ventas registradas.</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    className="border p-3 text-left cursor-pointer"
                    onClick={() => handleSort("customerName")}
                  >
                    Cliente
                  </th>
                  <th
                    className="border p-3 text-left cursor-pointer"
                    onClick={() => handleSort("product")}
                  >
                    Producto
                  </th>
                  <th
                    className="border p-3 text-left cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    Cantidad
                  </th>
                  <th
                    className="border p-3 text-left cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    Total
                  </th>
                  <th
                    className="border p-3 text-left cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Fecha
                  </th>
                  <th className="border p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-100">
                    <td className="border p-3">{sale.customerName}</td>
                    <td className="border p-3">{sale.product}</td>
                    <td className="border p-3">{sale.quantity}</td>
                    <td className="border p-3">${sale.total.toFixed(2)}</td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <p>
                Página {currentPage} de {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
