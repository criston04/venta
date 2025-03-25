"use client";

import { useState } from "react";
import { addInvoice } from "@/services/firebaseService";

export default function NewInvoice() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, price: "" }]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, price: "" }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      const total = items.reduce(
        (sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1),
        0
      );

      await addInvoice({
        customerName,
        items,
        total,
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setCustomerName("");
      setItems([{ description: "", quantity: 1, price: "" }]);
    } catch (error) {
      console.error("Error al registrar la factura:", error);
    } finally {
      setLoading(false);
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
        Nueva Factura
      </h1>
      {success && (
        <p className="text-green-500 mb-4">¡Factura registrada exitosamente!</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Nombre del Cliente
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Artículos</h2>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Descripción"
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className="w-24 p-3 border border-gray-300 rounded-lg"
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                className="w-24 p-3 border border-gray-300 rounded-lg"
                step="0.01"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Agregar Artículo
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Registrando..." : "Registrar Factura"}
        </button>
      </form>
    </div>
  );
}
