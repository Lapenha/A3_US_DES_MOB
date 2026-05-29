/**
 * @fileoverview Hook customizado que encapsula toda a lógica do Jogo da Memória.
 *
 * Gerencia o tabuleiro, viradas, verificação de pares, pontuação e timer,
 * separando o estado React da regra de negócio (memoryEngine).
 *
 * Heurísticas de Nielsen aplicadas:
 * - Visibilidade do status (moves, elapsedSeconds, matchedPairs)
 * - Prevenção de erros (lockedRef bloqueia cliques durante animação)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ANIMALS, GAME_STATUS } from '../domain/constants';
import { createCards, checkMatch } from '../domain/memoryEngine';

const TOTAL_PAIRS = ANIMALS.length; // 8 pares

/**
 * @typedef {Object} MemoryHookReturn
 * @property {import('../domain/memoryEngine').MemoryCard[]} cards
 * @property {number[]}  flippedIndices   - Índices das cartas viradas ainda não processadas
 * @property {number}    matchedPairs     - Pares encontrados até agora
 * @property {number}    moves            - Total de tentativas (par = 1 jogada)
 * @property {string}    gameStatus       - GAME_STATUS.PLAYING | GAME_STATUS.WON
 * @property {number}    elapsedSeconds   - Segundos desde o início
 * @property {import('../domain/memoryEngine').MemoryCard|null} lastMatchedAnimal - Último animal encontrado
 * @property {number}    totalPairs
 * @property {Function}  flipCard         - Vira a carta no índice informado
 * @property {Function}  resetGame        - Reinicia completamente o jogo
 */

/**
 * Hook principal do Jogo da Memória.
 * @returns {MemoryHookReturn}
 */
const useMemory = () => {
  const [cards, setCards] = useState(createCards);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastMatchedAnimal, setLastMatchedAnimal] = useState(null);
  const lockedRef = useRef(false);

  /* ── Timer ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  /* ── Virar carta ─────────────────────────────────────────────── */
  const flipCard = useCallback(
    (cardIndex) => {
      if (lockedRef.current) return;
      if (gameStatus !== GAME_STATUS.PLAYING) return;
      if (cards[cardIndex].isFlipped) return;
      if (cards[cardIndex].isMatched) return;
      if (flippedIndices.length >= 2) return;

      // Vira a carta imediatamente
      setCards((prev) =>
        prev.map((card, i) => (i === cardIndex ? { ...card, isFlipped: true } : card)),
      );

      if (flippedIndices.length === 0) {
        // Primeira carta da jogada
        setFlippedIndices([cardIndex]);
        return;
      }

      // Segunda carta — verifica par
      const firstIndex = flippedIndices[0];
      const isMatch = checkMatch(cards[firstIndex], cards[cardIndex]);

      lockedRef.current = true;
      setMoves((m) => m + 1);
      setFlippedIndices([firstIndex, cardIndex]);

      if (isMatch) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === firstIndex || i === cardIndex
                ? { ...card, isFlipped: true, isMatched: true }
                : card,
            ),
          );
          setLastMatchedAnimal(cards[cardIndex]);
          setMatchedPairs((p) => {
            const next = p + 1;
            if (next === TOTAL_PAIRS) setGameStatus(GAME_STATUS.WON);
            return next;
          });
          setFlippedIndices([]);
          lockedRef.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === firstIndex || i === cardIndex ? { ...card, isFlipped: false } : card,
            ),
          );
          setFlippedIndices([]);
          lockedRef.current = false;
        }, 1000);
      }
    },
    [cards, flippedIndices, gameStatus],
  );

  /* ── Reiniciar jogo ──────────────────────────────────────────── */
  const resetGame = useCallback(() => {
    lockedRef.current = false;
    setCards(createCards());
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStatus(GAME_STATUS.PLAYING);
    setElapsedSeconds(0);
    setLastMatchedAnimal(null);
  }, []);

  return {
    cards,
    flippedIndices,
    matchedPairs,
    moves,
    gameStatus,
    timeSeconds: elapsedSeconds,
    lastMatchedAnimal,
    totalPairs: TOTAL_PAIRS,
    flipCard,
    resetGame,
  };
};

export default useMemory;
