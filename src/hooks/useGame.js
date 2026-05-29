/**
 * @fileoverview Hook customizado que encapsula toda a lógica de estado do jogo.
 *
 * Separa o gerenciamento de estado (React) da regra de negócio (gameEngine),
 * seguindo o princípio de responsabilidade única do Clean Architecture.
 *
 * Heurística Nielsen aplicada:
 * - Visibilidade do status (currentPlayer, gameStatus, scores)
 * - Prevenção de erros (isMoveValid bloqueia jogadas inválidas)
 */

import { useMemo, useState, useCallback } from 'react';
import { createEmptyBoard, isMoveValid, applyMove, evaluateBoard } from '../domain/gameEngine';
import { GAME_STATUS } from '../domain/constants';

/** Pontuação inicial zerada */
const INITIAL_SCORES = { player1: 0, player2: 0, draws: 0 };

/**
 * @typedef {Object} GameHookReturn
 * @property {Array}         board         - Células do tabuleiro (9 posições: null | 'player1' | 'player2')
 * @property {string}        currentPlayer - Jogador da vez ('player1' | 'player2')
 * @property {string}        gameStatus    - Status atual (GAME_STATUS enum)
 * @property {string|null}   winner        - Chave do jogador vencedor ou null
 * @property {number[]|null} winningLine   - Índices das células vencedoras ou null
 * @property {Object}        scores        - { player1, player2, draws }
 * @property {Function}      makeMove      - Executa uma jogada pelo índice da célula
 * @property {Function}      resetRound    - Reinicia o tabuleiro mantendo pontuação
 * @property {Function}      resetGame     - Reinicia tabuleiro e pontuação
 */

/**
 * Hook que gerencia todo o estado e fluxo de uma partida.
 * @returns {GameHookReturn}
 */
const getInitialSnapshot = (snapshot) => {
  const hasValidBoard =
    Array.isArray(snapshot?.board) &&
    snapshot.board.length === 9 &&
    snapshot.board.every((cell) => cell === null || cell === 'player1' || cell === 'player2');

  const hasValidScores =
    snapshot?.scores &&
    typeof snapshot.scores.player1 === 'number' &&
    typeof snapshot.scores.player2 === 'number' &&
    typeof snapshot.scores.draws === 'number';

  const hasValidStatus = Object.values(GAME_STATUS).includes(snapshot?.gameStatus);
  const hasValidWinner =
    snapshot?.winner === null || snapshot?.winner === 'player1' || snapshot?.winner === 'player2';
  const hasValidLine =
    snapshot?.winningLine === null ||
    (Array.isArray(snapshot.winningLine) && snapshot.winningLine.every((value) => Number.isInteger(value)));

  if (!hasValidBoard || !hasValidScores || !hasValidStatus || !hasValidWinner || !hasValidLine) {
    return {
      board: createEmptyBoard(),
      currentPlayer: 'player1',
      gameStatus: GAME_STATUS.PLAYING,
      winner: null,
      winningLine: null,
      scores: INITIAL_SCORES,
    };
  }

  return {
    board: snapshot.board,
    currentPlayer: snapshot.currentPlayer === 'player2' ? 'player2' : 'player1',
    gameStatus: snapshot.gameStatus,
    winner: snapshot.winner,
    winningLine: snapshot.winningLine,
    scores: snapshot.scores,
  };
};

const useGame = (initialSnapshot = null) => {
  const initialState = useMemo(() => getInitialSnapshot(initialSnapshot), [initialSnapshot]);
  const [board, setBoard] = useState(initialState.board);
  const [currentPlayer, setCurrentPlayer] = useState(initialState.currentPlayer);
  const [gameStatus, setGameStatus] = useState(initialState.gameStatus);
  const [winner, setWinner] = useState(initialState.winner);
  const [winningLine, setWinningLine] = useState(initialState.winningLine);
  const [scores, setScores] = useState(initialState.scores);

  /**
   * Processa a jogada no índice informado.
   * Ignora a chamada se o jogo não estiver em andamento ou a célula estiver ocupada.
   * @param {number} index - Posição no tabuleiro (0–8)
   */
  const makeMove = useCallback(
    (index) => {
      if (gameStatus !== GAME_STATUS.PLAYING) return;
      if (!isMoveValid(board, index)) return;

      const nextBoard = applyMove(board, index, currentPlayer);
      const { status, winner: gameWinner, winningLine: line } = evaluateBoard(nextBoard);

      setBoard(nextBoard);

      if (status === 'win') {
        setGameStatus(GAME_STATUS.WIN);
        setWinner(gameWinner);
        setWinningLine(line);
        setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      } else if (status === 'draw') {
        setGameStatus(GAME_STATUS.DRAW);
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setCurrentPlayer((prev) => (prev === 'player1' ? 'player2' : 'player1'));
      }
    },
    [board, currentPlayer, gameStatus],
  );

  /** Reinicia o tabuleiro para uma nova rodada, preservando a pontuação. */
  const resetRound = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('player1');
    setGameStatus(GAME_STATUS.PLAYING);
    setWinner(null);
    setWinningLine(null);
  }, []);

  /** Reinicia completamente o jogo: tabuleiro e pontuação zerados. */
  const resetGame = useCallback(() => {
    resetRound();
    setScores(INITIAL_SCORES);
  }, [resetRound]);

  const snapshot = useMemo(
    () => ({
      board,
      currentPlayer,
      gameStatus,
      winner,
      winningLine,
      scores,
    }),
    [board, currentPlayer, gameStatus, winner, winningLine, scores],
  );

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningLine,
    scores,
    makeMove,
    resetRound,
    resetGame,
    snapshot,
  };
};

export default useGame;
