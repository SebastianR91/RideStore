const ProductCategory = require("../models/ProductCategoryModel");

// Crear una nueva categoria de producto
const crear = async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, activo } = req.body;

    const nuevaCategoria = new ProductCategory({
      nombre,
      slug,
      descripcion,
      icono,
      activo
    });

    await nuevaCategoria.save();

    res.status(201).json({
      mensaje: "Categoria de producto creada exitosamente.",
      categoriaProducto: nuevaCategoria
    });
  } catch (error) {
    console.error("Error al crear categoria de producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear la categoria de producto." });
  }
};

// Obtener todas las categorias de producto
const obtenerTodos = async (req, res) => {
  try {
    const categoriasProducto = await ProductCategory.find();
    res.status(200).json(categoriasProducto);
  } catch (error) {
    console.error("Error al obtener categorias de producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar categorias de producto." });
  }
};

// Obtener una categoria de producto por ID
const obtenerPorId = async (req, res) => {
  try {
    const categoriaProducto = await ProductCategory.findById(req.params.id);
    res.status(200).json(categoriaProducto);
  } catch (error) {
    console.error("Error al obtener categoria de producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al obtener la categoria de producto." });
  }
};

// Actualizar una categoria de producto por ID
const actualizar = async (req, res) => {
  try {
    const { nombre, slug, descripcion, icono, activo } = req.body;

    const categoriaActualizada = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      { nombre, slug, descripcion, icono, activo },
      { new: true }
    );

    res.status(200).json({
      mensaje: "Categoria de producto actualizada exitosamente.",
      categoriaProducto: categoriaActualizada
    });
  } catch (error) {
    console.error("Error al actualizar categoria de producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar la categoria de producto." });
  }
};

// Eliminar una categoria de producto por ID
const eliminar = async (req, res) => {
  try {
    await ProductCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Categoria de producto eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar categoria de producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al eliminar la categoria de producto." });
  }
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};
