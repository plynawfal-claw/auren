import React from "react";
import { Easing, interpolate } from "remotion";

/**
 * Shared language for the five service loops.
 *
 * Every loop is 4s at 30fps on the same dark "screen" surface, so the site can
 * crossfade between them without a change of ground. Each service owns ONE
 * accent; everything else is graphite, silver and off-white. Pictograms are
 * drawn here as SVG rather than system emoji, which render differently on
 * every platform.
 */
export const FPS = 30;
export const DURATION = 120;
export const W = 960;
export const H = 720;

export const C = {
  bg: "#0c0e11",
  surface: "#16191e",
  surfaceHi: "#1e2228",
  line: "rgba(255,255,255,0.09)",
  lineStrong: "rgba(255,255,255,0.18)",
  text: "#eef0f3",
  mute: "#8b919b",
  faint: "#3a3f47",
};

export const ACCENT = {
  cobalt: "#4a74ff",
  coral: "#ff7a52",
  violet: "#a98bff",
  lime: "#c8f23c",
  blue: "#4fa8ff",
};

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const pop = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Clamped interpolate with the house curve. */
export const t = (f: number, input: number[], output: number[], easing = ease) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/**
 * The loop seam: the whole scene breathes in over the first 10 frames and out
 * over the last 12, so frame 119 and frame 0 are both the bare ground.
 */
export const loopOpacity = (f: number) => t(f, [0, 10, DURATION - 12, DURATION - 1], [0, 1, 1, 0]);

export const Ground: React.FC<{ children: React.ReactNode; glow: string }> = ({ children, glow }) => (
  <div
    style={{
      width: W,
      height: H,
      position: "relative",
      overflow: "hidden",
      background: `radial-gradient(60% 70% at 55% 42%, ${glow}1f, transparent 70%), ${C.bg}`,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}
  >
    {/* Measuring grid, the same quiet texture the site uses. */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        opacity: 0.35,
        maskImage: "radial-gradient(70% 70% at 50% 45%, #000, transparent 80%)",
        WebkitMaskImage: "radial-gradient(70% 70% at 50% 45%, #000, transparent 80%)",
      }}
    />
    {children}
  </div>
);

/** A text line drawn as a bar: the page reads as content without real copy. */
export const Bar: React.FC<{ w: number; h?: number; color?: string; style?: React.CSSProperties }> = ({ w, h = 10, color = C.faint, style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: color, ...style }} />
);

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      background: C.surface,
      border: `1px solid ${C.lineStrong}`,
      borderRadius: 18,
      boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

type IconProps = { size?: number; color?: string; stroke?: number };
const svg = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Icon = {
  Cursor: ({ size = 44, color = C.text }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 3l15 7.5-6.2 1.7L10 18.5z" fill={color} stroke="#000" strokeOpacity={0.35} strokeWidth={0.8} strokeLinejoin="round" />
    </svg>
  ),
  Check: ({ size = 24, color = C.text, stroke = 2.4 }: IconProps) => svg(size, <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={stroke} />),
  Bag: ({ size = 40, color = C.text, stroke = 1.6 }: IconProps) =>
    svg(size, <><path d="M5 8h14l-1.2 12H6.2z" stroke={color} strokeWidth={stroke} /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke={color} strokeWidth={stroke} /></>),
  Search: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <><circle cx="10.5" cy="10.5" r="6" stroke={color} strokeWidth={stroke} /><path d="M15 15l5 5" stroke={color} strokeWidth={stroke} /></>),
  Megaphone: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <><path d="M4 10v4h3l7 4V6l-7 4z" stroke={color} strokeWidth={stroke} /><path d="M18 9.5a4 4 0 0 1 0 5" stroke={color} strokeWidth={stroke} /></>),
  Heart: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <path d="M12 19s-7-4.3-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 1.8C19 14.7 12 19 12 19z" stroke={color} strokeWidth={stroke} />),
  Chat: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <path d="M5 6h14v9H10l-4 3v-3H5z" stroke={color} strokeWidth={stroke} />),
  Bolt: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <path d="M13 3L6 13.5h5L10 21l8-11h-5z" stroke={color} strokeWidth={stroke} />),
  Calendar: ({ size = 30, color = C.text, stroke = 1.8 }: IconProps) =>
    svg(size, <><rect x="4.5" y="6" width="15" height="13" rx="2.5" stroke={color} strokeWidth={stroke} /><path d="M4.5 10.5h15M9 4v3.5M15 4v3.5" stroke={color} strokeWidth={stroke} /></>),
  Sparkle: ({ size = 44, color = C.text }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2c.9 5 2.6 7.1 8 8-5.4.9-7.1 3-8 8-.9-5-2.6-7.1-8-8 5.4-.9 7.1-3 8-8z" fill={color} />
      <path d="M19 15c.3 1.7.9 2.4 2.7 2.7-1.8.3-2.4 1-2.7 2.7-.3-1.7-.9-2.4-2.7-2.7 1.8-.3 2.4-1 2.7-2.7z" fill={color} opacity={0.7} />
    </svg>
  ),
};
