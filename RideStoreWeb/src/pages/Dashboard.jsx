// src/pages/Dashboard.jsx
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio"; // ✅ Importar utilidad

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("duke1290r");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  const token = localStorage.getItem("token");
  const formRef = useRef(null);
  const contenedorRef = useRef(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    Swal.fire({
      title: "Cargando productos...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    Swal.close();
  };

  const convertirABase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImagen(reader.result);
    reader.onerror = (error) => console.error("Error al leer imagen", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = modoEdicion
      ? `http://localhost:5000/api/productos/${productoId}`
      : "http://localhost:5000/api/productos";

    const method = modoEdicion ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion, precio, imagen, categoria }),
      });

      if (res.ok) {
        obtenerProductos();
        cancelarEdicion();

        Swal.fire({
          icon: "success",
          title: modoEdicion ? "Producto actualizado" : "Producto creado",
          text: modoEdicion
            ? "El producto fue actualizado correctamente"
            : "Tu producto fue añadido exitosamente",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar el producto", "error");
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire("Error", "Hubo un problema al enviar el producto", "error");
    }
  };

  const editarProducto = (producto) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setImagen(producto.imagen);
    setCategoria(producto.categoria);
    setProductoId(producto._id);
    setModoEdicion(true);

    setTimeout(() => {
      const offsetTop = contenedorRef.current?.getBoundingClientRect().top + window.scrollY;
      const offset = offsetTop - 20;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }, 100);
  };

  const cancelarEdicion = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen("");
    setCategoria("duke1290r");
    setProductoId(null);
    setModoEdicion(false);

    Swal.fire({
      icon: "info",
      title: "Edición cancelada",
      text: "Los cambios no fueron guardados",
      confirmButtonColor: "#d33",
    });
  };

  const eliminarProducto = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
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
        const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          obtenerProductos();
          Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el producto", "error");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire("Error", "Hubo un error al eliminar el producto", "error");
      }
    }
  };

  return (
    <div ref={contenedorRef} className="max-w-5xl mx-auto px-4 pt-32 pb-8">
      <h2 className="text-2xl font-bold mb-6">Gestionar Productos</h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded shadow-md mb-10 border-2 transition-all duration-300 ${
          modoEdicion
            ? "border-orange-500 ring-2 ring-orange-300 animate-pulse"
            : "border-transparent"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="p-2 border rounded col-span-1 md:col-span-2"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-2 border rounded col-span-1 md:col-span-2"
          >
            <option value="duke1290r">Duke 1290R</option>
            <option value="duke390">Duke 390</option>
            <option value="accesorios">Accesorios y Equipamiento</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => convertirABase64(e.target.files[0])}
            className="col-span-1 md:col-span-2"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            {modoEdicion ? "Actualizar Producto" : "Crear Producto"}
          </button>

          {modoEdicion && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <div key={p._id} className="bg-white rounded shadow p-4">
            {p.imagen && (
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-40 object-contain rounded mb-3 bg-white"
              />
            )}
            <h3 className="font-semibold text-lg">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.descripcion}</p>
            <p className="text-orange-600 font-bold mt-1">
              ${formatearPrecio(Number(p.precio))}
            </p>
            <p className="text-xs text-gray-400">Categoría: {p.categoria}</p>
            <p className="text-xs text-gray-400 mt-1">
              Creado por: {p.usuarioId?.nombre}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editarProducto(p)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
