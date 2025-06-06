import { useState } from "react";

export function EncomendaForm({ onSubmit }) {
  const [form, setForm] = useState({
    peso: "",
    tipo: "documento",
    descricao: "",
    endereco: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.peso <= 0) return alert("Peso deve ser maior que 0.");
    if (!form.endereco || form.endereco.length < 5)
      return alert("Endereço deve ter pelo menos 5 caracteres.");

    onSubmit(form);
    setForm({ peso: "", tipo: "documento", descricao: "", endereco: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="number"
        name="peso"
        placeholder="Peso (kg)"
        value={form.peso}
        onChange={handleChange}
        required
        min="0.01"
      />
      <select name="tipo" value={form.tipo} onChange={handleChange}>
        <option value="documento">Documento</option>
        <option value="caixa">Caixa</option>
        <option value="palete">Palete</option>
      </select>
      <input
        type="text"
        name="descricao"
        placeholder="Descrição (opcional)"
        maxLength={200}
        value={form.descricao}
        onChange={handleChange}
      />
      <input
        type="text"
        name="endereco"
        placeholder="Endereço de Entrega"
        value={form.endereco}
        onChange={handleChange}
        required
      />
      <button type="submit">Cadastrar Encomenda</button>
    </form>
  );
}
