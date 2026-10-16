import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import RotaProtegida from './components/RotaProtegida/RotaProtegida'
import Dashboard from './pages/Dashboard/Dashboard'
import Missoes from './pages/Missoes/Missoes'
import Perfil from './pages/Perfil/Perfil'
import Conquistas from './pages/Conquistas/Conquistas'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Tudo aqui dentro exige estar logado */}
      <Route element={<RotaProtegida />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/missoes" element={<Missoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/conquistas" element={<Conquistas />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App