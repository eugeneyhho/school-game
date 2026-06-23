import { ref, reactive, computed } from 'vue'
import { pickWords, buildChoices } from '../utils/chinese'

// Number of words in a single round. 6 keeps rounds short and K3-friendly; every tier
// has well more than 6 words, so each round draws distinct words with plenty of variety.
export const ROUND_LENGTH = 6

// ---- Singleton Chinese-game state shared across screens --------------------
const config = reactive({ difficulty: 'easy' })

const roundWords = ref([])
const current = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
// status: 'idle' | 'playing' | 'answered' | 'finished'
const status = ref('idle')
const lastCorrect = ref(null)
const startTime = ref(0)
const elapsedMs = ref(0)

const word = ref('') // target 詞語
const emoji = ref('') // picture clue
const choices = ref([]) // multiple-choice options (string[])

const accuracy = computed(() =>
  Math.round((correctCount.value / ROUND_LENGTH) * 100),
)

function loadEntry(entry) {
  word.value = entry.word
  emoji.value = entry.emoji
  choices.value = buildChoices(entry.word, config.difficulty)
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
  loadEntry(roundWords.value[0])
}

/** Record an answer. Returns whether it was correct. */
function submit(value) {
  if (status.value !== 'playing') return false
  const isCorrect = value === word.value
  lastCorrect.value = isCorrect
  status.value = 'answered'
  if (isCorrect) {
    correctCount.value++
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
  } else {
    streak.value = 0
  }
  if (current.value === ROUND_LENGTH - 1) {
    elapsedMs.value = performance.now() - startTime.value
  }
  return isCorrect
}

/** Move to the next word, or end the round. */
function advance() {
  current.value++
  if (current.value >= ROUND_LENGTH) {
    status.value = 'finished'
  } else {
    loadEntry(roundWords.value[current.value])
  }
}

export const chineseGame = {
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
  choices,
  accuracy,
  start,
  submit,
  advance,
}
