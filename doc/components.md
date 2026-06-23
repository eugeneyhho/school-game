# Components

Per-component reference for everything in [`src/components/`](../src/components/).
Grouped by role. Props/emits use Vue `<script setup>` `defineProps` /
`defineEmits` contracts.

## Navigation shells

### `App.vue` (root, in `src/`)
- **Role:** subject switcher. Holds `subject: ref(null|'math'|'english'|'chinese')`.
- **Logic:** `selectSubject(key)` sets the ref; `backToMenu()` clears it.
- **Renders:** `HomeScreen` (null), `MathApp`, `EnglishApp`, or `ChineseApp`.

### `HomeScreen.vue`
- **Emits:** `select(key)`.
- **Owns:** the `subjects` list — `chinese`, `english`, `math` — each
  with `emoji/title/sub/color/pending` (all `pending: false` now). Renders one big `.card`
  per subject.

### `PendingScreen.vue`
- **Props:** `title` (default `'Coming Soon'`), `emoji` (default `✨`).
- **Emits:** `back`.
- **Role:** generic "coming soon" placeholder. Kept on disk but **no longer wired in**
  now that all three subjects are playable — available for a future fourth subject.

### `MathApp.vue` / `EnglishApp.vue` / `ChineseApp.vue`
- **Emits:** `back`.
- **Role:** the `start → game → results` state machine for one subject. Holds
  a local `screen` ref, calls `game.start` / `englishGame.start` /
  `chineseGame.start` on start, and flips `screen='results'` on `@finished`.
  `playAgain` re-calls `start(config)` with the *existing* config (keeps settings).

## Math screens

### `StartScreen.vue`
- **Props:** `config` (current `game.config`, used to pre-select options).
- **Emits:** `start({ operation, difficulty, answerMode })`, `back`.
- **Owns:** three local refs for the selections (operation/difficulty/answerMode),
  each initialized from `props.config` with a sensible default.

### `GameScreen.vue`
- **Emits:** `finished`, `back`.
- **Reads:** destructures the shared `game` object; builds `liveMs` via
  `useLiveTimer(game.startTime)`.
- **Role:** the round host. Renders topbar (home, live timer, score, progress
  dots, streak), mascot, `QuestionCard`, and one answer component, plus the
  pop-in feedback banner. Owns the `onAnswer` grading-and-advance timing
  (see [math-game.md](math-game.md)).
- **Note:** redefines `.topbar/.score/.streak/.progress/.dot/.feedback` in its
  own `<style scoped>` (overrides the global copies in `style.css`).

### `QuestionCard.vue`
- **Props:** `problem` (`{ a, b, op, answer }`).
- **Role:** equation line + emoji counting aids. Deterministic emoji via
  `(a*7+b*3)%12`, staggered pop-in per emoji. See [math-game.md](math-game.md).

### `AnswerButtons.vue`
- **Props:** `choices: (number|string)[]`, `answer: [Number, String]`, `reveal: boolean`.
- **Emits:** `answer(choice)`.
- **Role:** multiple-choice grid, **shared by the Math and Chinese games** (numbers for
  math, 詞語 strings for Chinese). Local `selected` locks to first tap and resets when
  `choices` change. Visual states: `chosen`/`correct`/`wrong` (wrong also shakes).

### `AnswerKeypad.vue`
- **Props:** `answer: number`, `reveal: boolean`.
- **Emits:** `answer(Number(entry))` — only on the ✓ key.
- **Role:** 3×4 numeric pad (1–9, clear ↩, 0, check ✓). `entry` capped at 3
  digits, reset on new `answer`. Display turns green/red on reveal.

### `ResultScreen.vue`
- **Emits:** `play-again`, `change-settings`, `back`.
- **Role:** stars + score + accuracy + time + best streak, with `celebrate()`
  on mount if accuracy ≥ 70%. Rating tiers in [math-game.md](math-game.md).

## English screens

### `EnglishStartScreen.vue`
- **Props:** `config`.
- **Emits:** `start({ difficulty })`, `back`.
- **Role:** single level picker (easy/medium/hard), labels pulled from
  `ENGLISH_LEVELS`.

### `EnglishGameScreen.vue`
- **Emits:** `finished`, `back`.
- **Role:** picture + slots + available tiles + backspace. Owns the
  `onPlace`/`scheduleAdvance` timing (see [english-game.md](english-game.md)).
  Uses `:key="word"` on the picture to retrigger its entrance animation.

### `EnglishResultScreen.vue`
- **Emits:** `play-again`, `change-settings` ("Change Level"), `back`.
- **Role:** twin of `ResultScreen` with spelling wording.

## Chinese screens

### `ChineseStartScreen.vue`
- **Props:** `config`.
- **Emits:** `start({ difficulty })`, `back`.
- **Role:** single level picker (easy/medium/hard), labels pulled from
  `CHINESE_LEVELS`. Twin of `EnglishStartScreen`.

### `ChineseGameScreen.vue`
- **Emits:** `finished`, `back`.
- **Reads:** destructures the shared `chineseGame` object; builds `liveMs` via
  `useLiveTimer(game.startTime)`.
- **Role:** the round host — topbar, mascot, the big **emoji picture** (`:key="word"`
  to retrigger its `pop` entrance), and the reused `AnswerButtons` for the 詞語 choices.
  Owns the `onAnswer` grading-and-advance timing (mirrors `GameScreen`: 1100 ms correct /
  1500 ms wrong). Praise text is in Traditional Chinese. See
  [chinese-game.md](chinese-game.md).

### `ChineseResultScreen.vue`
- **Emits:** `play-again`, `change-settings` ("Change Level"), `back`.
- **Role:** twin of `ResultScreen` with `"You got N out of 8!"` wording.

## Shared

### `AppMascot.vue`
- **Props:** `mood` (`'wave' | 'idle' | 'happy' | 'sad'`, default `'wave'`).
- **Role:** the 🦊 mascot. Each mood maps to a CSS keyframe animation
  (`wave`/`bob`/`happy`/`sad`); `happy` and `sad` play twice (correct/wrong
  reactions), `wave`/`idle` loop. See [styling.md](styling.md).

## Adding a component — checklist

1. Pick the layer: shell (`*App.vue`), a screen, or a presentational piece.
2. If it needs round state, read from the shared composable — don't duplicate.
3. Put pure logic in `utils/`, not in the component.
4. Match existing styling: `.screen` wrapper, `.btn-primary`/`.btn-secondary`,
   `.group`/`.opt` selectors, scoped styles for anything screen-specific.
