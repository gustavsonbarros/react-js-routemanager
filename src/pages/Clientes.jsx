import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiAlertCircle, FiEdit2, FiTrash2, FiX, FiSearch, FiChevronUp, FiChevronDown, FiDownload } from 'react-icons/fi';
import './Clientes.css';

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
});

export default function Clientes() {
  // Estados
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    cpfOuCnpj: "",
    email: "",
    endereco: "",
    status: "ativo"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });
  const [clientToDelete, setClientToDelete] = useState(null);
  const clientsPerPage = 8;

  // Formatação de CPF/CNPJ
  const formatCPFCNPJ = (value) => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 11) {
      return nums.replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return nums.replace(/^(\d{2})(\d)/, '$1.$2')
               .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
               .replace(/\.(\d{3})(\d)/, '.$1/$2')
               .replace(/(\d{4})(\d)/, '$1-$2');
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpfOuCnpj') formattedValue = formatCPFCNPJ(value);

    setForm(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const numsCPFCNPJ = form.cpfOuCnpj.replace(/\D/g, '');

    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!numsCPFCNPJ) newErrors.cpfOuCnpj = "CPF/CNPJ é obrigatório";
    if (!form.email) newErrors.email = "E-mail é obrigatório";
    if (!form.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";

    if (numsCPFCNPJ.length === 11 && !/^\d{11}$/.test(numsCPFCNPJ)) newErrors.cpfOuCnpj = "CPF inválido";
    if (numsCPFCNPJ.length === 14 && !/^\d{14}$/.test(numsCPFCNPJ)) newErrors.cpfOuCnpj = "CNPJ inválido";
    if (![11, 14].includes(numsCPFCNPJ.length)) newErrors.cpfOuCnpj = "CPF/CNPJ inválido";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "E-mail inválido";
    if (form.endereco.trim().length < 5) newErrors.endereco = "Endereço muito curto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleEdit = (cliente) => {
    setForm({
      nome: cliente.nome,
      cpfOuCnpj: cliente.cpfOuCnpj,
      email: cliente.email,
      endereco: cliente.endereco,
      status: cliente.status || "ativo"
    });
    setEditingId(cliente.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      setConnectionError(false);
      const res = await api.get("/clientes");
      setClientes(Array.isArray(res?.data) ? res.data.filter(c => c?.id) : []);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setConnectionError(true);
      setClientes([]);
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
        await api.put(`/clientes/${editingId}`, form);
      } else {
        await api.post("/clientes", form);
      }
      resetForm();
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => setClientToDelete(id);
  const cancelDelete = () => setClientToDelete(null);

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/clientes/${clientToDelete}`);
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
    } finally {
      setIsLoading(false);
      setClientToDelete(null);
    }
  };

  const resetForm = () => {
    setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "", status: "ativo" });
    setEditingId(null);
  };

  
  const sortedClients = useMemo(() => {
    let sortableItems = [...clientes];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [clientes, sortConfig]);

  const filteredClients = sortedClients.filter(cliente =>
    Object.values(cliente).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Exportação
  const exportToCSV = () => {
    const headers = ['Nome', 'CPF/CNPJ', 'E-mail', 'Endereço', 'Status'];
    const data = filteredClients.map(client => [
      `"${client.nome}"`,
      `"${client.cpfOuCnpj}"`,
      `"${client.email}"`,
      `"${client.endereco}"`,
      `"${client.status}"`
    ].join(','));

    const csvContent = [
      headers.join(','),
      ...data
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clientes.csv';
    link.click();
  };

  // Efeitos
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <h1>Gestão de Clientes</h1>
        <p>Cadastre e gerencie os clientes do sistema</p>
      </header>

      {connectionError && (
        <div className="alert-error">
          <FiAlertCircle /> Erro de conexão com o servidor. Verifique sua rede.
        </div>
      )}

      <div className="clientes-content">
        <form onSubmit={handleSubmit} className="clientes-form">
          <h2>{editingId ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
          
          <div className="form-group">
            <label>Nome Completo*</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              className={errors.nome ? 'input-error' : ''}
            />
            {errors.nome && <span className="error">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label>CPF/CNPJ*</label>
            <input
              name="cpfOuCnpj"
              value={form.cpfOuCnpj}
              onChange={handleChange}
              placeholder="Digite CPF ou CNPJ"
              className={errors.cpfOuCnpj ? 'input-error' : ''}
            />
            {errors.cpfOuCnpj && <span className="error">{errors.cpfOuCnpj}</span>}
          </div>

          <div className="form-group">
            <label>E-mail*</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Endereço*</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
              className={errors.endereco ? 'input-error' : ''}
            />
            {errors.endereco && <span className="error">{errors.endereco}</span>}
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

        <div className="clientes-list">
          <div className="list-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar clientes..."
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

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('nome')} className="sortable">
                    Nome
                    {sortConfig.key === 'nome' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th>CPF/CNPJ</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && currentClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="loading-row">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : currentClients.length > 0 ? (
                  currentClients.map(cliente => (
                    <tr key={cliente.id}>
                      <td>
                        <div className="client-name">
                          <FiUser /> {cliente.nome}
                        </div>
                      </td>
                      <td>{cliente.cpfOuCnpj}</td>
                      <td>
                        <div className="client-email">
                          <FiMail /> {cliente.email}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${cliente.status === 'ativo' ? 'active' : 'inactive'}`}>
                          {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(cliente)} className="btn-edit">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDeleteClick(cliente.id)} className="btn-delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      Nenhum cliente encontrado
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
      {clientToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
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