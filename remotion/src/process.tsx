import React from "react";
import { useCurrentFrame } from "remotion";
import { ACCENT, DURATION, loopOpacity, pop, t } from "./kit";

/**
 * How-we-work loops: one per phase, 480×360, 4s.
 *
 * Rendered on pure black with light strokes on purpose. The site blends them
 * with `mix-blend-mode: screen` on dark cards (black vanishes) and, inverted
 * with hue preserved, with `multiply` on light cards (white vanishes) — one
 * asset that sits on either theme without a baked rectangle.
 *
 * Strokes are thick for their size: these play at ~180–260px wide.
 */
export const PW = 480;
export const PH = 360;
const INK = "#e9ecf2";
const DIM = "#5b616b";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: PW, height: PH, background: "#000", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>{children}</div>
    </div>
  );
};

/* 01 — Understand: noise → questions → one clear insight. */
export const Understand: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.cobalt;
  const cx = 240, cy = 180;
  const dots = [[70, 70], [130, 290], [410, 80], [395, 280], [60, 190], [300, 40], [200, 320], [440, 180], [160, 120]];
  const converge = t(f, [56, 84], [0, 1]);
  return (
    <Frame>
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
        {dots.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={cx} y2={cy} stroke={A} strokeOpacity={0.5 * (1 - converge)} strokeWidth={2}
            pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [34 + i * 2, 56 + i * 2], [1, 0])} />
        ))}
        <circle cx={cx} cy={cy} r={t(f, [80, 100], [40, 78])} fill="none" stroke={A} strokeWidth={2} opacity={t(f, [80, 86, 104], [0, 0.8, 0])} />
      </svg>
      {/* Signals: scattered, drifting, then drawn into the centre. */}
      {dots.map(([x, y], i) => {
        const dx = Math.sin((f + i * 13) / 14) * 6;
        const px = x + dx + (cx - x) * converge, py = y + Math.cos((f + i * 7) / 16) * 6 + (cy - y) * converge;
        return <div key={i} style={{ position: "absolute", left: px - 7, top: py - 7, width: 14, height: 14, borderRadius: 14, background: i % 3 ? DIM : INK, opacity: t(f, [i * 2, 10 + i * 2], [0, 1]) * (1 - t(f, [78, 86], [0, 1])) }} />;
      })}
      {/* Questions. */}
      {[[105, 105], [330, 120], [300, 250]].map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y, width: 54, height: 40, borderRadius: 14, border: `3px solid ${INK}`,
          color: INK, fontSize: 24, fontWeight: 700, fontFamily: "Helvetica Neue, Arial", display: "flex", alignItems: "center", justifyContent: "center",
          scale: String(t(f, [18 + i * 6, 30 + i * 6], [0, 1], pop)), opacity: 1 - t(f, [58, 70], [0, 1]),
        }}>?</div>
      ))}
      {/* The insight. */}
      <div style={{
        position: "absolute", left: cx - 34, top: cy - 34, width: 68, height: 68, borderRadius: 68,
        background: `radial-gradient(circle at 35% 30%, #fff, ${A} 60%)`, boxShadow: `0 0 ${t(f, [78, 90], [0, 36])}px ${A}`,
        scale: String(t(f, [0, 12], [0.4, 0.55]) + t(f, [76, 88], [0, 0.45], pop)),
      }} />
    </Frame>
  );
};

/* 02 — Shape: loose fragments → a grid → one composed identity. */
export const Shape: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.violet;
  const align = t(f, [18, 46], [0, 1]);
  const lock = t(f, [48, 70], [0, 1]);
  // Six fragments that become the cells of a composed page.
  const cells = [
    { from: [40, 40, -24], to: [80, 60, 320, 40] },
    { from: [330, 60, 18], to: [80, 116, 150, 120] },
    { from: [380, 250, -12], to: [246, 116, 154, 56] },
    { from: [60, 270, 30], to: [246, 180, 154, 56] },
    { from: [200, 300, -8], to: [80, 250, 150, 50] },
    { from: [230, 30, 40], to: [246, 250, 154, 50] },
  ];
  return (
    <Frame>
      {cells.map((c, i) => {
        const [tx, ty, tw, th] = c.to;
        const x = c.from[0] + (tx - c.from[0]) * align, y = c.from[1] + (ty - c.from[1]) * align;
        const w = 70 + (tw - 70) * align, h = 6 + (th - 6) * align;
        const rich = i === 1 ? lock : 0;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 4 + 6 * align,
            border: `${align > 0.6 ? 2 : 0}px solid ${DIM}`, background: align < 0.6 ? INK : "transparent",
            rotate: `${c.from[2] * (1 - align)}deg`, opacity: t(f, [i * 2, 8 + i * 2], [0, 1]), overflow: "hidden",
          }}>
            {/* The one rich element: an image crop in the brand colour. */}
            {i === 1 && <div style={{ position: "absolute", inset: 0, opacity: rich, background: `radial-gradient(circle at 60% 40%, #fff6, transparent 40%), linear-gradient(150deg, ${A}, #3b2a8a)` }} />}
            {i === 2 && <div style={{ position: "absolute", left: 12, top: 6, color: INK, fontFamily: "Didot, 'Bodoni 72', Georgia, serif", fontSize: 40, fontStyle: "italic", opacity: lock }}>Aa</div>}
            {i === 3 && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 14 + k * 38, top: 12, width: 30, height: 30, borderRadius: 30, background: [A, "#d9ccff", INK][k], scale: String(t(f, [56 + k * 4, 66 + k * 4], [0, 1], pop)) }} />)}
          </div>
        );
      })}
      {/* Final highlight around the composed frame. */}
      <div style={{ position: "absolute", left: 66, top: 46, width: 348, height: 268, borderRadius: 14, border: `2px solid ${A}`, opacity: t(f, [74, 82, 104], [0, 0.9, 0.5]), boxShadow: `0 0 30px -6px ${A}` }} />
    </Frame>
  );
};

/* 03 — Build: components → product → a working state. */
export const Build: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.coral;
  const block = (i: number) => ({ opacity: t(f, [8 + i * 7, 18 + i * 7], [0, 1]), translate: `0 ${t(f, [8 + i * 7, 20 + i * 7], [26, 0])}px` });
  return (
    <Frame>
      {/* Product frame */}
      <div style={{ position: "absolute", left: 70, top: 40, width: 340, height: 280, borderRadius: 16, border: `2px solid ${DIM}`, opacity: t(f, [0, 8], [0, 1]), boxShadow: `0 0 ${t(f, [84, 96], [0, 34])}px -4px ${A}` }}>
        <div style={{ position: "absolute", left: 16, top: 14, display: "flex", gap: 7 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 9, height: 9, borderRadius: 9, background: DIM }} />)}</div>
        <div style={{ position: "absolute", left: 18, top: 42, width: 170, height: 18, borderRadius: 9, background: INK, ...block(0) }} />
        <div style={{ position: "absolute", left: 18, top: 70, width: 120, height: 12, borderRadius: 6, background: DIM, ...block(0) }} />
        <div style={{ position: "absolute", right: 18, top: 42, width: 110, height: 92, borderRadius: 12, background: `linear-gradient(150deg, ${A}, #6b2412)`, ...block(1) }} />
        <div style={{ position: "absolute", left: 18, top: 150, width: 140, height: 70, borderRadius: 12, border: `2px solid ${DIM}`, ...block(2) }} />
        <div style={{ position: "absolute", left: 180, top: 150, width: 140, height: 70, borderRadius: 12, border: `2px solid ${DIM}`, ...block(3) }} />
        {/* CTA activates */}
        <div style={{ position: "absolute", left: 18, top: 96, width: 104, height: 30, borderRadius: 30, border: `2px solid ${A}`, overflow: "hidden", ...block(1) }}>
          <div style={{ position: "absolute", inset: 0, background: A, transformOrigin: "left", scale: `${t(f, [62, 72], [0, 1])} 1` }} />
        </div>
      </div>
      {/* Modules linking */}
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
        <path d="M228 225 C 240 240, 250 240, 250 225" stroke={A} strokeWidth={3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [40, 54], [1, 0])} />
        <path d="M192 165 C 230 150, 290 150, 320 172" stroke={A} strokeWidth={3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [46, 60], [1, 0])} />
      </svg>
      {/* Working: a check lands on the frame */}
      <div style={{ position: "absolute", left: 384, top: 22, width: 52, height: 52, borderRadius: 52, background: A, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [74, 86], [0, 1], pop)) }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </Frame>
  );
};

/* 04 — Grow: launch → real use → feedback → a stronger line. */
export const Grow: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.lime;
  const path = "M50 300 C 120 290, 150 250, 200 240 S 290 170, 330 140 S 400 70, 440 50";
  const users = [[120, 286], [190, 244], [260, 200], [330, 142], [400, 84]];
  return (
    <Frame>
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
        {/* The trend, then the improvement travelling along it */}
        <path d={path} stroke={DIM} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [14, 54], [1, 0])} />
        <path d={path} stroke={A} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [78, 104], [1, 0])} />
        {/* Feedback returning into the system */}
        <path d="M440 50 C 470 160, 300 330, 60 320" stroke={A} strokeWidth={2.5} strokeDasharray="6 9" fill="none" opacity={t(f, [56, 62, 80, 88], [0, 0.85, 0.85, 0])}
          strokeDashoffset={t(f, [56, 88], [0, -60])} />
      </svg>
      {/* Launch pulse */}
      <div style={{ position: "absolute", left: 50 - 40, top: 300 - 40, width: 80, height: 80, borderRadius: 80, border: `3px solid ${A}`, opacity: t(f, [0, 4, 22], [0, 0.9, 0]), scale: String(t(f, [0, 22], [0.2, 1.3])) }} />
      <div style={{ position: "absolute", left: 50 - 10, top: 300 - 10, width: 20, height: 20, borderRadius: 20, background: A, scale: String(t(f, [0, 10], [0, 1], pop)) }} />
      {/* Real users along the line */}
      {users.map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 22, background: i % 2 ? INK : DIM, border: "3px solid #000", scale: String(t(f, [22 + i * 6, 32 + i * 6], [0, 1], pop)) }} />
      ))}
      {/* Stronger final state */}
      <div style={{ position: "absolute", left: 440 - 16, top: 50 - 16, width: 32, height: 32, borderRadius: 32, background: A, boxShadow: `0 0 ${t(f, [100, 108], [0, 30])}px ${A}`, scale: String(t(f, [100, 110], [0, 1], pop)) }} />
    </Frame>
  );
};

export const PROCESS = [
  ["01-understand", Understand],
  ["02-shape", Shape],
  ["03-build", Build],
  ["04-grow", Grow],
] as const;
export { DURATION };
