// src/pages/Auth.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena || (!isLogin && (!nombre || !apellidos || !fechaNacimiento))) {
      return Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Completa todos los campos obligatorios",
        confirmButtonColor: "#ea580c",
      });
    }

    try {
      if (isLogin) {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena }),
        });

        const data = await res.json();

        if (!res.ok) {
          return Swal.fire({
            icon: "error",
            title: "Error",
            text: data.mensaje || "Credenciales inválidas",
            confirmButtonColor: "#ea580c",
          });
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        Swal.fire({
          title: "Iniciando sesión...",
          html: "Redirigiendo al inicio...",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        setTimeout(() => {
          Swal.close();
          navigate("/");
        }, 1000);

      } else {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, apellidos, fechaNacimiento, telefono, ciudad, correo, contrasena }),
        });

        const data = await res.json();

        if (!res.ok) {
          return Swal.fire({
            icon: "error",
            title: "Error",
            text: data.mensaje || "Registro fallido",
            confirmButtonColor: "#ea580c",
          });
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        await Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Ahora puedes iniciar sesión",
          confirmButtonColor: "#ea580c",
        });

        setIsLogin(true);
        setNombre("");
        setApellidos("");
        setFechaNacimiento("");
        setTelefono("");
        setCiudad("");
        setCorreo("");
        setContrasena("");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Algo salió mal en el servidor",
        confirmButtonColor: "#ea580c",
      });
    }
  };

  // 🔙 Botón volver
  const handleVolver = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/ktm-track.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative w-[90%] max-w-4xl h-[600px] rounded-xl shadow-2xl overflow-hidden bg-white bg-opacity-95">
        {/* PANEL LATERAL NARANJA */}
        <div
          className={`
            hidden md:flex absolute top-0 w-1/2 h-full flex-col justify-center items-center px-10 text-white
            transition-all duration-[3000ms] ease-in-out
            ${isLogin ? "left-0 bg-orange-600" : "right-0 bg-orange-600"}
          `}
        >
          <h2 className="text-3xl font-bold mb-4">
            {isLogin ? "¡Hola de nuevo!" : "¡Bienvenido!"}
          </h2>
          <p className="mb-6 text-center">
            {isLogin
              ? "Inicia sesión con tus credenciales para continuar"
              : "Ingresa tus datos para crear una cuenta nueva y disfrutar los beneficios."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="px-6 py-2 border border-white rounded transition hover:bg-white hover:text-black"
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </div>

        {/* FORMULARIO */}
        <div
          className={`
            absolute top-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center px-10
            transition-all duration-[2000ms] ease-in-out
            ${isLogin ? "md:right-0" : "md:left-0"}
          `}
        >
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </h2>

            {!isLogin && (
              <>
                <input type="text" placeholder="Nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
              </>
            )}

            <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
            <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />

            <button type="submit" className="bg-orange-600 hover:bg-black hover:text-white text-white w-full py-2 rounded transition">
              {isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          {/* 🔙 BOTÓN VOLVER */}
          <button
            onClick={handleVolver}
            className="mt-6 text-sm text-gray-600 underline hover:text-black"
          >
            ← Volver atrás
          </button>

          {/* Alternancia en móviles */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-sm text-orange-600 underline md:hidden"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
