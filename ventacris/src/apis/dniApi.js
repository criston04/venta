import axios from "axios";

// URL base correcta para la API
const API_URL = "https://dniruc.apisperu.com/api/v1/dni"; // URL base sin DNI
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNyaXN0b25fMDRfMDZAaG90bWFpbC5jb20ifQ.LzZagArfI6cpSEymPqRlr8543dgvGJApwGbeUtdtAqg"; // Token de acceso

export const getPersonByDNI = async (dni) => {
  try {
    // Construir la URL con el DNI dinámico
    const response = await axios.get(`${API_URL}/${dni}`, {
      params: { token: API_TOKEN }, // Pasar el token como parámetro
    });
    return response.data; // Devuelve los datos de la persona
  } catch (error) {
    console.error("Error al consultar el DNI:", error);
    throw new Error("No se pudo obtener la información del DNI.");
  }
};
