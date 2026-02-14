import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";

const ROWS = 25, COLS = 25;
const CELL = 7;
const GRID_OX = 10, GRID_OY = 15;
const NUM_NODES = ROWS * COLS;

function nodeIdx(r: number, c: number) { return r * COLS + c; }

function seeded(seed: number): number {
  let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Bond { r1: number; c1: number; r2: number; c2: number; birth: number }
const allBonds: Bond[] = [];
{
  let idx = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 1; c++)
      allBonds.push({ r1: r, c1: c, r2: r, c2: c + 1, birth: seeded(idx++ * 17 + 42) });
  for (let r = 0; r < ROWS - 1; r++)
    for (let c = 0; c < COLS; c++)
      allBonds.push({ r1: r, c1: c, r2: r + 1, c2: c, birth: seeded(idx++ * 17 + 42) });
}

// Bond lookup: node pair -> bond index
const bondLookup = new Map<string, number>();
allBonds.forEach((b, idx) => {
  const u = nodeIdx(b.r1, b.c1), v = nodeIdx(b.r2, b.c2);
  bondLookup.set(`${Math.min(u, v)}-${Math.max(u, v)}`, idx);
});

const COMP_COLORS = [
  "#2563eb", "#ea580c", "#16a34a", "#7c3aed", "#ca8a04", "#dc2626", "#0891b2",
];

// ---- Precompute sweep at 201 sample p-values ----
interface Sample { p: number; maxFrac: number; depth: number }
const sweepSamples: Sample[] = [];
{
  const parent = new Int32Array(NUM_NODES);
  const sz = new Int32Array(NUM_NODES);
  for (let i = 0; i < NUM_NODES; i++) { parent[i] = i; sz[i] = 1; }
  let maxSz = 1;
  function find(x: number): number {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  const sorted = [...allBonds].sort((a, b) => a.birth - b.birth);
  let ei = 0;
  for (let k = 0; k <= 200; k++) {
    const pp = k / 200;
    while (ei < sorted.length && sorted[ei].birth <= pp) {
      const b = sorted[ei];
      const u = nodeIdx(b.r1, b.c1), v = nodeIdx(b.r2, b.c2);
      const ru = find(u), rv = find(v);
      if (ru !== rv) {
        parent[ru] = rv; sz[rv] += sz[ru];
        if (sz[rv] > maxSz) maxSz = sz[rv];
      }
      ei++;
    }
    // Deepest row reachable from top row
    const topRoots = new Set<number>();
    for (let c = 0; c < COLS; c++) topRoots.add(find(nodeIdx(0, c)));
    let depth = 0;
    for (let i = 0; i < NUM_NODES; i++) {
      if (topRoots.has(find(i))) {
        const row = Math.floor(i / COLS);
        if (row > depth) depth = row;
      }
    }
    sweepSamples.push({ p: pp, maxFrac: maxSz / NUM_NODES, depth });
  }
}

// ---- Chart layout ----
const C1 = { x: 240, w: 325, y: 8, h: 100 };
const C2 = { x: 240, w: 325, y: 143, h: 100 };

function polyFromPts(
  ps: { p: number }[], getVal: (s: any) => number,
  c: { x: number; w: number; y: number; h: number },
  yMax: number
): string {
  return ps.map(s => {
    const px = c.x + s.p * c.w;
    const py = c.y + c.h - (getVal(s) / yMax) * c.h;
    return `${px},${py}`;
  }).join(" ");
}

const clusterPoly = polyFromPts(sweepSamples, s => s.maxFrac, C1, 1);
const depthPoly = polyFromPts(sweepSamples, s => s.depth, C2, ROWS - 1);

// ---- 100 additional trials for background distribution ----
function ufFind(parent: Int32Array, x: number): number {
  while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}

const NUM_TRIALS = 100;
const NUM_SAMPLES = 201;
const trialClusterPolys: string[] = [];
const trialDepthPolys: string[] = [];
// Accumulators for aggregate curves
const sumMaxFrac = new Float64Array(NUM_SAMPLES);
const sumDepth = new Float64Array(NUM_SAMPLES);

for (let trial = 0; trial < NUM_TRIALS; trial++) {
  const births = allBonds.map((_, idx) => seeded(idx * 17 + 42 + (trial + 1) * 997));
  const order = Array.from({ length: allBonds.length }, (_, i) => i)
    .sort((a, b) => births[a] - births[b]);

  const par = new Int32Array(NUM_NODES);
  const sz = new Int32Array(NUM_NODES);
  const mxRow = new Int32Array(NUM_NODES);
  for (let i = 0; i < NUM_NODES; i++) {
    par[i] = i; sz[i] = 1;
    mxRow[i] = Math.floor(i / COLS);
  }
  let maxSz = 1, ei = 0;
  const cPts: { p: number; v: number }[] = [];
  const dPts: { p: number; v: number }[] = [];

  for (let k = 0; k < NUM_SAMPLES; k++) {
    const pp = k / 200;
    while (ei < order.length && births[order[ei]] <= pp) {
      const b = allBonds[order[ei]];
      const u = nodeIdx(b.r1, b.c1), v = nodeIdx(b.r2, b.c2);
      const ru = ufFind(par, u), rv = ufFind(par, v);
      if (ru !== rv) {
        par[ru] = rv; sz[rv] += sz[ru];
        mxRow[rv] = Math.max(mxRow[rv], mxRow[ru]);
        if (sz[rv] > maxSz) maxSz = sz[rv];
      }
      ei++;
    }
    let depth = 0;
    for (let c = 0; c < COLS; c++) {
      const root = ufFind(par, nodeIdx(0, c));
      if (mxRow[root] > depth) depth = mxRow[root];
    }
    const frac = maxSz / NUM_NODES;
    sumMaxFrac[k] += frac;
    sumDepth[k] += depth;
    cPts.push({ p: pp, v: frac });
    dPts.push({ p: pp, v: depth });
  }

  trialClusterPolys.push(polyFromPts(cPts, s => s.v, C1, 1));
  trialDepthPolys.push(polyFromPts(dPts, s => s.v, C2, ROWS - 1));
}

// Include main instance in aggregates
for (let k = 0; k < NUM_SAMPLES; k++) {
  sumMaxFrac[k] += sweepSamples[k].maxFrac;
  sumDepth[k] += sweepSamples[k].depth;
}

const totalTrials = NUM_TRIALS + 1;

// Aggregate: average largest cluster fraction
const avgClusterPoly = polyFromPts(
  Array.from({ length: NUM_SAMPLES }, (_, k) => ({ p: k / 200, v: sumMaxFrac[k] / totalTrials })),
  s => s.v, C1, 1
);

// Aggregate: average depth from top
const avgDepthPoly = polyFromPts(
  Array.from({ length: NUM_SAMPLES }, (_, k) => ({ p: k / 200, v: sumDepth[k] / totalTrials })),
  s => s.v, C2, ROWS - 1
);

export default function PercolationGrid() {
  const [p, setP] = createSignal(0.3);

  const components = createMemo(() => {
    const parent = new Int32Array(NUM_NODES);
    const rnk = new Int32Array(NUM_NODES);
    for (let i = 0; i < NUM_NODES; i++) parent[i] = i;
    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    for (const b of allBonds) {
      if (b.birth < p()) {
        const ru = find(nodeIdx(b.r1, b.c1)), rv = find(nodeIdx(b.r2, b.c2));
        if (ru !== rv) {
          if (rnk[ru] < rnk[rv]) parent[ru] = rv;
          else if (rnk[ru] > rnk[rv]) parent[rv] = ru;
          else { parent[rv] = ru; rnk[ru]++; }
        }
      }
    }
    const groups = new Map<number, number[]>();
    for (let i = 0; i < NUM_NODES; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(i);
    }
    const sorted = [...groups.values()].sort((a, b) => b.length - a.length);
    const vertexColor = new Int32Array(NUM_NODES);
    sorted.forEach((group, ci) => { for (const v of group) vertexColor[v] = ci; });

    // Largest component fraction
    const largestFrac = sorted[0].length / NUM_NODES;

    // Deepest row reachable from top
    const topRoots = new Set<number>();
    for (let c = 0; c < COLS; c++) topRoots.add(find(nodeIdx(0, c)));
    let depth = 0;
    let topBot = false;
    for (let i = 0; i < NUM_NODES; i++) {
      if (topRoots.has(find(i))) {
        const row = Math.floor(i / COLS);
        if (row > depth) depth = row;
      }
    }
    if (depth === ROWS - 1) topBot = true;
    return { numComponents: groups.size, vertexColor, topBot, find, largestFrac, depth };
  });

  // BFS for top-to-bottom path (set of bond indices)
  const pathBonds = createMemo(() => {
    if (!components().topBot) return new Set<number>();
    const adj = new Map<number, number[]>();
    for (const b of allBonds) {
      if (b.birth >= p()) continue;
      const u = nodeIdx(b.r1, b.c1), v = nodeIdx(b.r2, b.c2);
      if (!adj.has(u)) adj.set(u, []);
      if (!adj.has(v)) adj.set(v, []);
      adj.get(u)!.push(v);
      adj.get(v)!.push(u);
    }
    const prev = new Int32Array(NUM_NODES).fill(-1);
    const visited = new Uint8Array(NUM_NODES);
    const queue: number[] = [];
    for (let c = 0; c < COLS; c++) {
      const n = nodeIdx(0, c);
      queue.push(n); visited[n] = 1; prev[n] = n;
    }
    let target = -1, qi = 0;
    while (qi < queue.length && target === -1) {
      const u = queue[qi++];
      if (Math.floor(u / COLS) === ROWS - 1) { target = u; break; }
      for (const v of adj.get(u) ?? []) {
        if (!visited[v]) { visited[v] = 1; prev[v] = u; queue.push(v); }
      }
    }
    if (target === -1) return new Set<number>();
    const result = new Set<number>();
    let cur = target;
    while (prev[cur] !== cur) {
      const p = prev[cur];
      const key = `${Math.min(cur, p)}-${Math.max(cur, p)}`;
      const bi = bondLookup.get(key);
      if (bi !== undefined) result.add(bi);
      cur = p;
    }
    return result;
  });

  // Chart markers
  const threshX = C1.x + 0.5 * C1.w;
  const markerX = () => C1.x + p() * C1.w;
  const marker1Y = () => C1.y + C1.h - components().largestFrac * C1.h;
  const marker2Y = () => C2.y + C2.h - (components().depth / (ROWS - 1)) * C2.h;

  return (
    <div class="diagram-container">
      <svg width="590" height="275" viewBox="0 0 590 275">
        {/* ---- Grid ---- */}
        {/* Bonds */}
        <For each={allBonds}>
          {(b, bi) => {
            const u = nodeIdx(b.r1, b.c1);
            const active = () => b.birth < p();
            const ci = () => components().vertexColor[u];
            const onPath = () => pathBonds().has(bi());
            return (
              <line
                x1={GRID_OX + b.c1 * CELL} y1={GRID_OY + b.r1 * CELL}
                x2={GRID_OX + b.c2 * CELL} y2={GRID_OY + b.r2 * CELL}
                stroke={active()
                  ? (onPath() ? "#f59e0b" : COMP_COLORS[ci() % COMP_COLORS.length])
                  : "transparent"}
                stroke-width={active() ? (onPath() ? 3 : 1.5) : 0}
                stroke-opacity={active() ? (onPath() ? 1 : (ci() < 7 ? 0.8 : 0.35)) : 0}
              />
            );
          }}
        </For>

        {/* Nodes */}
        {Array.from({ length: NUM_NODES }, (_, i) => {
          const r = Math.floor(i / COLS), c = i % COLS;
          const ci = () => components().vertexColor[i];
          return (
            <circle
              cx={GRID_OX + c * CELL} cy={GRID_OY + r * CELL} r={1.5}
              fill={ci() < 7 ? COMP_COLORS[ci() % COMP_COLORS.length] : "#cbd5e1"}
            />
          );
        })}

        {/* Top/bottom row indicators */}
        <line x1={GRID_OX - 4} y1={GRID_OY} x2={GRID_OX + (COLS - 1) * CELL + 4} y2={GRID_OY}
          stroke="#94a3b8" stroke-width={0.5} stroke-dasharray="2,2" />
        <line x1={GRID_OX - 4} y1={GRID_OY + (ROWS - 1) * CELL} x2={GRID_OX + (COLS - 1) * CELL + 4} y2={GRID_OY + (ROWS - 1) * CELL}
          stroke="#94a3b8" stroke-width={0.5} stroke-dasharray="2,2" />
        <text x={GRID_OX + (COLS - 1) * CELL / 2} y={GRID_OY - 5} text-anchor="middle" font-size="8" fill="#94a3b8">top</text>
        <text x={GRID_OX + (COLS - 1) * CELL / 2} y={GRID_OY + (ROWS - 1) * CELL + 10} text-anchor="middle" font-size="8" fill="#94a3b8">bottom</text>

        {/* Status */}
        <text x={GRID_OX + (COLS - 1) * CELL / 2} y={GRID_OY + (ROWS - 1) * CELL + 24}
          text-anchor="middle" font-size="11" font-weight="600"
          fill={components().topBot ? "#f59e0b" : "#94a3b8"}>
          {components().topBot ? "Top-to-bottom path!" : `${components().numComponents} components`}
        </text>

        {/* ---- Chart 1: largest cluster ---- */}
        <line x1={C1.x} y1={C1.y + C1.h} x2={C1.x + C1.w} y2={C1.y + C1.h} stroke="#ccc" stroke-width={0.8} />
        <line x1={C1.x} y1={C1.y} x2={C1.x} y2={C1.y + C1.h} stroke="#ccc" stroke-width={0.8} />
        <text x={C1.x - 5} y={C1.y + 4} text-anchor="end" font-size="9" fill="#999">1</text>
        <text x={C1.x - 5} y={C1.y + C1.h + 2} text-anchor="end" font-size="9" fill="#999">0</text>
        <text x={C1.x + C1.w / 2} y={C1.y + C1.h + 14} text-anchor="middle" font-size="10" fill="#666">p</text>
        <text x={C1.x - 8} y={C1.y + C1.h / 2}
          text-anchor="middle" font-size="9" fill="#666"
          transform={`rotate(-90, ${C1.x - 8}, ${C1.y + C1.h / 2})`}>
          largest cluster
        </text>
        {/* Threshold line */}
        <line x1={threshX} y1={C1.y} x2={threshX} y2={C1.y + C1.h}
          stroke="#ea580c" stroke-width={0.8} stroke-dasharray="3,3" opacity={0.6} />
        <text x={threshX} y={C1.y - 3} text-anchor="middle" font-size="8" fill="#ea580c">p=½</text>
        {/* Trial curves (background) */}
        {trialClusterPolys.map(poly => (
          <polyline points={poly} fill="none" stroke="#d4d4d8" stroke-width={0.7} />
        ))}
        {/* Aggregate: average largest cluster */}
        <polyline points={avgClusterPoly} fill="none" stroke="#2563eb" stroke-width={2} />
        {/* This instance */}
        <polyline points={clusterPoly} fill="none" stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />
        {/* Marker */}
        <circle cx={markerX()} cy={marker1Y()} r={4} fill="#ea580c" />
        {/* Legend */}
        <line x1={C1.x + 5} y1={C1.y + 8} x2={C1.x + 20} y2={C1.y + 8} stroke="#2563eb" stroke-width={2} />
        <text x={C1.x + 23} y={C1.y + 11} font-size="8" fill="#666">avg (101 trials)</text>
        <line x1={C1.x + 5} y1={C1.y + 18} x2={C1.x + 20} y2={C1.y + 18} stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />
        <text x={C1.x + 23} y={C1.y + 21} font-size="8" fill="#666">this instance</text>

        {/* ---- Chart 2: depth from top ---- */}
        <line x1={C2.x} y1={C2.y + C2.h} x2={C2.x + C2.w} y2={C2.y + C2.h} stroke="#ccc" stroke-width={0.8} />
        <line x1={C2.x} y1={C2.y} x2={C2.x} y2={C2.y + C2.h} stroke="#ccc" stroke-width={0.8} />
        <text x={C2.x - 5} y={C2.y + 4} text-anchor="end" font-size="9" fill="#999">{ROWS - 1}</text>
        <text x={C2.x - 5} y={C2.y + C2.h + 2} text-anchor="end" font-size="9" fill="#999">0</text>
        <text x={C2.x + C2.w / 2} y={C2.y + C2.h + 14} text-anchor="middle" font-size="10" fill="#666">p</text>
        <text x={C2.x - 8} y={C2.y + C2.h / 2}
          text-anchor="middle" font-size="9" fill="#666"
          transform={`rotate(-90, ${C2.x - 8}, ${C2.y + C2.h / 2})`}>
          depth from top
        </text>
        {/* Threshold line */}
        <line x1={threshX} y1={C2.y} x2={threshX} y2={C2.y + C2.h}
          stroke="#ea580c" stroke-width={0.8} stroke-dasharray="3,3" opacity={0.6} />
        <text x={threshX} y={C2.y - 3} text-anchor="middle" font-size="8" fill="#ea580c">p=½</text>
        {/* Bottom row = max depth line */}
        <line x1={C2.x} y1={C2.y} x2={C2.x + C2.w} y2={C2.y}
          stroke="#f59e0b" stroke-width={0.5} stroke-dasharray="3,3" opacity={0.4} />
        {/* Trial curves (background) */}
        {trialDepthPolys.map(poly => (
          <polyline points={poly} fill="none" stroke="#d4d4d8" stroke-width={0.7} />
        ))}
        {/* Aggregate: average depth */}
        <polyline points={avgDepthPoly} fill="none" stroke="#2563eb" stroke-width={2} />
        {/* This instance */}
        <polyline points={depthPoly} fill="none" stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />
        {/* Marker */}
        <circle cx={markerX()} cy={marker2Y()} r={4} fill="#ea580c" />
        {/* Legend */}
        <line x1={C2.x + 5} y1={C2.y + 8} x2={C2.x + 20} y2={C2.y + 8} stroke="#2563eb" stroke-width={2} />
        <text x={C2.x + 23} y={C2.y + 11} font-size="8" fill="#666">avg (101 trials)</text>
        <line x1={C2.x + 5} y1={C2.y + 18} x2={C2.x + 20} y2={C2.y + 18} stroke="#ea580c" stroke-width={1.5} stroke-dasharray="4,2" />
        <text x={C2.x + 23} y={C2.y + 21} font-size="8" fill="#666">this instance</text>
      </svg>

      <div class="diagram-controls">
        <label>
          <M tex="p" /> =
          <input type="range" min="0" max="1000"
            value={Math.round(p() * 1000)}
            onInput={(e) => setP(parseInt(e.currentTarget.value) / 1000)}
          />
          <span class="value-display">{p().toFixed(3)}</span>
        </label>
      </div>
      <div class="diagram-caption">
        Bond percolation on a {ROWS}&times;{COLS} grid. Each bond is independently
        open with probability <M tex="p" />. The critical threshold is{" "}
        <M tex="p_c = 1/2" />: below it, only small isolated clusters exist;
        above it, a giant cluster spans the grid. The{" "}
        <span style={{ color: "#f59e0b", "font-weight": "600" }}>yellow path</span> shows
        a top-to-bottom crossing when one exists.
      </div>
    </div>
  );
}
