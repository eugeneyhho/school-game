<script setup>
import { ref } from 'vue'
import AppMascot from './AppMascot.vue'

const props = defineProps({ config: Object })
const emit = defineEmits(['start', 'back'])
const level = ref(props.config?.level || 'normal')

const levels = [
  {
    key: 'normal',
    emoji: '✏️',
    label: 'Normal',
    sub: 'Fill in key words',
  },
  {
    key: 'hard',
    emoji: '🎧',
    label: 'Hard',
    sub: 'Type the full sentence',
  },
]
</script>

<template>
  <div class="screen start">
    <button class="back-btn" @click="emit('back')">← Menu</button>
    <AppMascot mood="wave" />
    <h1 class="title">Dictation Revision 🎧</h1>
    <p class="subtitle">Listen carefully and complete each sentence.</p>

    <div class="group-label">Pick a level</div>
    <div class="group">
      <button
        v-for="option in levels"
        :key="option.key"
        class="opt"
        :class="{ selected: level === option.key }"
        @click="level = option.key"
      >
        <span class="opt-emoji">{{ option.emoji }}</span>
        <span>{{ option.label }}</span>
        <span class="opt-sub">{{ option.sub }}</span>
      </button>
    </div>

    <button class="btn-primary" @click="emit('start', { level })">Start! 🚀</button>
  </div>
</template>

<style scoped>
.start {
  max-width: 540px;
}
</style>
