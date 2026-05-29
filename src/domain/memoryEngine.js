/**
 * @fileoverview Lógica de domínio do Jogo da Memória.
 *
 * Funções puras: criação do baralho embaralhado e verificação de par.
 * Não dependem de React — podem ser testadas de forma isolada.
 *
 * Tema: ODS 15 – Vida Terrestre
 */

import { ANIMALS } from './constants';

/**
 * @typedef {Object} MemoryCard
 * @property {number}  index     - Posição no tabuleiro (0–15)
 * @property {string}  animalId  - ID do animal (para verificação de par)
 * @property {string}  pairKey   - Chave única da carta ('lion-a' | 'lion-b')
 * @property {string}  emoji     - Emoji do animal
 * @property {string}  name      - Nome em português
 * @property {string}  color     - Cor primária (texto)
 * @property {string}  bgColor   - Cor de fundo ao virar
 * @property {string}  wikiTitle - Título na Wikipedia para busca de fato educativo
 * @property {boolean} isFlipped - Carta está virada para cima
 * @property {boolean} isMatched - Par foi encontrado
 */

/**
 * Embaralha um array in-place usando Fisher-Yates.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Cria o baralho completo: 2 cartas por animal (16 cartas), embaralhadas.
 * @returns {MemoryCard[]}
 */
export const createCards = () => {
  const pairs = ANIMALS.flatMap((animal) => [
    { ...animal, pairKey: `${animal.id}-a` },
    { ...animal, pairKey: `${animal.id}-b` },
  ]);

  return shuffle(pairs).map((card, index) => ({
    index,
    animalId: card.id,
    pairKey: card.pairKey,
    emoji: card.emoji,
    name: card.name,
    color: card.color,
    bgColor: card.bgColor,
    wikiTitle: card.wikiTitle,
    isFlipped: false,
    isMatched: false,
  }));
};

/**
 * Verifica se duas cartas formam um par.
 * @param {MemoryCard} a
 * @param {MemoryCard} b
 * @returns {boolean}
 */
export const checkMatch = (a, b) => a.animalId === b.animalId;
