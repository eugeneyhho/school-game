<script setup>
import { computed } from 'vue'
import { chineseGame as game } from '../composables/useChineseGame'
import { burst } from '../utils/confetti'
import { playCorrect, playWrong } from '../utils/sound'
import { speak } from '../utils/speech'
import { useLiveTimer } from '../composables/useLiveTimer'
import { formatDuration } from '../utils/format'
import AppMascot from './AppMascot.vue'
import AnswerButtons from './AnswerButtons.vue'

const emit = defineEmits(['finished', 'back'])

const { correctCount, streak, current, status, lastCorrect, word, emoji, choices } = game
const ROUND_LENGTH = game.ROUND_LENGTH
const liveMs = useLiveTimer(game.startTime)

const mascotMood = computed(() =>
  status.value === 'answered' ? (lastCorrect.value ? 'happy' : 'sad') : 'idle',
)

const praise = ['好棒!', '厲害!', '答對了!', '真厲害!', '超棒!', '太好了!']
const feedbackMsg = computed(() => praise[current.value % praise.length])

/** Speak the target word aloud (tap-to-hear pronunciation aid). */
function speakWord() {
  speak(word.value)
}

function onAnswer(value) {
  const ok = game.submit(value)
  if (ok) {
    burst()
    playCorrect()
  } else {
    playWrong()
  }
  const delay = ok ? 1100 : 1500
  setTimeout(() => {
    game.advance()
    if (game.status.value === 'finished') emit('finished')
  }, delay)
}
</script>

<template>
  <div class="game">
    <div class="topbar">
      <button class="home-btn" title="Menu" @click="emit('back')">🏠</button>
      <div class="timer">⏱️ {{ formatDuration(liveMs) }}</div>
      <div class="score">⭐ {{ correctCount }}</div>
      <div class="progress">
        <span
          v-for="i in ROUND_LENGTH"
          :key="i"
          class="dot"
          :class="{ done: i - 1 < current, active: i - 1 === current }"
        ></span>
      </div>
      <div class="streak">🔥 {{ streak }}</div>
    </div>

    <AppMascot :mood="mascotMood" />

    <button class="picture-btn" type="button" title="念給我聽" @click="speakWord">
      <div class="picture" :key="word">{{ emoji }}</div>
      <span class="speak-badge" aria-hidden="true">🔊</span>
    </button>
    <div class="hint">Tap 🔊 to hear the word!</div>

    <AnswerButtons
      :choices="choices"
      :answer="word"
      :reveal="status === 'answered'"
      @answer="onAnswer"
    />

    <Transition name="pop">
      <div
        v-if="status === 'answered'"
        class="feedback"
        :class="{ good: lastCorrect, bad: !lastCorrect }"
      >
        <div class="feedback-msg">{{ lastCorrect ? feedbackMsg : 'Oops!' }}</div>
        <div v-if="!lastCorrect" class="feedback-answer">The answer was {{ word }}</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: pop-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.3);
}
.picture-btn {
  position: relative;
  padding: 0;
  background: none;
  border: none;
  line-height: 0;
}
.picture-btn:active {
  transform: scale(0.96);
}
.speak-badge {
  position: absolute;
  right: 4px;
  bottom: 4px;
  font-size: clamp(22px, 6vw, 30px);
  line-height: 1;
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--card);
  box-shadow: 0 3px 10px rgba(91, 71, 145, 0.25);
}
.picture {
  font-size: clamp(80px, 28vw, 130px);
  line-height: 1;
  filter: drop-shadow(0 8px 10px rgba(91, 71, 145, 0.25));
  animation: pop 0.35s ease;
}
.hint {
  font-size: clamp(16px, 4.5vw, 20px);
  font-weight: 600;
  color: var(--ink-soft);
}
@keyframes pop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
