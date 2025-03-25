"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

export default function Sidebar() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = useMemo(
    () => [
      {
        label: "Ventas",
        subItems: [
          { label: "Nueva Venta", href: "/dashboard/sales/new" },
          { label: "Historial de Ventas", href: "/dashboard/sales/history" },
          { label: "Venta Rápida", href: "/dashboard/sales/quick" },
        ],
      },
      {
        label: "Inventario",
        subItems: [
          { label: "Productos", href: "/dashboard/inventory/products" },
          { label: "Proveedores", href: "/dashboard/inventory/suppliers" },
        ],
      },
      {
        label: "Facturación",
        subItems: [
          { label: "Nueva Factura", href: "/dashboard/invoices/new" },
          { label: "Historial de Facturas", href: "/dashboard/invoices/history" },
        ],
      },
      {
        label: "Reportes",
        subItems: [
          { label: "Reporte de Ventas", href: "/dashboard/reports/sales" },
          { label: "Reporte de Inventario", href: "/dashboard/reports/inventory" },
        ],
      },
    ],
    []
  );

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-lg rounded-r-lg border-r-2 border-black">
      <div className="p-6 border-b border-black">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((menu, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                className="w-full text-left px-6 py-3 hover:bg-indigo-500 flex justify-between items-center rounded-lg border border-black"
              >
                {menu.label}
                <span>{activeMenu === menu.label ? "▲" : "▼"}</span>
              </button>
              {activeMenu === menu.label && (
                <ul className="pl-8 bg-indigo-600 rounded-lg border border-black">
                  {menu.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="py-2">
                      <a href={subItem.href} className="text-white hover:text-gray-200">
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="mt-6 px-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
