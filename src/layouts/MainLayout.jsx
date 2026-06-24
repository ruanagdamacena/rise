import { Outlet } from 'react-router-dom'
// Outlet é o espaço onde o conteúdo de cada página vai aparecer
import Sidebar from '../components/Sidebar/Sidebar'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">

      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Área de conteúdo — muda conforme a página */}
      <main className="main-layout__content">
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayout