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

```bash
cd simple-timer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Preview

From the `simple-timer/` directory:

```bash
npm run build
npm run preview
```

Open the URL shown in the terminal (typically [http://localhost:4173](http://localhost:4173)).

## Repository Structure

```
bmad-test/
├── simple-timer/          # This application
│   ├── src/               # JavaScript modules + styles
│   ├── public/            # Static assets (completion sound)
│   └── index.html         # Timer UI
├── _bmad-output/          # BMAD planning artifacts (not needed to run the app)
└── _bmad/custom/          # Team BMAD overrides (committed; rest of _bmad/ is vendor)
```

BMad skills and installer output are not committed. See the [root README](../README.md#bmad-setup) for reinstall instructions.

## Sound Asset

- **File:** `public/completion.mp3`
- **Source:** Mixkit "Bell Notification" ([mixkit.co](https://mixkit.co/free-sound-effects/bell/))
- **License:** Mixkit Free License
- **Attribution:** Not required

## Browser Audio (Autoplay)

Browsers may block audio until you interact with the page. The first click on **Let's go** unlocks the completion sound. If audio is blocked, the timer still shows `00:00` and **Time's up!** — the visual alert is the primary signal. No error message is shown when audio fails.

## Deployment

TBD — local development only for v1. GitHub Pages and CI/CD are deferred.

## Testing

Automated tests are optional for v1 portfolio review (NFR8), but a Vitest suite is included:

```bash
cd simple-timer
npm test
```

## Manual Test Checklist

Use this checklist to verify all five UX states alongside `npm test`.

- [ ] **Cold open:** App loads with 5 min preset selected, display shows `05:00`
- [ ] **Preset selection:** Tapping presets updates display (try 1, 10, 25 min)
- [ ] **Running:** Let's go starts countdown; digits tick each second
- [ ] **Paused:** Pause for now freezes time; Let's go resumes from same time
- [ ] **Reset:** Start over returns to selected preset duration
- [ ] **Complete:** Timer reaches `00:00`, shows "Time's up!", plays sound once
- [ ] **Keyboard:** Tab through presets and controls in logical order

## Assumptions

- Default cold-open: 5 minute preset pre-selected (UX assumption)
- Idle hint: **included** — "Tap a preset or press Let's go" appears below the countdown on first load and hides after the first preset tap

## Tech Stack

- Vite 8.x (vanilla template)
- Vanilla JavaScript ES modules
- Plain CSS with design tokens
