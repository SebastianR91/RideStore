// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import MainLayout from "./layouts/MainLayout";
import Categorias from "./pages/Categorias";
import Nosotros from "./pages/Nosotros";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import Productos from "./pages/Productos";
import Modelos from "./pages/Modelos";
import CatalogoCategorias from "./pages/CatalogoCategorias";
import MisPedidos from "./pages/MisPedidos";
import PedidosAdmin from "./pages/PedidosAdmin";
import Marketing from "./pages/Marketing";
import Cartera from "./pages/Cartera";
import Informes from "./pages/Informes";
import Herramientas from "./pages/Herramientas";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout con navbar/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} /> 
          <Route path="/marcas" element={<Categorias />} />
          <Route path="/nosotros" element={<Nosotros />} /> 
          <Route path="/carrito" element={<Carrito />} /> 
          <Route path="/catalogo" element={<Catalogo />} /> 
          <Route path="/productos" element={<Productos />} /> 
          <Route path="/modelos" element={<Modelos />} />
          <Route path="/catalogo-categorias" element={<CatalogoCategorias />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/pedidos-admin" element={<PedidosAdmin />} />
          <Route path="/ventas-pedidos" element={<PedidosAdmin />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/cartera" element={<Cartera />} />
          <Route path="/informes" element={<Informes />} />
          <Route path="/herramientas" element={<Herramientas />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Página sin layout (login/register) */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
