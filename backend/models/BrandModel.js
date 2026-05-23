const mongoose = require("mongoose");

// Define la estructura de una marca de motocicleta
const brandSchema = new mongoose.Schema({
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
  logo: {
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

module.exports = mongoose.model("Brand", brandSchema);
