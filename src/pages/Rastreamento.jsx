import { useState } from "react";
import { Truck, Search, AlertCircle, Clock, CheckCircle, MapPin } from "react-feather";
import axios from "axios";
import "./Rastreamento.css";

const api = axios.create({ baseURL: "http://localhost:3001" });

const STATUS_MAP = {
  em_preparo: { text: "Em Preparo", color: "var(--warning)", icon: <Clock size={18} /> },
  a_caminho: { text: "A Caminho", color: "var(--info)", icon: <Truck size={18} /> },
  entregue: { text: "Entregue", color: "var(--success)", icon: <CheckCircle size={18} /> },
  cancelada: { text: "Cancelada", color: "var(--danger)", icon: <AlertCircle size={18} /> },
};

export default function Rastreamento() {
  const [codigo, setCodigo] = useState("");
  const [cliente, setCliente] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [entrega, setEntrega] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarEntrega = async (e) => {
  e.preventDefault();
  
  if (!codigo && !cliente && !statusFilter) {
    setError("Preencha pelo menos um filtro para buscar");
    return;
  }
  
  setLoading(true);
  setError("");
  setEntrega(null);
  setHistorico([]);
  
  try {
    if (codigo) {
      // Verifica se o código tem formato válido
      if (!/^ENT\d{4}$/.test(codigo)) {
        throw new Error("Código inválido. Use o formato ENT0001");
      }

      const [entregaRes, historicoRes] = await Promise.all([
        api.get(`/entregas/${codigo}`),
        api.get(`/entregas/${codigo}/historico`)
      ]);
      
      setEntrega(entregaRes.data);
      setHistorico(historicoRes.data);
    } else {
      const params = {};
      if (cliente) params.cliente = cliente;
      if (statusFilter) params.status = statusFilter;
      
      const res = await api.get("/entregas", { params });
      if (res.data.length > 0) {
        const primeiraEntrega = res.data[0];
        const [entregaDetalhes, historico] = await Promise.all([
          api.get(`/entregas/${primeiraEntrega.id}`),
          api.get(`/entregas/${primeiraEntrega.id}/historico`)
        ]);
        
        setEntrega(entregaDetalhes.data);
        setHistorico(historico.data);
      } else {
        setError("Nenhuma entrega encontrada com os filtros aplicados");
      }
    }
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Erro ao buscar entrega. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  const limparFiltros = () => {
    setCodigo("");
    setCliente("");
    setStatusFilter("");
    setEntrega(null);
    setHistorico([]);
    setError("");
  };

  return (
    <div className="rastreamento-container">
      <header className="rastreamento-header">
        <h1>
          <Truck size={28} className="icon-title" />
          Rastreamento de Entregas
        </h1>
        <p>Consulte o status atual e histórico das suas encomendas</p>
      </header>
      
      <form onSubmit={buscarEntrega} className="busca-form">
        <div className="filtros-grid">
          <div className="filtro-group">
            <label htmlFor="codigo">Código de Rastreio</label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: ENT0001"
            />
          </div>
          
          <div className="filtro-group">
            <label htmlFor="cliente">Nome do Cliente</label>
            <input
              id="cliente"
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Digite o nome do cliente"
            />
          </div>
          
          <div className="filtro-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="em_preparo">Em Preparo</option>
              <option value="a_caminho">A Caminho</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-buscar"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <Search size={16} />
                Buscar
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="btn-limpar"
            onClick={limparFiltros}
          >
            Limpar
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      
      {loading && !error && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Buscando informações da entrega...</p>
          </div>
        </div>
      )}
      
      {entrega && (
        <div className="entrega-info">
          <div className="entrega-header">
            <h2>Informações da Entrega</h2>
            <div 
              className="status-badge"
              style={{ backgroundColor: STATUS_MAP[entrega.status]?.color }}
            >
              {STATUS_MAP[entrega.status]?.icon}
              {STATUS_MAP[entrega.status]?.text || entrega.status}
            </div>
          </div>
          
          <div className="entrega-detalhes-grid">
            <div className="detalhe-item">
              <strong>Código:</strong>
              <span>{entrega.id}</span>
            </div>
            
            <div className="detalhe-item">
              <strong>Cliente:</strong>
              <span>{entrega.clienteId}</span>
            </div>
            
            <div className="detalhe-item">
              <strong>Encomenda:</strong>
              <span>{entrega.encomendaId}</span>
            </div>
            
            <div className="detalhe-item">
              <strong>Endereço:</strong>
              <span>
                <MapPin size={14} />
                {entrega.endereco || "Endereço não disponível"}
              </span>
            </div>
            
            <div className="detalhe-item">
              <strong>Previsão de Entrega:</strong>
              <span>{entrega.dataEstimada ? new Date(entrega.dataEstimada).toLocaleDateString() : "Não definida"}</span>
            </div>
          </div>
          
          <h3 className="historico-title">
            Histórico de Atualizações
          </h3>
          
          <div className="historico-timeline">
            {historico.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div 
                    className="marker-dot" 
                    style={{ backgroundColor: STATUS_MAP[item.status]?.color }}
                  ></div>
                  {index !== historico.length - 1 && <div className="timeline-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-date">{item.data}</span>
                    <span 
                      className="timeline-status"
                      style={{ color: STATUS_MAP[item.status]?.color }}
                    >
                      {STATUS_MAP[item.status]?.text || item.status}
                    </span>
                  </div>
                  
                  <div className="timeline-local">
                    <MapPin size={14} />
                    {item.local}
                  </div>
                  
                  {item.detalhes && (
                    <p className="timeline-detalhes">{item.detalhes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>  
        </div>
      )}
      
      {!entrega && !loading && !error && (
        <div className="empty-state">
          <img src="/icons/package-search.svg" alt="Nenhuma busca realizada" />
          <h3>Nenhuma entrega consultada</h3>
          <p>Preencha os filtros acima para rastrear uma encomenda</p>
        </div>
      )}
    </div>
  );
}