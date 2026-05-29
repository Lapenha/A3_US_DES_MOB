/**
 * @fileoverview Tela de setup do Jogo da Memória — coleta o nome do jogador.
 *
 * Heurísticas de Nielsen aplicadas:
 * - Prevenção de erros: valida o nome antes de iniciar
 * - Estética e design minimalista: formulário simples, foco único
 * - Reconhecimento em vez de memorização: instruções visuais inline
 */

import { useState } from 'react';
import './PlayerSetup.css';

const INSTRUCTIONS = [
  { icon: '👆', text: 'Clique em duas cartas para virá-las' },
  { icon: '🐘', text: 'Encontre os 8 pares de animais' },
  { icon: '📚', text: 'Aprenda sobre espécies ameaçadas' },
  { icon: '⏱️', text: 'Complete com menos jogadas!' },
];

/**
 * @param {object}   props
 * @param {Function} props.onStartGame - Chamado com { playerName: string }
 */
const PlayerSetup = ({ onStartGame }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe seu nome para começar.');
      return;
    }
    onStartGame({ playerName: name.trim() });
  };

  return (
    <div className="player-setup">
      <header className="player-setup__header text-center mb-4">
        <div className="ods-badge mb-2">
          <span>🌿 ODS 15 – Vida Terrestre</span>
        </div>
        <h1 className="player-setup__title">Jogo da Memória</h1>
        <p className="player-setup__subtitle">Animais em Extinção · Educativo &amp; Interativo</p>
      </header>

      <div className="setup-card card shadow-sm mb-4">
        <div className="card-body p-4">
          <p className="setup-description text-center mb-4">
            Encontre todos os <strong>8 pares</strong> de animais ameaçados de extinção.<br />
            Cada par revelado traz uma curiosidade educativa sobre a espécie! 🦁
          </p>

          <form onSubmit={handleSubmit} noValidate aria-label="Início do jogo">
            <div className="mb-3">
              <label htmlFor="playerName" className="form-label fw-semibold">
                Seu nome
              </label>
              <input
                id="playerName"
                type="text"
                className={`form-control form-control-lg text-center ${error ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Digite seu nome"
                maxLength={20}
                autoFocus
                aria-describedby={error ? 'nameErr' : undefined}
              />
              {error && (
                <div id="nameErr" className="invalid-feedback text-center">
                  {error}
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success btn-lg px-5 start-btn">
                🎮 Iniciar Jogo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-3 text-center">
        {INSTRUCTIONS.map(({ icon, text }) => (
          <div key={text} className="col-6 col-md-3">
            <div className="instruction-card">
              <span className="instruction-card__icon" aria-hidden="true">
                {icon}
              </span>
              <p className="instruction-card__text">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSetup;
