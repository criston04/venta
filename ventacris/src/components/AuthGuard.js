"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { getUserDataWithRole } from "@/services/firebaseService";

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
          const userData = await getUserDataWithRole(requiredRole);
          setUser(userData);
        } catch (error) {
          console.error("Error al validar rol:", error);
          router.replace("/unauthorized");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, requiredRole]);

  if (isLoading) return null; // Evita mostrar HTML hasta que la autenticación termine

  return <>{children}</>;
}
