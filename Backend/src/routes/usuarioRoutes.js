const express = require('express');
const pool = require('../config/db');
const { autenticar, somenteDono } = require('../middleware/auth');
const router = express.Router();
const campos = 'id, nome, email, nivel, xp, xp_proximo_nivel, patente, gold, sequencia, ultima_missao_em, criado_em';

router.use(autenticar);
router.get('/:id', somenteDono, async (req, res) => {
  try {
    const [linhas] = await pool.query(`SELECT ${campos} FROM usuarios WHERE id = ?`, [req.usuario.id]);
    if (!linhas.length) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json(linhas[0]);
  } catch { return res.status(500).json({ erro: 'Não foi possível carregar o perfil.' }); }
});

router.put('/:id', somenteDono, async (req, res) => {
  const { nome, email } = req.body;
  if (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100)
    return res.status(400).json({ erro: 'Informe um nome com até 100 caracteres.' });
  if (typeof email !== 'string' || email.trim().length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return res.status(400).json({ erro: 'Informe um email válido com até 100 caracteres.' });
  try {
    await pool.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome.trim(), email.trim(), req.usuario.id]);
    const [linhas] = await pool.query(`SELECT ${campos} FROM usuarios WHERE id = ?`, [req.usuario.id]);
    if (!linhas.length) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json(linhas[0]);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Este email já está em uso.' });
    return res.status(500).json({ erro: 'Não foi possível salvar o perfil.' });
  }
});
module.exports = router;
