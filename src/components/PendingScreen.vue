<script setup>
import AppMascot from './AppMascot.vue'

defineProps({
  title: { type: String, default: 'Coming Soon' },
  emoji: { type: String, default: '✨' },
})
const emit = defineEmits(['back'])
</script>

<template>
  <div class="screen pending">
    <AppMascot mood="idle" />
    <div class="big">{{ emoji }}</div>
    <h1 class="title">{{ title }}</h1>
    <p class="subtitle">This subject is coming soon! 🌟</p>
    <p class="hint">Check back later for new games.</p>
    <button class="btn-primary" @click="emit('back')">← Back to Menu</button>
  </div>
</template>

<style scoped>
.pending {
  max-width: 420px;
}
.big {
  font-size: 72px;
  line-height: 1;
  margin: 6px 0;
}
.hint {
  color: var(--ink-soft);
  font-size: 15px;
  margin-bottom: 18px;
}
</style>
