# Architecture

How the app is wired together: navigation, state ownership, and the lifecycle
of a round.

## Two layers of navigation

There is **no Vue Router**. Navigation is plain reactive state in two layers:

```
App.vue                       (subject layer)
 └─ subject: null | 'math' | 'english' | 'chinese'
        │
        ├─ MathApp.vue / EnglishApp.vue     (screen layer)
        │     └─ screen: 'start' | 'game' | 'results'
        │
        └─ HomeScreen / PendingScreen
```

1. **Subject layer** — `App.vue` holds a `subject` ref. `null` renders
   `HomeScreen`; `'math'`/`'english'` render the matching `*App.vue`;
   `'chinese'` renders a `PendingScreen`. Selection and "back" are just
   `subject.value = key` / `null`.

2. **Screen layer** — each `*App.vue` holds its own `screen` ref cycling
   `start → game → results` and renders the matching sub-component, threading
   `@back` up to `App.vue` so the home button always returns to the menu.

Because both layers are plain refs, **deep-linking / refresh always returns to
the home menu** — there is no URL state to preserve.

## State ownership: the singleton-composable pattern

The most important pattern in the codebase. `useGame.js` and
`useEnglishGame.js` declare state **at module scope** and export a single
shared object:

```js
// useGame.js (simplified)
const config   = reactive({ operation, difficulty, answerMode })
const current  = ref(0)
const status   = ref('idle')
// …more refs…

function start(cfg)  { /* reset, then nextProblem() */ }
function submit(v)   { /* grade the answer */ }
function advance()   { /* next problem or finish */ }

export const game = { config, current, status, …, start, submit, advance }
```

Consequences of module-scoped state:

- **There is exactly one instance** of `game` / `englishGame` for the whole
  page lifetime. Importing it from multiple components returns the *same*
  object — so `StartScreen`, `GameScreen`, and `ResultScreen` all read and
  mutate one source of truth.
- **State persists across screen swaps** within a session (start → game →
  results → play-again). It only resets on a full page reload, or when
  `start()` is explicitly called.
- **`playAgain` keeps settings**: `MathApp.playAgain()` calls
  `game.start(game.config)` — it reuses the existing config rather than
  returning to the settings screen.

This is the lightweight alternative to Pinia: no provider, no injection, just
ES-module singletons. Add a third subject by mirroring this structure.

## Round lifecycle (shared by both games)

Both composables expose the same lifecycle shape, even though the inputs differ:

| Phase | `status` | What happens |
| --- | --- | --- |
| Idle | `'idle'` | Not playing yet (initial value). |
| Playing | `'playing'` | A problem/word is loaded; awaiting input. |
| Answered | `'answered'` | Input graded; feedback + mascot reaction shown. |
| Finished | `'finished'` | Set by `advance()` when the last question ends. |

```
start(cfg) ──► status='playing', current=0
                 │
   (answer) ──► submit/place ──► status='answered'   (feedback delay)
                 │
   advance() ──► current++ ──► next problem? ──► 'playing'
                           └─ last? ──► 'finished'  (→ results screen)
```

Timing details:

- **Feedback delay lives in the *component*, not the composable.**
  `GameScreen.onAnswer` waits 1100 ms (correct) / 1500 ms (wrong) before
  calling `advance()`; `EnglishGameScreen.scheduleAdvance` uses 1100 / 1700 ms.
  This keeps the composable synchronous and lets the UI control pacing.
- **`elapsedMs` is captured once**, on the *last* question
  (`current === ROUND_LENGTH - 1`), as `performance.now() - startTime`. The
  live ticking timer shown during play comes from `useLiveTimer`, not from
  this value.

## `useLiveTimer` — the ticking clock

The fixed-position timer (`⏱️ 12.3s`) is rendered by the game screen, not
stored in the composable. `useLiveTimer(startRef)` returns a ref that
recomputes `performance.now() - startRef.value` every 100 ms while the
component is mounted, and clears its interval on unmount. So the timer runs
only for the lifetime of the game screen — leaving the screen stops it.

## Where things live (decision guide)

| You want to… | Put it in |
| --- | --- |
| Change what a round contains / how it's scored | the composable (`useGame` / `useEnglishGame`) |
| Add a pure calculation (no Vue) | `utils/` |
| Change timing/animation of feedback | the game-screen component |
| Change look & feel | `style.css` (shared) or `<style scoped>` (local) |
| Add a subject | new `*App.vue` + composable + util + a branch in `App.vue` |
| Add a new screen to an existing flow | new component + a `screen` value in the `*App.vue` |

## Notes & gotchas

- **Duplicated chrome styles.** `.topbar`, `.score`, `.streak`, `.progress`,
  `.dot`, `.feedback` are defined *globally* in `style.css` **and** again
  (scoped) inside `GameScreen.vue`. The scoped copies win for that screen;
  `EnglishGameScreen.vue` relies on the global ones. If you restyle the
  topbar, update both to avoid drift.
- **`pending` subjects are real routes.** `App.vue` routes `'chinese'` to
  `PendingScreen` and `HomeScreen` marks the card `pending: true` + a
  "Coming Soon" badge. To make Chinese playable, add a real component and
  swap the `App.vue` branch (see [build-and-deploy.md](build-and-deploy.md)).
- **No tests.** There is no test runner configured; `utils/` being pure is
  what would make adding one straightforward.
