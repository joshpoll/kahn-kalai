import M from "./Math";

// Recreates the cover diagram from Park's talk:
// Shows how a cover G generates upsets ⟨S⟩ that together contain F.
// Two panels: (1) single upset from one set A, (2) cover = upsets tiling F.

export default function UpsetCoverDiagram() {
  const cx1 = 120, cx2 = 380, cy = 135, r = 105;

  // Cone/upset shape from a point upward
  function upsetPath(px: number, py: number, cx: number, r: number, spread: number): string {
    const topY = cy - r + 10;
    const leftX = px - spread;
    const rightX = px + spread;
    return `M ${px} ${py} Q ${leftX - 10} ${(py + topY) / 2} ${leftX} ${topY}
            L ${rightX} ${topY}
            Q ${rightX + 10} ${(py + topY) / 2} ${px} ${py} Z`;
  }

  // Wavy boundary for F on panel 2, spanning the circle diameter
  const wavyPoint2 = (t: number) => {
    const aStart = 0.05, aEnd = 0.95;
    const angle = Math.PI * aStart + t * Math.PI * (aEnd - aStart);
    const baseX = cx2 - r * Math.cos(angle);
    const baseY = cy + r * 0.12 + Math.sin(angle) * 6;
    const wave = Math.sin(t * Math.PI * 3.5) * 10;
    return { x: baseX, y: baseY + wave };
  };
  const steps2 = 60;
  const wavyPts2 = Array.from({ length: steps2 + 1 }, (_, i) => wavyPoint2(i / steps2));
  const wavyPath2 = wavyPts2.map(p => `${p.x},${p.y}`).join(" ");
  const fRegionPath2 = (() => {
    const segs = wavyPts2.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`));
    const pad = 40;
    return segs.join(" ") +
      ` L ${cx2 + r + pad},${cy + r + pad}` +
      ` L ${cx2 + r + pad},${cy - r - pad}` +
      ` L ${cx2 - r - pad},${cy - r - pad}` +
      ` L ${cx2 - r - pad},${cy + r + pad} Z`;
  })();

  // Cover elements: pointed teeth shapes rising up from below
  // Each tooth: a point (the set S_i) below the wavy line, fanning up
  // to meet the wavy boundary from below
  const coverSets = [
    { t: 0.12, spread: 22, color: "#2563eb" },
    { t: 0.30, spread: 26, color: "#7c3aed" },
    { t: 0.48, spread: 20, color: "#ea580c" },
    { t: 0.65, spread: 28, color: "#16a34a" },
    { t: 0.83, spread: 24, color: "#dc2626" },
  ];

  // Build each tooth as a path: starts at the tip (S_i below boundary),
  // fans up and out, and the top edge follows the wavy boundary
  function toothPath(tCenter: number, spread: number) {
    const center = wavyPoint2(tCenter);
    // Tip is below the boundary
    const tipY = center.y + 28 + spread * 0.4;
    const tipX = center.x;

    // Left and right edges where the tooth meets the boundary
    const tLeft = Math.max(0, tCenter - spread / 100);
    const tRight = Math.min(1, tCenter + spread / 100);

    // Sample boundary points between tLeft and tRight for the top edge
    const topSteps = 16;
    const topPts: { x: number; y: number }[] = [];
    for (let i = 0; i <= topSteps; i++) {
      const tt = tLeft + (i / topSteps) * (tRight - tLeft);
      topPts.push(wavyPoint2(tt));
    }

    // Path: go from tip up-left to first boundary point, trace boundary, back down to tip
    const d = `M ${tipX} ${tipY} ` +
      `L ${topPts[0].x} ${topPts[0].y} ` +
      topPts.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ") +
      ` L ${tipX} ${tipY} Z`;
    return { d, tipX, tipY };
  }

  return (
    <div class="diagram-container">
      <svg width="520" height="290" viewBox="0 0 520 290">
        {/* === Panel 1: Single upset ⟨A⟩ === */}
        <foreignObject x={cx1 - 80} y={2} width={160} height={24}>
          <div style={{ "text-align": "center", "font-size": "13px", "font-weight": "700", color: "#333" }}>
            One set <M tex="A" /> and its upset <M tex="\langle A \rangle" />
          </div>
        </foreignObject>

        {/* Circle */}
        <circle cx={cx1} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* Upset cone */}
        <clipPath id="circle1">
          <circle cx={cx1} cy={cy} r={r - 1} />
        </clipPath>
        <path
          d={upsetPath(cx1, cy + 30, cx1, r, 55)}
          fill="#7c3aed"
          fill-opacity={0.12}
          stroke="#7c3aed"
          stroke-width={1.5}
          stroke-dasharray="4,3"
          clip-path="url(#circle1)"
        />

        {/* Point A */}
        <circle cx={cx1} cy={cy + 30} r={5} fill="#7c3aed" />
        <foreignObject x={cx1 + 10} y={cy + 18} width={30} height={24}>
          <div style={{ "font-size": "14px", "font-weight": "700", color: "#7c3aed" }}>
            <M tex="A" />
          </div>
        </foreignObject>

        {/* ∅ at bottom */}
        <circle cx={cx1} cy={cy + r - 12} r={2.5} fill="white" stroke="#94a3b8" stroke-width={1} />

        {/* Label */}
        <foreignObject x={cx1 + r + 5} y={cy - 32} width={80} height={24}>
          <div style={{ "font-size": "13px", "font-weight": "600", color: "#7c3aed" }}>
            <M tex="\langle A \rangle" />
          </div>
        </foreignObject>
        <foreignObject x={cx1 + r + 5} y={cy - 12} width={90} height={24}>
          <div style={{ "font-size": "11px", color: "#555" }}>
            = {"{"}<M tex="B : B \supseteq A" />{"}"}
          </div>
        </foreignObject>

        {/* Arrow */}
        <text x={cx1} y={cy + r + 16} text-anchor="middle" font-size="11" fill="#555">
          Everything above A
        </text>

        {/* === Panel 2: Cover — upsets tile F === */}
        <foreignObject x={cx2 - 80} y={2} width={160} height={24}>
          <div style={{ "text-align": "center", "font-size": "13px", "font-weight": "700", color: "#333" }}>
            Cover: upsets tile <M tex="\mathcal{F}" />
          </div>
        </foreignObject>

        {/* Circle */}
        <circle cx={cx2} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        <clipPath id="circle2">
          <circle cx={cx2} cy={cy} r={r - 1} />
        </clipPath>

        {/* F region (shaded above boundary) */}
        <path d={fRegionPath2} fill="#dbeafe" fill-opacity={0.4} clip-path="url(#circle2)" />

        {/* Tooth-shaped upsets rising up to cover F */}
        {coverSets.map(({ t, spread, color }) => {
          const { d, tipX, tipY } = toothPath(t, spread);
          return (
            <>
              <path
                d={d}
                fill={color}
                fill-opacity={0.15}
                stroke={color}
                stroke-width={1.2}
                stroke-dasharray="3,3"
                clip-path="url(#circle2)"
              />
              <circle cx={tipX} cy={tipY} r={3.5} fill={color} />
            </>
          );
        })}

        {/* Wavy boundary of F on top */}
        <polyline points={wavyPath2} fill="none" stroke="#2563eb" stroke-width={2} clip-path="url(#circle2)" />

        {/* F label */}
        <foreignObject x={cx2 - 15} y={cy - 70} width={40} height={30}>
          <div style={{ "text-align": "center", "font-size": "18px", color: "#2563eb" }}>
            <M tex="\mathcal{F}" />
          </div>
        </foreignObject>

        {/* G label */}
        <foreignObject x={cx2 + r + 5} y={cy + 10} width={40} height={28}>
          <div style={{ "font-size": "16px", "font-weight": "600", color: "#ea580c" }}>
            <M tex="\mathcal{G}" />
          </div>
        </foreignObject>

        {/* ∅ at bottom */}
        <circle cx={cx2} cy={cy + r - 12} r={2.5} fill="white" stroke="#94a3b8" stroke-width={1} />

        {/* Cost annotation */}
        <foreignObject x={cx2 - 120} y={cy + r + 4} width={240} height={24}>
          <div style={{ "text-align": "center", "font-size": "11px", color: "#555" }}>
            Cost = <M tex="\sum p^{|S_i|} \leq 1/2" /> {"⇒"} cheap cover
          </div>
        </foreignObject>
      </svg>
      <div class="diagram-caption">
        Left: A single set <M tex="A" /> generates an upset{" "}
        <M tex="\langle A \rangle = \{B : B \supseteq A\}" />&mdash;the
        &ldquo;cone&rdquo; of all supersets. Right: A cover{" "}
        <M tex="\mathcal{G} = \{S_1, \ldots, S_k\}" /> is a collection whose
        upsets together contain <M tex="\mathcal{F}" />. The cost{" "}
        <M tex="\sum p^{|S_i|}" /> measures how &ldquo;expensive&rdquo;
        the cover is.
      </div>
    </div>
  );
}
