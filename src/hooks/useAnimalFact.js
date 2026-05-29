/**
 * @fileoverview Hook customizado para buscar fatos educativos sobre animais.
 *
 * Gerencia os estados de loading, erro e dados da requisição HTTP,
 * isolando o efeito colateral de rede do restante da aplicação.
 *
 * Heurística Nielsen aplicada:
 * - Visibilidade do status (indicador de carregamento enquanto busca)
 * - Prevenção de erros (mensagem de fallback em caso de falha)
 */

import { useState, useCallback } from 'react';
import { fetchAnimalFact } from '../services/animalFactsService';

/**
 * @typedef {Object} AnimalFactHookReturn
 * @property {import('../services/animalFactsService').AnimalFact|null} fact - Fato buscado
 * @property {boolean}  isLoading - Indica se a requisição está em andamento
 * @property {string|null} error  - Mensagem de erro, se houver
 * @property {Function} fetchFact - Dispara a busca para um wikiTitle
 * @property {Function} clearFact - Limpa o fato atual e erros
 */

/**
 * Hook para buscar e gerenciar fatos educativos sobre animais.
 * @returns {AnimalFactHookReturn}
 */
const useAnimalFact = () => {
  const [fact, setFact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Busca um fato sobre o animal indicado pelo título da Wikipedia.
   * @param {string} wikiTitle
   */
  const fetchFact = useCallback(async (wikiTitle) => {
    setIsLoading(true);
    setError(null);
    setFact(null);
    try {
      const result = await fetchAnimalFact(wikiTitle);
      setFact(result);
    } catch (err) {
      console.error('[useAnimalFact]', err);
      setError('Não foi possível carregar o fato educativo. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Limpa o estado atual (fato e erro). */
  const clearFact = useCallback(() => {
    setFact(null);
    setError(null);
  }, []);

  return { fact, isLoading, error, fetchFact, clearFact };
};

export default useAnimalFact;
