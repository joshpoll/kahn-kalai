# Working Log

This file tracks the design process and decisions made while building this illustrated guide to the Kahn-Kalai conjecture proof. It serves as a record of the collaboration between a human (Josh) and AI (Claude), including what worked, what didn't, and what we learned.

## Project Goals

- **Understand the math.** The Kahn-Kalai conjecture/result is really cool and Josh wants to deeply understand it.
- **Test AI explanation generation.** Can AI generate good explanations of math? Not just markdown — real diagrams and interactive visualizations.
- **Explore AI + math communication.** Can AI change how we understand complex math/CS the way it has changed programming? This project is an experiment in that direction.
- **Push beyond concrete-only explorables.** The explorable explanations community has over-indexed on concrete visualizations at the expense of symbolic math and abstract diagrams. *All* representations — concrete, symbolic, and abstract — are needed for the best explanations. Things stuck in only concrete land (e.g. Bret Victor's early examples) can actually be confusing. This project explores a fuller palette.
- **Explore AI diagram generation.** How well can AI generate SVG diagrams? (And eventually: could Josh's library GoFish be a better target? But GoFish is not being used in this article right now.)
- **Make something satisfying to read.** The dream: go from general idea/topic to interactive illustrated article in 1-2 days. If that's feasible, there are many topics that deserve this treatment, and it could enable deeper research thinking and appreciation of math/CS.

## Process & Roles

**Josh's role:**
- Provided two reference documents: the Kahn-Kalai proof paper, and a hand-written article about a CS algorithm ("fastish algorithms for integer programming") that Josh co-authored — used as a style reference, not for content.
- Provided photos from Jinyoung Park's talk as visual references for diagrams.
- Steered the rough design of the article (structure, what concepts need diagrams, sidebar idea).
- Doing a lot of manual refinement on diagrams, since the initial AI-generated results were just alright — they needed iteration on layout, coloring, sizing, SVG rendering correctness, and visual clarity.

**Claude's role:**
- Code generation for all components, styling, and deployment infrastructure.
- Reading and understanding the proof paper to structure the explanation.
- Matching talk photos to concepts in the paper and creating SVG diagram components.
- Iterating on diagrams based on feedback (often 2-3 rounds per diagram).

## Session 1 — Initial Build

### What happened

1. **Research phase.** Claude read the Kahn-Kalai proof paper and the "fastish algorithms" style reference. The fastish algorithms paper has a conversational tone, incremental buildup, hand-drawn-style diagrams with colored annotations, boxed theorems, and running examples.

2. **Project setup.** SolidJS + Vite + TypeScript with KaTeX for math rendering. Chose SolidJS for lightweight reactivity in interactive SVG diagrams.

3. **First implementation.** Built the full 8-section article with 5 interactive components (RandomGraph, CoverDemo, FragmentDemo, IterationDemo, CountingDiagram), a ProofOverview flowchart, and comprehensive CSS styling.

4. **First feedback round — consistency and jitter.**
   - Problem: Each interactive demo used a different graph layout (7-vertex circle, 6-element set, 8-element set with letters), forcing the reader to re-orient each time.
   - Fix: Created a shared `graphLayout.ts` with a common 7-vertex circle layout used by all three graph demos.
   - Problem: The p-small status text ("F is p-small" / "F is NOT p-small") had different widths, causing the slider below it to jitter.
   - Fix: Moved the status text inside the SVG as a fixed-position element.

5. **Second feedback round — more diagrams needed.**
   - Josh provided 5 photos from Jinyoung Park's talk showing chalkboard diagrams.
   - Claude matched each photo to the corresponding concept in the paper and created 5 new static SVG diagram components: IncreasingPropertyDiagram, UpsetCoverDiagram, EllDiagram, FragmentConstructionDiagram, TerminationDiagram.
   - These were placed in the appropriate sections of the article.

6. **IncreasingPropertyDiagram rendering issues.**
   - The F region (shaded upper area of the circle) wasn't rendering correctly — the path that traced the top arc of the circle was misaligned, leaving gaps.
   - Josh asked for an `feComposite atop` SVG filter approach.
   - First attempt used `feImage href="#id"` to reference the drawn circle, but this had coordinate-space bugs across browsers — the referenced element rendered at a wrong offset, producing two circles with one displaced.
   - Fix: Used a data URI SVG (`data:image/svg+xml,...`) for the filter's base image, matching the main SVG's coordinate space exactly. The F region path was simplified to just overshoot in all directions since the atop filter clips it to the circle. Also fixed X and ∅ positions to sit at the actual top/bottom of the circle.

7. **Notation sidebar.**
   - Added a persistent fixed sidebar on the right with key definitions.
   - Initially created as an inline `<details>` element, but Josh wanted it persistent while reading.
   - Converted to a `position: fixed` sidebar that stays visible during scrolling, hidden on screens < 1200px.
   - Added mini SVG icons as visual mnemonics for 6 key concepts: increasing property, random subset, ℓ parameter, upset, minimum fragment, and nibbling rounds.

8. **Deployment.** Set up GitHub repo, GitHub Actions workflow, and GitHub Pages.

### What worked well

- The "fastish algorithms" style reference gave a clear target for tone and visual design.
- SolidJS + inline SVG is a good combo for reactive diagrams — signals directly drive SVG attributes with no virtual DOM overhead.
- The shared graph layout pattern solved the visual consistency problem cleanly.
- Mini SVG icons in the sidebar are effective visual memory aids at small size.
- Going from zero to deployed article in one session.

### What didn't work well

- **SVG `feImage href="#id"`** for referencing internal elements has cross-browser coordinate-space issues. Data URI SVGs are more reliable for filter base images.
- **Path-tracing circle arcs** for the F region was fragile — trying to manually compute arc points led to misalignment. Better to overshoot and let clipping/compositing handle containment.
- **Initial graph inconsistency** across demos was disorienting. Should have planned a shared layout from the start.

### Open questions / future work

- Are the diagrams actually correct and helpful? Need to verify against the paper more carefully.
- Could add more interactivity to the static diagrams (e.g. hovering over notation in sidebar highlights the relevant diagram in the text).
- GoFish as a diagram target — what would it need?

## Session 2 — Concrete Examples & Pedagogy

### What happened

1. **New Section 1: "Phase Transitions Are Everywhere."** Josh wanted the article to start with concrete, relatable examples before abstracting. Added six subsections: triangles, connectivity, perfect matchings, Hamilton cycles, percolation, and random 3-SAT. Included a threshold timeline SVG diagram (inspired by Jinyoung Park's talk slide) and a summary table showing all examples side by side (property, setting, threshold, key result).

2. **Restructured old Section 1 → Section 2: "The Common Thread: Increasing Properties."** The abstraction into increasing properties now comes *after* the concrete examples, so the reader has a bank of intuition to draw on. Added an explicit "The Abstraction, Concretely" table that maps four examples onto the notation: what is X? what is F? what are the minimal elements? This was prompted by Josh's feedback: "Why do we study F? Can you map that onto a specific example?"

3. **Renumbered all sections** (now 1–9 instead of 1–8).

4. **Fixed IncreasingPropertyDiagram bugs.**
   - The ℱ label used Unicode `\u2131` which rendered as unreadable cursive on many systems. Replaced with a `foreignObject` embedding `<M tex="\mathcal{F}" />` at 20px — now matches KaTeX rendering in the text exactly.
   - The "adding elements" arrow pointed *left* instead of *up*. Root cause: the marker path drew an upward chevron in marker-local coords, but `orient="auto"` rotated it -90° to match the upward line direction, turning "up" into "left." Fixed by making the marker path point in the +x direction so auto-rotation gives the correct result.

5. **Added example-table CSS** for the summary and abstraction tables (clean, minimal styling that works inside `.box` containers).

### Design insights

- **Concrete-first pedagogy works.** The article was hard to follow when it jumped straight to "increasing property F ⊆ 2^X." Starting with triangles, connectivity, and percolation gives the reader something to hold onto before the abstraction.
- **Explicit notation mapping tables** bridge the gap between concrete intuition and abstract notation. "F is the collection of all edge-sets that contain a triangle" is much clearer than "F is an increasing property."
- **SVG marker orient="auto"** rotates the marker to match the line direction. Markers should point in the +x direction in their local coordinate system, since that's the "forward" direction for orient="auto."
- **foreignObject in SVG** is the cleanest way to embed KaTeX-rendered math inside diagrams, avoiding Unicode rendering inconsistencies across platforms.
