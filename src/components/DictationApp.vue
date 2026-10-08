<script setup>
import { ref } from 'vue'
import { dictationGame } from '../composables/useDictationGame'
import DictationStartScreen from './DictationStartScreen.vue'
import DictationGameScreen from './DictationGameScreen.vue'
import DictationResultScreen from './DictationResultScreen.vue'

const emit = defineEmits(['back'])
const screen = ref('start')

function onStart(config) {
  dictationGame.start(config)
  screen.value = 'game'
}

function playAgain() {
  dictationGame.start(dictationGame.config)
  screen.value = 'game'
}
</script>

<template>
  <DictationStartScreen
    v-if="screen === 'start'"
    :config="dictationGame.config"
    @start="onStart"
    @back="emit('back')"
  />
  <DictationGameScreen
    v-else-if="screen === 'game'"
    @finished="screen = 'results'"
    @back="emit('back')"
  />
  <DictationResultScreen
    v-else
    @play-again="playAgain"
    @change-level="screen = 'start'"
    @back="emit('back')"
  />
</template>
