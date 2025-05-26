const express = require("express");
const router = express.Router();

// Importar los controladores de autenticación
const { registrarUsuario, loginUsuario } = require("../controllers/AuthController");

// Importar el middleware para proteger rutas
const verifyToken = require("../middleware/verifyToken");

// Ruta pública: registro de usuario
router.post("/register", registrarUsuario); // POST /api/auth/register

// Ruta pública: inicio de sesión
router.post("/login", loginUsuario); // POST /api/auth/login

// Ruta protegida: solo accesible con token válido
router.get("/view-user", verifyToken, (req, res) => {
  res.status(200).json({
    mensaje: "Acceso autorizado",
    usuarioId: req.usuarioId, // Este ID lo inserta el middleware si el token es válido
  });
});

module.exports = router;
