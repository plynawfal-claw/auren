import React from "react";
import { useCurrentFrame } from "remotion";
import { ACCENT, Bar, C, Card, Ground, Icon, loopOpacity, pop, t } from "./kit";

/* ------------------------------------------------------------------
   1. Websites that sell — cobalt
   VISITOR → PAGE → CTA → ACTION
   ------------------------------------------------------------------ */
export const WebsitesThatSell: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.cobalt;
  const cursorX = t(f, [34, 56], [800, 426]);
  const cursorY = t(f, [34, 56], [640, 452]);
  const press = t(f, [56, 59, 64], [1, 0.82, 1]);
  return (
    <Ground glow={A}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>
        {/* Browser */}
        <Card style={{ left: 140, top: 110, width: 680, height: 500, overflow: "hidden", scale: String(t(f, [0, 14], [0.95, 1])), opacity: t(f, [0, 10], [0, 1]) }}>
          <div style={{ height: 44, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 10, background: C.faint }} />)}
            <div style={{ marginLeft: 16, flex: 1, height: 20, borderRadius: 10, background: C.surfaceHi }} />
          </div>
          {/* Hero: copy + product */}
          <div style={{ position: "absolute", left: 36, top: 84, opacity: t(f, [10, 22], [0, 1]), translate: `0 ${t(f, [10, 22], [14, 0])}px` }}>
            <Bar w={250} h={22} color={C.text} />
            <Bar w={200} h={22} color={C.text} style={{ marginTop: 12 }} />
            <Bar w={230} h={10} color={C.mute} style={{ marginTop: 22 }} />
            <Bar w={180} h={10} color={C.mute} style={{ marginTop: 10 }} />
            {/* CTA */}
            <div style={{
              marginTop: 30, width: 150, height: 46, borderRadius: 46, display: "flex", alignItems: "center", justifyContent: "center",
              background: A, color: "#fff", fontSize: 16, fontWeight: 600, letterSpacing: 0.3,
              boxShadow: `0 0 ${t(f, [44, 56], [0, 40])}px ${A}`, scale: String(t(f, [56, 59, 66], [1, 0.94, 1])),
            }}>Get started</div>
          </div>
          <div style={{
            position: "absolute", right: 36, top: 76, width: 260, height: 210, borderRadius: 16, overflow: "hidden",
            background: `linear-gradient(145deg, ${A}55, ${C.surfaceHi} 70%)`, opacity: t(f, [14, 26], [0, 1]), scale: String(t(f, [14, 28], [0.9, 1])),
          }}>
            <div style={{ position: "absolute", left: 70, top: 44, width: 120, height: 120, borderRadius: 120, background: `radial-gradient(circle at 35% 30%, #fff, ${A} 60%, #1a2a66)`, boxShadow: `0 30px 50px -10px ${A}88` }} />
          </div>
          {/* Product row */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute", left: 36 + i * 208, top: 330, width: 192, height: 132, borderRadius: 14, background: C.surfaceHi, border: `1px solid ${C.line}`,
              opacity: t(f, [22 + i * 5, 34 + i * 5], [0, 1]), translate: `0 ${t(f, [22 + i * 5, 36 + i * 5], [40, 0])}px`,
            }}>
              <div style={{ margin: 14, height: 62, borderRadius: 10, background: i === 1 ? `${A}40` : C.faint }} />
              <Bar w={110} h={9} color={C.mute} style={{ marginLeft: 14 }} />
              <Bar w={60} h={9} color={C.text} style={{ marginLeft: 14, marginTop: 9 }} />
            </div>
          ))}
        </Card>
        {/* Tap ripple */}
        <div style={{ position: "absolute", left: 426 - 60, top: 452 - 60, width: 120, height: 120, borderRadius: 120, border: `2px solid ${A}`, opacity: t(f, [57, 60, 76], [0, 0.9, 0]), scale: String(t(f, [57, 76], [0.3, 1.4])) }} />
        {/* Cursor */}
        <div style={{ position: "absolute", left: cursorX, top: cursorY, opacity: t(f, [30, 38, 80, 90], [0, 1, 1, 0]), scale: String(press) }}>
          <Icon.Cursor size={48} />
        </div>
        {/* Confirmation toast */}
        <Card style={{
          left: 600, top: 70, width: 290, height: 86, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 20px",
          background: C.surfaceHi, opacity: t(f, [64, 74], [0, 1]), translate: `0 ${t(f, [64, 78], [-24, 0], pop)}px`,
        }}>
          <div style={{ width: 46, height: 46, borderRadius: 46, background: A, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [70, 80], [0.4, 1], pop)) }}>
            <Icon.Check size={26} color="#fff" />
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 17, fontWeight: 600 }}>New order</div>
            <Bar w={130} h={8} color={C.mute} style={{ marginTop: 8 }} />
          </div>
        </Card>
      </div>
    </Ground>
  );
};

/* ------------------------------------------------------------------
   2. Shops that take orders — coral
   product → add to bag → bag receives → checkout → confirmed
   ------------------------------------------------------------------ */
export const ShopsThatTakeOrders: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.coral;
  const fly = t(f, [44, 62], [0, 1]);
  const fx = 300 + (720 - 300) * fly;
  const fy = 470 - Math.sin(fly * Math.PI) * 260 - (470 - 150) * fly;
  const steps = ["Bag", "Details", "Done"];
  return (
    <Ground glow={A}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>
        {/* Product card */}
        <Card style={{ left: 150, top: 120, width: 320, height: 450, overflow: "hidden", opacity: t(f, [0, 12], [0, 1]), scale: String(t(f, [0, 14, 24, 36], [0.94, 1, 1, 1.04])) }}>
          <div style={{ height: 270, background: `radial-gradient(80% 80% at 50% 40%, ${A}55, ${C.surfaceHi} 75%)`, position: "relative" }}>
            {/* An abstract product: a ceramic vessel. */}
            <div style={{ position: "absolute", left: 105, top: 60, width: 110, height: 160, borderRadius: "46px 46px 30px 30px", background: `linear-gradient(160deg, #ffd9c9, ${A} 55%, #7a2e17)`, boxShadow: `0 30px 40px -12px ${A}aa` }} />
            <div style={{ position: "absolute", left: 132, top: 44, width: 56, height: 26, borderRadius: 8, background: "#f4c4b0" }} />
          </div>
          <div style={{ padding: 22 }}>
            <Bar w={170} h={14} color={C.text} />
            <Bar w={90} h={12} color={A} style={{ marginTop: 12 }} />
            <div style={{
              marginTop: 20, height: 48, borderRadius: 48, background: t(f, [36, 40], [0, 1]) > 0.5 ? A : C.surfaceHi, border: `1px solid ${A}`,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600,
              scale: String(t(f, [38, 41, 48], [1, 0.95, 1])),
            }}>Add to bag</div>
          </div>
        </Card>
        {/* Flying item */}
        <div style={{ position: "absolute", left: fx - 16, top: fy - 16, width: 32, height: 32, borderRadius: 32, background: A, boxShadow: `0 0 24px ${A}`, opacity: t(f, [43, 46, 60, 63], [0, 1, 1, 0]), scale: String(t(f, [44, 62], [1, 0.6])) }} />
        {/* Bag */}
        <div style={{ position: "absolute", left: 680, top: 110, width: 90, height: 90, borderRadius: 26, background: C.surfaceHi, border: `1px solid ${C.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: t(f, [8, 20], [0, 1]), scale: String(t(f, [60, 64, 72], [1, 1.12, 1])) }}>
          <Icon.Bag size={46} />
          <div style={{ position: "absolute", right: -8, top: -8, width: 30, height: 30, borderRadius: 30, background: A, color: "#fff", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [60, 70], [0, 1], pop)) }}>1</div>
        </div>
        {/* Checkout progress */}
        <Card style={{ left: 540, top: 300, width: 300, height: 190, padding: 26, opacity: t(f, [62, 72], [0, 1]), translate: `0 ${t(f, [62, 74], [24, 0])}px` }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 }}>Checkout</div>
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 8, borderRadius: 8, background: C.faint, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t(f, [70 + i * 8, 80 + i * 8], [0, 100])}%`, background: A }} />
                </div>
                <div style={{ color: t(f, [80 + i * 8, 82 + i * 8], [0, 1]) > 0.5 ? C.text : C.mute, fontSize: 13, marginTop: 10 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, opacity: t(f, [96, 102], [0, 1]) }}>
            <div style={{ width: 30, height: 30, borderRadius: 30, background: A, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [96, 104], [0.3, 1], pop)) }}><Icon.Check size={18} color="#fff" /></div>
            <span style={{ color: C.text, fontSize: 15 }}>Order confirmed</span>
          </div>
        </Card>
        {/* Confirmation pulse */}
        <div style={{ position: "absolute", left: 555 - 50, top: 441 - 50, width: 100, height: 100, borderRadius: 100, border: `2px solid ${A}`, opacity: t(f, [98, 101, 114], [0, 0.8, 0]), scale: String(t(f, [98, 114], [0.3, 1.5])) }} />
      </div>
    </Ground>
  );
};

/* ------------------------------------------------------------------
   3. Brands people remember — violet (editorial)
   shape → mark → palette → poster → spark
   ------------------------------------------------------------------ */
export const BrandsPeopleRemember: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.violet;
  const swatches = [A, "#d9ccff", "#f2efe9", C.surfaceHi];
  return (
    <Ground glow={A}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>
        {/* The mark: a circle that resolves into a refined monogram tile. */}
        <div style={{
          position: "absolute", left: 170, top: 150, width: 200, height: 200,
          borderRadius: `${t(f, [12, 32], [100, 44])}px`, rotate: `${t(f, [12, 32], [0, 45])}deg`,
          background: `linear-gradient(140deg, ${A}, #5b3fd1)`, boxShadow: `0 40px 70px -25px ${A}`,
          opacity: t(f, [0, 10], [0, 1]), scale: String(t(f, [0, 14], [0.6, 1], pop)),
        }}>
          <div style={{ position: "absolute", inset: 46, borderRadius: 26, border: "3px solid #fff", opacity: t(f, [24, 34], [0, 0.95]) }} />
        </div>
        <div style={{ position: "absolute", left: 150, top: 410, opacity: t(f, [26, 36], [0, 1]), translate: `0 ${t(f, [26, 38], [12, 0])}px` }}>
          <div style={{ color: C.text, fontFamily: "Didot, 'Bodoni 72', Georgia, serif", fontSize: 54, letterSpacing: 10 }}>MAISON</div>
          <Bar w={120} h={6} color={A} style={{ marginTop: 12 }} />
        </div>
        {/* Palette */}
        {swatches.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: 160 + i * 66, top: 540, width: 52, height: 52, borderRadius: 52, background: s, border: `1px solid ${C.lineStrong}`, scale: String(t(f, [34 + i * 4, 44 + i * 4], [0, 1], pop)) }} />
        ))}
        {/* Campaign poster */}
        <div style={{
          position: "absolute", left: 540, top: 110, width: 280, height: 420, borderRadius: 14, overflow: "hidden",
          background: `linear-gradient(170deg, #2a1f55, ${A} 120%)`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
          translate: `${t(f, [44, 64], [240, 0])}px 0`, rotate: `${t(f, [44, 64], [8, -3])}deg`, opacity: t(f, [44, 54], [0, 1]),
        }}>
          <div style={{ position: "absolute", left: 30, top: 34, color: "#fff", fontFamily: "Didot, 'Bodoni 72', Georgia, serif", fontSize: 92, lineHeight: 0.9, fontStyle: "italic" }}>Aa</div>
          <div style={{ position: "absolute", right: -40, bottom: 60, width: 220, height: 220, borderRadius: 220, background: "radial-gradient(circle at 35% 30%, #fff8, transparent 60%)", border: "1px solid #fff5" }} />
          <div style={{ position: "absolute", left: 30, bottom: 34 }}>
            <Bar w={150} h={10} color="#fff" />
            <Bar w={100} h={8} color="#ffffff99" style={{ marginTop: 10 }} />
          </div>
        </div>
        {/* Recognition spark */}
        <div style={{ position: "absolute", left: 790, top: 84, scale: String(t(f, [64, 74], [0, 1], pop) * t(f, [74, 88, 100], [1, 0.85, 1])), rotate: `${t(f, [64, 110], [0, 40])}deg` }}>
          <Icon.Sparkle size={70} color="#fff" />
        </div>
      </div>
    </Ground>
  );
};

/* ------------------------------------------------------------------
   4. Growth that brings people in — lime
   touchpoints → paths → trend → visitors → lead
   ------------------------------------------------------------------ */
export const GrowthThatBringsPeopleIn: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.lime;
  const nodes = [
    { x: 150, y: 160, icon: <Icon.Search color={C.text} /> },
    { x: 110, y: 360, icon: <Icon.Megaphone color={C.text} /> },
    { x: 150, y: 560, icon: <Icon.Heart color={C.text} /> },
  ];
  const target = { x: 520, y: 360 };
  return (
    <Ground glow={A}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>
        <svg width={960} height={720} style={{ position: "absolute", inset: 0 }}>
          {nodes.map((n, i) => {
            const d = `M${n.x + 40} ${n.y} C ${n.x + 200} ${n.y}, ${target.x - 180} ${target.y}, ${target.x} ${target.y}`;
            return (
              <path key={i} d={d} stroke={A} strokeOpacity={0.55} strokeWidth={2} fill="none" pathLength={1}
                strokeDasharray={1} strokeDashoffset={t(f, [18 + i * 4, 40 + i * 4], [1, 0])} />
            );
          })}
        </svg>
        {/* Visitors travelling the paths */}
        {nodes.map((n, i) =>
          [0, 1].map((k) => {
            const p = t(f, [34 + i * 5 + k * 10, 58 + i * 5 + k * 10], [0, 1]);
            const x = (1 - p) ** 3 * (n.x + 40) + 3 * (1 - p) ** 2 * p * (n.x + 200) + 3 * (1 - p) * p ** 2 * (target.x - 180) + p ** 3 * target.x;
            const y = (1 - p) ** 3 * n.y + 3 * (1 - p) ** 2 * p * n.y + 3 * (1 - p) * p ** 2 * target.y + p ** 3 * target.y;
            return <div key={`${i}${k}`} style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 14, background: A, boxShadow: `0 0 16px ${A}`, opacity: p > 0 && p < 1 ? 1 : 0 }} />;
          }),
        )}
        {/* Touchpoints */}
        {nodes.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x - 40, top: n.y - 40, width: 80, height: 80, borderRadius: 24, background: C.surfaceHi, border: `1px solid ${C.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [6 + i * 5, 18 + i * 5], [0, 1], pop)) }}>
            {n.icon}
          </div>
        ))}
        {/* Landing card with trend */}
        <Card style={{ left: 520, top: 190, width: 330, height: 340, padding: 26, opacity: t(f, [0, 12], [0, 1]), scale: String(t(f, [0, 14], [0.95, 1])) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Bar w={130} h={12} color={C.text} />
            {/* Visitors, one becoming many */}
            <div style={{ display: "flex" }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: 26, marginLeft: i ? -8 : 0, border: `2px solid ${C.surface}`, background: i % 2 ? "#e9f7b8" : A, scale: String(t(f, [48 + i * 6, 56 + i * 6], [0, 1], pop)) }} />
              ))}
            </div>
          </div>
          <svg width={278} height={150} style={{ marginTop: 26 }}>
            <path d="M0 140 C 60 132, 80 110, 120 104 S 190 70, 220 48 S 262 18, 278 10" stroke={A} strokeWidth={4} fill="none" strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={t(f, [40, 76], [1, 0])} />
            <path d="M0 140 C 60 132, 80 110, 120 104 S 190 70, 220 48 S 262 18, 278 10 L278 150 L0 150Z" fill={A} opacity={t(f, [56, 80], [0, 0.12])} />
          </svg>
          <div style={{
            marginTop: 20, height: 46, borderRadius: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: t(f, [80, 84], [0, 1]) > 0.5 ? A : C.surfaceHi, color: t(f, [80, 84], [0, 1]) > 0.5 ? "#141a05" : C.mute,
            fontSize: 15, fontWeight: 700, scale: String(t(f, [80, 84, 92], [1, 1.06, 1])),
          }}>
            {t(f, [80, 84], [0, 1]) > 0.5 && <Icon.Check size={18} color="#141a05" />} New lead
          </div>
        </Card>
      </div>
    </Ground>
  );
};

/* ------------------------------------------------------------------
   5. Systems that save time / think — electric blue + silver
   input → AI → tasks → automatic follow-up → result
   ------------------------------------------------------------------ */
export const SystemsThatSaveTime: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACCENT.blue;
  const stations = [
    { x: 250, label: "Qualify", icon: <Icon.Bolt size={26} color={C.text} /> },
    { x: 480, label: "Assign", icon: <Icon.Calendar size={26} color={C.text} /> },
  ];
  const pulse = t(f, [30, 84], [120, 700]);
  const lit = (x: number) => (pulse >= x ? 1 : 0);
  return (
    <Ground glow={A}>
      <div style={{ position: "absolute", inset: 0, opacity: loopOpacity(f) }}>
        {/* Rail */}
        <div style={{ position: "absolute", left: 120, top: 359, height: 2, width: t(f, [10, 30], [0, 580]), background: `linear-gradient(90deg, ${C.lineStrong}, ${A}88)` }} />
        {/* Travelling task */}
        <div style={{ position: "absolute", left: pulse - 10, top: 350, width: 20, height: 20, borderRadius: 20, background: A, boxShadow: `0 0 22px ${A}`, opacity: t(f, [28, 32, 82, 86], [0, 1, 1, 0]) }} />
        {/* Input */}
        <Card style={{ left: 40, top: 300, width: 150, height: 120, padding: 18, opacity: t(f, [0, 10], [0, 1]), translate: `${t(f, [0, 14], [-30, 0])}px 0` }}>
          <Icon.Chat size={30} color={A} />
          <Bar w={100} h={9} color={C.text} style={{ marginTop: 14 }} />
          <Bar w={70} h={8} color={C.mute} style={{ marginTop: 8 }} />
        </Card>
        {/* The AI node, between input and tasks */}
        <div style={{ position: "absolute", left: 360 - 58, top: 360 - 58, width: 116, height: 116 }}>
          {[0, 1].map((r) => (
            <div key={r} style={{ position: "absolute", inset: -r * 22, borderRadius: 200, border: `1px solid ${A}`, opacity: t(f, [36 + r * 4, 44 + r * 4, 60 + r * 4], [0, 0.6, 0]), scale: String(t(f, [36 + r * 4, 60 + r * 4], [0.8, 1.3])) }} />
          ))}
        </div>
        {stations.map((s) => (
          <div key={s.label} style={{ position: "absolute", left: s.x - 42, top: 318, textAlign: "center", opacity: t(f, [12, 22], [0, 1]) }}>
            <div style={{
              width: 84, height: 84, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center",
              background: lit(s.x) ? `${A}33` : C.surfaceHi, border: `1px solid ${lit(s.x) ? A : C.lineStrong}`,
              boxShadow: lit(s.x) ? `0 0 30px -4px ${A}` : "none",
            }}>{s.icon}</div>
            <div style={{ color: lit(s.x) ? C.text : C.mute, fontSize: 14, marginTop: 12 }}>{s.label}</div>
          </div>
        ))}
        {/* AI core */}
        <div style={{
          position: "absolute", left: 360 - 34, top: 360 - 34, width: 68, height: 68, borderRadius: 68,
          background: `radial-gradient(circle at 35% 30%, #fff, ${A} 55%, #0d2a4d)`, boxShadow: `0 0 ${t(f, [36, 44, 60], [10, 40, 16])}px ${A}`,
          scale: String(t(f, [14, 24], [0, 1], pop) * t(f, [36, 42, 50], [1, 1.12, 1])),
        }} />
        {/* Output: automatic follow-up + result */}
        <Card style={{ left: 640, top: 210, width: 270, height: 300, padding: 24, opacity: t(f, [80, 90], [0, 1]), translate: `${t(f, [80, 94], [30, 0])}px 0` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 38, background: A, display: "flex", alignItems: "center", justifyContent: "center", scale: String(t(f, [86, 96], [0.3, 1], pop)) }}><Icon.Check size={22} color="#fff" /></div>
            <span style={{ color: C.text, fontSize: 18, fontWeight: 600 }}>Reply sent</span>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, opacity: t(f, [92 + i * 4, 100 + i * 4], [0, 1]) }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: i === 0 ? A : C.faint }} />
              <Bar w={[150, 120, 170][i]} h={9} color={i === 0 ? C.text : C.mute} />
            </div>
          ))}
          <div style={{ marginTop: 26, padding: "10px 14px", borderRadius: 12, background: C.surfaceHi, color: C.mute, fontSize: 13, opacity: t(f, [100, 108], [0, 1]) }}>
            Follow-up · tomorrow 9:00
          </div>
        </Card>
      </div>
    </Ground>
  );
};
