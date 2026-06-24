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
| easy | 3 | most familiar (爸爸, 太陽, 蘋果, 小貓, 魚, …) | "3 choices" |
| medium | 4 | school/daily + food + animals (老師, 麵包, 金魚, 大象, …) | "4 choices" |
| hard | 4 | abstract + specific food/animals (跑步, 朱古力, 長頸鹿, 蜘蛛, …) | "4 choices · 進階" |

Because every word is two characters, difficulty is driven by **word tier + choice count**
rather than word length (the English game's knob).

Round length is fixed at `ROUND_LENGTH = 6` (capped so the smallest tier — hard, 6
words — always has enough distinct words for a no-repeat round).

## Vocabulary (`utils/chinese.js`)

`CHINESE_VOCAB` is a curated list of `{ word, emoji, tier }` — 81 詞語 in Traditional
Chinese (everyday words + a large food set + a large animal set), one unambiguous emoji
each. Each word is tagged `easy` / `medium` / `hard`; the tier assignment is a familiarity
suggestion and trivially adjustable (just move an entry's `tier`). Word lengths vary
(魚/雞/熊/蛇/鷹 are one character, 三文治/朱古力/長頸鹿 are three, most are two) — that's
fine, since difficulty is driven by tier + choice count, not length. There is **no
pinyin/注音** field — the game is visual-only (plus tap-to-hear pronunciation); add a
phonetic field later if you want text hints in the reveal.

> ⚠️ **Avoid duplicate emojis within a tier.** Distractors are drawn from the same tier as
> the target, so two words sharing an emoji in one tier (e.g. 魚 and 金魚, both 🐟) would
> be ambiguous. Such pairs are placed in *different* tiers (魚 easy, 金魚 medium) so they
> can never appear in the same question.

- `pickWords(difficulty, count)` filters `CHINESE_VOCAB` to the tier, Fisher–Yates shuffles,
  and slices `count`. Used once per round at `start()`.
- `buildChoices(word, difficulty)` returns the correct word plus `(choices-1)` distractors
  drawn from the **same tier** pool (never the correct word), all shuffled. So every option
  is a real word at a comparable difficulty.

`shuffle` is the same Fisher–Yates implementation duplicated in `math.js` and `vocab.js`.

## Round model (`useChineseGame`)

Same lifecycle and state shape as the other games:

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

## Pronunciation (tap to hear)

The emoji picture is a button: tapping it speaks the target word aloud in **Cantonese
(廣東話)** via [`src/utils/speech.js`](../src/utils/speech.js) (the browser's built-in
`speechSynthesis` — no audio files, no new dependencies, same no-asset philosophy as
[sound.js](sound.md)). A 🔊 badge in the corner signals it's tappable, and the hint reads
"Tap 🔊 to hear the word!".

- `speak(text)` prefers a **Cantonese** voice — matching `zh-HK`, the `yue` macrolanguage,
  or known names (e.g. Apple's *Sin-ji*) — assigning it explicitly so the engine uses it.
  If none is installed it falls back to any `zh` voice (usually Mandarin), then to the
  default voice with `lang='zh-HK'`. It plays at `volume = 1.0` (the speechSynthesis
  ceiling) and `rate = 0.75` (slow, clear pacing for young learners), and cancels any
  in-flight speech so rapid taps don't pile up. It's a silent no-op if the browser has no
  speech synthesis. `hasCantoneseVoice()` reports whether a Cantonese voice is available.
- Voices load asynchronously; `speech.js` caches a voice and refreshes it on the
  `voiceschanged` event.
- Pronunciation is shared with the English game (which calls `speak(word, 'en')`).
  `speak` takes a BCP-47 lang tag and is reusable for any subject.

> ⚠️ **Platform limitation.** `speechSynthesis` can only use voices **installed on the
> device**. Many phones ship with a Mandarin (`zh-CN`) voice and *no* Cantonese voice — in
> that case the same characters come out in Mandarin regardless of the code. To hear real
> 廣東話 on a given device, install a Cantonese voice (iOS: *Settings → Accessibility →
> Spoken Content → Voices → Chinese (Hong Kong)*; Android varies and often lacks one). The
> only way to **guarantee** Cantonese on every device is to bundle recorded audio per word
> instead of relying on the system TTS — a future option if system voices prove unreliable.

## Results

`ChineseResultScreen` is the math `ResultScreen` with `ROUND_LENGTH`-aware wording
(`"You got N out of 6!"`) and a `"Change Level"` button. The rating tiers (90/70/50) and
the `celebrate()` + `playWin()` trigger (accuracy ≥ 70%) are identical to the other games.
