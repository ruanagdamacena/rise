-- ============================================================
-- Schema do banco de dados do Rise
-- Baseado no modelo original do projeto, com ajustes necessários
-- para segurança de integridade e para bater com o frontend real.
--
-- Rode este arquivo no MySQL Workbench (ou via terminal):
--   mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS rise
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rise;

-- ------------------------------------------------------------
-- Tabela de usuários
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,           -- aqui fica o HASH da senha (bcrypt), nunca texto puro
  nivel INT DEFAULT 1,
  xp INT DEFAULT 0,
  xp_proximo_nivel INT DEFAULT 100,
  rank VARCHAR(50) DEFAULT 'Iniciante',
  gold INT DEFAULT 0,
  sequencia INT DEFAULT 0,
  ultima_missao_em DATE NULL,            -- data da última missão concluída, usada para calcular a sequência
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabela de missões
-- Os valores de "dificuldade" usam acento porque é exatamente
-- assim que o frontend (ModalNovaMissao.jsx) envia: 'Fácil', 'Médio', 'Difícil'.
-- ------------------------------------------------------------
CREATE TABLE missoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50),
  tipo ENUM('Diária', 'Semanal', 'Especial') NOT NULL DEFAULT 'Diária',
  dificuldade ENUM('Fácil', 'Médio', 'Difícil') NOT NULL DEFAULT 'Fácil',
  xp INT DEFAULT 0,
  gold INT DEFAULT 0,
  concluida TINYINT(1) DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  concluido_em DATETIME,

  CONSTRAINT fk_missoes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela de conquistas (catálogo fixo — igual estava no mock)
-- ------------------------------------------------------------
CREATE TABLE conquistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  total INT NOT NULL COMMENT 'meta necessária para completar a conquista, ex: 30 missões concluídas'
);

-- ------------------------------------------------------------
-- Tabela intermediária: progresso de cada usuário em cada conquista
-- ------------------------------------------------------------
CREATE TABLE usuario_conquistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  conquista_id INT NOT NULL,
  progresso INT DEFAULT 0,
  concluida TINYINT(1) DEFAULT 0,
  desbloqueado_em DATETIME,

  CONSTRAINT fk_uc_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_uc_conquista
    FOREIGN KEY (conquista_id) REFERENCES conquistas(id)
    ON DELETE CASCADE,

  -- impede duas linhas de progresso para a mesma conquista do mesmo usuário
  UNIQUE KEY uq_usuario_conquista (usuario_id, conquista_id)
);

-- ------------------------------------------------------------
-- Dados iniciais de conquistas (baseado no que já existe no frontend)
-- Sem isso, a tela de Conquistas ficaria vazia em um banco novo.
-- ------------------------------------------------------------
INSERT INTO conquistas (titulo, descricao, total) VALUES
  ('Primeira Sequência', 'Complete 7 dias em sequência', 7),
  ('Mestre da Meditação', 'Complete 30 missões de meditação', 30),
  ('Corpo em movimento', 'Complete 20 missões de saúde', 20),
  ('Sede de conhecimento', 'Complete 25 missões de conhecimento', 25),
  ('Produtividade máxima', 'Complete 15 missões de produtividade', 15),
  ('Lendário', 'Alcance o nível 100', 100),
  ('Semana perfeita', 'Complete todas as missões diárias por 7 dias seguidos', 7),
  ('Colecionador de Gold', 'Acumule 5000 Gold', 5000);
