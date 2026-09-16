const pool = require('../config/db');
const { calcularRecompensa } = require('../services/recompensas');
const { aplicarXp, calcularSequencia } = require('../services/gameService');

// Ajuste esta lista se os valores usados no ModalNovaMissao do frontend mudarem.
const TIPOS_VALIDOS = ['Diária', 'Semanal', 'Especial'];

// GET /api/missoes/:usuario_id
async function listar(req, res) {
  try {
    const { usuario_id } = req.params;
    const [missoes] = await pool.query(
      'SELECT * FROM missoes WHERE usuario_id = ? ORDER BY criado_em DESC',
      [usuario_id]
    );
    return res.json(missoes);
  } catch (erro) {
    console.error('Erro ao listar missões:', erro);
    return res.status(500).json({ erro: 'Erro interno ao listar missões.' });
  }
}

// POST /api/missoes
async function criar(req, res) {
  try {
    const { titulo, descricao, categoria, tipo, dificuldade } = req.body;
    const usuario_id = req.usuario.id; // vem do token — nunca aceite isso vindo do corpo da requisição

    if (!titulo || !categoria || !tipo || !dificuldade) {
      return res.status(400).json({ erro: 'Título, categoria, tipo e dificuldade são obrigatórios.' });
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ erro: `Tipo inválido. Use: ${TIPOS_VALIDOS.join(', ')}.` });
    }

    // xp e gold são calculados AQUI, no servidor. Nunca confie em valores de
    // recompensa vindos do frontend — isso impede alguém de editar a
    // requisição (DevTools, Postman) para se dar recompensas maiores.
    let recompensa;
    try {
      recompensa = calcularRecompensa(dificuldade);
    } catch (erroValidacao) {
      return res.status(400).json({ erro: erroValidacao.message });
    }

    const [resultado] = await pool.query(
      `INSERT INTO missoes (usuario_id, titulo, descricao, categoria, tipo, dificuldade, xp, gold)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, titulo, descricao || null, categoria, tipo, dificuldade, recompensa.xp, recompensa.gold]
    );

    const [linhas] = await pool.query('SELECT * FROM missoes WHERE id = ?', [resultado.insertId]);
    return res.status(201).json(linhas[0]);
  } catch (erro) {
    console.error('Erro ao criar missão:', erro);
    return res.status(500).json({ erro: 'Erro interno ao criar missão.' });
  }
}

// PATCH /api/missoes/:id/concluir
// Mexe em duas tabelas (missoes e usuarios) numa transação só, para garantir
// que nunca fique "pela metade" (ex: missão marcada como concluída mas XP
// não foi somado, por causa de uma falha no meio).
async function concluir(req, res) {
  const conexao = await pool.getConnection();
  try {
    const { id } = req.params;

    const [missoesEncontradas] = await conexao.query('SELECT * FROM missoes WHERE id = ?', [id]);
    if (missoesEncontradas.length === 0) {
      return res.status(404).json({ erro: 'Missão não encontrada.' });
    }
    const missao = missoesEncontradas[0];

    if (missao.usuario_id !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você não tem permissão para concluir esta missão.' });
    }

    // Trava contra completar a mesma missão duas vezes e "farmar" XP/gold infinito.
    if (missao.concluida) {
      return res.status(400).json({ erro: 'Esta missão já foi concluída anteriormente.' });
    }

    const [usuariosEncontrados] = await conexao.query('SELECT * FROM usuarios WHERE id = ?', [req.usuario.id]);
    const usuario = usuariosEncontrados[0];

    const progressoXp = aplicarXp(usuario, missao.xp);

    // A sequência (streak) só avança com missões DIÁRIAS.
    // Missões Semanais ou Especiais dão XP/Gold normalmente, mas não contam
    // para "quantos dias seguidos" o usuário manteve o ritmo.
    const progressoSequencia =
      missao.tipo === 'Diária'
        ? calcularSequencia(usuario.sequencia, usuario.ultima_missao_em)
        : { sequencia: usuario.sequencia, ultima_missao_em: usuario.ultima_missao_em };

    const novoGold = usuario.gold + missao.gold;

    await conexao.beginTransaction();

    await conexao.query(
      'UPDATE missoes SET concluida = 1, concluido_em = NOW() WHERE id = ?',
      [id]
    );

    await conexao.query(
      `UPDATE usuarios
       SET nivel = ?, xp = ?, xp_proximo_nivel = ?, gold = ?, sequencia = ?, ultima_missao_em = ?
       WHERE id = ?`,
      [
        progressoXp.nivel,
        progressoXp.xp,
        progressoXp.xp_proximo_nivel,
        novoGold,
        progressoSequencia.sequencia,
        progressoSequencia.ultima_missao_em,
        req.usuario.id,
      ]
    );

    await conexao.commit();

    const [usuarioAtualizado] = await conexao.query('SELECT * FROM usuarios WHERE id = ?', [req.usuario.id]);
    const [missaoAtualizada] = await conexao.query('SELECT * FROM missoes WHERE id = ?', [id]);
    const { senha, ...usuarioSemSenha } = usuarioAtualizado[0];

    return res.json({ missao: missaoAtualizada[0], usuario: usuarioSemSenha });
  } catch (erro) {
    try {
      await conexao.rollback();
    } catch (_) {
      // se a transação nem tinha começado ainda, o rollback pode reclamar — pode ignorar
    }
    console.error('Erro ao concluir missão:', erro);
    return res.status(500).json({ erro: 'Erro interno ao concluir missão.' });
  } finally {
    conexao.release();
  }
}

// DELETE /api/missoes/:id
async function remover(req, res) {
  try {
    const { id } = req.params;

    const [missoesEncontradas] = await pool.query('SELECT * FROM missoes WHERE id = ?', [id]);
    if (missoesEncontradas.length === 0) {
      return res.status(404).json({ erro: 'Missão não encontrada.' });
    }
    if (missoesEncontradas[0].usuario_id !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você não tem permissão para excluir esta missão.' });
    }

    await pool.query('DELETE FROM missoes WHERE id = ?', [id]);
    return res.status(204).send();
  } catch (erro) {
    console.error('Erro ao remover missão:', erro);
    return res.status(500).json({ erro: 'Erro interno ao remover missão.' });
  }
}

module.exports = { listar, criar, concluir, remover };