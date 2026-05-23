const mongoose = require("mongoose");

// Define la estructura de un modelo de motocicleta
const motorcycleModelSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MotorcycleType",
    required: true
  },
  imagen: {
    type: String,
    required: false
  },
  cilindraje: {
    type: Number,
    required: false
  },
  anioInicio: {
    type: Number,
    required: false
  },
  anioFin: {
    type: Number,
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

module.exports = mongoose.model("MotorcycleModel", motorcycleModelSchema);
