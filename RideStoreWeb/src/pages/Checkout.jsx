import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
import { formatearPrecio } from "../utils/formatearPrecio";

const bancos = [
  "Bancolombia",
  "Davivienda",
  "Nequi",
  "Daviplata",
  "Banco de Bogota",
  "Banco Popular",
  "Banco Caja Social",
];

const estadoInicial = {
  banco: "",
  tipoPersona: "",
  nombreTitular: "",
  documento: "",
  correo: "",
  telefonoContacto: "",
  direccionEnvio: "",
};

export default function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [paso, setPaso] = useState(1);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [mensajeProceso, setMensajeProceso] = useState("");
  const [ordenCreada, setOrdenCreada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Inicia sesion", "Debes iniciar sesion para finalizar tu compra.", "warning");
      navigate("/auth?modo=login");
      return;
    }

    setCarrito(carritoGuardado);
  }, [navigate]);

  const total = useMemo(
    () => carrito.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 0), 0),
    [carrito]
  );

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validarPago = () => {
    const nuevosErrores = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Object.entries(formulario).forEach(([campo, valor]) => {
      if (!String(valor).trim()) {
        nuevosErrores[campo] = "Este campo es obligatorio.";
      }
    });

    if (formulario.documento && !/^\d+$/.test(formulario.documento)) {
      nuevosErrores.documento = "El documento debe ser numerico.";
    }

    if (formulario.telefonoContacto && !/^\d+$/.test(formulario.telefonoContacto)) {
      nuevosErrores.telefonoContacto = "El telefono debe ser numerico.";
    }

    if (formulario.correo && !correoRegex.test(formulario.correo)) {
      nuevosErrores.correo = "Ingresa un correo valido.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pagarAhora = async (e) => {
    e.preventDefault();

    if (!validarPago()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Inicia sesion", "Debes iniciar sesion para finalizar tu compra.", "warning");
      navigate("/auth?modo=login");
      return;
    }

    if (carrito.length === 0) {
      Swal.fire("Carrito vacio", "Agrega productos antes de pagar.", "info");
      navigate("/carrito");
      return;
    }

    try {
      setProcesando(true);
      setMensajeProceso("Conectando con entidad financiera...");
      await esperar(900);
      setMensajeProceso("Validando pago...");
      await esperar(900);
      setMensajeProceso("Pago aprobado");
      await esperar(600);

      const res = await fetch("http://localhost:5000/api/ordenes/simular-pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: carrito.map((item) => ({
            productoId: item.productoId || item._id,
            cantidad: item.cantidad,
          })),
          direccionEnvio: formulario.direccionEnvio,
          telefonoContacto: formulario.telefonoContacto,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.mensaje || "No se pudo crear el pedido", "error");
        setProcesando(false);
        return;
      }

      localStorage.removeItem("carrito");
      setOrdenCreada(data.orden || data);
      setPaso(3);
      setProcesando(false);

      await Swal.fire({
        icon: "success",
        title: "Pago aprobado",
        text: "Tu pedido fue creado exitosamente",
        confirmButtonText: "Ver mis pedidos",
        confirmButtonColor: "#ea580c",
      });

      navigate("/mis-pedidos");
    } catch (error) {
      console.error("Error al crear pedido:", error);
      setProcesando(false);
      Swal.fire("Error", "Hubo un problema al procesar el pago simulado", "error");
    }
  };

  const pasos = [
    { numero: 1, texto: "Resumen" },
    { numero: 2, texto: "Pago" },
    { numero: 3, texto: "Confirmacion" },
  ];

  const renderError = (campo) =>
    errores[campo] ? <p className="mt-1 text-sm text-red-500">{errores[campo]}</p> : null;

  if (carrito.length === 0 && !ordenCreada) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-24">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-orange-600 mb-3">Checkout</h1>
          <p className="text-gray-600 mb-6">Tu carrito esta vacio.</p>
          <button
            onClick={() => navigate("/productos")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto p-6 mt-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-orange-600">Checkout RideStore</h1>
        <p className="text-gray-600 mt-2">Pasarela simulada de pago</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {pasos.map((item) => (
            <div key={item.numero} className="flex items-center gap-2">
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                  paso === item.numero
                    ? "bg-orange-600 text-white"
                    : paso > item.numero
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.numero}
              </span>
              <span className={paso === item.numero ? "font-semibold text-orange-600" : "text-gray-600"}>
                {item.texto}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <main className="bg-white rounded-lg shadow-lg p-6">
          {paso === 1 && (
            <section>
              <h2 className="text-2xl font-bold text-orange-600 mb-5">Resumen de compra</h2>
              <div className="space-y-4">
                {carrito.map((item) => (
                  <div key={item.productoId || item._id} className="flex gap-4 border-b pb-4">
                    {item.imagen && (
                      <img src={item.imagen} alt={item.nombre} className="w-20 h-20 object-contain rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                      <p className="font-bold text-orange-600">
                        ${formatearPrecio(Number(item.precio || 0) * Number(item.cantidad || 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xl font-bold">Total: ${formatearPrecio(total)}</p>
                <button
                  onClick={() => setPaso(2)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition"
                >
                  Continuar al pago
                </button>
              </div>
            </section>
          )}

          {paso === 2 && (
            <section>
              <h2 className="text-2xl font-bold text-orange-600 mb-2">Pago simulado</h2>
              <p className="text-gray-600 mb-6">
                Este flujo no usa proveedores reales ni almacena datos bancarios.
              </p>

              {procesando ? (
                <div className="min-h-[360px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-5" />
                  <h3 className="text-xl font-bold text-gray-900">{mensajeProceso}</h3>
                  <p className="text-gray-500 mt-2">Pago simulado RideStore</p>
                </div>
              ) : (
                <form onSubmit={pagarAhora} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Banco</label>
                    <select
                      name="banco"
                      value={formulario.banco}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Selecciona un banco</option>
                      {bancos.map((banco) => (
                        <option key={banco} value={banco}>
                          {banco}
                        </option>
                      ))}
                    </select>
                    {renderError("banco")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de persona</label>
                    <select
                      name="tipoPersona"
                      value={formulario.tipoPersona}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Selecciona una opcion</option>
                      <option value="Natural">Natural</option>
                      <option value="Juridica">Juridica</option>
                    </select>
                    {renderError("tipoPersona")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del titular</label>
                    <input
                      name="nombreTitular"
                      value={formulario.nombreTitular}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {renderError("nombreTitular")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Documento</label>
                    <input
                      name="documento"
                      value={formulario.documento}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {renderError("documento")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correo</label>
                    <input
                      name="correo"
                      value={formulario.correo}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {renderError("correo")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                    <input
                      name="telefonoContacto"
                      value={formulario.telefonoContacto}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {renderError("telefonoContacto")}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Direccion de envio</label>
                    <input
                      name="direccionEnvio"
                      value={formulario.direccionEnvio}
                      onChange={actualizarCampo}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {renderError("direccionEnvio")}
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => setPaso(1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition"
                    >
                      Volver al resumen
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition"
                    >
                      Pagar ahora
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {paso === 3 && (
            <section className="min-h-[360px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                <Icon icon="mdi:check-bold" className="text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-orange-600">Pago aprobado</h2>
              <p className="text-gray-600 mt-2">Tu pedido fue creado exitosamente.</p>
              {ordenCreada?.referenciaPago && (
                <p className="mt-4 font-semibold">Referencia: {ordenCreada.referenciaPago}</p>
              )}
              <p className="mt-2 font-bold">Total pagado: ${formatearPrecio(ordenCreada?.total || total)}</p>
              <button
                onClick={() => navigate("/mis-pedidos")}
                className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition"
              >
                Ver mis pedidos
              </button>
            </section>
          )}
        </main>

        <aside className="bg-white rounded-lg shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-orange-600 mb-4">Resumen del pedido</h2>
          <div className="space-y-3">
            {carrito.map((item) => (
              <div key={item.productoId || item._id} className="flex justify-between gap-4 text-sm border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.nombre}</p>
                  <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                </div>
                <p className="font-semibold">${formatearPrecio(Number(item.precio || 0) * Number(item.cantidad || 0))}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${formatearPrecio(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Metodo de pago</span>
              <span>Pago simulado</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span className="text-orange-600">${formatearPrecio(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
