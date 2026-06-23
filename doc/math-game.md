# Math Game

Math Adventure — addition & subtraction with counting aids, three difficulties,
and two answer modes. Implements the shared round lifecycle from
[architecture.md](architecture.md) with these specifics.

Files: [`src/composables/useGame.js`](../src/composables/useGame.js),
[`src/utils/math.js`](../src/utils/math.js),
[`src/components/GameScreen.vue`](../src/components/GameScreen.vue).

## Config

`useGame.config` is a `reactive` object with three knobs:

| Key | Values | Meaning |
| --- | --- | --- |
| `operation` | `'add'` \| `'subtract'` \| `'mixed'` | What operator each problem uses. `mixed` flips a coin per problem. |
| `difficulty` | `'easy'` \| `'medium'` \| `'hard'` | Number range via `RANGES`: 1–5 / 1–10 / 1–20. |
| `answerMode` | `'buttons'` \| `'keypad'` | Multiple-choice (4 options) vs. numeric keypad. Chosen on `StartScreen`. |

Round length is fixed at `ROUND_LENGTH = 10`.

## Problem generation (`utils/math.js`)

`generateProblem(config)` returns `{ a, b, op, answer }`:

- Picks `a` and `b` independently with `randInt(min, max)` from `RANGES`.
- For `operation === 'mixed'`, resolves to `'add'` or `'subtract'` with 50/50 odds.
- **Subtraction stays non-negative:** if `b > a`, it swaps them so the answer
  is never below zero — age-appropriate, and keeps distractor generation sane.

`buildChoices(answer)` builds the 4 multiple-choice options:

- Starts a `Set` with the correct answer.
- Adds near-miss distractors: `answer ± randInt(1,3)`, rejecting negatives,
  looping with a `guard < 50` cap so it can't spin forever on tiny answers.
- **Fallback fill** (for very small answers, e.g. 0 or 1, where ±3 overshoots
  or collides): counts upward from `answer + 1` until the set reaches 4.
- Returns the `shuffle`d array (Fisher–Yates). The set guarantees uniqueness.

`shuffle` is duplicated in both `math.js` and `vocab.js` — same Fisher–Yates
implementation. If you change one, change the other (or factor it out).

## Answer input

`GameScreen` renders exactly one of these based on `config.answerMode`:

- **`AnswerButtons`** (Pick mode) — 4-button grid. Local `selected` ref locks
  to the first tap; `watch(() => props.choices)` resets it when a new
  question arrives. Emits `answer` with the chosen number.
- **`AnswerKeypad`** (Type mode) — numeric pad 0–9 plus clear (↩) and check (✓).
  `entry` ref caps input at 3 digits and is reset on new `props.answer`.
  Only the ✓ key emits `answer` (with `Number(entry)`).

Both expose `reveal` so the chosen button / display turns green (correct) or
red (wrong + shake) after grading. The display-class logic lives inside each
component, keyed off `props.answer`.

## Grading & pacing (`GameScreen.onAnswer`)

```
onAnswer(value):
  ok = game.submit(value)          // synchronous: sets status='answered',
                                   //   updates score/streak, captures elapsedMs on last Q
  if ok: burst()                    // confetti per correct answer
  delay = ok ? 1100 : 1500          // wrong answers linger longer
  setTimeout(() => {
    game.advance()                  // next problem OR status='finished'
    if finished: emit('finished')   // MathApp flips to results
  }, delay)
```

- `submit` returns the boolean correctness so the component can fire confetti
  without re-deriving it. It's a no-op unless `status === 'playing'`, so a
  double-tap during feedback can't double-count.
- The mascot mood is derived: `'happy'` on correct, `'sad'` on wrong, else
  `'idle'`.
- Praise text rotates by question index: `praise[current % praise.length]`.
  Wrong answers always show `"Oops!"` plus `"The answer was X"`.

## Counting aids (`QuestionCard`)

The math card renders the equation `a (op) b = ?` plus two rows of emoji that
*visualize* the operands (e.g. 7 apples + 3 apples). Two design choices:

- **Deterministic-but-varied emoji.** `emoji = EMOJIS[(a*7 + b*3) % 12]`. It's
  stable for the life of one question (so the picture doesn't flicker between
  renders) but differs across problems.
- **Staggered pop-in.** Each emoji gets `animationDelay: i * 0.03s` so the row
  appears to cascade in.

Subtraction shows the same two operand groups with a `−` between them (it does
not visually remove items — the emoji are an aid to reading the operands, not
a worked solution).

## Results

`ResultScreen` computes a `rating` from accuracy:

| Accuracy | Stars | Message | Emoji |
| --- | --- | --- | --- |
| ≥ 90% | 3 | Amazing! | 🏆 |
| ≥ 70% | 2 | Great job! | 🎉 |
| ≥ 50% | 1 | Good try! | 🌟 |
| < 50% | 0 | Keep practicing! | 💪 |

`accuracy = round(correctCount / ROUND_LENGTH * 100)`. On mount, if accuracy
≥ 70% it fires `celebrate()` (the two-sided confetti cannon). Stars animate in
with a per-star delay. Buttons: Play Again (reuses config), Change Settings,
Main Menu.
