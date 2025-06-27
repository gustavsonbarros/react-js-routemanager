import { useState, useEffect, useMemo } from 'react';
import { FiPackage, FiEdit2, FiTrash2, FiX, FiSearch, FiChevronUp, FiChevronDown, FiDownload, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import './Encomendas.css';

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
});

export default function Encomendas() {
  // Estados
  const [encomendas, setEncomendas] = useState([]);
  const [form, setForm] = useState({
    peso: "",
    tipo: "documento",
    descricao: "",
    endereco: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroPesoMin, setFiltroPesoMin] = useState("");
  const [filtroPesoMax, setFiltroPesoMax] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'dataCadastro', direction: 'desc' });
  const [encomendaToDelete, setEncomendaToDelete] = useState(null);
  const encomendasPerPage = 8;

  // Tipos de encomenda disponíveis
  const tiposEncomenda = [
    { value: "documento", label: "Documento" },
    { value: "caixa", label: "Caixa" },
    { value: "palete", label: "Palete" }
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.peso || isNaN(form.peso) || parseFloat(form.peso) <= 0) {
      newErrors.peso = "Peso deve ser um número positivo";
    }
    if (!form.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }
    if (!form.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (encomenda) => {
    setForm({
      peso: encomenda.peso,
      tipo: encomenda.tipo,
      descricao: encomenda.descricao,
      endereco: encomenda.endereco
    });
    setEditingId(encomenda.id);
  };

  const fetchEncomendas = async () => {
  try {
    setIsLoading(true);
    setConnectionError(false);
    const res = await api.get("/encomendas");
    if (!res.data) throw new Error("Dados não recebidos");
    setEncomendas(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Erro ao carregar encomendas:", err);
    setConnectionError(true);
    setEncomendas([]);
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        await api.put(`/encomendas/${editingId}`, form);
      } else {
        await api.post("/encomendas", form);
      }
      resetForm();
      await fetchEncomendas();
    } catch (err) {
      console.error("Erro ao salvar encomenda:", err);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => setEncomendaToDelete(id);
  const cancelDelete = () => setEncomendaToDelete(null);

  const confirmDelete = async () => {
    if (!encomendaToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/encomendas/${encomendaToDelete}`);
      await fetchEncomendas();
    } catch (err) {
      console.error("Erro ao excluir encomenda:", err);
    } finally {
      setIsLoading(false);
      setEncomendaToDelete(null);
    }
  };

  const resetForm = () => {
    setForm({ peso: "", tipo: "documento", descricao: "", endereco: "" });
    setEditingId(null);
  };

  // Filtros e ordenação
  const filteredEncomendas = useMemo(() => {
    let result = [...encomendas];
    
    // Filtro por tipo
    if (filtroTipo !== "todos") {
      result = result.filter(e => e.tipo === filtroTipo);
    }
    
    // Filtro por peso mínimo
    if (filtroPesoMin && !isNaN(filtroPesoMin)) {
      result = result.filter(e => parseFloat(e.peso) >= parseFloat(filtroPesoMin));
    }
    
    // Filtro por peso máximo
    if (filtroPesoMax && !isNaN(filtroPesoMax)) {
      result = result.filter(e => parseFloat(e.peso) <= parseFloat(filtroPesoMax));
    }
    
    // Filtro por busca geral
    if (searchTerm) {
      result = result.filter(encomenda =>
        Object.values(encomenda).some(
          value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Ordenação
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [encomendas, filtroTipo, filtroPesoMin, filtroPesoMax, searchTerm, sortConfig]);

  // Paginação
  const indexOfLastEncomenda = currentPage * encomendasPerPage;
  const indexOfFirstEncomenda = indexOfLastEncomenda - encomendasPerPage;
  const currentEncomendas = filteredEncomendas.slice(indexOfFirstEncomenda, indexOfLastEncomenda);
  const totalPages = Math.ceil(filteredEncomendas.length / encomendasPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Exportação para CSV
  const exportToCSV = () => {
    const headers = ['Peso (kg)', 'Tipo', 'Descrição', 'Endereço', 'Data Cadastro'];
    const data = filteredEncomendas.map(encomenda => [
      encomenda.peso,
      encomenda.tipo,
      `"${encomenda.descricao}"`,
      `"${encomenda.endereco}"`,
      new Date(encomenda.dataCadastro).toLocaleString()
    ].join(','));

    const csvContent = [
      headers.join(','),
      ...data
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'encomendas.csv';
    link.click();
  };

  useEffect(() => {
    fetchEncomendas();
  }, []);

  return (
    <div className="encomendas-container">
      <header className="encomendas-header">
        <h1>Gestão de Encomendas</h1>
        <p>Cadastre e gerencie as encomendas do sistema</p>
      </header>

      {connectionError && (
        <div className="alert-error">
          <FiAlertCircle /> Erro de conexão com o servidor. Verifique sua rede.
        </div>
      )}

      <div className="encomendas-content">
        <form onSubmit={handleSubmit} className="encomendas-form">
          <h2>{editingId ? 'Editar Encomenda' : 'Cadastrar Encomenda'}</h2>
          
          <div className="form-group">
            <label>Peso (kg)*</label>
            <input
              name="peso"
              type="number"
              step="0.01"
              min="0"
              value={form.peso}
              onChange={handleChange}
              placeholder="Digite o peso em kg"
              className={errors.peso ? 'input-error' : ''}
            />
            {errors.peso && <span className="error">{errors.peso}</span>}
          </div>

          <div className="form-group">
            <label>Tipo*</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
            >
              {tiposEncomenda.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Endereço de Entrega*</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Digite o endereço completo"
              className={errors.endereco ? 'input-error' : ''}
            />
            {errors.endereco && <span className="error">{errors.endereco}</span>}
          </div>

          <div className="form-group">
            <label>Descrição*</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva a encomenda"
              rows="3"
              className={errors.descricao ? 'input-error' : ''}
            />
            {errors.descricao && <span className="error">{errors.descricao}</span>}
          </div>

          

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm} disabled={isLoading}>
                <FiX /> Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="encomendas-list">
          <div className="list-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar encomendas..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button onClick={exportToCSV} className="btn-export">
              <FiDownload /> Exportar
            </button>
          </div>

          {/* Filtros específicos */}
          <div className="filtros-container">
            <div className="filtros-grid">
              <div className="filtro-item">
                <label>Tipo</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => {
                    setFiltroTipo(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="todos">Todos</option>
                  {tiposEncomenda.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filtro-item">
                <label>Peso Mínimo (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={filtroPesoMin}
                  onChange={(e) => {
                    setFiltroPesoMin(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="filtro-item">
                <label>Peso Máximo (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Sem limite"
                  value={filtroPesoMax}
                  onChange={(e) => {
                    setFiltroPesoMax(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('peso')} className="sortable">
                    Peso (kg)
                    {sortConfig.key === 'peso' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th onClick={() => requestSort('tipo')} className="sortable">
                    Tipo
                    {sortConfig.key === 'tipo' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th>Descrição</th>
                  <th>Endereço</th>
                  <th onClick={() => requestSort('dataCadastro')} className="sortable">
                    Data
                    {sortConfig.key === 'dataCadastro' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && currentEncomendas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="loading-row">
                      Carregando encomendas...
                    </td>
                  </tr>
                ) : currentEncomendas.length > 0 ? (
                  currentEncomendas.map(encomenda => (
                    <tr key={encomenda.id}>
                      <td>{parseFloat(encomenda.peso).toFixed(2)} kg</td>
                      <td>
                        <span className={`tipo-badge ${encomenda.tipo}`}>
                          {tiposEncomenda.find(t => t.value === encomenda.tipo)?.label}
                        </span>
                      </td>
                      <td className="descricao-cell">{encomenda.descricao}</td>
                      <td>{encomenda.endereco}</td>
                      <td>
                        {new Date(encomenda.dataCadastro).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(encomenda)} className="btn-edit">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDeleteClick(encomenda.id)} className="btn-delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      Nenhuma encomenda encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {encomendaToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir esta encomenda? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn-danger" disabled={isLoading}>
                {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}