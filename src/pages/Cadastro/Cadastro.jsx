import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Cadastro.css'

function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function handleSubmit() {
    setErro('')

    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha nome, email e senha.')
      return
    }
    if (form.senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem!')
      return
    }

    setCarregando(true)
    try {
      await cadastrar(form.nome, form.email, form.senha)
      navigate('/')
    } catch (e) {
      setErro(
        e.message === 'Failed to fetch'
          ? 'Não foi possível conectar ao servidor.'
          : e.message
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="cadastro">

      {/* Lado esquerdo — decorativo */}
      <div className="cadastro__esquerda">
        <div className="cadastro__esquerda-content">
          <h1 className="cadastro__brand">Rise</h1>
          <p className="cadastro__brand-slogan">busque sua melhor versão</p>
          <p className="cadastro__brand-desc">
            Comece sua jornada hoje. Complete missões, ganhe XP e evolua para a melhor versão de você mesmo.
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="cadastro__direita">
        <div className="cadastro__box">

          <h2 className="cadastro__titulo">Criar conta</h2>
          <p className="cadastro__subtitulo">Comece sua jornada agora.</p>

          {/* Nome */}
          <div className="cadastro__campo">
            <label className="cadastro__label">Nome</label>
            <input
              className="cadastro__input"
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={e => handleChange('nome', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="cadastro__campo">
            <label className="cadastro__label">Email</label>
            <input
              className="cadastro__input"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          {/* Senha */}
          <div className="cadastro__campo">
            <label className="cadastro__label">Senha</label>
            <input
              className="cadastro__input"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => handleChange('senha', e.target.value)}
            />
          </div>

          {/* Confirmar senha */}
          <div className="cadastro__campo">
            <label className="cadastro__label">Confirmar senha</label>
            <input
              className="cadastro__input"
              type="password"
              placeholder="••••••••"
              value={form.confirmarSenha}
              onChange={e => handleChange('confirmarSenha', e.target.value)}
            />
          </div>

          {/* Mensagem de erro (só aparece quando há erro) */}
          {erro && (
            <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '0 0 12px' }}>
              {erro}
            </p>
          )}

          {/* Botão criar conta */}
          <button className="cadastro__btn" onClick={handleSubmit} disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar conta'}
          </button>

          {/* Link para login */}
          <p className="cadastro__login">
            Já tem uma conta?{' '}
            <Link to="/login" className="cadastro__link">Entrar</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Cadastro