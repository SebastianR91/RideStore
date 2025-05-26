// src/pages/Auth.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena || (!isLogin && !nombre)) {
      return Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Completa todos los campos",
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

        /*await Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso",
          confirmButtonColor: "#ea580c",
        });

        Swal.fire({
          title: "Cargando productos...",
          html: "Redirigiendo al inicio",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          timer: 500,
          timerProgressBar: true,
        }).then(() => {
          navigate("/");
        });

        navigate("/");*/             //Asi me gusta mas

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
        Swal.close(); // <- Cierra el modal
        navigate("/"); // <- Redirige al Home
      }, 1000);

      } else {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, contrasena }),
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[90%] max-w-4xl h-[500px] rounded-xl shadow-2xl overflow-hidden bg-white">

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
            className="px-6 py-2 border border-white hover:bg-white hover:text-orange-600 rounded transition"
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
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            )}

            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />

            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white w-full py-2 rounded transition"
            >
              {isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          {/* Alternancia en móviles */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-orange-600 underline md:hidden"
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
