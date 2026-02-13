import { createSignal, Show } from "solid-js";
import M from "./Math";

// Static SVG diagram illustrating the specification/counting argument
// Shows the two-step process: (1) pick Z = W∪T, (2) T ⊆ Ŝ ⊆ Z

const SVG_W = 520;
const SVG_H = 300;

export default function CountingDiagram() {
  const [showStep, setShowStep] = createSignal(0); // 0=setup, 1=step1, 2=step2, 3=result

  return (
    <div class="diagram-container">
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
        {/* ---- Left side: The sets ---- */}

        {/* W region */}
        <ellipse
          cx={150}
          cy={140}
          rx={120}
          ry={95}
          fill="#dbeafe"
          fill-opacity={showStep() >= 0 ? 0.3 : 0}
          stroke="#2563eb"
          stroke-width={1.5}
          stroke-dasharray="5,3"
        />
        <text x={52} y={68} font-size="14" font-weight="700" fill="#2563eb">
          W
        </text>
        <text x={42} y={84} font-size="10" fill="#2563eb">
          {"(random, |W|=w)"}
        </text>

        {/* S edge - the original edge we're looking at */}
        <Show when={showStep() >= 0}>
          <ellipse
            cx={195}
            cy={130}
            rx={75}
            ry={55}
            fill="#ea580c"
            fill-opacity={0.1}
            stroke="#ea580c"
            stroke-width={1.5}
            stroke-opacity={showStep() >= 2 ? 0.3 : 1}
          />
          <text
            x={255}
            y={90}
            font-size="13"
            font-weight="600"
            fill="#ea580c"
            opacity={showStep() >= 2 ? 0.3 : 1}
          >
            S
          </text>
        </Show>

        {/* T fragment - the leftover S'\W */}
        <Show when={showStep() >= 1}>
          <ellipse
            cx={235}
            cy={145}
            rx={35}
            ry={28}
            fill="#dc2626"
            fill-opacity={0.15}
            stroke="#dc2626"
            stroke-width={2}
          />
          <text x={222} y={150} font-size="13" font-weight="700" fill="#dc2626">
            T
          </text>
          <text x={210} y={168} font-size="9" fill="#dc2626">
            fragment
          </text>
        </Show>

        {/* Ŝ edge - the edge that contains T */}
        <Show when={showStep() >= 2}>
          <path
            d="M 130 110 Q 180 80 230 100 Q 260 115 255 150 Q 245 175 200 175 Q 150 170 130 145 Z"
            fill="#16a34a"
            fill-opacity={0.1}
            stroke="#16a34a"
            stroke-width={2}
            stroke-dasharray="4,3"
          />
          <text x={138} y={122} font-size="13" font-weight="700" fill="#16a34a">
            {"S\u0302"}
          </text>
          <text x={262} y={120} font-size="9" fill="#16a34a">
            {"(|S\u0302| \u2264 \u2113)"}
          </text>
        </Show>

        {/* Z = W ∪ T boundary */}
        <Show when={showStep() >= 1}>
          <ellipse
            cx={160}
            cy={140}
            rx={128}
            ry={102}
            fill="none"
            stroke="#7c3aed"
            stroke-width={2.5}
          />
          <text x={20} y={45} font-size="14" font-weight="700" fill="#7c3aed">
            {"Z = W \u222A T"}
          </text>
          <text x={20} y={62} font-size="10" fill="#7c3aed">
            {"|Z| = w + m"}
          </text>
        </Show>

        {/* ---- Right side: counting steps ---- */}
        <line x1={300} y1={20} x2={300} y2={280} stroke="#e5e5e5" stroke-width={1} />

        {/* Step labels */}
        <text x={320} y={35} font-size="14" font-weight="700" fill="#333">
          Counting the cost
        </text>

        {/* Step 1 */}
        <g opacity={showStep() >= 1 ? 1 : 0.2}>
          <rect x={310} y={50} width={195} height={68} rx={4} fill="#f5f0ff" stroke="#7c3aed" stroke-width={showStep() === 1 ? 2 : 1} />
          <text x={320} y={70} font-size="12" font-weight="700" fill="#7c3aed">
            {"Step 1: Pick Z = W \u222A T"}
          </text>
          <text x={320} y={88} font-size="11" fill="#555">
            Choices for Z:
          </text>
          <text x={340} y={108} font-size="12" fill="#333" font-style="italic">
            {"\u2264 C(n,w) \u00B7 (Lp)^(\u2212m)"}
          </text>
        </g>

        {/* Step 2 */}
        <g opacity={showStep() >= 2 ? 1 : 0.2}>
          <rect x={310} y={128} width={195} height={68} rx={4} fill="#f0fdf4" stroke="#16a34a" stroke-width={showStep() === 2 ? 2 : 1} />
          <text x={320} y={148} font-size="12" font-weight="700" fill="#16a34a">
            {"Step 2: T \u2286 S\u0302 \u2286 Z"}
          </text>
          <text x={320} y={166} font-size="11" fill="#555">
            {"Choices for T (subset of S\u0302):"}
          </text>
          <text x={340} y={186} font-size="12" fill="#333" font-style="italic">
            {"\u2264 2^\u2113"}
          </text>
        </g>

        {/* Result */}
        <g opacity={showStep() >= 3 ? 1 : 0.2}>
          <rect x={310} y={210} width={195} height={60} rx={4} fill="#fef3c7" stroke="#ca8a04" stroke-width={showStep() === 3 ? 2 : 1} />
          <text x={320} y={230} font-size="12" font-weight="700" fill="#ca8a04">
            Total cost:
          </text>
          <text x={320} y={252} font-size="12" fill="#333" font-weight="600">
            {"C(n,w) \u00B7 L^(\u2212m) \u00B7 2^\u2113"}
          </text>
          <text x={320} y={265} font-size="10" fill="#16a34a" font-weight="600">
            {"\u2192 tiny for m \u2265 0.9\u2113 and L large!"}
          </text>
        </g>
      </svg>

      <div class="diagram-controls">
        <button
          class={showStep() === 0 ? "active" : ""}
          onClick={() => setShowStep(0)}
        >
          Setup
        </button>
        <button
          class={showStep() === 1 ? "active" : ""}
          onClick={() => setShowStep(1)}
        >
          Step 1
        </button>
        <button
          class={showStep() === 2 ? "active" : ""}
          onClick={() => setShowStep(2)}
        >
          Step 2
        </button>
        <button
          class={showStep() === 3 ? "active" : ""}
          onClick={() => setShowStep(3)}
        >
          Result
        </button>
      </div>

      <div class="diagram-caption">
        The specification argument. We count pairs <M tex="(W, T)" /> by
        first picking <M tex="Z = W \cup T" />, then using <M tex="T \subseteq \hat{S}" /> to specify <M tex="T" />.
        The key insight: because <M tex="T" /> is a <em>minimum</em> fragment,
        it must be contained in <em>any</em> edge <M tex="\hat{S} \subseteq Z" />.
      </div>
    </div>
  );
}
