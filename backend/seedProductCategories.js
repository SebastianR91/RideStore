const mongoose = require("mongoose");
require("dotenv").config();

const ProductCategory = require("./models/ProductCategoryModel");

const categoriasProducto = [
  {
    nombre: "Frenos",
    slug: "frenos",
    descripcion: "Pastillas, discos, guayas y sistema de frenado",
    activo: true
  },
  {
    nombre: "Motor",
    slug: "motor",
    descripcion: "Repuestos internos y componentes del motor",
    activo: true
  },
  {
    nombre: "Llantas",
    slug: "llantas",
    descripcion: "Neumáticos, rines y accesorios",
    activo: true
  },
  {
    nombre: "Suspensión",
    slug: "suspension",
    descripcion: "Amortiguadores y sistema de suspensión",
    activo: true
  },
  {
    nombre: "Eléctrico",
    slug: "electrico",
    descripcion: "Sistema eléctrico, cableado y sensores",
    activo: true
  },
  {
    nombre: "Transmisión",
    slug: "transmision",
    descripcion: "Cadenas, kit de arrastre y transmisión",
    activo: true
  },
  {
    nombre: "Accesorios",
    slug: "accesorios",
    descripcion: "Accesorios generales para motocicleta",
    activo: true
  },
  {
    nombre: "Lubricantes",
    slug: "lubricantes",
    descripcion: "Aceites, grasas y fluidos",
    activo: true
  },
  {
    nombre: "Escape",
    slug: "escape",
    descripcion: "Sistema de escape y accesorios",
    activo: true
  },
  {
    nombre: "Iluminación",
    slug: "iluminacion",
    descripcion: "Farolas, stop, direccionales y luces",
    activo: true
  },
  {
    nombre: "Baterías",
    slug: "baterias",
    descripcion: "Baterías y componentes eléctricos relacionados",
    activo: true
  },
  {
    nombre: "Filtros",
    slug: "filtros",
    descripcion: "Filtros de aceite, aire y combustible",
    activo: true
  },
  {
    nombre: "Carrocería",
    slug: "carroceria",
    descripcion: "Tapas, carenados y partes externas",
    activo: true
  }
];

const seedProductCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    for (const categoria of categoriasProducto) {
      await ProductCategory.findOneAndUpdate(
        { slug: categoria.slug },
        { $setOnInsert: categoria },
        { upsert: true, new: true }
      );
    }

    console.log("Categorias de repuestos sembradas correctamente.");
  } catch (error) {
    console.error("Error al sembrar categorias de repuestos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexion MongoDB cerrada.");
  }
};

seedProductCategories();
