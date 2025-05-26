const mongoose = require("mongoose"); // Importa mongoose para definir el esquema

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // El nombre es obligatorio
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
  fechaRegistro: {
    type: Date,
    default: Date.now, // Se asigna automáticamente la fecha actual
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema); // Exporta el modelo para usarlo en controladores
