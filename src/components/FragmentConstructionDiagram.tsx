import M from "./Math";
import { complementRect, crescentMetrics } from "./svgClip";

// Venn-style diagram for the minimum fragment construction:
// W (rectangle), S (ellipse) overlap. S' (dashed green ellipse) fits inside W∪S.
// T = S'\W is derived by clipping S' to the complement of W.

export default function FragmentConstructionDiagram() {
  // W rectangle
  const W = { x: 30, y: 30, w: 170, h: 180 };

  // S ellipse (the target edge)
  const S = { cx: 280, cy: 120, rx: 110, ry: 80 };

  // S' ellipse (covering edge from H, fits inside W ∪ S)
  const Sp = { cx: 215, cy: 115, rx: 95, ry: 50 };

  const svgW = 540, svgH = 265;
  const wRight = W.x + W.w;

  // Safe label positions for clipped crescent regions
  const tPos = crescentMetrics(Sp, wRight, 'right');
  const spWPos = crescentMetrics(Sp, wRight, 'left');

  return (
    <div class="diagram-container">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          <pattern id="frag-hatch" width="8" height="8"
            patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="8"
              stroke="#7c3aed" stroke-width="1.2" opacity="0.25" />
          </pattern>

          {/* Clip to inside W */}
          <clipPath id="frag-insideW">
            <rect x={W.x} y={W.y} width={W.w} height={W.h} />
          </clipPath>

          {/* Clip to outside W (even-odd: outer box minus W hole) */}
          <clipPath id="frag-outsideW">
            <path clip-rule="evenodd"
              d={complementRect(W, { w: svgW, h: svgH })} />
          </clipPath>
        </defs>

        {/* W fill */}
        <rect x={W.x} y={W.y} width={W.w} height={W.h} rx={4}
          fill="#dbeafe" fill-opacity={0.3} stroke="none" />

        {/* S fill */}
        <ellipse cx={S.cx} cy={S.cy} rx={S.rx} ry={S.ry}
          fill="#ea580c" fill-opacity={0.08} stroke="none" />

        {/* S' ∩ W: S' clipped to inside W (hatched purple, "absorbed") */}
        <g clip-path="url(#frag-insideW)">
          <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry}
            fill="#7c3aed" fill-opacity={0.12} />
          <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry}
            fill="url(#frag-hatch)" />
        </g>

        {/* T = S' \ W: S' clipped to outside W (red fragment) */}
        <g clip-path="url(#frag-outsideW)">
          <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry}
            fill="#dc2626" fill-opacity={0.15} />
          <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry}
            fill="none" stroke="#dc2626" stroke-width={2.5} />
        </g>

        {/* S' dashed outline (green) */}
        <ellipse cx={Sp.cx} cy={Sp.cy} rx={Sp.rx} ry={Sp.ry}
          fill="none" stroke="#16a34a" stroke-width={1.5} stroke-dasharray="6,4" />

        {/* W stroke (on top for crispness) */}
        <rect x={W.x} y={W.y} width={W.w} height={W.h} rx={4}
          fill="none" stroke="#2563eb" stroke-width={2} />

        {/* S stroke */}
        <ellipse cx={S.cx} cy={S.cy} rx={S.rx} ry={S.ry}
          fill="none" stroke="#ea580c" stroke-width={2} />

        {/* === Labels === */}

        {/* W */}
        <text x={W.x + W.w / 2} y={W.y - 8} text-anchor="middle"
          font-size="14" font-weight="700" fill="#2563eb">W</text>
        <text x={W.x + W.w / 2} y={W.y + W.h + 16} text-anchor="middle"
          font-size="10" fill="#2563eb">(random subset)</text>

        {/* S */}
        <text x={355} y={50} font-size="14" font-weight="700" fill="#ea580c">S</text>
        <text x={355} y={65} font-size="10" fill="#ea580c">(edge of H)</text>

        {/* S' — label just above the ellipse */}
        <text x={Sp.cx} y={Sp.cy - Sp.ry - 6} text-anchor="middle"
          font-size="12" font-weight="600" fill="#16a34a">S'</text>

        {/* S' ∩ W — computed safe position inside left crescent */}
        <text x={spWPos.center.x} y={spWPos.center.y + 4} text-anchor="middle"
          font-size="11" font-weight="600" fill="#7c3aed">S' {"\u2229"} W</text>

        {/* T — computed safe position inside right crescent */}
        <text x={tPos.center.x} y={tPos.center.y + 5} text-anchor="middle"
          font-size="14" font-weight="700" fill="#dc2626">T</text>

        {/* W ∪ S bracket */}
        <line x1={W.x - 5} y1={240} x2={S.cx + S.rx + 5} y2={240}
          stroke="#94a3b8" stroke-width={1} />
        <text x={(W.x + S.cx + S.rx) / 2} y={255} text-anchor="middle"
          font-size="11" fill="#94a3b8">W {"\u222A"} S</text>
      </svg>
      <div class="diagram-caption">
        The fragment construction. Given edge <M tex="S" /> and random set{" "}
        <M tex="W" />, find an edge <M tex="S' \in \mathcal{H}" /> fitting
        inside <M tex="W \cup S" /> whose leftover{" "}
        <M tex="T = S' \setminus W" /> is as small as possible. The{" "}
        <span style={{ color: "#7c3aed", "font-weight": "600" }}>overlap</span>{" "}
        <M tex="S' \cap W" /> is &ldquo;absorbed&rdquo; by <M tex="W" />;
        only the{" "}
        <span style={{ color: "#dc2626", "font-weight": "600" }}>fragment</span>{" "}
        <M tex="T" /> remains.
      </div>
    </div>
  );
}
