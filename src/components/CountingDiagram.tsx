import { createSignal, Show } from "solid-js";
import M from "./Math";
import { complementRect } from "./svgClip";

// Diagram illustrating the specification/counting argument.
// Key structural relationships (enforced via clip paths):
//   T = Ŝ \ W  (fragment is the part of Ŝ outside W)
//   Ŝ ⊆ Z      (the edge fits inside Z)
//   Z = W ∪ T   (boundary derived as W rect + Ŝ right bulge)

const SVG_W = 520;
const SVG_H = 300;

export default function CountingDiagram() {
  const [step, setStep] = createSignal(0);

  // W rectangle (random set, size w)
  const W = { x: 30, y: 50, w: 210, h: 190 };
  const wRight = W.x + W.w; // 240

  // Ŝ ellipse (edge of H contained in Z, |Ŝ| ≤ ℓ)
  const Sh = { cx: 210, cy: 145, rx: 65, ry: 48 };

  // Intersection of Ŝ with W's right edge (x = wRight)
  const t = (wRight - Sh.cx) / Sh.rx;
  const yHalf = Math.sqrt(1 - t * t) * Sh.ry;
  const iTop = +(Sh.cy - yHalf).toFixed(1);
  const iBot = +(Sh.cy + yHalf).toFixed(1);

  // Z = W ∪ T boundary: W rectangle + right bulge of Ŝ
  const zPath = [
    `M ${W.x} ${W.y}`,
    `H ${wRight}`,
    `V ${iTop}`,
    `A ${Sh.rx} ${Sh.ry} 0 0 1 ${wRight} ${iBot}`,
    `V ${W.y + W.h}`,
    `H ${W.x}`,
    `Z`,
  ].join(" ");

  const rx = 310, rw = 200;

  return (
    <div class="diagram-container">
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
        <defs>
          <pattern id="count-hatch" width="8" height="8"
            patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <line x1="0" y1="0" x2="0" y2="8"
              stroke="#16a34a" stroke-width="1.2" opacity="0.25" />
          </pattern>
          <clipPath id="count-insideW">
            <rect x={W.x} y={W.y} width={W.w} height={W.h} />
          </clipPath>
          <clipPath id="count-outsideW">
            <path clip-rule="evenodd"
              d={complementRect(W, { w: SVG_W, h: SVG_H })} />
          </clipPath>
        </defs>

        {/* ---- Left panel: set diagram ---- */}

        {/* W fill */}
        <rect x={W.x} y={W.y} width={W.w} height={W.h}
          fill="#dbeafe" fill-opacity={0.3} />

        {/* T = Ŝ \ W: right portion of Ŝ outside W (red fragment) */}
        <Show when={step() >= 1}>
          <g clip-path="url(#count-outsideW)">
            <ellipse cx={Sh.cx} cy={Sh.cy} rx={Sh.rx} ry={Sh.ry}
              fill="#dc2626" fill-opacity={0.15} />
            <ellipse cx={Sh.cx} cy={Sh.cy} rx={Sh.rx} ry={Sh.ry}
              fill="none" stroke="#dc2626" stroke-width={2} />
          </g>
        </Show>

        {/* Ŝ ∩ W: left portion of Ŝ inside W (green hatched) */}
        <Show when={step() >= 2}>
          <g clip-path="url(#count-insideW)">
            <ellipse cx={Sh.cx} cy={Sh.cy} rx={Sh.rx} ry={Sh.ry}
              fill="#16a34a" fill-opacity={0.08} />
            <ellipse cx={Sh.cx} cy={Sh.cy} rx={Sh.rx} ry={Sh.ry}
              fill="url(#count-hatch)" />
          </g>
        </Show>

        {/* Ŝ dashed outline */}
        <Show when={step() >= 2}>
          <ellipse cx={Sh.cx} cy={Sh.cy} rx={Sh.rx} ry={Sh.ry}
            fill="none" stroke="#16a34a" stroke-width={2} stroke-dasharray="4,3" />
        </Show>

        {/* Z = W ∪ T boundary */}
        <Show when={step() >= 1}>
          <path d={zPath} fill="none" stroke="#7c3aed" stroke-width={2.5} />
        </Show>

        {/* W stroke (solid at setup, dashed once Z appears) */}
        <rect x={W.x} y={W.y} width={W.w} height={W.h}
          fill="none" stroke="#2563eb"
          stroke-width={step() >= 1 ? 1 : 2}
          stroke-dasharray={step() >= 1 ? "5,3" : "none"} />

        {/* ---- Left panel labels ---- */}

        <text x={W.x + 15} y={W.y + 25}
          font-size="14" font-weight="700" fill="#2563eb">W</text>
        <foreignObject x={W.x + 10} y={W.y + 28} width={150} height={20}>
          <div style={{ "font-size": "10px", color: "#2563eb" }}>
            (random, <M tex={"|W| = w"} />)
          </div>
        </foreignObject>

        <Show when={step() >= 1}>
          <foreignObject x={W.x} y={W.y - 32} width={130} height={20}>
            <div style={{ "font-size": "14px", "font-weight": "700", color: "#7c3aed" }}>
              <M tex="Z = W \cup T" />
            </div>
          </foreignObject>
          <foreignObject x={W.x} y={W.y - 15} width={100} height={18}>
            <div style={{ "font-size": "10px", color: "#7c3aed" }}>
              <M tex="|Z| = w + m" />
            </div>
          </foreignObject>
        </Show>

        <Show when={step() >= 1}>
          <text x={258} y={Sh.cy + 5} text-anchor="middle"
            font-size="13" font-weight="700" fill="#dc2626">T</text>
          <text x={258} y={Sh.cy + 18} text-anchor="middle"
            font-size="9" fill="#dc2626">fragment</text>
        </Show>

        <Show when={step() >= 2}>
          <foreignObject x={165} y={Sh.cy - 20} width={35} height={22}>
            <div style={{ "font-size": "13px", "font-weight": "700", color: "#16a34a" }}>
              <M tex="\hat{S}" />
            </div>
          </foreignObject>
          <foreignObject x={155} y={Sh.cy} width={80} height={18}>
            <div style={{ "font-size": "9px", color: "#16a34a" }}>
              (<M tex={"|\\ \\hat{S}\\ | \\leq \\ell"} />)
            </div>
          </foreignObject>
        </Show>

        {/* ---- Right panel: counting steps ---- */}
        <line x1={300} y1={20} x2={300} y2={280} stroke="#e5e5e5" stroke-width={1} />

        <text x={rx} y={38} font-size="14" font-weight="700" fill="#333">
          Counting the cost
        </text>

        {/* Step 1 box */}
        <g opacity={step() >= 1 ? 1 : 0.2}>
          <rect x={rx} y={48} width={rw} height={78} rx={4}
            fill="#f5f0ff" stroke="#7c3aed"
            stroke-width={step() === 1 ? 2 : 1} />
          <foreignObject x={rx + 8} y={50} width={rw - 16} height={74}>
            <div style={{ "font-size": "12px" }}>
              <div style={{ "font-weight": "700", color: "#7c3aed", "margin-bottom": "3px" }}>
                Step 1: Pick <M tex="Z = W \cup T" />
              </div>
              <div style={{ color: "#555", "margin-bottom": "2px" }}>
                Choices for <M tex="Z" />:
              </div>
              <div style={{ "padding-left": "12px" }}>
                <M tex="\leq \tbinom{n}{w} \cdot (Lp)^{-m}" />
              </div>
            </div>
          </foreignObject>
        </g>

        {/* Step 2 box */}
        <g opacity={step() >= 2 ? 1 : 0.2}>
          <rect x={rx} y={134} width={rw} height={78} rx={4}
            fill="#f0fdf4" stroke="#16a34a"
            stroke-width={step() === 2 ? 2 : 1} />
          <foreignObject x={rx + 8} y={136} width={rw - 16} height={74}>
            <div style={{ "font-size": "12px" }}>
              <div style={{ "font-weight": "700", color: "#16a34a", "margin-bottom": "3px" }}>
                Step 2: <M tex="T \subseteq \hat{S} \subseteq Z" />
              </div>
              <div style={{ color: "#555", "margin-bottom": "2px" }}>
                Choices for <M tex="T" /> (subset of <M tex="\hat{S}" />):
              </div>
              <div style={{ "padding-left": "12px" }}>
                <M tex="\leq 2^\ell" />
              </div>
            </div>
          </foreignObject>
        </g>

        {/* Result box */}
        <g opacity={step() >= 3 ? 1 : 0.2}>
          <rect x={rx} y={220} width={rw} height={68} rx={4}
            fill="#fef3c7" stroke="#ca8a04"
            stroke-width={step() === 3 ? 2 : 1} />
          <foreignObject x={rx + 8} y={222} width={rw - 16} height={64}>
            <div style={{ "font-size": "12px" }}>
              <div style={{ "font-weight": "700", color: "#ca8a04", "margin-bottom": "4px" }}>
                Total cost:
              </div>
              <div style={{ "font-weight": "600", "margin-bottom": "2px" }}>
                <M tex="\tbinom{n}{w} \cdot L^{-m} \cdot 2^\ell" />
              </div>
              <div style={{ "font-size": "10px", color: "#16a34a", "font-weight": "600" }}>
                {"\u2192"} tiny for <M tex="m \geq 0.9\ell" /> and <M tex="L" /> large!
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>

      <div class="diagram-controls">
        {["Setup", "Step 1", "Step 2", "Result"].map((label, i) => (
          <button
            class={step() === i ? "active" : ""}
            onClick={() => setStep(i)}>
            {label}
          </button>
        ))}
      </div>

      <div class="diagram-caption">
        The specification argument. We count pairs <M tex="(W, T)" /> by
        first picking <M tex="Z = W \cup T" />, then using{" "}
        <M tex="T \subseteq \hat{S}" /> to specify <M tex="T" />.
        The key insight: because <M tex="T" /> is a <em>minimum</em> fragment,
        it must be contained in <em>any</em> edge{" "}
        <M tex="\hat{S} \subseteq Z" />.
      </div>
    </div>
  );
}
