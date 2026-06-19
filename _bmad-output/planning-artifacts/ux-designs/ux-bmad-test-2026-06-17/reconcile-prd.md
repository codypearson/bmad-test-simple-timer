# PRD Reconciliation — Simple Timer

**Source:** `../../prds/prd-bmad-test-2026-06-17/prd.md`

## Inherited verbatim

| PRD item | Spine location |
|---|---|
| UJ-1, UJ-2 | EXPERIENCE.md Key Flows |
| FR-1 through FR-6 | EXPERIENCE.md IA, Component Patterns, State Patterns |
| Presets 1, 5, 10, 25 min | DESIGN.md + EXPERIENCE.md Preset button |
| Single-screen, no navigation | EXPERIENCE.md Foundation, IA |
| Completion: `00:00` + message + sound | EXPERIENCE.md complete state, Flow 1 |
| Pause preserves remaining time | Flow 2, Component Patterns |
| Large readable digits | DESIGN.md countdown-display |
| Light theme / dark mode deferred | Foundation, Do's and Don'ts |
| No accounts, backend, notifications | Interaction Primitives (banned list) |

## UX additions (not in PRD)

| Addition | Rationale | Tagged |
|---|---|---|
| Warm paper color palette + caramel accent | User Discovery direction | — |
| Friendly control labels (Let's go, etc.) | User Discovery direction | — |
| Default 5 min Preset on cold open | Sensible idle default for fast path | [ASSUMPTION] |
| Idle hint copy | Reduces blank-state confusion | [ASSUMPTION] |
| Source Serif 4 for display digits | Calm typography decision | — |
| `aria-live`, focus order, 44px targets | Portfolio-quality accessibility floor | — |

## Dropped / unchanged from PRD

- Custom time input, Pomodoro cycles, analytics — remain out of scope; not reintroduced.
- PRD literal "Start / Pause / Reset" labels — superseded by warm copy in EXPERIENCE.md (behavior unchanged).

## Qualitative ideas not carried forward

None — PRD scope was minimal and fully absorbed.
