// Este middleware protege rotas: só deixa passar quem tiver um token JWT válido.
// Ele lê o token do cabeçalho "Authorization: Bearer <token>",
// confere se é válido, e coloca os dados do usuário em req.usuario.

const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const cabecalho = req.headers['authorization'];

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = cabecalho.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload contém { id, email } — ver authController.js
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// Este middleware extra garante que o usuário só acesse/altere OS PRÓPRIOS dados.
// Ele compara o id do token (req.usuario.id) com o :id ou :usuario_id da URL.
// Use DEPOIS do middleware "autenticar" nas rotas que recebem um id na URL.
function somenteDono(req, res, next) {
  const idDaUrl = req.params.id || req.params.usuario_id;

  if (parseInt(idDaUrl, 10) !== req.usuario.id) {
    return res.status(403).json({ erro: 'Você não tem permissão para acessar este recurso.' });
  }

  next();
}

module.exports = { autenticar, somenteDono };
