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

## Session 3 — Large-n Interactives, Percolation, and Ladder of Abstraction

### What happened

1. **Upgraded to large-n interactives.** The original 7-vertex ring graphs had very gradual phase transitions — not visually compelling. Replaced them with n=100 versions:
   - `LargeRandomGraph.tsx`: 100-vertex random graph for triangle detection (later demoted to text-only).
   - `LargeConnectivityGraph.tsx`: 100-vertex random graph colored by connected component, with chart showing largest-component fraction.

2. **Found and fixed edge activation bug.** Both large-n components used `e.birth < p() / maxP` instead of `e.birth < p()`, which mapped p=0.005 to activating 4.2% of edges instead of 0.5%. This caused giant components to appear far below the theoretical threshold.

3. **Created PercolationGrid.tsx.** 25×25 bond percolation grid with:
   - Component coloring (top 7 components get unique colors, rest gray).
   - Top-to-bottom BFS path highlighting in yellow.
   - Two charts: largest cluster fraction (top) and depth from top row (bottom).
   - Threshold line at p=1/2.

4. **Restructured Section 1 interactives.** Percolation became the lead interactive, connectivity second. Triangles demoted to text-only (no interactive). Updated App.tsx imports accordingly.

5. **Added trial distribution curves.** For both percolation and connectivity, computed 100 additional trials with different random seeds and rendered their trajectories as gray background lines. This creates a "ladder of abstraction" effect: individual instance → distribution of trials → aggregate probability curve, all visible on the same chart.

6. **Fixed Pr[connected] mismatch.** The original theoretical connectivity curve used `exp(-exp(-(p*(N-1)-ln(N))))` which measures Pr[fully connected]. But gray trial curves showed largest-component/n, which reaches ~1 much earlier (when the giant component forms at p≈1/n vs full connectivity at p≈ln(n)/n). Replaced the theoretical curve with empirical Pr[connected] computed from all 101 trials (fraction with max component size = N at each p). This correctly rises where individual curves go from ~0.97 to exactly 1.0.

7. **Consistent chart styling.** Made percolation and connectivity charts use the same color language:
   - **Orange dashed** = this specific random instance
   - **Blue solid** = aggregate calculation (average or empirical probability)
   - **Gray** = individual trial curves (100 background trials)
   - Each chart has a matching legend.

8. **k-SAT text update.** The k-SAT threshold is still conjectured (not proven by Kahn-Kalai). Kahn-Kalai applies but gives a bound with an O(log n) factor of slack because minimal unsatisfiable subformulas have size Ω(n). Updated the article text to note the threshold is conjectured and that Kahn-Kalai pins it down up to a log factor.

9. **Optimized percolation depth computation.** Instead of scanning all 625 nodes per checkpoint to find the deepest row reachable from the top, maintain `maxRow[root]` per component root during union operations and only check 25 top-row nodes at each checkpoint.

### Design insights

- **Ladder of abstraction in practice.** Showing gray trial curves behind the aggregate curve is very effective pedagogy. You see individual behavior (noisy, different each time), the distribution (gray spread), and the aggregate (blue average or probability), all at once. The interactive marker lets you "play" the specific instance while the charts show where it fits in the distribution.

- **"Largest component / n" vs "Pr[connected]" are very different.** The giant component emerges at p ≈ 1/n, but full connectivity requires p ≈ ln(n)/n. These are different phase transitions with different thresholds. Plotting both on the same chart without labeling them correctly caused user confusion.

- **Percolation is the best lead example.** The grid layout makes phase transition structure visually obvious — isolated clusters → complex structure near p=1/2 → full connectivity. Circle-layout random graphs are harder to read visually.

- **Triangle detection is a poor interactive example.** Going from 0 to 1 triangle is essentially a binary event for a single graph instance, making the "transition" feel abrupt rather than illustrating gradual structural change.

### Technical notes

- Seeded PRNG for trial variation: `seeded(idx * 17 + 42 + (trial + 1) * 997)` — the `* 997` stride between trials produces good independence.
- Union-find with path compression and union-by-rank throughout.
- Precomputed sweeps: sort edges/bonds by birth time, process incrementally at 201 p-value checkpoints. This is O(E log E) per trial, done at module load time.

## Session 4 — Diagram Fixes, Text Clarifications, and Proof Reformulation

### What happened

1. **Fixed EllDiagram.** Applied the same fixes as IncreasingPropertyDiagram: replaced Unicode ℱ/ℓ with `foreignObject` + KaTeX `<M>` for consistent fonts. Placed minimal elements exactly on the wavy boundary (parametric `wavyPoint(t)` instead of hardcoded positions). Made F region span full circle width using clipPath approach.

2. **Fixed black circle backgrounds.** The `feImage` data URI approach for the `feComposite atop` filter wasn't loading in some browsers, leaving the lower half of circles black. Replaced with simpler `clipPath` approach in both EllDiagram and IncreasingPropertyDiagram: draw filled circle first, clip the F region and wavy boundary to it.

3. **Fixed ∅ dots.** Changed the ∅ indicator dots at the bottom of circles from filled gray to white fill with gray stroke, across EllDiagram, IncreasingPropertyDiagram, and UpsetCoverDiagram.

4. **Clarified threshold location vs sharpness.** Added a paragraph at the end of Section 1 explicitly distinguishing two questions: how *sharp* the transition is (Friedgut–Kalai) vs *where* it occurs (Kahn–Kalai). Updated the abstract and Section 4 intro to say "location" explicitly.

5. **Added "threshold is trapped" diagram.** Based on Jinyoung Park's sketch: a number line showing q(F) (lower bound) and K·q(F)·log ℓ (upper bound) with p_c trapped in the yellow-highlighted window between them. Placed after the theorem box in Section 4.

6. **Redesigned UpsetCoverDiagram Panel 2.** Based on Jinyoung's g-covers-f sketch. The cover G is now shown as pointed "tooth" shapes rising up from below the wavy F boundary, matching the sketch's visual of upsets poking into F. Uses the same parametric wavy boundary + clipPath approach. Panel 1 also updated to use KaTeX for labels.

7. **Rewrote the reformulation subsection.** Key changes based on Jinyoung's lecture framing:
   - H is introduced as "the collection of minimal elements of F" rather than as an abstract hypergraph
   - Uses "sets" language (S ∈ H) rather than "edges" / "hyperedges"
   - Explains why Theorem 1.4 is stronger than Theorem 1.1: the containment probability goes to 1 (not just past 1/2), avoiding the arbitrary choice of 1/2 in the definition of p_c
   - Added the o_{ℓ→∞}(1) notation from the paper

8. **Added perspective-shift bridge and H diagram.** Between the conjecture section and the proof strategy, added text explaining the shift from "dots on the boundary of F" to "sets scattered across X" — like looking down at the boundary from above. Added an SVG diagram matching Jinyoung's H.png: circles of varying sizes (some overlapping to show non-disjointness) inside a rectangle labeled X, with "∈ H" legend.

9. **Smoothed transition to iterative nibbling.** Section 5 now opens with "The proof constructs W using..." connecting back to the W just introduced.

10. **Added acknowledgements section.** Credits Jinyoung Park's lecture diagrams as the basis for many of the article's diagrams.

### Design insights

- **clipPath > feComposite atop for circle regions.** The `feImage` data URI approach is fragile across browsers. `clipPath` is simpler and universally supported: draw the filled circle, then clip overlays to it.

- **foreignObject + KaTeX is the right pattern for math in SVG.** Unicode math symbols (ℱ, ℓ) render inconsistently. `foreignObject` with KaTeX matches the body text perfectly and is worth the slight verbosity.

- **Perspective shifts need explicit narration.** The jump from "F as a region in 2^X" to "H as sets in X" is a significant conceptual shift. The "looking down at the boundary from above" metaphor helps bridge it.

- **Overlapping circles matter.** Showing sets in H that overlap communicates that they are not necessarily disjoint — an important structural point that affects the proof (fragments, counting).

## Session 5 — Fragment Diagram Fix and SVG Clip Path Library

### What happened

1. **Fixed FragmentConstructionDiagram.** The original diagram drew T as an independent ellipse floating inside S — it merely *looked like* it could be S' \ W but wasn't structurally derived from S'. Josh caught that T = S' \ W wasn't visually true in the diagram.

2. **First attempt: arc intersection approach.** Computed the intersection points of S' (ellipse) with the right edge of W (line), then drew T as an explicit SVG arc path (the right portion of S' outside W). This was mathematically correct but fragile — changing the S' shape would require recomputing the intersection geometry.

3. **Second attempt: clip path approach.** Josh suggested using compositing operators consistent with other diagrams in the project. Rewrote using two clip paths:
   - `frag-insideW`: clips S' to inside W → shows S' ∩ W (purple hatched, "absorbed")
   - `frag-outsideW`: clips S' to outside W → shows T = S' \ W (red fragment)

   The "outside W" clip uses the even-odd rule: a bounding box path with W punched out as a hole. This is robust to any change in S' shape — T is always literally S' minus W.

4. **Created `svgClip.ts` utility library.** Extracted the even-odd complement pattern into reusable functions: `complementRect`, `complementCircle`, `complementEllipse`. Each takes a shape and SVG bounds, returns the even-odd path string for use in `<clipPath>` elements.

5. **Updated CLAUDE.md.** Added a "SVG set operations via clip paths" section documenting the pattern and the utility library, so future diagram work uses the same approach.

6. **Fixed caption.** Changed "S ∩ W" to "S' ∩ W" in the caption — the absorbed region is the part of S' (not S) inside W.

### Design insights

- **Structural correctness > visual approximation.** Drawing T as an independent shape that "looks right" is fragile — changing any geometry breaks the visual relationship. Deriving T from S' via clip paths makes T = S' \ W a structural invariant of the SVG, not an accident of coordinate placement.

- **Even-odd clip paths for complements.** The pattern `M <bounding box> Z M <hole shape> Z` with `clip-rule="evenodd"` reliably creates "everything outside this shape" clips. This is the SVG equivalent of set complement and should be the go-to for any set-difference rendering.

- **Library functions prevent regression.** Extracting the even-odd path generation into `svgClip.ts` means future diagrams can use `complementRect(...)` instead of hand-rolling the path strings, reducing the chance of getting the winding direction wrong.

3. **Fixed CountingDiagram** (specification argument). Same clip-path approach:
   - T = Ŝ \ W via `complementRect` clip path
   - Z boundary constructed as a single SVG path: W rectangle edges + Ŝ ellipse arc where it protrudes beyond W. This makes Z = W ∪ T exact, not an independent shape.
   - Removed the original edge S from the diagram — it's not part of the counting argument (only W, T, Z, Ŝ matter).
   - Replaced Unicode math approximations in the right-panel counting boxes with KaTeX via foreignObject.

4. **Removed FragmentDemo** (7-vertex interactive fragment explorer) from the article. The static FragmentConstructionDiagram now handles the visual explanation of fragments.
