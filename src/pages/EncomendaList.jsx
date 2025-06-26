import { useState } from "react";
import "./EncomendaList.css";

export function EncomendaList({ encomendas = [] }) {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [pesoMin, setPesoMin] = useState("");
  const [pesoMax, setPesoMax] = useState("");

  const limparFiltros = () => {
    setFiltroTipo("");
    setPesoMin("");
    setPesoMax("");
  };

  const filtrar = () => {
    return encomendas.filter((encomenda) => {
      const tipoOK = filtroTipo ? encomenda.tipo === filtroTipo : true;
      const peso = parseFloat(encomenda.peso);
      const pesoOK =
        (!pesoMin || peso >= parseFloat(pesoMin)) &&
        (!pesoMax || peso <= parseFloat(pesoMax));
      return tipoOK && pesoOK;
    });
  };

  const encomendasFiltradas = filtrar();

  return (
    <div className="encomenda-list-container">
      <h2>Lista de Encomendas</h2>
      
      <div className="filtros-container">
        <h3>Filtrar Encomendas</h3>
        <div className="filtros-grid">
          <div className="filtro-item">
            <label htmlFor="pesoMin">Peso Mínimo (kg)</label>
            <input
              id="pesoMin"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ex: 0.5"
              value={pesoMin}
              onChange={(e) => setPesoMin(e.target.value)}
            />
          </div>
          
          <div className="filtro-item">
            <label htmlFor="pesoMax">Peso Máximo (kg)</label>
            <input
              id="pesoMax"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ex: 5.0"
              value={pesoMax}
              onChange={(e) => setPesoMax(e.target.value)}
            />
          </div>
          
          <div className="filtro-item">
            <label htmlFor="tipoEncomenda">Tipo de Encomenda</label>
            <select 
              id="tipoEncomenda"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos os Tipos</option>
              <option value="documento">Documento</option>
              <option value="caixa">Caixa</option>
              <option value="palete">Palete</option>
            </select>
          </div>
        </div>
      </div>

      <div className="resultados-container">
        <div className="resultados-header">
          <h3>Resultados ({encomendasFiltradas.length})</h3>
          <button className="btn-limpar" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        </div>
        
        {encomendasFiltradas.length > 0 ? (
          <ul className="encomendas-list">
            {encomendasFiltradas.map((e, i) => (
              <li key={i} className="encomenda-item">
                <div className="encomenda-tipo">{e.tipo}</div>
                <div className="encomenda-peso">{e.peso} kg</div>
                <div className="encomenda-endereco">
                  {e.enderecoEntrega || e.endereco || "Endereço não informado"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="nenhum-resultado">
            <img src="/icons/empty-box.svg" alt="Nenhum resultado" />
            <p>Nenhuma encomenda encontrada com os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
}