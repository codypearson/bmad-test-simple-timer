# Story 1.2: Select a Preset Duration

baseline_commit: NO_VCS

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Cody,
I want to tap a preset button to set my focus block duration,
so that I can start a countdown in one or two actions without manual time entry.

## Acceptance Criteria

1. **Given** the timer is in idle state  
   **When** Cody taps a Preset button (1, 5, 10, or 25 min)  
   **Then** the Countdown Display immediately updates to the full preset duration in `MM:SS` format (e.g. `05:00` for 5 min)  
   **And** the tapped Preset shows selected styling (accent-subtle fill, accent border) with `aria-pressed="true"`; other presets show `aria-pressed="false"` (FR1, UX-DR6)

2. **Given** a Preset is selected  
   **When** Cody taps a different Preset while idle  
   **Then** the display updates to the new duration and selection moves to the new Preset  
   **And** the previously selected Preset returns to default styling

3. **Given** the timer is running or paused  
   **When** Cody attempts to tap a Preset  
   **Then** Preset buttons are disabled (ink-disabled text, no pointer interaction)  
   **And** the current duration and state are unchanged (UX-DR14)

4. **Given** the timer is idle with a Preset selected  
   **When** Cody views the Controls  
   **Then** "Let's go" and "Start over" are visible; "Pause for now" is hidden (UX-DR15)

5. **Given** `src/state.js` exists  
   **When** a Preset is selected  
   **Then** `state.js` records `presetMinutes` and `remainingMs` (stored as integer milliseconds internally)  
   **And** `ui.js` subscribes to state changes via the subscribe/notify pattern and re-renders without direct timer logic (architecture module boundaries)

## Tasks / Subtasks

- [x] Create `src/state.js` FSM foundation (AC: #5)
  - [x] Define states: `idle`, `running`, `paused`, `complete` (only `idle` active in this story)
  - [x] Define `PRESET_DURATIONS_MS` map: `{ 1: 60000, 5: 300000, 10: 600000, 25: 1500000 }`
  - [x] Implement `getState()`, `subscribe(listener)`, `notify()` pattern
  - [x] Implement `selectPreset(minutes)` transition — updates `presetMinutes`, `remainingMs`, `status: 'idle'`
  - [x] Guard `selectPreset` — no-op when `status` is `running` or `paused` (with `console.warn` per architecture)
  - [x] Cold-open init: `presetMinutes: 5`, `remainingMs: 300000`, `status: 'idle'`
- [x] Create `src/timer.js` formatting helper only (AC: #1)
  - [x] Implement `formatTime(remainingMs)` → `MM:SS` string (no `setInterval` yet — Story 1.3)
  - [x] Export for use by `ui.js` via `state.js` or direct import from `ui.js` is OK for pure `formatTime` only
- [x] Create `src/ui.js` DOM bindings (AC: #1–#4)
  - [x] `initUI()` — cache DOM refs via `querySelector` (no `getElementById` required)
  - [x] Subscribe to state changes; call `render(state)` on every notification
  - [x] `handlePresetClick` — read preset minutes from `data-minutes` attribute on buttons
  - [x] `renderPresets` — toggle `.selected`, `aria-pressed`, `.disabled` class, `pointer-events: none`
  - [x] `renderCountdown` — display `formatTime(state.remainingMs)`
  - [x] `renderControls` — idle: show Let's go + Start over, hide Pause for now
  - [x] Wire click listeners on preset buttons only (control handlers stubbed or no-op until Story 1.3)
- [x] Update `index.html` (AC: #1)
  - [x] Add `data-minutes="1"` / `5` / `10` / `25` on each preset button
  - [x] Remove hardcoded `.selected` from HTML — selection driven by `ui.js` render from state
- [x] Update `src/style.css` (AC: #3)
  - [x] Add `.preset.disabled` styles: `color: var(--color-ink-disabled)`, `cursor: not-allowed`, `pointer-events: none`
- [x] Update `src/main.js` (AC: #5)
  - [x] Import and call `initUI()` from `ui.js`
  - [x] Initialize state with cold-open defaults (or export `initState()` from `state.js`)
- [x] Manual verification (AC: #1–#5)
  - [x] Tap each preset — display updates immediately
  - [x] Switch presets while idle — selection moves correctly
  - [x] Manually set state to `running` in dev — presets disabled (or verify after Story 1.3 integration)

## Dev Notes

### Story Scope Boundary — CRITICAL

| In scope (Story 1.2) | Deferred |
|------------------------|----------|
| `state.js` FSM + `selectPreset()` | `start()`, `pause()`, `reset()`, `complete()` transitions (Story 1.3–1.4) |
| `ui.js` preset click + render | Countdown ticking (Story 1.3) |
| `formatTime()` in `timer.js` | `setInterval` / `timer.start()` (Story 1.3) |
| Control visibility for **idle** state | Running/paused/complete control visibility (Story 1.3–1.4) |
| `aria-pressed` on presets | `aria-live` polish, focus order audit (Story 1.5) |
| Subscribe/notify pattern | `audio.js` (Story 1.4) |

**Do NOT** add `setInterval` in this story. **Do NOT** create `audio.js`.

### Prerequisites — Story 1.1 Must Be Complete

Assumes `simple-timer/` exists with:
- `index.html` timer markup (presets, countdown, controls)
- `src/style.css` with design tokens
- `src/main.js` importing CSS

If Story 1.1 is not implemented, run `dev-story` for 1.1 first.

### Module Import Rules (Architecture)

| Module | May import | Must NOT import |
|--------|------------|-----------------|
| `main.js` | `ui.js`, `state.js` | — |
| `state.js` | nothing yet (timer/audio in later stories) | `ui.js` |
| `timer.js` | nothing | all other modules |
| `ui.js` | `state.js` only | `timer.js`, `audio.js` |

For `formatTime`, either:
- Export from `timer.js` and import in `ui.js` (acceptable — pure function, no timer logic), OR
- Re-export via `state.js` helper

Preferred: `ui.js` imports `formatTime` from `timer.js` for display only. Architecture allows `ui.js` → `state.js` strictly for transitions; importing a pure formatter from `timer.js` is a pragmatic exception — document in code if needed.

**Alternative (architecture-pure):** put `formatTime` in `state.js` or pass formatted string from state snapshot. Cleanest per architecture: keep `formatTime` in `timer.js`; `ui.js` may import it since it's pure with no side effects.

### state.js — Canonical Pattern

```javascript
const PRESET_DURATIONS_MS = {
  1: 60_000,
  5: 300_000,
  10: 600_000,
  25: 1_500_000,
};

let state = {
  status: 'idle',
  presetMinutes: 5,
  remainingMs: PRESET_DURATIONS_MS[5],
};

const listeners = new Set();

export function getState() {
  return { ...state };
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener(getState()));
}

export function selectPreset(minutes) {
  if (state.status === 'running' || state.status === 'paused') {
    console.warn(`selectPreset ignored in ${state.status} state`);
    return;
  }
  if (!PRESET_DURATIONS_MS[minutes]) {
    console.warn(`Invalid preset: ${minutes}`);
    return;
  }
  state = {
    ...state,
    status: 'idle',
    presetMinutes: minutes,
    remainingMs: PRESET_DURATIONS_MS[minutes],
  };
  notify();
}

export function initState() {
  // Cold-open defaults already set; call notify() so ui renders
  notify();
}
```

### timer.js — formatTime Only

```javascript
export function formatTime(remainingMs) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

### ui.js — Key Responsibilities

- **initUI():** query `.preset`, `.countdown`, `.btn-primary`, `.btn-pause`, `.btn-secondary` (use specific classes)
- **render(state):** orchestrate sub-renders
- **Never** call `setInterval`, **never** mutate state directly — call `selectPreset()` only
- Preset buttons: add `data-minutes` attribute in HTML, read in handler

### index.html Changes

Add to each preset button:
```html
<button class="preset" type="button" data-minutes="1" aria-pressed="false">1 min</button>
```

Remove static `selected` class from 5 min button — state drives selection on boot.

### CSS Addition

```css
.preset.disabled {
  color: var(--color-ink-disabled);
  cursor: not-allowed;
  pointer-events: none;
}
```

Apply `.disabled` class when `state.status === 'running' || state.status === 'paused'`.

### Control Visibility — Idle State Only

| Control | Idle (this story) |
|---------|-------------------|
| Let's go | visible |
| Pause for now | hidden |
| Start over | visible |

Use `hidden` attribute or `display: none` via render function.

### Previous Story Intelligence (1.1)

- Markup lives in `index.html` — extend with `data-minutes`, do not generate DOM in JS
- Design tokens already in `:root` — use `var(--color-accent-subtle)`, etc.
- Cold-open: 5 min selected — now driven by `state.js` init, not static HTML
- `main.js` currently imports CSS only — add `initUI()` + `initState()` calls

### Testing

Manual only (NFR8):
1. Load app — 5 min selected, `05:00` displayed
2. Tap 10 min — display `10:00`, 10 min selected
3. Tap 1 min — display `01:00`, 1 min selected
4. Tap 25 min — display `25:00`, 25 min selected
5. Controls: Let's go + Start over visible, Pause hidden

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Communication-Patterns]
- [Source: _bmad-output/implementation-artifacts/1-1-initialize-project-and-visual-shell.md]

## Dev Agent Record

### Agent Model Used

Composer 2.5

### Debug Log References

None

### Completion Notes List

- Created `state.js` with subscribe/notify FSM, `selectPreset()` guards, and cold-open 5 min defaults
- Created `timer.js` with `formatTime()` pure formatter
- Created `ui.js` with preset click handlers, render functions, and idle control visibility
- Updated `index.html` with `data-minutes` attributes; selection driven by state
- Unit tests: `timer.test.js` (4 tests), `state.test.js` (10 tests) — all pass

### File List

- simple-timer/src/state.js
- simple-timer/src/timer.js
- simple-timer/src/ui.js
- simple-timer/src/main.js
- simple-timer/index.html
- simple-timer/src/style.css
- simple-timer/src/timer.test.js
- simple-timer/src/state.test.js

### Change Log

- 2026-06-17: Story 1.2 — Preset selection FSM, formatTime, and UI bindings with subscribe/notify pattern
