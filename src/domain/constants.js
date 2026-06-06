/**
 * @fileoverview Constantes globais da aplicação.
 *
 * Tema: ODS 15 – Vida Terrestre (Life on Land)
 * Os animais representados são espécies ameaçadas ou icônicas
 * que simbolizam a diversidade da vida terrestre protegida pelo ODS 15.
 */

/**
 * Fases possíveis do Jogo da Memória.
 * @readonly
 * @enum {string}
 */
export const GAME_STATUS = Object.freeze({
  PLAYING: 'playing',
  WON: 'won',
});

/** Chave usada no localStorage para persistir o nome do jogador */
export const GAME_SESSION_STORAGE_KEY = 'jogo_memoria_animais_player_v1';

/** Imagens dos animais importadas */
import eagle from '../assets/animals/Eagle.png';
import elephant from '../assets/animals/Elephant.png';
import gorilla from '../assets/animals/Gorilla.png';
import leopard from '../assets/animals/Leopard.png';
import lion from '../assets/animals/Lion.png';
import panda from '../assets/animals/Panda.png';
import tiger from '../assets/animals/Tiger.png';
import wolf from '../assets/animals/Wolf.png'

/**
 * Lista de animais disponíveis para seleção.
 * Cada animal está associado a um artigo da Wikipedia para busca de fatos educativos.
 *
 * @typedef {Object} Animal
 * @property {string} id           - Identificador único
 * @property {string} name         - Nome em português
 * @property {string} emoji        - Emoji representativo (placeholder até SVGs)
 * @property {string} wikiTitle    - Título do artigo na Wikipedia (EN)
 * @property {string} color        - Cor primária (texto / borda ativa)
 * @property {string} bgColor      - Cor de fundo do card
 * @property {string} borderColor  - Cor da borda quando selecionado
 *
 * @type {Animal[]}
 */
export const ANIMALS = [
  {
    id: 'lion',
    name: 'Leão',
    image: lion,
    wikiTitle: 'Leão',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  {
    id: 'elephant',
    name: 'Elefante',
    image: elephant,
    wikiTitle: 'Elefante-africano',
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  {
    id: 'leopard',
    name: 'Leopardo',
    image: leopard,
    wikiTitle: 'Leopardo',
    color: '#b45309',
    bgColor: '#fef3c7',
    borderColor: '#d97706',
  },
  {
    id: 'gorilla',
    name: 'Gorila',
    image: gorilla,
    wikiTitle: 'Gorila',
    color: '#374151',
    bgColor: '#f3f4f6',
    borderColor: '#6b7280',
  },
  {
    id: 'tiger',
    name: 'Tigre',
    image: tiger,
    wikiTitle: 'Tigre',
    color: '#c2410c',
    bgColor: '#fff7ed',
    borderColor: '#ea580c',
  },
  {
    id: 'panda',
    name: 'Panda',
    image: panda,
    wikiTitle: 'Panda-gigante',
    color: '#1f2937',
    bgColor: '#f9fafb',
    borderColor: '#374151',
  },
  {
    id: 'wolf',
    name: 'Lobo',
    image: wolf,
    wikiTitle: 'Lobo',
    color: '#4b5563',
    bgColor: '#f3f4f6',
    borderColor: '#9ca3af',
  },
  {
    id: 'eagle',
    name: 'Águia',
    image: eagle,
    wikiTitle: 'Águia-careca',
    color: '#92400e',
    bgColor: '#fef3c7',
    borderColor: '#b45309',
  },
];

/** Chave usada no localStorage para persistir o placar entre sessões */
export const LEADERBOARD_STORAGE_KEY = 'jogo_memoria_animais_leaderboard_v1';

/** Número máximo de entradas exibidas no placar de líderes */
export const LEADERBOARD_MAX_ENTRIES = 10;

/** Heurísticas de Nielsen aplicadas no projeto para apoio à apresentação */
export const NIELSEN_HEURISTICS = [
  {
    id: 'status',
    title: 'Visibilidade do status do sistema',
    description:
      'Contador de jogadas, cronômetro ao vivo, barra de progresso e banner de vitória fornecem feedback contínuo ao jogador.',
  },
  {
    id: 'freedom',
    title: 'Controle e liberdade do usuário',
    description:
      'Botões "Jogar Novamente" e "Trocar Jogador" permitem reiniciar ou sair a qualquer momento sem perda de contexto.',
  },
  {
    id: 'errors',
    title: 'Prevenção de erros',
    description:
      'Cliques são bloqueados durante a animação de flip e em cartas já viradas, impedindo jogadas acidentais inválidas.',
  },
  {
    id: 'recognition',
    title: 'Reconhecimento em vez de memorização',
    description:
      'Cartas reveladas mostram emoji e nome do animal imediatamente; pares encontrados ficam permanentemente visíveis.',
  },
  {
    id: 'minimalism',
    title: 'Estética e design minimalista',
    description:
      'Interface limpa com grade centralizada, paleta verde do ODS 15 e informações adicionais (leaderboard, fatos) em painéis colapsáveis abaixo.',
  },
];
