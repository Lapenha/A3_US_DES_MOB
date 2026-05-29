/**
 * @fileoverview Componente de configuração de jogadores.
 *
 * Permite que cada jogador informe seu nome e escolha um animal.
 * Validações inline evitam progressão com dados incompletos.
 *
 * Heurísticas de Nielsen aplicadas:
 * - Prevenção de erros: validação de formulário antes do envio
 * - Reconhecimento em vez de memorização: grade visual de animais com emoji + nome
 * - Estética e design minimalista: layout de dois cards lado a lado
 * - Controle e liberdade do usuário: pode alterar seleção a qualquer momento
 */

import { useState } from 'react';
import { ANIMALS } from '../../domain/constants';
import './PlayerSetup.css';

// ─── Sub-componente ──────────────────────────────────────────────────────────

/**
 * Card clicável representando um animal.
 * @param {object}   props
 * @param {import('../../domain/constants').Animal} props.animal
 * @param {boolean}  props.isSelected - Se este animal está selecionado pelo jogador atual
 * @param {boolean}  props.isDisabled - Se este animal já foi escolhido pelo outro jogador
 * @param {Function} props.onSelect   - Callback ao clicar
 */
const AnimalCard = ({ animal, isSelected, isDisabled, onSelect }) => (
  <button
    type="button"
    className={`animal-card ${isSelected ? 'animal-card--selected' : ''} ${isDisabled ? 'animal-card--disabled' : ''}`}
    style={{ '--animal-color': animal.color, '--animal-bg': animal.bgColor, '--animal-border': animal.borderColor }}
    onClick={() => !isDisabled && onSelect(animal)}
    aria-label={`Selecionar ${animal.name}`}
    aria-pressed={isSelected}
    disabled={isDisabled && !isSelected}
    title={isDisabled ? 'Animal já escolhido pelo outro jogador' : animal.name}
  >
    <span className="animal-card__emoji" role="img" aria-hidden="true">
      {animal.emoji}
    </span>
    <span className="animal-card__name">{animal.name}</span>
  </button>
);

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Tela de setup: coleta nomes e escolha de animais dos dois jogadores.
 * @param {object}   props
 * @param {Function} props.onStartGame - Callback chamado com { player1, player2 } ao confirmar
 */
const PlayerSetup = ({ onStartGame }) => {
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p1Animal, setP1Animal] = useState(null);
  const [p2Animal, setP2Animal] = useState(null);
  const [errors, setErrors] = useState({});

  /** Valida todos os campos e retorna um mapa de erros. */
  const validate = () => {
    const e = {};
    if (!p1Name.trim()) e.p1Name = 'Informe o nome do Jogador 1.';
    if (!p2Name.trim()) e.p2Name = 'Informe o nome do Jogador 2.';
    if (!p1Animal) e.p1Animal = 'Escolha um animal para o Jogador 1.';
    if (!p2Animal) e.p2Animal = 'Escolha um animal para o Jogador 2.';
    if (
      p1Name.trim() &&
      p2Name.trim() &&
      p1Name.trim().toLowerCase() === p2Name.trim().toLowerCase()
    ) {
      e.p2Name = 'Os jogadores devem ter nomes diferentes.';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onStartGame({
      player1: { name: p1Name.trim(), animal: p1Animal },
      player2: { name: p2Name.trim(), animal: p2Animal },
    });
  };

  /** Limpa o erro de um campo específico ao editar. */
  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="player-setup">
      {/* Cabeçalho com badge ODS 15 */}
      <header className="player-setup__header text-center mb-4">
        <div className="ods-badge mb-2">
          <span>🌿 ODS 15 – Vida Terrestre</span>
        </div>
        <h1 className="player-setup__title">Jogo da Velha</h1>
        <p className="player-setup__subtitle">Animais em Extinção · Educativo &amp; Interativo</p>
      </header>

      <form onSubmit={handleSubmit} noValidate aria-label="Configuração de jogadores">
        <div className="row g-4">
          {/* ── Jogador 1 ── */}
          <div className="col-md-6">
            <div className="player-card player-card--p1 card shadow-sm h-100">
              <div className="card-body">
                <h2 className="player-card__title">
                  <span className="player-badge player-badge--p1">1</span>
                  Jogador 1
                </h2>

                <div className="mb-3">
                  <label htmlFor="p1Name" className="form-label fw-semibold">
                    Nome
                  </label>
                  <input
                    id="p1Name"
                    type="text"
                    className={`form-control ${errors.p1Name ? 'is-invalid' : ''}`}
                    value={p1Name}
                    onChange={(ev) => { setP1Name(ev.target.value); clearError('p1Name'); }}
                    placeholder="Digite seu nome"
                    maxLength={20}
                    aria-describedby={errors.p1Name ? 'p1NameErr' : undefined}
                  />
                  {errors.p1Name && (
                    <div id="p1NameErr" className="invalid-feedback">{errors.p1Name}</div>
                  )}
                </div>

                <div>
                  <p className="fw-semibold mb-2">Escolha seu animal</p>
                  {errors.p1Animal && (
                    <p className="text-danger small mb-2" role="alert">{errors.p1Animal}</p>
                  )}
                  <div className="animal-grid">
                    {ANIMALS.map((animal) => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        isSelected={p1Animal?.id === animal.id}
                        isDisabled={p2Animal?.id === animal.id}
                        onSelect={setP1Animal}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Jogador 2 ── */}
          <div className="col-md-6">
            <div className="player-card player-card--p2 card shadow-sm h-100">
              <div className="card-body">
                <h2 className="player-card__title">
                  <span className="player-badge player-badge--p2">2</span>
                  Jogador 2
                </h2>

                <div className="mb-3">
                  <label htmlFor="p2Name" className="form-label fw-semibold">
                    Nome
                  </label>
                  <input
                    id="p2Name"
                    type="text"
                    className={`form-control ${errors.p2Name ? 'is-invalid' : ''}`}
                    value={p2Name}
                    onChange={(ev) => { setP2Name(ev.target.value); clearError('p2Name'); }}
                    placeholder="Digite seu nome"
                    maxLength={20}
                    aria-describedby={errors.p2Name ? 'p2NameErr' : undefined}
                  />
                  {errors.p2Name && (
                    <div id="p2NameErr" className="invalid-feedback">{errors.p2Name}</div>
                  )}
                </div>

                <div>
                  <p className="fw-semibold mb-2">Escolha seu animal</p>
                  {errors.p2Animal && (
                    <p className="text-danger small mb-2" role="alert">{errors.p2Animal}</p>
                  )}
                  <div className="animal-grid">
                    {ANIMALS.map((animal) => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        isSelected={p2Animal?.id === animal.id}
                        isDisabled={p1Animal?.id === animal.id}
                        onSelect={setP2Animal}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success btn-lg px-5 start-btn">
            🎮 Iniciar Jogo
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerSetup;
