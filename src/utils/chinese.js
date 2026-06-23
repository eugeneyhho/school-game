// Chinese vocabulary for the picture→word game: each 詞語 pairs with a picture (emoji).
// All words are Traditional Chinese (繁體中文). Difficulty is driven by a familiarity
// tier plus the number of choices (every word here is two characters, so word length
// isn't a useful knob — unlike the English game).
export const CHINESE_VOCAB = [
  // ---- easy ----
  // people / everyday
  { word: '爸爸', emoji: '👨', tier: 'easy' },
  { word: '媽媽', emoji: '👩', tier: 'easy' },
  { word: '你好', emoji: '👋', tier: 'easy' },
  { word: '朋友', emoji: '👫', tier: 'easy' },
  { word: '太陽', emoji: '☀️', tier: 'easy' },
  { word: '月亮', emoji: '🌙', tier: 'easy' },
  { word: '大樹', emoji: '🌳', tier: 'easy' },
  { word: '回家', emoji: '🏠', tier: 'easy' },
  // food (most familiar)
  { word: '蘋果', emoji: '🍎', tier: 'easy' },
  { word: '香蕉', emoji: '🍌', tier: 'easy' },
  { word: '西瓜', emoji: '🍉', tier: 'easy' },
  { word: '草莓', emoji: '🍓', tier: 'easy' },
  { word: '牛奶', emoji: '🥛', tier: 'easy' },
  { word: '雞蛋', emoji: '🥚', tier: 'easy' },
  { word: '蛋糕', emoji: '🍰', tier: 'easy' },
  { word: '雪糕', emoji: '🍦', tier: 'easy' },
  { word: '糖果', emoji: '🍬', tier: 'easy' },
  { word: '魚', emoji: '🐟', tier: 'easy' },
  { word: '雞', emoji: '🍗', tier: 'easy' },
  // animals (most familiar)
  { word: '小貓', emoji: '🐱', tier: 'easy' },
  { word: '小狗', emoji: '🐶', tier: 'easy' },
  { word: '兔子', emoji: '🐰', tier: 'easy' },
  { word: '小鳥', emoji: '🐦', tier: 'easy' },
  { word: '小豬', emoji: '🐷', tier: 'easy' },
  { word: '牛', emoji: '🐮', tier: 'easy' },
  { word: '綿羊', emoji: '🐑', tier: 'easy' },
  { word: '馬', emoji: '🐴', tier: 'easy' },
  // ---- medium ----
  // school / daily life
  { word: '老師', emoji: '👩‍🏫', tier: 'medium' },
  { word: '上學', emoji: '🏫', tier: 'medium' },
  { word: '書包', emoji: '🎒', tier: 'medium' },
  { word: '文具', emoji: '✏️', tier: 'medium' },
  { word: '白雲', emoji: '☁️', tier: 'medium' },
  { word: '下雨', emoji: '🌧️', tier: 'medium' },
  { word: '嘴巴', emoji: '👄', tier: 'medium' },
  { word: '唱歌', emoji: '🎤', tier: 'medium' },
  // food
  { word: '麵包', emoji: '🍞', tier: 'medium' },
  { word: '白飯', emoji: '🍚', tier: 'medium' },
  { word: '麵條', emoji: '🍜', tier: 'medium' },
  { word: '漢堡', emoji: '🍔', tier: 'medium' },
  { word: '餅乾', emoji: '🍪', tier: 'medium' },
  { word: '果汁', emoji: '🧃', tier: 'medium' },
  { word: '茶水', emoji: '🍵', tier: 'medium' },
  { word: '汽水', emoji: '🥤', tier: 'medium' },
  { word: '青菜', emoji: '🥬', tier: 'medium' },
  { word: '粟米', emoji: '🌽', tier: 'medium' },
  { word: '葡萄', emoji: '🍇', tier: 'medium' },
  { word: '橙子', emoji: '🍊', tier: 'medium' },
  // animals (note: 金魚 shares 🐟 with 魚, so it lives in medium — different tier from
  // the easy 魚 — so the two can never appear in the same question)
  { word: '金魚', emoji: '🐟', tier: 'medium' },
  { word: '老虎', emoji: '🐯', tier: 'medium' },
  { word: '獅子', emoji: '🦁', tier: 'medium' },
  { word: '大象', emoji: '🐘', tier: 'medium' },
  { word: '猴子', emoji: '🐒', tier: 'medium' },
  { word: '熊', emoji: '🐻', tier: 'medium' },
  { word: '企鵝', emoji: '🐧', tier: 'medium' },
  { word: '青蛙', emoji: '🐸', tier: 'medium' },
  { word: '烏龜', emoji: '🐢', tier: 'medium' },
  { word: '蝴蝶', emoji: '🦋', tier: 'medium' },
  // ---- hard ----
  // actions / abstract
  { word: '跑步', emoji: '🏃', tier: 'hard' },
  { word: '山水', emoji: '⛰️', tier: 'hard' },
  { word: '上下', emoji: '↕️', tier: 'hard' },
  { word: '左右', emoji: '↔️', tier: 'hard' },
  { word: '開門', emoji: '🚪', tier: 'hard' },
  { word: '今天', emoji: '📅', tier: 'hard' },
  // food (longer / less universal terms)
  { word: '三文治', emoji: '🥪', tier: 'hard' },
  { word: '朱古力', emoji: '🍫', tier: 'hard' },
  { word: '蘿蔔', emoji: '🥕', tier: 'hard' },
  { word: '牛肉', emoji: '🥩', tier: 'hard' },
  { word: '壽司', emoji: '🍣', tier: 'hard' },
  { word: '點心', emoji: '🥟', tier: 'hard' },
  // animals (longer / less everyday)
  { word: '長頸鹿', emoji: '🦒', tier: 'hard' },
  { word: '狐狸', emoji: '🦊', tier: 'hard' },
  { word: '蜜蜂', emoji: '🐝', tier: 'hard' },
  { word: '螞蟻', emoji: '🐜', tier: 'hard' },
  { word: '蜘蛛', emoji: '🕷️', tier: 'hard' },
  { word: '蛇', emoji: '🐍', tier: 'hard' },
  { word: '螃蟹', emoji: '🦀', tier: 'hard' },
  { word: '鯨魚', emoji: '🐋', tier: 'hard' },
  { word: '海豚', emoji: '🐬', tier: 'hard' },
  { word: '松鼠', emoji: '🐿️', tier: 'hard' },
  { word: '袋鼠', emoji: '🦘', tier: 'hard' },
  { word: '鷹', emoji: '🦅', tier: 'hard' },
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
