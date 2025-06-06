import { useState } from "react";

export function EncomendaList({ encomendas = [] }) {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [pesoMin, setPesoMin] = useState("");
  const [pesoMax, setPesoMax] = useState("");

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

  return (
    <div>
      <h2>Filtros</h2>
      <input
        placeholder="Peso mínimo"
        type="number"
        value={pesoMin}
        onChange={(e) => setPesoMin(e.target.value)}
      />
      <input
        placeholder="Peso máximo"
        type="number"
        value={pesoMax}
        onChange={(e) => setPesoMax(e.target.value)}
      />
      <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
        <option value="">Todos</option>
        <option value="documento">Documento</option>
        <option value="caixa">Caixa</option>
        <option value="palete">Palete</option>
      </select>

      <ul>
        {filtrar().map((e, i) => (
          <li key={i}>
            <strong>{e.tipo}</strong> - {e.peso} kg - {e.enderecoEntrega || e.endereco || "Endereço não informado"}
          </li>
        ))}
      </ul>
    </div>
  );
}
