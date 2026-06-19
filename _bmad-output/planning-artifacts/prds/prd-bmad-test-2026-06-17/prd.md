---
title: Simple Timer App
status: final
created: 2026-06-17
updated: 2026-06-17
---

# PRD: Simple Timer App

## 0. Document Purpose

This PRD defines a minimal countdown timer for personal use and a GitHub portfolio piece. It is written for the builder (Cody) and downstream BMAD workflows (UX, architecture, epics/stories, implementation). Requirements are grouped by feature with globally numbered FRs.

## 1. Vision

A dead-simple browser timer: pick a preset, start counting down, hear a sound when time is up. No accounts, no server, no feature creep.

The app solves a personal timing need (focus blocks, breaks, quick reminders) while demonstrating clean front-end JavaScript in a portfolio repo. Success is measured by usefulness to the builder and clarity of the artifact for learning the BMAD method — not by user acquisition or revenue.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** Start a countdown in one or two actions without configuring a complex app.
- **Functional:** Know immediately when the countdown finishes, even if not staring at the screen.
- **Emotional:** Feel confident the timer is trustworthy for short personal sessions.
- **Contextual (builder):** Ship a small, readable codebase suitable for a GitHub portfolio and BMAD workflow practice.

### 2.2 Non-Users (v1)

- Teams needing shared timers, scheduling, or sync across devices.
- Users wanting Pomodoro auto-cycles, task lists, analytics, or native mobile apps.

### 2.3 Key User Journeys

- **UJ-1.** Cody opens the timer in a browser, taps a preset (e.g. 5 minutes), hits Start, and glances at the large countdown while working. When it hits zero, a completion sound plays and the Countdown Display shows `00:00` with a short “Time’s up” message. He resets or picks another preset for the next block.

- **UJ-2.** Cody pauses mid-session to answer a message, resumes when ready, and still gets the completion sound when the remaining time elapses.

## 3. Glossary

- **Timer** — The single countdown session from a chosen duration through completion or reset.
- **Preset** — A fixed-duration button (e.g. 5 minutes) that sets the Timer duration without manual entry.
- **Countdown Display** — The on-screen representation of remaining time.
- **Completion Alert** — Audible signal when the Timer reaches zero.
- **Controls** — Start, Pause, and Reset actions for the Timer.

## 4. Features

### 4.1 Preset Duration Selection

**Description:** The user selects a duration via preset buttons before or after starting a Timer. Presets replace manual time entry in v1. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Preset buttons set duration

The user can tap a Preset to set the Timer to that duration. Selecting a Preset while the Timer is idle updates the Countdown Display immediately. Realizes UJ-1.

**Consequences (testable):**
- Four Preset buttons are visible on the main screen: 1, 5, 10, and 25 minutes.
- Tapping a Preset sets remaining time to the Preset value (within one interaction).

**Out of Scope:**
- Custom numeric input or HH:MM:SS entry (deferred).
- Saving user-defined Presets (deferred).

---

### 4.2 Countdown and Controls

**Description:** The user runs a single Timer with Start, Pause, and Reset. The Countdown Display updates at least once per second while running. Only one Timer runs at a time. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-2: Start countdown

The user can start the Timer from the Controls. While running, remaining time decreases until zero or Pause. Realizes UJ-1.

**Consequences (testable):**
- Start begins decrement from the current duration (set by Preset or prior state).
- Countdown Display reflects remaining time with second-level precision while the tab is active.

#### FR-3: Pause and resume

The user can pause a running Timer and resume from the remaining time. Realizes UJ-2.

**Consequences (testable):**
- Pause stops the countdown; remaining time is preserved.
- Resume continues from the preserved remaining time, not the original Preset duration.

#### FR-4: Reset

The user can reset the Timer to the last selected Preset duration (or a clear idle state). Realizes UJ-1.

**Consequences (testable):**
- Reset stops any running countdown and returns to a predictable idle or ready state.
- After Reset, the user can Start again without re-selecting a Preset if one was already chosen.

---

### 4.3 Completion Alert

**Description:** When the Timer reaches zero, a Completion Alert plays and the Countdown Display confirms completion. Realizes UJ-1.

**Functional Requirements:**

#### FR-5: Sound on completion

The system plays a Completion Alert when remaining time reaches zero. Realizes UJ-1.

**Consequences (testable):**
- Completion Alert fires exactly once per completed countdown (no repeat loop unless user explicitly restarts).
- Countdown Display shows `00:00` and a short “Time’s up” message after completion.
- A single bundled sound asset is sufficient for v1; no sound picker required.
- If the browser blocks autoplay until user gesture, the first Start interaction unlocks audio; document behavior in README if sound fails silently.

**Out of Scope:**
- Desktop or push notifications when the tab is backgrounded (deferred).
- Volume slider or multiple alarm tones (deferred).

---

### 4.4 Presentation

**Description:** The UI stays minimal: Presets, Countdown Display, and Controls on one screen. Browser-based web app; static front-end only, no backend.

**Functional Requirements:**

#### FR-6: Single-screen layout

All core interactions are available on one view without navigation. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Presets, Countdown Display, and Controls are visible without scrolling on a typical laptop viewport.
- Countdown Display uses large, readable digits.

## 5. Non-Goals (Explicit)

- User accounts, authentication, or cloud sync.
- Backend API, database, or server-side logic.
- Pomodoro auto-cycles (work → break → work).
- Task lists, history, analytics, or gamification.
- Monetization, ads, or public-product growth features.
- Native mobile apps (iOS/Android binaries); an installable PWA is optional later, not v1.

## 6. MVP Scope

### 6.1 In Scope

- Browser countdown timer (front-end only).
- Preset duration buttons (1, 5, 10, 25 minutes).
- Start, Pause, Reset.
- Countdown Display with second precision.
- Completion sound and on-screen “Time’s up” state on zero.
- Clean, portfolio-ready repo structure.

### 6.2 Out of Scope for MVP

| Item | Reason |
|------|--------|
| Custom time input | Presets satisfy v1; keeps UI simple |
| Multiple parallel timers | Scope control |
| Notifications / background tab alerts | Browser complexity; sound sufficient for v1 |
| Dark mode / themes | Nice-to-have; not required for portfolio MVP |
| Persist settings (localStorage) | Optional polish; not blocking |
| Automated test suite | Manual verification acceptable for hobby v1; epics may add tests |

## 7. Success Metrics

**Primary**

- **SM-1:** Builder uses the timer for real personal sessions at least once per week for one month after ship. Validates FR-1 through FR-5.

**Secondary**

- **SM-2:** GitHub repo README explains what the app does and how to run it locally in under two minutes for a reviewer. Validates FR-6 and portfolio intent.

**Counter-metrics (do not optimize)**

- **SM-C1:** Feature count or lines of code — avoid scope creep to look impressive; simplicity is the goal.

## 8. Deferred to Downstream

| Item | Owner workflow | Revisit when |
|------|----------------|--------------|
| Vanilla JS vs. Vite (or similar tooling) | `bmad-create-architecture` | Architecture step |
| Visual design (colors, typography, layout detail) | `bmad-ux` | UX step |
| Epic/story breakdown | `bmad-create-epics-and-stories` | Sprint planning |
