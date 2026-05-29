/**
 * @fileoverview Componente de célula individual do tabuleiro.
 *
 * Exibe o emoji do animal do jogador que ocupou a célula,
 * com animação de entrada e destaque nas células vencedoras.
 *
 * Heurísticas de Nielsen aplicadas:
 * - Prevenção de erros: cursor "not-allowed" em células ocupadas
 * - Reconhecimento em vez de memorização: emoji do animal sempre visível
 * - Feedback imediato: animação ao colocar a peça
 */

import './Cell.css';

/**
 * Célula do tabuleiro.
 * @param {object}   props
 * @param {string|null}  props.value        - 'player1', 'player2' ou null
 * @param {boolean}      props.isWinning    - Se a célula faz parte da linha vencedora
 * @param {boolean}      props.isGameOver   - Se o jogo terminou (bloqueia clique)
 * @param {string|null}  props.hoverEmoji   - Emoji do jogador atual (preview no hover)
 * @param {Function}     props.onClick      - Callback ao clicar
 * @param {object}       props.players      - Mapa { player1, player2 } com dados dos jogadores
 */
const Cell = ({ value, isWinning, isGameOver, hoverEmoji, onClick, players }) => {
  const isOccupied = value !== null;
  const isClickable = !isOccupied && !isGameOver;

  const playerData = value ? players[value] : null;

  return (
    <button
      type="button"
      className={`cell
        ${isOccupied ? 'cell--occupied' : ''}
        ${isWinning ? 'cell--winning' : ''}
        ${isClickable ? 'cell--clickable' : ''}
      `}
      style={
        playerData
          ? { '--cell-color': playerData.animal.color, '--cell-bg': playerData.animal.bgColor }
          : {}
      }
      onClick={isClickable ? onClick : undefined}
      aria-label={
        isOccupied
          ? `Célula ocupada por ${playerData?.name} (${playerData?.animal.name})`
          : 'Célula vazia'
      }
      aria-disabled={!isClickable}
    >
      {isOccupied ? (
        <span className="cell__piece" role="img" aria-hidden="true">
          {playerData?.animal.emoji}
        </span>
      ) : (
        isClickable && (
          <span className="cell__hover-hint" aria-hidden="true">
            {hoverEmoji}
          </span>
        )
      )}
    </button>
  );
};

export default Cell;
