<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HomeScreen from './components/HomeScreen.vue'
import MathApp from './components/MathApp.vue'
import EnglishApp from './components/EnglishApp.vue'
import PendingScreen from './components/PendingScreen.vue'
import { unlock } from './utils/sound'

// Top-level subject switcher: null (home) | 'math' | 'english' | 'chinese'
const subject = ref(null)

function selectSubject(key) {
  subject.value = key
}
function backToMenu() {
  subject.value = null
}

// Browsers suspend the AudioContext until a user gesture. The first pointerdown
// resumes it so the very first sound (e.g. tapping a subject) actually plays.
function onFirstGesture() {
  unlock()
  window.removeEventListener('pointerdown', onFirstGesture)
  window.removeEventListener('keydown', onFirstGesture)
}
onMounted(() => {
  window.addEventListener('pointerdown', onFirstGesture)
  window.addEventListener('keydown', onFirstGesture)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onFirstGesture)
  window.removeEventListener('keydown', onFirstGesture)
})
</script>

<template>
  <HomeScreen v-if="!subject" @select="selectSubject" />
  <MathApp v-else-if="subject === 'math'" @back="backToMenu" />
  <EnglishApp v-else-if="subject === 'english'" @back="backToMenu" />
  <PendingScreen
    v-else-if="subject === 'chinese'"
    title="中文"
    emoji="🐼"
    @back="backToMenu"
  />
</template>
