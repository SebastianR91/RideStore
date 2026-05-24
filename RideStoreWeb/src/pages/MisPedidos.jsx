import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatearPrecio } from "../utils/formatearPrecio";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth?modo=login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/ordenes/mis-pedidos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.mensaje || "No se pudieron cargar tus pedidos", "error");
        return;
      }

      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire("Error", "Hubo un problema al cargar tus pedidos", "error");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-10 text-center text-orange-600">
        Mis pedidos
      </h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-500 text-center">Todavía no tienes pedidos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                <div>
                  <h2 className="font-bold text-orange-500">{pedido.referenciaPago}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.creadoEn).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Pedido: <span className="font-semibold">{pedido.estadoPedido}</span></p>
                  <p>Pago: <span className="font-semibold">{pedido.estadoPago}</span></p>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  ${formatearPrecio(pedido.total)}
                </p>
              </div>

              <div className="space-y-3">
                {pedido.items.map((item) => (
                  <div key={`${pedido._id}-${item.productoId?._id || item.nombreProducto}`} className="flex items-center gap-3 border-t pt-3">
                    {item.imagen && (
                      <img src={item.imagen} alt={item.nombreProducto} className="w-16 h-16 object-contain" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.nombreProducto}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.cantidad} | Unitario: ${formatearPrecio(item.precioUnitario)}
                      </p>
                    </div>
                    <p className="font-bold">${formatearPrecio(item.subtotal)}</p>
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
