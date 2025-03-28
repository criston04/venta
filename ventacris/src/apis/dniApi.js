import axios from "axios";

// URL base correcta para la API
const API_URL_DNI = "https://dniruc.apisperu.com/api/v1/dni"; // URL base para DNI
const API_URL_RUC = "https://dniruc.apisperu.com/api/v1/ruc"; // URL base para RUC
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNyaXN0b25fMDRfMDZAaG90bWFpbC5jb20ifQ.LzZagArfI6cpSEymPqRlr8543dgvGJApwGbeUtdtAqg"; // Token de acceso

// Consulta por DNI
export const getPersonByDNI = async (dni) => {
  try {
    const response = await axios.get(`${API_URL_DNI}/${dni}`, {
      params: { token: API_TOKEN }, // Pasar el token como parámetro
    });
    return response.data; // Devuelve los datos de la persona
  } catch (error) {
    console.error("Error al consultar el DNI:", error);
    throw new Error("No se pudo obtener la información del DNI.");
  }
};

// Consulta por RUC
export const getCompanyByRUC = async (ruc) => {
  try {
    const response = await axios.get(`${API_URL_RUC}/${ruc}`, {
      params: { token: API_TOKEN }, // Pasar el token como parámetro
    });
    return response.data; // Devuelve los datos de la empresa
  } catch (error) {
    console.error("Error al consultar el RUC:", error);
    throw new Error("No se pudo obtener la información del RUC.");
  }
};
