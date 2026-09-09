import { ImageResponse } from "next/og";

export const alt = "Kristaps Krūze — Designer";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #151515 0%, #262626 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "96px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#9a9a9a",
          display: "flex",
          fontSize: 28,
          fontWeight: 500,
        }}
      >
        kristaps.kruze.lv
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            color: "white",
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Kristaps Krūze
        </div>
        <div
          style={{
            color: "#9a9a9a",
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Designer · 10+ years · Latvia
        </div>
      </div>
    </div>,
    size
  );
}
