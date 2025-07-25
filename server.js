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

let entregaCurrentId = 1;

let centros = [
  { id: "1", nome: "Centro SP", cidade: "São Paulo", estado: "SP" },
  { id: "2", nome: "Centro RJ", cidade: "Rio de Janeiro", estado: "RJ" },
  { id: "3", nome: "Centro MG", cidade: "Belo Horizonte", estado: "MG" }
];

let rotas = [];
let rotaCurrentId = 1;

let entregas = [];


app.get('/', (req, res) => {
  res.json({
    message: "API de Gestão de Entregas",
    endpoints: {
      clientes: "/clientes",
      encomendas: "/encomendas",
      centros: "/centros",
      rotas: "/rotas",
      entregas: "/entregas",
      rastreamento: "/rastreamento"
    }
  });
});


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

app.get('/rastreamento', (req, res) => {
  res.json({ message: "Endpoint de rastreamento" }); 
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


app.get('/entregas', (req, res) => {
  const { id, cliente, status } = req.query;
  
  let resultado = [...entregas];
  
  if (id) {
    resultado = resultado.filter(e => e.id.toLowerCase().includes(id.toLowerCase()));
  }
  
  if (cliente) {
    resultado = resultado.filter(e => e.clienteId.toLowerCase().includes(cliente.toLowerCase()));
  }
  
  if (status) {
    resultado = resultado.filter(e => e.status === status);
  }
  
  res.json(resultado);
});

app.post('/entregas', (req, res) => {
  const { clienteId, encomendaId, rotaId, dataEstimada, status } = req.body;
  
  // Validação mais robusta
  if (!clienteId || !encomendaId || !rotaId || !dataEstimada) {
    return res.status(400).json({ 
      message: 'Dados incompletos',
      required: ['clienteId', 'encomendaId', 'rotaId', 'dataEstimada']
    });
  }

  const novaEntrega = {
    id: `ENT${entregaCurrentId.toString().padStart(4, '0')}`,
    clienteId,
    encomendaId,
    rotaId,
    dataEstimada,
    status: status || "em_preparo",
    dataCriacao: new Date().toISOString(),
    endereco: clientes.find(c => c.id === clienteId)?.endereco || "Endereço não disponível"
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

//teste de funcao
app.get('/entregas/:id', (req, res) => {
  const { id } = req.params;
  const entrega = entregas.find(e => e.id === id);
  
  if (!entrega) {
    return res.status(404).json({ message: 'Entrega não encontrada' });
  }

  // Busca informações adicionais
  const cliente = clientes.find(c => c.id === entrega.clienteId);
  const encomenda = encomendas.find(e => e.id === entrega.encomendaId);
  
  res.json({
    ...entrega,
    clienteNome: cliente?.nome || "Cliente não encontrado",
    encomendaDesc: encomenda?.descricao || "Encomenda não encontrada"
  });
});


app.get('/entregas/:id/historico', (req, res) => {
  const { id } = req.params;
  
  if (!/^ENT\d{4}$/.test(id)) {
    return res.status(400).json({ message: 'Formato de ID inválido' });
  }

  const entrega = entregas.find(e => e.id === id);
  
  if (!entrega) {
    return res.status(404).json({ message: 'Entrega não encontrada' });
  }
  
  // Histórico baseado no status atual
  const historicoBase = [
    {
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "em_preparo",
      local: "Centro de Distribuição",
      detalhes: "Entrega registrada no sistema"
    }
  ];

  if (entrega.status !== "em_preparo") {
    historicoBase.push({
      data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "a_caminho",
      local: "Em trânsito",
      detalhes: "Saiu para entrega"
    });
  }

  if (entrega.status === "entregue") {
    historicoBase.push({
      data: new Date().toISOString(),
      status: "entregue",
      local: entrega.endereco,
      detalhes: "Entrega concluída com sucesso"
    });
  } else if (entrega.status === "cancelada") {
    historicoBase.push({
      data: new Date().toISOString(),
      status: "cancelada",
      local: "Centro de Distribuição",
      detalhes: "Entrega cancelada"
    });
  }

  res.json(historicoBase);
});

// server.js (adicionar estas rotas)
const usuarios = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Rota de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const usuario = usuarios.find(u => 
    u.username === username && u.password === password
  );
  
  if (usuario) {
    res.json({
      success: true,
      token: 'fake-jwt-token', // Em produção, use um JWT real
      user: {
        id: usuario.id,
        username: usuario.username,
        role: usuario.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// Middleware para verificar autenticação
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  // Em produção, você validaria um JWT real aqui
  if (token === 'fake-jwt-token') {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado' });
  }
};

// Proteger suas rotas API existentes (exemplo)
app.get('/clientes', authenticate, (req, res) => {
  res.json(clientes);
});




// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});