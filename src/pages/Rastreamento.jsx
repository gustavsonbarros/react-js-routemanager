import { useState, useEffect } from "react";
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
  const [entrega, setEntrega] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState([]);

  // Carrega lista de clientes ao iniciar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await api.get("/clientes");
        setClientes(res.data);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      }
    };
    fetchClientes();
  }, []);

  const buscarEntrega = async (e) => {
    e.preventDefault();

    if (!codigo) {
      setError("Digite um código de rastreio válido");
      return;
    }

    setLoading(true);
    setError("");
    setEntrega(null);
    setHistorico([]);

    try {
      // Verifica formato do código (ENT0001)
      if (!/^ENT\d{4}$/.test(codigo)) {
        throw new Error("Código inválido. Use o formato ENT0001");
      }

      // Busca entrega e histórico simultaneamente
      const [entregaRes, historicoRes] = await Promise.all([
        api.get(`/entregas/${codigo}`),
        api.get(`/entregas/${codigo}/historico`)
      ]);
      
      setEntrega(entregaRes.data);
      setHistorico(historicoRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erro ao buscar entrega");
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setCodigo("");
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
        <p>Informe o código de rastreio para consultar sua encomenda</p>
      </header>
      
      <form onSubmit={buscarEntrega} className="busca-form">
        <div className="filtro-group">
          <label htmlFor="codigo">Código de Rastreio</label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: ENT0001"
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-buscar"
            disabled={loading || !codigo}
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
            onClick={limparBusca}
            disabled={!codigo && !entrega}
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
      
      {loading && (
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
              <span>{clientes.find(c => c.id === entrega.clienteId)?.nome || entrega.clienteId}</span>
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
          
          <h3 className="historico-title">Histórico de Atualizações</h3>
          
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
                    <span className="timeline-date">
                      {new Date(item.data).toLocaleDateString()} - {new Date(item.data).toLocaleTimeString()}
                    </span>
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
          <p>Informe o código de rastreio no campo acima</p>
        </div>
      )}
    </div>
  );
}