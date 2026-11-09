import type { CSSProperties } from 'react'

/*
 * The brand idea drawn literally: a suspension bridge from "you" to the provider's own terms.
 * Strokes draw themselves on load (CSS), a token crosses the deck, and the whole piece drifts on scroll (GSAP).
 */

const TOWER_L = 330
const TOWER_R = 870
const TOWER_TOP = 70
const DECK_Y = 300
/** Control point that puts the main cable's low point just above the deck. */
const SAG_CTRL_Y = 440

function mainCableY(t: number) {
  return (1 - t) ** 2 * TOWER_TOP + 2 * t * (1 - t) * SAG_CTRL_Y + t ** 2 * TOWER_TOP
}

const HANGERS = Array.from({ length: 13 }, (_, i) => {
  const t = (i + 1) / 14
  return { x: TOWER_L + (TOWER_R - TOWER_L) * t, y: mainCableY(t) }
})

const SIDE_HANGERS = [60, 130, 200, 265].flatMap((d) => {
  const t = d / (TOWER_L + 20)
  /* side cable: quadratic from deck end (−20, 280) via (230, 250) to tower top */
  const side = (u: number) => ({
    x: (1 - u) ** 2 * -20 + 2 * u * (1 - u) * 230 + u ** 2 * TOWER_L,
    y: (1 - u) ** 2 * 280 + 2 * u * (1 - u) * 250 + u ** 2 * TOWER_TOP
  })
  const l = side(t)
  return [l, { x: 1200 - l.x, y: l.y }]
})

function d(i: number): CSSProperties {
  return { '--d': i } as CSSProperties
}

export function BridgeArt() {
  return (
    <div className="hero__art" aria-hidden="true">
      <svg className="bridge" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax meet" focusable="false">
        <defs>
          <linearGradient id="bridge-cable" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="bridge-token" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="bridge__water">
          <path d="M40 350 H1160" pathLength={1} />
          <path d="M140 372 H1060" pathLength={1} />
          <path d="M260 394 H940" pathLength={1} />
        </g>

        <g className="bridge__structure">
          {[TOWER_L, TOWER_R].map((x, i) => (
            <g key={x}>
              <path className="bridge__draw" style={d(i)} d={`M${x - 12} 340 V${TOWER_TOP}`} pathLength={1} />
              <path className="bridge__draw" style={d(i + 0.2)} d={`M${x + 12} 340 V${TOWER_TOP}`} pathLength={1} />
              <path className="bridge__draw" style={d(i + 0.5)} d={`M${x - 12} 120 H${x + 12}`} pathLength={1} />
              <path className="bridge__draw" style={d(i + 0.6)} d={`M${x - 12} 210 H${x + 12}`} pathLength={1} />
            </g>
          ))}
          <path className="bridge__draw bridge__deck" style={d(0.3)} d={`M-20 ${DECK_Y} H1220`} pathLength={1} />
          <path className="bridge__draw" style={d(0.5)} d={`M-20 ${DECK_Y + 12} H1220`} pathLength={1} />
        </g>

        <g className="bridge__hangers">
          {[...HANGERS, ...SIDE_HANGERS].map((h, i) => (
            <path
              key={`${Math.round(h.x)}-${i}`}
              className="bridge__draw bridge__hanger"
              style={d(1.2 + (i % 13) * 0.06)}
              d={`M${h.x.toFixed(1)} ${h.y.toFixed(1)} V${DECK_Y}`}
              pathLength={1}
            />
          ))}
        </g>

        <g className="bridge__cables">
          <path
            className="bridge__draw bridge__cable"
            style={d(0.8)}
            d={`M-20 280 Q230 250 ${TOWER_L} ${TOWER_TOP} Q600 ${SAG_CTRL_Y} ${TOWER_R} ${TOWER_TOP} Q970 250 1220 280`}
            pathLength={1}
          />
        </g>

        <g className="bridge__ends">
          <circle cx="40" cy={DECK_Y} r="6" />
          <text x="40" y={DECK_Y - 22} textAnchor="start">
            you
          </text>
          <circle cx="1160" cy={DECK_Y} r="6" />
          <text x="1160" y={DECK_Y - 22} textAnchor="end">
            provider terms
          </text>
        </g>

        <g className="bridge__token">
          <circle r="22" fill="url(#bridge-token)" opacity="0.5" />
          <circle r="7" />
        </g>
      </svg>
    </div>
  )
}
