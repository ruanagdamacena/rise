import Icon from '../Icon'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Sidebar.css'

// Ícones temporários em texto — vamos substituir por ícones reais depois
function Sidebar() {
  const navigate = useNavigate()
  const { sair, usuario } = useAuth()
  const xpPercentual = usuario?.xp_proximo_nivel > 0
    ? Math.min(100, Math.round(usuario.xp / usuario.xp_proximo_nivel * 100)) : 0

  function handleSair() {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">

      {/* Logo do projeto */}
      <div className="sidebar__logo">
        <h1 className="sidebar__logo-title">Rise</h1>
        <span className="sidebar__logo-slogan">busque sua melhor versão</span>
      </div>

      {/* Perfil do usuário */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">{usuario?.nome?.charAt(0).toUpperCase()}</div>
        <div className="sidebar__profile-info">
          <span className="sidebar__profile-name">{usuario?.nome}</span>
          <span className="sidebar__profile-level">Nível {usuario?.nivel}</span>
        </div>
      </div>

      {/* Barra de XP */}
      <div className="sidebar__xp">
        <div className="sidebar__xp-label">
          <span>XP</span>
          <span>{usuario?.xp}/{usuario?.xp_proximo_nivel}</span>
        </div>
        <div className="sidebar__xp-bar">
          <div className="sidebar__xp-fill" style={{ width: `${xpPercentual}%` }}></div>
        </div>
        {/* Rank e Gold */}
        <div className="sidebar__badges">
          <span className="sidebar__badge"><Icon name="trophy"/> {usuario?.patente}</span>
          <span className="sidebar__badge"><Icon name="coin"/> {usuario?.gold}</span>
        </div>
      </div>

      {/* Divisor */}
      <div className="sidebar__divider"></div>

      <nav className="sidebar__nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          <Icon name="home"/> Início
        </NavLink>
        <NavLink to="/missoes" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          <Icon name="target"/> Missões
        </NavLink>
        <NavLink to="/perfil" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          <Icon name="user"/> Perfil
        </NavLink>
        <NavLink to="/conquistas" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          <Icon name="trophy"/> Conquistas
        </NavLink>
      </nav>

      {/* Botão sair */}
      <div className="sidebar__footer">
        <div className="sidebar__divider"></div>
        <button className="sidebar__logout" onClick={handleSair}>
        <Icon name="logout"/> Sair
        </button>
      </div>

    </aside>
  )
}

export default Sidebar
