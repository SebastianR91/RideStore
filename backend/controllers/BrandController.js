const Brand = require("../models/BrandModel");

// Crear una nueva marca
const crear = async (req, res) => {
  try {
    const { nombre, slug, logo, activo } = req.body;

    const nuevaMarca = new Brand({
      nombre,
      slug,
      logo,
      activo
    });

    await nuevaMarca.save();

    res.status(201).json({
      mensaje: "Marca creada exitosamente.",
      marca: nuevaMarca
    });
  } catch (error) {
    console.error("Error al crear marca:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear la marca." });
  }
};

// Obtener todas las marcas
const obtenerTodos = async (req, res) => {
  try {
    const marcas = await Brand.find();
    res.status(200).json(marcas);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar marcas." });
  }
};

// Obtener una marca por ID
const obtenerPorId = async (req, res) => {
  try {
    const marca = await Brand.findById(req.params.id);
    res.status(200).json(marca);
  } catch (error) {
    console.error("Error al obtener marca:", error);
    res.status(500).json({ mensaje: "Error en el servidor al obtener la marca." });
  }
};

// Actualizar una marca por ID
const actualizar = async (req, res) => {
  try {
    const { nombre, slug, logo, activo } = req.body;

    const marcaActualizada = await Brand.findByIdAndUpdate(
      req.params.id,
      { nombre, slug, logo, activo },
      { new: true }
    );

    res.status(200).json({
      mensaje: "Marca actualizada exitosamente.",
      marca: marcaActualizada
    });
  } catch (error) {
    console.error("Error al actualizar marca:", error);
    res.status(500).json({ mensaje: "Error al actualizar la marca." });
  }
};

// Eliminar una marca por ID
const eliminar = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Marca eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    res.status(500).json({ mensaje: "Error en el servidor al eliminar la marca." });
  }
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};
