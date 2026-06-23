<script setup>
import { ref } from 'vue'
import HomeScreen from './components/HomeScreen.vue'
import MathApp from './components/MathApp.vue'
import EnglishApp from './components/EnglishApp.vue'
import PendingScreen from './components/PendingScreen.vue'

// Top-level subject switcher: null (home) | 'math' | 'english' | 'chinese'
const subject = ref(null)

function selectSubject(key) {
  subject.value = key
}
function backToMenu() {
  subject.value = null
}
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
