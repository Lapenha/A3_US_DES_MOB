/**
 * @fileoverview Lógica de domínio do Placar de Líderes (Leaderboard) – Jogo da Memória.
 *
 * Funções puras que manipulam a lista de entradas.
 * Ranking por menor número de jogadas; desempate pelo menor tempo.
 */

import { LEADERBOARD_MAX_ENTRIES } from './constants';

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id          - Identificador único
 * @property {string} playerName  - Nome do jogador
 * @property {number} moves       - Jogadas para completar
 * @property {number} timeSeconds - Tempo em segundos
 * @property {string} timestamp   - ISO 8601 do registro
 */

/**
 * Cria uma nova entrada para o leaderboard.
 * @param {string} playerName
 * @param {number} moves
 * @param {number} timeSeconds
 * @returns {LeaderboardEntry}
 */
export const createEntry = (playerName, moves, timeSeconds) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerName,
  moves,
  timeSeconds,
  timestamp: new Date().toISOString(),
});

/**
 * Insere ou atualiza uma entrada no leaderboard.
 * Atualiza somente se o resultado for melhor (menos jogadas; empate → menos tempo).
 * Retorna a lista ordenada (ascendente por jogadas, depois por tempo).
 *
 * @param {LeaderboardEntry[]} entries
 * @param {LeaderboardEntry} newEntry
 * @returns {LeaderboardEntry[]}
 */
export const upsertEntry = (entries, newEntry) => {
  const existingIndex = entries.findIndex(
    (e) => e.playerName.toLowerCase() === newEntry.playerName.toLowerCase(),
  );

  let updated;

  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    const isBetter =
      newEntry.moves < existing.moves ||
      (newEntry.moves === existing.moves && newEntry.timeSeconds < existing.timeSeconds);
    if (!isBetter) return entries;
    updated = entries.map((e, i) =>
      i === existingIndex
        ? { ...e, moves: newEntry.moves, timeSeconds: newEntry.timeSeconds, timestamp: newEntry.timestamp }
        : e,
    );
  } else {
    updated = [...entries, newEntry];
  }

  return updated
    .sort((a, b) => a.moves - b.moves || a.timeSeconds - b.timeSeconds)
    .slice(0, LEADERBOARD_MAX_ENTRIES);
};
