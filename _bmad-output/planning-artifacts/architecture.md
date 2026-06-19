---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - prds/prd-bmad-test-2026-06-17/prd.md
  - prds/prd-bmad-test-2026-06-17/review-rubric.md
  - prds/prd-bmad-test-2026-06-17/.decision-log.md
  - ux-designs/ux-bmad-test-2026-06-17/DESIGN.md
  - ux-designs/ux-bmad-test-2026-06-17/EXPERIENCE.md
  - ux-designs/ux-bmad-test-2026-06-17/reconcile-prd.md
  - ux-designs/ux-bmad-test-2026-06-17/.decision-log.md
  - ux-designs/ux-bmad-test-2026-06-17/mockups/key-timer-main.html
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-06-17'
project_name: 'bmad-test'
user_name: 'Cody'
date: '2026-06-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Six FRs define a minimal client-side countdown application:

| FR | Requirement | Architectural implication |
|----|-------------|---------------------------|
| FR-1 | Four preset buttons (1, 5, 10, 25 min) set duration | Preset selection model; selected-state tracking; disable presets while running/paused |
| FR-2 | Start decrements remaining time with second precision | Timer engine (interval or rAF); display formatter (`MM:SS`); accuracy bounded by active tab |
| FR-3 | Pause preserves remaining time; resume continues from it | State machine must separate `duration`, `remaining`, and `running` flags |
| FR-4 | Reset returns to last selected preset duration | Persist `lastSelectedPreset`; reset must stop interval and restore idle display |
| FR-5 | Sound + `00:00` + completion message on zero | Completion handler (one-shot); bundled audio asset; autoplay-gesture unlock on first Start |
| FR-6 | Single-screen layout, large readable digits | One HTML surface; no router; responsive clamp for display typography |

No epics/stories exist yet; FRs are the sole requirements source for component boundaries.

**Non-Functional Requirements:**

| Category | Requirement | Source |
|----------|-------------|--------|
| Deployment | Static front-end only — no backend, API, database, or auth | PRD §4.4, §5 |
| Performance | Second-level countdown while tab active; no background-tab compensation in v1 | PRD FR-2; UX Interaction Primitives |
| Reliability | Completion alert fires exactly once per countdown | PRD FR-5 |
| Accessibility | `aria-live` countdown, `aria-pressed` presets, focus order, 44px targets, WCAG AA contrast, reduced motion (no animations) | UX EXPERIENCE.md |
| Browser support | Laptop/desktop primary (720px+); mobile deferred | UX Foundation |
| Audio | Handle autoplay block silently until user gesture; document in README if needed | PRD FR-5; UX State Patterns |
| Maintainability | Clean, portfolio-ready repo structure; readable vanilla JS | PRD Vision, SM-2 |
| Persistence | localStorage for settings — optional polish, not MVP-blocking | PRD §6.2 |
| Testing | Manual verification acceptable for v1 | PRD §6.2 |

**Scale & Complexity:**

- **Primary domain:** Static web front-end (HTML/CSS/JS)
- **Complexity level:** Low
- **Estimated architectural components:** ~5 logical modules — (1) timer engine, (2) application state machine, (3) DOM/UI bindings, (4) audio completion service, (5) stylesheet with design tokens. Single page, single deployable artifact.

### Technical Constraints & Dependencies

**Explicit constraints (PRD + UX):**

- No user accounts, cloud sync, notifications, Pomodoro cycles, task lists, or analytics.
- Light theme only; dark mode deferred.
- Single timer instance; parallel timers banned.
- Presets replace custom time entry in v1.
- One bundled sound asset; no sound picker or volume control.
- Tooling choice (vanilla JS vs. Vite) explicitly deferred to this architecture workflow.

**Implicit dependencies:**

- Browser `setInterval` / `requestAnimationFrame` for tick loop.
- Web Audio API or HTML5 `<audio>` for completion alert.
- Google Fonts (or self-hosted) for Source Serif 4 display typography.
- No npm dependencies required unless tooling decision adds a bundler.

**Open decisions for downstream architecture steps:**

- Build tooling: plain files vs. Vite (or similar).
- Font loading strategy.
- File/folder layout for portfolio presentation.

### Cross-Cutting Concerns Identified

1. **Application state machine** — Governs preset selection, control visibility, preset disable rules, and completion transition. Central coordination point for all FRs.
2. **Timer accuracy & lifecycle** — Interval management, pause/resume semantics, cleanup on reset/complete/unload.
3. **Audio + browser policy** — Gesture-unlock pattern; graceful degradation when autoplay blocked.
4. **Accessibility** — Live region updates, focus management, semantic controls across all states.
5. **Design token fidelity** — CSS custom properties mapping to `DESIGN.md` tokens; mockup (`key-timer-main.html`) as composition reference.
6. **Copy & microcopy consistency** — UX labels ("Let's go", "Pause for now", "Start over") must match implementation and accessible names.

## Starter Template Evaluation

### Primary Technology Domain

**Static web front-end (client-only)** — single-page HTML/CSS/JavaScript application with no backend, based on project context analysis and PRD constraints.

### Technical Preferences Summary

| Preference | Decision |
|------------|----------|
| Language | JavaScript (ES modules) |
| Framework | None — vanilla DOM |
| Build tooling | Vite (resolves PRD deferred item) |
| Database / API | None |
| Deployment target | Local dev only (hosting deferred) |
| Testing (v1) | Manual verification |

### Starter Options Considered

| Option | Description | Fit |
|--------|-------------|-----|
| **Plain vanilla files** | `index.html` + CSS + JS, no bundler | Adequate for minimalism; weak dev/build story for portfolio |
| **Vite `vanilla` template** | Official JS scaffold with dev server and production build | **Selected** — minimal overhead, portfolio-ready |
| **Vite `vanilla-ts`** | Same as above with TypeScript | Deferred — PRD specifies JS; unnecessary complexity for v1 |

**Versions verified (2026-06-17):** `create-vite@9.0.7`, `vite@8.0.16` (stable). Requires Node.js 20.19+ or 22.12+.

### Selected Starter: Vite `vanilla` template

**Rationale for Selection:**

1. Resolves the PRD's explicit deferral of "Vanilla JS vs. Vite" without introducing a UI framework.
2. Provides `npm run dev` (local dev + HMR) and `npm run build` (static `dist/` for deployment) — supports SM-2 README goal.
3. `public/` directory cleanly hosts the completion sound asset (FR-5).
4. ES module structure (`src/main.js`, split modules) supports the five logical components identified in context analysis without React overhead.
5. UX spine explicitly expects "Vanilla HTML/CSS/JS" — Vite vanilla delivers this with modern DX.
6. Mockup (`key-timer-main.html`) ports directly into `index.html` + `src/style.css`.

**Initialization Command:**

```bash
npm create vite@latest simple-timer -- --template vanilla
cd simple-timer
npm install
npm run dev
```

> Implementation story may adjust project name/path (e.g. scaffold into repo root with `.` instead of `simple-timer`). Use `--no-interactive` for CI/automation if needed.

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- JavaScript (ES modules) via `src/main.js` entry point
- No TypeScript, no transpiler beyond Vite's native ESM handling
- `index.html` at project root as Vite entry (not a JS-generated shell)

**Styling Solution:**
- Plain CSS in `src/style.css` (DESIGN.md tokens → CSS custom properties)
- No Tailwind, CSS-in-JS, or preprocessor unless added later
- Google Fonts link in `index.html` for Source Serif 4

**Build Tooling:**
- Vite 8.x dev server with hot module replacement
- `vite build` → optimized static output in `dist/`
- `vite preview` → local production preview
- `vite.config.js` available for aliases/paths if needed (default config sufficient for v1)

**Testing Framework:**
- None included (aligned with PRD — manual verification acceptable for v1)
- Test framework can be added in a future story if desired

**Code Organization:**
- Default scaffold:
  ```
  simple-timer/
  ├── public/          # Static assets (completion sound, favicon)
  ├── src/
  │   ├── main.js      # Entry point — wire DOM, init app
  │   └── style.css    # Design tokens + component styles
  ├── index.html       # Single-screen markup (from UX mockup)
  ├── package.json
  └── vite.config.js
  ```
- Expected module split (implementation step, not scaffold-provided):
  - `src/timer.js` — countdown engine
  - `src/state.js` — application state machine
  - `src/audio.js` — completion alert + gesture unlock
  - `src/ui.js` — DOM bindings and accessibility

**Development Experience:**
- `npm run dev` — local development at `http://localhost:5173`
- `npm run build` — production build
- `npm run preview` — preview production build locally
- Fast cold start; no framework-specific conventions to learn

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

| Decision | Choice |
|----------|--------|
| State management | Centralized FSM in `src/state.js` |
| Timer engine | `setInterval` (1s) + `Date.now()` end-time tracking |
| Audio | HTML5 `<audio>` with gesture unlock in `src/audio.js` |
| Module split | `main.js`, `state.js`, `timer.js`, `ui.js`, `audio.js`, `style.css` |
| App location | `simple-timer/` subdirectory in repo |
| Sound asset | **Must be acquired** — not yet available; prerequisite for FR-5 |

**Important Decisions (Shape Architecture):**

| Decision | Choice |
|----------|--------|
| Styling | Plain CSS with custom properties from DESIGN.md |
| Fonts | Google Fonts CDN (Source Serif 4) |
| Local verification | `npm run dev`, `npm run build`, `npm run preview` |

**Deferred Decisions (Post-MVP):**

| Decision | Rationale |
|----------|-----------|
| GitHub Pages hosting | User requested hold-off; revisit when ready to publish |
| `vite.config.js` `base` path | Configure when hosting target is chosen; default `/` for local dev |
| `gh-pages` deploy scripts | Deferred with hosting |
| GitHub Actions CI/CD | Manual workflow sufficient for hobby v1 |
| localStorage persistence | PRD optional polish |
| Self-hosted fonts | CDN adequate; reduces build complexity |
| TypeScript | PRD specifies JS; revisit if codebase grows |
| Automated test suite | PRD accepts manual verification |
| PWA / service worker | Explicitly out of scope |

### Data Architecture

**Not applicable.** No database, server-side storage, or sync. All state is in-memory for the session. Optional `localStorage` deferred post-MVP.

### Authentication & Security

**Not applicable.** No user accounts or API keys.

**Client-side considerations:**

- No secrets in client code
- Completion audio respects browser autoplay policy (unlock on first user gesture per FR-5)
- Static assets only; no user input persisted or transmitted

### API & Communication Patterns

**Not applicable.** No backend, no network calls, no WebSockets.

### Frontend Architecture

**State management:** Centralized finite state machine in `src/state.js` with explicit states matching UX State Patterns: `idle`, `running`, `paused`, `complete`. State module exports current state, transition functions, and a subscribe/notify pattern for `ui.js` to react.

**Timer engine:** `src/timer.js` uses `setInterval` at 1000ms. Stores `endTime` (epoch ms) while running; on pause, stores `remainingMs`; on resume, recalculates `endTime`. Clears interval on pause, reset, and complete. Display formatting (`MM:SS`) lives in `timer.js` or a small `formatTime()` helper.

**UI layer:** `src/ui.js` binds DOM elements declared in `index.html`. Handles control visibility per state, `aria-pressed` on presets, `aria-live="polite"` on countdown, and microcopy from EXPERIENCE.md. No virtual DOM or templating library.

**Audio:** `src/audio.js` wraps `<audio src="/completion.mp3">` (path TBD) in `public/`.

**Sound asset prerequisite:** No completion sound file exists yet. Implementation must acquire a short, non-looping chime (MP3 recommended) with a license suitable for a public portfolio repo. Suggested sources: royalty-free libraries (e.g. Freesound, Mixkit) with compatible license, or an original recording. Place in `public/` before FR-5 acceptance. Document license/attribution in README if required. Asset should match warm-paper aesthetic — calm chime, not harsh alarm.

`unlock()` called on first "Let's go" click; `play()` called once on transition to `complete`. If asset is missing or autoplay blocked, fail silently — on-screen completion remains the primary signal.

**Styling:** `src/style.css` defines CSS custom properties for all DESIGN.md tokens (colors, spacing, typography, radii). Component classes match mockup (`timer-card`, `preset`, `countdown`, etc.). Display font uses `clamp()` for responsive scaling per DESIGN.md.

**Performance:** No code splitting needed (single page, tiny bundle). Vite production build handles minification. No lazy loading.

### Infrastructure & Deployment

**Hosting:** Deferred. No deployment target configured for v1. Application is developed and verified locally only.

**Local development:**

- `npm run dev` — development server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — local preview of production build

**Vite configuration:** Default `base: '/'` (no GitHub Pages path prefix). Revisit `base` and deploy tooling when a hosting target is chosen.

**Deploy workflow:** Deferred. GitHub Pages, `gh-pages` package, and CI/CD are not configured. README should document local run instructions only; deployment section marked TBD.

**Environment configuration:** No environment variables required for v1.

### Decision Impact Analysis

**Implementation Sequence:**

1. Scaffold Vite vanilla in `simple-timer/` (`npm create vite@latest simple-timer -- --template vanilla`)
2. Port mockup HTML/CSS into `index.html` + `src/style.css` with design tokens
3. Implement `state.js` FSM (foundation for all FRs)
4. Implement `timer.js` (FR-2, FR-3 timing)
5. Implement `ui.js` (FR-1, FR-4, FR-6, accessibility)
6. **Acquire completion sound asset** — source MP3, add to `public/`, document license (FR-5 prerequisite)
7. Implement `audio.js` wired to the asset
8. Wire in `main.js`; manual test all states and flows
9. Add README with local run instructions (SM-2); deployment section TBD

**Cross-Component Dependencies:**

- `state.js` is the hub — `timer.js`, `ui.js`, and `audio.js` all react to state transitions
- `timer.js` tick events feed back into `state.js` to trigger `complete` transition
- `ui.js` calls `state.js` transitions on user input; never mutates timer directly
- `audio.js` is invoked only by `state.js` on `complete` transition and `unlock()` on first start
- FR-5 blocked until sound asset is acquired and placed in `public/`
- CSS tokens must be in place before UI polish; markup structure from mockup is the composition reference

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 12 areas where AI agents could make incompatible choices without these rules.

### Naming Patterns

**Database Naming Conventions:**

Not applicable — no database.

**API Naming Conventions:**

Not applicable — no API.

**Code Naming Conventions:**

| Element | Convention | Example |
|---------|------------|---------|
| JS module files | `camelCase.js` in `src/` | `state.js`, `timer.js`, `ui.js`, `audio.js` |
| JS functions | `camelCase` verbs | `formatTime()`, `transitionTo()`, `playCompletion()` |
| JS constants | `SCREAMING_SNAKE_CASE` | `PRESET_DURATIONS_MS`, `TICK_INTERVAL_MS` |
| State enum values | lowercase string literals | `'idle'`, `'running'`, `'paused'`, `'complete'` |
| CSS classes | `kebab-case`, match mockup | `.timer-card`, `.preset`, `.countdown`, `.btn-primary` |
| CSS custom properties | `--kebab-case`, prefix `--color-`, `--spacing-` | `--color-accent`, `--spacing-7` |
| HTML `id` attributes | `kebab-case`, use sparingly | `countdown-display` (prefer classes + `querySelector`) |
| Static assets in `public/` | `kebab-case` filenames | `completion.mp3` |
| Event handler functions | `handle` + `PascalCase` noun | `handlePresetClick()`, `handleLetsGoClick()` |

**Presets:** Use numeric keys in minutes for display (`1`, `5`, `10`, `25`); store durations internally as **milliseconds** in a `PRESET_DURATIONS_MS` map.

### Structure Patterns

**Project Organization:**

```
simple-timer/
├── public/
│   └── completion.mp3       # Sound asset (acquire before FR-5)
├── src/
│   ├── main.js              # Entry — bootstrap only, no business logic
│   ├── state.js             # FSM — sole owner of application state
│   ├── timer.js             # Interval + time math — no DOM access
│   ├── ui.js                # DOM bindings — no timer interval logic
│   ├── audio.js             # Audio element — no state transitions
│   └── style.css            # All styles + design tokens
├── index.html               # Static markup (from UX mockup)
├── package.json
├── vite.config.js
└── README.md
```

**Module import rules (enforced):**

| Module | May import | Must NOT import |
|--------|------------|-----------------|
| `main.js` | all modules | — |
| `state.js` | `timer.js`, `audio.js` | `ui.js` |
| `timer.js` | nothing (pure logic) | `ui.js`, `state.js`, `audio.js` |
| `ui.js` | `state.js` (read + transition calls only) | `timer.js`, `audio.js` |
| `audio.js` | nothing | all other modules |

**File Structure Patterns:**

- Markup lives in `index.html` — agents must NOT generate DOM structure from JavaScript
- Design tokens as CSS custom properties at `:root` in `style.css` — not hardcoded hex in JS
- Sound asset in `public/` — referenced as `/completion.mp3` (Vite public path)
- No `utils/` folder unless a helper is used by 2+ modules; prefer colocating (`formatTime` in `timer.js`)

### Format Patterns

**API Response Formats:**

Not applicable.

**Data Exchange Formats:**

| Data | Format | Example |
|------|--------|---------|
| Remaining time (internal) | Integer milliseconds | `300000` for 5 min |
| Display time | `MM:SS` string | `"05:00"`, `"00:42"` |
| State snapshot | Plain object | `{ status: 'running', presetMinutes: 5, remainingMs: 242000 }` |
| Preset map | `Record<number, number>` | `{ 1: 60000, 5: 300000, 10: 600000, 25: 1500000 }` |

### Communication Patterns

**Event System Patterns:**

No custom event bus. Use a **subscribe/notify** pattern in `state.js`:

```javascript
// state.js — canonical pattern
const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener(getState()));
}
```

- `ui.js` subscribes once in `initUI()` and re-renders on every notification
- `timer.js` calls a callback (`onTick(remainingMs)`) passed by `state.js` — not directly by `ui.js`

**State Management Patterns:**

- **Single source of truth:** `state.js` owns all mutable application state
- **Immutable transitions:** state changes go through named transition functions (`selectPreset()`, `start()`, `pause()`, `reset()`, `complete()`)
- **No direct state mutation from `ui.js`:** UI calls transition functions only
- **Timer callbacks:** `timer.js` reports ticks and completion to `state.js`; `state.js` decides transitions

### Process Patterns

**Error Handling Patterns:**

| Scenario | Pattern |
|----------|---------|
| Missing sound file | `audio.js` catches play errors silently; no user-facing error |
| Autoplay blocked | Silent fail; README documents behavior |
| Invalid state transition | `console.warn` in dev; ignore transition (no throw) |
| Missing DOM element | `console.error` at init in `ui.js`; fail fast on boot |

No global error boundary (no framework). No toast/banner errors in v1 per UX spec.

**Loading State Patterns:**

Not applicable — no async data loading. Sound asset is a static file; app boots synchronously after DOM ready.

### Enforcement Guidelines

**All AI Agents MUST:**

- Store time internally as **milliseconds**; format to `MM:SS` only at display boundary
- Route all state changes through `state.js` transition functions
- Keep DOM manipulation exclusively in `ui.js`
- Keep interval/timer logic exclusively in `timer.js`
- Use CSS class names matching the UX mockup and `DESIGN.md`
- Use EXPERIENCE.md microcopy verbatim for visible and accessible labels
- Reference UX mockup (`key-timer-main.html`) for HTML structure and class names
- Place acquired sound asset at `public/completion.mp3` and document license in README

**All AI Agents MUST NOT:**

- Introduce a UI framework, state library, or CSS preprocessor without architecture amendment
- Create DOM elements in JavaScript (markup is in `index.html`)
- Store countdown state in DOM attributes or `data-*` as source of truth
- Use `localStorage` in v1 (deferred)
- Add routing, modals, or toast notifications

**Pattern Verification:**

- Manual test all five UX states (cold open, idle, running, paused, complete) before marking story done
- Compare rendered UI against `mockups/key-timer-main.html` for structure and tokens
- Grep for `setInterval` — should appear only in `timer.js`

### Pattern Examples

**Good Example — state transition:**

```javascript
// state.js
export function start() {
  if (state.status !== 'idle' && state.status !== 'paused') {
    return;
  }
  audio.unlock();
  timer.start(state.remainingMs, onTick, onTimerComplete);
  state = { ...state, status: 'running' };
  notify();
}
```

**Good Example — display formatting:**

```javascript
// timer.js
export function formatTime(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

**Anti-Patterns:**

```javascript
// BAD — UI directly manages interval
function handleLetsGoClick() {
  setInterval(() => { /* ... */ }, 1000);
}

// BAD — time stored as seconds internally
const remaining = 300; // ambiguous: 300 seconds or 300ms?

// BAD — DOM as state source of truth
const remaining = parseInt(document.querySelector('.countdown').textContent);

// BAD — generating markup in JS
document.body.innerHTML = `<div class="timer-card">...</div>`;
```

## Project Structure & Boundaries

### Complete Project Directory Structure

Repository root (`bmad-test/`) hosts BMAD planning artifacts separately from the application:

```
bmad-test/
├── _bmad-output/
│   └── planning-artifacts/
│       ├── architecture.md              # This document
│       ├── prds/
│       │   └── prd-bmad-test-2026-06-17/
│       │       ├── prd.md
│       │       ├── review-rubric.md
│       │       └── .decision-log.md
│       └── ux-designs/
│           └── ux-bmad-test-2026-06-17/
│               ├── DESIGN.md
│               ├── EXPERIENCE.md
│               ├── reconcile-prd.md
│               ├── mockups/
│               │   └── key-timer-main.html
│               └── .decision-log.md
│
├── simple-timer/                        # Application root (Vite vanilla)
│   ├── public/
│   │   └── completion.mp3               # TO ACQUIRE — completion chime (FR-5)
│   ├── src/
│   │   ├── main.js                      # Bootstrap: initUI(), wire modules
│   │   ├── state.js                     # FSM: idle | running | paused | complete
│   │   ├── timer.js                     # setInterval, endTime, formatTime()
│   │   ├── ui.js                        # DOM render, events, a11y
│   │   ├── audio.js                     # HTMLAudioElement, unlock(), play()
│   │   └── style.css                    # :root tokens + component styles
│   ├── index.html                       # Timer surface markup (from mockup)
│   ├── package.json                     # dev, build, preview scripts
│   ├── package-lock.json
│   ├── vite.config.js                   # default base: '/' (deploy config deferred)
│   ├── .gitignore
│   └── README.md                        # Local run + sound license; deploy TBD
│
├── _bmad/                               # BMAD tooling (installer config)
└── .agents/                             # BMAD skills
```

**Build output (generated, not committed):**

```
simple-timer/dist/                       # Production build (vite build)
```

### Architectural Boundaries

**API Boundaries:**

None. Fully client-side; no HTTP endpoints.

**Component Boundaries:**

```
┌─────────────────────────────────────────────────────────┐
│  index.html — static markup only                        │
└──────────────────────────┬──────────────────────────────┘
                           │ DOM refs
┌──────────────────────────▼──────────────────────────────┐
│  ui.js — read state, call transitions, update DOM       │
│  (no timer logic, no audio logic)                       │
└──────────────────────────┬──────────────────────────────┘
                           │ transition calls / subscribe
┌──────────────────────────▼──────────────────────────────┐
│  state.js — FSM hub, sole mutable state owner           │
│  orchestrates timer.js and audio.js                       │
└───────┬──────────────────────────────────────┬──────────┘
        │ callbacks                            │ play/unlock
┌───────▼──────────┐                 ┌─────────▼──────────┐
│  timer.js        │                 │  audio.js          │
│  (pure timing)   │                 │  (pure audio)      │
└──────────────────┘                 └────────────────────┘
        ▲
        │ init
┌───────┴──────────┐
│  main.js         │
└──────────────────┘
```

**Service Boundaries:**

Not applicable — no backend services.

**Data Boundaries:**

All runtime data is in-memory in `state.js`. No persistence layer in v1.

| State field | Owner | Consumers |
|-------------|-------|-----------|
| `status` | `state.js` | `ui.js` (visibility rules) |
| `presetMinutes` | `state.js` | `ui.js` (selected preset), `timer.js` (reset duration) |
| `remainingMs` | `state.js` | `timer.js` (tick target), `ui.js` (display) |

### Requirements to Structure Mapping

**FR Category Mapping:**

| FR | Files |
|----|-------|
| FR-1 Preset selection | `index.html` (`.presets`), `state.js` (`selectPreset`), `ui.js` (`handlePresetClick`, `aria-pressed`) |
| FR-2 Start / countdown | `state.js` (`start`), `timer.js` (`start`, `onTick`), `ui.js` (countdown display) |
| FR-3 Pause / resume | `state.js` (`pause`, `start`), `timer.js` (`pause`, `resume`) |
| FR-4 Reset | `state.js` (`reset`), `timer.js` (`stop`), `ui.js` (restore display) |
| FR-5 Completion alert | `state.js` (`complete`), `audio.js` (`play`), `public/completion.mp3`, `ui.js` (message + `00:00`) |
| FR-6 Single-screen layout | `index.html`, `style.css` |

**Cross-Cutting Concerns:**

| Concern | Location |
|---------|----------|
| State machine | `src/state.js` |
| Accessibility | `index.html` (semantics), `ui.js` (`aria-*`, focus) |
| Design tokens | `src/style.css` (`:root` vars from DESIGN.md) |
| Microcopy | `index.html` button text + `ui.js` dynamic labels |
| Sound asset + license | `public/completion.mp3`, `README.md` attribution section |

### Integration Points

**Internal Communication:**

1. User click → `ui.js` event handler → `state.js` transition function
2. `state.js` transition → `timer.js` start/pause/stop + `notify()`
3. `timer.js` tick callback → `state.js` updates `remainingMs` + `notify()`
4. `timer.js` complete callback → `state.js` `complete()` → `audio.js` `play()` + `notify()`
5. `notify()` → `ui.js` subscriber re-renders DOM from state snapshot

**External Integrations:**

| Integration | Location | Notes |
|-------------|----------|-------|
| Google Fonts (Source Serif 4) | `index.html` `<link>` | CDN; no npm package |
| Browser autoplay policy | `audio.js` | Unlock on first "Let's go" |

**Data Flow:**

```
User gesture
  → ui.js (event)
  → state.js (transition + remainingMs update)
  → timer.js (interval ticks) ──→ state.js (remainingMs)
  → state.js (notify)
  → ui.js (render MM:SS, toggle controls)
  → [on complete] audio.js (play once)
```

### File Organization Patterns

**Configuration Files:**

| File | Purpose |
|------|---------|
| `simple-timer/package.json` | Dependencies, npm scripts |
| `simple-timer/vite.config.js` | Vite config; `base: '/'` until deploy decided |
| `simple-timer/.gitignore` | `node_modules/`, `dist/` |

**Source Organization:**

Flat `src/` — no subfolders needed at this scale. One module per concern.

**Test Organization:**

None in v1 (manual verification per PRD). If added later: `simple-timer/tests/` or `*.test.js` colocated — decide at that time.

**Asset Organization:**

| Asset | Location |
|-------|----------|
| Completion sound | `simple-timer/public/completion.mp3` |
| Favicon (optional) | `simple-timer/public/favicon.ico` |
| UX reference mockup | `_bmad-output/.../mockups/key-timer-main.html` (not shipped) |

### Development Workflow Integration

**Development Server:**

```bash
cd simple-timer
npm run dev        # http://localhost:5173
```

**Build Process:**

```bash
npm run build      # → simple-timer/dist/
npm run preview    # local production preview
```

**Deployment Structure:**

Deferred. When hosting is chosen, configure `vite.config.js` `base` and add deploy scripts. `dist/` remains the deployable artifact.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

All technology choices are compatible: Vite 8.x + vanilla JS ES modules + plain CSS + HTML5 `<audio>`. No framework conflicts. Node.js 20.19+ requirement is the only environment constraint. Deferred deployment does not conflict with local-dev-first approach.

**Pattern Consistency:**

Implementation patterns align with architectural decisions: milliseconds internally, `state.js` as hub, module import rules match component boundary diagram, CSS kebab-case matches mockup, subscribe/notify pattern supports FSM without a state library.

**Structure Alignment:**

`simple-timer/` flat `src/` structure supports the five-module split. `public/` hosts sound asset. BMAD planning artifacts remain separate from application code. FR-to-file mapping is complete.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**

No epics exist. All six FRs mapped to specific files in Requirements to Structure Mapping.

**Functional Requirements Coverage:**

| FR | Architectural support | Status |
|----|----------------------|--------|
| FR-1 Presets | `state.js`, `ui.js`, `index.html` | ✅ Covered |
| FR-2 Start / countdown | `timer.js`, `state.js`, `ui.js` | ✅ Covered |
| FR-3 Pause / resume | `timer.js` end-time pattern, `state.js` transitions | ✅ Covered |
| FR-4 Reset | `state.js` `reset()`, preserves `presetMinutes` | ✅ Covered |
| FR-5 Completion alert | `audio.js`, `public/completion.mp3`, `ui.js` completion UI | ⚠️ Covered — asset acquisition required at implementation |
| FR-6 Single-screen layout | `index.html`, `style.css`, design tokens | ✅ Covered |

**Non-Functional Requirements Coverage:**

| NFR | Status |
|-----|--------|
| Static front-end only | ✅ No backend in architecture |
| Second precision (active tab) | ✅ `setInterval` + end-time in `timer.js` |
| Accessibility floor | ✅ `ui.js` + `index.html` semantics specified |
| Portfolio-ready structure | ✅ Vite + README + clean module split |
| Manual testing acceptable | ✅ No test framework required v1 |
| Deployment | ⏸️ Intentionally deferred per user decision |

### Implementation Readiness Validation ✅

**Decision Completeness:**

All critical decisions documented: stack (Vite vanilla), state pattern (FSM), timer approach, audio approach, module boundaries, file layout. Versions verified: `create-vite@9.0.7`, `vite@8.0.16`.

**Structure Completeness:**

Complete directory tree with every source file named. Integration points and data flow documented. Component boundary diagram provided.

**Pattern Completeness:**

Naming, structure, format, communication, and process patterns defined with good/anti-pattern examples. Enforcement guidelines include MUST/MUST NOT rules.

### Gap Analysis Results

**Critical Gaps:** None. Architecture is complete enough to begin implementation.

**Important Gaps (implementation-time, not architecture-time):**

| Gap | Resolution |
|-----|------------|
| `public/completion.mp3` does not exist | Acquire royalty-free chime during implementation step 6; document license in README |
| UX cold-open default is `[ASSUMPTION]` | Implementer selects 5 min pre-selected (UX recommendation); log in commit or README |
| Idle hint copy is `[ASSUMPTION]` | Implement per EXPERIENCE.md or omit if scope tightens |

**Nice-to-Have Gaps (deferred):**

- GitHub Pages deployment config
- `localStorage` preset persistence
- Automated test suite
- Self-hosted fonts
- Favicon

### Validation Issues Addressed

| Issue | Resolution |
|-------|------------|
| GitHub Pages in early drafts | Removed — user deferred deployment; `base: '/'` for local dev |
| Sound asset availability | Documented as implementation prerequisite with acquisition guidance |
| Tooling open from PRD | Resolved — Vite vanilla selected |

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**

- Tight scope with explicit non-goals prevents creep
- Clear module boundaries and import rules reduce agent conflicts
- UX mockup + DESIGN.md + EXPERIENCE.md provide concrete implementation references
- FSM pattern maps 1:1 to UX state table
- Deferred items (deploy, localStorage, tests) are explicitly documented

**Areas for Future Enhancement:**

- GitHub Pages deployment when ready to publish
- Sound asset is the only MVP implementation dependency outside code
- Optional localStorage, PWA, TypeScript, automated tests

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Cross-reference UX spines (`DESIGN.md`, `EXPERIENCE.md`) and mockup for visual/behavioral truth

**First Implementation Priority:**

```bash
npm create vite@latest simple-timer -- --template vanilla
cd simple-timer
npm install
npm run dev
```
