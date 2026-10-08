<script setup>
import { computed, ref, watch } from 'vue'
import { dictationGame as game } from '../composables/useDictationGame'
import { normalizeDictationText } from '../utils/dictation'
import { speak } from '../utils/speech'
import { burst } from '../utils/confetti'
import { playCorrect, playWrong } from '../utils/sound'
import { useLiveTimer } from '../composables/useLiveTimer'
import { formatDuration } from '../utils/format'
import AppMascot from './AppMascot.vue'

const emit = defineEmits(['finished', 'back'])
const answers = ref([])
const fullAnswer = ref('')
const liveMs = useLiveTimer(game.startTime)

const parts = computed(() => {
  if (!game.sentence.value) return []
  let answerIndex = 0
  const keywords = game.sentence.value.keywords.map((word) => word.toLowerCase())
  return game.sentence.value.text.split(/(\b[A-Za-z]+\b)/).map((text, index) => {
    const keywordIndex = keywords.indexOf(text.toLowerCase())
    if (keywordIndex === -1) return { key: index, text, answerIndex: -1 }
    return { key: index, text, answerIndex: answerIndex++ }
  })
})

const canSubmit = computed(() => {
  if (game.status.value !== 'playing') return false
  if (game.config.level === 'hard') return fullAnswer.value.trim().length > 0
  return (
    answers.value.length === game.sentence.value?.keywords.length &&
    answers.value.every((answer) => answer?.trim())
  )
})

const mascotMood = computed(() =>
  game.status.value === 'answered'
    ? game.lastCorrect.value
      ? 'happy'
      : 'sad'
    : 'idle',
)

watch(
  () => game.current.value,
  () => {
    answers.value = Array(game.sentence.value?.keywords.length || 0).fill('')
    fullAnswer.value = ''
  },
  { immediate: true },
)

function hearSentence() {
  speak(game.sentence.value.text, 'en-US', {
    rate: 0.42,
    preferFemale: true,
    preferredVoiceNames: ['Samantha'],
  })
}

function submitAnswer() {
  if (!canSubmit.value) return
  game.submit(game.config.level === 'normal' ? answers.value : fullAnswer.value)
  if (game.lastCorrect.value) {
    burst()
    playCorrect()
  } else {
    playWrong()
  }
}

function nextSentence() {
  game.advance()
  if (game.status.value === 'finished') emit('finished')
}

function isKeywordCorrect(index) {
  return (
    normalizeDictationText(answers.value[index]) ===
    normalizeDictationText(game.sentence.value.keywords[index])
  )
}
</script>

<template>
  <div class="game">
    <div class="topbar">
      <button class="home-btn" title="Menu" @click="emit('back')">🏠</button>
      <div class="timer">⏱️ {{ formatDuration(liveMs) }}</div>
      <div class="score">⭐ {{ game.correctCount.value }}</div>
      <div class="progress">
        <span
          v-for="i in game.ROUND_LENGTH"
          :key="i"
          class="dot"
          :class="{ done: i - 1 < game.current.value, active: i - 1 === game.current.value }"
        ></span>
      </div>
      <div class="streak">🔥 {{ game.streak.value }}</div>
    </div>

    <AppMascot :mood="mascotMood" />

    <button class="listen-btn" type="button" @click="hearSentence">
      <span class="listen-icon">🔊</span>
      <span>Listen to sentence {{ game.current.value + 1 }}</span>
    </button>
    <p class="hint">You can listen as many times as you need.</p>

    <form class="answer-card" @submit.prevent="submitAnswer">
      <div v-if="game.config.level === 'normal'" class="sentence normal-sentence">
        <span v-for="part in parts" :key="part.key" class="sentence-part">
          <input
            v-if="part.answerIndex >= 0"
            v-model="answers[part.answerIndex]"
            class="word-input"
            :class="{
              correct:
                game.status.value === 'answered' && isKeywordCorrect(part.answerIndex),
              wrong:
                game.status.value === 'answered' && !isKeywordCorrect(part.answerIndex),
            }"
            :style="{ width: `${Math.max(part.text.length + 2, 6)}ch` }"
            :aria-label="`Missing word ${part.answerIndex + 1}`"
            :disabled="game.status.value !== 'playing'"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
          />
          <span v-else>{{ part.text }}</span>
        </span>
      </div>

      <textarea
        v-else
        v-model="fullAnswer"
        class="full-answer"
        :class="{
          correct: game.status.value === 'answered' && game.lastCorrect.value,
          wrong: game.status.value === 'answered' && !game.lastCorrect.value,
        }"
        rows="3"
        placeholder="Type the full sentence..."
        aria-label="Full sentence"
        :disabled="game.status.value !== 'playing'"
        autocomplete="off"
        spellcheck="false"
      ></textarea>

      <button
        v-if="game.status.value === 'playing'"
        class="btn-primary check-btn"
        type="submit"
        :disabled="!canSubmit"
      >
        Check Answer ✓
      </button>
    </form>

    <div
      v-if="game.status.value === 'answered'"
      class="feedback"
      :class="{ good: game.lastCorrect.value, bad: !game.lastCorrect.value }"
    >
      <div class="feedback-msg">
        {{ game.lastCorrect.value ? 'Great listening!' : 'Keep practising!' }}
      </div>
      <div v-if="!game.lastCorrect.value" class="correct-answer">
        {{ game.sentence.value.text }}
      </div>
      <button class="next-btn" @click="nextSentence">
        {{ game.current.value === game.ROUND_LENGTH - 1 ? 'See Results' : 'Next Sentence' }}
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.game {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: pop-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.3);
}
.listen-btn {
  width: min(100%, 420px);
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 22px;
  color: #fff;
  background: linear-gradient(135deg, #845ef7, #5c7cfa);
  box-shadow: 0 7px 0 #6741d9;
  font-size: clamp(18px, 5vw, 24px);
}
.listen-btn:active {
  transform: translateY(4px);
  box-shadow: 0 3px 0 #6741d9;
}
.listen-icon {
  font-size: 1.3em;
}
.hint {
  color: var(--ink-soft);
  font-size: 14px;
}
.answer-card {
  width: 100%;
  padding: 20px;
  border-radius: 24px;
  background: var(--card);
  box-shadow: var(--shadow);
}
.sentence {
  color: var(--ink);
  font-size: clamp(22px, 5.8vw, 32px);
  font-weight: 600;
  line-height: 2.1;
}
.normal-sentence {
  white-space: pre-wrap;
}
.sentence-part {
  white-space: pre-wrap;
}
.word-input {
  min-width: 72px;
  padding: 4px 8px;
  border: 0;
  border-bottom: 4px solid var(--purple);
  border-radius: 10px 10px 4px 4px;
  outline: none;
  background: #f3edff;
  color: var(--ink);
  font: inherit;
  text-align: center;
}
.word-input:focus {
  background: #fff0f6;
  border-color: var(--pink);
}
.word-input.correct,
.full-answer.correct {
  border-color: var(--green);
  background: #d3f9d8;
}
.word-input.wrong,
.full-answer.wrong {
  border-color: #ff6b6b;
  background: #ffe5e5;
}
.full-answer {
  width: 100%;
  resize: vertical;
  padding: 16px;
  border: 3px solid #d8cdf5;
  border-radius: 18px;
  outline: none;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 600;
  line-height: 1.5;
}
.full-answer:focus {
  border-color: var(--purple);
}
.check-btn {
  margin-top: 18px;
}
.check-btn:disabled {
  opacity: 0.45;
  transform: none;
  box-shadow: 0 5px 0 #d94f7e;
}
.feedback {
  position: static;
  width: 100%;
  transform: none;
  padding: 16px 20px;
}
.correct-answer {
  margin: 8px 0 12px;
  font-size: clamp(18px, 4.6vw, 24px);
  font-weight: 600;
}
.next-btn {
  padding: 12px 20px;
  border-radius: 15px;
  background: #fff;
  color: var(--ink);
  font-size: 17px;
}

@media (max-width: 480px) {
  .topbar {
    gap: 6px;
  }
  .timer {
    display: none;
  }
  .answer-card {
    padding: 16px 12px;
  }
}
</style>
