---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prds/prd-bmad-test-2026-06-17/prd.md
  - architecture.md
  - ux-designs/ux-bmad-test-2026-06-17/DESIGN.md
  - ux-designs/ux-bmad-test-2026-06-17/EXPERIENCE.md
  - ux-designs/ux-bmad-test-2026-06-17/reconcile-prd.md
  - ux-designs/ux-bmad-test-2026-06-17/mockups/key-timer-main.html
---

# bmad-test - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-test, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The user can tap a Preset to set the Timer to that duration. Four Preset buttons are visible on the main screen: 1, 5, 10, and 25 minutes. Selecting a Preset while the Timer is idle updates the Countdown Display immediately.

FR2: The user can start the Timer from the Controls. While running, remaining time decreases until zero or Pause. Start begins decrement from the current duration. Countdown Display reflects remaining time with second-level precision while the tab is active.

FR3: The user can pause a running Timer and resume from the remaining time. Pause stops the countdown and preserves remaining time. Resume continues from the preserved remaining time, not the original Preset duration.

FR4: The user can reset the Timer to the last selected Preset duration. Reset stops any running countdown and returns to a predictable idle or ready state. After Reset, the user can Start again without re-selecting a Preset if one was already chosen.

FR5: The system plays a Completion Alert when remaining time reaches zero. Completion Alert fires exactly once per completed countdown. Countdown Display shows `00:00` and a short "Time's up" message after completion. A single bundled sound asset is sufficient for v1. If the browser blocks autoplay until user gesture, the first Start interaction unlocks audio; document behavior in README if sound fails silently.

FR6: All core interactions are available on one view without navigation. Presets, Countdown Display, and Controls are visible without scrolling on a typical laptop viewport. Countdown Display uses large, readable digits.

### NonFunctional Requirements

NFR1: Static front-end only — no backend, API, database, authentication, or server-side logic.

NFR2: Countdown updates with second-level precision while the browser tab is active; no background-tab compensation in v1.

NFR3: Completion alert fires exactly once per completed countdown (no repeat loop unless user explicitly restarts).

NFR4: Application meets accessibility floor: `aria-live="polite"` on countdown, `aria-pressed` on presets, logical focus order, 44×44px minimum interactive targets, WCAG AA contrast, reduced motion (no pulsing/bouncing/digit-flip animations).

NFR5: Primary target platform is laptop/desktop viewports (720px+ minimum width; 1280×800 canonical).

NFR6: Audio must handle browser autoplay policy gracefully — unlock on first user gesture ("Let's go"), fail silently if blocked, document behavior in README.

NFR7: Clean, portfolio-ready repository structure with readable vanilla JavaScript ES modules.

NFR8: Manual verification acceptable for v1; automated test suite not required for MVP.

NFR9: No persistence layer required for MVP (`localStorage` deferred post-MVP).

NFR10: Single timer instance only — parallel timers are not permitted.

### Additional Requirements

- **Starter Template (Epic 1 Story 1):** Scaffold Vite `vanilla` template in `simple-timer/` subdirectory: `npm create vite@latest simple-timer -- --template vanilla && cd simple-timer && npm install`. Requires Node.js 20.19+ or 22.12+.
- Application code lives in `simple-timer/` subdirectory; BMAD planning artifacts remain at repo root separately.
- Centralized finite state machine in `src/state.js` with explicit states: `idle`, `running`, `paused`, `complete`.
- Timer engine in `src/timer.js` using `setInterval` (1000ms) + `Date.now()` end-time tracking; clears interval on pause, reset, and complete.
- Module split: `main.js` (bootstrap), `state.js` (FSM hub), `timer.js` (pure timing), `ui.js` (DOM bindings), `audio.js` (HTML5 audio), `style.css` (tokens + styles).
- Subscribe/notify pattern in `state.js` for UI re-renders; no custom event bus.
- HTML5 `<audio src="/completion.mp3">` in `src/audio.js` with `unlock()` on first start and `play()` once on complete transition.
- **Sound asset prerequisite:** Acquire royalty-free `public/completion.mp3` before FR-5 acceptance; document license/attribution in README.
- Plain CSS with custom properties from DESIGN.md — no Tailwind, CSS-in-JS, or preprocessor.
- Google Fonts CDN link for Source Serif 4 in `index.html`.
- Markup lives in `index.html` only — agents must NOT generate DOM structure from JavaScript.
- Time stored internally as integer milliseconds; formatted to `MM:SS` only at display boundary.
- Module import rules enforced: `ui.js` may only import `state.js`; `timer.js` and `audio.js` are pure modules with no cross-imports to UI.
- Port UX mockup (`key-timer-main.html`) into `index.html` + `src/style.css` as composition reference.
- README with local run instructions (`npm run dev`, `npm run build`, `npm run preview`); deployment section marked TBD.
- Default Vite `base: '/'` — GitHub Pages hosting and CI/CD deferred.
- Invalid state transitions: `console.warn` in dev, ignore transition (no throw). Missing DOM element: `console.error` at init, fail fast.
- Cold-open default: 5 min Preset pre-selected, display shows `05:00` [ASSUMPTION per UX — implementer logs choice in commit or README].

### UX Design Requirements

UX-DR1: Implement all color design tokens from DESIGN.md as CSS custom properties at `:root` (surface-base, surface-raised, surface-muted, ink-primary, ink-secondary, ink-disabled, accent, accent-hover, accent-subtle, border-hairline, focus-ring).

UX-DR2: Implement typography tokens — Source Serif 4 (Google Fonts CDN) for Countdown Display and completion message; system sans for Preset labels and Controls.

UX-DR3: Implement spacing scale tokens (`--spacing-1` through `--spacing-8`, gutter, card-padding) as CSS custom properties.

UX-DR4: Implement border-radius tokens (`--rounded-sm`, `--rounded-md`, `--rounded-lg`) as CSS custom properties.

UX-DR5: Build Timer Card component per DESIGN.md spec: raised white surface on warm-paper canvas, hairline border, lg radius, 48px padding, 480px max-width, centered on page.

UX-DR6: Build Preset Button component with four fixed options (1, 5, 10, 25 min) and four visual states: default, selected (accent-subtle fill + accent border), disabled (ink-disabled text, no pointer while running/paused), hover (surface-muted background, idle only).

UX-DR7: Build Countdown Display component showing `MM:SS` with `font-variant-numeric: tabular-nums` and responsive `clamp()` scaling (~64px–96px).

UX-DR8: Build Completion Message component (display-meta typography, accent color) visible only in complete state; copy "Time's up!".

UX-DR9: Build primary Control ("Let's go") with accent background, accent-hover on hover, visible when idle (after Preset) or paused, hidden while running.

UX-DR10: Build secondary Controls ("Pause for now", "Start over") with secondary styling — Pause visible only while running; Start over visible in idle, paused, and complete states.

UX-DR11: Implement single-screen centered column layout with vertical rhythm: Preset row → 48px gap → Countdown Display → 16px gap (message slot) → 48px gap → Control row; Preset/Control rows use horizontal flex with 12px gap.

UX-DR12: Ensure all zones visible without scrolling at 1280×800 and 1440×900 viewports (FR-6).

UX-DR13: Implement UI treatment for all five UX states: cold open, preset selected (idle), running, paused, complete — matching EXPERIENCE.md State Patterns table.

UX-DR14: Disable Preset buttons while timer is running or paused; re-enable on reset or completion.

UX-DR15: Enforce control visibility rules per state: Let's go (idle/paused), Pause for now (running only), Start over (idle/paused/complete); Let's go hidden while running and on complete.

UX-DR16: Use EXPERIENCE.md microcopy verbatim for visible and accessible labels: "Let's go", "Pause for now", "Start over", "1 min" / "5 min" / "10 min" / "25 min", "Time's up!".

UX-DR17: Implement idle hint "Pick a time to get started" below digits before first Preset tap; fades once Preset selected [ASSUMPTION].

UX-DR18: Implement focus order: Presets (left → right) → Let's go → Pause for now (when visible) → Start over.

UX-DR19: Apply `aria-pressed` to selected Preset button; `aria-live="polite"` on Countdown Display container; accessible names match visible copy.

UX-DR20: Ensure 44×44px minimum hit area on all interactive elements (Presets and Controls).

UX-DR21: No pulsing, bouncing, or digit-flip animations — state changes are instant opacity/content swaps (reduced motion).

UX-DR22: Visible keyboard focus ring using `--color-focus-ring` (#B8864E) on all focusable controls.

UX-DR23: Depth via tonal contrast (hairline border, no box-shadow by default); subtle card shadow permitted only if border contrast proves insufficient.

UX-DR24: Default cold-open state: 5 min Preset selected, display shows `05:00`, Let's go enabled [ASSUMPTION].

### FR Coverage Map

FR1: Epic 1 — Preset duration selection (1, 5, 10, 25 min)
FR2: Epic 1 — Start countdown with second precision
FR3: Epic 1 — Pause and resume from preserved time
FR4: Epic 1 — Reset to last selected preset
FR5: Epic 1 — Completion sound + `00:00` + "Time's up!" message
FR6: Epic 1 — Single-screen layout with large readable digits

## Epic List

### Epic 1: Focus Timer Experience

Cody can open the timer in a browser, pick a preset duration, run a countdown with pause/resume and reset, and get a clear visual and audible alert when time is up — all on a single warm, accessible screen.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 2: Portfolio & Developer Experience

Cody and GitHub reviewers can clone the repo, run the app locally in under two minutes, and understand what the app does — including sound licensing and browser autoplay behavior.

**FRs covered:** None directly (supports PRD success metric SM-2)

## Epic 1: Focus Timer Experience

Cody can open the timer in a browser, pick a preset duration, run a countdown with pause/resume and reset, and get a clear visual and audible alert when time is up — all on a single warm, accessible screen.

### Story 1.1: Initialize Project and Visual Shell

As Cody,
I want a runnable project with the timer screen matching the UX mockup,
So that I have a solid visual foundation to build timer behavior on.

**Acceptance Criteria:**

**Given** the repository has no `simple-timer/` application yet
**When** the developer scaffolds the Vite vanilla template (`npm create vite@latest simple-timer -- --template vanilla`) and runs `npm install`
**Then** `npm run dev` starts a local dev server without errors
**And** the project structure matches architecture: `index.html`, `src/main.js`, `src/style.css`, `public/`, `vite.config.js`, `package.json`

**Given** the dev server is running
**When** Cody opens the app in a browser at a laptop viewport (1280×800)
**Then** a single-screen timer layout is visible without scrolling: Preset row, Countdown Display, and Control row inside a centered timer card
**And** markup is ported from `key-timer-main.html` into `index.html` (no DOM generation from JavaScript)

**Given** the visual shell is rendered
**When** inspecting `src/style.css`
**Then** all DESIGN.md color, spacing, typography, and border-radius tokens are defined as CSS custom properties at `:root`
**And** Source Serif 4 is loaded via Google Fonts CDN link in `index.html`

**Given** the app loads on cold open
**When** no interaction has occurred
**Then** the 5 min Preset appears selected, the Countdown Display shows `05:00`, and control buttons use EXPERIENCE.md microcopy ("Let's go", "Pause for now", "Start over")
**And** preset labels read "1 min", "5 min", "10 min", "25 min"

**Given** a typical laptop viewport
**When** viewing at 1280×800 or 1440×900
**Then** all zones (Presets, Countdown Display, Controls) are visible without scrolling (FR6, UX-DR12)
**And** the Countdown Display uses large serif digits with `font-variant-numeric: tabular-nums` and responsive `clamp()` scaling (UX-DR7)

### Story 1.2: Select a Preset Duration

As Cody,
I want to tap a preset button to set my focus block duration,
So that I can start a countdown in one or two actions without manual time entry.

**Acceptance Criteria:**

**Given** the timer is in idle state
**When** Cody taps a Preset button (1, 5, 10, or 25 min)
**Then** the Countdown Display immediately updates to the full preset duration in `MM:SS` format (e.g. `05:00` for 5 min)
**And** the tapped Preset shows selected styling (accent-subtle fill, accent border) with `aria-pressed="true"`; other presets show `aria-pressed="false"` (FR1, UX-DR6)

**Given** a Preset is selected
**When** Cody taps a different Preset while idle
**Then** the display updates to the new duration and selection moves to the new Preset
**And** the previously selected Preset returns to default styling

**Given** the timer is running or paused
**When** Cody attempts to tap a Preset
**Then** Preset buttons are disabled (ink-disabled text, no pointer interaction)
**And** the current duration and state are unchanged (UX-DR14)

**Given** the timer is idle with a Preset selected
**When** Cody views the Controls
**Then** "Let's go" and "Start over" are visible; "Pause for now" is hidden (UX-DR15)

**Given** `src/state.js` exists
**When** a Preset is selected
**Then** `state.js` records `presetMinutes` and `remainingMs` (stored as integer milliseconds internally)
**And** `ui.js` subscribes to state changes via the subscribe/notify pattern and re-renders without direct timer logic (architecture module boundaries)

### Story 1.3: Run, Pause, and Reset Countdown

As Cody,
I want to start, pause, resume, and reset my countdown,
So that I can manage focus sessions and handle interruptions without losing remaining time.

**Acceptance Criteria:**

**Given** a Preset is selected and the timer is idle
**When** Cody taps "Let's go"
**Then** the countdown begins decrementing from the current duration with second-level precision while the tab is active (FR2, NFR2)
**And** the Countdown Display updates each second; "Pause for now" becomes visible; "Let's go" is hidden; Presets are disabled

**Given** the timer is running
**When** Cody taps "Pause for now"
**Then** the countdown stops and the remaining time is preserved on the display (e.g. `06:42` stays `06:42`) (FR3)
**And** "Let's go" and "Start over" become visible; "Pause for now" is hidden; Presets remain disabled

**Given** the timer is paused with remaining time preserved
**When** Cody taps "Let's go"
**Then** the countdown resumes from the preserved remaining time, not the original Preset duration (FR3)
**And** the display continues decrementing from where it paused

**Given** the timer is running, paused, or complete
**When** Cody taps "Start over"
**Then** any active countdown stops and the display returns to the last selected Preset's full duration (FR4)
**And** the timer returns to idle state with the Preset still selected; Cody can tap "Let's go" again without re-selecting a Preset

**Given** `src/timer.js` implements the countdown engine
**When** inspecting the implementation
**Then** timing uses `setInterval` (1000ms) with `Date.now()` end-time tracking; interval is cleared on pause, reset, and complete
**And** `setInterval` appears only in `timer.js`; time is stored as milliseconds internally and formatted to `MM:SS` at the display boundary

**Given** `src/state.js` manages application state
**When** inspecting state transitions
**Then** explicit states exist: `idle`, `running`, `paused`, `complete`
**And** all state changes go through named transition functions; `ui.js` calls transitions only and does not manage intervals directly

**Given** only one timer instance is permitted
**When** the timer is running
**Then** no action can start a parallel countdown (NFR10)

### Story 1.4: Completion Alert

As Cody,
I want to hear a sound and see a clear message when my countdown finishes,
So that I know my focus block ended even if I'm not watching the screen.

**Acceptance Criteria:**

**Given** the timer is running
**When** remaining time reaches zero
**Then** the Countdown Display shows `00:00` and a "Time's up!" message appears below the digits in accent color (FR5, UX-DR8)
**And** the timer transitions to `complete` state; "Start over" is visible; "Let's go" and "Pause for now" are hidden; Presets are re-enabled

**Given** the timer reaches zero
**When** the completion handler fires
**Then** a Completion Alert sound plays exactly once (no repeat loop) (FR5, NFR3)
**And** a royalty-free `completion.mp3` exists in `public/` with license/attribution noted for README (architecture sound asset prerequisite)

**Given** `src/audio.js` wraps an HTML5 `<audio>` element
**When** Cody taps "Let's go" for the first time in a session
**Then** `audio.unlock()` is called to satisfy browser autoplay gesture requirements (NFR6)
**And** if autoplay is blocked or the asset is missing, the app fails silently with no on-screen error banner; visual completion remains the primary signal

**Given** the timer is in complete state
**When** Cody taps "Start over" or selects a new Preset
**Then** the completion message hides, the display shows the appropriate preset duration, and the timer returns to idle
**And** a subsequent completed countdown plays the sound again exactly once

### Story 1.5: Accessibility and UX State Polish

As Cody,
I want the timer to work with keyboard navigation and screen readers,
So that the app meets a portfolio-quality accessibility floor and all interaction states feel polished.

**Acceptance Criteria:**

**Given** the Countdown Display is updating
**When** a screen reader is active
**Then** the countdown container uses `aria-live="polite"` and announces time changes without interrupting the user (NFR4, UX-DR19)

**Given** focusable controls are on the page
**When** navigating by keyboard (Tab / Shift+Tab)
**Then** focus order is: Presets (left → right) → "Let's go" → "Pause for now" (when visible) → "Start over" (UX-DR18)
**And** each control has a visible focus ring using `--color-focus-ring` (#B8864E) (UX-DR22)

**Given** any interactive element (Presets, Controls)
**When** measuring hit area
**Then** each target is at least 44×44px (UX-DR20, NFR4)

**Given** the app loads before any Preset interaction
**When** Cody views the idle state
**Then** an idle hint "Pick a time to get started" appears below the digits and hides after the first Preset tap (UX-DR17)
**And** if scope is tight, implementer may omit hint and document the decision in README

**Given** state transitions occur (idle → running → paused → complete)
**When** observing the UI
**Then** changes are instant with no pulsing, bouncing, or digit-flip animations (UX-DR21, NFR4)
**And** control visibility and Preset disabled states match the EXPERIENCE.md State Patterns table for all five states: cold open, idle, running, paused, complete (UX-DR13)

**Given** all five UX states are implemented
**When** manually testing cold open, preset selection, running, paused, and complete flows
**Then** rendered UI structure and tokens match `mockups/key-timer-main.html` as composition reference
**And** text contrast meets WCAG AA for ink-primary on surface-raised and accent on surface-raised (NFR4)

## Epic 2: Portfolio & Developer Experience

Cody and GitHub reviewers can clone the repo, run the app locally in under two minutes, and understand what the app does — including sound licensing and browser autoplay behavior.

### Story 2.1: Portfolio README

As a GitHub reviewer,
I want clear documentation on how to run and understand the timer,
So that I can evaluate the project quickly without guessing.

**Acceptance Criteria:**

**Given** the `simple-timer/` application is functional
**When** a reviewer opens `simple-timer/README.md`
**Then** it explains what the app does in plain language (countdown timer with presets, pause/reset, completion alert)
**And** local run instructions are present: `npm install`, `npm run dev`, `npm run build`, `npm run preview` (SM-2, NFR7)

**Given** a reviewer follows the README
**When** they run the documented commands from the `simple-timer/` directory
**Then** the app starts locally without undocumented steps
**And** a new reviewer can go from clone to running app in under two minutes on a machine with Node.js 20.19+ installed

**Given** `public/completion.mp3` is bundled
**When** reading the README
**Then** sound asset license and attribution are documented (source, license type, any required credit)
**And** browser autoplay behavior is explained: first "Let's go" unlocks audio; silent fail if blocked (NFR6)

**Given** deployment is deferred per architecture
**When** reading the README
**Then** a deployment section is present marked TBD (no GitHub Pages or CI/CD instructions required for v1)
**And** the repo structure clearly separates BMAD planning artifacts (`_bmad-output/`) from application code (`simple-timer/`)

**Given** v1 accepts manual verification
**When** reviewing documentation
**Then** README includes a brief manual test checklist covering all five UX states (idle, running, paused, complete, preset selection)
**And** no automated test suite is required (NFR8)

