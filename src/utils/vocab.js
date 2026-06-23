// English vocabulary for the spelling game: each word pairs with a picture (emoji).
export const VOCAB = [
  { word: 'cat', emoji: '🐱' },
  { word: 'dog', emoji: '🐶' },
  { word: 'sun', emoji: '☀️' },
  { word: 'cup', emoji: '🥤' },
  { word: 'hat', emoji: '🎩' },
  { word: 'egg', emoji: '🥚' },
  { word: 'bus', emoji: '🚌' },
  { word: 'car', emoji: '🚗' },
  { word: 'bed', emoji: '🛏️' },
  { word: 'apple', emoji: '🍎' },
  { word: 'fish', emoji: '🐟' },
  { word: 'bird', emoji: '🐦' },
  { word: 'book', emoji: '📖' },
  { word: 'star', emoji: '⭐' },
  { word: 'moon', emoji: '🌙' },
  { word: 'cake', emoji: '🎂' },
  { word: 'duck', emoji: '🦆' },
  { word: 'frog', emoji: '🐸' },
  { word: 'ship', emoji: '🚢' },
  { word: 'ball', emoji: '⚽' },
  { word: 'milk', emoji: '🥛' },
  { word: 'tree', emoji: '🌳' },
  { word: 'house', emoji: '🏠' },
  { word: 'bread', emoji: '🍞' },
]

// Levels control word length and how many extra (distractor) letter tiles appear.
export const ENGLISH_LEVELS = {
  easy: { minLen: 3, maxLen: 3, extras: 0, label: 'Easy', sub: '3 letters' },
  medium: { minLen: 3, maxLen: 4, extras: 1, label: 'Medium', sub: '3–4 letters' },
  hard: { minLen: 4, maxLen: 5, extras: 2, label: 'Hard', sub: '4–5 letters' },
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Pick `count` random words whose length fits the level. */
export function pickWords(difficulty, count) {
  const { minLen, maxLen } = ENGLISH_LEVELS[difficulty]
  const pool = shuffle(
    VOCAB.filter((v) => v.word.length >= minLen && v.word.length <= maxLen),
  )
  return pool.slice(0, count)
}

/**
 * Build the letter tiles for a word: the word's own letters plus `extras`
 * random distractor letters, all shuffled. Each tile gets a unique id so
 * repeated letters stay distinguishable.
 */
export function buildTiles(word, extras) {
  const letters = word.split('')
  for (let i = 0; i < extras; i++) {
    letters.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
  }
  return shuffle(letters).map((letter, id) => ({ id, letter }))
}
