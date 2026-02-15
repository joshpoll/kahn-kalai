import M from "./Math";

// Recreates the chalkboard diagram from Park's talk:
// 2^X as a circle, F as the upward-closed upper region,
// ∅ at the bottom, minimal elements along the boundary.

export default function IncreasingPropertyDiagram() {
  const cx = 150, cy = 150, r = 120;
  const svgW = 520, svgH = 310;

  // Wavy boundary sweeps fully across the circle diameter.
  const aStart = 0.05, aEnd = 0.95;
  const wavyPoint = (t: number) => {
    const angle = Math.PI * aStart + t * Math.PI * (aEnd - aStart);
    const baseX = cx - r * Math.cos(angle);
    const baseY = cy + r * 0.15 + Math.sin(angle) * 10;
    const wave = Math.sin(t * Math.PI * 4) * 12;
    return { x: baseX, y: baseY + wave };
  };

  const steps = 60;
  const wavyPts = Array.from({ length: steps + 1 }, (_, i) => wavyPoint(i / steps));

  const wavyPath = wavyPts.map(p => `${p.x},${p.y}`).join(" ");

  // F region: wavy boundary across, then close via a big box above the circle.
  // The atop composite filter clips to the circle, so overshooting is fine.
  const fRegionPath = (() => {
    const segs = wavyPts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`));
    const pad = 40;
    return segs.join(" ") +
      ` L ${cx + r + pad},${cy + r + pad}` +
      ` L ${cx + r + pad},${cy - r - pad}` +
      ` L ${cx - r - pad},${cy - r - pad}` +
      ` L ${cx - r - pad},${cy + r + pad} Z`;
  })();

  return (
    <div class="diagram-container">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          <clipPath id="circleClipIncProp">
            <circle cx={cx} cy={cy} r={r - 1} />
          </clipPath>

          {/* Arrow marker: points in +x direction so orient="auto" rotates it correctly */}
          <marker id="arrUp" markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M 0 0 L 6 4 L 0 8" fill="none" stroke="#94a3b8" stroke-width="1.5" />
          </marker>
        </defs>

        {/* Circle fill */}
        <circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* F region + wavy boundary, clipped to circle */}
        <path d={fRegionPath} fill="#dbeafe" fill-opacity={0.5} clip-path="url(#circleClipIncProp)" />
        <polyline points={wavyPath} fill="none" stroke="#2563eb" stroke-width={2} clip-path="url(#circleClipIncProp)" />

        {/* F label inside circle — use foreignObject for KaTeX rendering */}
        <foreignObject x={cx - 25} y={cy - 78} width={50} height={36}>
          <div style={{ "text-align": "center", "font-size": "20px" }}>
            <M tex="\mathcal{F}" />
          </div>
        </foreignObject>

        {/* X at very top of circle */}
        <circle cx={cx} cy={cy - r + 8} r={3} fill="#2563eb" />
        <text x={cx + 10} y={cy - r + 13} font-size="13" font-weight="600" fill="#2563eb">
          X
        </text>

        {/* ∅ at very bottom of circle */}
        <circle cx={cx} cy={cy + r - 8} r={3} fill="white" stroke="#64748b" stroke-width={1} />
        <text x={cx + 10} y={cy + r - 3} font-size="13" fill="#64748b">
          {"\u2205"}
        </text>

        {/* 2^X label */}
        <text x={cx + r + 12} y={cy + 5} font-size="14" fill="#64748b">
          {"2\u1D38"}
        </text>

        {/* Arrow showing "upward" direction */}
        <line x1={cx - r - 20} y1={cy + 50} x2={cx - r - 20} y2={cy - 50} stroke="#94a3b8" stroke-width={1.5} marker-end="url(#arrUp)" />
        <text x={cx - r - 20} y={cy + 68} text-anchor="middle" font-size="10" fill="#94a3b8">
          adding
        </text>
        <text x={cx - r - 20} y={cy + 80} text-anchor="middle" font-size="10" fill="#94a3b8">
          elements
        </text>

        {/* Minimal elements: dots along the wavy boundary */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => {
          const p = wavyPoint(t);
          return (
            <circle cx={p.x} cy={p.y} r={4} fill="#ea580c" stroke="white" stroke-width={1.5} />
          );
        })}

        {/* Label for minimal elements */}
        <text x={cx + r - 5} y={cy + r * 0.15 + 35} font-size="11" fill="#ea580c" font-weight="600">
          minimal elements
        </text>

        {/* --- Right side: explanation --- */}
        <g transform="translate(310, 30)">
          <text x={0} y={0} font-size="14" font-weight="700" fill="#333">
            Increasing property
          </text>

          {/* Example with small Hasse-like diagram */}
          <text x={0} y={30} font-size="12" fill="#555">
            If A is in the property,
          </text>
          <text x={0} y={48} font-size="12" fill="#555">
            every superset B {"\u2287"} A is too.
          </text>

          {/* Small example: subsets of {1,2,3} */}
          <text x={0} y={80} font-size="11" font-weight="600" fill="#333">
            Example: X = {"{1, 2, 3}"}
          </text>
          <text x={0} y={98} font-size="11" fill="#555">
            {"\u2131 = \u201Ccontains {1, 2}\u201D"}
          </text>

          {/* Mini lattice */}
          {/* Edges of lattice (drawn first, behind nodes) */}
          {/* ∅ to singletons */}
          <line x1={80} y1={232} x2={38} y2={205} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={85} y1={230} x2={85} y2={205} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={90} y1={232} x2={132} y2={205} stroke="#e2e8f0" stroke-width={0.8} />
          {/* singletons to pairs */}
          <line x1={35} y1={195} x2={35} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={38} y1={195} x2={82} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={85} y1={195} x2={38} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={85} y1={195} x2={132} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={135} y1={195} x2={88} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={135} y1={195} x2={135} y2={166} stroke="#e2e8f0" stroke-width={0.8} />
          {/* pairs to {1,2,3} */}
          <line x1={38} y1={155} x2={82} y2={130} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={85} y1={155} x2={85} y2={131} stroke="#e2e8f0" stroke-width={0.8} />
          <line x1={132} y1={155} x2={88} y2={130} stroke="#e2e8f0" stroke-width={0.8} />

          {/* Level 0: ∅ */}
          <circle cx={85} cy={235} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={100} y={239} font-size="9" fill="#94a3b8">{"\u2205"}</text>

          {/* Level 1: {1}, {2}, {3} */}
          <circle cx={35} cy={200} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={14} y={196} font-size="9" fill="#94a3b8">{"{1}"}</text>
          <circle cx={85} cy={200} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={64} y={196} font-size="9" fill="#94a3b8">{"{2}"}</text>
          <circle cx={135} cy={200} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={145} y={204} font-size="9" fill="#94a3b8">{"{3}"}</text>

          {/* Level 2: {1,2}, {1,3}, {2,3} */}
          <circle cx={35} cy={160} r={6} fill="#dbeafe" stroke="#2563eb" stroke-width={1.5} />
          <text x={2} y={150} font-size="9" fill="#2563eb" font-weight="600">{"{1,2}"}</text>
          <circle cx={85} cy={160} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={60} y={150} font-size="9" fill="#94a3b8">{"{1,3}"}</text>
          <circle cx={135} cy={160} r={5} fill="#f1f5f9" stroke="#94a3b8" stroke-width={1} />
          <text x={145} y={164} font-size="9" fill="#94a3b8">{"{2,3}"}</text>

          {/* Level 3: {1,2,3} */}
          <circle cx={85} cy={125} r={6} fill="#dbeafe" stroke="#2563eb" stroke-width={1.5} />
          <text x={100} y={122} font-size="9" fill="#2563eb" font-weight="600">{"{1,2,3}"}</text>

          {/* Highlight F region */}
          <rect x={20} y={115} width={130} height={55} rx={6} fill="#2563eb" fill-opacity={0.06} stroke="#2563eb" stroke-width={1} stroke-dasharray="4,3" />
          <text x={155} y={140} font-size="10" fill="#2563eb" font-weight="600">{"\u2190 \u2131"}</text>

          {/* Minimal element annotation */}
          <line x1={35} y1={168} x2={35} y2={178} stroke="#ea580c" stroke-width={1} />
          <text x={35} y={190} text-anchor="middle" font-size="8" fill="#ea580c" font-weight="600">minimal</text>
        </g>
      </svg>
      <div class="diagram-caption">
        Left: The power set <M tex="2^X" /> as a universe. The increasing
        property <M tex="\mathcal{F}" /> (blue) is the upper region: once
        you're in, adding elements keeps you in. The <span style={{ color: "#ea580c", "font-weight": "600" }}>minimal elements</span> are
        the boundary&mdash;the smallest sets in <M tex="\mathcal{F}" />.
        Right: A concrete lattice for <M tex="X = \{1,2,3\}" />.
      </div>
    </div>
  );
}
