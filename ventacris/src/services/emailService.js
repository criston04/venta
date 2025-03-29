import axios from "axios";

// URL de ejemplo para el servicio de envío de correos
const EMAIL_API_URL = "https://api.example.com/send-email"; // Reemplaza con tu API real

export const sendInvoiceEmail = async ({ customerName, items, total }) => {
  try {
    const response = await axios.post(EMAIL_API_URL, {
      customerName,
      items,
      total,
    });
    return response.data; // Devuelve la respuesta del servidor
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
