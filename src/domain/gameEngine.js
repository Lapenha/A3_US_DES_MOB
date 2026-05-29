/**
 * @fileoverview Motor do jogo da velha (Tic-Tac-Toe).
 *
 * Contém apenas funções puras sem efeitos colaterais,
 * sem dependências de React ou de armazenamento externo.
 * Toda a lógica de regras e validação do jogo vive aqui.
 */

/** Todas as combinações vencedoras em um tabuleiro 3×3 */
const WINNING_LINES = [
  [0, 1, 2], // linha superior
  [3, 4, 5], // linha do meio
  [6, 7, 8], // linha inferior
  [0, 3, 6], // coluna esquerda
  [1, 4, 7], // coluna do meio
  [2, 5, 8], // coluna direita
  [0, 4, 8], // diagonal principal
  [2, 4, 6], // diagonal secundária
];

/**
 * Cria um tabuleiro vazio (9 posições, todas nulas).
 * @returns {Array<null>}
 */
export const createEmptyBoard = () => Array(9).fill(null);

/**
 * Verifica se uma jogada é válida: a célula deve estar vazia.
 * @param {Array} board - Estado atual do tabuleiro
 * @param {number} index - Índice da célula
 * @returns {boolean}
 */
export const isMoveValid = (board, index) => board[index] === null;

/**
 * Aplica uma jogada ao tabuleiro de forma imutável.
 * @param {Array} board - Estado atual do tabuleiro
 * @param {number} index - Índice da célula jogada
 * @param {string} playerKey - Chave do jogador ('player1' | 'player2')
 * @returns {Array} Novo tabuleiro com a jogada aplicada
 */
export const applyMove = (board, index, playerKey) => {
  const next = [...board];
  next[index] = playerKey;
  return next;
};

/**
 * Verifica se há um vencedor no tabuleiro.
 * @param {Array} board - Estado atual do tabuleiro
 * @returns {{ winner: string, winningLine: number[] } | null}
 */
export const checkWinner = (board) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line };
    }
  }
  return null;
};

/**
 * Verifica se o tabuleiro está completamente preenchido (empate).
 * @param {Array} board - Estado atual do tabuleiro
 * @returns {boolean}
 */
export const isBoardFull = (board) => board.every((cell) => cell !== null);

/**
 * Avalia o estado geral do tabuleiro após uma jogada.
 * @param {Array} board - Estado atual do tabuleiro
 * @returns {{ status: 'playing'|'win'|'draw', winner: string|null, winningLine: number[]|null }}
 */
export const evaluateBoard = (board) => {
  const result = checkWinner(board);
  if (result) {
    return { status: 'win', winner: result.winner, winningLine: result.winningLine };
  }
  if (isBoardFull(board)) {
    return { status: 'draw', winner: null, winningLine: null };
  }
  return { status: 'playing', winner: null, winningLine: null };
};
