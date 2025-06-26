import { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiMail, FiMapPin, FiAlertCircle, FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import "./Clientes.css";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
});

export default function Clientes() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpfOuCnpj") {
      const onlyNumbers = value.replace(/\D/g, "");
      
      if (onlyNumbers.length <= 11) {
        formattedValue = onlyNumbers
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        formattedValue = onlyNumbers
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
    }

    setForm({ ...form, [name]: formattedValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    const onlyNumbersCpfCnpj = form.cpfOuCnpj.replace(/\D/g, "");

    if (form.nome.trim().length < 3) newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    
    if (onlyNumbersCpfCnpj.length === 11 && !/^\d{11}$/.test(onlyNumbersCpfCnpj)) {
      newErrors.cpfOuCnpj = "CPF inválido";
    } else if (onlyNumbersCpfCnpj.length === 14 && !/^\d{14}$/.test(onlyNumbersCpfCnpj)) {
      newErrors.cpfOuCnpj = "CNPJ inválido";
    } else if (![11, 14].includes(onlyNumbersCpfCnpj.length)) {
      newErrors.cpfOuCnpj = onlyNumbersCpfCnpj.length < 11 ? "CPF deve ter 11 dígitos" : "CNPJ deve ter 14 dígitos";
    }
    
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "E-mail inválido";
    if (form.endereco.trim().length < 5) newErrors.endereco = "Endereço muito curto";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "", status: "ativo" });
      setEditingId(null);
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    
    try {
      setIsLoading(true);
      await api.delete(`/clientes/${id}`);
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditingId(cliente.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      setConnectionError(false);
      const res = await api.get("/clientes");
      
      const clientesData = Array.isArray(res?.data) 
        ? res.data.filter(cliente => cliente?.id)
        : [];
      
      setClientes(clientesData);
    } catch (err) {
      console.error("Erro ao carregar lista de clientes:", err);
      setConnectionError(true);
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfOuCnpj.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2>Gestão de Clientes</h2>
        <p>Cadastre e gerencie os clientes do sistema</p>
      </div>

      {connectionError && (
        <div className="alert-error">
          <FiAlertCircle /> Erro de conexão com o servidor. Verifique sua rede.
        </div>
      )}

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingId ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h3>
          
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite o nome completo"
              value={form.nome}
              onChange={handleChange}
              className={errors.nome ? "input-error" : ""}
            />
            {errors.nome && <span className="error">{errors.nome}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cpfOuCnpj">CPF/CNPJ</label>
            <input
              id="cpfOuCnpj"
              name="cpfOuCnpj"
              type="text"
              placeholder="Digite CPF ou CNPJ"
              value={form.cpfOuCnpj}
              onChange={handleChange}
              className={errors.cpfOuCnpj ? "input-error" : ""}
            />
            {errors.cpfOuCnpj && <span className="error">{errors.cpfOuCnpj}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@email.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Rua, número, bairro, cidade"
              value={form.endereco}
              onChange={handleChange}
              className={errors.endereco ? "input-error" : ""}
            />
            {errors.endereco && <span className="error">{errors.endereco}</span>}
          </div>

          <div className="buttons">
            <button type="submit" className="btn primary" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : null}
              {editingId ? "Atualizar Cliente" : "Cadastrar Cliente"}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="btn secondary"
                onClick={() => {
                  setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "", status: "ativo" });
                  setEditingId(null);
                }}
                disabled={isLoading}
              >
                <FiX /> Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="list">
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <h3>Clientes Cadastrados</h3>
          
          {isLoading ? (
            <p>Carregando...</p>
          ) : filteredClientes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-500" />
                        {cliente.nome}
                      </div>
                    </td>
                    <td>{cliente.cpfOuCnpj}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-500" />
                        {cliente.email}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${cliente.status || 'ativo'}`}>
                        {cliente.status === 'inativo' ? 'Inativo' : 'Ativo'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          onClick={() => handleEdit(cliente)}
                          className="edit"
                          disabled={isLoading}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="delete"
                          disabled={isLoading}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">
              <FiUser size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}