import M from "./Math";

// Recreates the Ws-and-Ss chalkboard diagram from Park's talk:
// Shows W as a block, S as a blob overlapping with it, S' ⊆ W∪S,
// and the minimum fragment T = S'\W.

export default function FragmentConstructionDiagram() {
  return (
    <div class="diagram-container">
      <svg width="520" height="240" viewBox="0 0 520 240">
        {/* === W region (rectangle on left) === */}
        <rect x={30} y={30} width={140} height={170} rx={4}
          fill="#dbeafe" fill-opacity={0.3}
          stroke="#2563eb" stroke-width={2} />
        <text x={100} y={22} text-anchor="middle" font-size="14" font-weight="700" fill="#2563eb">
          W
        </text>
        <text x={100} y={215} text-anchor="middle" font-size="10" fill="#2563eb">
          (random subset)
        </text>

        {/* === S blob (overlapping with W) === */}
        <ellipse cx={210} cy={115} rx={90} ry={65}
          fill="#ea580c" fill-opacity={0.08}
          stroke="#ea580c" stroke-width={2} />
        <text x={275} y={62} font-size="14" font-weight="700" fill="#ea580c">
          S
        </text>
        <text x={275} y={78} font-size="10" fill="#ea580c">
          (edge of H)
        </text>

        {/* === Overlap region S ∩ W (hatching) === */}
        <clipPath id="clipW">
          <rect x={30} y={30} width={140} height={170} />
        </clipPath>
        <clipPath id="clipS">
          <ellipse cx={210} cy={115} rx={90} ry={65} />
        </clipPath>
        {/* Draw the intersection by clipping S to W */}
        <g clip-path="url(#clipW)">
          <ellipse cx={210} cy={115} rx={90} ry={65}
            fill="#7c3aed" fill-opacity={0.15} />
          {/* Hatching */}
          {Array.from({ length: 20 }, (_, i) => (
            <line
              x1={120 + i * 8} y1={30}
              x2={120 + i * 8 - 40} y2={200}
              stroke="#7c3aed" stroke-width={1} opacity={0.2}
            />
          ))}
        </g>
        <text x={147} y={120} text-anchor="middle" font-size="11" font-weight="600" fill="#7c3aed">
          S {"\u2229"} W
        </text>

        {/* === T = S' \ W (the fragment, outside W) === */}
        {/* Small highlighted region in S but outside W */}
        <ellipse cx={255} cy={105} rx={32} ry={25}
          fill="#dc2626" fill-opacity={0.15}
          stroke="#dc2626" stroke-width={2.5} />
        <text x={255} y={110} text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">
          T
        </text>

        {/* Annotation arrow for T */}
        <line x1={288} y1={95} x2={320} y2={80} stroke="#dc2626" stroke-width={1} />
        <text x={323} y={78} font-size="11" fill="#dc2626" font-weight="600">
          T = S' \ W
        </text>
        <text x={323} y={93} font-size="10" fill="#dc2626">
          minimum fragment
        </text>

        {/* === S' (dashed, fits in W∪S) === */}
        <path
          d="M 80 80 Q 90 55 140 55 Q 200 50 260 75 Q 290 90 285 115 Q 280 140 240 140 Q 180 145 130 130 Q 80 115 80 80 Z"
          fill="none"
          stroke="#16a34a" stroke-width={1.5} stroke-dasharray="6,4" />
        <text x={90} y={68} font-size="11" font-weight="600" fill="#16a34a">
          S'
        </text>
        <text x={323} y={130} font-size="10" fill="#16a34a">
          S' {"\u2208"} H, S' {"\u2286"} W {"\u222A"} S
        </text>

        {/* === Big bracket for W∪S === */}
        <path
          d="M 25 225 L 305 225"
          fill="none" stroke="#94a3b8" stroke-width={1} />
        <text x={165} y={238} text-anchor="middle" font-size="11" fill="#94a3b8">
          W {"\u222A"} S
        </text>
      </svg>
      <div class="diagram-caption">
        The fragment construction. Given edge <M tex="S" /> and random set{" "}
        <M tex="W" />, find an edge <M tex="S' \in \mathcal{H}" /> fitting
        inside <M tex="W \cup S" /> whose leftover{" "}
        <M tex="T = S' \setminus W" /> is as small as possible. The{" "}
        <span style={{ color: "#7c3aed", "font-weight": "600" }}>overlap</span>{" "}
        <M tex="S \cap W" /> is &ldquo;absorbed&rdquo; by <M tex="W" />;
        only the{" "}
        <span style={{ color: "#dc2626", "font-weight": "600" }}>fragment</span>{" "}
        <M tex="T" /> remains.
      </div>
    </div>
  );
}
