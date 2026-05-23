import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Modelos() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const marcaId = params.get("marcaId");
  const token = localStorage.getItem("token");
  const esAdmin = Boolean(token);

  const [modelos, setModelos] = useState([]);
  const [tiposMoto, setTiposMoto] = useState([]);
  const [marca, setMarca] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modeloId, setModeloId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [typeId, setTypeId] = useState("");
  const [cilindraje, setCilindraje] = useState("");
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFin, setAnioFin] = useState("");
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    obtenerModelos();
    obtenerTiposMoto();
    obtenerMarca();
  }, [marcaId]);

  const generarSlug = (texto) =>
    texto
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const obtenerModelos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/modelos-moto");
      const data = await res.json();
      const filtrados = data.filter(
        (model) => model.brandId?._id === marcaId || model.brandId === marcaId
      );
      setModelos(filtrados);
    } catch (error) {
      console.error("Error al cargar modelos:", error);
      Swal.fire("Error", "No se pudieron cargar los modelos", "error");
    }
  };

  const obtenerTiposMoto = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tipos-moto");
      const data = await res.json();
      setTiposMoto(data);
    } catch (error) {
      console.error("Error al cargar tipos de moto:", error);
      Swal.fire("Error", "No se pudieron cargar los tipos de moto", "error");
    }
  };

  const obtenerMarca = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/marcas");
      const data = await res.json();
      setMarca(data.find((brand) => brand._id === marcaId));
    } catch (error) {
      console.error("Error al cargar marca:", error);
    }
  };

  const convertirImagenABase64 = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImagen(reader.result);
    reader.onerror = (error) => console.error("Error al leer imagen", error);
  };

  const abrirCrearModelo = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const editarModelo = (modelo) => {
    setNombre(modelo.nombre);
    setTypeId(modelo.typeId?._id || modelo.typeId || "");
    setCilindraje(modelo.cilindraje ?? "");
    setAnioInicio(modelo.anioInicio ?? "");
    setAnioFin(modelo.anioFin ?? "");
    setImagen(modelo.imagen || "");
    setModeloId(modelo._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setTypeId("");
    setCilindraje("");
    setAnioInicio("");
    setAnioFin("");
    setImagen("");
    setModeloId(null);
    setModoEdicion(false);
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarModelo = async (e) => {
    e.preventDefault();

    const endpoint = modoEdicion
      ? `http://localhost:5000/api/modelos-moto/${modeloId}`
      : "http://localhost:5000/api/modelos-moto";

    const method = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          slug: generarSlug(nombre),
          brandId: marcaId,
          typeId,
          cilindraje,
          anioInicio,
          anioFin,
          imagen,
        }),
      });

      if (res.ok) {
        await obtenerModelos();
        cancelarFormulario();

        Swal.fire({
          icon: "success",
          title: modoEdicion ? "Modelo actualizado" : "Modelo creado",
          text: modoEdicion
            ? "El modelo fue actualizado correctamente"
            : "El modelo fue creado exitosamente",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar el modelo", "error");
      }
    } catch (error) {
      console.error("Error al guardar modelo:", error);
      Swal.fire("Error", "Hubo un problema al guardar el modelo", "error");
    }
  };

  const eliminarModelo = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar modelo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/modelos-moto/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          await obtenerModelos();
          Swal.fire("Eliminado", "El modelo ha sido eliminado", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el modelo", "error");
        }
      } catch (error) {
        console.error("Error al eliminar modelo:", error);
        Swal.fire("Error", "Hubo un error al eliminar el modelo", "error");
      }
    }
  };

  const rangoAnios = (modelo) => {
    if (modelo.anioInicio && modelo.anioFin) return `${modelo.anioInicio} - ${modelo.anioFin}`;
    if (modelo.anioInicio) return `Desde ${modelo.anioInicio}`;
    if (modelo.anioFin) return `Hasta ${modelo.anioFin}`;
    return "Años no especificados";
  };

  return (
    <main className="p-8 mt-20 transition-all duration-300 max-w-screen-lg mx-auto text-center">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          {marca?.logo && (
            <img
              src={marca.logo}
              alt={marca.nombre}
              className="w-32 h-32 object-contain bg-white rounded shadow mb-4"
            />
          )}
          <h2 className="text-3xl font-bold text-center">
            {marca?.nombre ? `Modelos de ${marca.nombre}` : "Modelos disponibles"}
          </h2>
        </div>

        {esAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={abrirCrearModelo}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
            >
              Crear modelo
            </button>
          </div>
        )}

        {esAdmin && mostrarFormulario && (
          <form
            onSubmit={guardarModelo}
            className="bg-white p-6 rounded shadow-md mb-10 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                required
                className="p-2 border rounded"
              >
                <option value="">Selecciona un tipo de moto</option>
                {tiposMoto.map((tipo) => (
                  <option key={tipo._id} value={tipo._id}>{tipo.nombre}</option>
                ))}
              </select>
              {tiposMoto.length === 0 && (
                <p className="text-sm text-gray-600 col-span-1 md:col-span-2">
                  No hay tipos de moto registrados. Ejecuta el seed de tipos de moto.
                </p>
              )}
              <input
                type="number"
                placeholder="Cilindraje"
                value={cilindraje}
                onChange={(e) => setCilindraje(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Año inicio"
                value={anioInicio}
                onChange={(e) => setAnioInicio(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Año fin"
                value={anioFin}
                onChange={(e) => setAnioFin(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => convertirImagenABase64(e.target.files[0])}
                className="col-span-1 md:col-span-2"
              />
              {imagen && (
                <img
                  src={imagen}
                  alt={nombre || "Imagen del modelo"}
                  className="w-full h-40 object-contain rounded bg-white border col-span-1 md:col-span-2"
                />
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                {modoEdicion ? "Actualizar modelo" : "Crear modelo"}
              </button>
              <button
                type="button"
                onClick={cancelarFormulario}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {modelos.length === 0 ? (
          <p className="text-center text-gray-600">No hay modelos registrados para esta marca</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modelos.map((modelo) => (
              <div
                key={modelo._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300"
              >
                {modelo.imagen && (
                  <img
                    src={modelo.imagen}
                    alt={modelo.nombre}
                    className="w-full h-48 object-contain bg-white"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-500 mb-2">{modelo.nombre}</h3>
                  <p className="text-gray-700 text-sm">
                    Cilindraje: {modelo.cilindraje || "No especificado"}
                  </p>
                  <p className="text-gray-700 text-sm mb-4">
                    {rangoAnios(modelo)}
                  </p>

                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <button
                      onClick={() => navigate(`/productos?modeloId=${modelo._id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
                    >
                      Ver productos
                    </button>

                    {esAdmin && (
                      <>
                        <button
                          onClick={() => editarModelo(modelo)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarModelo(modelo._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
