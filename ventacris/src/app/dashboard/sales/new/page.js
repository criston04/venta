"use client";

import { useState } from "react";
import { addSale } from "@/services/firebaseService";

export default function NewSale() {
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      await addSale({
        customerName, // Registrar el nombre del cliente
        product,
        quantity,
        price: parseFloat(price),
        total: parseFloat(price) * quantity,
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setCustomerName("");
      setProduct("");
      setQuantity(1);
      setPrice("");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Nueva Venta</h1>
      {success && (
        <p className="text-green-500 mb-4">¡Venta registrada exitosamente!</p>
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
          <label className="block text-gray-700 font-semibold mb-2">
            Producto
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Cantidad
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Precio Unitario
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Registrando..." : "Registrar Venta"}
        </button>
      </form>
    </div>
  );
}
