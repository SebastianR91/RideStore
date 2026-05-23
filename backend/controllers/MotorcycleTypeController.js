const MotorcycleType = require("../models/MotorcycleTypeModel");

// Crear un nuevo tipo de motocicleta
const crear = async (req, res) => {
  try {
    const { nombre, slug, descripcion, activo } = req.body;

    const nuevoTipo = new MotorcycleType({
      nombre,
      slug,
      descripcion,
      activo
    });

    await nuevoTipo.save();

    res.status(201).json({
      mensaje: "Tipo de motocicleta creado exitosamente.",
      tipoMoto: nuevoTipo
    });
  } catch (error) {
    console.error("Error al crear tipo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear el tipo de motocicleta." });
  }
};

// Obtener todos los tipos de motocicleta
const obtenerTodos = async (req, res) => {
  try {
    const tiposMoto = await MotorcycleType.find();
    res.status(200).json(tiposMoto);
  } catch (error) {
    console.error("Error al obtener tipos de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar tipos de motocicleta." });
  }
};

// Obtener un tipo de motocicleta por ID
const obtenerPorId = async (req, res) => {
  try {
    const tipoMoto = await MotorcycleType.findById(req.params.id);
    res.status(200).json(tipoMoto);
  } catch (error) {
    console.error("Error al obtener tipo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al obtener el tipo de motocicleta." });
  }
};

// Actualizar un tipo de motocicleta por ID
const actualizar = async (req, res) => {
  try {
    const { nombre, slug, descripcion, activo } = req.body;

    const tipoActualizado = await MotorcycleType.findByIdAndUpdate(
      req.params.id,
      { nombre, slug, descripcion, activo },
      { new: true }
    );

    res.status(200).json({
      mensaje: "Tipo de motocicleta actualizado exitosamente.",
      tipoMoto: tipoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar tipo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error al actualizar el tipo de motocicleta." });
  }
};

// Eliminar un tipo de motocicleta por ID
const eliminar = async (req, res) => {
  try {
    await MotorcycleType.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Tipo de motocicleta eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar tipo de motocicleta:", error);
    res.status(500).json({ mensaje: "Error en el servidor al eliminar el tipo de motocicleta." });
  }
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};
