import { useState } from 'react'
import { todasMissoes } from '../../data/mockData'
import MissionCard from '../../components/MissionCard/MissionCard'
import ModalNovaMissao from '../../components/ModalNovaMissao/ModalNovaMissao'
import CircularProgress from '../../components/CircularProgress/CircularProgress'
import './Missoes.css'

const filtros = ['Todas', 'Diária', 'Semanal', 'Especial']

function Missoes() {
  const [missoes, setMissoes] = useState(todasMissoes)
  const [filtroAtivo, setFiltroAtivo] = useState('Todas')
  const [modalAberto, setModalAberto] = useState(false)
  // modalAberto controla se o modal aparece ou não

  const missoesFiltradas = filtroAtivo === 'Todas'
    ? missoes
    : missoes.filter(m => m.tipo === filtroAtivo)

  function handleConcluir(id) {
    setMissoes(missoes.map(m =>
      m.id === id ? { ...m, concluida: true } : m
    ))
  }

  // Adiciona a nova missão criada no modal à lista
  function handleCriarMissao(novaMissao) {
    setMissoes([...missoes, novaMissao])
  }

  const concluidas = missoes.filter(m => m.concluida).length
  const total = missoes.length
  const progresso = Math.round((concluidas / total) * 100)

  return (
    <div className="missoes">

      {/* Modal — só aparece quando modalAberto for true */}
      {modalAberto && (
        <ModalNovaMissao
          onFechar={() => setModalAberto(false)}
          onCriar={handleCriarMissao}
        />
      )}

      {/* Cabeçalho */}
      <div className="missoes__header">
        <div className="missoes__header-left">
          <div className="missoes__header-icon">🎯</div>
          <div>
            <h1 className="missoes__titulo">Missões</h1>
            <p className="missoes__subtitulo">Complete missões e ganhe XP e Gold</p>
          </div>
        </div>
        {/* Botão abre o modal */}
        <button className="missoes__btn-nova" onClick={() => setModalAberto(true)}>
          + Nova Missão
        </button>
      </div>

      {/* Card de progresso */}
      <div className="missoes__progresso">
        <div className="missoes__progresso-info">
          <span className="missoes__progresso-label">Progresso</span>
          <span className="missoes__progresso-valor">{concluidas}/{total}</span>
          <span className="missoes__progresso-sub">Missões concluídas</span>
        </div>
        <CircularProgress porcentagem={progresso} tamanho={100} espessura={8} />
      </div>

      {/* Filtros */}
      <div className="missoes__filtros">
        <span className="missoes__filtros-label">🔍 Filtrar:</span>
        {filtros.map(filtro => (
          <button
            key={filtro}
            className={`missoes__filtro ${filtroAtivo === filtro ? 'missoes__filtro--ativo' : ''}`}
            onClick={() => setFiltroAtivo(filtro)}
          >
            {filtro}s
          </button>
        ))}
      </div>

      {/* Grid de missões */}
      <div className="missoes__grid">
        {missoesFiltradas.map(missao => (
          <MissionCard
            key={missao.id}
            missao={missao}
            onConcluir={handleConcluir}
          />
        ))}
      </div>

    </div>
  )
}

export default Missoes