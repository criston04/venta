"use client";

import { useEffect, useState } from "react";
import { getInvoices, deleteInvoice } from "@/services/firebaseService";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const invoicesData = await getInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
        setError("Error al cargar el historial de facturas.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (invoiceId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta factura?")) return;

    try {
      await deleteInvoice(invoiceId);
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      setError("Error al eliminar la factura.");
    }
  };

  return (
    <div className="p-8 text-black bg-cyan-400 min-h-screen">
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
            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
          />
        </svg>
        Historial de Facturas
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-gray-600">Cargando facturas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : invoices.length === 0 ? (
          <p className="text-gray-600">No se encontraron facturas registradas.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Cliente</th>
                <th className="border p-3 text-left">Total</th>
                <th className="border p-3 text-left">Fecha</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-100">
                  <td className="border p-3">{invoice.customerName}</td>
                  <td className="border p-3">${invoice.total.toFixed(2)}</td>
                  <td className="border p-3">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
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
