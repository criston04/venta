"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Nuevo estado para el mensaje de éxito
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false); // Reiniciar el mensaje de éxito

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar requisitos de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Obtener el UID del usuario creado
      const userId = userCredential.user.uid;

      // Almacenar solo nombre, apellidos y correo en Firestore
      await setDoc(doc(db, "users", userId), {
        firstName,
        lastName,
        email,
      });

      // Mostrar mensaje de éxito
      setSuccess(true);

      // Limpiar el formulario
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirigir al dashboard después de un breve retraso
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error); // Agregar registro de errores
      if (error.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está en uso.");
      } else if (error.code === "auth/invalid-email") {
        setError("El formato del correo no es válido.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else {
        setError("Error al registrarse: " + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-600 text-black">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Regístrate
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">
            ¡Registro exitoso! Redirigiendo al dashboard...
          </p>
        )}
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Registrarse
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
