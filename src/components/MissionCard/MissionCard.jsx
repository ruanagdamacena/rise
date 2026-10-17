import Icon from '../Icon'
import { useRef } from 'react'
import './MissionCard.css'

const corDificuldade = {
  'Fácil': '#4caf50',
  'Médio': '#ff9800',
  'Difícil': '#f44336',
  'Missão': '#b03fff',
}

function MissionCard({ missao, onConcluir, onExcluir, ocupado = false }) {
  const btnRef = useRef(null)

  async function handleConcluir() {
    const sucesso = await onConcluir(missao.id)
    if (sucesso === false) return
    import('canvas-confetti').then(module => {
      module.default({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b03fff', '#f1efdf', '#ffffff', '#7e2db5'],
      })
    }).catch(() => {})
  }

  return (
    <div className={`mission-card ${missao.concluida ? 'mission-card--concluida' : ''}`}>

      <div className="mission-card__status">
        <div className={`mission-card__circle ${missao.concluida ? 'mission-card__circle--done' : ''}`}>
          {missao.concluida && '✓'}
        </div>
      </div>

      <div className="mission-card__body">
        <h3 className="mission-card__titulo">{missao.titulo}</h3>
        <p className="mission-card__descricao">{missao.descricao}</p>

        <div className="mission-card__tags">
          <span className="mission-card__tag mission-card__tag--tipo">
            {missao.tipo}
          </span>
          <span
            className="mission-card__tag"
            style={{ backgroundColor: corDificuldade[missao.dificuldade] + '33', color: corDificuldade[missao.dificuldade] }}
          >
            {missao.dificuldade}
          </span>
        </div>

        <div className="mission-card__recompensas">
          <span><Icon name="trend"/> {missao.xp} XP</span>
          <span><Icon name="coin"/> {missao.gold} Gold</span>
        </div>
      </div>

      <div className="mission-card__action">
        {missao.concluida ? (
          <span className="mission-card__concluida-label">Concluído ✓</span>
        ) : (
          <button
            ref={btnRef}
            className="mission-card__btn"
            onClick={handleConcluir}
            disabled={ocupado}
          >
            Concluir
          </button>
        )}
        {onExcluir && <button className="mission-card__btn mission-card__btn--excluir" disabled={ocupado} onClick={() => onExcluir(missao.id)}>Excluir</button>}
      </div>

    </div>
  )
}

export default MissionCard
