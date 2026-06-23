<script setup>
import { computed } from 'vue'
import { englishGame as game } from '../composables/useEnglishGame'
import { burst } from '../utils/confetti'
import { playPlace, playBackspace, playCorrect, playWrong } from '../utils/sound'
import { useLiveTimer } from '../composables/useLiveTimer'
import { formatDuration } from '../utils/format'
import AppMascot from './AppMascot.vue'

const emit = defineEmits(['finished', 'back'])

const { correctCount, streak, current, status, lastCorrect, word, emoji, available, placed } =
  game
const ROUND_LENGTH = game.ROUND_LENGTH
const liveMs = useLiveTimer(game.startTime)

const mascotMood = computed(() =>
  status.value === 'answered' ? (lastCorrect.value ? 'happy' : 'sad') : 'idle',
)
const praise = ['Great!', 'Awesome!', 'Well done!', 'Perfect!', 'Super!', 'Brilliant!']
const feedbackMsg = computed(() => praise[current.value % praise.length])

const wordArray = computed(() => word.value.split(''))
const placedLen = computed(() => placed.value.length)

let timer = null
function onPlace(id) {
  game.place(id)
  playPlace()
  if (game.status.value === 'answered') scheduleAdvance()
}
function onBackspace() {
  game.backspace()
  playBackspace()
}
function scheduleAdvance() {
  if (game.lastCorrect.value) {
    burst()
    playCorrect()
  } else {
    playWrong()
  }
  const delay = game.lastCorrect.value ? 1100 : 1700
  clearTimeout(timer)
  timer = setTimeout(() => {
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

    <div class="picture" :key="word">{{ emoji }}</div>
    <div class="hint">Spell the word!</div>

    <div class="slots">
      <span
        v-for="(letter, i) in wordArray"
        :key="i"
        class="slot"
        :class="{
          filled: i < placedLen,
          correct: status === 'answered' && lastCorrect,
          wrong: status === 'answered' && !lastCorrect && placed[i] !== letter,
        }"
        >{{ i < placedLen ? placed[i] : '' }}</span
      >
    </div>

    <div class="tiles">
      <button
        v-for="t in available"
        :key="t.id"
        class="tile"
        :disabled="status !== 'playing'"
        @click="onPlace(t.id)"
      >
        {{ t.letter }}
      </button>
    </div>

    <button
      class="backspace"
      :disabled="status !== 'playing' || placedLen === 0"
      @click="onBackspace"
    >
      ⌫
    </button>

    <Transition name="pop">
      <div
        v-if="status === 'answered'"
        class="feedback"
        :class="{ good: lastCorrect, bad: !lastCorrect }"
      >
        <div class="feedback-msg">{{ lastCorrect ? feedbackMsg : 'Oops!' }}</div>
        <div v-if="!lastCorrect" class="feedback-answer">
          The word was <b>{{ word }}</b>
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
.slots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.slot {
  width: clamp(44px, 12vw, 58px);
  height: clamp(56px, 15vw, 72px);
  border-radius: 16px;
  background: #fff;
  border: 3px dashed #d8cdf5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(28px, 8vw, 40px);
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}
.slot.filled {
  border-style: solid;
  border-color: var(--purple);
  background: linear-gradient(135deg, #ffffff, #f3edff);
}
.slot.correct {
  border-color: var(--green);
  background: linear-gradient(135deg, #d3f9d8, #b2f2c9);
  color: #1d6b32;
}
.slot.wrong {
  border-color: #ff6b6b;
  background: linear-gradient(135deg, #ffe5e5, #ffd0d0);
  color: #a32323;
}
.tiles {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 440px;
}
.tile {
  width: clamp(48px, 13vw, 62px);
  height: clamp(52px, 14vw, 66px);
  border-radius: 16px;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 700;
  text-transform: uppercase;
  background: linear-gradient(135deg, #ffffff, #eef2ff);
  border: 3px solid #e2e8f5;
  box-shadow: 0 5px 0 #d7def0;
  color: var(--ink);
}
.tile:hover:not(:disabled) {
  transform: translateY(-2px);
}
.tile:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #d7def0;
}
.tile:disabled {
  opacity: 0.4;
}
.backspace {
  padding: 12px 26px;
  font-size: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffe9b0, #ffd43b);
  border: 3px solid #f0c000;
  box-shadow: 0 5px 0 #e0a800;
  color: var(--ink);
}
.backspace:disabled {
  opacity: 0.4;
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
