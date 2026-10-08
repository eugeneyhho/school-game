<script setup>
import { computed, onMounted } from 'vue'
import { dictationGame as game } from '../composables/useDictationGame'
import { celebrate } from '../utils/confetti'
import { playWin } from '../utils/sound'
import { formatDuration } from '../utils/format'

const emit = defineEmits(['play-again', 'change-level', 'back'])
const accuracy = computed(() => game.accuracy.value)

const rating = computed(() => {
  if (accuracy.value >= 90) return { stars: 3, msg: 'Amazing!', emoji: '🏆' }
  if (accuracy.value >= 70) return { stars: 2, msg: 'Great job!', emoji: '🎉' }
  if (accuracy.value >= 50) return { stars: 1, msg: 'Good try!', emoji: '🌟' }
  return { stars: 0, msg: 'Keep practising!', emoji: '💪' }
})

onMounted(() => {
  if (accuracy.value >= 70) {
    celebrate()
    playWin()
  }
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
    <div class="score-line">
      You completed {{ game.correctCount.value }} out of {{ game.ROUND_LENGTH }}! 🎯
    </div>
    <div class="acc">{{ accuracy }}% correct</div>
    <div class="time-line">⏱️ Your time: {{ formatDuration(game.elapsedMs.value) }}</div>
    <div class="streak-line">Best streak: 🔥 {{ game.bestStreak.value }}</div>

    <button class="btn-primary" @click="emit('play-again')">Practise Again 🔄</button>
    <button class="btn-secondary" @click="emit('change-level')">Change Level ⚙️</button>
    <button class="btn-secondary" @click="emit('back')">🏠 Main Menu</button>
  </div>
</template>
