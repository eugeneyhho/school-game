<script setup>
import { ref } from 'vue'
import AppMascot from './AppMascot.vue'

const props = defineProps({ config: Object })
const emit = defineEmits(['start'])

const operation = ref(props.config?.operation || 'add')
const difficulty = ref(props.config?.difficulty || 'medium')
const answerMode = ref(props.config?.answerMode || 'buttons')

const operations = [
  { key: 'add', emoji: '➕', label: 'Add' },
  { key: 'subtract', emoji: '➖', label: 'Take Away' },
  { key: 'mixed', emoji: '🎲', label: 'Surprise' },
]
const difficulties = [
  { key: 'easy', emoji: '🐣', label: 'Easy', sub: '1 – 5' },
  { key: 'medium', emoji: '🐥', label: 'Medium', sub: '1 – 10' },
  { key: 'hard', emoji: '🦅', label: 'Hard', sub: '1 – 20' },
]
const modes = [
  { key: 'buttons', emoji: '🔘', label: 'Pick' },
  { key: 'keypad', emoji: '⌨️', label: 'Type' },
]

function go() {
  emit('start', {
    operation: operation.value,
    difficulty: difficulty.value,
    answerMode: answerMode.value,
  })
}
</script>

<template>
  <div class="screen start">
    <AppMascot mood="wave" />
    <h1 class="title">Math Adventure</h1>
    <p class="subtitle">Let's play with numbers! 🎈</p>

    <div class="group-label">What do you want to do?</div>
    <div class="group">
      <button
        v-for="o in operations"
        :key="o.key"
        class="opt"
        :class="{ selected: operation === o.key }"
        @click="operation = o.key"
      >
        <span class="opt-emoji">{{ o.emoji }}</span>
        <span>{{ o.label }}</span>
      </button>
    </div>

    <div class="group-label">Pick a level</div>
    <div class="group">
      <button
        v-for="d in difficulties"
        :key="d.key"
        class="opt"
        :class="{ selected: difficulty === d.key }"
        @click="difficulty = d.key"
      >
        <span class="opt-emoji">{{ d.emoji }}</span>
        <span>{{ d.label }}</span>
        <span class="opt-sub">{{ d.sub }}</span>
      </button>
    </div>

    <div class="group-label">How to answer</div>
    <div class="group">
      <button
        v-for="m in modes"
        :key="m.key"
        class="opt"
        :class="{ selected: answerMode === m.key }"
        @click="answerMode = m.key"
      >
        <span class="opt-emoji">{{ m.emoji }}</span>
        <span>{{ m.label }}</span>
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
