import M from "./components/Math";
import RandomGraph from "./components/RandomGraph";
import CoverDemo from "./components/CoverDemo";
import FragmentDemo from "./components/FragmentDemo";
import IterationDemo from "./components/IterationDemo";
import CountingDiagram from "./components/CountingDiagram";
import ProofOverview from "./components/ProofOverview";
import IncreasingPropertyDiagram from "./components/IncreasingPropertyDiagram";
import UpsetCoverDiagram from "./components/UpsetCoverDiagram";
import EllDiagram from "./components/EllDiagram";
import FragmentConstructionDiagram from "./components/FragmentConstructionDiagram";
import TerminationDiagram from "./components/TerminationDiagram";

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
        In 2022, Park and Pham proved the Kahn&ndash;Kalai conjecture, showing
        that the threshold for any increasing property is always within a
        logarithmic factor of the &ldquo;expectation threshold&rdquo;&mdash;the
        most naive lower bound. Their proof is remarkably short: a two-page
        argument built on one key idea. This guide provides a visual,
        step-by-step walkthrough of the proof, starting from scratch.
      </div>

      {/* ============ TOC ============ */}
      <nav class="toc">
        <h2>Contents</h2>
        <ol>
          <li><a href="#sec-structure">When Does Structure Emerge from Randomness?</a></li>
          <li><a href="#sec-guess">How Would You Guess the Threshold?</a></li>
          <li><a href="#sec-conjecture">The Conjecture: Your Guess Is (Almost) Right</a></li>
          <li><a href="#sec-strategy">Proof Strategy: Iterative Nibbling</a></li>
          <li><a href="#sec-fragments">The Secret Weapon: Minimum Fragments</a></li>
          <li><a href="#sec-counting">Why Fragments Make Counting Easy</a></li>
          <li><a href="#sec-iteration">Putting It Together: The Iteration</a></li>
          <li><a href="#sec-punchline">The Punchline</a></li>
        </ol>
      </nav>

      {/* ============ SECTION 1 ============ */}
      <section id="sec-structure">
        <h2>1 &ensp; When Does Structure Emerge from Randomness?</h2>

        <p>
          Consider a random graph on <M tex="n" /> vertices, where each edge
          appears independently with probability <M tex="p" />. When{" "}
          <M tex="p" /> is very small, the graph is sparse and
          featureless&mdash;just a scattering of disconnected edges. When{" "}
          <M tex="p" /> is large, the graph is dense and contains every small
          substructure you could ask for.
        </p>

        <p>
          The remarkable fact, observed by Erd&#337;s and R&eacute;nyi in 1959,
          is that interesting properties don&rsquo;t emerge gradually. They
          appear in a sudden <em class="concept">phase transition</em>: there is
          a critical value of <M tex="p" /> below which the property almost
          never holds, and above which it almost always holds.
        </p>

        <RandomGraph />

        <p>
          This critical value is called the <em class="concept">threshold</em>.
          More precisely, given a finite set <M tex="X" /> and an{" "}
          <em>increasing property</em> <M tex="\mathcal{F} \subseteq 2^X" />{" "}
          (meaning: if <M tex="A \in \mathcal{F}" /> and{" "}
          <M tex="B \supseteq A" />, then <M tex="B \in \mathcal{F}" />), we
          include each element of <M tex="X" /> independently with probability{" "}
          <M tex="p" /> to get a random set <M tex="X_p" />.
        </p>

        <IncreasingPropertyDiagram />

        <div class="box definition">
          <span class="box-label">Definition: Threshold</span>
          <p>
            The <strong>threshold</strong>{" "}
            <M tex="p_c(\mathcal{F})" /> is the unique <M tex="p" /> for which
          </p>
          <M tex="\mu_p(\mathcal{F}) := \Pr[X_p \in \mathcal{F}] = \tfrac{1}{2}." display />
        </div>

        <p>
          Much of combinatorics, computer science, and statistical physics is
          concerned with pinpointing thresholds for specific properties:
          connectivity, Hamiltonicity, perfect matchings, satisfiability. But
          computing <M tex="p_c(\mathcal{F})" /> for a given{" "}
          <M tex="\mathcal{F}" /> is typically hard. Can we at least
          <em>estimate</em> it?
        </p>
      </section>

      {/* ============ SECTION 2 ============ */}
      <section id="sec-guess">
        <h2>2 &ensp; How Would You Guess the Threshold?</h2>

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
        <h2>3 &ensp; The Conjecture: Your Guess Is (Almost) Right</h2>

        <p>
          In 2007, Kahn and Kalai made a bold conjecture: the threshold is
          always within a logarithmic factor of the expectation threshold.
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
          operates on hypergraphs. A <em>hypergraph</em>{" "}
          <M tex="\mathcal{H}" /> on <M tex="X" /> is a collection of subsets
          (called <em>edges</em>). We say <M tex="\mathcal{H}" /> is{" "}
          <M tex="\ell" />-bounded if every edge has size at most{" "}
          <M tex="\ell" />. The key theorem is:
        </p>

        <div class="box">
          <span class="box-label">Theorem 1.4</span>
          <p>
            Let <M tex="\ell \geq 2" />. There is a constant{" "}
            <M tex="L" /> such that for any nonempty{" "}
            <M tex="\ell" />-bounded hypergraph <M tex="\mathcal{H}" /> on{" "}
            <M tex="X" /> that is <strong>not</strong>{" "}
            <M tex="p" />-small:
          </p>
          <M
            tex="\text{a uniformly random } (Lp\log\ell)|X|\text{-element subset of } X \text{ belongs to } \langle\mathcal{H}\rangle \text{ with probability } 1 - o(1)."
            display
          />
        </div>

        <p>
          Translation: if no cheap cover exists (i.e., the property is above
          the expectation threshold), then a random set that is only a{" "}
          <M tex="\log \ell" /> factor larger than expected <em>will</em>{" "}
          contain an edge of <M tex="\mathcal{H}" />, with high probability.
          This immediately implies Theorem 1.1.
        </p>
      </section>

      {/* ============ SECTION 4 ============ */}
      <section id="sec-strategy">
        <h2>4 &ensp; Proof Strategy: Iterative Nibbling</h2>

        <p>
          The proof uses a strategy called{" "}
          <em class="concept">iterative nibbling</em>. Instead of building the
          random set <M tex="W" /> all at once, we build it in{" "}
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
        <h2>5 &ensp; The Secret Weapon: Minimum Fragments</h2>

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
          To visualize this, we use our same 7 vertices but now with a
          hypergraph of 4-element edges (larger edges make the fragment
          structure richer):
        </p>

        <FragmentDemo />

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
        <h2>6 &ensp; Why Fragments Make Counting Easy</h2>

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
        <h2>7 &ensp; Putting It Together: The Iteration</h2>

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
        <h2>8 &ensp; The Punchline</h2>

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
