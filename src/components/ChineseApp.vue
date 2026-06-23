<script setup>
import { ref } from 'vue'
import ChineseStartScreen from './ChineseStartScreen.vue'
import ChineseGameScreen from './ChineseGameScreen.vue'
import ChineseResultScreen from './ChineseResultScreen.vue'
import { chineseGame } from '../composables/useChineseGame'

const emit = defineEmits(['back'])

// Chinese flow: start -> game -> results
const screen = ref('start')

function onStart(cfg) {
  chineseGame.start(cfg)
  screen.value = 'game'
}
function onFinished() {
  screen.value = 'results'
}
function playAgain() {
  chineseGame.start(chineseGame.config)
  screen.value = 'game'
}
function changeSettings() {
  screen.value = 'start'
}
</script>

<template>
  <ChineseStartScreen
    v-if="screen === 'start'"
    :config="chineseGame.config"
    @start="onStart"
    @back="emit('back')"
  />
  <ChineseGameScreen
    v-else-if="screen === 'game'"
    @finished="onFinished"
    @back="emit('back')"
  />
  <ChineseResultScreen
    v-else
    @play-again="playAgain"
    @change-settings="changeSettings"
    @back="emit('back')"
  />
</template>
