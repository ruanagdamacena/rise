CREATE TABLE IF NOT EXISTS historico_missoes (
  missao_id INT PRIMARY KEY,
  usuario_id INT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  criado_dia CHAR(10) NOT NULL,
  concluido_dia CHAR(10) NULL,
  INDEX idx_historico_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
