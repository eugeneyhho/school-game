<script setup>
import { ref, watch, computed } from 'vue'
import { playTap, playBackspace } from '../utils/sound'

const props = defineProps({
  answer: Number,
  reveal: Boolean,
})
const emit = defineEmits(['answer'])

const entry = ref('')
// Clear the display whenever a new question appears.
watch(
  () => props.answer,
  () => {
    entry.value = ''
  },
)

const displayClass = computed(() => {
  if (!props.reveal || entry.value === '') return ''
  return Number(entry.value) === props.answer ? 'correct' : 'wrong'
})

function press(d) {
  if (props.reveal) return
  if (entry.value.length >= 3) return
  entry.value += d
  playTap()
}
function clearEntry() {
  entry.value = ''
  playBackspace()
}
function check() {
  if (entry.value === '' || props.reveal) return
  emit('answer', Number(entry.value))
}
</script>

<template>
  <div class="keypad">
    <div class="display" :class="displayClass">
      <span v-if="entry">{{ entry }}</span>
      <span v-else class="placeholder">?</span>
    </div>
    <div class="keys">
      <button
        v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="n"
        class="key"
        :disabled="reveal"
        @click="press(String(n))"
      >
        {{ n }}
      </button>
      <button class="key action clear" :disabled="reveal" @click="clearEntry">↩</button>
      <button class="key" :disabled="reveal" @click="press('0')">0</button>
      <button
        class="key action check"
        :disabled="reveal || entry === ''"
        @click="check"
      >
        ✓
      </button>
    </div>
  </div>
</template>

<style scoped>
.keypad {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.display {
  min-width: 180px;
  padding: 12px 28px;
  font-size: clamp(36px, 11vw, 56px);
  font-weight: 700;
  background: #fff;
  border-radius: 20px;
  border: 3px solid #ece6f7;
  box-shadow: 0 6px 0 #e2d8f5;
  color: var(--ink);
}
.display .placeholder {
  color: #cfc6e6;
}
.display.correct {
  background: linear-gradient(135deg, #b2f2c9, #8ce99a);
  border-color: var(--green);
  box-shadow: 0 6px 0 var(--green);
  color: #1d6b32;
}
.display.wrong {
  background: linear-gradient(135deg, #ffd0d0, #ffa3a3);
  border-color: #ff6b6b;
  box-shadow: 0 6px 0 #ff6b6b;
  color: #a32323;
}
.keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 320px;
}
.key {
  padding: 16px 0;
  font-size: clamp(24px, 7vw, 32px);
  font-weight: 700;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff, #eef2ff);
  border: 3px solid #e2e8f5;
  box-shadow: 0 5px 0 #d7def0;
  color: var(--ink);
}
.key:hover:not(:disabled) {
  transform: translateY(-2px);
}
.key:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #d7def0;
}
.key.check {
  background: linear-gradient(135deg, var(--green), #37b24d);
  color: #fff;
  border-color: #37b24d;
  box-shadow: 0 5px 0 #2f9e44;
}
.key.clear {
  background: linear-gradient(135deg, #ffe9b0, #ffd43b);
  border-color: #f0c000;
  box-shadow: 0 5px 0 #e0a800;
}
.key:disabled {
  opacity: 0.5;
}
</style>
