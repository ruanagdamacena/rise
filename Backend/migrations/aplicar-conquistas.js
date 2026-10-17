const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');
const { registrarMissao, atualizarConquistas } = require('../src/services/conquistasService');

(async () => {
  let conexao;
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, '001-historico-conquistas.sql'), 'utf8'));
    conexao = await pool.getConnection();
    await conexao.beginTransaction();
    const [usuarios] = await conexao.query('SELECT id, nivel, gold, sequencia FROM usuarios FOR UPDATE');
    const [missoes] = await conexao.query('SELECT * FROM missoes');
    for (const missao of missoes) await registrarMissao(conexao, missao);
    for (const usuario of usuarios) await atualizarConquistas(conexao, usuario);
    await conexao.commit();
    console.log('Histórico preparado e progresso existente sincronizado.');
  } catch (erro) {
    if (conexao) await conexao.rollback();
    console.log('Falha na migração: ' + (erro.code || 'erro interno'));
    process.exitCode = 1;
  } finally { if (conexao) conexao.release(); await pool.end(); }
})();
