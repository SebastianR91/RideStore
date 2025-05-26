// src/pages/Nosotros.jsx
import { Icon } from "@iconify/react";

export default function Nosotros() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
      {/* Título */}
      <br /><br /><h1 className="text-4xl font-bold text-center text-orange-500 mb-10">
        Sobre Nosotros
      </h1>

      {/* Sección de historia */}
        <div className="mb-16">
        <h3 className="text-3xl font-bold text-orange-500 mb-4">Nuestra Historia</h3>
        <p className="text-lg leading-relaxed text-justify">
            RideStore nació en el año <strong>2022</strong> con una visión clara: ser el punto de encuentro para los apasionados
            por las motocicletas <strong>KTM</strong>. Fundada por un equipo de moteros expertos y entusiastas, la tienda se convirtió
            rápidamente en un espacio de confianza para adquirir repuestos de alto rendimiento, accesorios de seguridad y equipamiento técnico especializado.
            <br /><br />
            Desde nuestra sede principal en <strong>Bogotá</strong>, atendemos a motociclistas de todo el país, promoviendo la cultura motera responsable
            y el mantenimiento de calidad. Pero nuestro propósito va más allá: <strong>RideStore busca trascender hacia la nueva era digital</strong>,
            posicionándose como una plataforma líder en la venta en línea de repuestos originales para KTM. Sabemos que el futuro está en el comercio
            electrónico, y por eso, invertimos en experiencia de usuario, atención personalizada y una tienda virtual confiable y moderna.
        </p>
        </div>

        {/* Misión y visión */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">Misión</h3>
            <p className="text-justify">
            Brindar soluciones de calidad y alto rendimiento para motociclistas que buscan seguridad, estilo y confianza.
            Nuestra misión es acompañar a nuestros clientes en cada viaje, promoviendo una experiencia de compra segura
            y satisfactoria, tanto presencial como digital. Nos destacamos por nuestra atención cercana, conocimiento técnico y pasión por el mundo de las dos ruedas.
            </p>
        </div>
        <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">Visión</h3>
            <p className="text-justify">
            Ser la <strong>tienda de repuestos KTM más confiable de Colombia y Latinoamérica</strong>, liderando la evolución hacia el comercio electrónico
            con un servicio transparente, rápido y eficiente. En RideStore queremos romper barreras físicas y llegar a cualquier rincón del país,
            llevando calidad, respaldo y tecnología al mundo motero a través de nuestra plataforma online.
            </p>
        </div>
        </div>

      {/* Imágenes representativas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div>
            <img
            src="/images/nosotros1.webp" // ← cambia por la tuya
            alt="Imagen 1"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
            <p className="text-center text-sm text-gray-500 mt-2">Taller especializado</p>
        </div>

        <div>
            <img
            src="/images/nosotros2.jpeg"
            alt="Imagen 2"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
            <p className="text-center text-sm text-gray-500 mt-2">Repuestos certificados</p>
        </div>

        <div>
            <img
            src="/images/nosotros3.jpg"
            alt="Imagen 3"
            className="rounded-lg shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
            <p className="text-center text-sm text-gray-500 mt-2">Mantenimientos de calidad</p>
        </div>
        </div>

      {/* Mapa de sedes */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 ">Nuestras Sedes</h3>
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
        <p className="mb-2">📍 Calle 123 #45-67, Bogotá</p>
        <p className="mb-2">📞 +57 300 592 7844</p>
        <p className="mb-2">📧 contacto@ridestore.com</p>
        <div className="flex justify-center gap-4 mt-4">
          <Icon icon="mdi:facebook" className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer"/>
          <Icon icon="mdi:instagram" className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer" />
          <Icon icon="mdi:whatsapp" className="text-2xl hover:text-orange-500 hover:scale-125 transition-transform duration-300 cursor-pointer" />
        </div>
      </div>
    </section>
  );
}
