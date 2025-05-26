// src/pages/Catalogo.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const modelo = query.get("modelo");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        const filtrados = data.filter(p => p.categoria === modelo);
        setProductos(filtrados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    obtenerProductos();
  }, [modelo]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-orange-500 mb-6 capitalize">
        Catálogo: {modelo}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((p) => (
          <div key={p._id} className="bg-white rounded-lg shadow p-4">
            {p.imagen && (
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-40 object-contain mb-3"
              />
            )}
            <h3 className="font-semibold text-lg text-orange-600">{p.nombre}</h3>
            <p className="text-sm text-gray-600">{p.descripcion}</p>
            <p className="text-orange-700 font-bold mt-1">${p.precio}</p>
            <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition w-full">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
