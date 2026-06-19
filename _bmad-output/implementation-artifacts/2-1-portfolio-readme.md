---
baseline_commit: NO_VCS
---

# Story 2.1: Portfolio README

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a GitHub reviewer,
I want clear documentation on how to run and understand the timer,
so that I can evaluate the project quickly without guessing.

## Acceptance Criteria

1. **Given** the `simple-timer/` application is functional  
   **When** a reviewer opens `simple-timer/README.md`  
   **Then** it explains what the app does in plain language (countdown timer with presets, pause/reset, completion alert)  
   **And** local run instructions are present: `npm install`, `npm run dev`, `npm run build`, `npm run preview` (SM-2, NFR7)

2. **Given** a reviewer follows the README  
   **When** they run the documented commands from the `simple-timer/` directory  
   **Then** the app starts locally without undocumented steps  
   **And** a new reviewer can go from clone to running app in under two minutes on a machine with Node.js 20.19+ installed

3. **Given** `public/completion.mp3` is bundled  
   **When** reading the README  
   **Then** sound asset license and attribution are documented (source, license type, any required credit)  
   **And** browser autoplay behavior is explained: first "Let's go" unlocks audio; silent fail if blocked (NFR6)

4. **Given** deployment is deferred per architecture  
   **When** reading the README  
   **Then** a deployment section is present marked TBD (no GitHub Pages or CI/CD instructions required for v1)  
   **And** the repo structure clearly separates BMAD planning artifacts (`_bmad-output/`) from application code (`simple-timer/`)

5. **Given** v1 accepts manual verification  
   **When** reviewing documentation  
   **Then** README includes a brief manual test checklist covering all five UX states (idle, running, paused, complete, preset selection)  
   **And** no automated test suite is required (NFR8)

## Tasks / Subtasks

- [x] Create `simple-timer/README.md` (AC: #1–#5)
  - [x] Project title and one-paragraph description
  - [x] Features list (presets, countdown, pause/resume, reset, completion alert)
  - [x] Prerequisites: Node.js 20.19+ or 22.12+
  - [x] Local development commands with working directory `simple-timer/`
  - [x] Production build + preview commands
- [x] Document repo structure (AC: #4)
  - [x] Explain `simple-timer/` = app, `_bmad-output/` = planning artifacts (not required to run app)
- [x] Document sound asset (AC: #3)
  - [x] File: `public/completion.mp3`
  - [x] Source name, license, attribution/credit if required
  - [x] Copy from comment in `audio.js` if documented there
- [x] Document autoplay behavior (AC: #3)
  - [x] First "Let's go" click unlocks audio
  - [x] If blocked: visual completion (00:00 + message) still works; no error shown
- [x] Add deployment section TBD (AC: #4)
  - [x] Note: GitHub Pages / CI deferred for v1
- [x] Add manual test checklist (AC: #5)
  - [x] Cover: cold open, preset selection, running, paused, complete
  - [x] Note: no automated tests in v1
- [x] Document assumptions from implementation (AC: #1)
  - [x] Cold-open default: 5 min preset selected
  - [x] Idle hint included/omitted (per Story 1.5 decision)
- [x] Verify README accuracy (AC: #2)
  - [x] Fresh clone simulation: follow README steps exactly
  - [x] Confirm under 2 minutes to running app

## Dev Notes

### Story Scope Boundary — CRITICAL

| In scope | Out of scope |
|----------|--------------|
| `simple-timer/README.md` | Root repo README (optional — not required by AC) |
| Documentation only | Code changes (unless fixing doc-discovered bugs) |
| Manual test checklist | Automated tests, CI/CD, GitHub Pages setup |

**Do NOT** add GitHub Actions, deploy scripts, or test frameworks in this story.

### Prerequisites

Epic 1 stories (1.1–1.5) should be functionally complete:
- App runs via `npm run dev`
- `public/completion.mp3` exists with known license
- All five UX states work

### README Template Structure

```markdown
# Simple Timer

A warm, single-screen focus countdown timer built with vanilla HTML, CSS, and JavaScript (Vite).

Pick a preset (1, 5, 10, or 25 minutes), start the countdown, pause when interrupted, and get a visual + audio alert when time is up.

## Features

- Four preset durations (1, 5, 10, 25 minutes)
- Start, pause/resume, and reset controls
- Large readable countdown display
- Completion sound and on-screen "Time's up!" message
- Accessible keyboard navigation and screen reader support

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+

## Local Development

From the repository root:

\`\`\`bash
cd simple-timer
npm install
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Preview

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Repository Structure

\`\`\`
bmad-test/
├── simple-timer/          # This application
│   ├── src/             # JavaScript modules + styles
│   ├── public/          # Static assets (completion sound)
│   └── index.html       # Timer UI
└── _bmad-output/        # BMAD planning artifacts (not needed to run the app)
\`\`\`

## Sound Asset

- **File:** `public/completion.mp3`
- **Source:** [name]
- **License:** [type, e.g. Mixkit Free License / CC0]
- **Attribution:** [credit line if required]

## Browser Audio (Autoplay)

Browsers may block audio until you interact with the page. The first click on **Let's go** unlocks the completion sound. If audio is blocked, the timer still shows `00:00` and **Time's up!** — the visual alert is the primary signal.

## Deployment

TBD — local development only for v1. GitHub Pages and CI/CD are deferred.

## Manual Test Checklist

- [ ] **Cold open:** App loads with 5 min preset selected, display shows `05:00`
- [ ] **Preset selection:** Tapping presets updates display (try 1, 10, 25 min)
- [ ] **Running:** Let's go starts countdown; digits tick each second
- [ ] **Paused:** Pause for now freezes time; Let's go resumes from same time
- [ ] **Reset:** Start over returns to selected preset duration
- [ ] **Complete:** Timer reaches `00:00`, shows "Time's up!", plays sound once
- [ ] **Keyboard:** Tab through presets and controls in logical order

## Assumptions

- Default cold-open: 5 minute preset pre-selected (UX assumption)
- [Idle hint: included / omitted — document actual implementation]

## Tech Stack

- Vite 8.x (vanilla template)
- Vanilla JavaScript ES modules
- Plain CSS with design tokens
```

Customize bracketed sections with actual values from implementation.

### Node.js Version

Per architecture (verified 2026-06-17):
- Node.js **20.19+** or **22.12+**
- Vite 8.x / create-vite 9.x

### Sound License Examples

| Source | Typical license | Attribution |
|--------|-----------------|-------------|
| Mixkit | Mixkit Free License | Not required |
| Freesound CC0 | CC0 | Optional |
| Pixabay | Pixabay License | Not required |

Match whatever was used in Story 1.4.

### Manual Test Checklist — Five UX States

Map to EXPERIENCE.md State Patterns:
1. Cold open
2. Preset selected (idle)
3. Running
4. Paused
5. Complete

Plus preset selection as distinct test.

### SM-2 Success Metric

Reviewer can clone → `cd simple-timer` → `npm install` → `npm run dev` in **under 2 minutes** on Node 20.19+.

### Root README (Optional)

AC requires `simple-timer/README.md` only. A root `README.md` pointing to `simple-timer/` is nice-to-have but **not required** — do not scope-creep unless user asks.

### Previous Story Intelligence

- Story 1.4: sound source documented in `audio.js` comment — copy to README
- Story 1.5: idle hint decision — document include/omit
- Story 1.1: cold-open 5 min assumption — document in Assumptions section
- Architecture: deployment deferred, BMAD artifacts separate

### Verification Steps

1. Delete `node_modules`, run README commands fresh
2. Time the flow with `time (npm install && npm run dev)`
3. Confirm no undocumented env vars or extra setup
4. Spell-check microcopy matches EXPERIENCE.md ("Let's go", not "Lets go")

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure--Deployment]
- [Source: _bmad-output/planning-artifacts/prds/prd-bmad-test-2026-06-17/prd.md]
- [Source: _bmad-output/implementation-artifacts/1-4-completion-alert.md]
- [Source: _bmad-output/implementation-artifacts/1-5-accessibility-and-ux-state-polish.md]

## Dev Agent Record

### Agent Model Used

Composer (subagent)

### Debug Log References

- Fresh clone simulation: `rm -rf node_modules && npm install` (~8s) + `npm run dev` (Vite ready in 656ms) — well under 2-minute SM-2 target
- `npm run build` succeeded (251ms)
- `npm test` — 19/19 passed (regression check; no new tests required by story)

### Implementation Plan

Documentation-only story. Created `simple-timer/README.md` following Dev Notes template. Sound license copied from `audio.js` comment (Mixkit "Bell Notification", Mixkit Free License, no attribution). Idle hint documented as included per Story 1.5 implementation.

### Completion Notes List

- Created comprehensive `simple-timer/README.md` covering all 5 acceptance criteria
- Documented app description, run commands, repo structure, sound asset, autoplay behavior, deployment TBD, manual test checklist, and assumptions
- Verified README commands: install + dev server start in under 2 minutes
- No app code changes required

### File List

- simple-timer/README.md (new)

### Change Log

- 2026-06-19: Story 2.1 — Added portfolio README for simple-timer application
