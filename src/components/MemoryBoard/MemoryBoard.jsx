/**
 * @fileoverview Tabuleiro do Jogo da Memória (grade 4×4).
 *
 * Renderiza a lista de cartas passada via props.
 * Heurística Nielsen: Estética e design minimalista — apenas a grade, sem ruído visual.
 *
 * @param {object}   props
 * @param {import('../../domain/memoryEngine').MemoryCard[]} props.cards
 * @param {Function} props.onCardClick  - Recebe o índice da carta clicada
 * @param {boolean}  props.isLocked     - Desabilita todo o tabuleiro
 */

import MemoryCard from '../MemoryCard/MemoryCard';
import './MemoryBoard.css';

const MemoryBoard = ({ cards, onCardClick, isLocked }) => (
  <div
    className="memory-board"
    role="grid"
    aria-label="Tabuleiro do jogo da memória — grade 4 por 4"
  >
    {cards.map((card) => (
      <MemoryCard
        key={card.pairKey}
        card={card}
        onClick={() => onCardClick(card.index)}
        isLocked={isLocked}
      />
    ))}
  </div>
);

export default MemoryBoard;
