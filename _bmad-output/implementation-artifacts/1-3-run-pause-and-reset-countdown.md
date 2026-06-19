# Story 1.3: Run, Pause, and Reset Countdown

baseline_commit: NO_VCS

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Cody,
I want to start, pause, resume, and reset my countdown,
so that I can manage focus sessions and handle interruptions without losing remaining time.

## Acceptance Criteria

1. **Given** a Preset is selected and the timer is idle  
   **When** Cody taps "Let's go"  
   **Then** the countdown begins decrementing from the current duration with second-level precision while the tab is active (FR2, NFR2)  
   **And** the Countdown Display updates each second; "Pause for now" becomes visible; "Let's go" is hidden; Presets are disabled

2. **Given** the timer is running  
   **When** Cody taps "Pause for now"  
   **Then** the countdown stops and the remaining time is preserved on the display (e.g. `06:42` stays `06:42`) (FR3)  
   **And** "Let's go" and "Start over" become visible; "Pause for now" is hidden; Presets remain disabled

3. **Given** the timer is paused with remaining time preserved  
   **When** Cody taps "Let's go"  
   **Then** the countdown resumes from the preserved remaining time, not the original Preset duration (FR3)  
   **And** the display continues decrementing from where it paused

4. **Given** the timer is running, paused, or complete  
   **When** Cody taps "Start over"  
   **Then** any active countdown stops and the display returns to the last selected Preset's full duration (FR4)  
   **And** the timer returns to idle state with the Preset still selected; Cody can tap "Let's go" again without re-selecting a Preset

5. **Given** `src/timer.js` implements the countdown engine  
   **When** inspecting the implementation  
   **Then** timing uses `setInterval` (1000ms) with `Date.now()` end-time tracking; interval is cleared on pause, reset, and complete  
   **And** `setInterval` appears only in `timer.js`; time is stored as milliseconds internally and formatted to `MM:SS` at the display boundary

6. **Given** `src/state.js` manages application state  
   **When** inspecting state transitions  
   **Then** explicit states exist: `idle`, `running`, `paused`, `complete`  
   **And** all state changes go through named transition functions; `ui.js` calls transitions only and does not manage intervals directly

7. **Given** only one timer instance is permitted  
   **When** the timer is running  
   **Then** no action can start a parallel countdown (NFR10)

## Tasks / Subtasks

- [x] Implement countdown engine in `src/timer.js` (AC: #5)
  - [x] `start(remainingMs, onTick, onComplete)` — set `endTime = Date.now() + remainingMs`, start 1000ms interval
  - [x] `pause()` — clear interval, return current `remainingMs` from `endTime - Date.now()`
  - [x] `stop()` — clear interval, reset internal refs
  - [x] `onTick` callback receives `remainingMs`; `onComplete` fires when `remainingMs <= 0`
  - [x] **Grep check:** `setInterval` must appear ONLY in `timer.js`
- [x] Add state transitions in `src/state.js` (AC: #4, #6, #7)
  - [x] `start()` — from `idle` or `paused`; call `timer.start()`; set `status: 'running'`
  - [x] `pause()` — from `running`; call `timer.pause()`; update `remainingMs`; set `status: 'paused'`
  - [x] `reset()` — from `running`, `paused`, or `complete`; call `timer.stop()`; restore `remainingMs` from `PRESET_DURATIONS_MS[presetMinutes]`; set `status: 'idle'`
  - [x] `onTick(remainingMs)` — update `remainingMs` in state, `notify()`
  - [x] `onTimerComplete()` — stub transition to `complete` OR minimal `complete()` that sets `status: 'complete'`, `remainingMs: 0` (Story 1.4 adds audio + message UI)
  - [x] Guard invalid transitions with `console.warn`, no throw
  - [x] Import `timer.js` in `state.js` (allowed per architecture)
- [x] Wire control handlers in `src/ui.js` (AC: #1–#4)
  - [x] `handleLetsGoClick` → `start()`
  - [x] `handlePauseClick` → `pause()`
  - [x] `handleStartOverClick` → `reset()`
  - [x] `renderControls(state)` — full visibility matrix (see Dev Notes)
  - [x] `renderPresets` — disabled when running/paused/complete
- [x] Manual verification (AC: #1–#7)
  - [x] Start 5 min — ticks down each second
  - [x] Pause at arbitrary time — display frozen
  - [x] Resume — continues from paused time, not 5:00
  - [x] Start over while running — returns to preset duration, idle
  - [x] Start over while paused — same
  - [x] Cannot start second countdown while running

## Dev Notes

### Story Scope Boundary — CRITICAL

| In scope (Story 1.3) | Deferred to Story 1.4 |
|------------------------|----------------------|
| `timer.js` full engine | `audio.js` + `completion.mp3` |
| `start()`, `pause()`, `reset()` | `audio.unlock()` on first start |
| `complete` state transition (minimal) | "Time's up!" message visibility |
| Control visibility all states | Completion sound playback |
| Preset disable while running/paused | Preset re-enable on complete (wire in 1.4 if complete stubbed) |

If implementing minimal `complete()` here, set `remainingMs: 0`, `status: 'complete'`, stop timer — Story 1.4 adds message + audio.

### Prerequisites

- Story 1.1: visual shell
- Story 1.2: `state.js`, `ui.js`, `selectPreset()`, `formatTime()`

### timer.js — End-Time Pattern

```javascript
const TICK_INTERVAL_MS = 1000;
let intervalId = null;
let endTime = null;

export function start(remainingMs, onTick, onComplete) {
  stop();
  endTime = Date.now() + remainingMs;
  intervalId = setInterval(() => {
    const remaining = Math.max(0, endTime - Date.now());
    onTick(remaining);
    if (remaining <= 0) {
      stop();
      onComplete();
    }
  }, TICK_INTERVAL_MS);
  onTick(remainingMs); // immediate first tick
}

export function pause() {
  if (!intervalId) return endTime ? Math.max(0, endTime - Date.now()) : 0;
  const remaining = Math.max(0, endTime - Date.now());
  stop();
  return remaining;
}

export function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  endTime = null;
}
```

### state.js — Transition Functions

```javascript
import * as timer from './timer.js';

function onTick(remainingMs) {
  state = { ...state, remainingMs };
  notify();
}

function onTimerComplete() {
  complete(); // implement complete() — minimal for 1.3, extended in 1.4
}

export function start() {
  if (state.status !== 'idle' && state.status !== 'paused') {
    console.warn(`start ignored in ${state.status}`);
    return;
  }
  timer.start(state.remainingMs, onTick, onTimerComplete);
  state = { ...state, status: 'running' };
  notify();
}

export function pause() {
  if (state.status !== 'running') return;
  const remainingMs = timer.pause();
  state = { ...state, status: 'paused', remainingMs };
  notify();
}

export function reset() {
  timer.stop();
  state = {
    ...state,
    status: 'idle',
    remainingMs: PRESET_DURATIONS_MS[state.presetMinutes],
  };
  notify();
}

export function complete() {
  timer.stop();
  state = { ...state, status: 'complete', remainingMs: 0 };
  notify();
}
```

**Note:** Do NOT call `audio.unlock()` here — Story 1.4 adds that in `start()`.

### Control Visibility Matrix (ui.js renderControls)

| State | Let's go | Pause for now | Start over | Presets |
|-------|----------|---------------|------------|---------|
| idle | visible | hidden | visible | enabled |
| running | hidden | visible | visible | disabled |
| paused | visible | hidden | visible | disabled |
| complete | hidden | hidden | visible | enabled* |

*Complete preset re-enable: if `complete()` stubbed in 1.3, enable presets on complete state.

### ui.js — Handler Pattern

```javascript
import { start, pause, reset, selectPreset, subscribe, initState } from './state.js';

function handleLetsGoClick() {
  start();
}

function handlePauseClick() {
  pause();
}

function handleStartOverClick() {
  reset();
}
```

**Never** call `setInterval` from `ui.js`.

### NFR10 — Single Timer Instance

`start()` guard prevents parallel countdowns. `timer.stop()` called before any new `timer.start()`.

### NFR2 — Active Tab Only

No background-tab compensation. `setInterval` may drift when tab inactive — acceptable per PRD.

### Previous Story Intelligence

- `selectPreset()` already guards running/paused states
- `formatTime()` in `timer.js` — reuse for display
- `data-minutes` on preset buttons from Story 1.2
- Subscribe/notify pattern established — extend `render()` for new control states

### Anti-Patterns — DO NOT

```javascript
// BAD — interval in ui.js
setInterval(() => updateDisplay(), 1000);

// BAD — ui calls timer directly
import * as timer from './timer.js';

// BAD — storing time as seconds
const remaining = 300;
```

### Verification Grep

```bash
grep -r "setInterval" simple-timer/src/
# Expected: only simple-timer/src/timer.js
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/EXPERIENCE.md#State-Patterns]
- [Source: _bmad-output/implementation-artifacts/1-2-select-a-preset-duration.md]

## Dev Agent Record

### Agent Model Used

Composer 2.5

### Debug Log References

None

### Completion Notes List

- Extended `timer.js` with end-time tracking countdown engine (`start`, `pause`, `stop`)
- Added `start()`, `pause()`, `reset()`, `complete()` transitions in `state.js` with guards
- Wired control handlers in `ui.js` with full visibility matrix for all four states
- Verified `setInterval` appears only in `timer.js` via grep
- State transition unit tests cover start/pause/reset/complete guards

### File List

- simple-timer/src/timer.js
- simple-timer/src/state.js
- simple-timer/src/ui.js
- simple-timer/src/state.test.js

### Change Log

- 2026-06-17: Story 1.3 — Countdown engine with start/pause/reset/complete state transitions
