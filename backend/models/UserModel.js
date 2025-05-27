const mongoose = require("mongoose"); // Importa mongoose para definir el esquema

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // El nombre es obligatorio
  },
  apellidos: {
    type: String,
    required: true, // Los apellidos también son obligatorios
  },
  fechaNacimiento: {
    type: Date,
    required: true, // Se requiere para el perfil
  },
  telefono: {
    type: String,
    required: false, // Puede ser opcional
  },
  ciudad: {
    type: String,
    required: false, // Puede ser opcional
  },
  correo: {
    type: String,
    required: true,
    unique: true, // No se pueden repetir correos
  },
  contrasena: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "cliente"], // Solo se permiten estos dos valores
    default: "cliente",         // Todos los nuevos usuarios serán clientes por defecto
  },
  fechaRegistro: {
    type: Date,
    default: Date.now, // Se asigna automáticamente la fecha actual
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema); // Exporta el modelo para usarlo en controladores
