/**
 * @fileoverview Serviço de fatos educativos sobre animais.
 *
 * Consome a Wikipedia REST API (sem necessidade de chave de API)
 * para buscar um resumo sobre o animal vencedor ao fim de cada partida.
 * Requisito: implementar ao menos uma requisição HTTP (fetch/axios).
 */

import axios from 'axios';

const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

/**
 * @typedef {Object} AnimalFact
 * @property {string}      title     - Título do artigo
 * @property {string}      extract   - Resumo educativo sobre o animal
 * @property {string|null} thumbnail - URL da imagem em miniatura (pode ser null)
 */

/**
 * Busca um resumo educativo sobre um animal na Wikipedia.
 * Utiliza axios conforme exigido pelo enunciado do projeto.
 *
 * @param {string} wikiTitle - Título do artigo na Wikipedia (ex: 'Lion', 'Tiger')
 * @returns {Promise<AnimalFact>}
 * @throws {Error} Se a requisição falhar ou o artigo não for encontrado
 */
export const fetchAnimalFact = async (wikiTitle) => {
  const { data } = await axios.get(`${WIKIPEDIA_BASE_URL}/${encodeURIComponent(wikiTitle)}`);

  return {
    title: data.title ?? wikiTitle,
    extract: data.extract ?? 'Fato não disponível no momento.',
    thumbnail: data.thumbnail?.source ?? null,
  };
};
