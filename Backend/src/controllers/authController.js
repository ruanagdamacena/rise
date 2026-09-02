const bcrypt = require('bcryptjs'); // versão em JS puro do bcrypt — sem dependências nativas vulneráveis
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const CUSTO_HASH = 10; // "salt rounds" do bcrypt — 10 é um bom equilíbrio entre segurança e velocidade

// Formata o usuário para devolver ao frontend, SEM o campo senha.
function formatarUsuario(linha) {
  const { senha, ...resto } = linha;
  return resto;
}

// POST /api/auth/cadastro
async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const [existentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existentes.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma conta com este email.' });
    }

    const senhaHash = await bcrypt.hash(senha, CUSTO_HASH);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    const [linhas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [resultado.insertId]);
    const usuario = formatarUsuario(linhas[0]);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({ usuario, token });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const [linhas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (linhas.length === 0) {
      // Mensagem genérica de propósito: não revelamos se o problema foi o email ou a senha.
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const usuarioComSenha = linhas[0];
    const senhaConfere = await bcrypt.compare(senha, usuarioComSenha.senha);

    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const usuario = formatarUsuario(usuarioComSenha);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({ usuario, token });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
}

module.exports = { cadastrar, login };
