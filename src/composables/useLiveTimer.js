import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive elapsed-milliseconds that ticks every 100ms while the component is
 * mounted, measured from the `startRef` timestamp. The interval is cleared on
 * unmount, so it only runs for the lifetime of the game screen.
 */
export function useLiveTimer(startRef) {
  const elapsed = ref(0)
  let id = null

  onMounted(() => {
    const tick = () => {
      elapsed.value = startRef.value ? performance.now() - startRef.value : 0
    }
    tick()
    id = setInterval(tick, 100)
  })

  onUnmounted(() => {
    if (id) clearInterval(id)
  })

  return elapsed
}
