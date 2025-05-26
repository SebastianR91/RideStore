const Usuario = require("../models/UserModel"); // Importa el modelo de usuario definido con Mongoose para interactuar con la colección "usuarios" en la base de datos.
const bcrypt = require("bcryptjs"); // Encriptación de contraseñas
const jwt = require("jsonwebtoken"); // Generación de tokens JWT

//--------------------------
// Registrar nuevo usuario
//--------------------------
const registrarUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Crear y guardar nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contrasena: contrasenaHash,
    });

    await nuevoUsuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Respuesta exitosa
    res.status(201).json({
      mensaje: "Usuario registrado con éxito.",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario." });
  }
};

//--------------------------
// Login del usuario
//--------------------------
const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo no registrado." });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta." });
    }

    // Generar nuevo token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Respuesta exitosa
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión." });
  }
};

module.exports = { registrarUsuario, loginUsuario };
