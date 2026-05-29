/**
 * @fileoverview Hook customizado para o Placar de Líderes com persistência.
 *
 * Persiste as entradas no localStorage para que o leaderboard
 * sobreviva a atualizações de página, conforme requisito do projeto.
 *
 * Heurística Nielsen aplicada:
 * - Visibilidade do status (ranking sempre visível e atualizado)
 */

import { useState, useEffect, useCallback } from 'react';
import { LEADERBOARD_STORAGE_KEY } from '../domain/constants';
import { createEntry, upsertEntry } from '../domain/leaderboard';

/**
 * Carrega as entradas salvas do localStorage.
 * Retorna array vazio em caso de dados corrompidos.
 * @returns {import('../domain/leaderboard').LeaderboardEntry[]}
 */
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[Leaderboard] Não foi possível carregar do localStorage.', error);
    return [];
  }
};

/**
 * Salva as entradas no localStorage silenciosamente.
 * @param {import('../domain/leaderboard').LeaderboardEntry[]} entries
 */
const saveToStorage = (entries) => {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('[Leaderboard] Não foi possível salvar no localStorage.', error);
  }
};

/**
 * @typedef {Object} LeaderboardHookReturn
 * @property {import('../domain/leaderboard').LeaderboardEntry[]} entries     - Lista atual do placar
 * @property {Function} recordWin       - Registra ou atualiza vitória de um jogador
 * @property {Function} clearLeaderboard - Limpa todo o placar
 */

/**
 * Hook que gerencia o leaderboard com persistência automática.
 * @returns {LeaderboardHookReturn}
 */
const useLeaderboard = () => {
  const [entries, setEntries] = useState(loadFromStorage);

  // Sincroniza com localStorage a cada mudança
  useEffect(() => {
    saveToStorage(entries);
  }, [entries]);

  /**
   * Registra uma vitória. Atualiza a entrada existente se o novo total for maior.
   * @param {string} playerName
   * @param {string} animalName
   * @param {string} animalEmoji
   * @param {number} wins - Total de vitórias acumuladas na sessão
   */
  const recordWin = useCallback((playerName, animalName, animalEmoji, wins) => {
    const entry = createEntry(playerName, animalName, animalEmoji, wins);
    setEntries((prev) => upsertEntry(prev, entry));
  }, []);

  /** Remove todas as entradas do placar e do localStorage. */
  const clearLeaderboard = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, recordWin, clearLeaderboard };
};

export default useLeaderboard;
