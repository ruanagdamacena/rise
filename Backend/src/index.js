require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const missoesRoutes = require('./routes/missoesRoutes');
// const usuarioRoutes = require('./routes/usuarioRoutes');   // próximo passo
// const conquistasRoutes = require('./routes/conquistasRoutes'); // próximo passo

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/missoes', missoesRoutes);
app.use('/api/usuario', require('./routes/usuarioRoutes'));
app.use('/api/conquistas', require('./routes/conquistasRoutes'));
// app.use('/api/usuario', usuarioRoutes);
// app.use('/api/conquistas', conquistasRoutes);

// Rota simples para conferir se o servidor está de pé
app.get('/api/status', (req, res) => {
  res.json({ ok: true, mensagem: 'Rise backend rodando.' });
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
