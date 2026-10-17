const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const pool = require('../src/config/db');
const { calcularSemana, diaBrasil } = require('../src/services/conquistasService');
const { calcularSequencia } = require('../src/services/gameService');

async function testar() {
  let usuarioId;
  try {
    assert.equal(diaBrasil(new Date('2026-10-18T01:00:00Z')), '2026-10-17');
    const dias = Array.from({ length: 7 }, (_, i) => ({ dia: `2026-10-${String(10 + i).padStart(2, '0')}`, criadas: 2, concluidas: 2 }));
    assert.equal(calcularSemana(dias, '2026-10-17'), 7);
    assert.equal(calcularSemana(dias, '2026-10-16'), 6);
    assert.equal(calcularSemana([{ dia: '2026-10-16', criadas: 2, concluidas: 1 }], '2026-10-17'), 0);
    assert.equal(calcularSemana([{ dia: '2026-10-14', criadas: 1, concluidas: 1 }], '2026-10-17'), 0);
    assert.equal(calcularSequencia(2, diaBrasil()).sequencia, 2);
    let token;
    async function api(caminho, method = 'GET', body) {
      const r = await fetch('http://localhost:3000/api' + caminho, { method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}) });
      return { status: r.status, dados: r.status === 204 ? null : await r.json() };
    }
    assert.equal((await api('/conquistas/1')).status, 401);
    const conta = await api('/auth/cadastro', 'POST', { nome: 'Teste automático', email: `teste-${crypto.randomUUID()}@example.com`, senha: crypto.randomBytes(32).toString('hex') });
    assert.equal(conta.status, 201);
    usuarioId = conta.dados.usuario.id;
    token = conta.dados.token;
    assert.equal((await api('/conquistas/2147483647')).status, 403);
    const criada = await api('/missoes', 'POST', { titulo: 'Verificação de conquistas', categoria: 'Saúde', tipo: 'Diária', dificuldade: 'Fácil' });
    assert.equal(criada.status, 201);
    const conclusoes = await Promise.all([api(`/missoes/${criada.dados.id}/concluir`, 'PATCH'), api(`/missoes/${criada.dados.id}/concluir`, 'PATCH')]);
    assert.deepEqual(conclusoes.map(r => r.status).sort(), [200, 400]);
    const concluida = conclusoes.find(r => r.status === 200).dados;
    assert.equal(concluida.usuario.xp, 10);
    assert.equal(concluida.usuario.gold, 3);
    let lista = await api(`/conquistas/${usuarioId}`);
    assert.equal(lista.status, 200);
    assert.equal(lista.dados.find(c => c.categoria_alvo === 'Saúde').progresso, 1);
    assert.equal((await api(`/missoes/${criada.dados.id}`, 'DELETE')).status, 204);
    lista = await api(`/conquistas/${usuarioId}`);
    assert.equal(lista.dados.find(c => c.categoria_alvo === 'Saúde').progresso, 1);
    // Atinge um marco só na conta descartável para verificar persistência do desbloqueio.
    await pool.query('UPDATE usuarios SET gold = 4999 WHERE id = ?', [usuarioId]);
    const segunda = await api('/missoes', 'POST', { titulo: 'Marco temporário', categoria: 'Conhecimento', tipo: 'Semanal', dificuldade: 'Fácil' });
    assert.equal((await api(`/missoes/${segunda.dados.id}/concluir`, 'PATCH')).status, 200);
    lista = await api(`/conquistas/${usuarioId}`);
    const gold = lista.dados.find(c => c.metrica === 'gold');
    assert.equal(gold.concluida, 1);
    assert.ok(gold.desbloqueado_em);
    assert.equal(lista.dados.find(c => c.metrica === 'sequencia').progresso, 1);
    console.log('OK: fuso, semana perfeita, autenticação, propriedade, categoria, exclusão, desbloqueio e conclusão simultânea.');
  } finally {
    if (usuarioId) { await pool.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]); console.log('Conta temporária removida.'); }
    await pool.end();
  }
}
testar().catch(e => { console.log('Teste falhou: ' + (e.code || e.message)); process.exitCode = 1; });
