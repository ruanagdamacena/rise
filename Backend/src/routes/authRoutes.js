const express = require('express');
const router = express.Router();
const { cadastrar, login } = require('../controllers/authController');

// Estas duas rotas são as ÚNICAS públicas de todo o backend.
// Todas as outras vão exigir token (ver src/middleware/auth.js).
router.post('/cadastro', cadastrar);
router.post('/login', login);

module.exports = router;
