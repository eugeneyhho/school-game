// Reactive wrapper around the pure sound engine (utils/sound.js). Module-scoped
// state = a singleton, the same pattern used by useGame / useLiveTimer: every
// component that calls useSound() shares one `muted` ref, so the HomeScreen
// toggle stays in sync with whatever is playing elsewhere.
import { ref } from 'vue'
import { isMuted, toggleMuted as engineToggle, unlock } from '../utils/sound'

const muted = ref(isMuted())

export function useSound() {
  function toggleMute() {
    engineToggle()
    muted.value = isMuted()
  }
  return { muted, toggleMute, unlock }
}
