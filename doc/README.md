# School-Game — Implementation Docs

Reference documentation for the **Learning Games** app (Vue 3 + Vite), a
tap-friendly learning game for kindergarteners with **Math**, **English**, and
**Chinese** subjects.

These docs describe *how the code is built* — architecture, game logic,
component contracts, the design system, and deployment — so a future change
lands in the right place and follows existing conventions.

## Contents

| Doc | What it covers |
| --- | --- |
| [architecture.md](architecture.md) | App structure, the singleton-composable pattern, screen state machines, module map |
| [math-game.md](math-game.md) | Math round lifecycle, problem & distractor generation, answer modes |
| [english-game.md](english-game.md) | English spelling round lifecycle, tile/slot model, vocabulary & levels |
| [chinese-game.md](chinese-game.md) | Chinese picture→詞語 round lifecycle, vocabulary & levels, Traditional Chinese |
| [components.md](components.md) | Per-component reference: props, emits, responsibilities |
| [styling.md](styling.md) | Design tokens, shared chrome classes, animations, mascot |
| [sound.md](sound.md) | Web Audio SFX engine, the sound set, mute toggle, autoplay unlock |
| [build-and-deploy.md](build-and-deploy.md) | Local dev, production build, GitHub Pages pipeline |

## Quick orientation

```
src/
├── main.js              # createApp(App).mount('#app')
├── App.vue              # subject switcher (home → subject app)
├── style.css            # global tokens + shared chrome (.screen, .btn-*, .topbar, …)
├── composables/         # singleton game-state modules
│   ├── useGame.js       #   math: state + start/submit/advance
│   ├── useEnglishGame.js#   english: state + place/backspace/advance
│   ├── useChineseGame.js#   chinese: state + start/submit/advance
│   ├── useLiveTimer.js  # 100ms-ticking reactive elapsed-ms helper
│   └── useSound.js      # reactive mute toggle (wraps utils/sound.js)
├── utils/               # pure, framework-free helpers
│   ├── math.js          #   generateProblem / buildChoices / shuffle
│   ├── vocab.js         #   VOCAB / ENGLISH_LEVELS / pickWords / buildTiles
│   ├── chinese.js       #   CHINESE_VOCAB / CHINESE_LEVELS / pickWords / buildChoices
│   ├── confetti.js      #   burst() / celebrate()
│   ├── sound.js         #   Web Audio SFX engine: playTap/playCorrect/…
│   ├── speech.js        #   speak(text, lang) — text-to-speech: Cantonese + English
│   └── format.js        #   formatDuration(ms)
└── components/          # presentational Vue SFCs (see components.md)
```

## Tech stack

- **Vue 3.5** (`<script setup>`, Composition API) — no router, no Pinia; state
  is plain module-scoped refs/reactives (see [architecture.md](architecture.md)).
- **Vite 6** + `@vitejs/plugin-vue` — dev server, build.
- **canvas-confetti** — the only runtime dependency beyond Vue.
- **Fredoka** web font (Google Fonts), loaded in `index.html`.

## Conventions to keep

- **No external state library.** Game state lives in singleton composables;
  components read from the shared object and call its action methods.
- **Utils are pure.** `utils/` must stay free of Vue imports so they can be
  unit-tested or reused without a component context.
- **All input is tap/click.** The viewport disables pinch-zoom and text
  selection (`index.html`, `style.css`) for a tablet/pre-reader feel.
- **One round, then results.** Every game follows `start → game → results`
  with the same scoring/streak/accuracy/celebration shape — keep new games
  consistent with it.
