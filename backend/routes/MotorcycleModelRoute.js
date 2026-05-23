const express = require("express");
const router = express.Router();

// Importar controladores
const { crear, obtenerTodos, obtenerPorId, actualizar, eliminar } = require("../controllers/MotorcycleModelController");

// Importar middleware para proteger ciertas rutas
const verifyToken = require("../middleware/verifyToken");

// Rutas publicas
router.get("/", obtenerTodos);
router.get("/:id", obtenerPorId);

// Rutas protegidas
router.post("/", verifyToken, crear);
router.put("/:id", verifyToken, actualizar);
router.delete("/:id", verifyToken, eliminar);

module.exports = router;
