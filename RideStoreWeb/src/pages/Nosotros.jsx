// src/pages/Nosotros.jsx
import { Icon } from "@iconify/react";

export default function Nosotros() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
      {/* Título */}
      <br />
      <br />
      <h1 className="text-4xl font-bold text-center text-orange-500 mb-10">
        Sobre Nosotros
      </h1>

      {/* Sección de historia */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-orange-500 mb-4">
          Nuestra Historia
        </h3>

        <p className="text-lg leading-relaxed text-justify">
          RideStore nació en el año <strong>2022</strong> con una visión clara:
          convertirse en un espacio confiable para los apasionados por las
          motocicletas y el mundo de los repuestos.

          <br />
          <br />

          Lo que comenzó como una iniciativa enfocada en atender necesidades
          específicas del mercado motero, hoy evoluciona hacia un{" "}
          <strong>marketplace especializado en repuestos para motos</strong>,
          donde los usuarios pueden encontrar productos para diferentes marcas,
          modelos y categorías en un solo lugar.

          <br />
          <br />

          Desde nuestra operación en <strong>Bogotá</strong>, trabajamos para
          conectar motociclistas, proveedores y distribuidores mediante una
          plataforma digital moderna, segura y eficiente. Nuestro propósito es
          simplificar la búsqueda de repuestos y accesorios, ofreciendo una
          experiencia de compra confiable para toda la comunidad motera.
        </p>
      </div>

      {/* Misión y visión */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h3 className="text-2xl font-bold text-orange-500 mb-2">Misión</h3>

          <p className="text-justify">
            Brindar una plataforma digital confiable donde motociclistas puedan
            encontrar repuestos, accesorios y soluciones para diferentes marcas
            de motos, facilitando una experiencia de compra segura, rápida y
            eficiente.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-orange-500 mb-2">Visión</h3>

          <p className="text-justify">
            Ser el marketplace líder en repuestos para motocicletas en Colombia
            y Latinoamérica, conectando compradores y vendedores mediante una
            experiencia tecnológica innovadora, transparente y enfocada en las
            necesidades reales del mundo motero.
          </p>
        </div>
      </div>

      {/* Imágenes representativas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div>
          <img
            src="/images/nosotros1.webp"
            alt="Marketplace motero"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            Comunidad motera
          </p>
        </div>

        <div>
          <img
            src="/images/nosotros2.jpeg"
            alt="Repuestos multimarca"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            Repuestos multimarca
          </p>
        </div>

        <div>
          <img
            src="/images/nosotros3.jpg"
            alt="Compra segura"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            Compra rápida y segura
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Nuestra Zona de Operación</h3>

        <iframe
          title="Sede principal"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8999948488624!2d-74.08175388583229!3d4.609710396656624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99b6d1dc0d6d%3A0x2d8f8b1e4c1572fb!2sBogotá%2C%20Colombia!5e0!3m2!1ses!2sco!4v1685473257753!5m2!1ses!2sco"
          className="w-full h-72 rounded-lg shadow-md border"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contacto */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">Contáctanos</h3>

        <p className="mb-2">📍 Bogotá, Colombia</p>
        <p className="mb-2">📞 +57 300 592 7844</p>
        <p className="mb-2">📧 contacto@ridestore.com</p>

        <div className="flex justify-center gap-4 mt-4">
          <Icon
            icon="mdi:facebook"
            className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer"
          />

          <Icon
            icon="mdi:instagram"
            className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer"
          />

          <Icon
            icon="mdi:whatsapp"
            className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}