"use client";

import { useState, useEffect } from "react";
import { getUserData, updateUserData } from "@/services/firebaseService";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserData({ firstName, lastName });
      setSuccess(true);
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>
      {success && (
        <p className="text-green-500 mb-4">¡Perfil actualizado exitosamente!</p>
      )}
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Apellido
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
}
