const mongoose = require("mongoose");
require("dotenv").config();

const MotorcycleType = require("./models/MotorcycleTypeModel");

const tiposMoto = [
  {
    nombre: "Naked",
    slug: "naked",
    descripcion: "Motocicletas urbanas sin carenado, ligeras y versatiles.",
    activo: true
  },
  {
    nombre: "Scooter",
    slug: "scooter",
    descripcion: "Motocicletas practicas para movilidad urbana diaria.",
    activo: true
  },
  {
    nombre: "Deportiva",
    slug: "deportiva",
    descripcion: "Motocicletas enfocadas en rendimiento, velocidad y manejo deportivo.",
    activo: true
  },
  {
    nombre: "Enduro",
    slug: "enduro",
    descripcion: "Motocicletas preparadas para caminos destapados y uso fuera de carretera.",
    activo: true
  },
  {
    nombre: "Adventure",
    slug: "adventure",
    descripcion: "Motocicletas de aventura para viajes, carretera y terrenos mixtos.",
    activo: true
  },
  {
    nombre: "Trabajo",
    slug: "trabajo",
    descripcion: "Motocicletas funcionales para uso diario, mensajeria y transporte.",
    activo: true
  },
  {
    nombre: "Touring",
    slug: "touring",
    descripcion: "Motocicletas para viajes largos con mayor comodidad y autonomia.",
    activo: true
  },
  {
    nombre: "Cruiser",
    slug: "cruiser",
    descripcion: "Motocicletas de manejo relajado, postura baja y estilo clasico.",
    activo: true
  }
];

const seedMotorcycleTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    for (const tipo of tiposMoto) {
      await MotorcycleType.findOneAndUpdate(
        { slug: tipo.slug },
        { $setOnInsert: tipo },
        { upsert: true, new: true }
      );
    }

    console.log("Tipos de moto sembrados correctamente.");
  } catch (error) {
    console.error("Error al sembrar tipos de moto:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexion MongoDB cerrada.");
  }
};

seedMotorcycleTypes();
