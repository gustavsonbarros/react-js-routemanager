import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiTruck, FiUser, FiPackage } from 'react-icons/fi';
import './Entregas.css';

const api = axios.create({ baseURL: "http://localhost:3001" });

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    encomendaId: "",
    rotaId: "",
    dataEstimada: ""
  });

  // Buscar dados necessários
  useEffect(() => {
    fetchEntregas();
    fetchClientes();
    fetchEncomendas();
    fetchRotas();
  }, []);

  const fetchEntregas = async () => {
    try {
      const res = await api.get("/entregas");
      setEntregas(res.data);
    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validações aqui...
    try {
      await api.post("/entregas", form);
      fetchEntregas();
    } catch (err) {
      console.error("Erro ao criar entrega:", err);
    }
  };

  return (
    <div className="entregas-container">
      <h1>Gerenciar Entregas</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário (cliente, encomenda, rota, data) */}
      </form>
      <div className="entregas-list">
        {/* Tabela de entregas com filtros */}
      </div>
    </div>
  );
}