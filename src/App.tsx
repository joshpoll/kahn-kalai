import M from "./components/Math";
import CoverDemo from "./components/CoverDemo";
import IterationDemo from "./components/IterationDemo";
import CountingDiagram from "./components/CountingDiagram";
import ProofOverview from "./components/ProofOverview";
import IncreasingPropertyDiagram from "./components/IncreasingPropertyDiagram";
import UpsetCoverDiagram from "./components/UpsetCoverDiagram";
import EllDiagram from "./components/EllDiagram";
import FragmentConstructionDiagram from "./components/FragmentConstructionDiagram";
import TerminationDiagram from "./components/TerminationDiagram";
import ConnectivityGraph from "./components/ConnectivityGraph";
import LargeConnectivityGraph from "./components/LargeConnectivityGraph";
import PercolationGrid from "./components/PercolationGrid";

export default function App() {
  return (
    <div class="page-layout">
      {/* ============ NOTATION SIDEBAR ============ */}
      <aside class="notation-sidebar">
        <h3>Notation</h3>
        <table>
          <tbody>
            <tr>
              <td><M tex="X" /></td>
              <td>Finite ground set</td>
            </tr>
            <tr>
              <td><M tex="2^X" /></td>
              <td>Power set (all subsets of <M tex="X" />)</td>
            </tr>
            <tr>
              <td><M tex="\mathcal{F}" /></td>
              <td>
                Increasing property on <M tex="X" />
                {/* Mini icon: circle with blue upper region */}
                <svg class="mini-icon" width="120" height="44" viewBox="0 0 120 44">
                  <circle cx="22" cy="22" r="20" fill="#f8fafc" stroke="#64748b" stroke-width="1" />
                  <clipPath id="mi-circ"><circle cx="22" cy="22" r="19" /></clipPath>
                  <path d="M 2 24 Q 12 20 22 26 Q 32 32 42 22 L 42 2 L 2 2 Z"
                    fill="#dbeafe" fill-opacity="0.6" clip-path="url(#mi-circ)" />
                  <path d="M 2 24 Q 12 20 22 26 Q 32 32 42 22"
                    fill="none" stroke="#2563eb" stroke-width="1.2" clip-path="url(#mi-circ)" />
                  <text x="50" y="16" font-size="9" fill="#555">If A {"\u2208"} {"\u2131"},</text>
                  <text x="50" y="28" font-size="9" fill="#555">B {"\u2287"} A {"\u21D2"} B {"\u2208"} {"\u2131"}</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="X_p" /></td>
              <td>
                Random subset, each element kept with prob <M tex="p" />
                {/* Mini icon: dots, some filled some hollow */}
                <svg class="mini-icon" width="120" height="24" viewBox="0 0 120 24">
                  <circle cx="8" cy="12" r="5" fill="#2563eb" />
                  <circle cx="26" cy="12" r="5" fill="none" stroke="#cbd5e1" stroke-width="1.2" />
                  <circle cx="44" cy="12" r="5" fill="#2563eb" />
                  <circle cx="62" cy="12" r="5" fill="#2563eb" />
                  <circle cx="80" cy="12" r="5" fill="none" stroke="#cbd5e1" stroke-width="1.2" />
                  <text x="94" y="16" font-size="9" fill="#94a3b8">{"\u2190"} p</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="p_c" /></td>
              <td>Threshold: <M tex="\Pr[X_p \in \mathcal{F}] = 1/2" /></td>
            </tr>
            <tr>
              <td><M tex="q" /></td>
              <td>Expectation threshold: largest <M tex="p" /> with a cheap cover</td>
            </tr>
            <tr>
              <td><M tex="\ell" /></td>
              <td>
                Max size of a minimal element of <M tex="\mathcal{F}" />
                {/* Mini icon: dots of different sizes, largest highlighted */}
                <svg class="mini-icon" width="120" height="28" viewBox="0 0 120 28">
                  <ellipse cx="12" cy="16" rx="8" ry="5" fill="#fed7aa" stroke="#ea580c" stroke-width="1" />
                  <text x="12" y="19" text-anchor="middle" font-size="7" fill="#ea580c">2</text>
                  <ellipse cx="36" cy="16" rx="10" ry="6" fill="#fed7aa" stroke="#ea580c" stroke-width="1" />
                  <text x="36" y="19" text-anchor="middle" font-size="7" fill="#ea580c">3</text>
                  <ellipse cx="64" cy="15" rx="14" ry="8" fill="#fecaca" stroke="#dc2626" stroke-width="1.5" />
                  <text x="64" y="18" text-anchor="middle" font-size="7" font-weight="700" fill="#dc2626">5</text>
                  <text x="86" y="10" font-size="8" fill="#dc2626">{"\u2190"} {"\u2113"}</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="\langle\mathcal{G}\rangle" /></td>
              <td>
                Upset: all supersets of members
                {/* Mini icon: upward cone from a point */}
                <svg class="mini-icon" width="120" height="44" viewBox="0 0 120 44">
                  <circle cx="22" cy="22" r="20" fill="#f8fafc" stroke="#64748b" stroke-width="1" />
                  <clipPath id="mi-circ2"><circle cx="22" cy="22" r="19" /></clipPath>
                  <path d="M 22 32 Q 8 18 6 4 L 38 4 Q 36 18 22 32 Z"
                    fill="#7c3aed" fill-opacity="0.12"
                    stroke="#7c3aed" stroke-width="1" stroke-dasharray="2,2"
                    clip-path="url(#mi-circ2)" />
                  <circle cx="22" cy="32" r="3" fill="#7c3aed" />
                  <text x="50" y="14" font-size="9" fill="#555">Everything</text>
                  <text x="50" y="26" font-size="9" fill="#555">above A</text>
                  <text x="50" y="38" font-size="9" fill="#7c3aed" font-weight="600">= {"\u27E8"}A{"\u27E9"}</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="\mathcal{H}" /></td>
              <td>Hypergraph (collection of edges/subsets)</td>
            </tr>
            <tr>
              <td><M tex="T(S,W)" /></td>
              <td>
                Min fragment: smallest <M tex="S'\!\setminus W" />
                {/* Mini icon: W rect + S oval + T piece */}
                <svg class="mini-icon" width="140" height="40" viewBox="0 0 140 40">
                  <rect x="2" y="2" width="40" height="36" rx="2"
                    fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="1" />
                  <text x="22" y="38" text-anchor="middle" font-size="7" fill="#2563eb">W</text>
                  <ellipse cx="52" cy="20" rx="28" ry="14"
                    fill="#ea580c" fill-opacity="0.08" stroke="#ea580c" stroke-width="1" />
                  <text x="68" y="14" font-size="7" fill="#ea580c">S</text>
                  {/* Overlap hatching */}
                  <clipPath id="mi-cw"><rect x="2" y="2" width="40" height="36" /></clipPath>
                  <ellipse cx="52" cy="20" rx="28" ry="14"
                    fill="#7c3aed" fill-opacity="0.12" clip-path="url(#mi-cw)" />
                  {/* T region */}
                  <ellipse cx="68" cy="18" rx="10" ry="8"
                    fill="#dc2626" fill-opacity="0.15" stroke="#dc2626" stroke-width="1.5" />
                  <text x="68" y="21" text-anchor="middle" font-size="8" font-weight="700" fill="#dc2626">T</text>
                  <text x="90" y="14" font-size="8" fill="#dc2626">= S'{"\u2216"}W</text>
                  <text x="90" y="26" font-size="7" fill="#555">leftover</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="\gamma" /></td>
              <td>
                Nibbling rounds
                {/* Mini icon: shrinking bars */}
                <svg class="mini-icon" width="120" height="24" viewBox="0 0 120 24">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const h = 20 - i * 3.5;
                    return (
                      <rect x={i * 18} y={22 - h} width="12" height={h} rx="1"
                        fill={i < 4 ? "#93c5fd" : "#fca5a5"}
                        stroke={i < 4 ? "#2563eb" : "#dc2626"}
                        stroke-width="0.8" />
                    );
                  })}
                  <text x="96" y="20" font-size="8" fill="#dc2626">&lt;1</text>
                </svg>
              </td>
            </tr>
            <tr>
              <td><M tex="W_i" /></td>
              <td>Random set at round <M tex="i" /></td>
            </tr>
            <tr>
              <td><M tex="\mathcal{U}_i" /></td>
              <td>Cover built at round <M tex="i" /> from large fragments</td>
            </tr>
          </tbody>
        </table>
      </aside>

      <div class="page-main">
      {/* ============ HEADER ============ */}
      <header>
        <h1>A Proof of the Kahn&ndash;Kalai Conjecture</h1>
        <div class="subtitle">An Illustrated Guide</div>
        <div class="authors">
          Based on the paper by Jinyoung Park &amp; Huy Tuan Pham
          &nbsp;&middot;&nbsp;
          <a href="https://arxiv.org/abs/2203.17207" target="_blank">
            arXiv:2203.17207
          </a>
        </div>
      </header>

      {/* ============ ABSTRACT ============ */}
      <div class="abstract">
        <strong>Abstract.</strong>&ensp;
        In 2022, Park and Pham proved the Kahn&ndash;Kalai conjecture, which
        pins down the <em>location</em> of the threshold for any increasing
        property: it is always within a logarithmic factor of the &ldquo;expectation
        threshold&rdquo;&mdash;the most naive lower bound. Their proof is remarkably short: a two-page
        argument built on one key idea. This guide provides a visual,
        step-by-step walkthrough of the proof, starting from scratch.
      </div>

      {/* ============ TOC ============ */}
      <nav class="toc">
        <h2>Contents</h2>
        <ol>
          <li><a href="#sec-examples">Phase Transitions Are Everywhere</a></li>
          <li><a href="#sec-structure">The Common Thread: Increasing Properties</a></li>
          <li><a href="#sec-guess">How Would You Guess the Threshold?</a></li>
          <li><a href="#sec-conjecture">The Conjecture: Your Guess Is (Almost) Right</a></li>
          <li><a href="#sec-strategy">Proof Strategy: Iterative Nibbling</a></li>
          <li><a href="#sec-fragments">The Secret Weapon: Minimum Fragments</a></li>
          <li><a href="#sec-counting">Why Fragments Make Counting Easy</a></li>
          <li><a href="#sec-iteration">Putting It Together: The Iteration</a></li>
          <li><a href="#sec-punchline">The Punchline</a></li>
        </ol>
      </nav>

      {/* ============ SECTION 1: CONCRETE EXAMPLES ============ */}
      <section id="sec-examples">
        <h2>1 &ensp; Phase Transitions Are Everywhere</h2>

        <p>
          Take a graph on <M tex="n" /> vertices and include each possible edge
          independently with probability <M tex="p" />. When <M tex="p" /> is
          tiny, the graph is a barren scattering of isolated vertices and stray
          edges. When <M tex="p" /> is large, it&rsquo;s a dense tangle where
          everything is connected to everything. The surprise is how suddenly
          interesting structure appears: not gradually, but in an abrupt{" "}
          <em class="concept">phase transition</em> at a critical value of{" "}
          <M tex="p" />.
        </p>

        <p>
          Here are some of the most famous examples.
        </p>

        <h3>Triangles</h3>
        <p>
          Does the random graph contain a triangle? When{" "}
          <M tex="p \ll n^{-1}" />, the expected number of triangles is close to
          zero and almost surely none exist. But once{" "}
          <M tex="p \gg n^{-1}" />, triangles appear in abundance. The
          transition is sharp: near <M tex="p = 1/n" />, the probability jumps
          from near 0 to near 1.
        </p>

        <h3>Connectivity</h3>
        <p>
          Is the random graph connected&mdash;can you get from any vertex to any
          other? Erd&#337;s and R&eacute;nyi showed in 1959 that the threshold
          is <M tex="p_c = \log(n)/n" />. Below this, the graph almost surely
          has isolated vertices. Above it, everything snaps together into one
          giant component. The bottleneck is the last isolated vertex: once
          every vertex has at least one edge, the graph is (almost surely)
          connected.
        </p>

        <LargeConnectivityGraph />

        <h3>Perfect matchings</h3>
        <p>
          Can you pair up all <M tex="n" /> vertices (with <M tex="n" /> even)
          so that every pair is connected by an edge? Again, the threshold is{" "}
          <M tex="p_c = \log(n)/n" />&mdash;the same as connectivity! The
          bottleneck is the same: isolated vertices prevent both connectivity
          and perfect matchings, and once they vanish, both properties appear.
        </p>

        <h3>Hamilton cycles</h3>
        <p>
          A Hamilton cycle visits every vertex exactly once and returns to the
          start. Pinpointing this threshold was a major achievement
          (P&oacute;sa &rsquo;76, Bollob&aacute;s &rsquo;84,
          Ajtai&ndash;Koml&oacute;s&ndash;Szemer&eacute;di &rsquo;85): it
          happens at <M tex="p_c = \log(n)/n" /> as well, but proving it
          required fundamentally new techniques. The coincidence of several
          thresholds at <M tex="\log(n)/n" /> is itself a deep fact.
        </p>

        <h3>Percolation</h3>
        <p>
          Instead of a random graph, consider a grid. Open each cell (or bond)
          independently with probability <M tex="p" />. Does a connected path of
          open cells stretch from top to bottom? On a 2D square lattice the
          threshold is <M tex="p_c = 1/2" /> (bond percolation). Below it, all
          open clusters are small. Above it, an infinite connected cluster
          emerges. This model is central to statistical physics: it models the
          spread of fluids through porous rock, forest fires, and epidemics.
        </p>

        <PercolationGrid />

        <h3>Random <M tex="k" />-SAT</h3>
        <p>
          Take <M tex="m" /> random clauses, each a disjunction of{" "}
          <M tex="k" /> literals on <M tex="n" /> Boolean variables. Is the
          resulting formula satisfiable? When the clause-to-variable ratio{" "}
          <M tex="m/n" /> is small, solutions are plentiful. When{" "}
          <M tex="m/n" /> is large, the formula is almost surely
          unsatisfiable. For <M tex="k = 3" />, the transition happens near{" "}
          <M tex="m/n \approx 4.27" />, though the exact threshold is still
          conjectured. Near the transition, formulas exhibit rich
          combinatorial structure&mdash;neither easily satisfiable nor
          obviously unsatisfiable. The Kahn&ndash;Kalai theorem applies here
          (unsatisfiability is an increasing property) but only pins down the
          threshold up to a logarithmic factor.
        </p>

        {/* Threshold timeline diagram */}
        <div class="diagram-container">
          <svg width="520" height="155" viewBox="0 0 520 155">
            {/* p-axis */}
            <line x1={40} y1={30} x2={480} y2={30} stroke="#333" stroke-width={1.5} />
            <text x={35} y={28} text-anchor="end" font-size="13" fill="#333">
              p = 0
            </text>
            <text x={485} y={28} font-size="13" fill="#333">
              1
            </text>
            {/* Sparse side label */}
            <text x={80} y={18} font-size="10" fill="#94a3b8">
              sparse
            </text>
            {/* Dense side label */}
            <text x={440} y={18} font-size="10" fill="#94a3b8">
              dense
            </text>

            {/* Threshold markers */}
            {[
              { x: 120, label: "triangles", sub: "1/n", color: "#ea580c" },
              { x: 210, label: "connectivity", sub: "log n / n", color: "#2563eb" },
              { x: 285, label: "matchings", sub: "log n / n", color: "#16a34a" },
              { x: 360, label: "Hamilton", sub: "log n / n", color: "#7c3aed" },
            ].map((t) => (
              <>
                <line x1={t.x} y1={25} x2={t.x} y2={35}
                  stroke={t.color} stroke-width={2} />
                <circle cx={t.x} cy={30} r={4}
                  fill={t.color} />
                <text x={t.x} y={52} text-anchor="middle"
                  font-size="10" font-weight="600" fill={t.color}>
                  {t.label}
                </text>
                <text x={t.x} y={65} text-anchor="middle"
                  font-size="9" fill="#888">
                  {t.sub}
                </text>
              </>
            ))}

            {/* History list */}
            <text x={40} y={95} font-size="11" font-weight="600" fill="#64748b">
              Some past results on finding thresholds:
            </text>
            {[
              "Small subgraphs (Erd\u0151s\u2013R\u00E9nyi \u201959, Bollob\u00E1s \u201981)",
              "Connectivity & perfect matchings (Erd\u0151s\u2013R\u00E9nyi \u201959/\u201966)",
              "Hamilton cycles (P\u00F3sa \u201976, Bollob\u00E1s \u201984, AKS \u201985)",
              "Clique factors (Johansson\u2013Kahn\u2013Vu \u201908), Spanning trees (Montgomery \u201919)",
            ].map((text, i) => (
              <text x={48} y={112 + i * 13} font-size="9" fill="#888">
                {"\u2022 "}{text}
              </text>
            ))}
          </svg>
          <div class="diagram-caption">
            Threshold locations for various properties of random graphs.
            Each property undergoes a sharp phase transition: near-impossible
            below its threshold, near-certain above it. Decades of work went
            into pinpointing each one individually.
          </div>
        </div>

        <p>
          Here is a summary of these examples side by side. Notice how the
          thresholds have different orders of magnitude, but each one is
          sharp&mdash;the probability jumps from near 0 to near 1 in a narrow
          window.
        </p>

        <div class="box" style={{ "border-left-color": "#64748b", background: "#fafaf9" }}>
          <span class="box-label" style={{ color: "#64748b" }}>Summary of Threshold Phenomena</span>
          <table class="example-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Setting</th>
                <th>Threshold</th>
                <th>Key result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: "#ea580c" }}>Contains a triangle</strong></td>
                <td>Random graph <M tex="G(n,p)" /></td>
                <td><M tex="1/n" /></td>
                <td>Erd&#337;s&ndash;R&eacute;nyi &rsquo;59</td>
              </tr>
              <tr>
                <td><strong style={{ color: "#2563eb" }}>Connected</strong></td>
                <td>Random graph <M tex="G(n,p)" /></td>
                <td><M tex="\log n / n" /></td>
                <td>Erd&#337;s&ndash;R&eacute;nyi &rsquo;59</td>
              </tr>
              <tr>
                <td><strong style={{ color: "#16a34a" }}>Perfect matching</strong></td>
                <td>Random graph <M tex="G(n,p)" /></td>
                <td><M tex="\log n / n" /></td>
                <td>Erd&#337;s&ndash;R&eacute;nyi &rsquo;66</td>
              </tr>
              <tr>
                <td><strong style={{ color: "#7c3aed" }}>Hamilton cycle</strong></td>
                <td>Random graph <M tex="G(n,p)" /></td>
                <td><M tex="\log n / n" /></td>
                <td>P&oacute;sa &rsquo;76, Bollob&aacute;s &rsquo;84, AKS &rsquo;85</td>
              </tr>
              <tr>
                <td><strong>Percolation</strong></td>
                <td>2D square lattice</td>
                <td><M tex="1/2" /></td>
                <td>Kesten &rsquo;80</td>
              </tr>
              <tr>
                <td><strong>3-SAT</strong></td>
                <td>Random formula, <M tex="m" /> clauses</td>
                <td><M tex="m/n \approx 4.27" /></td>
                <td>Conjectured; bounds proven</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          These thresholds raise two separate questions: <em>how sharp</em> is
          the transition, and <em>where</em> does it occur? Sharpness&mdash;the
          fact that the probability jumps from near 0 to near 1 in a narrow
          window&mdash;is itself a deep topic (the Friedgut&ndash;Kalai theorem
          gives broad conditions for it). But even once you know a transition is
          sharp, <em>locating</em> the threshold is a different challenge
          entirely. In each case above, researchers spent years pinpointing
          exactly where the threshold sits. Each proof required deep,
          property-specific techniques. Is there a <em>universal</em> principle
          that governs all these threshold <em>locations</em> at once?
        </p>
      </section>

      {/* ============ SECTION 2: ABSTRACT FRAMEWORK ============ */}
      <section id="sec-structure">
        <h2>2 &ensp; The Common Thread: Increasing Properties</h2>

        <p>
          All of the examples above share a common structure. &ldquo;Contains a
          triangle,&rdquo; &ldquo;is connected,&rdquo; &ldquo;has a Hamilton
          cycle,&rdquo; &ldquo;has a crossing cluster&rdquo;&mdash;each of these
          is an <em class="concept">increasing property</em>. If you have a
          graph with a triangle and you add more edges, you still have a
          triangle. If a graph is connected and you add edges, it stays
          connected. Adding elements can never destroy the property.
        </p>

        <p>
          To make this precise, we introduce some notation. The{" "}
          <em class="concept">ground set</em> <M tex="X" /> is the set of all
          &ldquo;things that could be present.&rdquo; A{" "}
          <em class="concept">property</em>{" "}
          <M tex="\mathcal{F} \subseteq 2^X" /> is a collection of subsets of{" "}
          <M tex="X" />&mdash;the subsets that &ldquo;have the property.&rdquo;
          We say <M tex="\mathcal{F}" /> is <strong>increasing</strong> if
          adding elements never destroys it: when{" "}
          <M tex="A \in \mathcal{F}" /> and <M tex="B \supseteq A" />, then{" "}
          <M tex="B \in \mathcal{F}" />.
        </p>

        <p>
          A <em class="concept">random subset</em> <M tex="X_p" /> includes each
          element of <M tex="X" /> independently with probability <M tex="p" />.
          The question &ldquo;does the random graph have a triangle?&rdquo;
          becomes: &ldquo;does <M tex="X_p \in \mathcal{F}" />?&rdquo;
        </p>

        <p>
          Here is how each concrete example from Section 1 maps into this
          framework:
        </p>

        <div class="box">
          <span class="box-label">The Abstraction, Concretely</span>
          <table class="example-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Ground set <M tex="X" /></th>
                <th><M tex="\mathcal{F}" /> = sets of edges that...</th>
                <th>Minimal elements</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: "#ea580c" }}>Triangles</strong></td>
                <td>All <M tex="\binom{n}{2}" /> possible edges</td>
                <td>contain at least one triangle</td>
                <td>Individual triangles (3 edges each)</td>
              </tr>
              <tr>
                <td><strong style={{ color: "#2563eb" }}>Connectivity</strong></td>
                <td>All <M tex="\binom{n}{2}" /> possible edges</td>
                <td>form a connected graph</td>
                <td>
                  Spanning trees (<M tex="n{-}1" /> edges each)
                </td>
              </tr>
              <tr>
                <td><strong style={{ color: "#7c3aed" }}>Hamilton cycle</strong></td>
                <td>All <M tex="\binom{n}{2}" /> possible edges</td>
                <td>contain a Hamilton cycle</td>
                <td>
                  Hamilton cycles (<M tex="n" /> edges each)
                </td>
              </tr>
              <tr>
                <td><strong style={{ color: "#16a34a" }}>Percolation</strong></td>
                <td>All bonds in the lattice</td>
                <td>have a top-to-bottom crossing</td>
                <td>Minimal crossing paths</td>
              </tr>
            </tbody>
          </table>
          <p style={{ "margin-top": "12px" }}>
            In each case, <M tex="\mathcal{F}" /> is enormous&mdash;it contains
            all edge sets that have the property, including every possible
            superset. But the <strong>minimal elements</strong> are compact: the
            smallest witnesses that force the property to hold.
          </p>
        </div>

        <IncreasingPropertyDiagram />

        <p>
          The <em class="concept">minimal elements</em> live along the boundary
          of <M tex="\mathcal{F}" /> in the diagram above. Everything above
          them (every superset) is also in <M tex="\mathcal{F}" />. The entire
          property is determined by its minimal elements:{" "}
          <M tex="\mathcal{F}" /> is exactly the set of all supersets of at
          least one minimal element.
        </p>

        <div class="box definition">
          <span class="box-label">Definition: Threshold</span>
          <p>
            The <strong>threshold</strong>{" "}
            <M tex="p_c(\mathcal{F})" /> is the unique <M tex="p" /> for which
          </p>
          <M tex="\mu_p(\mathcal{F}) := \Pr[X_p \in \mathcal{F}] = \tfrac{1}{2}." display />
        </div>

        <p>
          Every increasing property has a threshold, and the examples from
          Section 1 are all instances of this framework. But computing{" "}
          <M tex="p_c(\mathcal{F})" /> for a given <M tex="\mathcal{F}" /> is
          typically hard. Can we at least <em>estimate</em> it?
        </p>
      </section>

      {/* ============ SECTION 2 ============ */}
      <section id="sec-guess">
        <h2>3 &ensp; How Would You Guess the Threshold?</h2>

        <p>
          Here is the most naive approach. An increasing property{" "}
          <M tex="\mathcal{F}" /> holds if and only if our random set{" "}
          <M tex="X_p" /> contains some &ldquo;witness&rdquo;&mdash;some
          minimal set <M tex="S" /> that forces membership in{" "}
          <M tex="\mathcal{F}" />. For the triangle property, the witnesses are
          the individual triangles.
        </p>

        <p>
          A <em class="concept">cover</em> of <M tex="\mathcal{F}" /> is a
          collection <M tex="\mathcal{G}" /> of sets such that every member of{" "}
          <M tex="\mathcal{F}" /> contains some <M tex="S \in \mathcal{G}" />.
          By a union bound:
        </p>

        <M
          tex="\Pr[X_p \in \mathcal{F}] \;\leq\; \Pr[X_p \in \langle \mathcal{G} \rangle] \;\leq\; \sum_{S \in \mathcal{G}} p^{|S|}."
          display
        />

        <p>
          The sum <M tex="\sum_{S \in \mathcal{G}} p^{|S|}" /> is the{" "}
          <em class="concept">cost</em> of the cover. If we can find a cover
          with cost at most <M tex="1/2" />, then{" "}
          <M tex="\Pr[X_p \in \mathcal{F}] \leq 1/2" />, which means we are
          below the threshold: <M tex="p \leq p_c(\mathcal{F})" />.
        </p>

        <div class="box definition">
          <span class="box-label">Definition: <M tex="p" />-small &amp; Expectation Threshold</span>
          <p>
            We say <M tex="\mathcal{F}" /> is{" "}
            <strong><M tex="p" />-small</strong> if there exists a cover{" "}
            <M tex="\mathcal{G}" /> with cost{" "}
            <M tex="\sum_{S \in \mathcal{G}} p^{|S|} \leq 1/2" />.
          </p>
          <p>
            The <strong>expectation threshold</strong>{" "}
            <M tex="q(\mathcal{F})" /> is the largest <M tex="p" /> for which{" "}
            <M tex="\mathcal{F}" /> is <M tex="p" />-small.
          </p>
        </div>

        <UpsetCoverDiagram />

        <p>
          By the union bound argument above, we always have{" "}
          <M tex="q(\mathcal{F}) \leq p_c(\mathcal{F})" />: the expectation
          threshold is a trivial lower bound on the real threshold. The
          question is: <em>how good is this naive bound?</em>
        </p>

        <CoverDemo />

        <p>
          For many specific properties, mathematicians have
          shown&mdash;through often heroic effort&mdash;that{" "}
          <M tex="q(\mathcal{F})" /> and <M tex="p_c(\mathcal{F})" /> are
          actually of the same order. But is this <em>always</em> true?
        </p>
      </section>

      {/* ============ SECTION 3 ============ */}
      <section id="sec-conjecture">
        <h2>4 &ensp; The Conjecture: Your Guess Is (Almost) Right</h2>

        <p>
          In 2007, Kahn and Kalai made a bold conjecture about threshold
          location: no matter the property, the threshold is always within a
          logarithmic factor of the expectation threshold.
        </p>

        <div class="box">
          <span class="box-label">Theorem 1.1 (The Kahn&ndash;Kalai Conjecture)</span>
          <p>
            There is a universal constant <M tex="K" /> such that for every
            finite set <M tex="X" /> and nontrivial increasing{" "}
            <M tex="\mathcal{F} \subseteq 2^X" />,
          </p>
          <M
            tex="p_c(\mathcal{F}) \;\leq\; K \cdot q(\mathcal{F}) \cdot \log \ell(\mathcal{F}),"
            display
          />
          <p>
            where <M tex="\ell(\mathcal{F}) = \max(\ell_0(\mathcal{F}), 2)" />{" "}
            and <M tex="\ell_0(\mathcal{F})" /> is the size of the largest
            minimal element of <M tex="\mathcal{F}" />.
          </p>
        </div>

        <EllDiagram />

        <p>
          The implication: if the conjecture is true, the location of the
          threshold is trapped in a narrow window.
        </p>

        {/* Threshold-is-trapped diagram */}
        <div class="diagram-container">
          <svg width="480" height="90" viewBox="0 0 480 90">
            {/* Number line */}
            <line x1={40} y1={45} x2={440} y2={45} stroke="#64748b" stroke-width={1.5} />
            <line x1={40} y1={45} x2={46} y2={40} stroke="#64748b" stroke-width={1.5} />
            <line x1={440} y1={45} x2={434} y2={40} stroke="#64748b" stroke-width={1.5} />

            {/* Left tick: q(F) */}
            <line x1={120} y1={35} x2={120} y2={55} stroke="#2563eb" stroke-width={2} />
            <foreignObject x={60} y={56} width={120} height={30}>
              <div style={{ "text-align": "center", "font-size": "14px", color: "#2563eb" }}>
                <M tex="q(\mathcal{F})" />
              </div>
            </foreignObject>

            {/* Right tick: K · q(F) · log ℓ */}
            <line x1={360} y1={35} x2={360} y2={55} stroke="#dc2626" stroke-width={2} />
            <foreignObject x={270} y={56} width={180} height={30}>
              <div style={{ "text-align": "center", "font-size": "14px", color: "#dc2626" }}>
                <M tex="K \cdot q(\mathcal{F}) \cdot \log \ell" />
              </div>
            </foreignObject>

            {/* Middle region: p_c trapped */}
            <rect x={120} y={38} width={240} height={14} rx={3} fill="#fef3c7" fill-opacity={0.6} />
            <line x1={240} y1={37} x2={240} y2={53} stroke="#ea580c" stroke-width={2} />
            <foreignObject x={190} y={6} width={100} height={30}>
              <div style={{ "text-align": "center", "font-size": "14px", "font-weight": "700", color: "#ea580c" }}>
                <M tex="p_c(\mathcal{F})" />
              </div>
            </foreignObject>

            {/* Bracket underneath the window */}
            <text x={58} y={45} font-size="10" fill="#999">0</text>
            <text x={445} y={49} font-size="10" fill="#999">1</text>
          </svg>
          <div class="diagram-caption">
            The threshold <M tex="p_c(\mathcal{F})" /> is trapped between the
            expectation threshold <M tex="q(\mathcal{F})" /> (always a lower
            bound) and the Kahn&ndash;Kalai upper bound{" "}
            <M tex="K \cdot q(\mathcal{F}) \cdot \log \ell(\mathcal{F})" />.
            The gap is at most a logarithmic factor.
          </div>
        </div>

        <p>
          In other words: the most naive estimate of the threshold&mdash;the
          one you get by just taking a union bound over a carefully chosen
          cover&mdash;is essentially tight, up to a logarithmic correction. The
          logarithmic factor depends only on{" "}
          <M tex="\ell" />, the size of the largest &ldquo;witness.&rdquo;
        </p>

        <blockquote>
          &ldquo;It would probably be more sensible to conjecture that it is not
          true.&rdquo;
          <cite>&mdash; Jeff Kahn and Gil Kalai, 2007</cite>
        </blockquote>

        <p>
          The conjecture was considered audacious because it applies to{" "}
          <em>every</em> increasing property, no matter how complex. Previous
          results like the Johansson&ndash;Kahn&ndash;Vu theorem on perfect
          matchings in hypergraphs, or Montgomery&rsquo;s theorem on spanning
          trees, each required deep, property-specific arguments. The
          conjecture says all these results (and infinitely many more) follow
          from a single, universal principle.
        </p>

        <p>
          In 2022, Park and Pham proved it. Their proof is two pages long.
        </p>

        <h3>The reformulation</h3>

        <p>
          Rather than working with <M tex="\mathcal{F}" /> directly, the proof
          operates on <M tex="\mathcal{H}" />, the collection of{" "}
          <em>minimal elements</em> of <M tex="\mathcal{F}" />. Since{" "}
          <M tex="\mathcal{F}" /> is increasing, it is completely determined by
          its minimal elements: <M tex="\mathcal{F} = \langle \mathcal{H} \rangle" />,
          the upset of <M tex="\mathcal{H}" />. (In the language of
          hypergraph theory, <M tex="\mathcal{H}" /> is a collection of
          subsets of <M tex="X" />&mdash;each set{" "}
          <M tex="S \in \mathcal{H}" /> is a minimal &ldquo;witness&rdquo; for
          the property.) We say <M tex="\mathcal{H}" /> is{" "}
          <M tex="\ell" />-bounded if every set in <M tex="\mathcal{H}" /> has
          size at most <M tex="\ell" />.
        </p>

        <p>
          The key theorem Park and Pham prove is actually slightly stronger
          than Theorem 1.1:
        </p>

        <div class="box">
          <span class="box-label">Theorem 1.4</span>
          <p>
            Let <M tex="\ell \geq 2" />. There is a universal constant{" "}
            <M tex="L" /> such that for any nonempty{" "}
            <M tex="\ell" />-bounded <M tex="\mathcal{H}" /> on{" "}
            <M tex="X" /> that is <strong>not</strong>{" "}
            <M tex="p" />-small:
          </p>
          <M
            tex="\text{a uniformly random } (Lp\log\ell)|X|\text{-element subset of } X \text{ belongs to } \langle\mathcal{H}\rangle \text{ with probability } 1 - o_{\ell \to \infty}(1)."
            display
          />
        </div>

        <p>
          Translation: if no cheap cover of <M tex="\mathcal{H}" /> exists
          at price <M tex="p" /> (i.e., the property is above the expectation
          threshold), then a random set that is only a{" "}
          <M tex="\log \ell" /> factor larger will contain some{" "}
          <M tex="S \in \mathcal{H}" /> as a subset, with probability
          approaching 1.
        </p>

        <p>
          This is stronger than Theorem 1.1 in a subtle way. The
          threshold <M tex="p_c" /> is defined as the <M tex="p" /> where{" "}
          <M tex="\mu_p(\mathcal{F}) = 1/2" />&mdash;but the choice of 1/2 is
          somewhat arbitrary. Theorem 1.4 sidesteps this: it says the
          containment probability goes to 1 (not just past 1/2) once you
          are a <M tex="\log \ell" /> factor above the expectation threshold.
          Since 1 is certainly past 1/2, Theorem 1.4 immediately implies
          Theorem 1.1.
        </p>

        <p>
          So the proof goal becomes: take <M tex="\mathcal{H}" />&mdash;the
          minimal elements of <M tex="\mathcal{F}" />&mdash;and show that a
          random set <M tex="W" /> of the right size contains some{" "}
          <M tex="S \in \mathcal{H}" /> as a subset.
        </p>

        <p>
          It helps to shift perspective. In the earlier circle diagrams,
          the minimal elements were dots along the boundary
          of <M tex="\mathcal{F}" />. Now imagine looking{" "}
          <em>down</em> at that boundary from above: each minimal
          element becomes a set <M tex="S \subseteq X" />, and{" "}
          <M tex="\mathcal{H}" /> is a collection of these sets scattered
          across <M tex="X" />.
        </p>

        {/* H diagram: sets scattered in X */}
        <div class="diagram-container">
          <svg width="420" height="140" viewBox="0 0 420 140">
            {/* X rectangle */}
            <rect x={30} y={15} width={280} height={110} rx={4}
              fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />
            <foreignObject x={290} y={100} width={30} height={24}>
              <div style={{ "font-size": "13px", color: "#64748b" }}>
                <M tex="X" />
              </div>
            </foreignObject>

            {/* Sets S ∈ H as circles of varying sizes (some overlapping) */}
            {[
              { x: 62, y: 40, r: 13 },
              { x: 75, y: 55, r: 10 },
              { x: 55, y: 85, r: 9 },
              { x: 110, y: 90, r: 11 },
              { x: 125, y: 75, r: 9 },
              { x: 145, y: 38, r: 14 },
              { x: 185, y: 55, r: 12 },
              { x: 195, y: 70, r: 10 },
              { x: 235, y: 40, r: 13 },
              { x: 245, y: 55, r: 10 },
              { x: 215, y: 98, r: 9 },
              { x: 270, y: 80, r: 12 },
            ].map(({ x, y, r }) => (
              <circle cx={x} cy={y} r={r}
                fill="none" stroke="#2563eb" stroke-width={1.5} />
            ))}

            {/* Legend */}
            <circle cx={345} cy={45} r={11}
              fill="none" stroke="#2563eb" stroke-width={1.5} />
            <foreignObject x={362} y={33} width={55} height={24}>
              <div style={{ "font-size": "13px", color: "#2563eb" }}>
                <M tex="\in \mathcal{H}" />
              </div>
            </foreignObject>
          </svg>
          <div class="diagram-caption">
            The hypergraph <M tex="\mathcal{H}" />: each circle is a
            set <M tex="S \in \mathcal{H}" /> (a minimal element
            of <M tex="\mathcal{F}" />), living inside the ground
            set <M tex="X" />. The proof constructs a random
            set <M tex="W \subseteq X" /> and shows it contains some{" "}
            <M tex="S" /> entirely.
          </div>
        </div>
      </section>

      {/* ============ SECTION 4 ============ */}
      <section id="sec-strategy">
        <h2>5 &ensp; Proof Strategy: Iterative Nibbling</h2>

        <p>
          The proof constructs <M tex="W" /> using a strategy called{" "}
          <em class="concept">iterative nibbling</em>. Instead of building{" "}
          <M tex="W" /> all at once, we build it in{" "}
          <M tex="\gamma \approx \log_{0.9}(1/\ell)" /> rounds:
        </p>
        <M tex="W = W_1 \cup W_2 \cup \cdots \cup W_\gamma," display />
        <p>
          where each <M tex="W_i" /> is a random subset of size roughly{" "}
          <M tex="Lpn" /> (with <M tex="n = |X|" />). The total size of{" "}
          <M tex="W" /> is about <M tex="(Lp\log\ell)n" />, matching the
          theorem.
        </p>

        <p>
          At each round <M tex="i" />, we have a hypergraph{" "}
          <M tex="\mathcal{H}_{i-1}" /> whose edges have size at most{" "}
          <M tex="0.9^{i-1}\ell" />. We throw the random set{" "}
          <M tex="W_i" /> and split <M tex="\mathcal{H}_{i-1}" /> into two
          parts:
        </p>

        <ul>
          <li>
            <strong style={{ color: "#16a34a" }}>Covered</strong>{" "}
            (<M tex="\mathcal{G}_i" />): edges whose &ldquo;fragment&rdquo;
            after hitting <M tex="W_i" /> is still large (&ge;&nbsp;
            <M tex="0.9\ell_{i-1}" />). These get a cheap cover{" "}
            <M tex="\mathcal{U}_i" />.
          </li>
          <li>
            <strong style={{ color: "#2563eb" }}>Leftover</strong>{" "}
            (<M tex="\mathcal{H}_i" />): edges whose fragment is small. These
            form the hypergraph for the next round, with strictly smaller
            edges.
          </li>
        </ul>

        <div class="box key-idea">
          <span class="box-label">Key Idea: The Dichotomy</span>
          <p>
            After <M tex="\gamma" /> rounds, edge sizes have shrunk below 1.
            So either:
          </p>
          <p>
            (a) <M tex="\mathcal{H}_\gamma = \emptyset" />, meaning{" "}
            <M tex="\mathcal{U} = \bigcup_i \mathcal{U}_i" /> covers all of{" "}
            <M tex="\mathcal{H}" />, or
          </p>
          <p>
            (b) <M tex="\mathcal{H}_\gamma = \{\emptyset\}" />, meaning{" "}
            <M tex="W = W_1 \cup \cdots \cup W_\gamma \in \langle\mathcal{H}\rangle" />.
          </p>
          <p>
            Since <M tex="\mathcal{H}" /> is not <M tex="p" />-small, case (a)
            requires the cover to have cost &gt; 1/2. But we show the expected
            cost is tiny. By Markov&rsquo;s inequality, case (a) is
            unlikely&mdash;so case (b) holds with high probability!
          </p>
        </div>

        <ProofOverview />

        <p>
          The entire proof thus reduces to one task: showing that the cover
          built at each step has small expected cost. This is where minimum
          fragments enter.
        </p>
      </section>

      {/* ============ SECTION 5 ============ */}
      <section id="sec-fragments">
        <h2>6 &ensp; The Secret Weapon: Minimum Fragments</h2>

        <p>
          Previous approaches to these problems&mdash;by Alweiss, Lovett, Wu,
          Zhang and by Frankston, Kahn, Narayanan, Park&mdash;relied on the
          notion of <em>spread</em>, which enters via linear programming
          duality. This works for the fractional version of the conjecture,
          but for the full conjecture, LP duality is not available. Park and
          Pham found an end-run around this obstacle.
        </p>

        <div class="box definition">
          <span class="box-label">
            Definition: Minimum Fragment
          </span>
          <p>
            Given an edge <M tex="S \in \mathcal{H}" /> and a set{" "}
            <M tex="W" />, the <strong>minimum{" "}
            <M tex="(S, W)" />-fragment</strong> is
          </p>
          <M
            tex="T(S, W) = \text{the smallest } S' \setminus W \text{ among all } S' \in \mathcal{H} \text{ with } S' \subseteq W \cup S."
            display
          />
          <p>
            In words: look at all edges that &ldquo;fit inside&rdquo;{" "}
            <M tex="W \cup S" />. For each one, remove the part that{" "}
            <M tex="W" /> already covers. The smallest leftover is the minimum
            fragment.
          </p>
        </div>

        <FragmentConstructionDiagram />

        <p>
          The minimum fragment has a crucial property. Suppose we define{" "}
          <M tex="Z = W \cup T" /> (the random set plus the fragment). Then{" "}
          <M tex="Z" /> must contain some edge <M tex="\hat{S} \in \mathcal{H}" />{" "}
          (since <M tex="T = S' \setminus W" /> for some edge{" "}
          <M tex="S'" />, and <M tex="S' \subseteq Z" />). The key observation
          is:
        </p>

        <div class="box key-idea">
          <span class="box-label">The Crucial Property</span>
          <p>
            <M tex="T \subseteq \hat{S}" display /> for any edge{" "}
            <M tex="\hat{S} \subseteq Z" />.
          </p>
          <p>
            <em>Why?</em> If <M tex="\hat{S} \subseteq Z = W \cup T" />, then{" "}
            <M tex="\hat{S} \setminus W \subseteq T" />. But{" "}
            <M tex="|\hat{S} \setminus W| \geq |T|" /> by minimality of{" "}
            <M tex="T" />. So <M tex="\hat{S} \setminus W = T" />,
            hence <M tex="T \subseteq \hat{S}" />.
          </p>
        </div>

        <p>
          This property is what makes the counting argument work. In previous
          approaches, specifying the &ldquo;leftover&rdquo; required
          information about the original edge <M tex="S" />, which could be
          large. With minimum fragments, the leftover <M tex="T" /> is
          automatically contained in a <em>bounded-size</em> edge{" "}
          <M tex="\hat{S}" />, costing only <M tex="2^\ell" /> possibilities.
        </p>
      </section>

      {/* ============ SECTION 6 ============ */}
      <section id="sec-counting">
        <h2>7 &ensp; Why Fragments Make Counting Easy</h2>

        <p>
          Now we prove the heart of the argument: the cover built from large
          fragments has small expected cost.
        </p>

        <p>
          Recall: <M tex="\mathcal{G}(W)" /> collects edges whose fragment has
          size <M tex="\geq 0.9\ell" />, and{" "}
          <M tex="\mathcal{U}(W) = \{T(S,W) : S \in \mathcal{G}(W)\}" /> is
          the cover. Each element of <M tex="\mathcal{U}(W)" /> has size{" "}
          <M tex="m \geq 0.9\ell" />, so its cost is{" "}
          <M tex="p^m" />.
        </p>

        <div class="box">
          <span class="box-label">
            Lemma 2.1 (Key Lemma)
          </span>
          <p>For <M tex="W" /> uniformly random,</p>
          <M
            tex="\mathbb{E}\left[\sum_{U \in \mathcal{U}(W)} p^{|U|}\right] < L^{-0.8\ell}."
            display
          />
        </div>

        <p>
          The proof counts the total contribution by a{" "}
          <em class="concept">specification argument</em> in two steps:
        </p>

        <CountingDiagram />

        <h3>Step 1: Specify <M tex="Z = W \cup T" /></h3>
        <p>
          Since <M tex="W" /> and <M tex="T" /> are disjoint (the fragment
          is the part <em>outside</em> <M tex="W" />), we have{" "}
          <M tex="|Z| = w + m" /> where <M tex="w = Lpn" />. The number of
          choices for <M tex="Z" /> as a <M tex="(w+m)" />-subset of{" "}
          <M tex="X" /> is:
        </p>
        <M
          tex="\binom{n}{w+m} = \binom{n}{w} \cdot \prod_{j=0}^{m-1} \frac{n - w - j}{w + j + 1} \;\leq\; \binom{n}{w} (Lp)^{-m}."
          display
        />
        <p>
          The inequality uses{" "}
          <M tex="\frac{n-w-j}{w+j+1} \leq \frac{n}{w} = \frac{1}{Lp}" />.
          This is where the factor <M tex="(Lp)^{-m}" /> comes from&mdash;a
          larger <M tex="Z" /> means fewer choices relative to{" "}
          <M tex="\binom{n}{w}" />.
        </p>

        <h3>
          Step 2: Specify <M tex="T" /> inside <M tex="\hat{S}" />
        </h3>
        <p>
          The set <M tex="Z" /> must contain some edge{" "}
          <M tex="\hat{S}" /> of <M tex="\mathcal{H}" /> (pick one
          depending only on <M tex="Z" />, so this choice is free). By the
          crucial property of minimum fragments,{" "}
          <M tex="T \subseteq \hat{S}" />. Since{" "}
          <M tex="|\hat{S}| \leq \ell" />, the number of choices for{" "}
          <M tex="T" /> as a subset of <M tex="\hat{S}" /> is at most{" "}
          <M tex="2^\ell" />.
        </p>

        <h3>Combining</h3>
        <p>
          Once <M tex="Z" /> and <M tex="T" /> are fixed, so is{" "}
          <M tex="W = Z \setminus T" />. Thus the total contribution from
          fragments of size exactly <M tex="m" /> is:
        </p>
        <M
          tex="\sum_W \sum_{U \in \mathcal{U}_m(W)} p^{|U|} \;\leq\; p^m \cdot \binom{n}{w}(Lp)^{-m} \cdot 2^\ell \;=\; \binom{n}{w} L^{-m} \cdot 2^\ell."
          display
        />
        <p>Summing over all <M tex="m \geq 0.9\ell" />:</p>
        <M
          tex="\sum_{m \geq 0.9\ell} \binom{n}{w} L^{-m} \cdot 2^\ell \;\leq\; \binom{n}{w} L^{-0.8\ell}"
          display
        />
        <p>
          for <M tex="L" /> sufficiently large (since{" "}
          <M tex="L^{-0.9\ell} \cdot 2^\ell = (L^{-0.9} \cdot 2)^\ell" />,
          and <M tex="L^{-0.9} \cdot 2 < 1" /> for{" "}
          <M tex="L > 2^{10/9}" />). Dividing both sides by{" "}
          <M tex="\binom{n}{w}" /> gives the lemma.
        </p>

        <div class="box remark">
          <span class="box-label">Remark: What Changed</span>
          <p>
            Previous proofs defined <M tex="Z = W \cup S" /> (the original
            edge) instead of <M tex="Z = W \cup T" /> (the fragment). This
            forced them into a &ldquo;pathological case analysis&rdquo; to
            handle edges <M tex="S" /> that overlap heavily with{" "}
            <M tex="W" />. By using the minimum fragment, Park and Pham
            sidestep this entirely&mdash;the fragment{" "}
            <M tex="T" /> is <em>always</em> disjoint from <M tex="W" />,
            and <M tex="T \subseteq \hat{S}" /> holds <em>automatically</em>.
          </p>
        </div>
      </section>

      {/* ============ SECTION 7 ============ */}
      <section id="sec-iteration">
        <h2>8 &ensp; Putting It Together: The Iteration</h2>

        <p>
          Now we run the full iterative machine. Starting with{" "}
          <M tex="\mathcal{H}_0 = \mathcal{H}" />, at step{" "}
          <M tex="i" /> we:
        </p>
        <ol>
          <li>
            Sample <M tex="W_i" />, a random subset of{" "}
            <M tex="X \setminus (W_1 \cup \cdots \cup W_{i-1})" /> of size{" "}
            <M tex="w_i \approx Lpn" />.
          </li>
          <li>
            For each <M tex="S \in \mathcal{H}_{i-1}" />, compute the minimum
            fragment <M tex="T(S, W_i)" />.
          </li>
          <li>
            Split: edges with large fragments (size <M tex="\geq 0.9\ell_{i-1}" />)
            go into <M tex="\mathcal{G}_i" /> (covered by{" "}
            <M tex="\mathcal{U}_i" />); the rest give the new hypergraph{" "}
            <M tex="\mathcal{H}_i" />.
          </li>
        </ol>

        <p>
          Three properties are maintained at each step:
        </p>

        <M
          tex="\mathcal{H}_{i-1} \setminus \mathcal{G}_i \;\subseteq\; \langle\mathcal{H}_i\rangle \qquad\qquad (\text{leftover is covered by } \mathcal{H}_i)"
          display
        />
        <M
          tex="\Big(\bigcup_{j \leq i} W_j\Big) \cup S_i \;\in\; \langle\mathcal{H}\rangle \quad \text{for all } S_i \in \mathcal{H}_i \qquad\qquad (\text{accumulated random sets + leftover reaches } \mathcal{H})"
          display
        />
        <M
          tex="|S_i| \;\leq\; 0.9^i \ell \quad \text{for all } S_i \in \mathcal{H}_i \qquad\qquad (\text{edge sizes shrink})"
          display
        />

        <IterationDemo />

        <p>
          After <M tex="\gamma = \lfloor\log_{0.9}(1/\ell)\rfloor + 1" />{" "}
          steps, we have <M tex="0.9^\gamma \ell < 1" />, so edges in{" "}
          <M tex="\mathcal{H}_\gamma" /> have size 0&mdash;the only
          possibility is <M tex="\mathcal{H}_\gamma = \emptyset" /> or{" "}
          <M tex="\mathcal{H}_\gamma = \{\emptyset\}" />.
        </p>

        <div class="box">
          <span class="box-label">Proposition 2.3</span>
          <p>
            Either{" "}
            <M tex="W = W_1 \cup \cdots \cup W_\gamma \in \langle\mathcal{H}\rangle" />{" "}
            or <M tex="\mathcal{U} = \bigcup_{i} \mathcal{U}_i" /> covers{" "}
            <M tex="\mathcal{H}" />.
          </p>
        </div>

        <TerminationDiagram />

        <p>
          <strong>If <M tex="\mathcal{H}_\gamma = \emptyset" />:</strong>{" "}
          Trace any edge <M tex="S \in \mathcal{H}" /> through the iteration.
          At each step, either it lands in <M tex="\mathcal{G}_i" /> (and
          is covered by <M tex="\mathcal{U}_i" />) or it passes to{" "}
          <M tex="\mathcal{H}_i" />. Since <M tex="\mathcal{H}_\gamma" />{" "}
          is empty, it must have been covered at some step. So{" "}
          <M tex="\mathcal{U}" /> covers <M tex="\mathcal{H}" />.
        </p>

        <p>
          <strong>If <M tex="\mathcal{H}_\gamma = \{\emptyset\}" />:</strong>{" "}
          By the second invariant,{" "}
          <M tex="W_1 \cup \cdots \cup W_\gamma \cup \emptyset \in \langle\mathcal{H}\rangle" />,
          so <M tex="W \in \langle\mathcal{H}\rangle" />.
        </p>
      </section>

      {/* ============ SECTION 8 ============ */}
      <section id="sec-punchline">
        <h2>9 &ensp; The Punchline</h2>

        <p>
          Let <M tex="\mathcal{E}" /> be the event that{" "}
          <M tex="\mathcal{U}" /> covers <M tex="\mathcal{H}" />. By
          Proposition 2.3:
        </p>
        <M
          tex="\Pr[W \in \langle\mathcal{H}\rangle] \;\geq\; 1 - \Pr[\mathcal{E}]."
          display
        />

        <p>
          If <M tex="\mathcal{E}" /> occurs, then <M tex="\mathcal{U}" />{" "}
          covers <M tex="\mathcal{H}" /> and (since{" "}
          <M tex="\mathcal{H}" /> is not <M tex="p" />-small) the cost must
          exceed <M tex="1/2" />:
        </p>
        <M
          tex="\text{if } \mathcal{E} \text{ occurs, then } \sum_{U \in \mathcal{U}} p^{|U|} > 1/2."
          display
        />

        <p>
          By Markov&rsquo;s inequality:
        </p>
        <M
          tex="\Pr[\mathcal{E}] \;\leq\; \Pr\!\left[\sum_{U \in \mathcal{U}} p^{|U|} > 1/2\right] \;\leq\; 2\,\mathbb{E}\!\left[\sum_{U \in \mathcal{U}} p^{|U|}\right]."
          display
        />

        <p>
          By Lemma 2.1 applied at each step, the expected cost over all rounds
          is:
        </p>
        <M
          tex="\mathbb{E}\!\left[\sum_{U \in \mathcal{U}} p^{|U|}\right] \;<\; \sum_{i \leq \gamma} L_i^{-0.8\ell_i} \;=\; o_{\ell \to \infty}(1)."
          display
        />

        <p>
          (The individual terms decay exponentially in <M tex="\ell_i" />,
          giving a total that vanishes as <M tex="\ell \to \infty" />.)
          Therefore:
        </p>
        <M
          tex="\Pr[W \in \langle\mathcal{H}\rangle] \;\geq\; 1 - o(1)."
          display
        />

        <p>
          Since <M tex="W" /> is a random set of size{" "}
          <M tex="(CLp\log\ell)n" />, this proves Theorem 1.4, which implies
          Theorem 1.1. <strong>The Kahn&ndash;Kalai conjecture is proved.</strong>
        </p>

        <hr />

        <h3>In summary</h3>

        <p>The proof has three ingredients:</p>

        <ol>
          <li>
            <strong>Iterative nibbling.</strong> Build the random set in rounds,
            shrinking the hypergraph by a factor of 0.9 at each step. After{" "}
            <M tex="O(\log \ell)" /> rounds, edges vanish.
          </li>
          <li>
            <strong>Minimum fragments.</strong> The key new notion: for each
            edge and random set, find the smallest &ldquo;leftover&rdquo; over
            all edges fitting in their union. This replaces the
            &ldquo;spread&rdquo; machinery of prior work.
          </li>
          <li>
            <strong>The specification argument.</strong> By using{" "}
            <M tex="Z = W \cup T" /> instead of <M tex="Z = W \cup S" />,
            the minimality of <M tex="T" /> gives{" "}
            <M tex="T \subseteq \hat{S}" /> for free, yielding the key bound
            with no case analysis.
          </li>
        </ol>

        <p>
          As Kahn and Kalai observed, the expectation threshold is the most
          naive approach to estimating thresholds. That it works&mdash;up to a
          log factor&mdash;for <em>every</em> increasing property is a fact
          both surprising and beautiful.
        </p>
      </section>

      {/* ============ ACKNOWLEDGEMENTS ============ */}
      <section>
        <h2>Acknowledgements</h2>
        <p>
          Many of the diagrams in this article are based on those drawn by
          co-author Jinyoung Park in her lectures on the proof.
        </p>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <p>
          Based on &ldquo;A Proof of the Kahn&ndash;Kalai Conjecture&rdquo; by
          Jinyoung Park and Huy Tuan Pham (2022). Style inspired by
          &ldquo;Fast(ish) Algorithms for Integer Programming&rdquo; by
          Weber &amp; Pollock.
        </p>
      </footer>
      </div>
    </div>
  );
}
