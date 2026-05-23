import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CatalogoCategorias() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const modeloId = params.get("modeloId");
  const token = localStorage.getItem("token");
  const esAdmin = Boolean(token);

  const [modelo, setModelo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaId, setCategoriaId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [icono, setIcono] = useState("");

  useEffect(() => {
    obtenerModelo();
    obtenerCategorias();
  }, [modeloId]);

  const generarSlug = (texto) =>
    texto
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const obtenerModelo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/modelos-moto");
      const data = await res.json();
      setModelo(data.find((model) => model._id === modeloId));
    } catch (error) {
      console.error("Error al cargar modelo:", error);
      Swal.fire("Error", "No se pudo cargar el modelo seleccionado", "error");
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categorias-producto");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorias:", error);
      Swal.fire("Error", "No se pudieron cargar las categorias", "error");
    }
  };

  const convertirIconoABase64 = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setIcono(reader.result);
    reader.onerror = (error) => console.error("Error al leer imagen", error);
  };

  const abrirCrearCategoria = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const editarCategoria = (categoria) => {
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion || "");
    setIcono(categoria.icono || "");
    setCategoriaId(categoria._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setIcono("");
    setCategoriaId(null);
    setModoEdicion(false);
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();

    const endpoint = modoEdicion
      ? `http://localhost:5000/api/categorias-producto/${categoriaId}`
      : "http://localhost:5000/api/categorias-producto";

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
          descripcion,
          icono,
        }),
      });

      if (res.ok) {
        await obtenerCategorias();
        cancelarFormulario();

        Swal.fire({
          icon: "success",
          title: modoEdicion ? "Categoria actualizada" : "Categoria creada",
          text: modoEdicion
            ? "La categoria fue actualizada correctamente"
            : "La categoria fue creada exitosamente",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar la categoria", "error");
      }
    } catch (error) {
      console.error("Error al guardar categoria:", error);
      Swal.fire("Error", "Hubo un problema al guardar la categoria", "error");
    }
  };

  const eliminarCategoria = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar categoria?",
      text: "Esta accion no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/categorias-producto/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          await obtenerCategorias();
          Swal.fire("Eliminada", "La categoria ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la categoria", "error");
        }
      } catch (error) {
        console.error("Error al eliminar categoria:", error);
        Swal.fire("Error", "Hubo un error al eliminar la categoria", "error");
      }
    }
  };

  return (
    <main className="p-8 mt-20 transition-all duration-300 max-w-screen-lg mx-auto text-center">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          {modelo?.imagen && (
            <img
              src={modelo.imagen}
              alt={modelo.nombre}
              className="w-40 h-32 object-contain bg-white rounded shadow mb-4"
            />
          )}
          <h2 className="text-3xl font-bold text-center">
            Categorías para{" "}
            <span className="text-orange-500">
              {modelo?.nombre || "modelo seleccionado"}
            </span>
          </h2>
        </div>

        {esAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={abrirCrearCategoria}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
            >
              Crear categoría
            </button>
          </div>
        )}

        {esAdmin && mostrarFormulario && (
          <form
            onSubmit={guardarCategoria}
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
              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => convertirIconoABase64(e.target.files[0])}
                className="col-span-1 md:col-span-2"
              />
              {icono && (
                <img
                  src={icono}
                  alt={nombre || "Imagen de categoria"}
                  className="w-full h-40 object-contain rounded bg-white border col-span-1 md:col-span-2"
                />
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                {modoEdicion ? "Actualizar categoría" : "Crear categoría"}
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

        {categorias.length === 0 ? (
          <p className="text-center text-gray-600">No hay categorías registradas</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categorias.map((categoria) => (
              <div
                key={categoria._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300"
              >
                {categoria.icono && (
                  <img
                    src={categoria.icono}
                    alt={categoria.nombre}
                    className="w-full h-48 object-contain bg-white"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-500 mb-2">{categoria.nombre}</h3>
                  <p className="text-gray-700 text-sm mb-4">{categoria.descripcion}</p>

                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <button
                      onClick={() => navigate(`/productos?modeloId=${modeloId}&categoriaId=${categoria._id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
                    >
                      Ver productos
                    </button>

                    {esAdmin && (
                      <>
                        <button
                          onClick={() => editarCategoria(categoria)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarCategoria(categoria._id)}
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
