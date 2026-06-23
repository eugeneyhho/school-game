# Sound

All game audio is **synthesized at runtime with the Web Audio API** — there are no
audio files to host and no new dependencies (the only runtime dependency beyond Vue
remains `canvas-confetti`). This mirrors how [`utils/confetti.js`](../src/utils/confetti.js)
provides visual feedback without external assets.

Files: [`src/utils/sound.js`](../src/utils/sound.js) (engine),
[`src/composables/useSound.js`](../src/composables/useSound.js) (reactive wrapper).

## Engine (`utils/sound.js`)

Pure and Vue-free (so it's unit-testable like the other utils). A lazy
`AudioContext` is created on first use, feeding a `master` gain node (~0.5) into the
destination. If the browser lacks `AudioContext`, every call is a silent no-op.

- **`tone({ freq, type, start, dur, gain, glideTo })`** — schedules one oscillator with
  a soft exponential attack/decay envelope (10 ms attack, decay to silence). The
  envelope is what keeps tones click-free. `glideTo` ramps the pitch for "blip" effects.
- **`run(fn)`** — the gate every SFX goes through: no-op when muted, otherwise
  `unlock()` then play.
- **Mute state** lives here as a module-scoped boolean backed by `localStorage` key
  `school-game-sound-muted` (default **off** = sound on). `isMuted()` / `setMuted()` /
  `toggleMuted()` read, write, and persist it.

### Autoplay unlock

Browsers start the `AudioContext` *suspended* and only allow `resume()` from a user
gesture. Two things cover this:

1. `unlock()` is called inside `run()` before every sound — since every SFX is
   triggered from a tap/click handler (a valid gesture), this resumes the context.
2. `App.vue` adds a one-time `pointerdown`/`keydown` listener on mount that calls
   `unlock()`, warming the context up so the *very first* tap's sound (e.g. selecting a
   subject from the home menu) isn't dropped.

## The SFX set

| Function | Sound | Used for |
| --- | --- | --- |
| `playTap()` | soft triangle blip ~520 Hz | home subject select, keypad digit press |
| `playPlace()` | brighter pop ~660 Hz | placing an English letter tile |
| `playBackspace()` | low descending 300→200 Hz | English backspace, keypad clear |
| `playCorrect()` | rising major arpeggio C5–E5–G5–C6 | correct answer (all games) |
| `playWrong()` | gentle descending two-tone sine | wrong answer (soft, not a harsh buzz) |
| `playWin()` | fanfare arpeggio + sparkle | finishing a round ≥ 70% (with confetti) |

All tones are short (≤ 0.45 s) and gentle — designed for pre-readers, so the
"wrong" cue is a soft descending pair rather than a harsh buzzer.

## Where they're called

| Component | Event | Sound |
| --- | --- | --- |
| `HomeScreen.vue` | subject select / mute toggle | `playTap()` (select only) |
| `GameScreen.vue` | `onAnswer` ok / wrong | `playCorrect()` / `playWrong()` |
| `EnglishGameScreen.vue` | place / backspace / answered | `playPlace()` / `playBackspace()` / `playCorrect()`·`playWrong()` |
| `AnswerKeypad.vue` | digit press / clear | `playTap()` / `playBackspace()` |
| `ResultScreen.vue`, `EnglishResultScreen.vue` | `onMounted` (accuracy ≥ 70%) | `playWin()` (next to `celebrate()`) |

`AnswerButtons.vue` intentionally has **no** tap sound: tapping a choice submits
immediately, so the correct/wrong cue already covers the feedback.

## Reactive mute (`composables/useSound.js`)

The engine's mute flag is plain JS, so a toggle button wouldn't update reactively.
`useSound()` wraps a module-scoped `muted` ref (singleton, same pattern as `useGame` /
`useLiveTimer`) and exposes `muted`, `toggleMute()`, and `unlock()`. `HomeScreen` uses
it to render the fixed top-right 🔊/🔇 button; because the ref is shared, the icon
always reflects the engine's actual state.

## Adding a new sound

1. Add a `playXxx()` function to `utils/sound.js` using `tone()` (or several).
2. `import { playXxx } from '../utils/sound'` in the component and call it at the
   event boundary — no build or config change (Vite picks it up automatically).
3. Keep the call inside a user-gesture handler, or it may be blocked by the autoplay
   policy.
