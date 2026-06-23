<script setup>
defineProps({
  mood: { type: String, default: 'wave' }, // 'wave' | 'idle' | 'happy' | 'sad'
})
</script>

<template>
  <div class="mascot" :class="mood"><span class="face">🦊</span></div>
</template>

<style scoped>
.mascot {
  font-size: 64px;
  line-height: 1;
  display: inline-block;
}
.face {
  display: inline-block;
  filter: drop-shadow(0 6px 8px rgba(91, 71, 145, 0.25));
}
.wave .face {
  animation: wave 2.4s ease-in-out infinite;
}
.idle .face {
  animation: bob 2.6s ease-in-out infinite;
}
.happy .face {
  animation: happy 0.6s ease-in-out 2;
}
.sad .face {
  animation: sad 0.5s ease-in-out 2;
}
@keyframes wave {
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
}
@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes happy {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-22px) scale(1.25);
  }
}
@keyframes sad {
  0%,
  100% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-8px) rotate(-8deg);
  }
  75% {
    transform: translateX(8px) rotate(8deg);
  }
}
</style>
