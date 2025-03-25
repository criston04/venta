"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // Intentar iniciar sesión con Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirigir al dashboard si es exitoso
    } catch (error) {
      // Manejo de errores
      switch (error.code) {
        case "auth/user-not-found":
          setError("No se encontró una cuenta con este correo.");
          break;
        case "auth/wrong-password":
          setError("La contraseña es incorrecta.");
          break;
        case "auth/invalid-email":
          setError("El formato del correo no es válido.");
          break;
        default:
          setError("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}
