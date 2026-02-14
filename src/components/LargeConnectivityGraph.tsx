import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";

// Large random graph for visualizing the connectivity phase transition.
// n=100 gives a sharp transition around p = ln(n)/n ≈ 0.046.

const N = 100;
const GR = 100; // graph circle radius
const GCX = 145, GCY = 130;

// Deterministic vertex positions in a circle
const verts = Array.from({ length: N }, (_, i) => {
  const angle = (2 * Math.PI * i) / N - Math.PI / 2;
  return { x: GCX + GR * Math.cos(angle), y: GCY + GR * Math.sin(angle) };
});

// Seeded PRNG (same as LargeRandomGraph)
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

// Colors for connected components
const COMP_COLORS = [
  "#2563eb", "#ea580c", "#16a34a", "#7c3aed", "#ca8a04", "#dc2626", "#0891b2",
  "#be185d", "#4f46e5", "#059669", "#d97706", "#9333ea",
];

const CURVE_X = 310, CURVE_W = 210, CURVE_H = 200, CURVE_Y = 30;
const maxP = 0.12;

// Precompute largest-component fraction sweep (for overlay on chart)
const lcfSweep: string[] = [];
{
  const par = new Int32Array(N);
  const sz = new Int32Array(N);
  for (let i = 0; i < N; i++) { par[i] = i; sz[i] = 1; }
  let maxSz = 1;
  function find(x: number): number {
    while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; }
    return x;
  }
  const sorted = [...allEdges].sort((a, b) => a.birth - b.birth);
  let ei = 0;
  for (let k = 0; k <= 200; k++) {
    const pp = (k / 200) * maxP;
    while (ei < sorted.length && sorted[ei].birth <= pp) {
      const e = sorted[ei];
      const ru = find(e.i), rv = find(e.j);
      if (ru !== rv) {
        par[ru] = rv; sz[rv] += sz[ru];
        if (sz[rv] > maxSz) maxSz = sz[rv];
      }
      ei++;
    }
    const frac = maxSz / N;
    lcfSweep.push(`${CURVE_X + (pp / maxP) * CURVE_W},${CURVE_Y + CURVE_H - frac * CURVE_H}`);
  }
}
const lcfPolyline = lcfSweep.join(" ");

// ---- 100 additional trials for background distribution ----
function ufFind(parent: Int32Array, x: number): number {
  while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}

const NUM_TRIALS = 100;
const NUM_SAMPLES = 201;
const trialLcfPolys: string[] = [];
// Track how many trials are connected at each sample point
const connectedCount = new Int32Array(NUM_SAMPLES);

for (let trial = 0; trial < NUM_TRIALS; trial++) {
  const births = allEdges.map((_, idx) => seeded(idx * 17 + 42 + (trial + 1) * 997));
  const order = Array.from({ length: allEdges.length }, (_, i) => i)
    .sort((a, b) => births[a] - births[b]);

  const par = new Int32Array(N);
  const sz = new Int32Array(N);
  for (let i = 0; i < N; i++) { par[i] = i; sz[i] = 1; }
  let maxSz = 1, ei = 0;
  const pts: string[] = [];

  for (let k = 0; k < NUM_SAMPLES; k++) {
    const pp = (k / 200) * maxP;
    while (ei < order.length && births[order[ei]] <= pp) {
      const e = allEdges[order[ei]];
      const ru = ufFind(par, e.i), rv = ufFind(par, e.j);
      if (ru !== rv) {
        par[ru] = rv; sz[rv] += sz[ru];
        if (sz[rv] > maxSz) maxSz = sz[rv];
      }
      ei++;
    }
    if (maxSz === N) connectedCount[k]++;
    pts.push(`${CURVE_X + (pp / maxP) * CURVE_W},${CURVE_Y + CURVE_H - (maxSz / N) * CURVE_H}`);
  }
  trialLcfPolys.push(pts.join(" "));
}

// Also count the main instance
{
  const par = new Int32Array(N);
  const sz = new Int32Array(N);
  for (let i = 0; i < N; i++) { par[i] = i; sz[i] = 1; }
  let maxSz = 1;
  const sorted = [...allEdges].sort((a, b) => a.birth - b.birth);
  let ei = 0;
  for (let k = 0; k < NUM_SAMPLES; k++) {
    const pp = (k / 200) * maxP;
    while (ei < sorted.length && sorted[ei].birth <= pp) {
      const e = sorted[ei];
      const ru = ufFind(par, e.i), rv = ufFind(par, e.j);
      if (ru !== rv) { par[ru] = rv; sz[rv] += sz[ru]; if (sz[rv] > maxSz) maxSz = sz[rv]; }
      ei++;
    }
    if (maxSz === N) connectedCount[k]++;
  }
}

// Empirical Pr[connected] from all 101 trials
const empiricalPrPolyline = Array.from({ length: NUM_SAMPLES }, (_, k) => {
  const pp = (k / 200) * maxP;
  const frac = connectedCount[k] / (NUM_TRIALS + 1);
  return `${CURVE_X + (pp / maxP) * CURVE_W},${CURVE_Y + CURVE_H - frac * CURVE_H}`;
}).join(" ");

export default function LargeConnectivityGraph() {
  const [p, setP] = createSignal(0.02);

  const activeEdges = createMemo(() => {
    return allEdges.filter(e => e.birth < p());
  });

  // Union-find for connected components
  const components = createMemo(() => {
    const parent = new Int32Array(N);
    const rank = new Int32Array(N);
    for (let i = 0; i < N; i++) parent[i] = i;

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(a: number, b: number) {
      const ra = find(a), rb = find(b);
      if (ra === rb) return;
      if (rank[ra] < rank[rb]) { parent[ra] = rb; }
      else if (rank[ra] > rank[rb]) { parent[rb] = ra; }
      else { parent[rb] = ra; rank[ra]++; }
    }

    for (const e of activeEdges()) {
      union(e.i, e.j);
    }

    // Group vertices by component
    const groups = new Map<number, number[]>();
    for (let i = 0; i < N; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(i);
    }

    // Assign color index (largest component first)
    const sorted = [...groups.values()].sort((a, b) => b.length - a.length);
    const vertexColor = new Int32Array(N);
    sorted.forEach((group, ci) => {
      for (const v of group) vertexColor[v] = ci;
    });

    return { numComponents: groups.size, vertexColor, largestSize: sorted[0]?.length ?? 0 };
  });

  const isConnected = createMemo(() => components().numComponents === 1);

  const markerX = createMemo(() => CURVE_X + (p() / maxP) * CURVE_W);

  return (
    <div class="diagram-container">
      <svg width="560" height="280" viewBox="0 0 560 280">
        {/* --- Graph --- */}
        {/* Edges */}
        <For each={activeEdges()}>
          {(e) => {
            const ci = () => components().vertexColor[e.i];
            return (
              <line
                x1={verts[e.i].x} y1={verts[e.i].y}
                x2={verts[e.j].x} y2={verts[e.j].y}
                stroke={COMP_COLORS[ci() % COMP_COLORS.length]}
                stroke-width={0.5}
                stroke-opacity={0.3}
              />
            );
          }}
        </For>

        {/* Vertices */}
        <For each={verts}>
          {(v, i) => {
            const color = () => {
              const ci = components().vertexColor[i()];
              return COMP_COLORS[ci % COMP_COLORS.length];
            };
            return (
              <circle cx={v.x} cy={v.y} r={2} fill={color()} />
            );
          }}
        </For>

        {/* Status */}
        <text x={GCX} y={GCY + GR + 24} text-anchor="middle"
          font-size="12" font-weight="600"
          fill={isConnected() ? "#2563eb" : "#94a3b8"}>
          {isConnected()
            ? "Connected!"
            : `${components().numComponents} components`}
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
          fraction
        </text>

        {/* Trial curves (background) — largest component / n */}
        {trialLcfPolys.map(poly => (
          <polyline points={poly} fill="none" stroke="#d4d4d8" stroke-width={0.7} />
        ))}

        {/* Empirical Pr[connected] from 101 trials */}
        <polyline points={empiricalPrPolyline} fill="none" stroke="#2563eb" stroke-width={2} />

        {/* This instance: largest component / n */}
        <polyline points={lcfPolyline} fill="none" stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />

        {/* Legend */}
        <line x1={CURVE_X + 5} y1={CURVE_Y + 8} x2={CURVE_X + 25} y2={CURVE_Y + 8} stroke="#2563eb" stroke-width={2} />
        <text x={CURVE_X + 28} y={CURVE_Y + 12} font-size="9" fill="#666">Pr[connected] (101 trials)</text>
        <line x1={CURVE_X + 5} y1={CURVE_Y + 22} x2={CURVE_X + 25} y2={CURVE_Y + 22} stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />
        <text x={CURVE_X + 28} y={CURVE_Y + 26} font-size="9" fill="#666">largest component / n</text>
        <line x1={CURVE_X + 5} y1={CURVE_Y + 36} x2={CURVE_X + 25} y2={CURVE_Y + 36} stroke="#d4d4d8" stroke-width={2} />
        <text x={CURVE_X + 28} y={CURVE_Y + 40} font-size="9" fill="#999">100 other trials</text>

        {/* Threshold annotation at ln(n)/n */}
        {(() => {
          const threshP = Math.log(N) / N;
          const threshX = CURVE_X + (threshP / maxP) * CURVE_W;
          return (
            <>
              <line x1={threshX} y1={CURVE_Y} x2={threshX} y2={CURVE_Y + CURVE_H}
                stroke="#ea580c" stroke-width={1} stroke-dasharray="3,3" opacity={0.6} />
              <text x={threshX} y={CURVE_Y - 8} text-anchor="middle" font-size="9" fill="#ea580c">
                ln(n)/n
              </text>
            </>
          );
        })()}

        {/* Marker on instance largest-component curve */}
        {(() => {
          const lcfY = CURVE_Y + CURVE_H - (components().largestSize / N) * CURVE_H;
          return <circle cx={markerX()} cy={lcfY} r={4} fill="#ea580c" />;
        })()}
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
        A random graph on {N} vertices, colored by connected component.
        The <span style={{ color: "#d4d4d8", "font-weight": "600" }}>gray curves</span> show
        the largest component fraction across 100 trials; the{" "}
        <span style={{ color: "#2563eb", "font-weight": "600" }}>blue curve</span> shows
        the fraction of trials that are fully connected. A giant component
        emerges early (around <M tex="p \approx 1/n" />), but
        full connectivity&mdash;absorbing the last isolated vertices&mdash;requires{" "}
        <M tex="p \approx \ln(n)/n" />.
      </div>
    </div>
  );
}
