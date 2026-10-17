function diaBrasil(data = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(data);
}

function calcularSemana(dias, hoje = diaBrasil()) {
  // Apenas dias encerrados contam: novas missões ainda podem ser criadas hoje.
  const completos = new Set(dias.filter(d => Number(d.criadas) > 0 && Number(d.criadas) === Number(d.concluidas)).map(d => d.dia));
  let atual = 0, melhor = 0, anterior;
  for (const dia of [...completos].filter(d => d < hoje).sort()) {
    atual = anterior && Date.parse(dia) - Date.parse(anterior) === 86400000 ? atual + 1 : 1;
    melhor = Math.max(melhor, atual);
    anterior = dia;
  }
  if (melhor >= 7) return 7;
  const ontem = new Date(`${hoje}T12:00:00Z`);
  ontem.setUTCDate(ontem.getUTCDate() - 1);
  return anterior === ontem.toISOString().slice(0, 10) ? atual : 0;
}

async function registrarMissao(conexao, missao) {
  await conexao.query(`INSERT IGNORE INTO historico_missoes
    (missao_id, usuario_id, categoria, tipo, criado_dia, concluido_dia)
    VALUES (?, ?, ?, ?, ?, ?)`, [missao.id, missao.usuario_id, missao.categoria, missao.tipo,
    diaBrasil(new Date(missao.criado_em)), missao.concluido_em ? diaBrasil(new Date(missao.concluido_em)) : null]);
}

async function obterProgresso(conexao, usuario) {
  const [categorias] = await conexao.query(`SELECT categoria, COUNT(*) AS total FROM historico_missoes
    WHERE usuario_id = ? AND concluido_dia IS NOT NULL GROUP BY categoria`, [usuario.id]);
  const [dias] = await conexao.query(`SELECT criado_dia AS dia, COUNT(*) AS criadas,
    SUM(concluido_dia = criado_dia) AS concluidas FROM historico_missoes
    WHERE usuario_id = ? AND tipo = 'Diária' GROUP BY criado_dia`, [usuario.id]);
  return { categorias: Object.fromEntries(categorias.map(c => [c.categoria, Number(c.total)])), semana: calcularSemana(dias) };
}

async function atualizarConquistas(conexao, usuario) {
  const [definicoes] = await conexao.query('SELECT * FROM conquistas ORDER BY id');
  const { categorias, semana } = await obterProgresso(conexao, usuario);
  for (const c of definicoes) {
    const valor = c.metrica === 'categoria' ? categorias[c.categoria_alvo] || 0
      : c.metrica === 'semana_perfeita' ? semana : Number(usuario[c.metrica] || 0);
    const progresso = Math.min(c.total, valor);
    await conexao.query(`INSERT INTO usuario_conquistas
      (usuario_id, conquista_id, progresso, concluida, desbloqueado_em)
      VALUES (?, ?, ?, ?, IF(?, UTC_TIMESTAMP(), NULL))
      ON DUPLICATE KEY UPDATE
      progresso = IF(? AND concluida = 0, VALUES(progresso), GREATEST(progresso, VALUES(progresso))),
      desbloqueado_em = IF(concluida = 0 AND VALUES(concluida) = 1, UTC_TIMESTAMP(), desbloqueado_em),
      concluida = GREATEST(concluida, VALUES(concluida))`,
    [usuario.id, c.id, progresso, progresso >= c.total ? 1 : 0, progresso >= c.total ? 1 : 0, c.metrica === 'semana_perfeita' ? 1 : 0]);
  }
}

module.exports = { diaBrasil, calcularSemana, registrarMissao, atualizarConquistas, obterProgresso };
