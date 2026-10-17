const router = require('express').Router();
const pool = require('../config/db');
const { autenticar, somenteDono } = require('../middleware/auth');
const { obterProgresso } = require('../services/conquistasService');

router.get('/:usuario_id', autenticar, somenteDono, async (req, res) => {
  try {
    const [[usuario]] = await pool.query('SELECT id, nivel, gold, sequencia FROM usuarios WHERE id = ?', [req.usuario.id]);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    const { categorias, semana } = await obterProgresso(pool, usuario);
    const [linhas] = await pool.query(`SELECT c.*, COALESCE(uc.progresso, 0) AS progresso,
      COALESCE(uc.concluida, 0) AS concluida,
      DATE_FORMAT(uc.desbloqueado_em, '%Y-%m-%dT%H:%i:%s') AS desbloqueado_em FROM conquistas c
      LEFT JOIN usuario_conquistas uc ON uc.conquista_id = c.id AND uc.usuario_id = ? ORDER BY c.id`, [usuario.id]);
    return res.json(linhas.map(c => {
      const atual = c.metrica === 'categoria' ? categorias[c.categoria_alvo] || 0
        : c.metrica === 'semana_perfeita' ? semana : Number(usuario[c.metrica] || 0);
      return { ...c, progresso: Math.min(c.total, c.metrica === 'semana_perfeita' && !c.concluida ? atual : Math.max(c.progresso, atual)),
        descricao: c.metrica === 'categoria' ? `Complete ${c.total} missões de ${c.categoria_alvo}.` : c.descricao };
    }));
  } catch { return res.status(500).json({ erro: 'Não foi possível carregar as conquistas.' }); }
});
module.exports = router;
