"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirige automáticamente a la página de login
  }, [router]);

  return null; // No muestra contenido en la página principal
}
