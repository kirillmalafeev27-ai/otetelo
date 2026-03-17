export const BOARD_SIZE = 8;

export const MODES = {
  GENDER: 1,
  CASE: 2,
  CONJUGATION: 3,
  SENTENCE: 4,
};

export const MODE_INFO = {
  [MODES.GENDER]: {
    id: 1,
    name: 'Drei Geschlechter',
    subtitle: 'Род = тип фишки',
    description: 'Определи род существительного (der/die/das). Правильный ответ даёт выбор типа фишки, каждый тип переворачивает в разных направлениях.',
    icon: 'gender',
    taskCount: 64,
    levels: [
      { id: 1, name: 'Stufe 1', desc: 'A1 — Частотная лексика', level: 'A1' },
      { id: 2, name: 'Stufe 2', desc: 'A2 — Менее очевидные роды', level: 'A2' },
      { id: 3, name: 'Stufe 3', desc: 'B1 — Абстрактные, составные слова', level: 'B1' },
      { id: 4, name: 'Stufe 4', desc: 'B2+ — Исключения, Fremdwörter', level: 'B2' },
    ],
  },
  [MODES.CASE]: {
    id: 2,
    name: 'Kasus-Festung',
    subtitle: 'Падеж = броня фишки',
    description: 'Вставь правильную форму артикля. Падеж определяет уровень защиты фишки: щиты блокируют перевороты.',
    icon: 'shield',
    taskCount: 30,
    levels: [
      { id: 1, name: 'Stufe 1', desc: 'Nominativ + Akkusativ', level: 'A1' },
      { id: 2, name: 'Stufe 2', desc: '+ Dativ', level: 'A2' },
      { id: 3, name: 'Stufe 3', desc: '+ Genitiv', level: 'B1' },
      { id: 4, name: 'Stufe 4', desc: 'Все 4 + притяжательные', level: 'B2' },
    ],
  },
  [MODES.CONJUGATION]: {
    id: 3,
    name: 'Konjugationskette',
    subtitle: 'Спряжение = право на переворот',
    description: 'Спряги глагол для местоимения на фишке. При цепочке (3+ фишек) — спрягай каждую. Ошибка обрывает цепочку.',
    icon: 'chain',
    taskCount: 30,
    levels: [
      { id: 1, name: 'Stufe 1', desc: 'Präsens, правильные глаголы', level: 'A1' },
      { id: 2, name: 'Stufe 2', desc: 'Präsens, неправильные глаголы', level: 'A2' },
      { id: 3, name: 'Stufe 3', desc: 'Perfekt (haben/sein + Partizip II)', level: 'B1' },
      { id: 4, name: 'Stufe 4', desc: 'Präteritum + смешанные', level: 'B2' },
    ],
  },
  [MODES.SENTENCE]: {
    id: 4,
    name: 'Satzbausteine',
    subtitle: 'Порядок слов = сила хода',
    description: 'Собери предложение из перемешанных слов. Правильный порядок даёт бонусный переворот, ошибка — без переворотов.',
    icon: 'puzzle',
    taskCount: 30,
    levels: [
      { id: 1, name: 'Stufe 1', desc: '3-4 слова, SVO', level: 'A1' },
      { id: 2, name: 'Stufe 2', desc: '5-6 слов, Zeit + Ort', level: 'A2' },
      { id: 3, name: 'Stufe 3', desc: 'Nebensätze (weil/dass/wenn)', level: 'B1' },
      { id: 4, name: 'Stufe 4', desc: 'Relativsätze, Konjunktiv II', level: 'B2' },
    ],
  },
};

export const PIECE_TYPES = {
  DER: 'der',
  DIE: 'die',
  DAS: 'das',
};

export const PRONOUNS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const STRAIGHT_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
export const DIAGONAL_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

export const AI_ACCURACY = { EASY: 0.7, MEDIUM: 0.85, HARD: 0.95 };

export const TIMING = {
  PIECE_APPEAR: 600,
  PIECE_FLIP: 500,
  FLIP_DELAY: 250,
  TURN_PAUSE: 800,
  AI_THINK_MIN: 1500,
  AI_THINK_MAX: 2500,
  TYPEWRITER_SPEED: 40,
  TRANSITION: 400,
};

export const COLORS = {
  BG: '#0a0a1a',
  BOARD: '#0d2818',
  GRID: '#00ff8855',
  PLAYER1: '#ff006e',
  PLAYER2: '#00d4ff',
  GOLD: '#f39c12',
  ERROR: '#e74c3c',
  SUCCESS: '#2ecc71',
  TEXT: '#e0e0e0',
  TEXT_DIM: '#888888',
};

export const GAME_PHASE = {
  MENU: 'menu',
  MODE_SELECT: 'modeSelect',
  LEVEL_SELECT: 'levelSelect',
  PROMPT_CONFIG: 'promptConfig',
  LOADING: 'loading',
  PLAYING: 'playing',
  ANSWERING: 'answering',
  CHOOSING_TYPE: 'choosingType',
  CHAIN_RESOLVING: 'chainResolving',
  ANIMATING: 'animating',
  GAME_OVER: 'gameOver',
};
