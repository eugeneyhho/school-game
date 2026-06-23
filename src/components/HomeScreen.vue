<script setup>
import AppMascot from './AppMascot.vue'
import { useSound } from '../composables/useSound'
import { playTap } from '../utils/sound'

const emit = defineEmits(['select'])

const { muted, toggleMute } = useSound()

const subjects = [
  {
    key: 'chinese',
    emoji: '🐼',
    title: '中文',
    sub: 'Chinese',
    color: '#ff922b',
    pending: true,
  },
  {
    key: 'english',
    emoji: '🔤',
    title: 'English',
    sub: 'Picture Words',
    color: '#4dabf7',
    pending: false,
  },
  {
    key: 'math',
    emoji: '🔢',
    title: 'Math',
    sub: 'Add & Subtract',
    color: '#51cf66',
    pending: false,
  },
]

function pick(key) {
  playTap()
  emit('select', key)
}
</script>

<template>
  <button
    class="sound-btn"
    :title="muted ? 'Unmute' : 'Mute'"
    @click="toggleMute"
  >
    {{ muted ? '🔇' : '🔊' }}
  </button>
  <div class="screen home">
    <AppMascot mood="wave" />
    <h1 class="title">Learning Games</h1>
    <p class="subtitle">Pick a subject to play! 🌈</p>

    <div class="cards">
      <button
        v-for="s in subjects"
        :key="s.key"
        class="card"
        :class="{ pending: s.pending }"
        :style="{ '--c': s.color }"
        @click="pick(s.key)"
      >
        <span v-if="s.pending" class="badge">Coming Soon</span>
        <span class="card-emoji">{{ s.emoji }}</span>
        <span class="card-title">{{ s.title }}</span>
        <span class="card-sub">{{ s.sub }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 460px;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
}
.card {
  position: relative;
  width: 100%;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 24px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 18%, #fff), #fff);
  border: 3px solid color-mix(in srgb, var(--c) 45%, #fff);
  box-shadow: 0 8px 0 color-mix(in srgb, var(--c) 55%, #fff);
  text-align: left;
}
.card:hover {
  transform: translateY(-2px);
}
.card:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--c) 55%, #fff);
}
.card-emoji {
  font-size: 46px;
  line-height: 1;
}
.card-title {
  font-size: clamp(22px, 6vw, 28px);
  font-weight: 700;
  color: var(--ink);
}
.card-sub {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-soft);
}
.card.pending {
  opacity: 0.85;
}
.badge {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: var(--ink-soft);
  padding: 3px 9px;
  border-radius: 10px;
}
</style>
