// src/components/Footer.jsx
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 pt-10 pb-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm max-w-6xl mx-auto text-center md:text-left">
            {/* Sobre RideStore */}
            <div>
            <h3 className="text-orange-500 font-bold mb-2">Sobre RideStore</h3>
            <p className="text-gray-300">
                Somos tu aliado en motopartes KTM, ofreciendo repuestos de calidad para que tu moto siempre rinda al máximo.
            </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
            <h3 className="text-orange-500 font-bold mb-2">Enlaces Rápidos</h3>
            <ul className="space-y-1">
                {["Inicio", "Categorías", "Nosotros", "Contacto", "Términos y Condiciones", "Política de Privacidad"].map((item, index) => (
                <li key={index}>
                    <a
                    href="#"
                    className="hover:text-orange-500 transition-transform duration-300 hover:scale-105 inline-block"
                    >
                    {item}
                    </a>
                </li>
                ))}
            </ul>
            </div>

            {/* Contacto */}
            <div>
            <h3 className="text-orange-500 font-bold mb-2">Contacto</h3>
            <p className="text-gray-300">Calle 123 #45-67, Bogotá, Colombia</p>
            <p className="text-gray-300">+57 300 123 4567</p>
            <p className="text-gray-300">contacto@ridestore.com</p>
            <p className="text-gray-300">Lunes - Viernes: 8:00 AM - 6:00 PM</p>
            </div>

            {/* Redes sociales */}
            <div>
            <h3 className="text-orange-500 font-bold mb-2">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
                <a href="#" className="hover:text-orange-500 hover:scale-110 transition-transform duration-300">
                <Icon icon="mdi:facebook" className="text-2xl" />
                </a>
                <a href="#" className="hover:text-orange-500 hover:scale-110 transition-transform duration-300">
                <Icon icon="mdi:instagram" className="text-2xl" />
                </a>
                <a href="#" className="hover:text-orange-500 hover:scale-110 transition-transform duration-300">
                <Icon icon="mdi:whatsapp" className="text-2xl" />
                </a>
            </div>
            </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-400">
            © 2025 RideStore. Todos los derechos reservados.
        </div>
        </footer>

  );
}
