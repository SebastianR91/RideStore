// src/pages/Auth.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const modo = new URLSearchParams(location.search).get("modo");
    setIsLogin(modo !== "registro");
  }, [location.search]);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const limpiarErroresCampo = (campo) => {
    setErrores((actuales) => ({ ...actuales, [campo]: "" }));
  };

  const cambiarModo = () => {
    setIsLogin(!isLogin);
    setErrores({});
    setConfirmarContrasena("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!isLogin) {
      if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
      if (!telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio.";
    }

    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(correo)) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!contrasena) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    } else if (!isLogin && !passwordRegex.test(contrasena)) {
      nuevosErrores.contrasena =
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }

    if (!isLogin) {
      if (!confirmarContrasena) {
        nuevosErrores.confirmarContrasena = "Confirma tu contraseña.";
      } else if (confirmarContrasena !== contrasena) {
        nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

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
        setConfirmarContrasena("");
        setErrores({});
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

  const handleVolver = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const mensajeError = (campo) =>
    errores[campo] ? <p className="text-red-500 text-xs mt-1">{errores[campo]}</p> : null;

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
            type="button"
            onClick={cambiarModo}
            className="px-6 py-2 border border-white rounded transition hover:bg-white hover:text-black"
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </div>

        <div
          className={`
            absolute top-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center px-10
            transition-all duration-[2000ms] ease-in-out overflow-y-auto py-8
            ${isLogin ? "md:right-0" : "md:left-0"}
          `}
        >
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </h2>

            {!isLogin && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Nombres"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      limpiarErroresCampo("nombre");
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {mensajeError("nombre")}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => {
                      setApellidos(e.target.value);
                      limpiarErroresCampo("apellidos");
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {mensajeError("apellidos")}
                </div>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div>
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value);
                      limpiarErroresCampo("telefono");
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {mensajeError("telefono")}
                </div>
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </>
            )}

            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  limpiarErroresCampo("correo");
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {mensajeError("correo")}
            </div>

            <div>
              <div className="relative">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    limpiarErroresCampo("contrasena");
                  }}
                  className="w-full p-2 pr-10 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                  aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <Icon icon={mostrarContrasena ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                </p>
              )}
              {mensajeError("contrasena")}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <input
                    type={mostrarConfirmacion ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    value={confirmarContrasena}
                    onChange={(e) => {
                      setConfirmarContrasena(e.target.value);
                      limpiarErroresCampo("confirmarContrasena");
                    }}
                    className="w-full p-2 pr-10 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                    aria-label={mostrarConfirmacion ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Icon icon={mostrarConfirmacion ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                  </button>
                </div>
                {mensajeError("confirmarContrasena")}
              </div>
            )}

            <button type="submit" className="bg-orange-600 hover:bg-black hover:text-white text-white w-full py-2 rounded transition">
              {isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleVolver}
            className="mt-6 text-sm text-gray-600 underline hover:text-black"
          >
            ← Volver atrás
          </button>

          <button
            type="button"
            onClick={cambiarModo}
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
