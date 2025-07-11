import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Dados iniciais
let clientes = [];
let currentId = 1;

let encomendas = [];
let encomendaCurrentId = 1;

let centros = [
  { id: "1", nome: "Centro SP", cidade: "São Paulo", estado: "SP" },
  { id: "2", nome: "Centro RJ", cidade: "Rio de Janeiro", estado: "RJ" },
  { id: "3", nome: "Centro MG", cidade: "Belo Horizonte", estado: "MG" }
];

let rotas = [];
let rotaCurrentId = 1;

let entregas = [];
let entregaCurrentId = 1;

// Endpoints para clientes
app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/clientes', (req, res) => {
  const novoCliente = {
    id: currentId.toString(), 
    ...req.body
  };
  clientes.push(novoCliente);
  currentId++; 
  res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const updatedCliente = req.body;
  
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  clientes[index] = { ...clientes[index], ...updatedCliente, id };
  res.json(clientes[index]);
});

app.delete('/clientes/:id', (req, res) => { 
  const { id } = req.params;
  
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  clientes = clientes.filter(c => c.id !== id);
  res.status(204).send();
});

// Endpoints para encomendas
app.get('/encomendas', (req, res) => {
  res.json(encomendas);
});

app.post('/encomendas', (req, res) => {
  const novaEncomenda = {
    id: encomendaCurrentId.toString(),
    ...req.body,
    dataCadastro: new Date().toISOString()
  };
  encomendas.push(novaEncomenda);
  encomendaCurrentId++;
  res.status(201).json(novaEncomenda);
});

app.put('/encomendas/:id', (req, res) => {
  const { id } = req.params;
  const index = encomendas.findIndex(e => e.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Encomenda não encontrada' });
  }
  
  encomendas[index] = { ...encomendas[index], ...req.body, id };
  res.json(encomendas[index]);
});

app.delete('/encomendas/:id', (req, res) => {
  const { id } = req.params;
  encomendas = encomendas.filter(e => e.id !== id);
  res.status(204).send();
});

// Endpoints para centros
app.get('/centros', (req, res) => {
  res.json(centros);
});

// Endpoints para rotas
app.get('/rotas', (req, res) => {
  res.json(rotas);
});

app.post('/rotas', (req, res) => {
  const novaRota = {
    id: rotaCurrentId.toString(),
    ...req.body
  };
  rotas.push(novaRota);
  rotaCurrentId++;
  res.status(201).json(novaRota);
});

app.put('/rotas/:id', (req, res) => {
  const { id } = req.params;
  const index = rotas.findIndex(r => r.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Rota não encontrada' });
  }
  
  rotas[index] = { ...rotas[index], ...req.body, id };
  res.json(rotas[index]);
});

app.delete('/rotas/:id', (req, res) => {
  const { id } = req.params;
  rotas = rotas.filter(r => r.id !== id);
  res.status(204).send();
});

// Endpoints para entregas
app.get('/entregas', (req, res) => {
  res.json(entregas);
});

app.post('/entregas', (req, res) => {
  const novaEntrega = {
    id: `ENT${entregaCurrentId.toString().padStart(4, '0')}`,
    ...req.body,
    dataCriacao: new Date().toISOString()
  };
  entregas.push(novaEntrega);
  entregaCurrentId++;
  res.status(201).json(novaEntrega);
});

app.put('/entregas/:id', (req, res) => {
  const { id } = req.params;
  const index = entregas.findIndex(e => e.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Entrega não encontrada' });
  }
  
  entregas[index] = { ...entregas[index], ...req.body, id };
  res.json(entregas[index]);
});

app.delete('/entregas/:id', (req, res) => {
  const { id } = req.params;
  entregas = entregas.filter(e => e.id !== id);
  res.status(204).send();
});

app.get('/entregas/:id/historico', (req, res) => {
  const { id } = req.params;
  const entrega = entregas.find(e => e.id === id);
  
  if (!entrega) {
    return res.status(404).json({ message: 'Entrega não encontrada' });
  }
  
  // Simulação de histórico
  const historico = [
    {
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "em_preparo",
      local: "Centro de Distribuição",
      detalhes: "Entrega registrada no sistema"
    },
    {
      data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "a_caminho",
      local: "Em trânsito",
      detalhes: "Saiu para entrega"
    }
  ];
  
  if (entrega.status === "entregue") {
    historico.push({
      data: new Date().toISOString(),
      status: "entregue",
      local: entrega.endereco,
      detalhes: "Entrega concluída com sucesso"
    });
  } else if (entrega.status === "cancelada") {
    historico.push({
      data: new Date().toISOString(),
      status: "cancelada",
      local: "Centro de Distribuição",
      detalhes: "Entrega cancelada"
    });
  }
  
  res.json(historico);
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});