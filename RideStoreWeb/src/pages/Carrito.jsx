import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const obtenerItemId = (item) => item.productoId || item._id;

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => obtenerItemId(item) !== id);
    actualizarCarrito(nuevoCarrito);
    Swal.fire({
      icon: "info",
      title: "Producto eliminado",
      confirmButtonColor: "#ea580c",
    });
  };

  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (obtenerItemId(item) === id) {
        const stockDisponible = Number(item.stock) || 0;
        if (stockDisponible && item.cantidad >= stockDisponible) {
          Swal.fire("Stock insuficiente", "No puedes agregar más unidades que el stock disponible", "warning");
          return item;
        }
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
    actualizarCarrito(nuevoCarrito);
  };

  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map((item) => {
      if (obtenerItemId(item) === id && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    });
    actualizarCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const iniciarCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Inicia sesión", "Debes iniciar sesión para finalizar tu compra.", "warning");
      navigate("/auth?modo=login");
      return;
    }

    if (carrito.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos antes de comprar.", "info");
      return;
    }

    const resumen = carrito
      .map((item) => `<li>${item.nombre} x ${item.cantidad} - $${formatearPrecio(item.precio * item.cantidad)}</li>`)
      .join("");

    const { value: datosPago } = await Swal.fire({
      title: "Pago simulado",
      html: `
        <div style="text-align:left">
          <label>Dirección de envío</label>
          <input id="direccionEnvio" class="swal2-input" placeholder="Dirección de envío" />
          <label>Teléfono de contacto</label>
          <input id="telefonoContacto" class="swal2-input" placeholder="Teléfono de contacto" />
          <p><strong>Método de pago:</strong> Pago simulado</p>
          <ul>${resumen}</ul>
          <p><strong>Total:</strong> $${formatearPrecio(total)}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirmar pago",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ea580c",
      preConfirm: () => {
        const direccionEnvio = document.getElementById("direccionEnvio").value.trim();
        const telefonoContacto = document.getElementById("telefonoContacto").value.trim();

        if (!direccionEnvio) {
          Swal.showValidationMessage("Ingresa una dirección de envío");
          return false;
        }

        if (!telefonoContacto) {
          Swal.showValidationMessage("Ingresa un teléfono de contacto");
          return false;
        }

        return { direccionEnvio, telefonoContacto };
      },
    });

    if (!datosPago) return;

    try {
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
          direccionEnvio: datosPago.direccionEnvio,
          telefonoContacto: datosPago.telefonoContacto,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.mensaje || "No se pudo crear el pedido", "error");
        return;
      }

      localStorage.removeItem("carrito");
      setCarrito([]);

      await Swal.fire({
        icon: "success",
        title: "Pago aprobado",
        text: "Tu pedido fue creado exitosamente",
        confirmButtonColor: "#ea580c",
      });

      navigate("/mis-pedidos");
    } catch (error) {
      console.error("Error al crear pedido:", error);
      Swal.fire("Error", "Hubo un problema al procesar el pago simulado", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-10 text-center text-orange-600">
        Tu carrito
      </h1>

      {carrito.length === 0 ? (
        <p className="text-gray-500 text-center">No has agregado productos todavía.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carrito.map((item) => (
              <div
                key={obtenerItemId(item)}
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

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => disminuirCantidad(obtenerItemId(item))}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(obtenerItemId(item))}
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
                  onClick={() => eliminarDelCarrito(obtenerItemId(item))}
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
              onClick={iniciarCheckout}
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
