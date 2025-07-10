import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiClock, FiSearch, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import './Rotas.css';

const api = axios.create({ baseURL: "http://localhost:3001" });

export default function Rotas() {
  const [rotas, setRotas] = useState([]);
  const [centros, setCentros] = useState([]);
  const [form, setForm] = useState({
    origem: "",
    destino: "",
    centrosIntermediarios: [],
    distancia: "",
    tempoEstimado: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Buscar rotas e centros ao carregar
  useEffect(() => {
    fetchRotas();
    fetchCentros();
  }, []);

  const fetchRotas = async () => {
    try {
      const res = await api.get("/rotas");
      setRotas(res.data);
    } catch (err) {
      console.error("Erro ao carregar rotas:", err);
    }
  };

  const fetchCentros = async () => {
    try {
      const res = await api.get("/centros");
      setCentros(res.data);
    } catch (err) {
      console.error("Erro ao carregar centros:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validações aqui...
    try {
      await api.post("/rotas", form);
      fetchRotas();
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar rota:", err);
    }
  };

  return (
    <div className="rotas-container">
      <h1>Gerenciar Rotas de Entrega</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário (origem, destino, etc.) */}
      </form>
      <div className="rotas-list">
        {/* Tabela de rotas com filtros */}
      </div>
    </div>
  );
}