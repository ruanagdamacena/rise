import './CircularProgress.css'

// Componente de barra de progresso circular com porcentagem no meio
function CircularProgress({ porcentagem, tamanho = 120, espessura = 10 }) {
  const raio = (tamanho - espessura) / 2
  // Circunferência total do círculo
  const circunferencia = 2 * Math.PI * raio
  // Quanto da circunferência fica preenchido
  const preenchido = circunferencia - (porcentagem / 100) * circunferencia

  return (
    <div className="circular-progress" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho}>
        {/* Círculo de fundo — trilho cinza */}
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={espessura}
        />
        {/* Círculo de progresso — roxo */}
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={preenchido}
          // Começa do topo (rotaciona -90 graus)
          transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Porcentagem no centro */}
      <span className="circular-progress__texto">{porcentagem}%</span>
    </div>
  )
}

export default CircularProgress