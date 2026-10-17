import Icon from '../../components/Icon'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import './Perfil.css'

function Perfil() {
  const { usuario } = useAuth()
  const location = useLocation()
  const estatisticas = [
    { icone: <Icon name="trend"/>, valor: usuario.nivel, label: 'Nível' },
    { icone: <Icon name="flame"/>, valor: usuario.sequencia, label: 'Dias em sequência' },
    { icone: <Icon name="trophy"/>, valor: usuario.patente, label: 'Patente', destaque: true },
    { icone: <Icon name="star"/>, valor: usuario.xp, label: 'XP no nível atual' },
    { icone: <Icon name="coin"/>, valor: usuario.gold, label: 'Gold' },
  ]
  const xpPorcentagem = Math.round((usuario.xp / usuario.xp_proximo_nivel) * 100)

  return (
    <div className="perfil">{location.state?.salvo && <p role="status">Perfil atualizado com sucesso.</p>}

      {/* Cabeçalho */}
      <div className="perfil__header">
        <div className="perfil__header-icon"><Icon name="user"/></div>
        <div>
          <h1 className="perfil__titulo">Perfil</h1>
          <p className="perfil__subtitulo">Acompanhe suas conquistas e estatísticas</p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="perfil__content">

        {/* Card do usuário */}
        <div className="perfil__card-usuario">
          <div className="perfil__avatar">{usuario.nome?.charAt(0).toUpperCase()}</div>
          <h2 className="perfil__nome">{usuario.nome}</h2>
          <p className="perfil__membro">Membro desde {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</p>
          <span className="perfil__rank"><Icon name="trophy"/> {usuario.patente}</span>

          {/* XP */}
          <div className="perfil__xp">
            <div className="perfil__xp-label">
              <span>Nível</span>
              <span>{usuario.nivel}</span>
            </div>
            <div className="perfil__xp-label">
              <span>XP</span>
              <span>{usuario.xp}/{usuario.xp_proximo_nivel}</span>
            </div>
            <div className="perfil__xp-bar">
              <div className="perfil__xp-fill" style={{ width: `${xpPorcentagem}%` }}></div>
            </div>
          </div>

          <Link className="perfil__btn-editar" to="/perfil/editar">Editar perfil</Link>
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

      <Link className="perfil__btn-todas" to="/conquistas">Ver conquistas →</Link>
    </div>
  )
}

export default Perfil
