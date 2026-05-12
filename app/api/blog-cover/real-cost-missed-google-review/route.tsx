import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1600, height: 900 } as const;

function Stars({ value }: { value: number }) {
  const fillFraction = value / 5;
  return (
    <svg width="160" height="28" viewBox="0 0 160 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`clip-${value}`}>
          <rect x="0" y="0" width={160 * fillFraction} height="28" />
        </clipPath>
      </defs>
      <g fill="#dadce0">
        {[0, 32, 64, 96, 128].map((x) => (
          <path
            key={x}
            d={`M${x + 14} 2 L${x + 17.5} 10 L${x + 26} 10 L${x + 19} 16 L${x + 22} 25 L${x + 14} 19 L${x + 6} 25 L${x + 9} 16 L${x + 2} 10 L${x + 10.5} 10 Z`}
          />
        ))}
      </g>
      <g fill="#FFB400" clipPath={`url(#clip-${value})`}>
        {[0, 32, 64, 96, 128].map((x) => (
          <path
            key={x}
            d={`M${x + 14} 2 L${x + 17.5} 10 L${x + 26} 10 L${x + 19} 16 L${x + 22} 25 L${x + 14} 19 L${x + 6} 25 L${x + 9} 16 L${x + 2} 10 L${x + 10.5} 10 Z`}
          />
        ))}
      </g>
    </svg>
  );
}

function Sparkline({ trend }: { trend: "down" | "up" }) {
  const points =
    trend === "down"
      ? "0,12 30,22 60,32 90,46 120,58 150,70 180,82"
      : "0,82 30,70 60,56 90,44 120,30 150,18 180,8";
  const stroke = trend === "down" ? "#EA4335" : "#10A37F";
  return (
    <svg width="180" height="90" viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(135deg, #0A1628 0%, #142a44 100%)",
          color: "#F8F6F1",
          padding: "60px 56px",
          fontFamily: "sans-serif",
        }}
      >
        {/* ============ LEFT — Dormant ============ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#EA4335",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Your Profile — Dormant
          </div>

          {/* Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 540,
              background: "#ffffff",
              borderRadius: 22,
              padding: 28,
              color: "#202124",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Acme Plumbing
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#5f6368", marginBottom: 16 }}>
              Plumber · Hartford, CT
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginRight: 14 }}>
                4.6
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Stars value={4.6} />
                <div style={{ display: "flex", fontSize: 13, color: "#5f6368", marginTop: 4 }}>
                  142 reviews
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                background: "#fde7e7",
                border: "1px solid #f5c2c2",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 16,
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 12,
                  color: "#a52a2a",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Last review
              </div>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#c62828" }}>
                14 months ago
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 12,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Map rank trend
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#EA4335",
                  }}
                >
                  #3 → #8 ↓
                </div>
              </div>
              <Sparkline trend="down" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              background: "rgba(234,67,53,0.16)",
              border: "1px solid rgba(234,67,53,0.45)",
              borderRadius: 14,
              padding: "14px 22px",
              fontSize: 24,
              fontWeight: 700,
              color: "#FF8A80",
              letterSpacing: -0.3,
            }}
          >
            −$38,400 / year
          </div>
        </div>

        {/* ============ RIGHT — Active competitor ============ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#7CE7B7",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Competitor — Alive
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 540,
              background: "#ffffff",
              borderRadius: 22,
              padding: 28,
              color: "#202124",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Hartford Plumbing Pros
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#5f6368", marginBottom: 16 }}>
              Plumber · Hartford, CT
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginRight: 14 }}>
                4.7
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Stars value={4.7} />
                <div style={{ display: "flex", fontSize: 13, color: "#5f6368", marginTop: 4 }}>
                  98 reviews
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                background: "#e7f7ee",
                border: "1px solid #b6e2c8",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 16,
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 12,
                  color: "#2e7d32",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Last review
              </div>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#1b5e20" }}>
                2 days ago
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 12,
                    color: "#5f6368",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Map rank trend
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#10A37F",
                  }}
                >
                  #6 → #2 ↑
                </div>
              </div>
              <Sparkline trend="up" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              background: "rgba(16,163,127,0.18)",
              border: "1px solid rgba(16,163,127,0.5)",
              borderRadius: 14,
              padding: "14px 22px",
              fontSize: 22,
              fontWeight: 700,
              color: "#7CE7B7",
              letterSpacing: -0.3,
            }}
          >
            taking your rank, calls, customers
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
