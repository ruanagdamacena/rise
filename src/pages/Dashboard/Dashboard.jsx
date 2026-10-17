import Icon from '../../components/Icon'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { requisicao } from '../../services/api'
import MissionCard from '../../components/MissionCard/MissionCard'
import CircularProgress from '../../components/CircularProgress/CircularProgress'
import './Dashboard.css'

function Dashboard() {
  const { usuario, token, atualizarUsuario, sair } = useAuth()
  const [todasMissoes, setMissoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const trava = useRef(false)
  const usuarioId = usuario.id

  useEffect(() => {
    const controle = new AbortController()
    requisicao(`/api/missoes/${usuarioId}`, { token, signal: controle.signal })
      .then(setMissoes)
      .catch(e => {
        if (e.name === 'AbortError') return
        if (e.status === 401) { localStorage.removeItem('rise_auth'); window.location.replace('/login'); return }
        setErro(e.message)
      })
      .finally(() => { if (!controle.signal.aborted) setCarregando(false) })
    return () => controle.abort()
  }, [token, usuarioId])

  const dataBrasil = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' })
  const hoje = dataBrasil.format(new Date())
  const missoes = todasMissoes.filter(m => m.tipo === 'Diária' && (
    !m.concluida || (m.concluido_em && dataBrasil.format(new Date(m.concluido_em)) === hoje)
  ))

  // Função chamada ao clicar em "Concluir" em uma missão
  async function handleConcluir(id) {
    if (trava.current) return false
    trava.current = true
    setOcupado(true)
    setErro('')
    try {
      const dados = await requisicao(`/api/missoes/${id}/concluir`, { method: 'PATCH', token })
      setMissoes(atuais => atuais.map(m => m.id === id ? dados.missao : m))
      atualizarUsuario(dados.usuario)
      return true
    } catch (e) {
      if (e.status === 401) sair()
      else setErro(e.message)
      return false
    } finally { trava.current = false; setOcupado(false) }
  }

  // Calcula quantas missões foram concluídas
  const concluidas = missoes.filter(m => m.concluida).length
  const total = missoes.length
  const progresso = total ? Math.round((concluidas / total) * 100) : 0

  // Calcula porcentagem de XP para a barra
  const xpPorcentagem = usuario.xp_proximo_nivel > 0 ? Math.min(100, Math.round((usuario.xp / usuario.xp_proximo_nivel) * 100)) : 0

  return (
    <div className="dashboard">

      {/* Cabeçalho */}
      <div className="dashboard__header">
        <h1 className="dashboard__titulo">Olá, {usuario.nome}!</h1>
        <p className="dashboard__subtitulo">
          Continue sua jornada de evolução. Você está progredindo muito bem!
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="dashboard__stats">

        <div className="stat-card">
          <span className="stat-card__label">Nível Atual</span>
          <span className="stat-card__value">{usuario.nivel}</span>
          <div className="stat-card__bar">
            <div className="stat-card__bar-fill" style={{ width: `${xpPorcentagem}%` }}></div>
          </div>
          <span className="stat-card__sub">{usuario.xp}/{usuario.xp_proximo_nivel} XP</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Patente Atual</span>
          <span className="stat-card__value stat-card__value--rank">{usuario.patente}</span>
          <span className="stat-card__sub">Continue evoluindo</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Gold</span>
          <span className="stat-card__value"><Icon name="coin"/> {usuario.gold}</span>
          <span className="stat-card__sub">Em sua conta</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Sequência</span>
          <span className="stat-card__value"><Icon name="flame"/> {usuario.sequencia}</span>
          <span className="stat-card__sub">Dias consecutivos</span>
        </div>

      </div>

     {/* Progresso diário */}
      <div className="dashboard__progresso">
        <div className="dashboard__progresso-header">
          <div>
            <h2 className="dashboard__progresso-titulo">Progresso diário</h2>
            <p className="dashboard__progresso-sub">{carregando ? 'Carregando...' : erro ? 'Não foi possível atualizar o progresso.' : `${concluidas} de ${total} missões concluídas`}</p>
          </div>
          <CircularProgress porcentagem={progresso} tamanho={100} espessura={8} />
        </div>
      </div>

      {/* Missões do dia */}
      <div className="dashboard__missoes">
        <h2 className="dashboard__missoes-titulo">Missões de hoje</h2>
        <p className="dashboard__missoes-sub">Missões diárias pendentes e concluídas hoje</p>
        {carregando && <p role="status">Carregando missões...</p>}
        {erro && <p role="alert">{erro} <button onClick={() => window.location.reload()}>Tentar novamente</button></p>}
        {!carregando && !erro && !missoes.length && <p>Nenhuma missão diária por aqui. Crie uma na página Missões.</p>}

        <div className="dashboard__missoes-lista">
          {missoes.map(missao => (
            <MissionCard
              key={missao.id}
              missao={missao}
              onConcluir={handleConcluir}
              ocupado={ocupado}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
