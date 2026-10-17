import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { requisicao } from '../../services/api'
import Icon from '../../components/Icon'
import './Perfil.css'

export default function EditarPerfil() {
  const { usuario, token, atualizarUsuario, sair } = useAuth()
  const [nome, setNome] = useState(usuario.nome)
  const [email, setEmail] = useState(usuario.email)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function salvar(evento) {
    evento.preventDefault()
    if (salvando) return
    setSalvando(true)
    setErro('')
    try {
      const atualizado = await requisicao(`/api/usuario/${usuario.id}`, { method: 'PUT', token, body: { nome, email } })
      atualizarUsuario(atualizado)
      navigate('/perfil', { replace: true, state: { salvo: true } })
    } catch (e) {
      if (e.status === 401) sair()
      else setErro(e.message)
    } finally { setSalvando(false) }
  }

  return <div className="perfil">
    <div className="perfil__header"><div className="perfil__header-icon"><Icon name="edit" size={28}/></div><div><h1 className="perfil__titulo">Editar perfil</h1><p className="perfil__subtitulo">Deixe seus dados atualizados</p></div></div>
    <form className="perfil__form" onSubmit={salvar}>
      <label htmlFor="perfil-nome">Nome</label>
      <input id="perfil-nome" autoComplete="name" required maxLength={100} value={nome} disabled={salvando} onChange={e => setNome(e.target.value)}/>
      <label htmlFor="perfil-email">Email</label>
      <input id="perfil-email" type="email" autoComplete="email" required maxLength={100} value={email} disabled={salvando} onChange={e => setEmail(e.target.value)}/>
      {erro && <p role="alert">{erro}</p>}
      <button className="perfil__btn-editar" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</button>
      {!salvando && <Link to="/perfil">Cancelar</Link>}
    </form>
  </div>
}
