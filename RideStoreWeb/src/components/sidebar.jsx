// src/components/Sidebar.jsx
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import menuIcon from "../assets/icons/menu_h.svg";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const esCliente = usuario?.rol?.toLowerCase() === "cliente";

  const itemClass =
    "flex items-center gap-2 p-3 rounded hover:bg-orange-500 hover:text-white cursor-pointer transition-transform hover:scale-105";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/auth?modo=login");
    window.location.reload();
  };

  return (
    <aside
      className={`w-64 h-screen fixed top-0 left-0 z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      bg-gray-100 shadow-2xl border-r border-orange-200`}
    >
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

      <ul className="p-4 text-black mt-4 space-y-2">
        {esCliente ? (
          <>
            <li className={itemClass}>
              <Icon icon="tabler:home" className="w-5 h-5" />
              <Link to="/" className="w-full">Inicio</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:package" className="w-5 h-5" />
              <Link to="/productos" className="w-full">Productos</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:shopping-cart" className="w-5 h-5" />
              <Link to="/carrito" className="w-full">Mi carrito</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:clipboard-list" className="w-5 h-5" />
              <Link to="/mis-pedidos" className="w-full">Mis pedidos</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:user" className="w-5 h-5" />
              <Link to="/perfil" className="w-full">Mi perfil</Link>
            </li>
            <li onClick={cerrarSesion} className={itemClass}>
              <Icon icon="tabler:logout" className="w-5 h-5" />
              Cerrar sesión
            </li>
          </>
        ) : (
          <>
            <li className={itemClass}>
              <Icon icon="tabler:home" className="w-5 h-5" />
              <Link to="/" className="w-full">Inicio</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:package" className="w-5 h-5" />
              <Link to="/productos" className="w-full">Productos</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:volume" className="w-5 h-5" />
              <Link to="/marketing" className="w-full">Marketing</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:currency-dollar" className="w-5 h-5" />
              <Link to="/ventas-pedidos" className="w-full">Ventas/Pedidos</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:motorbike" className="w-5 h-5" />
              <Link to="/categorias" className="w-full">Marcas/Modelos</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:wallet" className="w-5 h-5" />
              <Link to="/cartera" className="w-full">Cartera</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:chart-bar" className="w-5 h-5" />
              <Link to="/informes" className="w-full">Informes</Link>
            </li>
            <li className={itemClass}>
              <Icon icon="tabler:tools" className="w-5 h-5" />
              <Link to="/herramientas" className="w-full">Herramientas</Link>
            </li>

            {!usuario && (
              <>
                <li
                  onClick={() => navigate("/auth?modo=login")}
                  className="flex items-center gap-2 p-3 mt-4 bg-orange-500 text-white rounded hover:bg-black cursor-pointer transition-transform hover:scale-105"
                >
                  <Icon icon="tabler:login" className="w-5 h-5" />
                  Iniciar sesión
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
          </>
        )}
      </ul>
    </aside>
  );
}
