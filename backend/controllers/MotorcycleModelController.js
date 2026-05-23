const MotorcycleModel = require("../models/MotorcycleModel");

// Crear un nuevo modelo de motocicleta
const crear = async (req, res) => {
  try {
    const { nombre, slug, brandId, typeId, imagen, cilindraje, anioInicio, anioFin, activo } = req.body;

    const nuevoModelo = new MotorcycleModel({
      nombre,
      slug,
      brandId,
      typeId,
      imagen,
      cilindraje,
      anioInicio,
      anioFin,
      activo
    });

    await nuevoModelo.save();

    res.status(201).json({
      mensaje: "Modelo de motocicleta creado exitosamente.",
      modeloMoto: nuevoModelo
    });
  } catch (error) {
    console.error("Error al crear modelo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear el modelo de motocicleta." });
  }
};

// Obtener todos los modelos de motocicleta
const obtenerTodos = async (req, res) => {
  try {
    const modelosMoto = await MotorcycleModel.find()
      .populate("brandId", "nombre slug logo")
      .populate("typeId", "nombre slug");

    res.status(200).json(modelosMoto);
  } catch (error) {
    console.error("Error al obtener modelos de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar modelos de motocicleta." });
  }
};

// Obtener un modelo de motocicleta por ID
const obtenerPorId = async (req, res) => {
  try {
    const modeloMoto = await MotorcycleModel.findById(req.params.id)
      .populate("brandId", "nombre slug logo")
      .populate("typeId", "nombre slug");

    res.status(200).json(modeloMoto);
  } catch (error) {
    console.error("Error al obtener modelo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al obtener el modelo de motocicleta." });
  }
};

// Actualizar un modelo de motocicleta por ID
const actualizar = async (req, res) => {
  try {
    const { nombre, slug, brandId, typeId, imagen, cilindraje, anioInicio, anioFin, activo } = req.body;

    const modeloActualizado = await MotorcycleModel.findByIdAndUpdate(
      req.params.id,
      { nombre, slug, brandId, typeId, imagen, cilindraje, anioInicio, anioFin, activo },
      { new: true }
    )
      .populate("brandId", "nombre slug logo")
      .populate("typeId", "nombre slug");

    res.status(200).json({
      mensaje: "Modelo de motocicleta actualizado exitosamente.",
      modeloMoto: modeloActualizado
    });
  } catch (error) {
    console.error("Error al actualizar modelo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error al actualizar el modelo de motocicleta." });
  }
};

// Eliminar un modelo de motocicleta por ID
const eliminar = async (req, res) => {
  try {
    await MotorcycleModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Modelo de motocicleta eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar modelo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al eliminar el modelo de motocicleta." });
  }
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};
