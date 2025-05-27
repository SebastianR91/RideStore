// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio"; // ✅ Importar utilidad

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const modelo = decodeURIComponent(new URLSearchParams(location.search).get("modelo") || "");

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

  const nombresBonitos = {
    duke1290r: "Duke 1290R",
    duke390: "Duke 390",
    accesorios: "Accesorios y Equipamiento",
  };
  const nombreCategoria = nombresBonitos[modelo] || modelo;

  useEffect(() => {
    const obtenerProductos = async () => {
      if (!modelo) return;

      Swal.fire({
        title: "Cargando productos...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        const filtrados = data.filter((p) => p.categoria === modelo);
        setProductos(filtrados);
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

    obtenerProductos();
  }, [modelo]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <h2 className="text-3xl font-bold mb-6 text-center capitalize text-orange-600">
        {nombreCategoria}
      </h2>

      {productos.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos disponibles para esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
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
                  <h3 className="text-xl font-bold text-orange-600 mb-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">{producto.descripcion}</p>
                  <p className="text-orange-500 font-bold mb-4">
                    ${formatearPrecio(Number(producto.precio))}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
