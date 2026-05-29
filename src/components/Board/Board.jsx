/**
 * @fileoverview Componente do tabuleiro do jogo da velha.
 *
 * Renderiza a grade 3×3 usando o componente Cell.
 * Recebe todos os dados via props — sem estado próprio.
 *
 * Heurísticas de Nielsen aplicadas:
 * - Visibilidade do status: células desabilitadas quando jogo encerrado
 * - Estética e design minimalista: grade simples e clara
 */

import Cell from '../Cell/Cell';
import './Board.css';

/**
 * Tabuleiro 3×3 do jogo da velha.
 * @param {object}           props
 * @param {Array}            props.board       - Array de 9 elementos (null | 'player1' | 'player2')
 * @param {number[]|null}    props.winningLine - Índices das células vencedoras
 * @param {boolean}          props.isGameOver  - Se o jogo está encerrado
 * @param {string}           props.currentPlayer - Jogador da vez
 * @param {object}           props.players     - { player1, player2 } com dados
 * @param {Function}         props.onCellClick - Callback com o índice clicado
 */
const Board = ({ board, winningLine, isGameOver, currentPlayer, players, onCellClick }) => {
  const currentAnimalEmoji = players[currentPlayer]?.animal.emoji ?? '';

  return (
    <div className="board" role="grid" aria-label="Tabuleiro do jogo da velha">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          isWinning={winningLine?.includes(index) ?? false}
          isGameOver={isGameOver}
          hoverEmoji={currentAnimalEmoji}
          onClick={() => onCellClick(index)}
          players={players}
        />
      ))}
    </div>
  );
};

export default Board;
