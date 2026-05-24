export default function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Mi perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Nombre:</span> {usuario.nombre || "No registrado"}</p>
          <p><span className="font-semibold">Apellidos:</span> {usuario.apellidos || "No registrado"}</p>
          <p><span className="font-semibold">Correo:</span> {usuario.correo || "No registrado"}</p>
          <p><span className="font-semibold">Teléfono:</span> {usuario.telefono || "No registrado"}</p>
          <p><span className="font-semibold">Ciudad:</span> {usuario.ciudad || "No registrado"}</p>
          <p><span className="font-semibold">Rol:</span> {usuario.rol || "No registrado"}</p>
        </div>
      </div>
    </main>
  );
}
