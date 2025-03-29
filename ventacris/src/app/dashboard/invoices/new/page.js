"use client";

import { useState } from "react";
import { addInvoice } from "@/services/firebaseService";
import { getCompanyByRUC } from "@/apis/dniApi";
import jsPDF from "jspdf";

export default function NewInvoice() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [ruc, setRuc] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, price: "" }]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

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

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1),
      0
    );
    const discountAmount = (subtotal * parseFloat(discount || 0)) / 100;
    const total = subtotal - discountAmount;
    const igv = total * 0.18; // Calcular el 18% de IGV
    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      igv: igv.toFixed(2),
      total: (total + igv).toFixed(2),
    };
  };

  const handleSearchRUC = async () => {
    if (!ruc || (ruc.length !== 11 || !["10", "20"].includes(ruc.substring(0, 2)))) {
      setError("El RUC debe tener 11 dígitos y comenzar con '10' (persona) o '20' (empresa).");
      return;
    }

    try {
      setError("");
      const company = await getCompanyByRUC(ruc);
      setCustomerName(company.razonSocial);
      setCustomerEmail(company.email || "");
    } catch (error) {
      setError("No se pudo obtener la información del RUC.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    try {
      const total = calculateTotal().total;

      await addInvoice({
        customerName,
        customerEmail,
        ruc,
        items,
        discount: parseFloat(discount),
        paymentMethod,
        total,
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setCustomerName("");
      setCustomerEmail("");
      setRuc("");
      setItems([{ description: "", quantity: 1, price: "" }]);
      setDiscount(0);
      setPaymentMethod("Efectivo");
    } catch (error) {
      console.error("Error al registrar la factura:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Factura", 10, 10);
    doc.text(`Cliente: ${customerName}`, 10, 20);
    doc.text(`RUC: ${ruc}`, 10, 30);
    doc.text(`Correo: ${customerEmail}`, 10, 40);
    doc.text("Artículos:", 10, 50);
    items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.description} - ${item.quantity} x $${item.price}`,
        10,
        60 + index * 10
      );
    });
    doc.text(`Descuento: $${calculateTotal().discount}`, 10, 70 + items.length * 10);
    doc.text(`IGV: $${calculateTotal().igv}`, 10, 80 + items.length * 10);
    doc.text(`Total: $${calculateTotal().total}`, 10, 90 + items.length * 10);
    doc.save("factura.pdf");
  };

  return (
    <div className="p-8 text-black bg-cyan-400 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Nueva Factura</h1>
      {success && (
        <p className="text-green-500 mb-4">¡Factura registrada exitosamente!</p>
      )}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Datos del Cliente */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            RUC del Cliente
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              maxLength="11"
              required
            />
            <button
              type="button"
              onClick={handleSearchRUC}
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
            Correo Electrónico del Cliente
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Artículos */}
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

        {/* Detalles de la Factura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Método de Pago
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        {/* Desglose */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Desglose:</h2>
          <p>Subtotal: ${calculateTotal().subtotal}</p>
          <p>Descuento: ${calculateTotal().discount}</p>
          <p>IGV (18%): ${calculateTotal().igv}</p>
          <p>Total: ${calculateTotal().total}</p>
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Registrando..." : "Registrar Factura"}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Vista Previa
          </button>
        </div>
      </form>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Vista Previa de la Factura</h2>
            <p><strong>RUC:</strong> {ruc}</p>
            <p><strong>Cliente:</strong> {customerName}</p>
            <p><strong>Correo:</strong> {customerEmail}</p>
            <ul className="mb-4">
              {items.map((item, index) => (
                <li key={index}>
                  {item.description} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <p><strong>Descuento:</strong> ${calculateTotal().discount}</p>
            <p><strong>IGV:</strong> ${calculateTotal().igv}</p>
            <p><strong>Total:</strong> ${calculateTotal().total}</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Imprimir/Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
