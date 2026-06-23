// Tiny Web Audio synth — generates all SFX programmatically so there are no
// audio files to host and no new dependencies. Pure / framework-free (no Vue),
// so it can be unit-tested in isolation, like the other utils.
//
// Browsers block audio until a user gesture, so every play* call runs unlock()
// (which resumes a suspended AudioContext). The app also calls unlock() once on
// the first pointerdown in App.vue to warm things up.

const STORAGE_KEY = 'school-game-sound-muted'

let ctx = null
let master = null
let muted = loadMuted()

function loadMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  return ctx
}

/** Resume the AudioContext if the browser has it suspended (autoplay policy). */
export function unlock() {
  const c = getCtx()
  if (c && c.state === 'suspended') c.resume()
}

export function isMuted() {
  return muted
}

export function setMuted(value) {
  muted = !!value
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  } catch {
    /* ignore storage failures (private mode, etc.) */
  }
}

export function toggleMuted() {
  setMuted(!muted)
  return muted
}

// Schedule one oscillator with a soft attack/decay envelope (no clicks).
function tone({ freq, type = 'sine', start = 0, dur = 0.15, gain = 0.12, glideTo }) {
  const c = getCtx()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function run(fn) {
  if (muted) return
  unlock()
  if (!getCtx()) return
  fn()
}

// ---- Named SFX (all short, gentle, kid-friendly) ----

/** Soft tap — generic button / keypad digit. */
export const playTap = () =>
  run(() => tone({ freq: 520, type: 'triangle', dur: 0.07, gain: 0.08 }))

/** Brighter pop — placing an English letter tile. */
export const playPlace = () =>
  run(() => tone({ freq: 660, type: 'triangle', dur: 0.06, gain: 0.1 }))

/** Low descending blip — backspace / clear. */
export const playBackspace = () =>
  run(() => tone({ freq: 300, type: 'sine', dur: 0.08, gain: 0.09, glideTo: 200 }))

/** Rising major arpeggio — correct answer reward. */
export const playCorrect = () =>
  run(() => {
    // C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) =>
      tone({ freq: f, type: 'triangle', start: i * 0.08, dur: 0.18, gain: 0.12 }),
    )
  })

/** Gentle descending two-tone — wrong answer (soft, not a harsh buzz). */
export const playWrong = () =>
  run(() => {
    tone({ freq: 311.13, type: 'sine', start: 0, dur: 0.18, gain: 0.1, glideTo: 233.08 })
    tone({ freq: 233.08, type: 'sine', start: 0.14, dur: 0.22, gain: 0.09 })
  })

/** Fanfare — finished a great round (pairs with celebrate() confetti). */
export const playWin = () =>
  run(() => {
    // C5, E5, G5, C6, E6
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
    notes.forEach((f, i) =>
      tone({ freq: f, type: 'triangle', start: i * 0.1, dur: 0.3, gain: 0.12 }),
    )
    tone({ freq: 1568, type: 'sine', start: 0.52, dur: 0.45, gain: 0.08 })
  })
