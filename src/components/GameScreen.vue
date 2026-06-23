<script setup>
import { computed } from 'vue'
import { game } from '../composables/useGame'
import { burst } from '../utils/confetti'
import { useLiveTimer } from '../composables/useLiveTimer'
import { formatDuration } from '../utils/format'
import QuestionCard from './QuestionCard.vue'
import AnswerButtons from './AnswerButtons.vue'
import AnswerKeypad from './AnswerKeypad.vue'
import AppMascot from './AppMascot.vue'

const emit = defineEmits(['finished', 'back'])

const {
  correctCount,
  streak,
  current,
  status,
  lastCorrect,
  problem,
  choices,
  config,
} = game
const ROUND_LENGTH = game.ROUND_LENGTH
const liveMs = useLiveTimer(game.startTime)

const mascotMood = computed(() =>
  status.value === 'answered' ? (lastCorrect.value ? 'happy' : 'sad') : 'idle',
)

const praise = ['Great job!', 'Awesome!', 'You got it!', 'Wonderful!', 'Super!', 'Woohoo!']
const feedbackMsg = computed(() => praise[current.value % praise.length])

function onAnswer(value) {
  const ok = game.submit(value)
  if (ok) burst()
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
          :class="{
            done: i - 1 < current,
            active: i - 1 === current,
          }"
        ></span>
      </div>
      <div class="streak">🔥 {{ streak }}</div>
    </div>

    <AppMascot :mood="mascotMood" />

    <QuestionCard :problem="problem" />

    <AnswerButtons
      v-if="config.answerMode === 'buttons'"
      :choices="choices"
      :answer="problem.answer"
      :reveal="status === 'answered'"
      @answer="onAnswer"
    />
    <AnswerKeypad
      v-else
      :answer="problem.answer"
      :reveal="status === 'answered'"
      @answer="onAnswer"
    />

    <Transition name="pop">
      <div
        v-if="status === 'answered'"
        class="feedback"
        :class="{ good: lastCorrect, bad: !lastCorrect }"
      >
        <div class="feedback-msg">
          {{ lastCorrect ? feedbackMsg : 'Oops!' }}
        </div>
        <div v-if="!lastCorrect" class="feedback-answer">
          The answer was {{ problem.answer }}
        </div>
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
.topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--card);
  border-radius: 22px;
  padding: 12px 16px;
  box-shadow: var(--shadow);
  font-weight: 700;
}
.score {
  color: var(--orange);
  font-size: clamp(18px, 5vw, 24px);
  min-width: 60px;
  text-align: left;
}
.streak {
  color: #ff7a45;
  font-size: clamp(18px, 5vw, 24px);
  min-width: 60px;
  text-align: right;
}
.progress {
  flex: 1;
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #e2d8f5;
  transition: all 0.2s;
}
.dot.done {
  background: var(--green);
  transform: scale(1.05);
}
.dot.active {
  background: var(--pink);
  transform: scale(1.4);
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.25);
}
.feedback {
  margin-top: 2px;
  padding: 12px 22px;
  border-radius: 20px;
  font-weight: 700;
  text-align: center;
}
.feedback.good {
  background: linear-gradient(135deg, #d3f9d8, #b2f2c9);
  color: #1d6b32;
}
.feedback.bad {
  background: linear-gradient(135deg, #ffe5e5, #ffd0d0);
  color: #a32323;
}
.feedback-msg {
  font-size: clamp(22px, 6vw, 30px);
}
.feedback-answer {
  font-size: clamp(15px, 4vw, 18px);
  margin-top: 2px;
}
.pop-enter-active {
  transition: all 0.25s ease;
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
