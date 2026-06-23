<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  choices: Array,
  answer: [Number, String],
  reveal: Boolean,
})
const emit = defineEmits(['answer'])

const selected = ref(null)
// Reset selection whenever a new question's choices arrive.
watch(
  () => props.choices,
  () => {
    selected.value = null
  },
)

function pick(c) {
  if (selected.value !== null) return
  selected.value = c
  emit('answer', c)
}
</script>

<template>
  <div class="answer-buttons">
    <button
      v-for="c in choices"
      :key="c"
      class="choice"
      :class="{
        correct: reveal && c === answer,
        wrong: reveal && c === selected && c !== answer,
        chosen: c === selected,
      }"
      :disabled="selected !== null"
      @click="pick(c)"
    >
      {{ c }}
    </button>
  </div>
</template>

<style scoped>
.answer-buttons {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.choice {
  padding: 22px 10px;
  font-size: clamp(28px, 8vw, 40px);
  font-weight: 700;
  border-radius: 22px;
  background: linear-gradient(135deg, #ffffff, #f3edff);
  border: 3px solid #ece6f7;
  box-shadow: 0 6px 0 #e2d8f5;
  color: var(--ink);
}
.choice:hover:not(:disabled) {
  transform: translateY(-2px);
}
.choice:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #e2d8f5;
}
.choice.chosen:not(.correct):not(.wrong) {
  border-color: var(--blue);
  box-shadow: 0 6px 0 var(--blue);
}
.choice.correct {
  background: linear-gradient(135deg, #b2f2c9, #8ce99a);
  border-color: var(--green);
  box-shadow: 0 6px 0 var(--green);
  color: #1d6b32;
}
.choice.wrong {
  background: linear-gradient(135deg, #ffd0d0, #ffa3a3);
  border-color: #ff6b6b;
  box-shadow: 0 6px 0 #ff6b6b;
  color: #a32323;
  animation: shake 0.4s;
}
.choice:disabled {
  opacity: 1;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-6px);
  }
  80% {
    transform: translateX(6px);
  }
}
</style>
