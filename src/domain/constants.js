/**
 * @fileoverview Constantes globais da aplicação.
 *
 * Tema: ODS 15 – Vida Terrestre (Life on Land)
 * Os animais representados são espécies ameaçadas ou icônicas
 * que simbolizam a diversidade da vida terrestre protegida pelo ODS 15.
 */

/**
 * Fases possíveis do jogo.
 * @readonly
 * @enum {string}
 */
export const GAME_STATUS = Object.freeze({
  SETUP: 'setup',
  PLAYING: 'playing',
  WIN: 'win',
  DRAW: 'draw',
});

/** Chave usada no localStorage para persistir a sessão atual do jogo */
export const GAME_SESSION_STORAGE_KEY = 'jogo_velha_animais_session_v1';

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
    emoji: '🦁',
    wikiTitle: 'Lion',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  {
    id: 'elephant',
    name: 'Elefante',
    emoji: '🐘',
    wikiTitle: 'African_elephant',
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  {
    id: 'leopard',
    name: 'Leopardo',
    emoji: '🐆',
    wikiTitle: 'Leopard',
    color: '#b45309',
    bgColor: '#fef3c7',
    borderColor: '#d97706',
  },
  {
    id: 'gorilla',
    name: 'Gorila',
    emoji: '🦍',
    wikiTitle: 'Gorilla',
    color: '#374151',
    bgColor: '#f3f4f6',
    borderColor: '#6b7280',
  },
  {
    id: 'tiger',
    name: 'Tigre',
    emoji: '🐅',
    wikiTitle: 'Tiger',
    color: '#c2410c',
    bgColor: '#fff7ed',
    borderColor: '#ea580c',
  },
  {
    id: 'panda',
    name: 'Panda',
    emoji: '🐼',
    wikiTitle: 'Giant_panda',
    color: '#1f2937',
    bgColor: '#f9fafb',
    borderColor: '#374151',
  },
  {
    id: 'wolf',
    name: 'Lobo',
    emoji: '🐺',
    wikiTitle: 'Wolf',
    color: '#4b5563',
    bgColor: '#f3f4f6',
    borderColor: '#9ca3af',
  },
  {
    id: 'eagle',
    name: 'Águia',
    emoji: '🦅',
    wikiTitle: 'Bald_eagle',
    color: '#92400e',
    bgColor: '#fef3c7',
    borderColor: '#b45309',
  },
];

/** Chave usada no localStorage para persistir o placar entre sessões */
export const LEADERBOARD_STORAGE_KEY = 'jogo_velha_animais_leaderboard_v1';

/** Número máximo de entradas exibidas no placar de líderes */
export const LEADERBOARD_MAX_ENTRIES = 10;

/** Heurísticas de Nielsen aplicadas no projeto para apoio à apresentação */
export const NIELSEN_HEURISTICS = [
  {
    id: 'status',
    title: 'Visibilidade do status do sistema',
    description: 'Feedback em tempo real com placar, vez atual, progresso da rodada e banner de resultado.',
  },
  {
    id: 'freedom',
    title: 'Controle e liberdade do usuário',
    description: 'Botões para reiniciar rodada, zerar a sessão e trocar jogadores a qualquer momento.',
  },
  {
    id: 'errors',
    title: 'Prevenção de erros',
    description: 'Validação no setup, bloqueio de jogadas inválidas e mensagens claras quando faltam dados.',
  },
  {
    id: 'recognition',
    title: 'Reconhecimento em vez de memorização',
    description: 'Animais sempre visíveis com nome, cor e emoji identificando rapidamente cada jogador.',
  },
  {
    id: 'minimalism',
    title: 'Estética e design minimalista',
    description: 'Layout limpo, responsivo e focado em poucas ações principais por etapa do jogo.',
  },
];
