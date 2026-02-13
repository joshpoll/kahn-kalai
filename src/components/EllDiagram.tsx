import M from "./Math";

// Recreates the l(F) diagram from Park's talk:
// Shows F with minimal elements of varying sizes along the boundary,
// with ℓ(F) = size of the largest one.

export default function EllDiagram() {
  const cx = 150, cy = 130, r = 105;

  // Minimal elements as small blobs of varying sizes along the boundary
  const minElements = [
    { x: cx - 60, y: cy + 35, size: 2, label: "size 2" },
    { x: cx - 20, y: cy + 25, size: 3, label: "size 3" },
    { x: cx + 25, y: cy + 30, size: 5, label: "size 5", isLargest: true },
    { x: cx + 65, y: cy + 20, size: 3, label: "size 3" },
  ];

  return (
    <div class="diagram-container">
      <svg width="420" height="280" viewBox="0 0 420 280">
        {/* Circle: 2^X */}
        <circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#64748b" stroke-width={1.5} />

        {/* F region */}
        <clipPath id="circleClipEll">
          <circle cx={cx} cy={cy} r={r - 1} />
        </clipPath>
        <path
          d={`M ${cx - 90} ${cy + 10} Q ${cx - 50} ${cy + 35} ${cx - 15} ${cy + 15}
              Q ${cx + 20} ${cy - 5} ${cx + 50} ${cy + 10}
              Q ${cx + 80} ${cy + 25} ${cx + 95} ${cy + 5}
              L ${cx + 95} ${cy - r} L ${cx - 95} ${cy - r} Z`}
          fill="#dbeafe" fill-opacity={0.4}
          clip-path="url(#circleClipEll)"
        />

        {/* Wavy boundary */}
        <path
          d={`M ${cx - 90} ${cy + 10} Q ${cx - 50} ${cy + 35} ${cx - 15} ${cy + 15}
              Q ${cx + 20} ${cy - 5} ${cx + 50} ${cy + 10}
              Q ${cx + 80} ${cy + 25} ${cx + 95} ${cy + 5}`}
          fill="none" stroke="#2563eb" stroke-width={2}
          clip-path="url(#circleClipEll)"
        />

        {/* F label */}
        <text x={cx} y={cy - 40} text-anchor="middle" font-size="16" font-weight="700" fill="#2563eb">
          {"\u2131"}
        </text>

        {/* Minimal elements */}
        {minElements.map((el) => {
          const blobR = 5 + el.size * 3;
          return (
            <>
              <ellipse cx={el.x} cy={el.y} rx={blobR} ry={blobR * 0.65}
                fill={el.isLargest ? "#fecaca" : "#fed7aa"}
                stroke={el.isLargest ? "#dc2626" : "#ea580c"}
                stroke-width={el.isLargest ? 2.5 : 1.5} />
              <text x={el.x} y={el.y + 3} text-anchor="middle"
                font-size="9" font-weight="600"
                fill={el.isLargest ? "#dc2626" : "#ea580c"}>
                {el.size}
              </text>
            </>
          );
        })}

        {/* Bracket for ℓ(F) annotation */}
        <line x1={cx + 25 - 20} y1={cy + 55} x2={cx + 25 + 20} y2={cy + 55}
          stroke="#dc2626" stroke-width={1.5} />
        <line x1={cx + 25 - 20} y1={cy + 52} x2={cx + 25 - 20} y2={cy + 58}
          stroke="#dc2626" stroke-width={1.5} />
        <line x1={cx + 25 + 20} y1={cy + 52} x2={cx + 25 + 20} y2={cy + 58}
          stroke="#dc2626" stroke-width={1.5} />
        <text x={cx + 25} y={cy + 72} text-anchor="middle"
          font-size="12" font-weight="700" fill="#dc2626">
          {"\u2113"}({"\u2131"}) = 5
        </text>

        {/* ∅ at bottom */}
        <circle cx={cx} cy={cy + r - 12} r={2.5} fill="#94a3b8" />

        {/* === Right side: explanation === */}
        <g transform="translate(280, 40)">
          <text x={0} y={0} font-size="13" font-weight="700" fill="#333">
            What is {"\u2113"}({"\u2131"})?
          </text>

          <text x={0} y={28} font-size="11" fill="#555">
            Minimal elements are the
          </text>
          <text x={0} y={44} font-size="11" fill="#555">
            smallest sets in {"\u2131"}.
          </text>

          <text x={0} y={72} font-size="11" fill="#555">
            They have different sizes.
          </text>

          <text x={0} y={100} font-size="12" font-weight="700" fill="#dc2626">
            {"\u2113"}({"\u2131"}) = max size of
          </text>
          <text x={0} y={118} font-size="12" font-weight="700" fill="#dc2626">
            a minimal element
          </text>

          <text x={0} y={150} font-size="11" fill="#555">
            The log {"\u2113"} factor in the
          </text>
          <text x={0} y={166} font-size="11" fill="#555">
            conjecture comes from the
          </text>
          <text x={0} y={182} font-size="11" fill="#555">
            number of iterations needed:
          </text>
          <text x={0} y={205} font-size="12" font-weight="600" fill="#7c3aed">
            {"\u03B3 \u2248 log(1/\u2113) / log(0.9)"}
          </text>
        </g>
      </svg>
      <div class="diagram-caption">
        The parameter <M tex="\ell(\mathcal{F})" /> is the size of the
        largest minimal element. It controls how many rounds of nibbling
        are needed: after <M tex="\gamma \approx \log_{0.9}(1/\ell)" />{" "}
        rounds, edge sizes shrink below 1.
      </div>
    </div>
  );
}
