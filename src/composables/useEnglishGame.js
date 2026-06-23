import { ref, reactive, computed } from 'vue'
import { ENGLISH_LEVELS, pickWords, buildTiles } from '../utils/vocab'

// Number of words in a single round.
export const ROUND_LENGTH = 8

// ---- Singleton English-game state shared across screens -------------------
const config = reactive({ difficulty: 'easy' })

const roundWords = ref([])
const current = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
// status: 'idle' | 'playing' | 'answered'
const status = ref('idle')
const lastCorrect = ref(null)
const startTime = ref(0)
const elapsedMs = ref(0)

const word = ref('') // target word
const emoji = ref('') // picture clue
const tiles = ref([]) // [{ id, letter }] available letter tiles
const slots = ref([]) // ordered tile ids the player has placed

const accuracy = computed(() =>
  Math.round((correctCount.value / ROUND_LENGTH) * 100),
)
const placed = computed(() =>
  slots.value.map((id) => tiles.value.find((t) => t.id === id)?.letter || ''),
)
const available = computed(() =>
  tiles.value.filter((t) => !slots.value.includes(t.id)),
)

function loadWord(w) {
  word.value = w.word
  emoji.value = w.emoji
  tiles.value = buildTiles(w.word, ENGLISH_LEVELS[config.difficulty].extras)
  slots.value = []
  status.value = 'playing'
  lastCorrect.value = null
}

/** Begin a new round with the chosen difficulty. */
function start(cfg) {
  Object.assign(config, cfg)
  current.value = 0
  correctCount.value = 0
  streak.value = 0
  bestStreak.value = 0
  startTime.value = performance.now()
  elapsedMs.value = 0
  roundWords.value = pickWords(config.difficulty, ROUND_LENGTH)
  loadWord(roundWords.value[0])
}

/** Place a letter tile into the next slot; auto-checks once the word is full. */
function place(id) {
  if (status.value !== 'playing' || slots.value.includes(id)) return
  slots.value = [...slots.value, id]
  if (slots.value.length >= word.value.length) check()
}

/** Remove the most recently placed tile. */
function backspace() {
  if (status.value !== 'playing' || slots.value.length === 0) return
  slots.value = slots.value.slice(0, -1)
}

function check() {
  const ok = placed.value.join('') === word.value
  lastCorrect.value = ok
  status.value = 'answered'
  if (ok) {
    correctCount.value++
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
  } else {
    streak.value = 0
  }
  if (current.value === ROUND_LENGTH - 1) {
    elapsedMs.value = performance.now() - startTime.value
  }
}

/** Move to the next word, or end the round. */
function advance() {
  current.value++
  if (current.value >= ROUND_LENGTH) {
    status.value = 'finished'
  } else {
    loadWord(roundWords.value[current.value])
  }
}

export const englishGame = {
  ROUND_LENGTH,
  config,
  current,
  correctCount,
  streak,
  bestStreak,
  status,
  lastCorrect,
  startTime,
  elapsedMs,
  word,
  emoji,
  tiles,
  slots,
  placed,
  available,
  accuracy,
  start,
  place,
  backspace,
  advance,
}
