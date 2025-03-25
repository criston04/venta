"use client";

import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct, updateProduct } from "@/services/firebaseService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const lowStockProducts = products.filter((p) => p.stock < 5);
    if (lowStockProducts.length > 0) {
      addNotification(
        `Productos con bajo stock: ${lowStockProducts.map((p) => p.name).join(", ")}`,
        "error"
      );
    }
  }, [products]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const addedProduct = await addProduct(newProduct);
      setProducts([...products, { id: addedProduct.id, ...newProduct }]);
      setNewProduct({ name: "", price: "", stock: "" });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setError("Error al agregar el producto.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setError("Error al eliminar el producto.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, price: product.price, stock: product.stock });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, newProduct);
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...newProduct } : product
        )
      );
      setEditingProduct(null);
      setNewProduct({ name: "", price: "", stock: "" });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setError("Error al actualizar el producto.");
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Productos
      </h1>
      <form
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? "Editar Producto" : "Agregar Producto"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Precio</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Stock</label>
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className={`${
            editingProduct ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-lg`}
        >
          {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({ name: "", price: "", stock: "" });
            }}
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancelar
          </button>
        )}
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
        {loading ? (
          <p className="text-gray-600">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No se encontraron productos.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Nombre</th>
                <th className="border p-3 text-left">Precio</th>
                <th className="border p-3 text-left">Stock</th>
                <th className="border p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="border p-3">{product.name}</td>
                  <td className="border p-3">${product.price}</td>
                  <td className="border p-3">{product.stock}</td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
