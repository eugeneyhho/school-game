<script setup>
import { computed, onMounted } from 'vue'
import { englishGame as game } from '../composables/useEnglishGame'
import { celebrate } from '../utils/confetti'
import { playWin } from '../utils/sound'
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
    <div class="score-line">You spelled {{ correct }} out of {{ total }}! 🎯</div>
    <div class="acc">{{ accuracy }}% correct</div>
    <div class="time-line">⏱️ Your time: {{ formatDuration(game.elapsedMs.value) }}</div>
    <div class="streak-line">Best streak: 🔥 {{ bestStreak }}</div>

    <button class="btn-primary" @click="emit('play-again')">Play Again 🔄</button>
    <button class="btn-secondary" @click="emit('change-settings')">Change Level ⚙️</button>
    <button class="btn-secondary" @click="emit('back')">🏠 Main Menu</button>
  </div>
</template>
