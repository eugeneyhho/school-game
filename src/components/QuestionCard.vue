<script setup>
import { computed } from 'vue'

const props = defineProps({
  problem: Object, // { a, b, op, answer }
})

const EMOJIS = ['🍎', '🎈', '⭐', '🐠', '🌸', '🍓', '🦋', '🍋', '🌺', '🐢', '🍩', '🚀']

const opSymbol = computed(() => (props.problem?.op === 'subtract' ? '−' : '+'))

// Deterministic-but-varied emoji per problem so it stays stable during the question.
const emoji = computed(() => {
  const p = props.problem
  if (!p) return '🍎'
  return EMOJIS[(p.a * 7 + p.b * 3) % EMOJIS.length]
})

function repeat(n) {
  return Array.from({ length: n }, () => emoji.value)
}
</script>

<template>
  <div v-if="problem" class="question-card">
    <div class="equation">
      <span class="num">{{ problem.a }}</span>
      <span class="sym">{{ opSymbol }}</span>
      <span class="num">{{ problem.b }}</span>
      <span class="sym">=</span>
      <span class="num mystery">?</span>
    </div>
    <div class="aids">
      <div class="aid">
        <span
          v-for="(e, i) in repeat(problem.a)"
          :key="'a' + i"
          class="emoji"
          :style="{ animationDelay: i * 0.03 + 's' }"
          >{{ e }}</span
        >
      </div>
      <span class="sym big">{{ opSymbol }}</span>
      <div class="aid">
        <span
          v-for="(e, i) in repeat(problem.b)"
          :key="'b' + i"
          class="emoji"
          :style="{ animationDelay: i * 0.03 + 's' }"
          >{{ e }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  width: 100%;
  margin: 4px 0 6px;
}
.equation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  font-weight: 700;
}
.num {
  font-size: clamp(40px, 13vw, 72px);
  color: var(--ink);
  background: #fff;
  border-radius: 18px;
  min-width: 1.1em;
  padding: 2px 14px;
  box-shadow: 0 4px 0 #ece6f7;
}
.sym {
  font-size: clamp(34px, 11vw, 60px);
  color: var(--purple);
  font-weight: 700;
}
.mystery {
  color: var(--pink);
  background: linear-gradient(135deg, #fff0f6, #f3edff);
}
.aids {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.aid {
  display: flex;
  flex-wrap: wrap;
  max-width: 40vw;
  justify-content: center;
  gap: 1px;
}
.emoji {
  font-size: clamp(22px, 6vw, 30px);
  line-height: 1.15;
  animation: pop 0.3s ease backwards;
}
.big {
  font-size: clamp(28px, 8vw, 40px);
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
