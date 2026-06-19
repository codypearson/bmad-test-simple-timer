# bmad-test

Portfolio project: a focus countdown timer (`simple-timer/`) built with the [BMad Method](https://docs.bmad-method.org/) for planning and implementation.

## Repository Structure

```
bmad-test/
├── simple-timer/          # Application (Vite + vanilla JS)
├── _bmad-output/          # Planning & implementation artifacts (PRD, stories, etc.)
├── _bmad/custom/          # Team BMad overrides (committed)
├── docs/                  # Project knowledge
├── .agents/               # BMad Cursor skills (vendor — not committed)
└── _bmad/                 # BMad installer output (vendor — not committed, except custom/)
```

## Run the App

Prerequisites: [Node.js](https://nodejs.org/) 20.19+ or 22.12+

```bash
cd simple-timer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). See [simple-timer/README.md](simple-timer/README.md) for build, test, and feature details.

## BMad Setup

BMad tooling (`.agents/`, most of `_bmad/`) is installer output and is **not** committed to this repo. After cloning, reinstall it:

```bash
npx bmad-method install --yes --modules bmm --tools cursor
```

This project was installed with BMad **6.8.0** (core + bmm). For a closer match to that version, pin the installer package:

```bash
npx bmad-method@6.8.0 install --yes --modules bmm --tools cursor
```

Team-specific BMad overrides live in `_bmad/custom/` and are version-controlled. Personal overrides (`*.user.toml`) stay local and are gitignored.

Invoke `bmad-help` in Cursor after install to see recommended next steps.

## What Gets Committed

| Committed | Not committed (reinstall or regenerate) |
|-----------|----------------------------------------|
| `simple-timer/` source | `simple-timer/node_modules/`, `dist/` |
| `_bmad-output/` artifacts | `.agents/` skills |
| `_bmad/custom/` team config | `_bmad/` installer files (except `custom/`) |
| `docs/` | `*.user.toml` personal BMad config |
