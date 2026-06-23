<script setup>
import { ref } from 'vue'
import AppMascot from './AppMascot.vue'
import { CHINESE_LEVELS } from '../utils/chinese'

const props = defineProps({ config: Object })
const emit = defineEmits(['start', 'back'])

const difficulty = ref(props.config?.difficulty || 'easy')

const levels = [
  { key: 'easy', emoji: '🐣', ...CHINESE_LEVELS.easy },
  { key: 'medium', emoji: '🐥', ...CHINESE_LEVELS.medium },
  { key: 'hard', emoji: '🦅', ...CHINESE_LEVELS.hard },
]

function go() {
  emit('start', { difficulty: difficulty.value })
}
</script>

<template>
  <div class="screen start">
    <button class="back-btn" @click="emit('back')">← Menu</button>
    <AppMascot mood="wave" />
    <h1 class="title">中文 · 詞語 🐼</h1>
    <p class="subtitle">Look at the picture and pick the word!</p>

    <div class="group-label">Pick a level</div>
    <div class="group">
      <button
        v-for="l in levels"
        :key="l.key"
        class="opt"
        :class="{ selected: difficulty === l.key }"
        @click="difficulty = l.key"
      >
        <span class="opt-emoji">{{ l.emoji }}</span>
        <span>{{ l.label }}</span>
        <span class="opt-sub">{{ l.sub }}</span>
      </button>
    </div>

    <button class="btn-primary" @click="go">Start! 🚀</button>
  </div>
</template>

<style scoped>
.start {
  max-width: 540px;
}
</style>
