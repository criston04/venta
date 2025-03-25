"use client";

import { useState, useEffect } from "react";
import { getSuppliers, addSupplier, deleteSupplier } from "@/services/firebaseService";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "" });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        setError("Error al cargar los proveedores.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const addedSupplier = await addSupplier(newSupplier); // Guardar el proveedor en Firebase
      setSuppliers([...suppliers, { id: addedSupplier.id, ...newSupplier }]); // Agregar el proveedor con su ID único
      setNewSupplier({ name: "", contact: "" });
    } catch (error) {
      console.error("Error al agregar el proveedor:", error);
      setError("Error al agregar el proveedor.");
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return;

    try {
      await deleteSupplier(supplierId);
      setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
      setError("Error al eliminar el proveedor.");
    }
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Proveedores</h1>
      <form onSubmit={handleAddSupplier} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Agregar Proveedor</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input
            type="text"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Contacto</label>
          <input
            type="text"
            value={newSupplier.contact}
            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Agregar Proveedor
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Lista de Proveedores</h2>
        {loading ? (
          <p className="text-gray-600">Cargando proveedores...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-600">No se encontraron proveedores.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Nombre</th>
                <th className="border p-3 text-left">Contacto</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-100">
                  <td className="border p-3">{supplier.name}</td>
                  <td className="border p-3">{supplier.contact}</td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => handleDeleteSupplier(supplier.id)}
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
