# Rise

Plataforma de produtividade gamificada com React, Vite, Express e MySQL.

## Executar no computador

Abra a pasta que contém este README e o package.json do frontend.
Use Node.js compatível com Vite 8, como Node 22.12 ou superior.

No terminal da raiz:

```powershell
npm ci
```

Em outro terminal:

```powershell
cd Backend
```

```powershell
npm ci
```

Copie `Backend/.env.example` para `Backend/.env` e preencha os dados da Aiven
localmente. Use a porta da Aiven em DB_PORT e mantenha PORT=3000 para a API.
Defina um JWT_SECRET aleatório longo. Nunca envie o .env ao GitHub.
O certificado deve estar em `Backend/src/config/ca.pem`.

O banco compartilhado já recebeu a migração de conquistas. Para outro banco
com as tabelas existentes e as colunas metrica e categoria_alvo, execute
dentro de Backend:

```powershell
node migrations/aplicar-conquistas.js
```

A migração adiciona histórico e sincroniza progresso; pode ser reexecutada.
Missões excluídas antes da criação do histórico não podem ser recuperadas.
O schema.sql original ainda não representa todas as alterações atuais:
não o execute sobre o banco compartilhado.

Inicie o backend no terminal de Backend:

```powershell
npm run dev
```

Inicie o site no terminal da raiz:

```powershell
npm run dev
```

Abra o endereço mostrado pelo Vite. A API padrão é http://localhost:3000.
Para outro endereço, configure VITE_API_URL no frontend.

## Verificar

Na raiz:

```powershell
npm run lint
```

```powershell
npm run build
```

Com o backend rodando, no terminal de Backend:

```powershell
node migrations/testar-conquistas.js
```

O teste acessa o banco configurado, cria uma conta temporária e a remove ao
terminar. Verifica progresso, desbloqueio, permissões, exclusão e conclusões
simultâneas. Encerrar o processo abruptamente pode impedir a limpeza.

## Regras atuais

- Fácil: 10 XP/3 gold; Médio: 25 XP/10 gold; Difícil: 50 XP/20 gold.
- Apenas missões diárias contam para sequência; datas seguem São Paulo.
- Semana perfeita: ao menos uma diária criada por dia, todas concluídas no
  próprio dia, por sete dias seguidos. Só dias encerrados contam. O desbloqueio
  é registrado na próxima conclusão de missão.
- Excluir missão mantém recompensas e histórico. Uma diária excluída sem
  conclusão continua sendo uma pendência para semana perfeita.
- Conquistas desbloqueadas permanecem desbloqueadas.

## Antes da apresentação

- Confirmar disponibilidade da Aiven e iniciar os dois servidores.
- Testar autenticação, missões e edição de perfil.
- Conferir o layout na resolução da apresentação e em tela pequena.
- Atualizar prints e relatório para refletirem o comportamento real.
- Salvar alterações no Git e sincronizar os computadores.

Ainda não há administração, recuperação de senha ou verificação de email.
