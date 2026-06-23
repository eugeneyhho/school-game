# Styling & Design System

The look-and-feel: a soft pastel, rounded, "bouncy" kid UI. Global tokens and
shared "chrome" live in [`src/style.css`](../src/style.css); screen-specific
rules live in each component's `<style scoped>`.

## Design tokens (`:root`)

```css
--font      : 'Fredoka', system-ui, …   /* loaded via Google Fonts in index.html */
--pink      : #ff6b9d
--purple    : #9b5de5
--blue      : #4dabf7
--green     : #51cf66
--yellow    : #ffd43b
--orange    : #ff922b
--ink       : #4a3a6b      /* primary text */
--ink-soft  : #84729f      /* secondary text */
--card      : rgba(255,255,255,0.95)
--shadow    : 0 14px 44px rgba(91,71,145,0.25)
```

When adding a color, prefer a token over a literal so it stays consistent. The
confetti palette in `utils/confetti.js` hard-codes the same six brand hues.

## Global foundations

- **Animated gradient background.** `body` has a 4-stop pastel gradient
  (`#ffd1e8 → #d8c4ff → #bfe3ff → #fff3bf`) that drifts via a 20s
  `gradientShift` keyframe — the whole app sits on this.
- **Centered card stage.** `#app` is a flex centerer; every screen is a
  `.screen` card (max-width ~460–560px, 32px radius, `--shadow`, `pop-in`
  entrance).
- **Tap-friendly defaults.** `user-select: none`, `-webkit-tap-highlight-color:
  transparent`, and `button:active { transform: scale(0.94) }` give every
  button a physical "press". `index.html` also sets
  `maximum-scale=1.0, user-scalable=no` to disable pinch-zoom.

## Shared chrome classes (reused across screens)

| Class | Used by |
| --- | --- |
| `.screen` | every full-screen card wrapper |
| `.title` / `.subtitle` | headings on home/start/pending/results |
| `.btn-primary` | main CTA (gradient pink→orange, 3D press shadow) |
| `.btn-secondary` | secondary actions (white card, purple outline) |
| `.group-label` / `.group` / `.opt` | option rows on start screens |
| `.opt.selected` | the chosen option chip |
| `.back-btn` / `.home-btn` | fixed top-left back / in-topbar home |
| `.topbar` / `.score` / `.streak` / `.progress` / `.dot` | in-game HUD |
| `.feedback` / `.feedback-msg` / `.feedback-answer` | correct/wrong banner |
| `.big-emoji` / `.stars` / `.star` / `.msg` / `.score-line` / `.acc` / `.streak-line` | results screen |
| `.timer` / `.time-line` | fixed top-right live timer + results time row |

> ⚠️ `GameScreen.vue` **re-declares** `.topbar/.score/.streak/.progress/.dot/
> .feedback` in its scoped style. Those copies override the global ones *only*
> on the math game screen. Keep the two in sync when restyling, or remove the
> duplication.

## Responsive sizing

Almost all font/padding sizes use `clamp(min, vw, max)` so the UI scales on
phones and tablets without media queries. The only breakpoint is
`@media (max-width: 380px)` trimming `.opt` padding for very narrow screens.

## Animations (keyframes)

| Name | Where | Effect |
| --- | --- | --- |
| `gradientShift` | `body` | background drift (20s loop) |
| `pop-in` | `.screen` / `.game` | card scales up on enter |
| `pop` | emoji aids, picture | per-item scale-in (often staggered via `animationDelay`) |
| `wave` / `bob` / `happy` / `sad` | `AppMascot` | mascot moods (see below) |
| `shake` | `.choice.wrong` | wrong-answer button wiggle |
| `starpop` | `.star.on` | results star entrance (rotate + scale) |

### Mascot moods (`AppMascot.vue`)
A single 🦊 emoji with `filter: drop-shadow(...)`. The `mood` prop sets a class:
- `wave` — rotate ±6° loop (home/start screens)
- `idle` — gentle vertical bob loop (during play)
- `happy` — big hop + scale, plays twice (correct answer)
- `sad` — horizontal shake + tilt, plays twice (wrong answer)

## Reusable interaction patterns

- **3D press buttons.** A solid `box-shadow: 0 Npx 0 <darker>` acts as the
  button's "thickness"; `:active` shrinks the shadow + translates down to
  simulate a physical press. Used by `.btn-primary`, `.card`, `.choice`,
  `.key`, `.tile`, `.backspace`.
- **`color-mix()` for per-item theming.** `HomeScreen` cards pass their brand
  color as `--c` and derive border/shadow/background from
  `color-mix(in srgb, var(--c) N%, #fff)` — add a subject by giving it a color.
- **`:key` to retrigger entrance.** `EnglishGameScreen` keys the picture on
  `word` so each new word replays its `pop` animation without a `<Transition>`.
- **`<Transition name="pop">`.** Used for the feedback banner in both game
  screens (`pop-enter-active` / `pop-enter-from`).
