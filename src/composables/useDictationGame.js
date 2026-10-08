import { computed, reactive, ref } from 'vue'
import {
  DICTATION_SENTENCES,
  normalizeDictationText,
  shuffleSentences,
} from '../utils/dictation'

export const DICTATION_ROUND_LENGTH = DICTATION_SENTENCES.length

const config = reactive({ level: 'normal' })
const roundSentences = ref([])
const current = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const status = ref('idle')
const lastCorrect = ref(null)
const submittedAnswer = ref(null)
const startTime = ref(0)
const elapsedMs = ref(0)

const sentence = computed(() => roundSentences.value[current.value] || null)
const accuracy = computed(() =>
  Math.round((correctCount.value / DICTATION_ROUND_LENGTH) * 100),
)

function start(nextConfig) {
  Object.assign(config, nextConfig)
  roundSentences.value = shuffleSentences(DICTATION_SENTENCES)
  current.value = 0
  correctCount.value = 0
  streak.value = 0
  bestStreak.value = 0
  status.value = 'playing'
  lastCorrect.value = null
  submittedAnswer.value = null
  startTime.value = performance.now()
  elapsedMs.value = 0
}

function submit(answer) {
  if (status.value !== 'playing' || !sentence.value) return

  submittedAnswer.value = Array.isArray(answer) ? [...answer] : answer
  const isCorrect =
    config.level === 'normal'
      ? sentence.value.keywords.every(
          (keyword, index) =>
            normalizeDictationText(answer[index]) === normalizeDictationText(keyword),
        )
      : normalizeDictationText(answer) === normalizeDictationText(sentence.value.text)

  lastCorrect.value = isCorrect
  status.value = 'answered'
  if (isCorrect) {
    correctCount.value++
    streak.value++
    bestStreak.value = Math.max(bestStreak.value, streak.value)
  } else {
    streak.value = 0
  }

  if (current.value === DICTATION_ROUND_LENGTH - 1) {
    elapsedMs.value = performance.now() - startTime.value
  }
}

function advance() {
  if (status.value !== 'answered') return
  current.value++
  if (current.value >= DICTATION_ROUND_LENGTH) {
    status.value = 'finished'
    return
  }
  status.value = 'playing'
  lastCorrect.value = null
  submittedAnswer.value = null
}

export const dictationGame = {
  ROUND_LENGTH: DICTATION_ROUND_LENGTH,
  config,
  current,
  correctCount,
  streak,
  bestStreak,
  status,
  lastCorrect,
  submittedAnswer,
  startTime,
  elapsedMs,
  sentence,
  accuracy,
  start,
  submit,
  advance,
}
