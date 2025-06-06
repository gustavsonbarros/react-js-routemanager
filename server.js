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

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});