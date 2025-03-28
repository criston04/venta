"use client";

import { useState } from "react";
import { getCompanyByRUC } from "@/apis/dniApi";

export default function RUCSearch() {
  const [ruc, setRuc] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState("");

  const handleSearchRUC = async () => {
    if (!ruc || ruc.length !== 11) {
      setError("El RUC debe tener 11 dígitos.");
      return;
    }

    try {
      setError("");
      const company = await getCompanyByRUC(ruc);
      setCompanyData(company);
    } catch (error) {
      setError("No se pudo obtener la información del RUC.");
    }
  };

  return (
    <div className="p-8 text-black bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Consulta de RUC</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            RUC
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              maxLength="11"
              required
            />
            <button
              type="button"
              onClick={handleSearchRUC}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {companyData && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Información de la Empresa</h2>
            <p><strong>RUC:</strong> {companyData.ruc}</p>
            <p><strong>Razón Social:</strong> {companyData.razonSocial}</p>
            <p><strong>Dirección:</strong> {companyData.direccion}</p>
            <p><strong>Estado:</strong> {companyData.estado}</p>
            <p><strong>Condición:</strong> {companyData.condicion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
