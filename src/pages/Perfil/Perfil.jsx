import { usuario } from '../../data/mockData'
import './Perfil.css'

// Dados temporários de conquistas
const conquistas = [
  {
    id: 1,
    titulo: 'Primeira Sequência',
    descricao: 'Complete 7 dias em sequência',
    concluida: true,
    dataDesbloqueio: '28 Mar 2026',
  },
  {
    id: 2,
    titulo: 'Progresso diário',
    descricao: '3 de 5 missões concluídas',
    concluida: false,
    progresso: 3,
    total: 5,
  },
  {
    id: 3,
    titulo: 'Mestre do conhecimento',
    descricao: 'Complete 10 missões de conhecimento',
    concluida: false,
    progresso: 6,
    total: 10,
  },
  {
    id: 4,
    titulo: 'Corpo em movimento',
    descricao: 'Complete 20 missões de saúde',
    concluida: false,
    progresso: 12,
    total: 20,
  },
]

// Estatísticas do usuário
const estatisticas = [
  { icone: '📈', valor: usuario.nivel, label: 'Nível' },
  { icone: '🔥', valor: '7 Dias', label: 'Sequência' },
  { icone: '🎯', valor: 47, label: 'Missões' },
  { icone: '🏆', valor: usuario.rank, label: 'Rank', destaque: true },
  { icone: '⭐', valor: '4.750', label: 'XP Total' },
  { icone: '💰', valor: usuario.gold, label: 'Gold' },
]

function Perfil() {
  const xpPorcentagem = Math.round((usuario.xp / usuario.xpProximoNivel) * 100)

  return (
    <div className="perfil">

      {/* Cabeçalho */}
      <div className="perfil__header">
        <div className="perfil__header-icon">👤</div>
        <div>
          <h1 className="perfil__titulo">Perfil</h1>
          <p className="perfil__subtitulo">Acompanhe suas conquistas e estatísticas</p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="perfil__content">

        {/* Card do usuário */}
        <div className="perfil__card-usuario">
          <div className="perfil__avatar">J</div>
          <h2 className="perfil__nome">{usuario.nome}</h2>
          <p className="perfil__membro">Membro desde 20/05/2026</p>
          <span className="perfil__rank">🏆 {usuario.rank}</span>

          {/* XP */}
          <div className="perfil__xp">
            <div className="perfil__xp-label">
              <span>Nível</span>
              <span>{usuario.nivel}</span>
            </div>
            <div className="perfil__xp-label">
              <span>XP</span>
              <span>{usuario.xp}/{usuario.xpProximoNivel}</span>
            </div>
            <div className="perfil__xp-bar">
              <div className="perfil__xp-fill" style={{ width: `${xpPorcentagem}%` }}></div>
            </div>
          </div>

          <button className="perfil__btn-editar">Editar perfil</button>
        </div>

        {/* Estatísticas */}
        <div className="perfil__estatisticas">
          <h2 className="perfil__estatisticas-titulo">Estatísticas</h2>
          <div className="perfil__stats-grid">
            {estatisticas.map((stat, index) => (
              <div key={index} className="perfil__stat-card">
                <span className="perfil__stat-icone">{stat.icone}</span>
                <span className={`perfil__stat-valor ${stat.destaque ? 'perfil__stat-valor--destaque' : ''}`}>
                  {stat.valor}
                </span>
                <span className="perfil__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Conquistas */}
      <div className="perfil__conquistas">
        <div className="perfil__conquistas-header">
          <h2 className="perfil__conquistas-titulo">Conquistas</h2>
          <span className="perfil__conquistas-sub">1 de 50 desbloqueadas</span>
        </div>

        <div className="perfil__conquistas-lista">
          {conquistas.map(conquista => (
            <div
              key={conquista.id}
              className={`conquista-card ${conquista.concluida ? 'conquista-card--concluida' : ''}`}
            >
              <div className="conquista-card__icone">
                {conquista.concluida ? '✅' : '🎯'}
              </div>
              <div className="conquista-card__body">
                <div className="conquista-card__header">
                  <h3 className="conquista-card__titulo">{conquista.titulo}</h3>
                  {conquista.concluida && (
                    <span className="conquista-card__badge">Completa</span>
                  )}
                </div>
                <p className="conquista-card__descricao">{conquista.descricao}</p>
                {conquista.concluida ? (
                  <p className="conquista-card__data">Desbloqueada em {conquista.dataDesbloqueio}</p>
                ) : (
                  <div className="conquista-card__progresso">
                    <div className="conquista-card__progresso-info">
                      <span>Progresso</span>
                      <span>{conquista.progresso}/{conquista.total}</span>
                    </div>
                    <div className="conquista-card__bar">
                      <div
                        className="conquista-card__bar-fill"
                        style={{ width: `${Math.round((conquista.progresso / conquista.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="perfil__conquistas-footer">
          <button className="perfil__btn-todas">Todas conquistas →</button>
        </div>
      </div>

    </div>
  )
}

export default Perfil