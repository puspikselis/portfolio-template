import { ImageResponse } from "next/og";

import {
  OG_IMAGE_SIZE,
  SITE_NAME,
  SITE_ROLE,
  SITE_TITLE,
  SITE_URL,
  YEARS_OF_EXPERIENCE,
} from "@/lib/constants";

export const alt = SITE_TITLE;
export const size = OG_IMAGE_SIZE;
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
        {new URL(SITE_URL).host}
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
          {SITE_NAME}
        </div>
        <div
          style={{
            color: "#9a9a9a",
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          {`${SITE_ROLE} · ${YEARS_OF_EXPERIENCE} years · Latvia`}
        </div>
      </div>
    </div>,
    size
  );
}
