# Story 1.4: Completion Alert

baseline_commit: NO_VCS

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Cody,
I want to hear a sound and see a clear message when my countdown finishes,
so that I know my focus block ended even if I'm not watching the screen.

## Acceptance Criteria

1. **Given** the timer is running  
   **When** remaining time reaches zero  
   **Then** the Countdown Display shows `00:00` and a "Time's up!" message appears below the digits in accent color (FR5, UX-DR8)  
   **And** the timer transitions to `complete` state; "Start over" is visible; "Let's go" and "Pause for now" are hidden; Presets are re-enabled

2. **Given** the timer reaches zero  
   **When** the completion handler fires  
   **Then** a Completion Alert sound plays exactly once (no repeat loop) (FR5, NFR3)  
   **And** a royalty-free `completion.mp3` exists in `public/` with license/attribution noted for README (architecture sound asset prerequisite)

3. **Given** `src/audio.js` wraps an HTML5 `<audio>` element  
   **When** Cody taps "Let's go" for the first time in a session  
   **Then** `audio.unlock()` is called to satisfy browser autoplay gesture requirements (NFR6)  
   **And** if autoplay is blocked or the asset is missing, the app fails silently with no on-screen error banner; visual completion remains the primary signal

4. **Given** the timer is in complete state  
   **When** Cody taps "Start over" or selects a new Preset  
   **Then** the completion message hides, the display shows the appropriate preset duration, and the timer returns to idle  
   **And** a subsequent completed countdown plays the sound again exactly once

## Tasks / Subtasks

- [x] Acquire and add sound asset (AC: #2)
  - [x] Source royalty-free chime MP3 (Mixkit, Freesound CC0, or similar)
  - [x] Place at `simple-timer/public/completion.mp3`
  - [x] Note source + license in code comment for README (Story 2.1)
  - [x] Warm, calm chime — not harsh alarm (per architecture)
- [x] Create `src/audio.js` (AC: #2, #3)
  - [x] Create `<audio src="/completion.mp3" preload="auto">` (or use existing element from HTML)
  - [x] `unlock()` — call `audio.play()` then immediate `audio.pause()` + `audio.currentTime = 0` on first user gesture
  - [x] `play()` — play once; catch errors silently (no throw, no UI error)
  - [x] No imports from other modules (pure audio module)
- [x] Wire audio in `src/state.js` (AC: #3, #4)
  - [x] Import `audio.js` in `state.js` (allowed)
  - [x] Call `audio.unlock()` in `start()` on every start (idempotent) OR track `audioUnlocked` flag — first start only is sufficient
  - [x] Call `audio.play()` in `complete()` transition only
  - [x] Ensure `complete()` stops timer, sets `remainingMs: 0`, `status: 'complete'`
- [x] Update `src/ui.js` completion rendering (AC: #1, #4)
  - [x] `renderCompletionMessage(state)` — show when `status === 'complete'`, hide otherwise
  - [x] Set `visibility: visible` + remove `aria-hidden` on complete; reverse on idle
  - [x] `renderControls` — complete: only Start over visible; presets enabled
  - [x] `selectPreset()` from complete → idle with new duration (already in state.js if complete allows selectPreset)
- [x] Update `src/state.js` selectPreset for complete state (AC: #4)
  - [x] Allow `selectPreset()` when `status === 'complete'` — transition to idle with new preset
- [x] Update `index.html` if needed (AC: #1)
  - [x] Completion message element: `<div class="completion" aria-hidden="true">Time's up!</div>`
- [x] Manual verification (AC: #1–#4)
  - [x] Run 1 min timer to zero — `00:00`, message visible, sound plays once
  - [x] Start over — message hides, preset duration restored
  - [x] Complete again — sound plays once more
  - [x] Select preset from complete — message hides, new duration shown
  - [x] Test with blocked autoplay (fresh tab, never clicked) — visual still works

## Dev Notes

### Story Scope Boundary — CRITICAL

| In scope (Story 1.4) | Deferred |
|------------------------|----------|
| `audio.js` + `completion.mp3` | README license docs (Story 2.1) |
| Completion message UI | Idle hint (Story 1.5) |
| `audio.unlock()` on start | Full a11y audit (Story 1.5) |
| Complete state polish | |

### Prerequisites

- Story 1.3: `complete()` transition, timer engine, control visibility

### Sound Asset Acquisition

**Required before FR-5 acceptance.** Suggested sources:
- [Mixkit](https://mixkit.co/free-sound-effects/) — free license
- [Freesound](https://freesound.org) — filter CC0
- Original recording

Place: `simple-timer/public/completion.mp3`  
Reference in code: `/completion.mp3` (Vite public path)

Document in file header comment:
```javascript
// Sound: [source name] — [license type]
// Attribution for README (Story 2.1)
```

### audio.js — Implementation

```javascript
const audio = new Audio('/completion.mp3');
audio.preload = 'auto';

let unlocked = false;

export function unlock() {
  if (unlocked) return;
  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      unlocked = true;
    })
    .catch(() => {
      // Silent fail — browser autoplay policy
    });
}

export function play() {
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Silent fail — visual completion is primary signal
  });
}
```

**No imports.** Pure module per architecture.

### state.js Changes

```javascript
import * as audio from './audio.js';

export function start() {
  // ... existing guards ...
  audio.unlock();
  timer.start(state.remainingMs, onTick, onTimerComplete);
  // ...
}

export function complete() {
  timer.stop();
  state = { ...state, status: 'complete', remainingMs: 0 };
  audio.play();
  notify();
}

export function selectPreset(minutes) {
  if (state.status === 'running' || state.status === 'paused') {
    console.warn(`selectPreset ignored in ${state.status}`);
    return;
  }
  // Allow idle AND complete
  // ...
}
```

### ui.js — Completion Message

```javascript
function renderCompletionMessage(state) {
  const el = document.querySelector('.completion');
  if (state.status === 'complete') {
    el.style.visibility = 'visible';
    el.setAttribute('aria-hidden', 'false');
  } else {
    el.style.visibility = 'hidden';
    el.setAttribute('aria-hidden', 'true');
  }
}
```

Copy must be verbatim: **Time's up!** (with exclamation per EXPERIENCE.md)

### Complete State — Full UI Matrix

| Element | Complete state |
|---------|----------------|
| Countdown | `00:00` |
| Completion message | visible, accent color |
| Let's go | hidden |
| Pause for now | hidden |
| Start over | visible |
| Presets | enabled (tap selects new idle duration) |

### NFR3 — Play Exactly Once

- No `loop` attribute on audio
- `play()` called once per `complete()` transition
- Reset `audio.currentTime = 0` before each play

### NFR6 — Autoplay Policy

- First "Let's go" unlocks audio context
- If blocked: no error banner, visual completion still fires
- README documents behavior (Story 2.1)

### Previous Story Intelligence

- `complete()` may be stubbed from Story 1.3 — extend with `audio.play()`
- `reset()` already returns to idle — ensure completion message hides via render
- Control visibility matrix from 1.3 — update complete row

### CSS — Completion Message (from Story 1.1)

Should already exist:
```css
.completion {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: var(--font-size-display-meta);
  visibility: hidden;
  min-height: 28px;
}
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/EXPERIENCE.md#Voice-and-Tone]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/DESIGN.md#Completion-message]
- [Source: _bmad-output/implementation-artifacts/1-3-run-pause-and-reset-countdown.md]

## Dev Agent Record

### Agent Model Used

Composer 2.5

### Debug Log References

None

### Completion Notes List

- Added Mixkit bell notification MP3 to `public/completion.mp3` with license comment
- Created `audio.js` with idempotent `unlock()` and silent-fail `play()`
- Wired `audio.unlock()` in `start()` and `audio.play()` in `complete()`
- `renderCompletionMessage()` toggles visibility and aria-hidden per state
- `selectPreset()` allowed from complete state; unit test verifies transition

### File List

- simple-timer/public/completion.mp3
- simple-timer/src/audio.js
- simple-timer/src/state.js
- simple-timer/src/ui.js
- simple-timer/src/state.test.js

### Change Log

- 2026-06-17: Story 1.4 — Completion alert with audio playback and message visibility
