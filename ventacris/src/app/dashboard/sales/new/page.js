"use client";

import { useState } from "react";
import { addSale } from "@/services/firebaseService";
import { getPersonByDNI } from "@/apis/dniApi";

export default function NewSale() {
  const [dni, setDni] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchDNI = async () => {
    if (!dni || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }

    try {
      setError("");
      const person = await getPersonByDNI(dni);
      setCustomerName(`${person.nombres} ${person.apellidoPaterno} ${person.apellidoMaterno}`);
    } catch (error) {
      setError("No se pudo obtener la información del DNI.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    if (!customerName || !product || quantity <= 0 || price <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      setLoading(false);
      return;
    }

    try {
      await addSale({
        customerName,
        product,
        quantity,
        price: parseFloat(price),
        total: parseFloat(price) * quantity,
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setDni("");
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Nueva Venta
      </h1>
      {success && (
        <p className="text-green-500 mb-4">¡Venta registrada exitosamente!</p>
      )}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            DNI del Cliente
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              maxLength="8"
              required
            />
            <button
              type="button"
              onClick={handleSearchDNI}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
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
