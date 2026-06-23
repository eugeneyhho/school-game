// Chinese vocabulary for the picture→word game: each 詞語 pairs with a picture (emoji).
// All words are Traditional Chinese (繁體中文). Difficulty is driven by a familiarity
// tier plus the number of choices (every word here is two characters, so word length
// isn't a useful knob — unlike the English game).
export const CHINESE_VOCAB = [
  // ---- easy (most familiar everyday words) ----
  { word: '爸爸', emoji: '👨', tier: 'easy' },
  { word: '媽媽', emoji: '👩', tier: 'easy' },
  { word: '你好', emoji: '👋', tier: 'easy' },
  { word: '朋友', emoji: '👫', tier: 'easy' },
  { word: '太陽', emoji: '☀️', tier: 'easy' },
  { word: '月亮', emoji: '🌙', tier: 'easy' },
  { word: '大樹', emoji: '🌳', tier: 'easy' },
  { word: '回家', emoji: '🏠', tier: 'easy' },
  // ---- medium (school / daily life) ----
  { word: '老師', emoji: '👩‍🏫', tier: 'medium' },
  { word: '上學', emoji: '🏫', tier: 'medium' },
  { word: '書包', emoji: '🎒', tier: 'medium' },
  { word: '文具', emoji: '✏️', tier: 'medium' },
  { word: '白雲', emoji: '☁️', tier: 'medium' },
  { word: '下雨', emoji: '🌧️', tier: 'medium' },
  { word: '嘴巴', emoji: '👄', tier: 'medium' },
  { word: '唱歌', emoji: '🎤', tier: 'medium' },
  // ---- hard (actions / more abstract) ----
  { word: '跑步', emoji: '🏃', tier: 'hard' },
  { word: '山水', emoji: '⛰️', tier: 'hard' },
  { word: '上下', emoji: '↕️', tier: 'hard' },
  { word: '左右', emoji: '↔️', tier: 'hard' },
  { word: '開門', emoji: '🚪', tier: 'hard' },
  { word: '今天', emoji: '📅', tier: 'hard' },
]

// Levels control the word tier and how many multiple-choice options appear.
export const CHINESE_LEVELS = {
  easy: { choices: 3, label: 'Easy', sub: '3 choices' },
  medium: { choices: 4, label: 'Medium', sub: '4 choices' },
  hard: { choices: 4, label: 'Hard', sub: '4 choices · 進階' },
}

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Pick `count` random words from the level's tier. */
export function pickWords(difficulty, count) {
  const pool = shuffle(CHINESE_VOCAB.filter((v) => v.tier === difficulty))
  return pool.slice(0, count)
}

/**
 * Build the multiple-choice options: the correct word plus (choices-1) distractors
 * drawn from the same tier pool, all shuffled. Returns string[] of length `choices`.
 */
export function buildChoices(word, difficulty) {
  const { choices } = CHINESE_LEVELS[difficulty]
  const distractors = shuffle(
    CHINESE_VOCAB.filter((v) => v.tier === difficulty && v.word !== word),
  ).slice(0, choices - 1)
  return shuffle([word, ...distractors.map((d) => d.word)])
}
