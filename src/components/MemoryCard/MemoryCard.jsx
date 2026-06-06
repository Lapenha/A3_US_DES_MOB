/**
 * @fileoverview Carta do Jogo da Memória com animação de flip 3D.
 *
 * Heurísticas de Nielsen aplicadas:
 * - Visibilidade do status (estados visuais distintos: face-down / face-up / matched)
 * - Prevenção de erros (desabilita clique em cartas já viradas ou encontradas)
 * - Reconhecimento em vez de memorização (emoji + nome sempre visíveis ao virar)
 */

import './MemoryCard.css';

/**
 * Carta individual do tabuleiro.
 * @param {object}  props
 * @param {import('../../domain/memoryEngine').MemoryCard} props.card
 * @param {Function} props.onClick   - Chamado quando a carta é clicada
 * @param {boolean}  props.isLocked  - Bloqueia interação (ex: jogo encerrado)
 */
const MemoryCard = ({ card, onClick, isLocked }) => {
  const { isFlipped, isMatched, image, name, color, bgColor } = card;
  const showFront = isFlipped || isMatched;
  const interactive = !isLocked && !isFlipped && !isMatched;

  return (
    <div
      className={`memory-card${showFront ? ' memory-card--flipped' : ''}${isMatched ? ' memory-card--matched' : ''}`}
      onClick={interactive ? onClick : undefined}
      role="button"
      tabIndex={interactive ? 0 : -1}
      aria-label={
        showFront
          ? `${name}${isMatched ? ' – par encontrado' : ''}`
          : 'Carta virada para baixo – clique para revelar'
      }
      aria-pressed={showFront}
      onKeyDown={(e) => e.key === 'Enter' && interactive && onClick()}
    >
      <div className="memory-card__inner">
        {/* Verso (face para baixo) */}
        <div className="memory-card__face memory-card__face--back" aria-hidden="true">
          <span className="memory-card__back-icon">🌿</span>
        </div>

        {/* Frente (face para cima) */}
        <div
          className="memory-card__face memory-card__face--front"
          style={{ '--card-color': color, '--card-bg': bgColor }}
        >
          <img
           src={image}
           alt={name}
           className="memory-card__image"
          />
          
          <span className="memory-card__name">{name}</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
