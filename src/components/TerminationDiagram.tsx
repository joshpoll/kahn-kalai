import M from "./Math";

// Recreates the termination-condition chalkboard diagram from Park's talk:
// Shows two cases:
// (a) G_i = H_{i-1} at some step → covers compose → U covers H
// (b) T = ∅ for some S → S ⊆ W₁∪...∪Wᵧ → W contains an edge of H

export default function TerminationDiagram() {
  return (
    <div class="diagram-container">
      <svg width="540" height="300" viewBox="0 0 540 300">
        {/* Title */}
        <text x={270} y={22} text-anchor="middle" font-size="14" font-weight="700" fill="#333">
          Termination: two outcomes after {"\u03B3"} rounds
        </text>

        {/* === Case (a): covers compose === */}
        <rect x={15} y={38} width={245} height={245} rx={6}
          fill="#f0fdf4" stroke="#16a34a" stroke-width={1.5} />
        <text x={137} y={60} text-anchor="middle" font-size="12" font-weight="700" fill="#16a34a">
          Case (a): H{"\u03B3"} = {"\u2205"}
        </text>

        {/* Show covers stacking up */}
        <text x={30} y={85} font-size="11" fill="#555">
          Every edge S traced through:
        </text>

        {/* Edge S flowing through iterations */}
        <rect x={30} y={95} width={210} height={35} rx={4} fill="white" stroke="#e5e5e5" stroke-width={1} />
        <text x={40} y={110} font-size="11" fill="#333">
          S {"\u2208"} H{"\u2080"}
        </text>
        <text x={110} y={110} font-size="11" fill="#94a3b8">{"\u2192"}</text>
        <text x={125} y={110} font-size="10" fill="#555">
          either covered by U{"\u1D62"}
        </text>
        <text x={125} y={124} font-size="10" fill="#555">
          or passes to H{"\u1D62"}
        </text>

        {/* Flow diagram */}
        <g transform="translate(40, 140)">
          {[0, 1, 2].map((i) => (
            <>
              <rect x={i * 65} y={0} width={55} height={25} rx={3}
                fill={i < 2 ? "#dcfce7" : "#fef3c7"}
                stroke={i < 2 ? "#16a34a" : "#ca8a04"}
                stroke-width={1} />
              <text x={i * 65 + 27} y={17} text-anchor="middle" font-size="9" font-weight="600"
                fill={i < 2 ? "#16a34a" : "#ca8a04"}>
                {i < 2 ? `U${'\u2080\u2081\u2082'[i+1]} covers` : "H\u03B3=\u2205"}
              </text>
              {i < 2 && (
                <text x={i * 65 + 60} y={17} font-size="10" fill="#94a3b8">{"\u2192"}</text>
              )}
            </>
          ))}
        </g>

        {/* Result */}
        <rect x={35} y={185} width={205} height={40} rx={4}
          fill="white" stroke="#16a34a" stroke-width={1.5} />
        <text x={137} y={203} text-anchor="middle" font-size="11" font-weight="600" fill="#16a34a">
          U = {"\u222A"}U{"\u1D62"} covers all of H
        </text>
        <text x={137} y={218} text-anchor="middle" font-size="10" fill="#555">
          But H is not p-small...
        </text>

        {/* Contradiction */}
        <text x={137} y={248} text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">
          Cost {">"}  1/2, but E[cost] {"\u2192"} 0
        </text>
        <text x={137} y={265} text-anchor="middle" font-size="11" fill="#dc2626">
          {"\u21D2"} Unlikely by Markov!
        </text>

        {/* === Case (b): W contains an edge === */}
        <rect x={280} y={38} width={245} height={245} rx={6}
          fill="#eff6ff" stroke="#2563eb" stroke-width={1.5} />
        <text x={402} y={60} text-anchor="middle" font-size="12" font-weight="700" fill="#2563eb">
          Case (b): H{"\u03B3"} = {"{\u2205}"}
        </text>

        <text x={295} y={85} font-size="11" fill="#555">
          Some edge S has T = {"\u2205"}:
        </text>
        <text x={295} y={102} font-size="11" fill="#555">
          S is fully inside W{"\u2081"} {"\u222A"} ... {"\u222A"} W{"\u03B3"}
        </text>

        {/* Visual: W strips covering S */}
        <g transform="translate(300, 115)">
          {/* W strips */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              x={i * 38}
              y={0}
              width={32}
              height={100}
              rx={2}
              fill={["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6"][i]}
              fill-opacity={0.3}
              stroke="#2563eb"
              stroke-width={1}
            />
          ))}
          {/* W labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text x={i * 38 + 16} y={112} text-anchor="middle" font-size="9" fill="#2563eb" font-weight="600">
              W{'\u2081\u2082\u2083\u2084\u2085'[i]}
            </text>
          ))}

          {/* S blob spanning across strips */}
          <ellipse cx={95} cy={50} rx={75} ry={28}
            fill="#ea580c" fill-opacity={0.15}
            stroke="#ea580c" stroke-width={2} />
          <text x={95} y={55} text-anchor="middle" font-size="13" font-weight="700" fill="#ea580c">
            S {"\u2286"} W
          </text>

          {/* Dots inside S showing elements covered by different W strips */}
          {[25, 55, 90, 120, 160].map((x, i) => (
            <circle cx={x} cy={45 + (i % 2) * 10} r={3}
              fill={["#2563eb", "#2563eb", "#3b82f6", "#3b82f6", "#60a5fa"][i]} />
          ))}
        </g>

        {/* Result */}
        <rect x={295} y={240} width={215} height={30} rx={4}
          fill="white" stroke="#2563eb" stroke-width={1.5} />
        <text x={402} y={260} text-anchor="middle" font-size="12" font-weight="700" fill="#2563eb">
          W {"\u2208"} {"\u27E8"}H{"\u27E9"} {"\u2714"}
        </text>
      </svg>
      <div class="diagram-caption">
        After <M tex="\gamma" /> rounds, edges shrink to size &lt; 1.
        Either the covers compose (case a, but this would mean H has a
        cheap cover&mdash;contradiction!), or the random set{" "}
        <M tex="W = \bigcup W_i" /> already contains an edge of{" "}
        <M tex="\mathcal{H}" /> (case b). Since case (a) is unlikely,
        case (b) holds with high probability.
      </div>
    </div>
  );
}
