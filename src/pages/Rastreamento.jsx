import { useState } from "react";
import { Truck, Search, AlertCircle, Clock, CheckCircle, MapPin } from "react-feather";
import "./Rastreamento.css";

// Status possíveis para tradução e estilização
const STATUS_MAP = {
  em_preparo: { text: "Em Preparo", color: "var(--warning)", icon: <Clock size={18} /> },
  a_caminho: { text: "A Caminho", color: "var(--info)", icon: <Truck size={18} /> },
  entregue: { text: "Entregue", color: "var(--success)", icon: <CheckCircle size={18} /> },
  cancelado: { text: "Cancelado", color: "var(--danger)", icon: <AlertCircle size={18} /> },
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
    
    // Validação básica - pelo menos um filtro deve ser preenchido
    if (!codigo && !cliente && !statusFilter) {
      setError("Preencha pelo menos um filtro para buscar");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Simulação de chamada à API
      // const params = new URLSearchParams();
      // if (codigo) params.append('codigo', codigo);
      // if (cliente) params.append('cliente', cliente);
      // if (statusFilter) params.append('status', statusFilter);
      // 
      // const response = await fetch(`/api/entregas?${params.toString()}`);
      // const data = await response.json();
      
      // Simulação de dados - remover quando integrar com API real
      await new Promise(resolve => setTimeout(resolve, 800)); // Delay para simular carregamento
      
      if (codigo === "INVALIDO") {
        throw new Error("Código de rastreamento inválido");
      }
      
      // Dados mockados para demonstração
      const mockData = {
        id: codigo || "TRK" + Math.floor(Math.random() * 10000),
        status: statusFilter || ["em_preparo", "a_caminho", "entregue", "cancelado"][Math.floor(Math.random() * 4)],
        cliente: cliente || "Cliente " + ["Silva", "Santos", "Oliveira", "Pereira"][Math.floor(Math.random() * 4)],
        encomenda: "Encomenda " + Math.floor(Math.random() * 100),
        endereco: "Rua " + ["A", "B", "C"][Math.floor(Math.random() * 3)] + ", " + Math.floor(Math.random() * 1000),
        dataPrevista: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      };
      
      const mockHistorico = [
        { 
          data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), 
          status: "em_preparo",
          local: "Centro de Distribuição SP",
          detalhes: "Encomenda recebida e em processo de preparo"
        },
        { 
          data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), 
          status: "a_caminho",
          local: "Em trânsito",
          detalhes: "Saiu para entrega"
        }
      ];
      
      if (mockData.status === "entregue" || mockData.status === "cancelado") {
        mockHistorico.push({
          data: new Date().toLocaleString(),
          status: mockData.status,
          local: mockData.endereco.split(",")[0],
          detalhes: mockData.status === "entregue" 
            ? "Encomenda entregue com sucesso" 
            : "Encomenda cancelada a pedido do cliente"
        });
      }
      
      setEntrega(mockData);
      setHistorico(mockHistorico);
    } catch (err) {
      setError(err.message || "Erro ao buscar entrega. Tente novamente.");
      setEntrega(null);
      setHistorico([]);
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
              placeholder="Ex: TRK12345"
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
              <option value="cancelado">Cancelado</option>
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
              <span>{entrega.cliente}</span>
            </div>
            
            <div className="detalhe-item">
              <strong>Encomenda:</strong>
              <span>{entrega.encomenda}</span>
            </div>
            
            <div className="detalhe-item">
              <strong>Endereço:</strong>
              <span>
                <MapPin size={14} />
                {entrega.endereco}
              </span>
            </div>
            
            <div className="detalhe-item">
              <strong>Previsão de Entrega:</strong>
              <span>{entrega.dataPrevista}</span>
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