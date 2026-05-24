const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  nombreProducto: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String,
    required: false
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estadoPedido: {
    type: String,
    enum: ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO", "CANCELADO"],
    default: "PAGADO"
  },
  estadoPago: {
    type: String,
    enum: ["APROBADO", "RECHAZADO", "PENDIENTE"],
    default: "APROBADO"
  },
  metodoPago: {
    type: String,
    enum: ["SIMULADO"],
    default: "SIMULADO"
  },
  referenciaPago: {
    type: String,
    trim: true
  },
  direccionEnvio: {
    type: String,
    trim: true
  },
  telefonoContacto: {
    type: String,
    trim: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
