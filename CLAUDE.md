# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Alphabet Aerobics" (`mod5frontend`) — a rap-lyric guessing battle game. React 16 frontend bootstrapped with Create React App (react-scripts 3.4.1). This repo is frontend-only; it expects a separate backend API running locally (see Backend API below).

## Commands

- `yarn start` — run the dev server (uses `--openssl-legacy-provider`, required because react-scripts 3.4.1's webpack/Node tooling breaks on modern Node's default OpenSSL provider)
- `yarn build` — production build
- `yarn test` — Jest + React Testing Library in watch mode (only `src/App.test.js` exists, and it's still the default CRA placeholder test — it doesn't reflect real app behavior)
- `yarn eject` — irreversible CRA eject; do not run without explicit user instruction

No backend lives in this repo. The app expects an API server at `http://localhost:3000` (REST: `/rappers`, `/users`, `/battles`). Note this is the same port CRA's own dev server defaults to, so the API server must be configured to run elsewhere, or the dev server's port reassigned, when running both locally. A second, differently-shaped API lives at `http://localhost:3000/api/lyrics` (used only by `GuessTheLyric`/`lyricService.js`) — this looks like a newer/separate integration from the `/rappers`-`/users`-`/battles` set.

## Architecture

### State: prop-drilled from App.js (mid-migration to Redux)

`src/App.js` is a class component holding the single source of truth for top-level app state: `user`, `rapperList`, `bossRapper`, `selectedRapper`. It fetches rappers/boss on mount and passes state plus callback methods (`submitUser`, `setUser`, `selectRapper`, `endGame`) down through `react-router-dom` v5 `Route`/`Switch` `render` props to each screen. There is no Context or global store wiring it together — it's pure prop drilling.

The current branch (`redux`) has added `@reduxjs/toolkit` and `react-redux` to `package.json` but no store/slices/`Provider` exist yet — the migration to Redux has not actually started in code.

### Routes (react-router-dom v5)

- `/` → `Signin`
- `/new_user` → `NewUser`
- `/select_rapper` → `SelectRapperScreen` (renders `RapperCard`s from `rapperList`)
- `/battle` → `BattleContainer` (the game screen)
- `/winner_end_game` → `WinnerEndGame`
- `/end_game` → `EndGame`

`NavBar` is rendered outside the `Switch` on every route and conditionally shows nav links based on whether `user` is set.

### Battle screen owns its own complex local state

`BattleContainer` (`src/components/battle/BattleContainer.js`) does **not** rely on App.js state beyond the initial `selectedRapper`/`bossRapper`/`user` props. On mount it fetches full rapper details (lives, lyrics, bio, gif) for both fighters and keeps its own local state machine: `userRapperInfo`/`bossRapperInfo` (each with `lives`, `myTurn`, `isTrue` for right/wrong feedback) and `userRapperLyrics`/`bossRapperLyrics`. Turn-taking, life decrements, and win/loss detection all happen in `onHandleSubmitAnswer`, which calls back up to `App.endGame` only when a rapper's lives hit 0. This is the most fragile/bug-prone part of the app — comments in the file note dead/half-finished logic (`answerFeedback`, the commented-out win-check block). Treat changes here carefully and check both the user-turn and boss-turn branches when modifying.

`LyricContainer` (despite the `LyricCard` class name) owns the per-turn lyric-picking and answer-submission UI and calls back up to `BattleContainer.onHandleSubmitAnswer`.

### Component layout

- `src/components/sign-In/` — `Signin`, `NewUser` (each does its own `fetch` against `/users`)
- `src/components/character_selection/` — `SelectRapperScreen`, `RapperCard`
- `src/components/battle/` — `BattleContainer`, `UserCard`, `BossCard`, `LyricContainer`
- `src/components/services/lyricService.js` — fetch helpers for the separate `/api/lyrics` integration used by `GuessTheLyric`
- `src/components/EndGame.js`, `src/components/WinnerEndGame.js` — terminal screens, read rapper info from props passed down from App.js

Nearly every component is wrapped in `withRouter` even where only used for `this.props.history.push(...)` navigation — that's the established pattern for in-component navigation in this codebase.

### UI

Built with `semantic-ui-react`. Full-bleed background images come from `public/Images` and `public/Gifs`, referenced via inline `style={{ backgroundImage: ... }}` objects defined as class properties.
