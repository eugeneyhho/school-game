<script setup>
import { ref } from 'vue'
import EnglishStartScreen from './EnglishStartScreen.vue'
import EnglishGameScreen from './EnglishGameScreen.vue'
import EnglishResultScreen from './EnglishResultScreen.vue'
import { englishGame } from '../composables/useEnglishGame'

const emit = defineEmits(['back'])

// English flow: start -> game -> results
const screen = ref('start')

function onStart(cfg) {
  englishGame.start(cfg)
  screen.value = 'game'
}
function onFinished() {
  screen.value = 'results'
}
function playAgain() {
  englishGame.start(englishGame.config)
  screen.value = 'game'
}
function changeSettings() {
  screen.value = 'start'
}
</script>

<template>
  <EnglishStartScreen
    v-if="screen === 'start'"
    :config="englishGame.config"
    @start="onStart"
    @back="emit('back')"
  />
  <EnglishGameScreen
    v-else-if="screen === 'game'"
    @finished="onFinished"
    @back="emit('back')"
  />
  <EnglishResultScreen
    v-else
    @play-again="playAgain"
    @change-settings="changeSettings"
    @back="emit('back')"
  />
</template>
