// 📁 middleware/verifyToken.js

const jwt = require("jsonwebtoken"); // Importa JWT para verificar el token

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Lee el header Authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1]; // Extrae el token después de 'Bearer'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token con la clave secreta

    req.usuario = {
      id: decoded.id,
      rol: decoded.rol, // ✅ Incluye el rol del usuario para control posterior
    };

    next(); // Continúa a la siguiente función o controlador
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;
