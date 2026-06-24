import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

// Ícones temporários em texto — vamos substituir por ícones reais depois
function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">

      {/* Logo do projeto */}
      <div className="sidebar__logo">
        <h1 className="sidebar__logo-title">Rise</h1>
        <span className="sidebar__logo-slogan">busque sua melhor versão</span>
      </div>

      {/* Perfil do usuário */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">J</div>
        <div className="sidebar__profile-info">
          <span className="sidebar__profile-name">Jogador</span>
          <span className="sidebar__profile-level">Nível 5</span>
        </div>
      </div>

      {/* Barra de XP */}
      <div className="sidebar__xp">
        <div className="sidebar__xp-label">
          <span>XP</span>
          <span>400/1000</span>
        </div>
        <div className="sidebar__xp-bar">
          <div className="sidebar__xp-fill" style={{ width: '40%' }}></div>
        </div>
        {/* Rank e Gold */}
        <div className="sidebar__badges">
          <span className="sidebar__badge">🏆 Bronze II</span>
          <span className="sidebar__badge">💰 2152</span>
        </div>
      </div>

      {/* Divisor */}
      <div className="sidebar__divider"></div>

      <nav className="sidebar__nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          🏠 Início
        </NavLink>
        <NavLink to="/missoes" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          🎯 Missões
        </NavLink>
        <NavLink to="/perfil" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          👤 Perfil
        </NavLink>
        <NavLink to="/conquistas" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
          🏆 Conquistas
        </NavLink>
      </nav>

      {/* Botão sair */}
      <div className="sidebar__footer">
        <div className="sidebar__divider"></div>
        <button className="sidebar__logout" onClick={() => navigate('/login')}>
        🚪 Sair
        </button>
      </div>

    </aside>
  )
}

export default Sidebar