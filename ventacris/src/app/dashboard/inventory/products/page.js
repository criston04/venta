"use client";

import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct, updateProduct } from "@/services/firebaseService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const addedProduct = await addProduct(newProduct); // Guardar el producto en Firebase
      setProducts([...products, { id: addedProduct.id, ...newProduct }]); // Agregar el producto con su ID único
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

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Agregar Producto
        </button>
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
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => alert("Función de edición no implementada aún.")}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      Editar
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
