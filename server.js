import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let clientes = [];
let currentId = 1; 

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

let encomendas = [];
let encomendaCurrentId = 1;

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

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});