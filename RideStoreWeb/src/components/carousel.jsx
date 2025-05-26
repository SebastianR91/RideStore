// src/components/Carousel.jsx
import { useEffect, useState } from "react";

const images = [
  "/images/Duke1290R.png",
  "/images/RideStore Logo.jpg",
  "/images/Duke 390.jpg",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6 rounded-xl shadow-xl overflow-hidden h-64">
      {/* Imagen de fondo */}
      <img
        src="/images/ktm-track.jpeg"
        alt="Fondo KTM"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* Carrusel de imágenes */}
      <div
        className="relative z-10 flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className="w-full flex-shrink-0 object-contain"
          />
        ))}
      </div>

      {/* Botones de control */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-orange-500 transition z-20"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-orange-500 transition z-20"
      >
        →
      </button>
    </div>
  );
}
