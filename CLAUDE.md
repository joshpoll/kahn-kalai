# CLAUDE.md

## Project Overview

An illustrated, interactive guide to the proof of the Kahn-Kalai conjecture. Built with SolidJS + Vite + TypeScript. Deployed to GitHub Pages.

## Working Log

**IMPORTANT:** This project maintains a working log at `WORKING_LOG.md`. When completing a significant piece of work (new feature, design change, bug fix, or feedback round), append a summary to the log describing:
- What was done and why
- What worked and what didn't
- Any open questions or future work identified

This log is part of an experiment in human-AI collaboration on math communication, so capturing the process matters as much as the output.

## Key Architecture

- **SolidJS** for reactivity (signals drive SVG attributes directly)
- **KaTeX** for LaTeX math (loaded from CDN, wrapped in `src/components/Math.tsx`)
- **Inline SVG** for all diagrams — both static and interactive
- **Shared graph layout** (`src/components/graphLayout.ts`) ensures visual consistency across demos
- **Notation sidebar** — fixed right panel with mini SVG icons, hidden below 1200px viewport width

## Conventions

- SVG diagrams use a consistent color palette: blue (#2563eb) for primary structures, orange (#ea580c) for minimal elements/edges, purple (#7c3aed) for overlaps/upsets, green (#16a34a) for covers, red (#dc2626) for emphasis/fragments.
- Use CSS classes `.box`, `.box.definition`, `.box.remark`, `.box.key-idea` for formal statements.
- The "fastish algorithms" paper is the style reference: conversational headers, incremental buildup, colored annotations.
- Port 5555 for dev server. Do NOT kill processes on other ports.

### SVG set operations via clip paths

When diagrams need to show set differences (A \ B), intersections, or complements, **always use `clipPath`** — never manually compute intersection geometry or draw independent shapes that merely look correct. The pattern:

1. To show **A ∩ B**: draw A clipped to B (`<clipPath>` containing B's shape).
2. To show **A \ B**: draw A clipped to the complement of B (even-odd `<clipPath>` with a bounding box minus B).
3. This ensures regions are **structurally derived** from the actual shapes — if you change A or B, the derived regions update automatically.

Helper functions in `src/components/svgClip.ts` generate the even-odd complement paths:
- `complementRect(rect, bounds)` — complement of a rectangle
- `complementCircle(circle, bounds)` — complement of a circle
- `complementEllipse(ellipse, bounds)` — complement of an ellipse
- `crescentMetrics(ellipse, cutX, side)` — safe label position for the "crescent" region of an ellipse on one side of a vertical cut line (e.g. T = S' \ W or S' ∩ W). Places the label ~55% from the cut toward the far edge.

### Diagram labeling convention

- **Inside diagrams:** Short name labels only (W, S, S', T, Ŝ, Z) placed at computed safe positions via `crescentMetrics()`. Optionally one-word role descriptors like "(random subset)".
- **In captions:** All equations and relationships (T = S' \ W, S' ∈ H, etc.). The clip-path structure already *shows* the set relationships visually; the caption is the right place for equations.

Example usage (from FragmentConstructionDiagram):
```tsx
import { complementRect } from "./svgClip";
// In <defs>:
<clipPath id="outsideW">
  <path clip-rule="evenodd" d={complementRect(W, { w: svgW, h: svgH })} />
</clipPath>
// Then draw S' clipped to outside W = T:
<g clip-path="url(#outsideW)">
  <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry} ... />
</g>
```

## Reference Materials (not committed)

- `kahn-kalai-proof.pdf` — the original paper by Park & Pham
- `fastish_algorithms_for_integer_programming.pdf` — style reference (co-authored by Josh)
- `jinyoung-diagrams/` — photos from Jinyoung Park's talk, used as diagram references

## Process

This project is a collaboration between Josh and Claude. Josh provides:
- The reference articles and images
- High-level design direction and article structure
- Manual refinement and feedback on diagrams (initial AI results need iteration)

Claude provides:
- Code generation for components, styling, and deployment
- Matching talk photos to paper concepts
- SVG diagram creation (with iterative refinement based on feedback)
