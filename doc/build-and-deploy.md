# Build & Deploy

Scripts, local workflow, and the GitHub Pages pipeline.

## Scripts (`package.json`)

| Command | Does |
| --- | --- |
| `npm install` | Install dependencies (`vue`, `canvas-confetti`, vite, plugin-vue). |
| `npm run dev` | Start the Vite dev server (prints a `http://localhost:5173` URL). |
| `npm run build` | Production build → `dist/`. |
| `npm run preview` | Serve the built `dist/` locally to sanity-check production. |

There is no lockfile-pinned CI step; the workflow uses `npm install` (not
`npm ci`) so builds succeed even without a committed lockfile.

## Vite config (`vite.config.js`)

```js
base: command === 'build' ? '/school-game/' : '/',
```

- **Dev** keeps `base: '/'` (served at the domain root).
- **Build** sets `base: '/school-game/'` so generated asset URLs are prefixed
  for GitHub Pages project sites.

If you rename the repo, use a custom domain, or deploy elsewhere, change this
`base` (or set it to `'/'` for an apex/user Pages site).

## GitHub Pages pipeline

[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

- **Trigger:** push to `master`.
- **Environment:** `github-pages`, Node 24, `npm install` → `npm run build`.
- **Publish:** uploads `./dist` via `upload-pages-artifact@v4`, then deploys
  with `deploy-pages@v4`.
- **Concurrency:** group `"pages"` with `cancel-in-progress: true` — a newer
  push supersedes a running deploy.

### One-time repo setup (required for the deploy to work)

1. **Settings → Pages → Source = "GitHub Actions"** (not "Deploy from a
   branch"). The workflow publishes the artifact itself.
2. Confirm `base` in `vite.config.js` matches your Pages URL.
3. First push to `master` builds and publishes; subsequent pushes redeploy.

Published URL (default config): **https://eugeneyhho.github.io/school-game/**

## Adding a subject

All three subjects (Math, English, Chinese) follow the same template, so a fourth is
straightforward. The Chinese game (added most recently) is the freshest worked example —
see [chinese-game.md](chinese-game.md).

1. **Util** — `src/utils/<subject>.js` (pure data/generation, no Vue): a vocab/problem set
   and `pickWords`/`buildChoices`-style helpers.
2. **Composable** — `src/composables/use<Subject>Game.js` exporting a singleton
   `const <subject>Game = { … }` with `start`/`submit`/`advance` and the shared
   `status` lifecycle (see [architecture.md](architecture.md)).
3. **Components** — `<Subject>App.vue` (the `start→game→results` shell) plus its
   `Start`/`Game`/`Result` screens. Reuse `AnswerButtons` (if multiple-choice),
   `AppMascot`, confetti, the SFX layer ([sound.md](sound.md)), and the shared chrome
   classes from `style.css`.
4. **Wire it in `App.vue`** — add a `v-else-if` branch rendering the new app. (If you're
   replacing a pending slot, swap the branch and set the HomeScreen card's `pending:false`.)
5. **HomeScreen.vue** — add (or un-pend) the card: `emoji/title/sub/color/pending`.
6. No build/deploy change needed — Vite picks up new files automatically.
