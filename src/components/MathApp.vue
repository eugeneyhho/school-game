<script setup>
import { ref } from 'vue'
import StartScreen from './StartScreen.vue'
import GameScreen from './GameScreen.vue'
import ResultScreen from './ResultScreen.vue'
import { game } from '../composables/useGame'

const emit = defineEmits(['back'])

// Math flow: start -> game -> results
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
  <StartScreen
    v-if="screen === 'start'"
    :config="game.config"
    @start="onStart"
    @back="emit('back')"
  />
  <GameScreen
    v-else-if="screen === 'game'"
    @finished="onFinished"
    @back="emit('back')"
  />
  <ResultScreen
    v-else
    @play-again="playAgain"
    @change-settings="changeSettings"
    @back="emit('back')"
  />
</template>
