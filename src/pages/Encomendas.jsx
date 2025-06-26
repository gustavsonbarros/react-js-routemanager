import { useState, useEffect } from "react";
import { EncomendaForm } from "../components/EncomendaForm";
import { EncomendaList } from "./EncomendaList";
import { listarEncomendas, cadastrarEncomenda } from "../services/encomendaService";
import "./Encomendas.css";

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
    <div className="encomendas-container">
      <header className="page-header">
        <h1>Gerenciamento de Encomendas</h1>
      </header>

      <div className="content-grid">
        <section className="cadastro-section card">
          <h2>Cadastrar Nova Encomenda</h2>
          <EncomendaForm onSubmit={handleCadastrar} />
        </section>

        <section className="lista-section card">
          <EncomendaList encomendas={encomendas} />
        </section>
      </div>
    </div>
  );
}