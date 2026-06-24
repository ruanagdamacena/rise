import { useState } from 'react'
import './ModalNovaMissao.css'

// Opções disponíveis para cada campo
const categorias = ['Saúde', 'Conhecimento', 'Produtividade', 'Desenvolvimento Pessoal']
const tipos = ['Diária', 'Semanal', 'Especial']
const dificuldades = ['Fácil', 'Médio', 'Difícil']

// XP e Gold por dificuldade — segue as regras do sistema
const recompensasPorDificuldade = {
  'Fácil':  { xp: 10,  gold: 3  },
  'Médio':  { xp: 25,  gold: 10 },
  'Difícil':{ xp: 50,  gold: 20 },
}

function ModalNovaMissao({ onFechar, onCriar }) {
  // Estado do formulário
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Saúde',
    tipo: 'Diária',
    dificuldade: 'Fácil',
  })

  // Atualiza qualquer campo do formulário
  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  // Submete o formulário
  function handleSubmit() {
    if (!form.titulo.trim()) return // Título obrigatório

    const recompensas = recompensasPorDificuldade[form.dificuldade]

    // Cria o objeto da nova missão
    const novaMissao = {
      id: Date.now(), // ID temporário baseado no tempo
      ...form,
      xp: recompensas.xp,
      gold: recompensas.gold,
      concluida: false,
    }

    onCriar(novaMissao) // Envia para o componente pai
    onFechar()          // Fecha o modal
  }

  return (
    // Fundo escuro ao redor do modal — clica para fechar
    <div className="modal-overlay" onClick={onFechar}>

      {/* Para o clique dentro do modal de fechar */}
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Cabeçalho do modal */}
        <div className="modal__header">
          <h2 className="modal__titulo">Nova Missão</h2>
          <button className="modal__fechar" onClick={onFechar}>✕</button>
        </div>

        {/* Formulário */}
        <div className="modal__body">

          {/* Título */}
          <div className="modal__campo">
            <label className="modal__label">Título</label>
            <input
              className="modal__input"
              type="text"
              placeholder="Ex: Meditar por 10 minutos"
              value={form.titulo}
              onChange={e => handleChange('titulo', e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="modal__campo">
            <label className="modal__label">Descrição</label>
            <textarea
              className="modal__input modal__textarea"
              placeholder="Descreva o que precisa ser feito..."
              value={form.descricao}
              onChange={e => handleChange('descricao', e.target.value)}
            />
          </div>

          {/* Linha com categoria e tipo */}
          <div className="modal__linha">
            <div className="modal__campo">
              <label className="modal__label">Categoria</label>
              <select
                className="modal__input modal__select"
                value={form.categoria}
                onChange={e => handleChange('categoria', e.target.value)}
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="modal__campo">
              <label className="modal__label">Tipo</label>
              <select
                className="modal__input modal__select"
                value={form.tipo}
                onChange={e => handleChange('tipo', e.target.value)}
              >
                {tipos.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dificuldade */}
          <div className="modal__campo">
            <label className="modal__label">Dificuldade</label>
            <div className="modal__dificuldades">
              {dificuldades.map(d => (
                <button
                  key={d}
                  className={`modal__dificuldade ${form.dificuldade === d ? 'modal__dificuldade--ativo' : ''}`}
                  onClick={() => handleChange('dificuldade', d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Preview das recompensas */}
          <div className="modal__recompensas">
            <span className="modal__recompensas-label">Recompensas:</span>
            <span>📈 {recompensasPorDificuldade[form.dificuldade].xp} XP</span>
            <span>💰 {recompensasPorDificuldade[form.dificuldade].gold} Gold</span>
          </div>

        </div>

        {/* Rodapé com botões */}
        <div className="modal__footer">
          <button className="modal__btn-cancelar" onClick={onFechar}>
            Cancelar
          </button>
          <button className="modal__btn-criar" onClick={handleSubmit}>
            Criar Missão
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalNovaMissao