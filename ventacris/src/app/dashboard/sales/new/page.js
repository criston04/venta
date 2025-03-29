"use client";

import { useState, useEffect } from "react";
import { addSale, getProducts, getSales } from "@/services/firebaseService";
import { getPersonByDNI, getCompanyByRUC } from "@/apis/dniApi";
import jsPDF from "jspdf";

export default function NewSale() {
  const [dni, setDni] = useState("");
  const [ruc, setRuc] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [amountGiven, setAmountGiven] = useState(0); // Nuevo estado para el monto entregado
  const [change, setChange] = useState(0); // Nuevo estado para el vuelto
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerSales, setCustomerSales] = useState([]);

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

  const handleSearchDNI = async () => {
    if (!dni || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }

    try {
      setError("");
      const person = await getPersonByDNI(dni);
      setCustomerName(`${person.nombres} ${person.apellidoPaterno} ${person.apellidoMaterno}`);
      setRuc("");

      const sales = await getSales();
      const customerSales = sales.filter((sale) => sale.customerName === `${person.nombres} ${person.apellidoPaterno} ${person.apellidoMaterno}`);
      setCustomerSales(customerSales);
    } catch (error) {
      setError("No se pudo obtener la información del DNI.");
    }
  };

  const handleSearchRUC = async () => {
    if (!ruc || ruc.length !== 11) {
      setError("El RUC debe tener 11 dígitos.");
      return;
    }

    try {
      setError("");
      const company = await getCompanyByRUC(ruc);
      setCustomerName(company.razonSocial);
      setDni("");
    } catch (error) {
      setError("No se pudo obtener la información del RUC.");
    }
  };

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
    updatedProducts[index].quantity = parseInt(quantity) || 1;
    setSelectedProducts(updatedProducts);
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    return (subtotal - (parseFloat(discount) || 0)).toFixed(2);
  };

  const handleAmountGivenChange = (value) => {
    setAmountGiven(value);
    const total = parseFloat(calculateTotal());
    const change = value - total;
    setChange(change >= 0 ? change.toFixed(2) : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    if (!customerName || selectedProducts.length === 0) {
      alert("Por favor, completa todos los campos correctamente.");
      setLoading(false);
      return;
    }

    try {
      await addSale({
        customerName,
        products: selectedProducts,
        discount: parseFloat(discount) || 0,
        paymentMethod,
        total: calculateTotal(),
        amountGiven: paymentMethod === "Efectivo" ? parseFloat(amountGiven) : null,
        change: paymentMethod === "Efectivo" ? parseFloat(change) : null,
        date: new Date().toISOString(),
      });

      setSuccess(true);
      setDni("");
      setRuc("");
      setCustomerName("");
      setSelectedProducts([]);
      setDiscount(0);
      setPaymentMethod("Efectivo");
      setAmountGiven(0);
      setChange(0);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.text("Recibo de Venta", 10, 10);
    doc.text(`Cliente: ${customerName}`, 10, 20);
    doc.text(`Método de Pago: ${paymentMethod}`, 10, 30);
    doc.text("Productos:", 10, 40);
    selectedProducts.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.name} - ${product.quantity} x $${product.price}`,
        10,
        50 + index * 10
      );
    });
    doc.text(`Descuento: $${parseFloat(discount) || 0}`, 10, 60 + selectedProducts.length * 10);
    doc.text(`Total: $${calculateTotal()}`, 10, 70 + selectedProducts.length * 10);
    if (paymentMethod === "Efectivo") {
      doc.text(`Monto Entregado: $${parseFloat(amountGiven) || 0}`, 10, 80 + selectedProducts.length * 10);
      doc.text(`Vuelto: $${parseFloat(change) || 0}`, 10, 90 + selectedProducts.length * 10);
    }
    doc.save("recibo.pdf");
  };

  return (
    <div className="p-8 text-black bg-cyan-400 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Nueva Venta</h1>
      {success && (
        <p className="text-green-500 mb-4">¡Venta registrada exitosamente!</p>
      )}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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
          <div>
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
        {paymentMethod === "Efectivo" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Monto Entregado
            </label>
            <input
              type="number"
              value={amountGiven}
              onChange={(e) => handleAmountGivenChange(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              step="0.01"
            />
            <h2 className="text-lg font-bold mt-2">Vuelto: ${change}</h2>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Total: ${calculateTotal()}</h2>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Registrando..." : "Registrar Venta"}
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
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Historial de Ventas del Cliente</h2>
        {customerSales.length === 0 ? (
          <p className="text-gray-600">No se encontraron ventas previas.</p>
        ) : (
          <ul>
            {customerSales.map((sale, index) => (
              <li key={index} className="mb-2">
                {sale.date}: ${sale.total}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
