// src/pages/Productos.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modelo, setModelo] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [productoModeloId, setProductoModeloId] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagen, setImagen] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [modeloFiltro, setModeloFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const location = useLocation();
  const modeloId = new URLSearchParams(location.search).get("modeloId") || "";
  const token = localStorage.getItem("token");
  const esAdmin = Boolean(token);
  const esCatalogoPorModelo = Boolean(modeloId);

  useEffect(() => {
    obtenerDatosBase();
  }, []);

  useEffect(() => {
    obtenerModeloSeleccionado();
    obtenerProductos();
  }, [modeloId]);

  const obtenerDatosBase = async () => {
    try {
      const [marcasRes, modelosRes, categoriasRes] = await Promise.all([
        fetch("http://localhost:5000/api/marcas"),
        fetch("http://localhost:5000/api/modelos-moto"),
        fetch("http://localhost:5000/api/categorias-producto"),
      ]);

      setMarcas(await marcasRes.json());
      setModelos(await modelosRes.json());
      setCategorias(await categoriasRes.json());
    } catch (error) {
      console.error("Error al cargar filtros:", error);
      Swal.fire("Error", "No se pudieron cargar los filtros de productos", "error");
    }
  };

  const obtenerModeloSeleccionado = async () => {
    if (!modeloId) {
      setModelo(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/modelos-moto");
      const data = await res.json();
      setModelo(data.find((model) => model._id === modeloId));
    } catch (error) {
      console.error("Error al cargar modelo:", error);
    }
  };

  const obtenerProductos = async () => {
    Swal.fire({
      title: "Cargando productos...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const endpoint = modeloId
        ? `http://localhost:5000/api/productos?modeloId=${modeloId}`
        : "http://localhost:5000/api/productos";
      const res = await fetch(endpoint);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
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

  const obtenerId = (valor) => valor?._id || valor || "";

  const obtenerMarcaIdProducto = (producto) => {
    const modeloProducto = producto.modeloId;
    if (!modeloProducto) return "";

    if (modeloProducto.brandId) return obtenerId(modeloProducto.brandId);

    const modeloCatalogo = modelos.find((item) => item._id === obtenerId(modeloProducto));
    return obtenerId(modeloCatalogo?.brandId);
  };

  const obtenerModeloNombre = (producto) => {
    if (producto.modeloId?.nombre) return producto.modeloId.nombre;

    const modeloCatalogo = modelos.find((item) => item._id === obtenerId(producto.modeloId));
    return modeloCatalogo?.nombre || "Sin modelo";
  };

  const obtenerMarcaNombre = (producto) => {
    const marcaId = obtenerMarcaIdProducto(producto);
    const marca = marcas.find((item) => item._id === marcaId);
    return marca?.nombre || "Sin marca";
  };

  const productosFiltrados = useMemo(() => {
    if (esCatalogoPorModelo) return productos;

    return productos.filter((producto) => {
      const nombreProducto = producto.nombre?.toLowerCase() || "";
      const precioProducto = Number(producto.precio);
      const coincideBusqueda = nombreProducto.includes(busqueda.toLowerCase());
      const coincideMarca = !marcaFiltro || obtenerMarcaIdProducto(producto) === marcaFiltro;
      const coincideModelo = !modeloFiltro || obtenerId(producto.modeloId) === modeloFiltro;
      const coincideCategoria = !categoriaFiltro || obtenerId(producto.categoriaId) === categoriaFiltro;
      const coincideMin = !precioMin || precioProducto >= Number(precioMin);
      const coincideMax = !precioMax || precioProducto <= Number(precioMax);

      return (
        coincideBusqueda &&
        coincideMarca &&
        coincideModelo &&
        coincideCategoria &&
        coincideMin &&
        coincideMax
      );
    });
  }, [productos, busqueda, marcaFiltro, modeloFiltro, categoriaFiltro, precioMin, precioMax, marcas, modelos, esCatalogoPorModelo]);

  const modelosFiltrados = marcaFiltro
    ? modelos.filter((item) => obtenerId(item.brandId) === marcaFiltro)
    : modelos;

  const limpiarFiltros = () => {
    setBusqueda("");
    setMarcaFiltro("");
    setModeloFiltro("");
    setCategoriaFiltro("");
    setPrecioMin("");
    setPrecioMax("");
  };

  const convertirABase64 = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImagen(reader.result);
    reader.onerror = (error) => console.error("Error al leer imagen", error);
  };

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carritoActual.find((p) => p._id === producto._id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carritoActual.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: `"${producto.nombre}" se añadió al carrito`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const abrirCrearProducto = () => {
    limpiarFormulario();
    setProductoModeloId(modeloId);
    setMostrarFormulario(true);
  };

  const editarProducto = (producto) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio);
    setStock(producto.stock ?? "");
    setSku(producto.sku || "");
    setCategoriaId(obtenerId(producto.categoriaId));
    setImagen(producto.imagen || "");
    setProductoModeloId(obtenerId(producto.modeloId));
    setProductoId(producto._id);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setSku("");
    setCategoriaId("");
    setImagen("");
    setProductoModeloId("");
    setProductoId(null);
    setModoEdicion(false);
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    const endpoint = modoEdicion
      ? `http://localhost:5000/api/productos/${productoId}`
      : "http://localhost:5000/api/productos";

    const method = modoEdicion ? "PUT" : "POST";
    const modeloProductoId = modeloId || productoModeloId;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          stock,
          sku,
          categoriaId,
          imagen,
          modeloId: modeloProductoId,
        }),
      });

      if (res.ok) {
        await obtenerProductos();
        cancelarFormulario();

        Swal.fire({
          icon: "success",
          title: modoEdicion ? "Producto actualizado" : "Producto creado",
          text: modoEdicion
            ? "El producto fue actualizado correctamente"
            : "El producto fue creado exitosamente",
          confirmButtonColor: "#ea580c",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar el producto", "error");
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire("Error", "Hubo un problema al guardar el producto", "error");
    }
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
          await obtenerProductos();
          Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar el producto", "error");
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire("Error", "Hubo un error al eliminar el producto", "error");
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
            {esCatalogoPorModelo ? (
              <>
                Productos para{" "}
                <span className="text-orange-500">
                  {modelo?.nombre || "modelo seleccionado"}
                </span>
              </>
            ) : (
              "Productos disponibles"
            )}
          </h2>
        </div>

        {!esCatalogoPorModelo && (
          <div className="bg-white p-6 rounded shadow-md mb-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={marcaFiltro}
                onChange={(e) => {
                  setMarcaFiltro(e.target.value);
                  setModeloFiltro("");
                }}
                className="p-2 border rounded"
              >
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca._id} value={marca._id}>{marca.nombre}</option>
                ))}
              </select>
              <select
                value={modeloFiltro}
                onChange={(e) => setModeloFiltro(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Todos los modelos</option>
                {modelosFiltrados.map((modeloItem) => (
                  <option key={modeloItem._id} value={modeloItem._id}>{modeloItem.nombre}</option>
                ))}
              </select>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Precio mínimo"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Precio máximo"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={limpiarFiltros}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {esAdmin && esCatalogoPorModelo && (
          <div className="flex justify-center mb-8">
            <button
              onClick={abrirCrearProducto}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
            >
              Crear producto
            </button>
          </div>
        )}

        {esAdmin && mostrarFormulario && (
          <form
            onSubmit={guardarProducto}
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
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                className="p-2 border rounded"
              >
                <option value="">Selecciona una categoría de repuesto</option>
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {categorias.length === 0 && (
                <p className="text-sm text-gray-600 col-span-1 md:col-span-2">
                  No hay categorías de repuesto registradas. Crea categorías como Frenos, Motor, Llantas, Suspensión, Eléctrico.
                </p>
              )}
              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="p-2 border rounded col-span-1 md:col-span-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => convertirABase64(e.target.files[0])}
                className="col-span-1 md:col-span-2"
              />
              {imagen && (
                <img
                  src={imagen}
                  alt={nombre || "Imagen del producto"}
                  className="w-full h-40 object-contain rounded bg-white border col-span-1 md:col-span-2"
                />
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                {modoEdicion ? "Actualizar producto" : "Crear producto"}
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

        {productosFiltrados.length === 0 ? (
          <p className="text-center text-gray-600">
            {esCatalogoPorModelo
              ? "No hay productos disponibles para este modelo."
              : "No hay productos disponibles."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productosFiltrados.map((producto) => (
              <div
                key={producto._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
              >
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-48 object-contain bg-white"
                  />
                )}

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-orange-500 mb-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-orange-500 font-bold mb-2">
                      ${formatearPrecio(Number(producto.precio))}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">Stock: {producto.stock}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      Categoría: {producto.categoriaId?.nombre || "Sin categoría"}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Modelo: {obtenerModeloNombre(producto)}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Marca: {obtenerMarcaNombre(producto)}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        if (!esAdmin) agregarAlCarrito(producto);
                      }}
                    >
                      {esAdmin ? "Ver detalle" : "Agregar al carrito"}
                    </button>

                    {esAdmin && (
                      <>
                        <button
                          onClick={() => editarProducto(producto)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto._id)}
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
