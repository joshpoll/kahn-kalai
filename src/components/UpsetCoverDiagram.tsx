import M from "./Math";

// Recreates the ⟨A⟩ diagram from Park's talk:
// Shows how a cover G generates upsets ⟨S⟩ that together contain F.
// Two panels: (1) single upset from one set A, (2) cover = union of upsets.

export default function UpsetCoverDiagram() {
  const cx1 = 120, cx2 = 380, cy = 135, r = 105;

  // Cone/upset shape from a point upward
  function upsetPath(px: number, py: number, cx: number, cy: number, r: number, spread: number): string {
    // From point (px, py), fan out upward to edges of circle
    const topY = cy - r + 10;
    const leftX = px - spread;
    const rightX = px + spread;
    return `M ${px} ${py} Q ${leftX - 10} ${(py + topY) / 2} ${leftX} ${topY}
            L ${rightX} ${topY}
            Q ${rightX + 10} ${(py + topY) / 2} ${px} ${py} Z`;
  }

  return (
    <div class="diagram-container">
      <svg width="520" height="290" viewBox="0 0 520 290">
        {/* === Panel 1: Single upset ⟨A⟩ === */}
        <text x={cx1} y={18} text-anchor="middle" font-size="13" font-weight="700" fill="#333">
          One set A and its upset {"\u27E8"}A{"\u27E9"}
        </text>

        {/* Circle */}
        <circle cx={cx1} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* Upset cone */}
        <clipPath id="circle1">
          <circle cx={cx1} cy={cy} r={r - 1} />
        </clipPath>
        <path
          d={upsetPath(cx1, cy + 30, cx1, cy, r, 55)}
          fill="#7c3aed"
          fill-opacity={0.12}
          stroke="#7c3aed"
          stroke-width={1.5}
          stroke-dasharray="4,3"
          clip-path="url(#circle1)"
        />

        {/* Hatching lines inside upset */}
        <g clip-path="url(#circle1)" opacity={0.15}>
          {Array.from({ length: 12 }, (_, i) => {
            const y = cy - r + 15 + i * 12;
            return <line x1={cx1 - 70} y1={y} x2={cx1 + 70} y2={y} stroke="#7c3aed" stroke-width={1} />;
          })}
        </g>

        {/* Point A */}
        <circle cx={cx1} cy={cy + 30} r={5} fill="#7c3aed" />
        <text x={cx1 + 12} y={cy + 35} font-size="14" font-weight="700" fill="#7c3aed">A</text>

        {/* ∅ at bottom */}
        <circle cx={cx1} cy={cy + r - 12} r={2.5} fill="#94a3b8" />
        <text x={cx1 + 8} y={cy + r - 8} font-size="10" fill="#94a3b8">{"\u2205"}</text>

        {/* Label */}
        <text x={cx1 + r + 8} y={cy - 20} font-size="13" fill="#7c3aed" font-weight="600">
          {"\u27E8"}A{"\u27E9"}
        </text>
        <text x={cx1 + r + 8} y={cy} font-size="11" fill="#555">
          = {"{"}B : B {"\u2287"} A{"}"}
        </text>

        {/* Arrow */}
        <text x={cx1} y={cy + r + 16} text-anchor="middle" font-size="11" fill="#555">
          Everything above A
        </text>

        {/* === Panel 2: Cover = union of upsets === */}
        <text x={cx2} y={18} text-anchor="middle" font-size="13" font-weight="700" fill="#333">
          Cover: upsets tile {"\u2131"}
        </text>

        {/* Circle */}
        <circle cx={cx2} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* F region */}
        <clipPath id="circle2">
          <circle cx={cx2} cy={cy} r={r - 1} />
        </clipPath>

        {/* Three upset cones covering F */}
        <path
          d={upsetPath(cx2 - 35, cy + 35, cx2, cy, r, 30)}
          fill="#2563eb"
          fill-opacity={0.12}
          stroke="#2563eb"
          stroke-width={1.2}
          stroke-dasharray="3,3"
          clip-path="url(#circle2)"
        />
        <path
          d={upsetPath(cx2 + 5, cy + 15, cx2, cy, r, 35)}
          fill="#ea580c"
          fill-opacity={0.12}
          stroke="#ea580c"
          stroke-width={1.2}
          stroke-dasharray="3,3"
          clip-path="url(#circle2)"
        />
        <path
          d={upsetPath(cx2 + 40, cy + 40, cx2, cy, r, 25)}
          fill="#16a34a"
          fill-opacity={0.12}
          stroke="#16a34a"
          stroke-width={1.2}
          stroke-dasharray="3,3"
          clip-path="url(#circle2)"
        />

        {/* Cover points */}
        <circle cx={cx2 - 35} cy={cy + 35} r={4.5} fill="#2563eb" />
        <text x={cx2 - 50} y={cy + 40} font-size="11" font-weight="700" fill="#2563eb">S{"\u2081"}</text>

        <circle cx={cx2 + 5} cy={cy + 15} r={4.5} fill="#ea580c" />
        <text x={cx2 + 15} y={cy + 12} font-size="11" font-weight="700" fill="#ea580c">S{"\u2082"}</text>

        <circle cx={cx2 + 40} cy={cy + 40} r={4.5} fill="#16a34a" />
        <text x={cx2 + 50} y={cy + 45} font-size="11" font-weight="700" fill="#16a34a">S{"\u2083"}</text>

        {/* F boundary (wavy) */}
        <path
          d={`M ${cx2 - 75} ${cy + 5} Q ${cx2 - 40} ${cy + 18} ${cx2} ${cy + 3} Q ${cx2 + 40} ${cy - 12} ${cx2 + 75} ${cy + 5}`}
          fill="none"
          stroke="#333"
          stroke-width={2}
          clip-path="url(#circle2)"
        />
        <text x={cx2 + r - 15} y={cy + 20} font-size="12" fill="#333" font-weight="600">
          {"\u2131"}
        </text>

        {/* ∅ at bottom */}
        <circle cx={cx2} cy={cy + r - 12} r={2.5} fill="#94a3b8" />
        <text x={cx2 + 8} y={cy + r - 8} font-size="10" fill="#94a3b8">{"\u2205"}</text>

        {/* Cost annotation */}
        <text x={cx2} y={cy + r + 16} text-anchor="middle" font-size="11" fill="#555">
          Cost = {"\u03A3"} p^|S{"\u1D62"}| {"\u2264"} 1/2 {"\u21D2"} cheap cover
        </text>
      </svg>
      <div class="diagram-caption">
        Left: A single set <M tex="A" /> generates an upset{" "}
        <M tex="\langle A \rangle = \{B : B \supseteq A\}" />&mdash;the
        &ldquo;cone&rdquo; of all supersets. Right: A cover{" "}
        <M tex="\mathcal{G} = \{S_1, S_2, S_3\}" /> is a collection whose
        upsets together contain <M tex="\mathcal{F}" />. The cost{" "}
        <M tex="\sum p^{|S_i|}" /> measures how &ldquo;expensive&rdquo;
        the cover is.
      </div>
    </div>
  );
}
