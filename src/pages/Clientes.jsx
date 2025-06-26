import { useState, useEffect } from "react";
import axios from "axios";
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
    endereco: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
        // Se estiver editando, verifica se é um ID temporário
        if (editingId.toString().startsWith('temp-')) {
          // Cria um novo cliente se for temporário
          await api.post("/clientes", form);
        } else {
          // Atualiza cliente existente
          await api.put(`/clientes/${editingId}`, form);
        }
        alert("Cliente salvo com sucesso!");
      } else {
        // Cria um novo cliente
        await api.post("/clientes", form);
        alert("Cliente cadastrado com sucesso!");
      }
      
      setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "" });
      setEditingId(null);
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert(`Erro: ${err.response?.data?.message || err.message}`);
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
      alert("Cliente excluído com sucesso!");
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      alert(`Erro ao excluir cliente: ${err.response?.data?.message || err.message}`);
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
      
      // Tenta buscar da API
      const res = await api.get("/clientes");
      
      // Garante que cada cliente tenha um ID válido
      const clientesData = Array.isArray(res.data) 
        ? res.data.map(cliente => ({
            ...cliente,
            id: cliente.id || `temp-${Date.now()}` // Gera ID temporário se não existir
          }))
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

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2>Cadastro de Clientes</h2>
        <p>Gerencie os clientes do seu sistema</p>
      </div>

      {connectionError && (
        <div className="alert-error">
          Erro de conexão com o servidor. Verifique sua rede.
        </div>
      )}

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          {["nome", "cpfOuCnpj", "email", "endereco"].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>
                {field === "cpfOuCnpj" ? "CPF/CNPJ" : 
                 field === "nome" ? "Nome Completo" : 
                 field === "email" ? "E-mail" : "Endereço"}
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                placeholder={
                  field === "cpfOuCnpj" ? "Digite CPF ou CNPJ" :
                  field === "nome" ? "Digite o nome completo" :
                  field === "email" ? "exemplo@email.com" : "Rua, número, bairro, cidade"
                }
                value={form[field]}
                onChange={handleChange}
                className={errors[field] ? "input-error" : ""}
              />
              {errors[field] && <span className="error">{errors[field]}</span>}
            </div>
          ))}

          <div className="buttons">
            <button type="submit" className="btn primary" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : null}
              {editingId ? "Atualizar" : "Cadastrar"}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="btn secondary"
                onClick={() => {
                  setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "" });
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="list">
          <h3>Clientes Cadastrados</h3>
          
          {isLoading ? (
            <p>Carregando...</p>
          ) : clientes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>E-mail</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpfOuCnpj}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.endereco}</td>
                    <td>
                      <div className="actions">
                        <button 
                          onClick={() => handleEdit(cliente)}
                          className="btn edit"
                          disabled={isLoading}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="btn delete"
                          disabled={isLoading}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">Nenhum cliente cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
}