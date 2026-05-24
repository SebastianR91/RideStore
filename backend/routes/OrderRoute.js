const express = require("express");
const router = express.Router();

const {
  crearOrdenSimulada,
  obtenerMisPedidos,
  obtenerTodasLasOrdenesAdmin,
  actualizarEstadoPedido
} = require("../controllers/OrderController");

const verifyToken = require("../middleware/verifyToken");

router.post("/simular-pago", verifyToken, crearOrdenSimulada);
router.get("/mis-pedidos", verifyToken, obtenerMisPedidos);
router.get("/admin", verifyToken, obtenerTodasLasOrdenesAdmin);
router.put("/:id/estado", verifyToken, actualizarEstadoPedido);

module.exports = router;
