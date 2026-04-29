export default function Header({ totalAlerts }) {
  return (
    <header
      style={{
        background: "#0a1020",
        borderBottom: "1px solid #182845",
        padding: "0 22px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#00d4ff,#0055cc)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "#00d4ff",
                letterSpacing: 3,
                fontFamily: "'Syne',sans-serif",
                lineHeight: 1,
              }}
            >
              AXIONRAIL AI
            </div>
            <div style={{ fontSize: 8, color: "#4a6080", letterSpacing: 2.5 }}>
              PREDICTIVE & PRESCRIPTIVE FLEET ANALYTICS · KEYTOTECHSOLUTIONS
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 10,
              color: "#4a6080",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00e0a0",
                display: "inline-block",
                boxShadow: "0 0 8px #00e0a0",
              }}
            />
            LIVE TELEMETRY
          </div>
          {totalAlerts > 0 && (
            <div
              style={{
                background: "#f43f5e18",
                color: "#f43f5e",
                border: "1px solid #f43f5e44",
                borderRadius: 5,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              ⚠ {totalAlerts} ALERTS
            </div>
          )}
          <div
            style={{
              background: "#00d4ff18",
              color: "#00d4ff",
              border: "1px solid #00d4ff44",
              borderRadius: 5,
              padding: "3px 10px",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            TENDER DEMO
          </div>
        </div>
      </div>
    </header>
  );
}
