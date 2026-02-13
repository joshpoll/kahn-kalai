import { createSignal, createMemo, For, Show } from "solid-js";
import M from "./Math";
import {
  N, vertices, VERTEX_R, FRAGMENT_EDGES, seededRandom,
} from "./graphLayout";

// Same 7-vertex layout. The hypergraph H has 4-element edges (subsets of
// vertices) so fragments are interesting to visualize (size 0–4).

export default function FragmentDemo() {
  const [selectedEdge, setSelectedEdge] = createSignal(0);
  const [seed, setSeed] = createSignal(7);

  // Generate W: each vertex has ~50% chance of inclusion
  const W = createMemo(() => {
    const s = seed();
    const result = new Set<number>();
    for (let i = 0; i < N; i++) {
      if (seededRandom(s * 13 + i * 7 + 3) > 0.45) result.add(i);
    }
    return result;
  });

  const S = createMemo(() => FRAGMENT_EDGES[selectedEdge()]);

  // Find minimum fragment
  const fragmentInfo = createMemo(() => {
    const w = W();
    const s = new Set(S().set);
    const wUnionS = new Set([...w, ...s]);

    const candidates: { edge: typeof FRAGMENT_EDGES[0]; fragment: number[] }[] = [];

    for (const edge of FRAGMENT_EDGES) {
      if (edge.set.every((e) => wUnionS.has(e))) {
        const fragment = edge.set.filter((e) => !w.has(e));
        candidates.push({ edge, fragment });
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.fragment.length - b.fragment.length);
    return candidates[0];
  });

  const allCandidates = createMemo(() => {
    const w = W();
    const s = new Set(S().set);
    const wUnionS = new Set([...w, ...s]);

    return FRAGMENT_EDGES.filter((edge) =>
      edge.set.every((e) => wUnionS.has(e))
    ).map((edge) => ({
      edge,
      fragment: edge.set.filter((e) => !w.has(e)),
    }));
  });

  const fragmentSet = createMemo(() =>
    fragmentInfo() ? new Set(fragmentInfo()!.fragment) : new Set<number>()
  );

  const sSet = createMemo(() => new Set(S().set));

  return (
    <div class="diagram-container">
      <svg width="440" height="250" viewBox="0 0 440 250">
        {/* Draw edge "hulls" for the selected edge S */}
        {(() => {
          const edge = S();
          const pts = edge.set.map((v) => vertices[v]);
          const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
          const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
          return (
            <For each={pts}>
              {(pt) => (
                <line
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke={edge.color}
                  stroke-width={1.5}
                  stroke-opacity={0.2}
                />
              )}
            </For>
          );
        })()}

        {/* W background highlights */}
        <For each={vertices}>
          {(v, i) => (
            <Show when={W().has(i())}>
              <circle
                cx={v.x}
                cy={v.y}
                r={VERTEX_R + 8}
                fill="#dbeafe"
                opacity={0.4}
              />
            </Show>
          )}
        </For>

        {/* Fragment highlights (red ring) */}
        <For each={vertices}>
          {(v, i) => (
            <Show when={fragmentSet().has(i())}>
              <circle
                cx={v.x}
                cy={v.y}
                r={VERTEX_R + 10}
                fill="none"
                stroke="#dc2626"
                stroke-width={2.5}
              />
            </Show>
          )}
        </For>

        {/* Vertices */}
        <For each={vertices}>
          {(v, i) => {
            const inW = () => W().has(i());
            const inS = () => sSet().has(i());
            const inT = () => fragmentSet().has(i());
            return (
              <>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={VERTEX_R}
                  fill={
                    inT()
                      ? "#fecaca"
                      : inW()
                        ? "#dbeafe"
                        : "#f8fafc"
                  }
                  stroke={
                    inT()
                      ? "#dc2626"
                      : inS()
                        ? S().color
                        : inW()
                          ? "#2563eb"
                          : "#94a3b8"
                  }
                  stroke-width={inT() || inS() ? 2.5 : 1.5}
                />
                <text
                  x={v.x}
                  y={v.y + 5}
                  text-anchor="middle"
                  font-size="13"
                  font-weight="600"
                  fill={
                    inT()
                      ? "#dc2626"
                      : inS()
                        ? S().color
                        : inW()
                          ? "#2563eb"
                          : "#94a3b8"
                  }
                >
                  {v.label}
                </text>
              </>
            );
          }}
        </For>

        {/* Labels at the bottom of the SVG */}
        <text x={20} y={240} font-size="12" fill="#2563eb" font-weight="600">
          {"W = {"}{[...W()].map((v) => vertices[v].label).join(", ")}{"}"}
        </text>
        <text x={220} y={240} font-size="12" fill={S().color} font-weight="600">
          {S().label} = {"{"}{S().set.map((v) => vertices[v].label).join(", ")}{"}"}
        </text>
      </svg>

      {/* Fragment result - fixed height to prevent jitter */}
      <div style={{
        "text-align": "center",
        "margin": "4px 0 8px",
        "font-size": "0.9rem",
        "line-height": "1.6",
        "min-height": "52px",
      }}>
        <Show
          when={fragmentInfo()}
          fallback={
            <span style={{ color: "#94a3b8" }}>
              No edge of H fits inside W &cup; S
            </span>
          }
        >
          <div>
            Edges <M tex="S' \subseteq W \cup S" />:{" "}
            <For each={allCandidates()}>
              {(c, i) => (
                <span>
                  {i() > 0 ? ", " : ""}
                  <span style={{ color: c.edge.color, "font-weight": "600" }}>
                    {c.edge.label}
                  </span>
                  <span style={{ color: "#94a3b8" }}>
                    {" "}(leftover size {c.fragment.length})
                  </span>
                </span>
              )}
            </For>
          </div>
          <div style={{ "margin-top": "2px" }}>
            <strong style={{ color: "#dc2626" }}>
              Min fragment T = {"{"}
              {fragmentInfo()!.fragment.map((v) => vertices[v].label).join(", ")}
              {"}"}
            </strong>
            {" "}via{" "}
            <span style={{ color: fragmentInfo()!.edge.color, "font-weight": "600" }}>
              {fragmentInfo()!.edge.label}
            </span>
          </div>
        </Show>
      </div>

      <div class="diagram-controls">
        <label style={{ "font-size": "0.88rem" }}>
          Edge S:
          <For each={FRAGMENT_EDGES}>
            {(edge, idx) => (
              <button
                class={selectedEdge() === idx() ? "active" : ""}
                onClick={() => setSelectedEdge(idx())}
                style={{
                  "border-color": edge.color,
                  ...(selectedEdge() === idx()
                    ? { background: edge.color, color: "white" }
                    : {}),
                }}
              >
                {edge.label}
              </button>
            )}
          </For>
        </label>
        <button onClick={() => setSeed((s) => s + 1)}>
          Resample W
        </button>
      </div>
      <div class="legend">
        <span class="legend-item">
          <span class="legend-swatch" style="background: #dbeafe; border: 1px solid #2563eb;" />
          In W
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="background: #fecaca; border: 2px solid #dc2626;" />
          Fragment T
        </span>
        <span class="legend-item">
          <span class="legend-swatch" style="border: 2px solid #7c3aed; background: white;" />
          In S
        </span>
      </div>
      <div class="diagram-caption">
        Same 7 vertices, now with a hypergraph <M tex="\mathcal{H}" /> of
        4-element edges. The minimum fragment{" "}
        <M tex="T(S, W)" /> is the smallest <M tex="S' \setminus W" /> over
        all <M tex="S' \in \mathcal{H}" /> fitting in <M tex="W \cup S" />.
        Try different edges and resample <M tex="W" />.
      </div>
    </div>
  );
}
