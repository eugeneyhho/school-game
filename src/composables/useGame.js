import { ref, reactive, computed } from 'vue'
import { generateProblem, buildChoices } from '../utils/math'

// Number of questions in a single round.
export const ROUND_LENGTH = 10

// ---- Singleton game state shared across screens ---------------------------
const config = reactive({
  operation: 'add', // 'add' | 'subtract' | 'mixed'
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  answerMode: 'buttons', // 'buttons' | 'keypad'
})

const current = ref(0) // index of the current question (0-based)
const correctCount = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const problem = ref(null) // { a, b, op, answer }
const choices = ref([]) // shuffled multiple-choice options
// status: 'idle' (not playing) | 'playing' (awaiting answer) | 'answered' (showing feedback)
const status = ref('idle')
const lastCorrect = ref(null) // was the most recent answer correct?

const accuracy = computed(() =>
  Math.round((correctCount.value / ROUND_LENGTH) * 100),
)

function nextProblem() {
  problem.value = generateProblem(config)
  choices.value = buildChoices(problem.value.answer)
  status.value = 'playing'
  lastCorrect.value = null
}

/** Begin a new round with the given settings. */
function start(cfg) {
  Object.assign(config, cfg)
  current.value = 0
  correctCount.value = 0
  streak.value = 0
  bestStreak.value = 0
  nextProblem()
}

/** Record an answer. Returns whether it was correct. */
function submit(value) {
  if (status.value !== 'playing') return false
  const isCorrect = Number(value) === problem.value.answer
  lastCorrect.value = isCorrect
  status.value = 'answered'
  if (isCorrect) {
    correctCount.value++
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
  } else {
    streak.value = 0
  }
  return isCorrect
}

/** Move on after feedback. Ends the round on the last question. */
function advance() {
  current.value++
  if (current.value >= ROUND_LENGTH) {
    status.value = 'finished'
  } else {
    nextProblem()
  }
}

export const game = {
  ROUND_LENGTH,
  config,
  current,
  correctCount,
  streak,
  bestStreak,
  problem,
  choices,
  status,
  lastCorrect,
  accuracy,
  start,
  submit,
  advance,
}
