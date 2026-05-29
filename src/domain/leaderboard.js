/**
 * @fileoverview Lógica de domínio do Placar de Líderes (Leaderboard).
 *
 * Funções puras que manipulam a lista de entradas do leaderboard.
 * Não dependem de React nem de localStorage — armazenamento é responsabilidade do hook.
 */

import { LEADERBOARD_MAX_ENTRIES } from './constants';

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id          - Identificador único da entrada
 * @property {string} playerName  - Nome do jogador
 * @property {string} animalName  - Nome do animal escolhido
 * @property {string} animalEmoji - Emoji do animal escolhido
 * @property {number} wins        - Total de vitórias na sessão
 * @property {string} timestamp   - ISO 8601 do momento do registro
 */

/**
 * Cria uma nova entrada para o leaderboard.
 * @param {string} playerName
 * @param {string} animalName
 * @param {string} animalEmoji
 * @param {number} wins
 * @returns {LeaderboardEntry}
 */
export const createEntry = (playerName, animalName, animalEmoji, wins) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerName,
  animalName,
  animalEmoji,
  wins,
  timestamp: new Date().toISOString(),
});

/**
 * Insere ou atualiza uma entrada no leaderboard.
 * Se o jogador já existir, atualiza somente se o novo total de vitórias for maior.
 * Retorna a lista ordenada por vitórias (decrescente), limitada ao máximo configurado.
 *
 * @param {LeaderboardEntry[]} entries - Entradas atuais
 * @param {LeaderboardEntry} newEntry  - Nova entrada a inserir/atualizar
 * @returns {LeaderboardEntry[]}
 */
export const upsertEntry = (entries, newEntry) => {
  const existingIndex = entries.findIndex(
    (e) => e.playerName.toLowerCase() === newEntry.playerName.toLowerCase(),
  );

  let updated;

  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    if (newEntry.wins <= existing.wins) return entries; // sem melhora, não altera
    updated = entries.map((e, i) =>
      i === existingIndex ? { ...e, wins: newEntry.wins, timestamp: newEntry.timestamp } : e,
    );
  } else {
    updated = [...entries, newEntry];
  }

  return updated
    .sort((a, b) => b.wins - a.wins || new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, LEADERBOARD_MAX_ENTRIES);
};
