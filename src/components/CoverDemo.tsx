import { createSignal, createMemo, For } from "solid-js";
import M from "./Math";
import {
  vertices, allTriangles, allEdges, VERTEX_R, FEATURED_TRIANGLES,
} from "./graphLayout";

// Same 7-vertex graph, now showing the cover (triangles) and their cost.

const NUM_TRIANGLES = allTriangles.length; // 35

export default function CoverDemo() {
  const [p, setP] = createSignal(0.35);

  // Cost of cover using all 35 triangles, each contributing p^3
  const totalCost = createMemo(() => NUM_TRIANGLES * Math.pow(p(), 3));
  const isPSmall = createMemo(() => totalCost() <= 0.5);

  // q(F): solve 35·p³ = 1/2 → p = (1/70)^{1/3}
  const qF = Math.pow(1 / (2 * NUM_TRIANGLES), 1 / 3);

  // Which featured triangles to highlight — show all 5
  const featuredEdgeSet = createMemo(() => {
    const set = new Set<string>();
    for (const tri of FEATURED_TRIANGLES) {
      const keys = [
        [tri.a, tri.b], [tri.b, tri.c], [tri.a, tri.c],
      ].map(([x, y]) => `${Math.min(x, y)}-${Math.max(x, y)}`);
      keys.forEach((k) => set.add(k));
    }
    return set;
  });

  // Map edge key → color (first matching featured triangle)
  const edgeColorMap = createMemo(() => {
    const map = new Map<string, string>();
    for (const tri of FEATURED_TRIANGLES) {
      const keys = [
        [tri.a, tri.b], [tri.b, tri.c], [tri.a, tri.c],
      ].map(([x, y]) => `${Math.min(x, y)}-${Math.max(x, y)}`);
      for (const k of keys) {
        if (!map.has(k)) map.set(k, tri.color);
      }
    }
    return map;
  });

  return (
    <div class="diagram-container">
      <svg width="540" height="260" viewBox="0 0 540 260">
        {/* --- Graph with featured triangles highlighted --- */}

        {/* Background edges (all of K_7, faintly) */}
        <For each={allEdges}>
          {(e) => {
            const key = `${e.i}-${e.j}`;
            const isFeatured = () => featuredEdgeSet().has(key);
            const color = () => edgeColorMap().get(key) ?? "#e5e5e5";
            return (
              <line
                x1={vertices[e.i].x}
                y1={vertices[e.i].y}
                x2={vertices[e.j].x}
                y2={vertices[e.j].y}
                stroke={isFeatured() ? color() : "#e5e5e5"}
                stroke-width={isFeatured() ? 2 : 0.5}
                stroke-opacity={isFeatured() ? 0.7 : 0.3}
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
                fill="#f8fafc"
                stroke="#64748b"
                stroke-width={1.5}
              />
              <text
                x={v.x}
                y={v.y + 5}
                text-anchor="middle"
                font-size="13"
                font-weight="600"
                fill="#334155"
              >
                {v.label}
              </text>
            </>
          )}
        </For>

        {/* Label the featured triangles */}
        <For each={FEATURED_TRIANGLES}>
          {(tri) => {
            const cx = (vertices[tri.a].x + vertices[tri.b].x + vertices[tri.c].x) / 3;
            const cy = (vertices[tri.a].y + vertices[tri.b].y + vertices[tri.c].y) / 3;
            return (
              <text
                x={cx}
                y={cy + 4}
                text-anchor="middle"
                font-size="10"
                font-weight="700"
                fill={tri.color}
                opacity={0.7}
              >
                {tri.label}
              </text>
            );
          }}
        </For>

        {/* --- Right panel: cost computation --- */}
        <line x1={310} y1={15} x2={310} y2={245} stroke="#e5e5e5" stroke-width={1} />

        <text x={420} y={35} text-anchor="middle" font-size="13" font-weight="700" fill="#333">
          Cover cost
        </text>

        {/* Featured triangle costs */}
        <For each={FEATURED_TRIANGLES}>
          {(tri, idx) => (
            <g>
              <text x={330} y={62 + idx() * 22} font-size="12" fill={tri.color} font-weight="600">
                {tri.label}
              </text>
              <text x={360} y={62 + idx() * 22} font-size="12" fill="#555">
                {`: p\u00B3 = ${Math.pow(p(), 3).toFixed(4)}`}
              </text>
            </g>
          )}
        </For>

        <text x={330} y={62 + 5 * 22} font-size="11" fill="#999">
          {"... and 30 more triangles"}
        </text>

        {/* Divider */}
        <line x1={330} y1={62 + 5 * 22 + 8} x2={520} y2={62 + 5 * 22 + 8} stroke="#ccc" stroke-width={0.5} />

        {/* Total */}
        <text
          x={330}
          y={62 + 5 * 22 + 30}
          font-size="13"
          font-weight="700"
          fill="#333"
        >
          {`Total: 35 \u00D7 p\u00B3 = ${totalCost().toFixed(4)}`}
        </text>

        {/* Status */}
        <rect
          x={325}
          y={62 + 5 * 22 + 42}
          width={200}
          height={26}
          rx={4}
          fill={isPSmall() ? "#f0fdf4" : "#fef2f2"}
          stroke={isPSmall() ? "#16a34a" : "#dc2626"}
          stroke-width={1}
        />
        <text
          x={425}
          y={62 + 5 * 22 + 60}
          text-anchor="middle"
          font-size="12"
          font-weight="700"
          fill={isPSmall() ? "#16a34a" : "#dc2626"}
        >
          {isPSmall() ? "\u2264 1/2 : cheap cover exists" : "> 1/2 : NOT p-small"}
        </text>
      </svg>

      {/* Controls — status is INSIDE the SVG now, so slider is stable */}
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
      <div class="diagram-caption">
        The same 7-vertex graph, now with 5 of the 35 triangles highlighted as
        cover elements. Each triangle contributes{" "}
        <M tex="p^3" /> to the cost. The full cover has cost{" "}
        <M tex="35p^3" />; it drops below 1/2 at{" "}
        <M tex={`q(\\mathcal{F}) \\approx ${qF.toFixed(2)}`} />.
      </div>
    </div>
  );
}
