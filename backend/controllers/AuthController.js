const Usuario = require("../models/UserModel"); // Modelo de Usuario
const bcrypt = require("bcryptjs"); // Encriptación de contraseñas
const jwt = require("jsonwebtoken"); // Generación de tokens

//--------------------------
// Registrar nuevo usuario
//--------------------------
const registrarUsuario = async (req, res) => {
  const {
    nombre,
    apellidos,
    fechaNacimiento,
    telefono,
    ciudad,
    correo,
    contrasena,
  } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    const totalUsuarios = await Usuario.countDocuments();
    const rolAsignado = totalUsuarios < 2 ? "admin" : "cliente";

    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      fechaNacimiento,
      telefono,
      ciudad,
      correo,
      contrasena: contrasenaHash,
      rol: rolAsignado,
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado con éxito.",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellidos: nuevoUsuario.apellidos,
        correo: nuevoUsuario.correo,
        telefono: nuevoUsuario.telefono,
        ciudad: nuevoUsuario.ciudad,
        rol: nuevoUsuario.rol,
      },
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
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo no registrado." });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        ciudad: usuario.ciudad,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión." });
  }
};

module.exports = { registrarUsuario, loginUsuario };
