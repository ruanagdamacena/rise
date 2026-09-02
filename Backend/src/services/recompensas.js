// Regra OFICIAL de recompensas por dificuldade.
//
// IMPORTANTE: o frontend (ModalNovaMissao.jsx) também calcula esses valores
// só para mostrar uma prévia visual ao usuário — mas o backend NUNCA deve
// confiar no xp/gold que vier na requisição. Se confiasse, um usuário mal-
// intencionado poderia abrir o DevTools do navegador, editar a requisição
// e se dar 99999 de XP em uma missão marcada como "Fácil".
//
// Por isso: toda vez que uma missão for criada ou concluída, o valor de
// xp/gold usado é SEMPRE o calculado aqui, a partir da dificuldade —
// nunca o valor que o cliente mandou.

const TABELA_RECOMPENSAS = {
  'Fácil': { xp: 10, gold: 3 },
  'Médio': { xp: 25, gold: 10 },
  'Difícil': { xp: 50, gold: 20 },
};

function calcularRecompensa(dificuldade) {
  const recompensa = TABELA_RECOMPENSAS[dificuldade];

  if (!recompensa) {
    throw new Error(`Dificuldade inválida: "${dificuldade}". Use Fácil, Médio ou Difícil.`);
  }

  return recompensa;
}

module.exports = { calcularRecompensa, TABELA_RECOMPENSAS };
