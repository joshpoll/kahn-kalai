// A static SVG "roadmap" of the proof, showing the logical flow
// This mimics the hand-drawn style of the fastish algorithms paper

export default function ProofOverview() {
  return (
    <div class="diagram-container">
      <svg
        width="600"
        height="340"
        viewBox="0 0 600 340"
        style="max-width: 100%;"
      >
        {/* Background */}
        <rect x="0" y="0" width="600" height="340" fill="none" />

        {/* Start: H is not p-small */}
        <rect x="180" y="10" width="240" height="40" rx="6" fill="#fef3c7" stroke="#ca8a04" stroke-width="1.5" />
        <text x="300" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="#92400e">
          {"H is not p-small (no cheap cover)"}
        </text>

        {/* Arrow down */}
        <line x1="300" y1="50" x2="300" y2="75" stroke="#999" stroke-width="1.5" marker-end="url(#arrowhead)" />

        {/* Iteration box */}
        <rect x="100" y="75" width="400" height="160" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,3" />
        <text x="300" y="97" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">
          {"Iterative Nibbling (\u03B3 \u2248 log \u2113 rounds)"}
        </text>

        {/* Round i box */}
        <rect x="130" y="108" width="340" height="55" rx="5" fill="white" stroke="#94a3b8" stroke-width="1" />
        <text x="150" y="127" font-size="11" font-weight="600" fill="#2563eb">
          {"Round i:"}
        </text>
        <text x="215" y="127" font-size="11" fill="#333">
          {"Throw random W\u1D62, compute minimum fragments"}
        </text>

        {/* Split arrow */}
        <line x1="230" y1="145" x2="200" y2="155" stroke="#16a34a" stroke-width="1.2" />
        <line x1="370" y1="145" x2="400" y2="155" stroke="#2563eb" stroke-width="1.2" />

        {/* G covered */}
        <text x="175" y="155" text-anchor="middle" font-size="10" font-weight="600" fill="#16a34a">
          {"large fragments"}
        </text>
        <text x="425" y="155" text-anchor="middle" font-size="10" font-weight="600" fill="#2563eb">
          {"small fragments"}
        </text>

        {/* Two result boxes inside iteration */}
        <rect x="130" y="160" width="155" height="30" rx="4" fill="#f0fdf4" stroke="#16a34a" stroke-width="1" />
        <text x="207" y="180" text-anchor="middle" font-size="11" fill="#16a34a" font-weight="600">
          {"G\u1D62 \u2192 cheap cover U\u1D62"}
        </text>

        <rect x="315" y="160" width="155" height="30" rx="4" fill="#dbeafe" stroke="#2563eb" stroke-width="1" />
        <text x="392" y="180" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="600">
          {"H\u1D62 (edges \u22640.9\u2113\u1D62)"}
        </text>

        {/* Loop arrow */}
        <path d="M 470 175 Q 490 175 490 140 Q 490 110 470 108" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrowhead)" />
        <text x="502" y="145" font-size="9" fill="#64748b">
          repeat
        </text>

        {/* After iteration: two outcomes */}
        <line x1="210" y1="235" x2="210" y2="265" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrowGreen)" />
        <line x1="390" y1="235" x2="390" y2="265" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrowBlue)" />

        {/* Case a */}
        <rect x="110" y="268" width="200" height="55" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" />
        <text x="210" y="288" text-anchor="middle" font-size="11" font-weight="700" fill="#16a34a">
          {"Case (a): H\u03B3 = \u2205"}
        </text>
        <text x="210" y="304" text-anchor="middle" font-size="10" fill="#555">
          {"\u222AU\u1D62 covers H, cost > 1/2"}
        </text>
        <text x="210" y="317" text-anchor="middle" font-size="10" font-weight="600" fill="#dc2626">
          {"But E[cost] \u2192 0 \u21D2 unlikely!"}
        </text>

        {/* Case b */}
        <rect x="290" y="268" width="200" height="55" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" />
        <text x="390" y="288" text-anchor="middle" font-size="11" font-weight="700" fill="#2563eb">
          {"Case (b): H\u03B3 = {\u2205}"}
        </text>
        <text x="390" y="304" text-anchor="middle" font-size="10" fill="#555">
          {"W = \u222AW\u1D62 \u2208 \u27E8H\u27E9"}
        </text>
        <text x="390" y="317" text-anchor="middle" font-size="10" font-weight="600" fill="#16a34a">
          {"W satisfies the property!"}
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="#999" />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="#16a34a" />
          </marker>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="#2563eb" />
          </marker>
        </defs>
      </svg>
      <div class="diagram-caption">
        Overview of the proof architecture. The iterative process produces
        cheap covers at each step. After all rounds, either the covers compose
        (unlikely, since H has no cheap cover) or the random set W lands in
        the property.
      </div>
    </div>
  );
}
