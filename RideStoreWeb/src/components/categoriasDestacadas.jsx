// src/components/CategoriasDestacadas.jsx
import { useNavigate } from "react-router-dom";

export default function CategoriasDestacadas() {
  const navigate = useNavigate();

  const categorias = [
    {
      nombre: "Duke 1290R",
      descripcion: "Repuestos esenciales para tu KTM 1290R.",
      imagen: "/images/Duke1290R.png",
      ruta: "/productos?modelo=duke1290r",
    },
    {
      nombre: "Accesorios y Equipamiento",
      descripcion: "Guantes, cascos, protecciones y mucho más.",
      imagen: "/images/ktm-track.jpeg",
      ruta: "/productos?modelo=accesorios",
    },
    {
      nombre: "Duke 390",
      descripcion: "Encuentra lo necesario para tu 390.",
      imagen: "/images/Duke 390.jpg",
      ruta: "/productos?modelo=duke390",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Explora nuestras categorías</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categorias.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-orange-400 transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={cat.imagen}
              alt={cat.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">{cat.nombre}</h3>
              <p className="text-gray-700 text-sm mb-4">{cat.descripcion}</p>
              <button
                onClick={() => navigate(cat.ruta)}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transform hover:scale-105 transition-transform duration-300"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
