import { createContext, useContext, useState } from 'react'
import { requisicao } from '../services/api'

const AuthContext = createContext(null)
const CHAVE = 'rise_auth'

function lerSessao() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE))
    return dados?.token && dados?.usuario ? dados : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao)

  function guardarSessao(dados) {
    if (dados) localStorage.setItem(CHAVE, JSON.stringify(dados))
    else localStorage.removeItem(CHAVE)
    setSessao(dados)
  }

  async function autenticar(caminho, body) {
    const dados = await requisicao(caminho, { method: 'POST', body })
    if (!dados?.usuario || !dados?.token) {
      throw new Error('Resposta de autenticação inválida.')
    }
    guardarSessao({ usuario: dados.usuario, token: dados.token })
    return dados.usuario
  }

  function login(email, senha) {
    return autenticar('/api/auth/login', { email, senha })
  }

  function cadastrar(nome, email, senha) {
    return autenticar('/api/auth/cadastro', { nome, email, senha })
  }

  function sair() {
    guardarSessao(null)
  }

  function atualizarUsuario(usuario) {
    if (sessao) guardarSessao({ ...sessao, usuario: { ...sessao.usuario, ...usuario } })
  }

  return (
    <AuthContext.Provider value={{
      usuario: sessao?.usuario ?? null,
      token: sessao?.token ?? null,
      login, cadastrar, sair, atualizarUsuario,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// O contexto e seu hook são mantidos juntos para facilitar o uso nas telas.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth precisa estar dentro de AuthProvider.')
  return contexto
}
