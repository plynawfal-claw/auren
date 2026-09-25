import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 } as const;

/** One restrained share-card system for editorial and service routes. */
export function createOgImage(title: string, category: string) {
  const fontSize = title.length > 58 ? 59 : title.length > 34 ? 70 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px 64px 52px",
          backgroundColor: "#08090c",
          color: "#f5f4f1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, height: 32 }}>
              {[26, 17, 22, 11].map((height, index) => (
                <div
                  key={index}
                  style={{ width: 2, height, backgroundColor: "#d8d7d3" }}
                />
              ))}
            </div>
            <span style={{ fontSize: 31, letterSpacing: 6, fontWeight: 300 }}>AUREN</span>
          </div>
          <span style={{ fontSize: 17, letterSpacing: 4, color: "#9b9b9a" }}>
            {category.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
          <div style={{ width: 76, height: 2, marginBottom: 30, backgroundColor: "#b8c4d6" }} />
          <span style={{ fontSize, lineHeight: 1.08, letterSpacing: -2.5, fontWeight: 400 }}>
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #393b40",
            paddingTop: 22,
            fontSize: 16,
            letterSpacing: 3,
            color: "#a7a8aa",
          }}
        >
          <span>DIGITAL EXPERIENCES · CREATIVE · GROWTH</span>
          <span>MOROCCO · WORLDWIDE</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
