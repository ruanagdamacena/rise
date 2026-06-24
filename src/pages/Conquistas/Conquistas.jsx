import './Conquistas.css'

const conquistas = [
  {
    id: 1,
    titulo: 'Primeira Sequência',
    descricao: 'Complete 7 dias em sequência',
    concluida: true,
    dataDesbloqueio: '28 Mar 2026',
    progresso: 7,
    total: 7,
  },
  {
    id: 2,
    titulo: 'Mestre da Meditação',
    descricao: 'Complete 30 missões de meditação',
    concluida: false,
    progresso: 12,
    total: 30,
  },
  {
    id: 3,
    titulo: 'Corpo em movimento',
    descricao: 'Complete 20 missões de saúde',
    concluida: false,
    progresso: 8,
    total: 20,
  },
  {
    id: 4,
    titulo: 'Sede de conhecimento',
    descricao: 'Complete 25 missões de conhecimento',
    concluida: false,
    progresso: 6,
    total: 25,
  },
  {
    id: 5,
    titulo: 'Produtividade máxima',
    descricao: 'Complete 15 missões de produtividade',
    concluida: false,
    progresso: 3,
    total: 15,
  },
  {
    id: 6,
    titulo: 'Lendário',
    descricao: 'Alcance o nível 100',
    concluida: false,
    progresso: 5,
    total: 100,
  },
  {
    id: 7,
    titulo: 'Semana perfeita',
    descricao: 'Complete todas as missões diárias por 7 dias seguidos',
    concluida: false,
    progresso: 3,
    total: 7,
  },
  {
    id: 8,
    titulo: 'Colecionador de Gold',
    descricao: 'Acumule 5000 Gold',
    concluida: false,
    progresso: 2152,
    total: 5000,
  },
]

function Conquistas() {
  const concluidas = conquistas.filter(c => c.concluida).length
  const total = conquistas.length

  return (
    <div className="conquistas">

      {/* Cabeçalho */}
      <div className="conquistas__header">
        <div className="conquistas__header-icon">🏆</div>
        <div>
          <h1 className="conquistas__titulo">Conquistas</h1>
          <p className="conquistas__subtitulo">Desbloqueie marcos da sua evolução</p>
        </div>
        <span className="conquistas__contador">{concluidas} de {total} desbloqueadas</span>
      </div>

      {/* Lista de conquistas */}
      <div className="conquistas__lista">
        {conquistas.map(conquista => {
          const porcentagem = Math.round((conquista.progresso / conquista.total) * 100)

          return (
            <div
              key={conquista.id}
              className={`conquista ${conquista.concluida ? 'conquista--concluida' : ''}`}
            >
              {/* Ícone */}
              <div className={`conquista__icone ${conquista.concluida ? 'conquista__icone--ativo' : ''}`}>
                🎯
              </div>

              {/* Conteúdo */}
              <div className="conquista__body">
                <div className="conquista__topo">
                  <h3 className="conquista__titulo">{conquista.titulo}</h3>
                  {conquista.concluida && (
                    <span className="conquista__badge">Completa</span>
                  )}
                </div>
                <p className="conquista__descricao">{conquista.descricao}</p>

                {/* Barra de progresso */}
                <div className="conquista__progresso">
                  <div className="conquista__progresso-info">
                    <span>Progresso</span>
                    <span>{conquista.progresso}/{conquista.total}</span>
                  </div>
                  <div className="conquista__bar">
                    <div
                      className="conquista__bar-fill"
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>
                </div>

                {conquista.concluida && (
                  <p className="conquista__data">Desbloqueada em {conquista.dataDesbloqueio}</p>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Conquistas