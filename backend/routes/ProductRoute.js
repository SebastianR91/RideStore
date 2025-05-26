const express = require("express");
const router = express.Router();

// Importar controladores
const { crearProducto, obtenerProductos, eliminarProducto, actualizarProducto } = require("../controllers/ProductController");

// Importar middleware para proteger ciertas rutas
const verifyToken = require("../middleware/verifyToken");

// Ruta protegida para crear un producto (requiere token JWT)
router.post("/", verifyToken, crearProducto); // POST /api/productos

// Ruta pública para obtener todos los productos
router.get("/", obtenerProductos); // GET /api/products

router.delete("/:id", verifyToken, eliminarProducto); // DELETE /api/productos/:id
router.put("/:id", verifyToken, actualizarProducto);

router.put("/:id", verifyToken, actualizarProducto);

module.exports = router;
