"use client";

import { useState, useEffect } from "react";
import { getProducts, addSale } from "@/services/firebaseService";
import jsPDF from "jspdf";

export default function QuickSale() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSearch = (query) => {
    setProductSearch(query);
    if (!query) {
      setFilteredProducts([]);
      return;
    }

    const matches = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(matches);
  };

  const handleAddProduct = (product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    setFilteredProducts([]);
    setProductSearch("");
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];

    // Validar que la cantidad no exceda el stock disponible
    if (quantity > product.stock) {
      alert(`La cantidad no puede exceder el stock disponible (${product.stock}).`);
      return;
    }

    updatedProducts[index].quantity = quantity || ""; // Permitir que el campo quede vacío temporalmente
    setSelectedProducts(updatedProducts);
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce(
      (total, product) => total + product.price * (product.quantity || 0),
      0
    );
    return (subtotal - (parseFloat(discount) || 0)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    if (selectedProducts.length === 0) {
      alert("Por favor, selecciona al menos un producto.");
      setLoading(false);
      return;
    }

    try {
      await addSale({
        products: selectedProducts,
        discount: parseFloat(discount) || 0,
        paymentMethod,
        total: calculateTotal(),
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setSelectedProducts([]);
      setDiscount(0);
      setPaymentMethod("Efectivo");
    } catch (error) {
      console.error("Error al registrar la venta rápida:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.text("Recibo de Venta Rápida", 10, 10);
    doc.text("Productos:", 10, 20);
    selectedProducts.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.name} - ${product.quantity} x $${product.price}`,
        10,
        30 + index * 10
      );
    });
    doc.text(`Descuento: $${parseFloat(discount) || 0}`, 10, 40 + selectedProducts.length * 10);
    doc.text(`Total: $${calculateTotal()}`, 10, 50 + selectedProducts.length * 10);
    doc.save("recibo_venta_rapida.pdf");
  };

  return (
    <div className="p-8 text-black bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Venta Rápida</h1>
      {success && (
        <p className="text-green-500 mb-4">¡Venta rápida registrada exitosamente!</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Productos */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Productos
          </label>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={productSearch}
            onChange={(e) => handleProductSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {filteredProducts.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Productos Seleccionados</h2>
          {selectedProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <p className="flex-1">{product.name}</p>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                className="w-24 p-3 border border-gray-300 rounded-lg"
                min="1"
              />
              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Detalles de la Venta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Descuento
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              step="0.01"
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
        <div className="mb-4">
          <h2 className="text-lg font-bold">Total: ${calculateTotal()}</h2>
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Procesando..." : "Registrar Venta"}
          </button>
          <button
            type="button"
            onClick={generateReceipt}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Generar Recibo
          </button>
        </div>
      </form>
    </div>
  );
}
