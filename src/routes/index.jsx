import { BrowserRouter, Routes, Route } from "react-router-dom";
import Clientes from "../pages/Clientes";
import Encomendas from "../pages/Encomendas";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/encomendas" element={<Encomendas />} />
      </Routes>
    </BrowserRouter>
  );
}