import M from "./Math";

// Recreates the l(F) diagram from Park's talk:
// Shows F with minimal elements of varying sizes along the boundary,
// with ℓ(F) = size of the largest one.

export default function EllDiagram() {
  const cx = 150, cy = 130, r = 105;
  const svgW = 420, svgH = 280;

  // Wavy boundary spanning the full circle diameter
  const aStart = 0.05, aEnd = 0.95;
  const wavyPoint = (t: number) => {
    const angle = Math.PI * aStart + t * Math.PI * (aEnd - aStart);
    const baseX = cx - r * Math.cos(angle);
    const baseY = cy + r * 0.15 + Math.sin(angle) * 8;
    const wave = Math.sin(t * Math.PI * 4) * 12;
    return { x: baseX, y: baseY + wave };
  };

  const steps = 60;
  const wavyPts = Array.from({ length: steps + 1 }, (_, i) => wavyPoint(i / steps));
  const wavyPath = wavyPts.map(p => `${p.x},${p.y}`).join(" ");

  // F region: wavy boundary then close via big box above (atop filter clips to circle)
  const fRegionPath = (() => {
    const segs = wavyPts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`));
    const pad = 40;
    return segs.join(" ") +
      ` L ${cx + r + pad},${cy + r + pad}` +
      ` L ${cx + r + pad},${cy - r - pad}` +
      ` L ${cx - r - pad},${cy - r - pad}` +
      ` L ${cx - r - pad},${cy + r + pad} Z`;
  })();

  // Minimal elements positioned exactly on the wavy boundary
  const minElements = [
    { t: 0.18, size: 2, label: "size 2" },
    { t: 0.38, size: 3, label: "size 3" },
    { t: 0.58, size: 5, label: "size 5", isLargest: true },
    { t: 0.80, size: 3, label: "size 3" },
  ].map(el => ({ ...el, ...wavyPoint(el.t) }));

  return (
    <div class="diagram-container">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          <clipPath id="circleClipEll">
            <circle cx={cx} cy={cy} r={r - 1} />
          </clipPath>
        </defs>

        {/* Circle fill */}
        <circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* F region + wavy boundary, clipped to circle */}
        <path d={fRegionPath} fill="#dbeafe" fill-opacity={0.5} clip-path="url(#circleClipEll)" />
        <polyline points={wavyPath} fill="none" stroke="#2563eb" stroke-width={2} clip-path="url(#circleClipEll)" />

        {/* F label — foreignObject for KaTeX */}
        <foreignObject x={cx - 25} y={cy - 78} width={50} height={36}>
          <div style={{ "text-align": "center", "font-size": "20px" }}>
            <M tex="\mathcal{F}" />
          </div>
        </foreignObject>

        {/* ∅ at bottom */}
        <circle cx={cx} cy={cy + r - 8} r={2.5} fill="white" stroke="#94a3b8" stroke-width={1} />

        {/* Minimal elements on the boundary */}
        {minElements.map((el) => {
          const blobR = 5 + el.size * 3;
          return (
            <>
              <ellipse cx={el.x} cy={el.y} rx={blobR} ry={blobR * 0.65}
                fill={el.isLargest ? "#fecaca" : "#fed7aa"}
                stroke={el.isLargest ? "#dc2626" : "#ea580c"}
                stroke-width={el.isLargest ? 2.5 : 1.5} />
              <text x={el.x} y={el.y + 3} text-anchor="middle"
                font-size="9" font-weight="600"
                fill={el.isLargest ? "#dc2626" : "#ea580c"}>
                {el.size}
              </text>
            </>
          );
        })}

        {/* Bracket for ℓ(F) annotation under the largest element */}
        {(() => {
          const largest = minElements.find(el => el.isLargest)!;
          return (
            <>
              <line x1={largest.x - 20} y1={largest.y + 22} x2={largest.x + 20} y2={largest.y + 22}
                stroke="#dc2626" stroke-width={1.5} />
              <line x1={largest.x - 20} y1={largest.y + 19} x2={largest.x - 20} y2={largest.y + 25}
                stroke="#dc2626" stroke-width={1.5} />
              <line x1={largest.x + 20} y1={largest.y + 19} x2={largest.x + 20} y2={largest.y + 25}
                stroke="#dc2626" stroke-width={1.5} />
              <foreignObject x={largest.x - 35} y={largest.y + 26} width={70} height={24}>
                <div style={{ "text-align": "center", "font-size": "12px", "font-weight": "700", color: "#dc2626" }}>
                  <M tex="\ell(\mathcal{F}) = 5" />
                </div>
              </foreignObject>
            </>
          );
        })()}

        {/* === Right side: explanation === */}
        <g transform="translate(280, 40)">
          <foreignObject x={0} y={-12} width={130} height={28}>
            <div style={{ "font-size": "13px", "font-weight": "700", color: "#333" }}>
              What is <M tex="\ell(\mathcal{F})" />?
            </div>
          </foreignObject>

          <text x={0} y={28} font-size="11" fill="#555">
            Minimal elements are the
          </text>
          <text x={0} y={44} font-size="11" fill="#555">
            smallest sets in
          </text>
          <foreignObject x={82} y={31} width={50} height={20}>
            <div style={{ "font-size": "11px" }}>
              <M tex="\mathcal{F}" />
            </div>
          </foreignObject>
          <text x={102} y={44} font-size="11" fill="#555">.</text>

          <text x={0} y={72} font-size="11" fill="#555">
            They have different sizes.
          </text>

          <foreignObject x={0} y={82} width={140} height={44}>
            <div style={{ "font-size": "12px", "font-weight": "700", color: "#dc2626" }}>
              <M tex="\ell(\mathcal{F})" /> = max size of a minimal element
            </div>
          </foreignObject>

          <text x={0} y={150} font-size="11" fill="#555">
            The log
          </text>
          <foreignObject x={38} y={137} width={20} height={20}>
            <div style={{ "font-size": "11px" }}>
              <M tex="\ell" />
            </div>
          </foreignObject>
          <text x={52} y={150} font-size="11" fill="#555">
            factor in the
          </text>
          <text x={0} y={166} font-size="11" fill="#555">
            conjecture comes from the
          </text>
          <text x={0} y={182} font-size="11" fill="#555">
            number of iterations needed.
          </text>
        </g>
      </svg>
      <div class="diagram-caption">
        The parameter <M tex="\ell(\mathcal{F})" /> is the size of the
        largest minimal element. It controls how many rounds of nibbling
        are needed: after <M tex="\gamma \approx \log_{0.9}(1/\ell)" />{" "}
        rounds, edge sizes shrink below 1.
      </div>
    </div>
  );
}
