import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";

// Large random graph for visualizing the triangle phase transition.
// n=100 gives a sharp S-curve (unlike n=7 which is very gradual).

const N = 100;
const GR = 100; // graph circle radius
const GCX = 145, GCY = 130;

// Deterministic vertex positions in a circle
const verts = Array.from({ length: N }, (_, i) => {
  const angle = (2 * Math.PI * i) / N - Math.PI / 2;
  return { x: GCX + GR * Math.cos(angle), y: GCY + GR * Math.sin(angle) };
});

// All edges with birth times. K_100 has 4950 edges.
function seeded(seed: number): number {
  let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Edge { i: number; j: number; birth: number }
const allEdges: Edge[] = [];
{
  let idx = 0;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      allEdges.push({ i, j, birth: seeded(idx * 17 + 42) });
      idx++;
    }
  }
}

const NUM_TRIANGLES = (N * (N - 1) * (N - 2)) / 6; // C(100,3) = 161700

const CURVE_X = 310, CURVE_W = 210, CURVE_H = 200, CURVE_Y = 30;

export default function LargeRandomGraph() {
  const [p, setP] = createSignal(0.01);

  // Scale birth times to [0, maxP] range so the slider is useful
  const maxP = 0.15;

  const activeEdges = createMemo(() => {
    return allEdges.filter(e => e.birth < p());
  });

  // Check for any triangle using adjacency lists
  const hasTriangle = createMemo(() => {
    const adj = new Array<Set<number>>(N);
    for (let i = 0; i < N; i++) adj[i] = new Set();
    for (const e of activeEdges()) {
      adj[e.i].add(e.j);
      adj[e.j].add(e.i);
    }
    // For each edge, check if endpoints share a neighbor
    for (const e of activeEdges()) {
      const smaller = adj[e.i].size < adj[e.j].size ? e.i : e.j;
      const larger = smaller === e.i ? e.j : e.i;
      for (const k of adj[smaller]) {
        if (adj[larger].has(k)) return true;
      }
    }
    return false;
  });

  // Analytical S-curve: P(triangle) = 1 - (1-p^3)^C(n,3)
  const curvePoints = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const pp = (i / 200) * maxP;
      const prob = 1 - Math.pow(1 - Math.pow(pp, 3), NUM_TRIANGLES);
      pts.push(`${CURVE_X + (pp / maxP) * CURVE_W},${CURVE_Y + CURVE_H - prob * CURVE_H}`);
    }
    return pts.join(" ");
  });

  const currentProb = createMemo(
    () => 1 - Math.pow(1 - Math.pow(p(), 3), NUM_TRIANGLES)
  );
  const markerX = createMemo(() => CURVE_X + (p() / maxP) * CURVE_W);
  const markerY = createMemo(() => CURVE_Y + CURVE_H - currentProb() * CURVE_H);

  return (
    <div class="diagram-container">
      <svg width="560" height="280" viewBox="0 0 560 280">
        {/* --- Graph --- */}
        {/* Edges */}
        <For each={activeEdges()}>
          {(e) => (
            <line
              x1={verts[e.i].x} y1={verts[e.i].y}
              x2={verts[e.j].x} y2={verts[e.j].y}
              stroke={hasTriangle() ? "#2563eb" : "#94a3b8"}
              stroke-width={0.5}
              stroke-opacity={0.25}
            />
          )}
        </For>

        {/* Vertices */}
        <For each={verts}>
          {(v) => (
            <circle cx={v.x} cy={v.y} r={2}
              fill={hasTriangle() ? "#2563eb" : "#64748b"} />
          )}
        </For>

        {/* Status */}
        <text x={GCX} y={GCY + GR + 24} text-anchor="middle"
          font-size="12" font-weight="600"
          fill={hasTriangle() ? "#ea580c" : "#94a3b8"}>
          {hasTriangle() ? "Triangle exists!" : "No triangle yet"}
        </text>
        <text x={GCX} y={GCY + GR + 38} text-anchor="middle"
          font-size="10" fill="#94a3b8">
          n = {N}, edges = {activeEdges().length}
        </text>

        {/* --- S-curve --- */}
        <line x1={CURVE_X} y1={CURVE_Y + CURVE_H} x2={CURVE_X + CURVE_W + 10} y2={CURVE_Y + CURVE_H} stroke="#999" stroke-width={1} />
        <line x1={CURVE_X} y1={CURVE_Y - 5} x2={CURVE_X} y2={CURVE_Y + CURVE_H} stroke="#999" stroke-width={1} />

        <text x={CURVE_X + CURVE_W / 2} y={CURVE_Y + CURVE_H + 22} text-anchor="middle" font-size="12" fill="#666">p</text>
        <text x={CURVE_X - 6} y={CURVE_Y + CURVE_H + 2} text-anchor="end" font-size="10" fill="#999">0</text>
        <text x={CURVE_X + CURVE_W} y={CURVE_Y + CURVE_H + 14} text-anchor="middle" font-size="10" fill="#999">{maxP}</text>
        <text x={CURVE_X - 6} y={CURVE_Y + 4} text-anchor="end" font-size="10" fill="#999">1</text>

        {/* 1/2 line */}
        <line x1={CURVE_X} y1={CURVE_Y + CURVE_H / 2} x2={CURVE_X + CURVE_W} y2={CURVE_Y + CURVE_H / 2} stroke="#dc2626" stroke-width={0.8} stroke-dasharray="4,4" opacity={0.5} />
        <text x={CURVE_X - 6} y={CURVE_Y + CURVE_H / 2 + 4} text-anchor="end" font-size="10" fill="#dc2626">1/2</text>

        {/* Y-axis label */}
        <text
          x={CURVE_X - 28} y={CURVE_Y + CURVE_H / 2}
          text-anchor="middle" font-size="11" fill="#666"
          transform={`rotate(-90, ${CURVE_X - 28}, ${CURVE_Y + CURVE_H / 2})`}>
          Pr[triangle]
        </text>

        {/* Curve */}
        <polyline points={curvePoints()} fill="none" stroke="#2563eb" stroke-width={2} />

        {/* Threshold annotation */}
        {(() => {
          const threshX = CURVE_X + (1 / N / maxP) * CURVE_W;
          return (
            <>
              <line x1={threshX} y1={CURVE_Y} x2={threshX} y2={CURVE_Y + CURVE_H}
                stroke="#ea580c" stroke-width={1} stroke-dasharray="3,3" opacity={0.6} />
              <text x={threshX} y={CURVE_Y - 8} text-anchor="middle" font-size="9" fill="#ea580c">
                1/n
              </text>
            </>
          );
        })()}

        {/* Marker */}
        <line x1={markerX()} y1={CURVE_Y + CURVE_H} x2={markerX()} y2={markerY()} stroke="#ea580c" stroke-width={1} stroke-dasharray="3,3" opacity={0.6} />
        <circle cx={markerX()} cy={markerY()} r={5} fill="#ea580c" />
      </svg>

      <div class="diagram-controls">
        <label>
          <M tex="p" /> =
          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round((p() / maxP) * 1000)}
            onInput={(e) => setP((parseInt(e.currentTarget.value) / 1000) * maxP)}
          />
          <span class="value-display">{p().toFixed(4)}</span>
        </label>
      </div>
      <div class="diagram-caption">
        A random graph on {N} vertices. The phase transition for containing
        a triangle is sharp: the probability jumps from near 0 to near 1
        around <M tex="p \approx 1/n" />. Compare this to the gradual
        transition for small graphs.
      </div>
    </div>
  );
}
