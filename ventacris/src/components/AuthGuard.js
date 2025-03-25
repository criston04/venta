"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { getUserData } from "@/services/firebaseService";

export default function AuthGuard({ children, requiredRole }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Solo en cliente

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        try {
          const userData = await getUserData();
          setUser(userData);
          if (requiredRole && userData.role !== requiredRole) {
            router.replace("/unauthorized");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          router.replace("/login");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, requiredRole]);

  if (isLoading) return null; // Evita mostrar HTML hasta que la autenticación termine

  return <>{children}</>;
}
