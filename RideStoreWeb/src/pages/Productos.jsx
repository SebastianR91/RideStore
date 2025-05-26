// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const modelo = new URLSearchParams(location.search).get("modelo");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        const filtrados = data.filter((p) => p.categoria === modelo);
        setProductos(filtrados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    obtenerProductos();
  }, [modelo]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center capitalize">
        Productos de {modelo}
      </h2>

      {productos.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos disponibles para esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto._id} className="bg-white rounded shadow p-4">
              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-40 object-contain mb-3"
                />
              )}
              <h3 className="text-xl font-bold text-orange-600">{producto.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
              <p className="text-orange-500 font-bold mb-4">${producto.precio}</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
