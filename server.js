import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let clientes = [];

app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/clientes', (req, res) => {
  const novoCliente = req.body;
  clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const updatedCliente = req.body;
  
  
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  
  clientes[index] = { ...clientes[index], ...updatedCliente };
  res.json(clientes[index]);
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});