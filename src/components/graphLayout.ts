// Shared graph layout used across all interactive demos
// 7 vertices arranged in a circle — the same visual everywhere

export const N = 7;
export const RADIUS = 95;
export const CX = 150;
export const CY = 125;

export const VERTEX_R = 14;

export const vertices = Array.from({ length: N }, (_, i) => {
  const angle = (2 * Math.PI * i) / N - Math.PI / 2;
  return {
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
    label: String(i + 1),
  };
});

// All possible edges of K_7
export interface Edge {
  i: number;
  j: number;
}

export const allEdges: Edge[] = [];
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    allEdges.push({ i, j });
  }
}

// All 35 triangles in K_7
export interface Triangle {
  a: number;
  b: number;
  c: number;
}

export const allTriangles: Triangle[] = [];
for (let a = 0; a < N; a++) {
  for (let b = a + 1; b < N; b++) {
    for (let c = b + 1; c < N; c++) {
      allTriangles.push({ a, b, c });
    }
  }
}

// A few "featured" triangles for the cover & fragment demos
// These tile the vertices nicely and overlap in interesting ways
export const FEATURED_TRIANGLES = [
  { a: 0, b: 1, c: 2, color: "#2563eb", label: "T\u2081" },
  { a: 2, b: 3, c: 4, color: "#ea580c", label: "T\u2082" },
  { a: 4, b: 5, c: 6, color: "#16a34a", label: "T\u2083" },
  { a: 0, b: 3, c: 5, color: "#7c3aed", label: "T\u2084" },
  { a: 1, b: 4, c: 6, color: "#ca8a04", label: "T\u2085" },
];

// Hypergraph edges for the fragment demo — 4-element subsets of vertices
// (larger edges make fragments more interesting to visualize)
export const FRAGMENT_EDGES = [
  { set: [0, 1, 2, 3], color: "#2563eb", label: "S\u2081" },
  { set: [1, 2, 4, 5], color: "#ea580c", label: "S\u2082" },
  { set: [0, 3, 5, 6], color: "#16a34a", label: "S\u2083" },
  { set: [2, 3, 4, 6], color: "#7c3aed", label: "S\u2084" },
];

// Color palette for vertices
export const VERTEX_FILL = "#f8fafc";
export const VERTEX_STROKE = "#64748b";

// Seeded PRNG
export function seededRandom(seed: number): number {
  let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
