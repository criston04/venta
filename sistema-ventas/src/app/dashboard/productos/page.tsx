'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { Producto } from '@/types';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Producto[];
      setProductos(productosData);
      setLoading(false);
    };

    fetchProductos();
  }, []);

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario de Productos</h1>
        <Link
          href="/dashboard/productos/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo Producto
        </Link>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left">Nombre</th>
            <th className="px-6 py-3 text-left">Precio</th>
            <th className="px-6 py-3 text-left">Stock</th>
            <th className="px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-t">
              <td className="px-6 py-4">{producto.nombre}</td>
              <td className="px-6 py-4">${producto.precio}</td>
              <td className="px-6 py-4">{producto.stock}</td>
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/productos/${producto.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}