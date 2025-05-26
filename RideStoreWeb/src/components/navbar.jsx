// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import usuarioIcon from "../assets/icons/UsuarioMoteroIcon.jpg";
import menuIcon from "../assets/icons/menu_h.svg";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [mostrarPanel, setMostrarPanel] = useState(false);

  const cerrarSesion = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión exitosamente.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <nav className="bg-black text-white flex justify-between items-center p-4 flex-wrap fixed top-0 left-0 w-full z-50">
      {/* 🔹 Izquierda */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 focus:outline-none bg-white rounded-full"
        >
          <img
            src={menuIcon}
            alt="Menú"
            className="w-6 h-6 hover:scale-125 hover:brightness-150 transition-transform duration-300"
          />
        </button>

        <span className="text-xl font-bold text-orange-500 transition-transform duration-300 hover:scale-125 hover:text-orange-600 cursor-pointer">
          RideStore
        </span>
      </div>

      {/* 🔸 Centro */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/categorias"
          className="text-white text-lg hover:scale-110 hover:text-orange-500 transition-transform duration-300"
        >
          Categorías
        </Link>
        <Link
          to="/nosotros"
          className="text-white text-lg hover:scale-110 hover:text-orange-500 transition-transform duration-300"
        >
          Nosotros
        </Link>
      </div>

      {/* 🔹 Derecha */}
      <div className="relative flex gap-4 items-center">
        <Link to="/carrito">
          <Icon
            icon="tabler:shopping-cart"
            className="w-6 h-6 text-white hover:text-orange-500 hover:scale-125 transition-transform cursor-pointer"
          />
        </Link>
        <Icon
          icon="tabler:message-circle"
          className="w-6 h-6 text-white hover:text-orange-500 hover:scale-125 transition-transform cursor-pointer"
        />
        <Icon
          icon="tabler:question-mark"
          className="w-6 h-6 text-white hover:text-orange-500 hover:scale-125 transition-transform cursor-pointer"
        />
        <Icon
          icon="tabler:bell"
          className="w-6 h-6 text-white hover:text-orange-500 hover:scale-125 transition-transform cursor-pointer"
        />

        {/* Imagen de usuario */}
        <img
          src={usuarioIcon}
          alt="Usuario"
          onClick={() => setMostrarPanel(!mostrarPanel)}
          className="w-10 h-10 rounded-full hover:scale-125 hover:ring-2 hover:ring-orange-500 transition-transform cursor-pointer"
        />

        {/* Panel desplegable de usuario */}
        {mostrarPanel && usuario && (
          <div className="absolute right-0 top-14 bg-white text-black rounded shadow-lg w-60 p-4 z-50">
            <p className="font-semibold text-orange-500">👤 {usuario.nombre}</p>
            <p className="text-sm text-gray-700 mb-3">{usuario.correo}</p>
            <button
              onClick={cerrarSesion}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
