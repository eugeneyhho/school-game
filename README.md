# Math Adventure 🦊

A fancy, kid-friendly math game for kindergarteners to practice **addition** and
**subtraction**. Built with **Vue 3 + Vite**.

## Features

- ➕ Add, ➖ Take Away, or 🎲 Surprise (mixed) modes
- 🐣 Easy (1–5), 🐥 Medium (1–10), 🦅 Hard (1–20) levels
- 🔘 Pick-the-answer buttons **or** ⌨️ on-screen number keypad (choose on the start screen)
- 🍎 Visual counting aids — each number is shown as countable emoji
- 🎉 Confetti + ⭐ star rewards on correct answers
- 🔥 Streak tracking and a fun results screen
- Subtraction never goes negative — perfect for little learners
- Touch-friendly big buttons (great on tablets)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── main.js                  # app entry
├── App.vue                  # screen state machine: start → game → results
├── style.css                # global kid-friendly styles
├── composables/
│   └── useGame.js           # shared game state + round logic (singleton)
├── utils/
│   ├── math.js              # problem generation + multiple-choice distractors
│   └── confetti.js          # celebration helpers (canvas-confetti)
└── components/
    ├── StartScreen.vue      # pick operation, level, and answer mode
    ├── GameScreen.vue       # round host: question, feedback, progress
    ├── ResultScreen.vue     # stars, score, accuracy, play again
    ├── QuestionCard.vue     # the equation with emoji counting aids
    ├── AnswerButtons.vue    # multiple-choice input
    ├── AnswerKeypad.vue     # number-pad input
    └── AppMascot.vue        # the reactive 🦊 mascot
```
