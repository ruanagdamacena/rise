import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [form, setForm] = useState({ email: '', senha: '' })

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  const navigate = useNavigate()

function handleSubmit() {
  // Futuramente vai validar com o backend
  // Por enquanto redireciona direto para o dashboard
  navigate('/')
}

  return (
    <div className="login">

      {/* Lado esquerdo — decorativo */}
      <div className="login__esquerda">
        <div className="login__esquerda-content">
          <h1 className="login__brand">Rise</h1>
          <p className="login__brand-slogan">busque sua melhor versão</p>
          <p className="login__brand-desc">
            Complete missões, evolua seu personagem e conquiste a melhor versão de você mesmo.
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="login__direita">
        <div className="login__box">

          <h2 className="login__titulo">Entrar na conta</h2>
          <p className="login__subtitulo">Bem-vindo de volta, jogador.</p>

          {/* Email */}
          <div className="login__campo">
            <label className="login__label">Email</label>
            <input
              className="login__input"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          {/* Senha */}
          <div className="login__campo">
            <label className="login__label">Senha</label>
            <input
              className="login__input"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => handleChange('senha', e.target.value)}
            />
          </div>

          {/* Botão entrar */}
          <button className="login__btn" onClick={handleSubmit}>
            Entrar
          </button>

          {/* Link para cadastro */}
          <p className="login__cadastro">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="login__link">Criar conta</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login