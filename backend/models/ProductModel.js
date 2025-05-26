const mongoose = require("mongoose"); // Importa mongoose para definir el esquema del producto

// Define la estructura del producto
const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,             // El nombre del producto será texto
    required: true,           // Es obligatorio
    trim: true                // Elimina espacios al principio/final
  },
  descripcion: {
    type: String,             // Campo opcional de descripción
    trim: true
  },
  imagen: {
    type: String, // Será la URL o base64 de la imagen
    required: false // Opcional por si no se sube
  },
  precio: {
    type: Number,             // El precio debe ser numérico
    required: true,           // También es obligatorio
    min: 0                    // No puede ser negativo
  },
  categoria: {
    type: String,
    required: true,
    enum: ["duke1290r", "duke390", "accesorios"] // ← para controlar errores
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del usuario que creó el producto
    ref: "Usuario",                       // Se relaciona con el modelo Usuario
    required: true
  },
  creadoEn: {
    type: Date,               // Fecha de creación
    default: Date.now         // Se genera automáticamente
  }
});

// Exporta el modelo para usarlo en controladores y rutas
module.exports = mongoose.model("Producto", productoSchema);
