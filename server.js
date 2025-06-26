import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let clientes = [];
let currentId = 1; // Adicionado para gerenciar IDs

app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/clientes', (req, res) => {
  const novoCliente = {
    id: currentId.toString(), // Atribui um ID único
    ...req.body
  };
  clientes.push(novoCliente);
  currentId++; // Incrementa o ID para o próximo cliente
  res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const updatedCliente = req.body;
  
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  // Mantém o ID original e atualiza os outros campos
  clientes[index] = { ...clientes[index], ...updatedCliente, id };
  res.json(clientes[index]);
});

app.delete('/clientes/:id', (req, res) => { // Adicionado endpoint DELETE
  const { id } = req.params;
  
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  clientes = clientes.filter(c => c.id !== id);
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});