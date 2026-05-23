// src/components/CategoriasDestacadas.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MarcasDestacadas() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const esAdmin = Boolean(token);

  const [brands, setBrands] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    obtenerMarcas();
  }, []);

  const obtenerMarcas = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/marcas");
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
      Swal.fire("Error", "No se pudieron cargar las marcas", "error");
    }
  };

  const convertirLogoABase64 = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setLogo(reader.result);
    reader.onerror = (error) => console.error("Error al leer logo", error);
  };

  const abrirCrearMarca = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const editarMarca = (brand) => {
    setNombre(brand.nombre);
    setSlug(brand.slug);
    setLogo(brand.logo || "");
    setBrandId(brand._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setSlug("");
    setLogo("");
    setBrandId(null);
    setModoEdicion(false);
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarMarca = async (e) => {
    e.preventDefault();

    const endpoint = modoEdicion
      ? `http://localhost:5000/api/marcas/${brandId}`
      : "http://localhost:5000/api/marcas";

    const method = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, slug, logo }),
      });

      if (res.ok) {
        await obtenerMarcas();
        cancelarFormulario();

        Swal.fire({
          icon: "success",
          title: modoEdicion ? "Marca actualizada" : "Marca creada",
          text: modoEdicion
            ? "La marca fue actualizada correctamente"
            : "La marca fue creada exitosamente",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar la marca", "error");
      }
    } catch (error) {
      console.error("Error al guardar marca:", error);
      Swal.fire("Error", "Hubo un problema al guardar la marca", "error");
    }
  };

  const eliminarMarca = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar marca?",
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
        const res = await fetch(`http://localhost:5000/api/marcas/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          await obtenerMarcas();
          Swal.fire("Eliminada", "La marca ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la marca", "error");
        }
      } catch (error) {
        console.error("Error al eliminar marca:", error);
        Swal.fire("Error", "Hubo un error al eliminar la marca", "error");
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Explora nuestras marcas</h2>

      {esAdmin && (
        <div className="flex justify-center mb-8">
          <button
            onClick={abrirCrearMarca}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
          >
            Crear marca
          </button>
        </div>
      )}

      {esAdmin && mostrarFormulario && (
        <form
          onSubmit={guardarMarca}
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
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => convertirLogoABase64(e.target.files[0])}
              className="col-span-1 md:col-span-2"
            />
            {logo && (
              <img
                src={logo}
                alt={nombre || "Logo de marca"}
                className="w-full h-40 object-contain rounded bg-white border col-span-1 md:col-span-2"
              />
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              {modoEdicion ? "Editar marca" : "Crear marca"}
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

      {brands.length === 0 ? (
        <p className="text-center text-gray-600">No hay marcas registradas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300"
            >
              {brand.logo && (
                <img
                  src={brand.logo}
                  alt={brand.nombre}
                  className="w-full h-48 object-contain bg-white"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-500 mb-4">{brand.nombre}</h3>
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    onClick={() => navigate(`/modelos?marcaId=${brand._id}`)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
                  >
                    Ver modelos
                  </button>

                  {esAdmin && (
                    <>
                    <button
                      onClick={() => editarMarca(brand)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarMarca(brand._id)}
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
  );
}
