import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";
import {
  N, vertices, allEdges, allTriangles, VERTEX_R,
  seededRandom,
} from "./graphLayout";

// Assign each edge a "birth time" so edges only appear as p increases
const edgeBirths = new Map<string, number>();
allEdges.forEach((e, idx) => {
  edgeBirths.set(`${e.i}-${e.j}`, seededRandom(idx * 17 + 42));
});

const CURVE_X = 355;
const CURVE_W = 190;
const CURVE_H = 190;
const CURVE_Y = 30;

export default function RandomGraph() {
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

  const triangleEdges = createMemo(() => {
    const triEdges = new Set<string>();
    const active = activeEdgeSet();
    for (const t of allTriangles) {
      const ab = `${Math.min(t.a, t.b)}-${Math.max(t.a, t.b)}`;
      const bc = `${Math.min(t.b, t.c)}-${Math.max(t.b, t.c)}`;
      const ac = `${Math.min(t.a, t.c)}-${Math.max(t.a, t.c)}`;
      if (active.has(ab) && active.has(bc) && active.has(ac)) {
        triEdges.add(ab);
        triEdges.add(bc);
        triEdges.add(ac);
      }
    }
    return triEdges;
  });

  const triangleVertices = createMemo(() => {
    const verts = new Set<number>();
    const active = activeEdgeSet();
    for (const t of allTriangles) {
      const ab = `${Math.min(t.a, t.b)}-${Math.max(t.a, t.b)}`;
      const bc = `${Math.min(t.b, t.c)}-${Math.max(t.b, t.c)}`;
      const ac = `${Math.min(t.a, t.c)}-${Math.max(t.a, t.c)}`;
      if (active.has(ab) && active.has(bc) && active.has(ac)) {
        verts.add(t.a);
        verts.add(t.b);
        verts.add(t.c);
      }
    }
    return verts;
  });

  const hasAnyTriangle = createMemo(() => triangleEdges().size > 0);

  // S-curve: P(triangle) ≈ 1 - (1-p^3)^35 for K_7
  const curvePoints = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const pp = i / 100;
      const prob = 1 - Math.pow(1 - Math.pow(pp, 3), 35);
      pts.push(`${CURVE_X + pp * CURVE_W},${CURVE_Y + CURVE_H - prob * CURVE_H}`);
    }
    return pts.join(" ");
  });

  const currentProb = createMemo(
    () => 1 - Math.pow(1 - Math.pow(p(), 3), 35)
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
            const isTriangle = () => triangleEdges().has(key);
            return (
              <line
                x1={vertices[e.i].x}
                y1={vertices[e.i].y}
                x2={vertices[e.j].x}
                y2={vertices[e.j].y}
                stroke={isActive() ? (isTriangle() ? "#ea580c" : "#2563eb") : "#e5e5e5"}
                stroke-width={isActive() ? (isTriangle() ? 2.5 : 1.5) : 0.7}
                stroke-opacity={isActive() ? 1 : 0.35}
                stroke-dasharray={isActive() ? "none" : "3,3"}
              />
            );
          }}
        </For>

        {/* Vertices */}
        <For each={vertices}>
          {(v, i) => (
            <>
              <circle
                cx={v.x}
                cy={v.y}
                r={VERTEX_R}
                fill={triangleVertices().has(i()) ? "#fff7ed" : "#f8fafc"}
                stroke={triangleVertices().has(i()) ? "#ea580c" : "#64748b"}
                stroke-width={triangleVertices().has(i()) ? 2 : 1.5}
              />
              <text
                x={v.x}
                y={v.y + 5}
                text-anchor="middle"
                font-size="13"
                font-weight="600"
                fill={triangleVertices().has(i()) ? "#ea580c" : "#334155"}
              >
                {v.label}
              </text>
            </>
          )}
        </For>

        {/* Triangle indicator */}
        <text
          x={150}
          y={250}
          text-anchor="middle"
          font-size="13"
          font-weight="600"
          fill={hasAnyTriangle() ? "#ea580c" : "#94a3b8"}
        >
          {hasAnyTriangle() ? "Triangle found!" : "No triangle yet"}
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
          Pr[triangle]
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
          Present edge
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #ea580c" />
          Triangle edge
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #e5e5e5" />
          Absent edge
        </span>
      </div>
      <div class="diagram-caption">
        A random graph on 7 vertices. Each edge appears independently with
        probability <M tex="p" />. Drag the slider to watch the phase
        transition: the probability of containing a triangle jumps sharply
        from near 0 to near 1.
      </div>
    </div>
  );
}
