const Order = require("../models/OrderModel");
const Producto = require("../models/ProductModel");

const esAdmin = (req) => req.usuario?.rol?.toLowerCase() === "admin";

// Crear una orden con pago simulado aprobado
const crearOrdenSimulada = async (req, res) => {
  try {
    const { items, direccionEnvio, telefonoContacto } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito no puede estar vacío." });
    }

    const ordenItems = [];
    let total = 0;

    for (const item of items) {
      const cantidad = Number(item.cantidad);

      if (!item.productoId || !Number.isInteger(cantidad) || cantidad < 1) {
        return res.status(400).json({ mensaje: "Cada producto debe tener una cantidad válida." });
      }

      const producto = await Producto.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({ mensaje: "Uno de los productos no existe." });
      }

      if (producto.stock < cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`
        });
      }

      const subtotal = producto.precio * cantidad;
      total += subtotal;

      ordenItems.push({
        productoId: producto._id,
        nombreProducto: producto.nombre,
        imagen: producto.imagen,
        precioUnitario: producto.precio,
        cantidad,
        subtotal,
        sellerId: producto.usuarioId
      });
    }

    const nuevaOrden = new Order({
      clienteId: req.usuario.id,
      items: ordenItems,
      total,
      estadoPedido: "PAGADO",
      estadoPago: "APROBADO",
      metodoPago: "SIMULADO",
      referenciaPago: `RID-${Date.now()}`,
      direccionEnvio,
      telefonoContacto
    });

    await nuevaOrden.save();

    for (const item of ordenItems) {
      await Producto.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad }
      });
    }

    const ordenCreada = await Order.findById(nuevaOrden._id)
      .populate("clienteId", "nombre apellidos correo telefono")
      .populate("items.productoId")
      .populate("items.sellerId", "nombre apellidos correo");

    res.status(201).json({
      mensaje: "Pago aprobado. Orden creada exitosamente.",
      orden: ordenCreada
    });
  } catch (error) {
    console.error("Error al crear orden simulada:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear la orden." });
  }
};

// Obtener pedidos del cliente autenticado
const obtenerMisPedidos = async (req, res) => {
  try {
    const ordenes = await Order.find({ clienteId: req.usuario.id })
      .populate("items.productoId")
      .sort({ creadoEn: -1 });

    res.status(200).json(ordenes);
  } catch (error) {
    console.error("Error al obtener mis pedidos:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar tus pedidos." });
  }
};

// Obtener todas las ordenes para ADMIN
const obtenerTodasLasOrdenesAdmin = async (req, res) => {
  try {
    if (!esAdmin(req)) {
      return res.status(403).json({ mensaje: "No tienes permisos para ver todas las órdenes." });
    }

    const ordenes = await Order.find()
      .populate("clienteId", "nombre apellidos correo telefono")
      .populate("items.sellerId", "nombre apellidos correo")
      .populate("items.productoId")
      .sort({ creadoEn: -1 });

    res.status(200).json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes admin:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar órdenes." });
  }
};

// Actualizar estado del pedido para ADMIN
const actualizarEstadoPedido = async (req, res) => {
  try {
    if (!esAdmin(req)) {
      return res.status(403).json({ mensaje: "No tienes permisos para actualizar órdenes." });
    }

    const { estadoPedido } = req.body;
    const estadosPermitidos = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO", "CANCELADO"];

    if (!estadosPermitidos.includes(estadoPedido)) {
      return res.status(400).json({ mensaje: "Estado de pedido inválido." });
    }

    const ordenActualizada = await Order.findByIdAndUpdate(
      req.params.id,
      { estadoPedido },
      { new: true }
    )
      .populate("clienteId", "nombre apellidos correo telefono")
      .populate("items.sellerId", "nombre apellidos correo")
      .populate("items.productoId");

    if (!ordenActualizada) {
      return res.status(404).json({ mensaje: "Orden no encontrada." });
    }

    res.status(200).json({
      mensaje: "Estado de pedido actualizado exitosamente.",
      orden: ordenActualizada
    });
  } catch (error) {
    console.error("Error al actualizar estado de pedido:", error);
    res.status(500).json({ mensaje: "Error en el servidor al actualizar la orden." });
  }
};

module.exports = {
  crearOrdenSimulada,
  obtenerMisPedidos,
  obtenerTodasLasOrdenesAdmin,
  actualizarEstadoPedido
};
