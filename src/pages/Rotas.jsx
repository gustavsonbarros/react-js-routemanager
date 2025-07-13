import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiClock, FiSearch, FiTrash2, FiEdit2 } from 'react-icons/fi';
import './Rotas.css';

const api = axios.create({ baseURL: "http://localhost:3001" });

export default function Rotas() {
  const [rotas, setRotas] = useState([]);
  const [form, setForm] = useState({
    origem: "",
    destino: "",
    distancia: "",
    tempoEstimado: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRotas();
  }, []);

  const fetchRotas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rotas");
      setRotas(res.data);
    } catch (err) {
      console.error("Erro ao carregar rotas:", err);
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };



  const validateForm = () => {
    const newErrors = {};
    
    if (!form.origem.trim()) newErrors.origem = "Origem é obrigatória";
    if (!form.destino.trim()) newErrors.destino = "Destino é obrigatório";
    if (!form.distancia || isNaN(form.distancia) || form.distancia <= 0) 
      newErrors.distancia = "Distância deve ser um número positivo";
    if (!form.tempoEstimado || isNaN(form.tempoEstimado) || form.tempoEstimado <= 0) 
      newErrors.tempoEstimado = "Tempo estimado deve ser um número positivo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/rotas/${editingId}`, form);
      } else {
        await api.post("/rotas", form);
      }
      resetForm();
      await fetchRotas();
    } catch (err) {
      console.error("Erro ao salvar rota:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rota) => {
    setForm({
      origem: rota.origem,
      destino: rota.destino,
      distancia: rota.distancia,
      tempoEstimado: rota.tempoEstimado
    });
    setEditingId(rota.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        await api.delete(`/rotas/${id}`);
        await fetchRotas();
      } catch (err) {
        console.error("Erro ao excluir rota:", err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      origem: "",
      destino: "",
      distancia: "",
      tempoEstimado: ""
    });
    setEditingId(null);
  };

  const filteredRotas = rotas.filter(rota =>
    rota.origem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rota.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rotas-container">
      <h1>Gerenciar Rotas de Entrega</h1>
      
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Editar Rota' : 'Cadastrar Nova Rota'}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Origem*</label>
            <input
              name="origem"
              value={form.origem}
              onChange={handleChange}
              placeholder="Digite a origem"
              className={errors.origem ? 'input-error' : ''}
            />
            {errors.origem && <span className="error">{errors.origem}</span>}
          </div>
          
          <div className="form-group">
            <label>Destino*</label>
            <input
              name="destino"
              value={form.destino}
              onChange={handleChange}
              placeholder="Digite o destino"
              className={errors.destino ? 'input-error' : ''}
            />
            {errors.destino && <span className="error">{errors.destino}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Distância (km)*</label>
            <input
              name="distancia"
              type="number"
              step="0.1"
              min="0"
              value={form.distancia}
              onChange={handleChange}
              placeholder="Digite a distância"
              className={errors.distancia ? 'input-error' : ''}
            />
            {errors.distancia && <span className="error">{errors.distancia}</span>}
          </div>
          
          <div className="form-group">
            <label>Tempo Estimado (horas)*</label>
            <input
              name="tempoEstimado"
              type="number"
              step="0.1"
              min="0"
              value={form.tempoEstimado}
              onChange={handleChange}
              placeholder="Digite o tempo estimado"
              className={errors.tempoEstimado ? 'input-error' : ''}
            />
            {errors.tempoEstimado && <span className="error">{errors.tempoEstimado}</span>}
          </div>
        </div>
        

        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Rota' : 'Cadastrar Rota'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div className="rotas-list">
        <div className="list-header">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Filtrar por origem ou destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Destino</th>
                <th>Distância (km)</th>
                <th>Tempo Estimado (h)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredRotas.length === 0 ? (
                <tr>
                  <td colSpan="6">Carregando rotas...</td>
                </tr>
              ) : filteredRotas.length > 0 ? (
                filteredRotas.map(rota => (
                  <tr key={rota.id}>
                    <td>{rota.origem}</td>
                    <td>{rota.destino}</td>
                    <td>{parseFloat(rota.distancia).toFixed(1)}</td>
                    <td>{parseFloat(rota.tempoEstimado).toFixed(1)}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(rota)} className="btn-icon edit">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(rota.id)} className="btn-icon delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nenhuma rota encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}