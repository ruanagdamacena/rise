import { useState } from 'react'
import { usuario, missoesDoDia } from '../../data/mockData'
import MissionCard from '../../components/MissionCard/MissionCard'
import CircularProgress from '../../components/CircularProgress/CircularProgress'
import './Dashboard.css'

function Dashboard() {
  // Estado das missões — começa com os dados do mockData
  const [missoes, setMissoes] = useState(missoesDoDia)

  // Função chamada ao clicar em "Concluir" em uma missão
  function handleConcluir(id) {
    setMissoes(missoes.map(m =>
      m.id === id ? { ...m, concluida: true } : m
    ))
  }

  // Calcula quantas missões foram concluídas
  const concluidas = missoes.filter(m => m.concluida).length
  const total = missoes.length
  const progresso = Math.round((concluidas / total) * 100)

  // Calcula porcentagem de XP para a barra
  const xpPorcentagem = Math.round((usuario.xp / usuario.xpProximoNivel) * 100)

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
          <span className="stat-card__sub">{usuario.xp}/{usuario.xpProximoNivel} XP</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Rank Atual</span>
          <span className="stat-card__value stat-card__value--rank">{usuario.rank}</span>
          <span className="stat-card__sub">Continue evoluindo</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Gold</span>
          <span className="stat-card__value">💰 {usuario.gold}</span>
          <span className="stat-card__sub">Em sua conta</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Sequência</span>
          <span className="stat-card__value">🔥 {usuario.sequencia}</span>
          <span className="stat-card__sub">Dias consecutivos</span>
        </div>

      </div>

     {/* Progresso diário */}
      <div className="dashboard__progresso">
        <div className="dashboard__progresso-header">
          <div>
            <h2 className="dashboard__progresso-titulo">Progresso diário</h2>
            <p className="dashboard__progresso-sub">{concluidas} de {total} missões concluídas</p>
          </div>
          <CircularProgress porcentagem={progresso} tamanho={100} espessura={8} />
        </div>
      </div>

      {/* Missões do dia */}
      <div className="dashboard__missoes">
        <h2 className="dashboard__missoes-titulo">Missões de hoje</h2>
        <p className="dashboard__missoes-sub">Conclua suas missões diárias</p>

        <div className="dashboard__missoes-lista">
          {missoes.map(missao => (
            <MissionCard
              key={missao.id}
              missao={missao}
              onConcluir={handleConcluir}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard