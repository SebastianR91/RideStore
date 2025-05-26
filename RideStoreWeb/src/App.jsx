// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Categorias from "./pages/Categorias";
import Nosotros from "./pages/Nosotros";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import Productos from "./pages/Productos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout con navbar/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categorias" element={<Categorias />} /> 
          <Route path="/nosotros" element={<Nosotros />} /> 
          <Route path="/carrito" element={<Carrito />} /> 
          <Route path="/catalogo" element={<Catalogo />} /> 
          <Route path="/productos" element={<Productos />} /> 
        </Route>

        {/* Página sin layout (login/register) */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
