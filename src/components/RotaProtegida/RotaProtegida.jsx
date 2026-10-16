import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Só deixa passar quem está logado. Quem não está vai para a tela de login.
function RotaProtegida() {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RotaProtegida