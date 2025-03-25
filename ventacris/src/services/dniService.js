import axios from "axios";

const API_URL = "https://dniruc.apisperu.com/api/v1/dni"; // URL de ejemplo
const API_TOKEN = "TU_API_TOKEN"; // Reemplaza con tu token de acceso

export const getPersonByDNI = async (dni) => {
  try {
    const response = await axios.get(`${API_URL}/${dni}`, {
      params: { token: API_TOKEN },
    });
    return response.data; // Devuelve los datos de la persona
  } catch (error) {
    console.error("Error al consultar el DNI:", error);
    throw new Error("No se pudo obtener la información del DNI.");
  }
};
