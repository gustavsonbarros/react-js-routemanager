import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiCalendar, 
  FiTruck, 
  FiUser, 
  FiPackage, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSearch,
  FiMapPin 
} from 'react-icons/fi';
import './Entregas.css';

const api = axios.create({ 
  baseURL: "http://localhost:3001",
  headers: {
    'Content-Type': 'application/json'
  }
});


export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    encomendaId: "",
    rotaId: "",
    dataEstimada: "",
    status: "em_preparo"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchEntregas();
    fetchClientes();
    fetchEncomendas();
    fetchRotas();
  }, []);

  const fetchEntregas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/entregas");
      setEntregas(res.data);
    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  const fetchEncomendas = async () => {
    try {
      const res = await api.get("/encomendas");
      setEncomendas(res.data);
    } catch (err) {
      console.error("Erro ao carregar encomendas:", err);
    }
  };

  const fetchRotas = async () => {
    try {
      const res = await api.get("/rotas");
      setRotas(res.data);
    } catch (err) {
      console.error("Erro ao carregar rotas:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.clienteId) newErrors.clienteId = "Cliente é obrigatório";
    if (!form.encomendaId) newErrors.encomendaId = "Encomenda é obrigatória";
    if (!form.rotaId) newErrors.rotaId = "Rota é obrigatória";
    if (!form.dataEstimada) newErrors.dataEstimada = "Data estimada é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        clienteId: form.clienteId,
        encomendaId: form.encomendaId,
        rotaId: form.rotaId,
        dataEstimada: form.dataEstimada,
        status: form.status
      };

      console.log('Enviando dados:', payload); // Para debug

      if (editingId) {
        await api.put(`/entregas/${editingId}`, payload);
      } else {
        await api.post("/entregas", payload);
      }
      resetForm();
      await fetchEntregas();
    } catch (err) {
      console.error("Erro ao salvar entrega:", err);
      console.error("Detalhes do erro:", err.response?.data); // Mostra mais detalhes do erro
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entrega) => {
    setForm({
      clienteId: entrega.clienteId,
      encomendaId: entrega.encomendaId,
      rotaId: entrega.rotaId,
      dataEstimada: entrega.dataEstimada.split('T')[0],
      status: entrega.status || "em_preparo"
    });
    setEditingId(entrega.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta entrega?")) {
      try {
        await api.delete(`/entregas/${id}`);
        await fetchEntregas();
      } catch (err) {
        console.error("Erro ao excluir entrega:", err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      clienteId: "",
      encomendaId: "",
      rotaId: "",
      dataEstimada: "",
      status: "em_preparo"
    });
    setEditingId(null);
  };

  const filteredEntregas = entregas.filter(entrega => {
    const matchesSearch = 
      entrega.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientes.find(c => c.id === entrega.clienteId)?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || entrega.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : "Cliente não encontrado";
  };

  const getEncomendaDesc = (encomendaId) => {
    const encomenda = encomendas.find(e => e.id === encomendaId);
    return encomenda ? `${encomenda.tipo} - ${encomenda.descricao.substring(0, 20)}...` : "Encomenda não encontrada";
  };

  const getRotaInfo = (rotaId) => {
    const rota = rotas.find(r => r.id === rotaId);
    return rota ? `${rota.origem} → ${rota.destino}` : "Rota não encontrada";
  };

  return (
    <div className="entregas-container">
      <h1>Gerenciar Entregas</h1>
      
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Editar Entrega' : 'Agendar Nova Entrega'}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Cliente*</label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              className={errors.clienteId ? 'input-error' : ''}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.cpfOuCnpj}
                </option>
              ))}
            </select>
            {errors.clienteId && <span className="error">{errors.clienteId}</span>}
          </div>
          
          <div className="form-group">
            <label>Encomenda*</label>
            <select
              name="encomendaId"
              value={form.encomendaId}
              onChange={handleChange}
              className={errors.encomendaId ? 'input-error' : ''}
            >
              <option value="">Selecione uma encomenda</option>
              {encomendas.map(encomenda => (
                <option key={encomenda.id} value={encomenda.id}>
                  {encomenda.tipo} - {encomenda.descricao.substring(0, 30)}...
                </option>
              ))}
            </select>
            {errors.encomendaId && <span className="error">{errors.encomendaId}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Rota*</label>
            <select
              name="rotaId"
              value={form.rotaId}
              onChange={handleChange}
              className={errors.rotaId ? 'input-error' : ''}
            >
              <option value="">Selecione uma rota</option>
              {rotas.map(rota => (
                <option key={rota.id} value={rota.id}>
                  {rota.origem} → {rota.destino} ({rota.distancia}km)
                </option>
              ))}
            </select>
            {errors.rotaId && <span className="error">{errors.rotaId}</span>}
          </div>
          
          <div className="form-group">
            <label>Data Estimada*</label>
            <input
              name="dataEstimada"
              type="date"
              value={form.dataEstimada}
              onChange={handleChange}
              className={errors.dataEstimada ? 'input-error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dataEstimada && <span className="error">{errors.dataEstimada}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="em_preparo">Em Preparo</option>
            <option value="a_caminho">A Caminho</option>
            <option value="entregue">Entregue</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Entrega' : 'Agendar Entrega'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              <FiX /> Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div className="entregas-list">
        <div className="list-header">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Filtrar por código ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">Todos os status</option>
            <option value="em_preparo">Em Preparo</option>
            <option value="a_caminho">A Caminho</option>
            <option value="entregue">Entregue</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Encomenda</th>
                <th>Rota</th>
                <th>Data Estimada</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredEntregas.length === 0 ? (
                <tr>
                  <td colSpan="7">Carregando entregas...</td>
                </tr>
              ) : filteredEntregas.length > 0 ? (
                filteredEntregas.map(entrega => (
                  <tr key={entrega.id}>
                    <td>{entrega.id}</td>
                    <td>
                      <div className="client-info">
                        <FiUser /> {getClienteNome(entrega.clienteId)}
                      </div>
                    </td>
                    <td>
                      <div className="package-info">
                        <FiPackage /> {getEncomendaDesc(entrega.encomendaId)}
                      </div>
                    </td>
                    <td>
                      <div className="route-info">
                        <FiMapPin /> {getRotaInfo(entrega.rotaId)}
                      </div>
                    </td>
                    <td>{new Date(entrega.dataEstimada).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${entrega.status}`}>
                        {entrega.status === 'em_preparo' && 'Em Preparo'}
                        {entrega.status === 'a_caminho' && 'A Caminho'}
                        {entrega.status === 'entregue' && 'Entregue'}
                        {entrega.status === 'cancelada' && 'Cancelada'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(entrega)} className="btn-icon edit">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(entrega.id)} className="btn-icon delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Nenhuma entrega encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}