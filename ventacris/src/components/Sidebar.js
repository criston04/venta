"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);

  // Función para obtener las iniciales del nombre de usuario
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const initials = name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    return initials || 'U';
  };

  // Efecto para manejar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'Usuario',
          email: currentUser.email,
          initials: getUserInitials(currentUser.displayName)
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Iconos personalizados con SVG
  const menuIcons = {
    "Ventas": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    "Inventario": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    "Facturación": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm4 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
      </svg>
    ),
    "Reportes": (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };

  // Menú de elementos memorizado
  const menuItems = useMemo(
    () => [
      {
        label: "Ventas",
        icon: menuIcons["Ventas"],
        subItems: [
          { label: "Nueva Venta", href: "/dashboard/sales/new" },
          { label: "Historial de Ventas", href: "/dashboard/sales/history" },
          { label: "Venta Rápida", href: "/dashboard/sales/quick" },
        ],
      },
      {
        label: "Inventario",
        icon: menuIcons["Inventario"],
        subItems: [
          { label: "Productos", href: "/dashboard/inventory/products" },
          { label: "Proveedores", href: "/dashboard/inventory/suppliers" },
        ],
      },
      {
        label: "Facturación",
        icon: menuIcons["Facturación"],
        subItems: [
          { label: "Nueva Factura", href: "/dashboard/invoices/new" },
          { label: "Historial de Facturas", href: "/dashboard/invoices/history" },
        ],
      },
      {
        label: "Reportes",
        icon: menuIcons["Reportes"],
        subItems: [
          { label: "Reporte de Ventas", href: "/dashboard/reports/sales" },
          { label: "Reporte de Inventario", href: "/dashboard/reports/inventory" },
        ],
      },
    ],
    []
  );

  // Función de toggle de menú memorizada
  const toggleMenu = useCallback((label) => {
    setActiveMenu(prev => prev === label ? null : label);
  }, []);

  // Función de logout optimizada
  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [router]);

  return (
    <aside
      className="bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 w-64 h-screen flex flex-col"
    >
      {/* Sección de Información de Usuario */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          {/* Avatar con iniciales */}
          <div
            className="
              w-12 h-12 rounded-full flex items-center justify-center 
              bg-blue-500 text-white font-bold text-xl
            "
          >
            {user?.initials || 'U'}
          </div>
          
          {/* Nombre y correo del usuario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user?.displayName || 'Usuario'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || 'usuario@ejemplo.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido del menú */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav>
          {menuItems.map((menuItem) => (
            <div key={menuItem.label} className="mb-4">
              <div 
                onClick={() => toggleMenu(menuItem.label)}
                className={`
                  flex items-center justify-between p-2 cursor-pointer 
                  hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                  ${activeMenu === menuItem.label ? 'bg-gray-100 dark:bg-gray-800' : ''}
                `}
              >
                <div className="flex items-center">
                  {menuItem.icon}
                  <span className="text-gray-700 dark:text-gray-300">{menuItem.label}</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-4 h-4 transform transition-transform duration-200 
                    ${activeMenu === menuItem.label ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {activeMenu === menuItem.label && (
                <div className="pl-6 mt-2">
                  {menuItem.subItems.map((subItem) => (
                    <Link 
                      key={subItem.href}
                      href={subItem.href}
                      className={`
                        block py-2 text-sm text-gray-600 dark:text-gray-400 
                        hover:text-gray-900 dark:hover:text-gray-200
                        ${pathname === subItem.href ? 'text-blue-600 dark:text-blue-400' : ''}
                      `}
                      prefetch={true}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Sección de Acciones */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="mb-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
        <div>
          <Link 
            href="/dashboard/settings"
            className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            prefetch={true}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </Link>
        </div>
      </div>
    </aside>
  );
}