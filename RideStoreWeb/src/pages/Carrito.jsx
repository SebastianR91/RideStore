import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item._id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    Swal.fire({
      icon: "info",
      title: "Producto eliminado",
      confirmButtonColor: "#ea580c",
    });
  };

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-gray-500">No has agregado productos todavía.</p>
      ) : (
        <>
          <div className="space-y-4">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded shadow"
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
                  <p className="text-orange-600 font-bold">${item.precio}</p>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Total y botón */}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: ${total}</h2>
            <button
              onClick={() => Swal.fire("Gracias", "Compra simulada 🚀", "success")}
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
