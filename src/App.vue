<script setup>
import { ref } from 'vue'
import StartScreen from './components/StartScreen.vue'
import GameScreen from './components/GameScreen.vue'
import ResultScreen from './components/ResultScreen.vue'
import { game } from './composables/useGame'

// Top-level state machine: 'start' -> 'game' -> 'results'
const screen = ref('start')

function onStart(cfg) {
  game.start(cfg)
  screen.value = 'game'
}

function onFinished() {
  screen.value = 'results'
}

function playAgain() {
  game.start(game.config)
  screen.value = 'game'
}

function changeSettings() {
  screen.value = 'start'
}
</script>

<template>
  <StartScreen v-if="screen === 'start'" :config="game.config" @start="onStart" />
  <GameScreen v-else-if="screen === 'game'" @finished="onFinished" />
  <ResultScreen
    v-else
    @play-again="playAgain"
    @change-settings="changeSettings"
  />
</template>
