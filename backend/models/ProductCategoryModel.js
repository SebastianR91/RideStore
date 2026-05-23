const mongoose = require("mongoose");

// Define la estructura de una categoria de producto
const productCategorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  icono: {
    type: String,
    required: false
  },
  activo: {
    type: Boolean,
    default: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ProductCategory", productCategorySchema);
