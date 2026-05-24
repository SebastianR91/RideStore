import { useState } from "react";
import { Icon } from "@iconify/react";
import usuarioIcon from "../assets/icons/UsuarioMoteroIcon.jpg";

export default function Perfil() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem("usuario") || "{}"));
  const [fotoPreview, setFotoPreview] = useState(usuario.fotoPerfil || "");

  const cambiarFoto = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fotoPerfil = reader.result;
      const usuarioActualizado = { ...usuario, fotoPerfil };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
      setFotoPreview(fotoPerfil);
    };
    reader.onerror = (error) => console.error("Error al leer foto de perfil", error);
  };

  const datosPerfil = [
    ["Nombre", usuario.nombre],
    ["Apellidos", usuario.apellidos],
    ["Correo", usuario.correo],
    ["Teléfono", usuario.telefono],
    ["Ciudad", usuario.ciudad],
    ["Rol", usuario.rol],
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative">
            <img
              src={fotoPreview || usuarioIcon}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2">
              <Icon icon="tabler:user" className="w-5 h-5" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-orange-500 mt-5">Mi perfil</h1>
          <p className="text-gray-600">{usuario.correo || "Actualiza tu información de cuenta"}</p>

          <label className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition cursor-pointer">
            Cambiar foto
            <input
              type="file"
              accept="image/*"
              onChange={(e) => cambiarFoto(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datosPerfil.map(([label, value]) => (
            <div key={label} className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-semibold text-gray-800">{value || "No registrado"}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
