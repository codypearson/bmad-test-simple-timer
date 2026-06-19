---
name: Simple Timer
description: A warm, paper-quiet countdown timer for personal focus blocks. Light theme, generous space, calm type — portfolio-polished without visual noise.
status: final
created: 2026-06-17
updated: 2026-06-17
colors:
  surface-base: '#FBF9F4'
  surface-raised: '#FFFFFF'
  surface-muted: '#F3EDE4'
  ink-primary: '#2C2825'
  ink-secondary: '#7A7268'
  ink-disabled: '#B8B0A6'
  accent: '#B8864E'
  accent-hover: '#A67540'
  accent-subtle: '#EDE4D8'
  border-hairline: '#E8E2D9'
  focus-ring: '#B8864E'
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  display-meta:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 64px
  gutter: 24px
  card-padding: 48px
components:
  timer-card:
    background: '{colors.surface-raised}'
    border: '1px solid {colors.border-hairline}'
    borderRadius: '{rounded.lg}'
    padding: '{spacing.card-padding}'
    maxWidth: 480px
  preset-button:
    background: '{colors.surface-raised}'
    color: '{colors.ink-primary}'
    border: '1px solid {colors.border-hairline}'
    borderRadius: '{rounded.md}'
    padding: '{spacing.3} {spacing.5}'
    font: '{typography.label}'
  preset-button-selected:
    background: '{colors.accent-subtle}'
    color: '{colors.ink-primary}'
    border: '1px solid {colors.accent}'
    borderRadius: '{rounded.md}'
    padding: '{spacing.3} {spacing.5}'
    font: '{typography.label}'
  control-primary:
    background: '{colors.accent}'
    color: '{colors.surface-raised}'
    border: 'none'
    borderRadius: '{rounded.md}'
    padding: '{spacing.4} {spacing.6}'
    font: '{typography.label}'
  control-secondary:
    background: '{colors.surface-raised}'
    color: '{colors.ink-primary}'
    border: '1px solid {colors.border-hairline}'
    borderRadius: '{rounded.md}'
    padding: '{spacing.4} {spacing.6}'
    font: '{typography.label}'
  countdown-display:
    color: '{colors.ink-primary}'
    font: '{typography.display}'
    fontVariantNumeric: tabular-nums
  completion-message:
    color: '{colors.accent}'
    font: '{typography.display-meta}'
---

## Brand & Style

Simple Timer is a single-purpose focus companion — not a productivity suite, not a gamified habit tracker. The visual posture is **warm paper on a desk**: off-white surfaces, calm serif digits, and just enough caramel accent to signal action without shouting. Generous whitespace keeps the Countdown Display as the undisputed focal point; everything else arranges quietly around it.

The aesthetic serves two audiences equally: Cody using it for real focus blocks, and a GitHub reviewer scanning the repo for intentional, readable front-end craft. Refined, not decorative. Basic, not bare.

## Colors

The palette stays within warm neutrals plus one accent. No status reds, no gradients, no dark-mode tokens in v1.

- **Warm Paper (`{colors.surface-base}`)** — page canvas. Slightly cream-toned to avoid clinical white glare on long sessions.
- **Raised White (`{colors.surface-raised}`)** — timer card, unselected Presets, secondary Controls. Separated from the canvas by hairline border, not shadow.
- **Muted Wash (`{colors.surface-muted}`)** — optional hover/rest state for secondary controls; never a primary surface.
- **Warm Ink (`{colors.ink-primary}`)** — countdown digits, primary labels. High contrast on paper surfaces (≥ 7:1 on `{colors.surface-base}`).
- **Soft Ink (`{colors.ink-secondary}`)** — helper text, idle hints. Legible but recessive.
- **Caramel (`{colors.accent}`)** — primary Control (Let's go), selected Preset border, completion message. The only chromatic hue; used for action and celebration, never for errors.
- **Accent Subtle (`{colors.accent-subtle}`)** — selected Preset fill. Signals choice without competing with the countdown.
- **Hairline (`{colors.border-hairline}`)** — card edge, unselected Preset borders, secondary Control outlines. Lowest legible separation.

Avoid: alarm red, neon greens, drop shadows as hierarchy, dark surfaces, badge dots, icon-only controls without labels.

## Typography

Calm typography means **serif for time, sans for interaction**.

- **Display (`{typography.display}`)** — Countdown Display only. Source Serif 4 (Georgia fallback) at large scale with tabular numerals so seconds tick without layout shift. No bold weight; the size carries presence.
- **Display Meta (`{typography.display-meta}`)** — completion message beneath `00:00`. Same family, human scale.
- **Label (`{typography.label}`)** — Preset buttons and Controls. System sans at medium weight; friendly copy fits without shouting.
- **Body / Caption** — reserved for future helper lines; unused in v1 single-screen layout.

Dynamic scaling: on viewports below 1024px width, display scales down proportionally (clamp ~64px–96px) while preserving tabular nums.

## Layout & Spacing

Single centered column on `{colors.surface-base}`. Timer card (`{components.timer-card}`) sits vertically and horizontally centered with `{spacing.8}` minimum outer margin.

**Vertical rhythm inside the card (top → bottom):**

1. Preset row — horizontal flex, equal-width buttons, `{spacing.3}` gap
2. `{spacing.7}` gap
3. Countdown Display — centered
4. `{spacing.4}` gap (completion message slot; empty when not complete)
5. `{spacing.7}` gap
6. Control row — horizontal flex, `{spacing.3}` gap, primary Control centered or leading

**Viewport rule (FR-6):** at 1280×800 and 1440×900, all zones visible without scroll. Minimum supported width: 720px (below this, content may scroll — acceptable edge case; laptop/desktop is the design target).

## Elevation & Depth

Depth is tonal, not shadow-driven. The timer card uses `{colors.surface-raised}` on `{colors.surface-base}` plus `{colors.border-hairline}` — no box-shadow in the default resting state. A single subtle shadow (`0 2px 8px rgba(44, 40, 37, 0.06)`) is permitted on the card only if border contrast proves insufficient on a specific display; prefer border first.

## Shapes

- `{rounded.md}` — Preset buttons, Controls. Soft corners, not pills.
- `{rounded.lg}` — timer card container.
- `{rounded.full}` — reserved; not used in v1 (no avatar dots, no icon buttons).

Imagery: none in v1. Corners apply to interactive surfaces only.

## Components

### Timer card

Anatomy: one raised surface containing all interactive zones. Visual spec: `{components.timer-card}`. No app chrome, no header bar, no footer links in v1.

### Preset button

Anatomy: label only (e.g. "5 min"). States:

| State | Appearance |
|---|---|
| Default | `{components.preset-button}` |
| Selected | `{components.preset-button-selected}` |
| Disabled (while running) | `{colors.ink-disabled}` text, no pointer; border unchanged |
| Hover (idle only) | `{colors.surface-muted}` background |

Four Presets always visible: 1, 5, 10, 25 minutes.

### Countdown Display

Anatomy: `MM:SS` tabular digits. Spec: `{components.countdown-display}`. While running, digits update each second. At completion: `00:00` holds until Reset or new Preset.

### Completion message

Anatomy: single line below digits. Spec: `{components.completion-message}`. Visible only in the **complete** state. Copy defined in `EXPERIENCE.md` Voice and Tone.

### Control — primary (Let's go)

Spec: `{components.control-primary}`. Hover: `{colors.accent-hover}` background. Visible when idle (after Preset) or paused. Hidden or replaced when running (see behavioral rules in `EXPERIENCE.md`).

### Control — secondary (Pause for now, Start over)

Spec: `{components.control-secondary}`. Hover: `{colors.surface-muted}` fill. **Pause for now** visible only while running. **Start over** visible in idle (with Preset), paused, and complete states.

→ Composition reference: `mockups/key-timer-main.html`. Spine wins on conflict.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Let the countdown dominate visual weight | Add charts, progress rings, or secondary timers |
| Use caramel accent only for action + completion | Color-code Presets by duration |
| Keep all controls labeled with warm words | Rely on icon-only buttons |
| Preserve tabular numerals on the display | Animate digit transitions that shift layout |
| Maintain generous `{spacing.7}` gaps between zones | Compress to fit marketing copy or feature lists |
| Honor light warm-paper palette throughout | Introduce dark mode tokens in v1 |
