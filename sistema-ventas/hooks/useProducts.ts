import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Venta } from '@/types';
 
export const useSales = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ventas'));
        const ventasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Venta[];
        setVentas(ventasData);
      } catch (err) {
        setError('Error al cargar las ventas');
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  return { ventas, loading, error };
};