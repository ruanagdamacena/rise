// Regras de progressão de nível e sequência (streak).
// Centralizado aqui para não espalhar fórmulas de jogo pelos controllers.

// Fórmula de XP necessário para o próximo nível.
// Decisão tomada agora: cresce de forma linear e simples (soma 50 a cada nível).
// Fácil de ajustar depois — é só mudar esta função, o resto do código não muda.
function calcularProximoNivel(xpProximoNivelAtual) {
  return xpProximoNivelAtual + 50;
}

// Aplica o XP ganho ao usuário, subindo de nível quantas vezes for preciso
// (caso uma missão dê XP suficiente para pular mais de um nível de uma vez).
function aplicarXp(usuario, xpGanho) {
  let { nivel, xp, xp_proximo_nivel } = usuario;
  xp += xpGanho;

  while (xp >= xp_proximo_nivel) {
    xp -= xp_proximo_nivel;
    nivel += 1;
    xp_proximo_nivel = calcularProximoNivel(xp_proximo_nivel);
  }

  return { nivel, xp, xp_proximo_nivel };
}

// Calcula a nova sequência (streak) com base na data da última missão concluída.
// Regras:
//  - Nunca completou nenhuma missão antes -> sequência vira 1.
//  - Última missão foi ONTEM -> sequência += 1 (manteve o ritmo).
//  - Última missão foi HOJE -> sequência não muda (já contou hoje, evita duplicar).
//  - Última missão foi antes de ontem -> sequência volta pra 1 (quebrou o ritmo).
function calcularSequencia(sequenciaAtual, ultimaMissaoEm) {
  const hoje = new Date();
  const hojeStr = hoje.toISOString().slice(0, 10); // formato "AAAA-MM-DD"

  if (!ultimaMissaoEm) {
    return { sequencia: 1, ultima_missao_em: hojeStr };
  }

  const ultimaStr = new Date(ultimaMissaoEm).toISOString().slice(0, 10);

  if (ultimaStr === hojeStr) {
    return { sequencia: sequenciaAtual, ultima_missao_em: hojeStr };
  }

  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const ontemStr = ontem.toISOString().slice(0, 10);

  if (ultimaStr === ontemStr) {
    return { sequencia: sequenciaAtual + 1, ultima_missao_em: hojeStr };
  }

  return { sequencia: 1, ultima_missao_em: hojeStr };
}

module.exports = { aplicarXp, calcularSequencia, calcularProximoNivel };