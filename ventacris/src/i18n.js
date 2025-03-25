export const translations = {
  en: {
    welcome: "Welcome to the Dashboard",
    sales: "Sales",
    inventory: "Inventory",
  },
  es: {
    welcome: "Bienvenido al Dashboard",
    sales: "Ventas",
    inventory: "Inventario",
  },
};

export const useTranslation = (lang = "es") => {
  return translations[lang];
};
