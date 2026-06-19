# Story 1.1: Initialize Project and Visual Shell

baseline_commit: NO_VCS

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Cody,
I want a runnable project with the timer screen matching the UX mockup,
so that I have a solid visual foundation to build timer behavior on.

## Acceptance Criteria

1. **Given** the repository has no `simple-timer/` application yet  
   **When** the developer scaffolds the Vite vanilla template (`npm create vite@latest simple-timer -- --template vanilla`) and runs `npm install`  
   **Then** `npm run dev` starts a local dev server without errors  
   **And** the project structure matches architecture: `index.html`, `src/main.js`, `src/style.css`, `public/`, `vite.config.js`, `package.json`

2. **Given** the dev server is running  
   **When** Cody opens the app in a browser at a laptop viewport (1280×800)  
   **Then** a single-screen timer layout is visible without scrolling: Preset row, Countdown Display, and Control row inside a centered timer card  
   **And** markup is ported from `key-timer-main.html` into `index.html` (no DOM generation from JavaScript)

3. **Given** the visual shell is rendered  
   **When** inspecting `src/style.css`  
   **Then** all DESIGN.md color, spacing, typography, and border-radius tokens are defined as CSS custom properties at `:root`  
   **And** Source Serif 4 is loaded via Google Fonts CDN link in `index.html`

4. **Given** the app loads on cold open  
   **When** no interaction has occurred  
   **Then** the 5 min Preset appears selected, the Countdown Display shows `05:00`, and control buttons use EXPERIENCE.md microcopy ("Let's go", "Pause for now", "Start over")  
   **And** preset labels read "1 min", "5 min", "10 min", "25 min"

5. **Given** a typical laptop viewport  
   **When** viewing at 1280×800 or 1440×900  
   **Then** all zones (Presets, Countdown Display, Controls) are visible without scrolling (FR6, UX-DR12)  
   **And** the Countdown Display uses large serif digits with `font-variant-numeric: tabular-nums` and responsive `clamp()` scaling (UX-DR7)

## Tasks / Subtasks

- [x] Scaffold Vite vanilla project (AC: #1)
  - [x] Run `npm create vite@latest simple-timer -- --template vanilla` from repo root `bmad-test/`
  - [x] Run `npm install` inside `simple-timer/`
  - [x] Verify `npm run dev` starts without errors at `http://localhost:5173`
  - [x] Remove default Vite demo content (`counter.js`, demo markup in `index.html`, demo styles)
- [x] Port static markup from UX mockup (AC: #2, #4)
  - [x] Copy structure from `key-timer-main.html` into `simple-timer/index.html`
  - [x] Omit mockup-only elements (`.annotation` paragraph, inline `<style>` block)
  - [x] Include all four Preset buttons, Countdown Display, completion message slot, and three Controls
  - [x] Set cold-open state in HTML: 5 min preset has `.selected` + `aria-pressed="true"`; display shows `05:00`
  - [x] Hide completion message and "Pause for now" for idle cold-open (CSS `visibility: hidden` or equivalent)
  - [x] Show "Let's go" and "Start over" for idle cold-open
  - [x] Add semantic roles from mockup: `role="application"`, preset `role="group"`, `aria-live="polite"` on countdown
- [x] Implement design tokens and component styles (AC: #3, #5)
  - [x] Define all `:root` CSS custom properties from DESIGN.md (see Dev Notes token table)
  - [x] Replace hardcoded hex in component rules with `var(--color-*)` / `var(--spacing-*)` references
  - [x] Add Google Fonts `<link>` for Source Serif 4 in `index.html` `<head>`
  - [x] Apply `clamp()` to countdown font-size (~64px–96px per DESIGN.md)
  - [x] Center timer card on warm-paper canvas; enforce 480px max-width, 48px card padding, vertical rhythm gaps
- [x] Wire minimal bootstrap (AC: #1)
  - [x] `src/main.js` imports `./style.css` only — no business logic, no DOM manipulation, no event listeners
  - [x] Ensure `public/` directory exists (empty is fine; `completion.mp3` is Story 1.4)
- [x] Manual verification (AC: #1–#5)
  - [x] Confirm layout at 1280×800 and 1440×900 — no scroll required
  - [x] Confirm 5 min selected styling matches mockup (accent-subtle fill, accent border)
  - [x] Confirm tabular numerals prevent layout shift on digit changes (visual check with mock values)

## Dev Notes

### Story Scope Boundary — CRITICAL

This story is **visual shell only**. Do not implement timer behavior or application modules yet.

| In scope (Story 1.1) | Deferred to later stories |
|------------------------|---------------------------|
| Vite scaffold + `npm run dev` | `state.js` FSM (Story 1.2+) |
| Static HTML from mockup | `timer.js` countdown engine (Story 1.3) |
| CSS tokens + component styles | `ui.js` event bindings (Story 1.2+) |
| Cold-open static HTML state | `audio.js` + `completion.mp3` (Story 1.4) |
| `main.js` imports CSS only | Idle hint "Pick a time to get started" (Story 1.5) |
| Google Fonts link | README (Story 2.1) |
| Control visibility via static HTML/CSS | Dynamic control visibility per state (Story 1.2+) |

**Do NOT** create `state.js`, `timer.js`, `ui.js`, or `audio.js` in this story unless you need empty stub files — prefer omitting them entirely until their stories.

**Do NOT** generate DOM from JavaScript. All structure lives in `index.html`.

**Do NOT** add Tailwind, CSS preprocessors, UI frameworks, or routing.

### Repository Layout

```
bmad-test/                          # Repo root (BMAD artifacts stay here)
├── _bmad-output/                   # Planning — do NOT move app here
├── simple-timer/                   # NEW — application root (this story)
│   ├── public/                     # Static assets (empty OK for now)
│   ├── src/
│   │   ├── main.js                 # import './style.css' only
│   │   └── style.css               # All tokens + component styles
│   ├── index.html                  # Timer markup (from mockup)
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
```

BMAD planning artifacts (`_bmad-output/`) and application code (`simple-timer/`) must remain separate per architecture.

### Scaffold Command

Run from repo root:

```bash
npm create vite@latest simple-timer -- --template vanilla
cd simple-timer
npm install
npm run dev
```

**Versions (verified 2026-06-17):** `create-vite@9.0.7`, `vite@8.0.16` (stable).  
**Node.js requirement:** 20.19+ or 22.12+.

For non-interactive/CI automation, add `--yes` if your npm version supports it.

After scaffold, delete Vite's default demo files (`src/counter.js`, demo JS in `index.html`).

### Markup Reference — Port from Mockup

**Source file:** `_bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/mockups/key-timer-main.html`

**Target structure in `index.html`:**

```html
<body>
  <div class="page-center">
    <div class="timer-card" role="application" aria-label="Focus timer">
      <div class="presets" role="group" aria-label="Duration presets">
        <button class="preset" type="button" aria-pressed="false">1 min</button>
        <button class="preset selected" type="button" aria-pressed="true">5 min</button>
        <button class="preset" type="button" aria-pressed="false">10 min</button>
        <button class="preset" type="button" aria-pressed="false">25 min</button>
      </div>

      <div class="display-zone">
        <div class="countdown" aria-live="polite">05:00</div>
        <div class="completion" aria-hidden="true">Time's up!</div>
      </div>

      <div class="controls">
        <button class="btn-primary" type="button">Let's go</button>
        <button class="btn-secondary btn-pause" type="button" hidden>Pause for now</button>
        <button class="btn-secondary" type="button">Start over</button>
      </div>
    </div>
  </div>
</body>
```

**Notes on markup choices:**
- Use `hidden` attribute on "Pause for now" for idle cold-open (not visible in mockup). Story 1.3+ will toggle visibility via `ui.js`.
- Completion message: keep in DOM but hidden (`visibility: hidden` + `min-height` reserve per mockup) so layout doesn't shift in Story 1.4.
- Remove mockup's `.annotation` footer — it is documentation, not shipped UI.
- Page title: `Simple Timer` (not the mockup's "Key Screen" title).

### CSS Custom Properties — Complete Token Table

Define at `:root` in `src/style.css`. Use these exact names (architecture naming convention):

**Colors:**
```css
:root {
  --color-surface-base: #FBF9F4;
  --color-surface-raised: #FFFFFF;
  --color-surface-muted: #F3EDE4;
  --color-ink-primary: #2C2825;
  --color-ink-secondary: #7A7268;
  --color-ink-disabled: #B8B0A6;
  --color-accent: #B8864E;
  --color-accent-hover: #A67540;
  --color-accent-subtle: #EDE4D8;
  --color-border-hairline: #E8E2D9;
  --color-focus-ring: #B8864E;
}
```

**Spacing:**
```css
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 24px;
  --spacing-6: 32px;
  --spacing-7: 48px;
  --spacing-8: 64px;
  --spacing-gutter: 24px;
  --spacing-card-padding: 48px;
```

**Border radius:**
```css
  --rounded-sm: 8px;
  --rounded-md: 12px;
  --rounded-lg: 20px;
  --rounded-full: 9999px;
```

**Typography (as CSS variables for reference; apply via rules):**
```css
  --font-display: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-size-display: clamp(4rem, 8vw, 6rem); /* ~64px–96px */
  --font-size-display-meta: 20px;
  --font-size-label: 15px;
```

### Component Style Requirements

| Class | Key rules |
|-------|-----------|
| `body` / `.page-center` | `min-height: 100vh`, flex center, `background: var(--color-surface-base)`, outer padding `var(--spacing-8) var(--spacing-gutter)` |
| `.timer-card` | `background: var(--color-surface-raised)`, `border: 1px solid var(--color-border-hairline)`, `border-radius: var(--rounded-lg)`, `padding: var(--spacing-card-padding)`, `max-width: 480px`, `width: 100%` |
| `.presets` | flex row, `gap: var(--spacing-3)`, equal-width children |
| `.preset` | label typography, `border-radius: var(--rounded-md)`, `padding: var(--spacing-3) var(--spacing-5)`, min 44×44px hit area |
| `.preset.selected` | `background: var(--color-accent-subtle)`, `border-color: var(--color-accent)` |
| `.display-zone` | `margin: var(--spacing-7) 0`, centered text |
| `.countdown` | `font-family: var(--font-display)`, `font-size: var(--font-size-display)`, `font-variant-numeric: tabular-nums`, `color: var(--color-ink-primary)`, `line-height: 1.1`, `letter-spacing: -0.02em` |
| `.completion` | display-meta typography, `color: var(--color-accent)`, `margin-top: var(--spacing-4)`, `min-height: 28px`, `visibility: hidden` |
| `.controls` | flex row, `gap: var(--spacing-3)`, centered |
| `.btn-primary` | accent background, white text, `border-radius: var(--rounded-md)`, `padding: var(--spacing-4) var(--spacing-6)`, min 44×44px |
| `.btn-secondary` | raised surface, hairline border, `border-radius: var(--rounded-md)`, min 44×44px |
| `.btn-primary:hover` | `background: var(--color-accent-hover)` |
| `.btn-secondary:hover` | `background: var(--color-surface-muted)` |
| `:focus-visible` on buttons | `outline: 2px solid var(--color-focus-ring)`, `outline-offset: 2px` |

**Depth:** Prefer hairline border over box-shadow. Subtle card shadow only if border contrast is insufficient on your display.

### Google Fonts — index.html head

Add before `style.css` import:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400&display=swap" rel="stylesheet">
```

### Cold-Open State (Static HTML)

Per architecture and UX `[ASSUMPTION]` — implement 5 min pre-selected:

| Element | Cold-open value |
|---------|-----------------|
| Selected preset | 5 min (`.selected`, `aria-pressed="true"`) |
| Countdown display | `05:00` |
| Let's go | Visible |
| Pause for now | Hidden |
| Start over | Visible |
| Completion message | Hidden (`visibility: hidden`, `aria-hidden="true"`) |
| Preset disabled state | Not applied (all presets interactive visually; behavior wired in Story 1.2+) |

Log this assumption in commit message: `Default cold-open: 5 min preset selected per UX assumption`.

### Microcopy — Use Verbatim

From EXPERIENCE.md Voice and Tone:

| Element | Copy |
|---------|------|
| Primary control | Let's go |
| Pause control | Pause for now |
| Reset control | Start over |
| Preset labels | 1 min · 5 min · 10 min · 25 min |
| Completion message | Time's up! |

### main.js — Minimal Bootstrap

```javascript
import './style.css';
```

No other imports. No `DOMContentLoaded` handlers. No `innerHTML`. No `createElement`.

### Vite Config

Keep default `vite.config.js` with `base: '/'`. No GitHub Pages path prefix. No deploy config.

### What Success Looks Like

When done, opening `http://localhost:5173` shows a warm-paper page with a centered white timer card containing:
- Four preset buttons (5 min visually selected)
- Large serif `05:00` countdown
- "Let's go" and "Start over" buttons
- No Vite demo counter, no console errors, no scroll at 1280×800

Buttons will not function yet — that is expected and correct for this story.

### Project Structure Notes

- Application lives in `simple-timer/` subdirectory, NOT repo root
- CSS class names use `kebab-case` matching mockup: `.timer-card`, `.preset`, `.countdown`, `.btn-primary`, `.btn-secondary`
- Static assets go in `public/` (referenced as `/filename` in later stories)
- `formatTime()` and millisecond storage are Story 1.2+ concerns — display hardcoded `05:00` in HTML is correct here

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Starter-Template-Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation-Patterns--Consistency-Rules]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/DESIGN.md]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/EXPERIENCE.md]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-bmad-test-2026-06-17/mockups/key-timer-main.html]

## Dev Agent Record

### Agent Model Used

Composer 2.5

### Debug Log References

None

### Completion Notes List

- Scaffolded Vite 8 vanilla project in `simple-timer/` with `npm create vite@latest`
- Ported timer markup from UX mockup with semantic ARIA roles and cold-open 5 min state
- Implemented full DESIGN.md token set in `src/style.css` with Source Serif 4 via Google Fonts
- `main.js` imports CSS only; dev server verified at `http://localhost:5173`
- Added `src/shell.test.js` for HTML structure validation; 19 tests pass across suite

### File List

- simple-timer/package.json
- simple-timer/package-lock.json
- simple-timer/index.html
- simple-timer/vite.config.js
- simple-timer/vitest.config.js
- simple-timer/.gitignore
- simple-timer/public/favicon.svg
- simple-timer/public/icons.svg
- simple-timer/src/main.js
- simple-timer/src/style.css
- simple-timer/src/shell.test.js

### Change Log

- 2026-06-17: Story 1.1 — Scaffolded Vite vanilla app with visual shell matching UX mockup and DESIGN.md tokens
