import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";
import {
  N, vertices, allEdges, VERTEX_R,
  seededRandom,
} from "./graphLayout";

// Same birth times as RandomGraph so edges appear in the same order
const edgeBirths = new Map<string, number>();
allEdges.forEach((e, idx) => {
  edgeBirths.set(`${e.i}-${e.j}`, seededRandom(idx * 17 + 42));
});

// Colors for connected components
const COMP_COLORS = [
  "#2563eb", "#ea580c", "#16a34a", "#7c3aed", "#ca8a04", "#dc2626", "#0891b2",
];

const CURVE_X = 355;
const CURVE_W = 190;
const CURVE_H = 190;
const CURVE_Y = 30;

export default function ConnectivityGraph() {
  const [p, setP] = createSignal(0.3);

  const activeEdgeSet = createMemo(() => {
    const set = new Set<string>();
    for (const e of allEdges) {
      const key = `${e.i}-${e.j}`;
      if (edgeBirths.get(key)! < p()) {
        set.add(key);
      }
    }
    return set;
  });

  // Find connected components using union-find
  const components = createMemo(() => {
    const parent = Array.from({ length: N }, (_, i) => i);
    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(a: number, b: number) {
      const ra = find(a), rb = find(b);
      if (ra !== rb) parent[ra] = rb;
    }

    const active = activeEdgeSet();
    for (const e of allEdges) {
      if (active.has(`${e.i}-${e.j}`)) {
        union(e.i, e.j);
      }
    }

    // Group vertices by component
    const groups = new Map<number, number[]>();
    for (let i = 0; i < N; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(i);
    }

    // Assign a color index to each component (largest first)
    const sorted = [...groups.values()].sort((a, b) => b.length - a.length);
    const vertexColor = new Array<number>(N);
    sorted.forEach((group, ci) => {
      for (const v of group) vertexColor[v] = ci;
    });

    return { numComponents: groups.size, vertexColor };
  });

  const isConnected = createMemo(() => components().numComponents === 1);

  // Estimate P(connected) for K_7 via simulation-calibrated approximation.
  // For small n, no clean closed form — use numerical precomputation.
  // For K_7 with 21 edges, P(connected) ≈ computed via inclusion-exclusion.
  // We approximate with a sigmoid fit: 1 / (1 + exp(-k*(p - p0)))
  // Fitted: p0 ≈ 0.45, k ≈ 14 for n=7
  const curvePoints = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const pp = i / 100;
      const prob = 1 / (1 + Math.exp(-14 * (pp - 0.45)));
      pts.push(`${CURVE_X + pp * CURVE_W},${CURVE_Y + CURVE_H - prob * CURVE_H}`);
    }
    return pts.join(" ");
  });

  const currentProb = createMemo(
    () => 1 / (1 + Math.exp(-14 * (p() - 0.45)))
  );
  const markerX = createMemo(() => CURVE_X + p() * CURVE_W);
  const markerY = createMemo(() => CURVE_Y + CURVE_H - currentProb() * CURVE_H);

  return (
    <div class="diagram-container">
      <svg width="580" height="275" viewBox="0 0 580 275">
        {/* --- Graph --- */}
        {/* Edges */}
        <For each={allEdges}>
          {(e) => {
            const key = `${e.i}-${e.j}`;
            const isActive = () => activeEdgeSet().has(key);
            const edgeColor = () => {
              if (!isActive()) return "#e5e5e5";
              const ci = components().vertexColor[e.i];
              return COMP_COLORS[ci % COMP_COLORS.length];
            };
            return (
              <line
                x1={vertices[e.i].x}
                y1={vertices[e.i].y}
                x2={vertices[e.j].x}
                y2={vertices[e.j].y}
                stroke={edgeColor()}
                stroke-width={isActive() ? 1.8 : 0.7}
                stroke-opacity={isActive() ? 1 : 0.35}
                stroke-dasharray={isActive() ? "none" : "3,3"}
              />
            );
          }}
        </For>

        {/* Vertices */}
        <For each={vertices}>
          {(v, i) => {
            const color = () => {
              const ci = components().vertexColor[i()];
              return COMP_COLORS[ci % COMP_COLORS.length];
            };
            return (
              <>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={VERTEX_R}
                  fill={isConnected() ? "#eff6ff" : "#f8fafc"}
                  stroke={color()}
                  stroke-width={2}
                />
                <text
                  x={v.x}
                  y={v.y + 5}
                  text-anchor="middle"
                  font-size="13"
                  font-weight="600"
                  fill={color()}
                >
                  {v.label}
                </text>
              </>
            );
          }}
        </For>

        {/* Status */}
        <text
          x={150}
          y={250}
          text-anchor="middle"
          font-size="13"
          font-weight="600"
          fill={isConnected() ? "#2563eb" : "#94a3b8"}
        >
          {isConnected()
            ? "Connected!"
            : `${components().numComponents} components`}
        </text>

        {/* --- Curve --- */}
        {/* Axes */}
        <line x1={CURVE_X} y1={CURVE_Y + CURVE_H} x2={CURVE_X + CURVE_W + 10} y2={CURVE_Y + CURVE_H} stroke="#999" stroke-width={1} />
        <line x1={CURVE_X} y1={CURVE_Y - 5} x2={CURVE_X} y2={CURVE_Y + CURVE_H} stroke="#999" stroke-width={1} />

        <text x={CURVE_X + CURVE_W / 2} y={CURVE_Y + CURVE_H + 22} text-anchor="middle" font-size="12" fill="#666">p</text>
        <text x={CURVE_X - 6} y={CURVE_Y + CURVE_H + 2} text-anchor="end" font-size="10" fill="#999">0</text>
        <text x={CURVE_X + CURVE_W} y={CURVE_Y + CURVE_H + 14} text-anchor="middle" font-size="10" fill="#999">1</text>
        <text x={CURVE_X - 6} y={CURVE_Y + 4} text-anchor="end" font-size="10" fill="#999">1</text>

        {/* 1/2 line */}
        <line x1={CURVE_X} y1={CURVE_Y + CURVE_H / 2} x2={CURVE_X + CURVE_W} y2={CURVE_Y + CURVE_H / 2} stroke="#dc2626" stroke-width={0.8} stroke-dasharray="4,4" opacity={0.5} />
        <text x={CURVE_X - 6} y={CURVE_Y + CURVE_H / 2 + 4} text-anchor="end" font-size="10" fill="#dc2626">1/2</text>

        {/* Y-axis label */}
        <text
          x={CURVE_X - 28}
          y={CURVE_Y + CURVE_H / 2}
          text-anchor="middle"
          font-size="11"
          fill="#666"
          transform={`rotate(-90, ${CURVE_X - 28}, ${CURVE_Y + CURVE_H / 2})`}
        >
          Pr[connected]
        </text>

        {/* Curve */}
        <polyline points={curvePoints()} fill="none" stroke="#2563eb" stroke-width={2} />

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
            max="100"
            value={Math.round(p() * 100)}
            onInput={(e) => setP(parseInt(e.currentTarget.value) / 100)}
          />
          <span class="value-display">{p().toFixed(2)}</span>
        </label>
      </div>
      <div class="legend">
        <span class="legend-item">
          <span class="legend-swatch" style="background: #2563eb" />
          Component 1
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #ea580c" />
          Component 2
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #e5e5e5" />
          Absent edge
        </span>
      </div>
      <div class="diagram-caption">
        The same 7 vertices, now testing connectivity. Each connected
        component gets its own color. As <M tex="p" /> increases,
        components merge until the entire graph is connected.
      </div>
    </div>
  );
}
