import { useState, useEffect } from "react";
import { EncomendaForm } from "../components/EncomendaForm";
import { EncomendaList } from "./EncomendaList";
import { listarEncomendas, cadastrarEncomenda } from "../services/encomendaService";

export default function Encomendas() {
  const [encomendas, setEncomendas] = useState([]);

  
  useEffect(() => {
    async function carregarEncomendas() {
      try {
        const lista = await listarEncomendas();
        setEncomendas(lista);
      } catch (err) {
        console.error("Erro ao carregar encomendas:", err);
        alert("Erro ao carregar encomendas");
      }
    }
    carregarEncomendas();
  }, []);

  
  const handleCadastrar = async (novaEncomenda) => {
    try {
      await cadastrarEncomenda(novaEncomenda);
      const listaAtualizada = await listarEncomendas();
      setEncomendas(listaAtualizada);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar encomenda");
    }
  };

  return (
    <div className="encomendas-page">
      <h2>Cadastro de Encomendas</h2>
      <EncomendaForm onSubmit={handleCadastrar} />
      
      <h2>Lista de Encomendas</h2>
      <EncomendaList encomendas={encomendas} />
    </div>
  );
}