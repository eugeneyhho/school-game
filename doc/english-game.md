# English Game

Picture-to-word spelling: an emoji is shown and the child taps letter tiles to
spell the word. Implements the shared round lifecycle from
[architecture.md](architecture.md) with a tile/slot input model instead of a
number pad.

Files: [`src/composables/useEnglishGame.js`](../src/composables/useEnglishGame.js),
[`src/utils/vocab.js`](../src/utils/vocab.js),
[`src/components/EnglishGameScreen.vue`](../src/components/EnglishGameScreen.vue).

## Config & levels

`englishGame.config` is `reactive({ difficulty })` — only one knob. Levels
come from `ENGLISH_LEVELS` in `vocab.js`:

| Level | Word length | Extra distractor letters | Label |
| --- | --- | --- | --- |
| easy | 3 | 0 | "3 letters" |
| medium | 3–4 | 1 | "3–4 letters" |
| hard | 4–5 | 2 | "4–5 letters" |

Round length is fixed at `ROUND_LENGTH = 8`.

## Vocabulary (`utils/vocab.js`)

`VOCAB` is a small curated list of `{ word, emoji }` pairs (cat 🐱, dog 🐶,
sun ☀️, … apple 🍎, house 🏠, bread 🍞). Each word has exactly one emoji — if
you add a word, pick an unambiguous emoji for it.

- `pickWords(difficulty, count)` filters `VOCAB` to words within the level's
  length range, Fisher–Yates shuffles, and slices `count`. Used once per round
  at `start()`.
- `buildTiles(word, extras)` builds the playable tiles: the word's own letters
  **plus** `extras` random distractor letters from the alphabet, all shuffled.
  Each tile gets a unique `id` so repeated letters (e.g. the two letters in
  "apple") stay distinguishable and can be placed/removed independently.

`shuffle` here is identical to the one in `math.js` (see [math-game.md](math-game.md)).

## Tile/slot model (the core mechanic)

State in `useEnglishGame`:

```
tiles  : [{ id, letter }]   all letter tiles for the current word
slots  : [id, id, …]        ordered ids the player has placed (left → right)
placed : computed → letters at those slots     (what's "typed")
available : computed → tiles not yet placed    (what's left to tap)
```

- **`place(id)`** — appends a tile id to `slots`, ignoring taps on already-placed
  tiles or taps outside `'playing'`. **Auto-checks** as soon as `slots.length`
  reaches `word.length` — there is no separate "check" button.
- **`backspace()`** — pops the last-placed id (clears one slot). Only while
  `'playing'`.
- **`check()`** — compares `placed.join('')` to `word`. Sets `lastCorrect`,
  flips `status='answered'`, updates score/streak, and captures `elapsedMs` on
  the final word.

The view mirrors this directly: `EnglishGameScreen` renders one `.slot` per
letter of the word, fills them from `placed`, and renders `available` tiles as
buttons. The backspace `⌫` is disabled once the word is full/answered.

## Pacing (`EnglishGameScreen`)

Because placement auto-checks, the screen watches for the transition to
`'answered'` and schedules the advance:

```
onPlace(id):
  game.place(id)                       // may auto-check → status='answered'
  if answered: scheduleAdvance()

scheduleAdvance():
  if correct: burst()
  delay = correct ? 1100 : 1700         // wrong words linger a bit longer than math
  clearTimeout(timer); timer = setTimeout(() => {
    game.advance()                     // next word OR status='finished'
    if finished: emit('finished')
  }, delay)
```

Note `timer` is a module-scoped `let` in the component and is cleared before
each new timeout, so a rapid re-trigger can't stack callbacks.

Feedback reveals the correct word on miss: `"The word was <b>word</b>"`.
Wrong slots (where the placed letter differs from the target) are flagged red;
correct rounds turn all slots green.

## Picture transition

The picture is wrapped in a tappable `.picture-btn` whose inner `<div class="picture"
:key="word">` holds the emoji. Binding `:key` to the word forces Vue to recreate the node
on each new word, retriggering the `pop` entrance animation without a `<Transition>` — a
small trick worth reusing for per-item entrance animations.

## Pronunciation (tap to hear)

The picture is a button: tapping it speaks the target word aloud in English via
[`src/utils/speech.js`](../src/utils/speech.js) — `speak(word, 'en')` (the browser's
`speechSynthesis`, no audio files). A 🔊 badge in the corner signals it's tappable, and the
hint reads "Tap 🔊 to hear it, then spell!". English voices are near-universal, so this
works on essentially every device. See the shared engine + its Cantonese caveat in
[chinese-game.md](chinese-game.md).

## Results

`EnglishResultScreen` is the math `ResultScreen` with one wording change —
`"You spelled N out of 8!"` instead of `"You got N out of 10!"` — and
`"Change Level"` instead of `"Change Settings"`. The rating tiers (90/70/50)
and the `celebrate()` trigger are identical. If you tune the thresholds, do it
in both files.
