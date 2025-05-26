// src/components/Sidebar.jsx
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import menuIcon from "../assets/icons/menu_h.svg";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <aside
      className={`w-64 h-screen fixed top-0 left-0 z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      bg-gray-100 shadow-2xl border-r border-orange-200`}
    >
      {/* Encabezado */}
      <div className="bg-black h-16 flex items-center justify-center relative">
        <button
          onClick={onClose}
          className="absolute left-4 p-2 bg-white rounded-full focus:outline-none"
        >
          <img
            src={menuIcon}
            alt="Cerrar"
            className="w-6 h-6 hover:scale-110 transition-transform"
          />
        </button>
        <span className="text-xl font-bold text-orange-500 hover:scale-110 transition-transform cursor-pointer">
          RideStore
        </span>
      </div>

      {/* Menú lateral */}
      <ul className="p-4 text-black mt-4 space-y-2">
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:home" className="w-5 h-5" />
          <Link to="/" className="w-full">Inicio</Link>
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <img src="https://api.iconify.design/tabler:package.svg" alt="Productos" className="w-5 h-5" />
          <Link to="/dashboard" className="w-full">Dashboard</Link>
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:volume" className="w-5 h-5" />
          Marketing
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:currency-dollar" className="w-5 h-5" />
          Ventas
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:wallet" className="w-5 h-5" />
          Cartera
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:chart-bar" className="w-5 h-5" />
          Informes
        </li>
        <li className="flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105">
          <Icon icon="tabler:tools" className="w-5 h-5" />
          Herramientas
        </li>

        {/* Botones de login/registro si NO hay usuario */}
        {!usuario && (
          <>
            <li
              onClick={() => navigate("/auth?modo=login")}
              className="flex items-center gap-2 p-3 mt-4 bg-orange-500 text-white rounded hover:bg-black cursor-pointer transition-transform hover:scale-105"
            >
              <Icon icon="tabler:login" className="w-5 h-5" />
              Iniciar Sesión
            </li>
            <li
              onClick={() => navigate("/auth?modo=registro")}
              className="flex items-center gap-2 p-3 mt-2 bg-orange-500 text-white rounded hover:bg-black cursor-pointer transition-transform hover:scale-105"
            >
              <Icon icon="tabler:user-plus" className="w-5 h-5" />
              Registrarse
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
