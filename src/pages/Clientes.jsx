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

  function handleChange(e) {
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

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  }

  function validateForm() {
  const newErrors = {};
  const onlyNumbersCpfCnpj = form.cpfOuCnpj.replace(/\D/g, ""); // Remove não-números

  // Validação do CPF/CNPJ
  if (onlyNumbersCpfCnpj.length === 11) {
    // Validação básica de CPF (pode implementar validação completa depois)
    if (!/^\d{11}$/.test(onlyNumbersCpfCnpj)) {
      newErrors.cpfOuCnpj = "CPF inválido";
    }
  } else if (onlyNumbersCpfCnpj.length === 14) {
    // Validação básica de CNPJ (pode implementar validação completa depois)
    if (!/^\d{14}$/.test(onlyNumbersCpfCnpj)) {
      newErrors.cpfOuCnpj = "CNPJ inválido";
    }
  } else {
    newErrors.cpfOuCnpj = onlyNumbersCpfCnpj.length < 11 ? 
      "CPF deve ter 11 dígitos" : 
      "CNPJ deve ter 14 dígitos";
  }
    
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = "E-mail inválido";
  }
    
  if (form.endereco.trim().length < 5) {
    newErrors.endereco = "Endereço muito curto";
  }
    
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, form);
        alert("Cliente atualizado com sucesso!");
      } else {
        await api.post("/clientes", form);
        alert("Cliente cadastrado com sucesso!");
      }
      
      setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "" });
      setEditingId(null);
      await fetchClientes();
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(cliente) {
    setForm(cliente);
    setEditingId(cliente.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function fetchClientes() {
    try {
      setIsLoading(true);
      setConnectionError(false);
      const res = await api.get("/clientes");

      if (Array.isArray(res.data)) {
        setClientes(res.data);
      } else if (Array.isArray(res.data?.clientes)) {
        setClientes(res.data.clientes);
      } else {
        console.error("Resposta inesperada:", res.data);
        setClientes([]);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de clientes:", err);
      setConnectionError(true);
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h2>Cadastro de Clientes</h2>
        <p>Gerencie os clientes do seu sistema de logística</p>
      </div>

      {connectionError && (
        <div className="connection-error">
          Não foi possível conectar ao servidor. Verifique se o servidor está em execução.
        </div>
      )}

      <div className="clientes-content">
        <form onSubmit={handleSubmit} className="clientes-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              name="nome"
              placeholder="Digite o nome completo"
              value={form.nome}
              onChange={handleChange}
              className={errors.nome ? "input-error" : ""}
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpfOuCnpj">CPF/CNPJ</label>
            <input
              id="cpfOuCnpj"
              name="cpfOuCnpj"
              placeholder="Digite CPF ou CNPJ"
              value={form.cpfOuCnpj}
              onChange={handleChange}
              className={errors.cpfOuCnpj ? "input-error" : ""}
            />
            {errors.cpfOuCnpj && <span className="error-message">{errors.cpfOuCnpj}</span>}
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
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              placeholder="Rua, número, bairro, cidade"
              value={form.endereco}
              onChange={handleChange}
              className={errors.endereco ? "input-error" : ""}
            />
            {errors.endereco && <span className="error-message">{errors.endereco}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Salvando..." : editingId ? "Editar Cliente" : "Cadastrar Cliente"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setForm({ nome: "", cpfOuCnpj: "", email: "", endereco: "" });
                setEditingId(null);
              }}
              className="clear-button"
            >
              Cancelar Edição
            </button>
          )}
        </form>

        <div className="clientes-list">
          <h3>Clientes Cadastrados</h3>
          
          {isLoading ? (
            <p>Carregando clientes...</p>
          ) : Array.isArray(clientes) && clientes.length > 0 ? (
            <table className="clientes-table">
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
                  <tr key={cliente.id || cliente.cpfOuCnpj}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpfOuCnpj}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.endereco}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(cliente)}
                        className="edit-button"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">Nenhum cliente cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}