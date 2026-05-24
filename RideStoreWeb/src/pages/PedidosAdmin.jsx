import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio";

const estadosPedido = [
  "PAGADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/ordenes/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.mensaje || "No se pudieron cargar las órdenes", "error");
        return;
      }

      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      Swal.fire("Error", "Hubo un problema al cargar las órdenes", "error");
    }
  };

  const actualizarEstado = async (pedidoId, estadoPedido) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/ordenes/${pedidoId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estadoPedido }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.mensaje || "No se pudo actualizar el estado", "error");
        return;
      }

      setPedidos((actuales) =>
        actuales.map((pedido) => (pedido._id === pedidoId ? data.orden : pedido))
      );

      Swal.fire("Actualizado", "El estado del pedido fue actualizado", "success");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire("Error", "Hubo un problema al actualizar el pedido", "error");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-10 text-center text-orange-600">
        Ventas y pedidos
      </h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-500 text-center">No hay pedidos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                <div>
                  <h2 className="font-bold text-orange-500">{pedido.referenciaPago}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.creadoEn).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Cliente: {pedido.clienteId?.nombre} {pedido.clienteId?.apellidos}
                  </p>
                  <p className="text-sm text-gray-700">{pedido.clienteId?.correo}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <select
                    value={pedido.estadoPedido}
                    onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    {estadosPedido.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-700">Pago: {pedido.estadoPago}</p>
                  <p className="text-xl font-bold text-orange-600">
                    Total: ${formatearPrecio(pedido.total)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {pedido.items.map((item) => (
                  <div key={`${pedido._id}-${item.productoId?._id || item.nombreProducto}`} className="border-t pt-3">
                    <div className="flex items-center gap-3">
                      {item.imagen && (
                        <img src={item.imagen} alt={item.nombreProducto} className="w-16 h-16 object-contain" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{item.nombreProducto}</p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.cantidad} | Subtotal: ${formatearPrecio(item.subtotal)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vendedor: {item.sellerId?.nombre} {item.sellerId?.apellidos} ({item.sellerId?.correo})
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
