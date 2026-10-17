import { useState } from 'react'
import './ModalNovaMissao.css'

// Opções disponíveis para cada campo
const categorias = ['Saúde', 'Conhecimento', 'Produtividade', 'Desenvolvimento Pessoal']
const tipos = ['Diária', 'Semanal', 'Especial']
const dificuldades = ['Fácil', 'Médio', 'Difícil']


function ModalNovaMissao({ onFechar, onCriar }) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  function fechar() { if (!salvando) onFechar() }
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
  async function handleSubmit() {
    if (salvando) return
    if (!form.titulo.trim()) { setErro('Preencha o título da missão.'); return }
    setSalvando(true)
    setErro('')
    try {
      await onCriar({ ...form, titulo: form.titulo.trim() })
      onFechar()
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  return (
    // Fundo escuro ao redor do modal — clica para fechar
    <div className="modal-overlay" onClick={fechar}>

      {/* Para o clique dentro do modal de fechar */}
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Cabeçalho do modal */}
        <div className="modal__header">
          <h2 className="modal__titulo">Nova Missão</h2>
          <button className="modal__fechar" disabled={salvando} onClick={fechar}>✕</button>
        </div>

        {/* Formulário */}
        <fieldset className="modal__body" disabled={salvando} style={{ border: 0, margin: 0, minWidth: 0 }}>

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
            <span>Ganhe XP e Gold de acordo com a dificuldade escolhida.</span>
          </div>

          {erro && <p role="alert">{erro}</p>}
        </fieldset>

        {/* Rodapé com botões */}
        <div className="modal__footer">
          <button className="modal__btn-cancelar" disabled={salvando} onClick={fechar}>
            Cancelar
          </button>
          <button className="modal__btn-criar" disabled={salvando} onClick={handleSubmit}>
            {salvando ? 'Salvando...' : 'Criar Missão'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalNovaMissao
