import Icon from '../../components/Icon'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { requisicao } from '../../services/api'
import MissionCard from '../../components/MissionCard/MissionCard'
import ModalNovaMissao from '../../components/ModalNovaMissao/ModalNovaMissao'
import CircularProgress from '../../components/CircularProgress/CircularProgress'
import './Missoes.css'

const filtros = ['Todas', 'Diária', 'Semanal', 'Especial']

function Missoes() {
  const [missoes, setMissoes] = useState([])
  const { usuario, token, atualizarUsuario, sair } = useAuth()
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

  function tratarErro(e) {
    if (e.status === 401) sair()
    else setErro(e.message)
  }
  const [filtroAtivo, setFiltroAtivo] = useState('Todas')
  const [modalAberto, setModalAberto] = useState(false)
  // modalAberto controla se o modal aparece ou não

  const missoesFiltradas = filtroAtivo === 'Todas'
    ? missoes
    : missoes.filter(m => m.tipo === filtroAtivo)

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
    } catch (e) { tratarErro(e); return false }
    finally { trava.current = false; setOcupado(false) }
  }

  // Adiciona a nova missão criada no modal à lista
  async function handleCriarMissao(novaMissao) {
    try {
      const criada = await requisicao('/api/missoes', { method: 'POST', token, body: novaMissao })
      setMissoes(atuais => [criada, ...atuais])
      setErro('')
    } catch (e) { if (e.status === 401) sair(); throw e }
  }

  async function handleExcluir(id) {
    if (trava.current || !window.confirm('Excluir esta missão? As recompensas já recebidas serão mantidas.')) return
    trava.current = true
    setOcupado(true)
    setErro('')
    try {
      await requisicao(`/api/missoes/${id}`, { method: 'DELETE', token })
      setMissoes(atuais => atuais.filter(m => m.id !== id))
    } catch (e) { tratarErro(e) }
    finally { trava.current = false; setOcupado(false) }
  }

  const concluidas = missoes.filter(m => m.concluida).length
  const total = missoes.length
  const progresso = total ? Math.round((concluidas / total) * 100) : 0

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
          <div className="missoes__header-icon"><Icon name="target"/></div>
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
        <span className="missoes__filtros-label"><Icon name="search"/> Filtrar:</span>
        {filtros.map(filtro => (
          <button
            key={filtro}
            className={`missoes__filtro ${filtroAtivo === filtro ? 'missoes__filtro--ativo' : ''}`}
            onClick={() => setFiltroAtivo(filtro)}
          >
            {{ Todas: 'Todas', Diária: 'Diárias', Semanal: 'Semanais', Especial: 'Especiais' }[filtro]}
          </button>
        ))}
      </div>

      {/* Grid de missões */}
      {erro && <p role="alert">{erro} <button onClick={() => window.location.reload()}>Tentar novamente</button></p>}
      {carregando && <p role="status">Carregando missões...</p>}
      {!carregando && !erro && !missoesFiltradas.length && <p>Nenhuma missão encontrada. Crie uma nova missão para começar.</p>}
      <div className="missoes__grid">
        {missoesFiltradas.map(missao => (
          <MissionCard
            key={missao.id}
            missao={missao}
            onConcluir={handleConcluir}
            onExcluir={handleExcluir}
            ocupado={ocupado}
          />
        ))}
      </div>

    </div>
  )
}

export default Missoes
