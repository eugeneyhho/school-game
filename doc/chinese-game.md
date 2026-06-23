# Chinese Game

Picture-to-word matching for K3: an emoji is shown and the child taps the matching
**詞語** (two-character word) from a few choices. All Chinese is **Traditional Chinese
(繁體中文)**. It is a hybrid of the two other games — the English game's vocabulary/picture
data shape plus the Math game's multiple-choice answer UI — and rides the shared round
lifecycle from [architecture.md](architecture.md).

Files: [`src/composables/useChineseGame.js`](../src/composables/useChineseGame.js),
[`src/utils/chinese.js`](../src/utils/chinese.js),
[`src/components/ChineseGameScreen.vue`](../src/components/ChineseGameScreen.vue).

## Config & levels

`chineseGame.config` is `reactive({ difficulty })` — one knob. Levels come from
`CHINESE_LEVELS` in `chinese.js`:

| Level | Choices | Word tier | Label |
| --- | --- | --- | --- |
| easy | 3 | everyday words (爸爸, 媽媽, 太陽, …) | "3 choices" |
| medium | 4 | school/daily words (老師, 書包, 下雨, …) | "4 choices" |
| hard | 4 | actions/abstract (跑步, 上下, 今天, …) | "4 choices · 進階" |

Because every word is two characters, difficulty is driven by **word tier + choice count**
rather than word length (the English game's knob).

Round length is fixed at `ROUND_LENGTH = 8`.

## Vocabulary (`utils/chinese.js`)

`CHINESE_VOCAB` is a curated list of `{ word, emoji, tier }` — 22 two-character 詞語 in
Traditional Chinese, one unambiguous emoji each. Each word is tagged `easy` / `medium` /
`hard`; the tier assignment is a familiarity suggestion and trivially adjustable (just move
an entry's `tier`). There is **no pinyin/注音** field — the game is visual-only; add one
later if you want phonetic hints in the reveal.

- `pickWords(difficulty, count)` filters `CHINESE_VOCAB` to the tier, Fisher–Yates shuffles,
  and slices `count`. Used once per round at `start()`.
- `buildChoices(word, difficulty)` returns the correct word plus `(choices-1)` distractors
  drawn from the **same tier** pool (never the correct word), all shuffled. So every option
  is a real word at a comparable difficulty.

`shuffle` is the same Fisher–Yates implementation duplicated in `math.js` and `vocab.js`.

## Round model (`useChineseGame`)

Same lifecycle and state shape as the other two games:

```
word    : string    the target 詞語 for the current question
emoji   : string    the picture clue
choices : string[]  the multiple-choice options (built by buildChoices)
status  : 'idle' | 'playing' | 'answered' | 'finished'
```

- **`start(cfg)`** — resets score/streak/time, `pickWords` for the round, loads the first.
- **`submit(value)`** — compares `value === word`; returns the boolean correctness so the
  screen can fire confetti/sound without re-deriving it. No-op unless `status === 'playing'`,
  so a double-tap during feedback can't double-count.
- **`advance()`** — next word, or `status = 'finished'` on the last (→ results).

## Answer input (`ChineseGameScreen`)

The screen reuses [`AnswerButtons.vue`](../src/components/AnswerButtons.vue) — the same
component the Math game uses. Its `answer` prop is `[Number, String]`, so it renders word
strings unchanged (`{{ c }}`, `c === answer`, `:key="c"` are all type-agnostic). One tap
locks the choice (`AnswerButtons`'s local `selected` resets when `choices` change), then
`onAnswer` grades:

```
onAnswer(value):
  ok = game.submit(value)
  if ok: burst() + playCorrect()
  else:  playWrong()
  delay = ok ? 1100 : 1500
  setTimeout(() => { game.advance(); if finished emit('finished') }, delay)
```

The emoji picture uses `<div class="picture" :key="word">` so Vue recreates the node per
word and the `pop` entrance animation replays (the same trick as `EnglishGameScreen`). The
topbar/HUD and feedback banner rely on the **global** chrome classes in `style.css`
(`.topbar`, `.score`, `.streak`, `.progress`, `.dot`, `.feedback`, …), like the English
screen.

Praise text is in Traditional Chinese (`好棒!`, `厲害!`, …); a wrong answer shows
`"Oops!"` plus `"The answer was <word>"` (no phonetic).

## Results

`ChineseResultScreen` is the math `ResultScreen` with `ROUND_LENGTH`-aware wording
(`"You got N out of 8!"`) and a `"Change Level"` button. The rating tiers (90/70/50) and
the `celebrate()` + `playWin()` trigger (accuracy ≥ 70%) are identical to the other games.
