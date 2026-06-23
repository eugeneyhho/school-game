# Learning Games 🦊

A fancy, kid-friendly learning app for kindergarteners, built with **Vue 3 + Vite**.
Pick a subject from the home menu and play!

## Subjects

- 🐼 **中文 Chinese** — *coming soon* (pending).
- 🔤 **English** — a picture-to-word spelling game: look at the picture (emoji) and
  tap the letter tiles to spell the word. Easy / Medium / Hard levels.
- 🔢 **Math** — addition & subtraction with counting aids. Add / Take Away / Mixed,
  Easy (1–5) / Medium (1–10) / Hard (1–20), and **Pick** (multiple-choice) or
  **Type** (number keypad) answer modes.

Every game has confetti + star rewards, streak tracking, and a fun results screen.
All input is tap/click — friendly for tablets and pre-readers.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy to GitHub Pages

The included workflow (`.github/workflows/deploy.yml`) builds and publishes to
GitHub Pages on every push to `master`.

- Repo **Settings → Pages → Source** must be set to **"GitHub Actions"**.
- `vite.config.js` sets `base: '/school-game/'` for the build so assets resolve
  under the project URL: **https://eugeneyhho.github.io/school-game/**
  (change it if you use a custom domain or a different repo name).

## Project structure

```
src/
├── main.js                       # app entry
├── App.vue                       # subject switcher (home → subject app)
├── style.css                     # global kid-friendly styles + shared chrome
├── composables/
│   ├── useGame.js                # math game state + round logic (singleton)
│   └── useEnglishGame.js         # english spelling state + round logic (singleton)
├── utils/
│   ├── math.js                   # math problem generation + distractors
│   ├── vocab.js                  # english word list + tile builder
│   └── confetti.js               # celebration helpers (canvas-confetti)
└── components/
    ├── HomeScreen.vue            # subject menu (Chinese / English / Math)
    ├── PendingScreen.vue         # "coming soon" screen (Chinese)
    ├── MathApp.vue               # math flow: start → game → results
    ├── EnglishApp.vue            # english flow: start → game → results
    ├── StartScreen.vue           # math settings
    ├── GameScreen.vue            # math round host
    ├── ResultScreen.vue          # math results
    ├── QuestionCard.vue          # math equation + emoji aids
    ├── AnswerButtons.vue         # multiple-choice input
    ├── AnswerKeypad.vue          # number-pad input
    ├── EnglishStartScreen.vue    # english level pick
    ├── EnglishGameScreen.vue     # picture + letter-tile spelling
    ├── EnglishResultScreen.vue   # english results
    └── AppMascot.vue             # the reactive 🦊 mascot
```
