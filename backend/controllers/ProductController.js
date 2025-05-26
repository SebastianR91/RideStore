const Producto = require("../models/ProductModel"); // Modelo de producto

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, imagen, precio, categoria } = req.body;

    // Verifica que el usuario esté autenticado (se obtiene desde el middleware del token)
    const usuarioId = req.usuario.id;

    // Crea una nueva instancia del producto
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      imagen,
      precio,
      categoria,
      usuarioId
    });

    // Guarda en la base de datos
    await nuevoProducto.save();

    res.status(201).json({
      mensaje: "Producto creado exitosamente.",
      producto: nuevoProducto
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al crear el producto." });
  }
};

// Obtener productos, con o sin filtro por categoría
const obtenerProductos = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) {
      filtro.categoria = req.query.categoria;
    }

    const productos = await Producto.find(filtro).populate("usuarioId", "nombre correo");
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error en el servidor al listar productos." });
  }
};

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Producto eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error en el servidor al eliminar el producto." });
  }
};

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, imagen, precio, categoria } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, imagen, categoria, precio },
      { new: true }
    );

    res.status(200).json({
      mensaje: "Producto actualizado exitosamente.",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar el producto." });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  actualizarProducto
};
