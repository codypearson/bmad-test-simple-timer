---
name: Simple Timer
status: final
created: 2026-06-17
updated: 2026-06-17
sources:
  - ../../prds/prd-bmad-test-2026-06-17/prd.md
---

# Simple Timer — Experience Spine

> Single-surface browser web app. Laptop/desktop primary. Light warm-paper visual identity in `DESIGN.md`. Hobby / portfolio / BMAD learning posture.

## Foundation

**Form-factor:** Browser web app (static front-end). Single view — no routing, no modals, no navigation chrome.

**Viewport:** Laptop and desktop widths (720px+ design target; 1280×800 canonical). Mobile layouts deferred.

**UI system:** None named. Vanilla HTML/CSS/JS implementation expected downstream. `DESIGN.md` owns visual tokens; this spine owns behavior, states, and copy.

**Theme:** Light only (v1). Dark mode explicitly out of scope per PRD.

## Information Architecture

One surface delivers every v1 need. Surface closure: all FRs map here; no orphan requirements.

| Surface | Reached from | Purpose |
|---|---|---|
| Timer (main) | Browser open / bookmark | Preset selection, Countdown Display, Controls, Completion Alert trigger |

**Zones on Timer (top → bottom):**

| Zone | PRD term | Delivers |
|---|---|---|
| Preset row | Preset | FR-1 — duration selection (1, 5, 10, 25 min) |
| Countdown Display | Countdown Display | FR-2, FR-4, FR-5 — remaining time + completion |
| Completion message | (completion UI) | FR-5 — "Time's up!" confirmation |
| Control row | Controls | FR-2, FR-3, FR-4 — Let's go, Pause for now, Start over |

→ Composition reference: `mockups/key-timer-main.html`. Spine wins on conflict.

## Voice and Tone

Microcopy. Brand posture lives in `DESIGN.md` Brand & Style.

Friendly and warm — short, human phrases. No exclamation spam; one exclamation on completion is enough.

| Element | Copy | Notes |
|---|---|---|
| Primary control (idle / paused) | Let's go | Replaces utilitarian "Start" |
| Pause control | Pause for now | Visible only while running |
| Reset control | Start over | Returns to last selected Preset duration |
| Preset labels | 1 min · 5 min · 10 min · 25 min | Lowercase "min"; no "minutes" |
| Completion message | Time's up! | Shown with `00:00`; satisfies PRD "Time's up" with warm punctuation |
| [ASSUMPTION] Idle hint | Pick a time to get started | Shown below digits only before first Preset tap; fades once Preset selected |

| Do | Don't |
|---|---|
| "Let's go" | "START" (all caps) |
| "Pause for now" | "HOLD" or icon-only pause |
| "Time's up!" | "ALERT" / "ERROR" / alarm language |
| Warm, brief | Streak praise, guilt, or productivity coaching |

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md` Components.

| Component | PRD term | Behavioral rules |
|---|---|---|
| Preset button | Preset | Tap sets duration immediately when idle. While running or paused, Presets are disabled until Reset or completion. Selecting a Preset updates Countdown Display to full duration without starting. Four fixed options: 1, 5, 10, 25 minutes. |
| Countdown Display | Countdown Display | Shows `MM:SS` with second precision while tab active (FR-2). Single Timer instance — only one countdown at a time. Announces changes to assistive tech via `aria-live="polite"`. |
| Completion message | Completion Alert (on-screen) | Appears when remaining time hits zero. Stays until user taps Start over or a Preset. Audible Completion Alert fires once per completion (FR-5). |
| Control — Let's go | Controls (Start) | Starts decrement from current duration. First click unlocks audio context if browser requires gesture. Hidden while running; returns when paused. |
| Control — Pause for now | Controls (Pause) | Stops decrement; preserves remaining time (FR-3). Only visible while running. |
| Control — Start over | Controls (Reset) | Stops countdown; restores last selected Preset duration to display (FR-4). Does not clear Preset selection. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold open | Timer | Countdown shows `05:00` [ASSUMPTION: default highlight 5 min Preset selected] or `00:00` with idle hint — implementer picks; log recommends 5 min pre-selected as sensible default. Let's go enabled. |
| Preset selected (idle) | Timer | Selected Preset visually marked. Display shows full Preset duration. Let's go + Start over available. |
| Running | Timer | Display ticks down each second. Pause for now visible. Let's go hidden. Presets disabled. |
| Paused | Timer | Display frozen on remaining time. Let's go + Start over visible. Pause for now hidden. Presets disabled. |
| Complete | Timer | Display `00:00`. Completion message "Time's up!" visible in `{colors.accent}`. Completion Alert sound plays once. Let's go hidden. Start over visible. Presets enabled — tapping a Preset starts fresh idle selection. |
| Audio blocked | Timer | [ASSUMPTION] If autoplay blocked before first Let's go, sound fails silently until gesture unlocks; README documents behavior per FR-5. No on-screen error banner in v1. |

## Interaction Primitives

- **Click / tap** — sole input modality in v1. No keyboard shortcuts required; focusable controls with visible `{colors.focus-ring}` outline for keyboard users.
- **Single Timer** — starting a new countdown while one runs is impossible; Controls gate transitions.
- **Preset before Start** — duration must be chosen (or defaulted) before Let's go; display always reflects chosen duration.
- **Tab visibility** — countdown accuracy depends on active tab (FR-2 consequence); no background-tab compensation in v1.
- **Banned:** parallel timers, drag gestures, swipe actions, toast notifications, settings drawer, sound picker, volume slider.

## Accessibility Floor

Behavioral. Visual contrast lives in `DESIGN.md` Colors.

- **Focus order:** Presets (left → right) → Let's go → Pause for now (when visible) → Start over.
- **Labels:** every Control has an accessible name matching visible copy. Presets: `aria-pressed` for selected state.
- **Live region:** Countdown Display container uses `aria-live="polite"`; completion message announced on state change.
- **Contrast:** `{colors.ink-primary}` on `{colors.surface-raised}` and `{colors.accent}` on `{colors.surface-raised}` meet WCAG AA for text and UI components.
- **Target size:** interactive elements minimum 44×44px hit area.
- **Reduced motion:** no pulsing, bouncing, or digit-flip animations. State changes are instant opacity/content swaps.
- **Sound:** Completion Alert is supplementary; on-screen `00:00` + "Time's up!" is the primary completion signal for users who cannot hear.

## Key Flows

### Flow 1 — Focus block (Cody, morning desk session) — UJ-1

1. Cody opens the timer in his browser on a laptop.
2. Timer surface loads; 5 min Preset is selected [ASSUMPTION], display shows `05:00`.
3. He taps **Let's go**.
4. Countdown Display ticks down; he glances at large digits between typing.
5. Remaining time reaches zero — Completion Alert plays.
6. Display shows `00:00` and **Time's up!**
7. **Climax:** He hears the chime without staring at the screen — trustworthy enough to stay in flow until the sound pulls him back.
8. He taps **Start over** or picks **25 min** for the next block.

**Failure:** browser blocked audio before step 3 → no sound at step 5; visual completion still fires. Cody reads README or taps Let's go earlier next time.

### Flow 2 — Interrupted session (Cody, midday message) — UJ-2

1. Cody has a 10 min Timer running.
2. A message arrives; he taps **Pause for now**.
3. Display freezes (e.g. `06:42` preserved).
4. He handles the message, returns, taps **Let's go**.
5. Countdown resumes from `06:42`, not the original 10 min.
6. Timer completes; Completion Alert plays once.
7. **Climax:** Pause did not cheat him out of the remaining time — the session still ends when the preserved time elapses.

**Failure:** Cody accidentally taps **Start over** at step 2 → display resets to 10 min idle; accepted trade-off for simple Reset semantics (FR-4).
