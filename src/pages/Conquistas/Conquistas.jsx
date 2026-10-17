import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { requisicao } from '../../services/api'
import Icon from '../../components/Icon'
import './Conquistas.css'

function Conquistas() {
  const { usuario, token } = useAuth()
  const [conquistas, setConquistas] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const usuarioId = usuario.id
  useEffect(() => {
    const controle = new AbortController()
    requisicao(`/api/conquistas/${usuarioId}`, { token, signal: controle.signal })
      .then(setConquistas)
      .catch(e => {
        if (e.name === 'AbortError') return
        if (e.status === 401) { localStorage.removeItem('rise_auth'); window.location.replace('/login'); return }
        setErro(e.message)
      })
      .finally(() => { if (!controle.signal.aborted) setCarregando(false) })
    return () => controle.abort()
  }, [usuarioId, token])
  const concluidas = conquistas.filter(c => c.concluida).length
  const total = conquistas.length

  return (
    <div className="conquistas">

      {/* Cabeçalho */}
      <div className="conquistas__header">
        <div className="conquistas__header-icon"><Icon name="trophy"/></div>
        <div>
          <h1 className="conquistas__titulo">Conquistas</h1>
          <p className="conquistas__subtitulo">Desbloqueie marcos da sua evolução</p>
        </div>
        <span className="conquistas__contador">{concluidas} de {total} desbloqueadas</span>
      </div>

      {/* Lista de conquistas */}
      <div className="conquistas__lista">{carregando && <p role="status">Carregando conquistas...</p>}{erro && <p role="alert">{erro} <button onClick={() => window.location.reload()}>Tentar novamente</button></p>}
        {conquistas.map(conquista => {
          const porcentagem = conquista.total > 0 ? Math.min(100, Math.round((conquista.progresso / conquista.total) * 100)) : 0

          return (
            <div
              key={conquista.id}
              className={`conquista ${conquista.concluida ? 'conquista--concluida' : ''}`}
            >
              {/* Ícone */}
              <div className={`conquista__icone ${conquista.concluida ? 'conquista__icone--ativo' : ''}`}>
                <Icon name="target"/>
              </div>

              {/* Conteúdo */}
              <div className="conquista__body">
                <div className="conquista__topo">
                  <h3 className="conquista__titulo">{conquista.titulo}</h3>
                  {conquista.concluida && (
                    <span className="conquista__badge">Completa</span>
                  )}
                </div>
                <p className="conquista__descricao">{conquista.descricao}</p>{conquista.metrica === 'semana_perfeita' && <p className="conquista__descricao">Crie ao menos uma diária por dia e conclua todas no próprio dia. Contam apenas dias encerrados; o desbloqueio é verificado na próxima conclusão de missão.</p>}

                {/* Barra de progresso */}
                <div className="conquista__progresso">
                  <div className="conquista__progresso-info">
                    <span>Progresso</span>
                    <span>{conquista.progresso}/{conquista.total}</span>
                  </div>
                  <div className="conquista__bar">
                    <div
                      className="conquista__bar-fill"
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>
                </div>

                {conquista.concluida && (
                  <p className="conquista__data">Desbloqueada em {new Date(conquista.desbloqueado_em + 'Z').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Conquistas