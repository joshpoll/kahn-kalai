import { createSignal, createMemo, For, Show } from "solid-js";
import M from "./Math";

// Visualize the iteration: edges shrink by factor 0.9 at each step
// Show the pipeline H₀ → H₁ → ... → H_γ

const W = 560;
const H = 260;
const MARGIN = 40;
const BAR_HEIGHT = 24;

export default function IterationDemo() {
  const [ell, setEll] = createSignal(20); // initial max edge size
  const [step, setStep] = createSignal(0);

  const gamma = createMemo(() => {
    // γ = ⌊log_{0.9}(1/ℓ)⌋ + 1
    return Math.floor(Math.log(1 / ell()) / Math.log(0.9)) + 1;
  });

  const maxSteps = createMemo(() => Math.min(gamma(), 40));

  const steps = createMemo(() => {
    const result = [];
    for (let i = 0; i <= maxSteps(); i++) {
      const ellI = ell() * Math.pow(0.9, i);
      result.push({
        i,
        ell: ellI,
        label: `ℓ_${i}`,
        isTerminal: ellI < 1,
      });
    }
    return result;
  });

  // Visible range: show steps around current step
  const visibleRange = createMemo(() => {
    const s = step();
    const max = maxSteps();
    const windowSize = 8;
    let start = Math.max(0, s - 3);
    let end = Math.min(max, start + windowSize);
    start = Math.max(0, end - windowSize);
    return { start, end };
  });

  const visibleSteps = createMemo(() => {
    const { start, end } = visibleRange();
    return steps().slice(start, end + 1);
  });

  const barMaxWidth = W - 2 * MARGIN - 100;

  return (
    <div class="diagram-container">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Title */}
        <text x={W / 2} y={22} text-anchor="middle" font-size="13" font-weight="600" fill="#333">
          Edge sizes shrink by factor 0.9 each round
        </text>

        <For each={visibleSteps()}>
          {(s, idx) => {
            const y = 42 + idx() * 28;
            const barWidth = Math.max(2, (s.ell / ell()) * barMaxWidth);
            const isActive = () => s.i === step();
            const isPast = () => s.i < step();
            const isFuture = () => s.i > step();

            return (
              <g opacity={isFuture() ? 0.3 : 1}>
                {/* Step label */}
                <text
                  x={MARGIN}
                  y={y + BAR_HEIGHT / 2 + 4}
                  font-size="12"
                  font-weight={isActive() ? "700" : "400"}
                  fill={isActive() ? "#2563eb" : isPast() ? "#16a34a" : "#999"}
                >
                  i={s.i}
                </text>

                {/* Bar */}
                <rect
                  x={MARGIN + 40}
                  y={y}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  rx={3}
                  fill={
                    s.isTerminal
                      ? "#fecaca"
                      : isActive()
                        ? "#dbeafe"
                        : isPast()
                          ? "#dcfce7"
                          : "#f5f5f5"
                  }
                  stroke={
                    s.isTerminal
                      ? "#dc2626"
                      : isActive()
                        ? "#2563eb"
                        : isPast()
                          ? "#16a34a"
                          : "#ddd"
                  }
                  stroke-width={isActive() ? 2 : 1}
                />

                {/* Edge size label */}
                <text
                  x={MARGIN + 40 + barWidth + 8}
                  y={y + BAR_HEIGHT / 2 + 4}
                  font-size="11"
                  fill={s.isTerminal ? "#dc2626" : "#666"}
                  font-weight={s.isTerminal ? "600" : "400"}
                >
                  {s.isTerminal
                    ? `${s.ell.toFixed(1)} < 1 (done!)`
                    : `ℓ = ${s.ell.toFixed(1)}`}
                </text>

                {/* Action annotation for active step */}
                <Show when={isActive() && !s.isTerminal}>
                  <text
                    x={MARGIN + 40 + barWidth / 2}
                    y={y + BAR_HEIGHT / 2 + 4}
                    text-anchor="middle"
                    font-size="10"
                    fill={isActive() ? "#2563eb" : "#999"}
                    font-weight="600"
                  >
                    {`throw W\u2080 \u2192 split into G \u222A H'`.replace('W\u2080', `W${'\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089'[s.i+1] ?? String(s.i+1)}`)}
                  </text>
                </Show>

                {/* Arrow to next */}
                <Show when={idx() < visibleSteps().length - 1 && !s.isTerminal}>
                  <text
                    x={MARGIN + 27}
                    y={y + BAR_HEIGHT + 10}
                    font-size="10"
                    fill="#999"
                  >
                    {"\u2193"}
                  </text>
                </Show>
              </g>
            );
          }}
        </For>
      </svg>

      <div class="diagram-controls">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step() === 0}
        >
          &larr; Prev
        </button>
        <span style={{ "font-family": "var(--font-mono)", "font-size": "0.85rem" }}>
          Step {step()} / {maxSteps()}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(maxSteps(), s + 1))}
          disabled={step() >= maxSteps()}
        >
          Next &rarr;
        </button>
        <button
          onClick={() => { setStep(0); }}
        >
          Reset
        </button>
      </div>

      <div class="diagram-controls">
        <label>
          Initial <M tex="\ell" /> =
          <input
            type="range"
            min="5"
            max="60"
            value={ell()}
            onInput={(e) => {
              setEll(parseInt(e.currentTarget.value));
              setStep(0);
            }}
          />
          <span class="value-display">{ell()}</span>
        </label>
        <span style={{ "font-size": "0.85rem", color: "#999" }}>
          (<M tex={`\\gamma = ${gamma()}`} /> rounds needed)
        </span>
      </div>
      <div class="diagram-caption">
        Each round, the maximum edge size drops by factor 0.9.
        After <M tex="\gamma \approx \log_{0.9}(1/\ell)" /> rounds, edges have
        size &lt; 1, so <M tex="\mathcal{H}_\gamma" /> is either empty or <M tex="\{\\emptyset\}" />.
      </div>
    </div>
  );
}
