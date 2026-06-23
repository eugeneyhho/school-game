<script setup>
import { computed, onMounted } from 'vue'
import { game } from '../composables/useGame'
import { celebrate } from '../utils/confetti'
import { formatDuration } from '../utils/format'

const emit = defineEmits(['play-again', 'change-settings', 'back'])

const correct = computed(() => game.correctCount.value)
const total = game.ROUND_LENGTH
const accuracy = computed(() => game.accuracy.value)
const bestStreak = computed(() => game.bestStreak.value)

const rating = computed(() => {
  const a = accuracy.value
  if (a >= 90) return { stars: 3, msg: 'Amazing!', emoji: '🏆' }
  if (a >= 70) return { stars: 2, msg: 'Great job!', emoji: '🎉' }
  if (a >= 50) return { stars: 1, msg: 'Good try!', emoji: '🌟' }
  return { stars: 0, msg: 'Keep practicing!', emoji: '💪' }
})

onMounted(() => {
  if (accuracy.value >= 70) celebrate()
})
</script>

<template>
  <div class="screen result">
    <div class="big-emoji">{{ rating.emoji }}</div>
    <div class="stars">
      <span
        v-for="i in 3"
        :key="i"
        class="star"
        :class="{ on: i <= rating.stars }"
        :style="{ animationDelay: i * 0.15 + 's' }"
        >⭐</span
      >
    </div>
    <div class="msg">{{ rating.msg }}</div>
    <div class="score-line">You got {{ correct }} out of {{ total }}! 🎯</div>
    <div class="acc">{{ accuracy }}% correct</div>
    <div class="time-line">⏱️ Your time: {{ formatDuration(game.elapsedMs.value) }}</div>
    <div class="streak-line">Best streak: 🔥 {{ bestStreak }}</div>

    <button class="btn-primary" @click="emit('play-again')">Play Again 🔄</button>
    <button class="btn-secondary" @click="emit('change-settings')">
      Change Settings ⚙️
    </button>
    <button class="btn-secondary" @click="emit('back')">🏠 Main Menu</button>
  </div>
</template>

<style scoped>
.result {
  max-width: 480px;
}
.big-emoji {
  font-size: 64px;
  line-height: 1;
}
.stars {
  font-size: 54px;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 6px 0;
}
.star {
  filter: grayscale(1);
  opacity: 0.35;
  transform: scale(0.85);
}
.star.on {
  filter: none;
  opacity: 1;
  transform: scale(1);
  animation: starpop 0.5s ease backwards;
}
@keyframes starpop {
  from {
    transform: scale(0) rotate(-30deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}
.msg {
  font-size: clamp(26px, 7vw, 38px);
  font-weight: 700;
  color: var(--purple);
  margin: 6px 0;
}
.score-line {
  font-size: clamp(22px, 6vw, 28px);
  font-weight: 700;
  margin-top: 6px;
}
.acc {
  color: var(--ink-soft);
  font-size: clamp(16px, 4.5vw, 20px);
}
.streak-line {
  color: var(--orange);
  font-weight: 600;
  margin: 6px 0 16px;
}
</style>
