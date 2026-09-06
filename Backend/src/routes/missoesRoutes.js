const express = require('express');
const router = express.Router();
const { autenticar, somenteDono } = require('../middleware/auth');
const { listar, criar, concluir, remover } = require('../controllers/missoesController');

// Todas as rotas de missões exigem estar logado.
router.use(autenticar);

// somenteDono confere que o :usuario_id da URL é o mesmo do token —
// impede um usuário de ver as missões de outro só trocando o número na URL.
router.get('/:usuario_id', somenteDono, listar);

router.post('/', criar);
router.patch('/:id/concluir', concluir);
router.delete('/:id', remover);

module.exports = router;