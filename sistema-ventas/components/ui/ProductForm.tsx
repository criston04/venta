'use client';
import { useState, useEffect } from 'react';
import { Producto } from '@/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface ProductFormProps {
  initialData?: Producto;
  onSuccess: () => void;
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (initialData?.id) {
        await setDoc(doc(db, 'productos', initialData.id), formData);
      } else {
        const newDocRef = doc(collection(db, 'productos'));
        await setDoc(newDocRef, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Nombre del Producto</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.nombre || ''}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label className="block mb-2">Precio</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={formData.precio || 0}
          onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? 'Actualizar' : 'Crear'} Producto
      </button>
    </form>
  );
}