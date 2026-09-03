import { ImageResponse } from "next/og";

/**
 * Shared Open Graph image generator.
 *
 * Rendered as the title block from the drawing set, on the dark plate the
 * logo belongs on — so a link pasted into Slack or LinkedIn looks like the
 * site rather than like a generic card.
 *
 * Deliberately no custom font: loading Chivo here would mean shipping a
 * font file into the edge bundle for every image. Satori's default sans is
 * close enough at this size, and the layout is doing the identifying work.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Token values, inlined because ImageResponse renders outside the document
// and cannot read CSS custom properties.
const PLATE = "#061a2b";
const INK_INVERT = "#f6f8fa";
const MUTED = "#8aa3bc";
const ACCENT = "#4fd8f5";
const RULE = "#1c3247";

export type OgFields = { label: string; value: string }[];

export function renderOgImage({
  eyebrow,
  title,
  fields,
}: {
  eyebrow: string;
  title: string;
  fields: OgFields;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: PLATE,
        color: INK_INVERT,
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      {/* field row — the title block device */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${RULE}`,
          paddingBottom: 20,
        }}
      >
        {fields.slice(0, 4).map((f, i) => (
          <div
            key={f.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingLeft: i === 0 ? 0 : 28,
              paddingRight: 28,
              borderRight:
                i < Math.min(fields.length, 4) - 1
                  ? `1px solid ${RULE}`
                  : "none",
            }}
          >
            <span
              style={{
                fontSize: 16,
                letterSpacing: 2,
                color: MUTED,
                textTransform: "uppercase",
              }}
            >
              {f.label}
            </span>
            <span style={{ fontSize: 22, color: INK_INVERT }}>{f.value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: 28,
        }}
      >
        <span
          style={{
            fontSize: 20,
            letterSpacing: 3,
            color: ACCENT,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 940,
          }}
        >
          {title}
        </span>
      </div>

      {/* node connector, the mark's own device */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{ display: "flex", width: 64, height: 2, background: ACCENT }}
        />
        <div
          style={{
            display: "flex",
            width: 10,
            height: 10,
            borderRadius: 5,
            background: ACCENT,
          }}
        />
        <span style={{ fontSize: 22, letterSpacing: 4, marginLeft: 12 }}>
          BOLTER
        </span>
        <span style={{ fontSize: 18, color: MUTED, marginLeft: 12 }}>
          boltertech.com
        </span>
      </div>
    </div>,
    OG_SIZE,
  );
}
