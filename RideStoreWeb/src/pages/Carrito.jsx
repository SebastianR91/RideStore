import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item._id !== id);
    actualizarCarrito(nuevoCarrito);
    Swal.fire({
      icon: "info",
      title: "Producto eliminado",
      confirmButtonColor: "#ea580c",
    });
  };

  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) =>
      item._id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    actualizarCarrito(nuevoCarrito);
  };

  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item._id === id && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    });
    actualizarCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-10 text-center text-orange-600">
        🛒 Tu Carrito
      </h1>

      {carrito.length === 0 ? (
        <p className="text-gray-500 text-center">No has agregado productos todavía.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-lg hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300"
              >
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-24 h-24 object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.nombre}</h3>
                  <p className="text-gray-600">{item.descripcion}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => disminuirCantidad(item._id)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(item._id)}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-orange-600 font-bold mt-2">
                    ${formatearPrecio(item.precio * item.cantidad)}
                  </p>
                </div>

                <button
                  onClick={() => eliminarDelCarrito(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold">
              Total: ${formatearPrecio(total)}
            </h2>
            <button
              onClick={() => {
                Swal.fire("Gracias", "Compra simulada 🚀", "success");
                localStorage.removeItem("carrito");
                setCarrito([]);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition"
            >
              Comprar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
