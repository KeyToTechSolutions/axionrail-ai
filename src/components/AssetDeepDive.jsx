import { FLEET } from "../data/FleetData.js";
import { Hbar, Badge, AssetPicker, RadarSVG } from "./Shared.jsx";

export default function AssetDeepDive({ asset, setAsset }) {
  return (
    <div>
      <AssetPicker asset={asset} setAsset={setAsset} fleet={FLEET} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "#0e1830",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#4a6080",
              letterSpacing: 1.5,
              marginBottom: 16,
            }}
          >
            ASSET PROFILE
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#00d4ff",
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                {asset.id}
              </div>
              <div style={{ fontSize: 12, color: "#b8cce8", marginTop: 4 }}>
                {asset.cls} · {asset.type}
              </div>
              <div style={{ fontSize: 10, color: "#4a6080", marginTop: 2 }}>
                Route: {asset.route}
              </div>
              <div style={{ fontSize: 10, color: "#4a6080" }}>
                Depot: {asset.depot} · Mfr: {asset.mfr}
              </div>
              <div style={{ marginTop: 14 }}>
                <Badge s={asset.status} />
              </div>
            </div>
            <RadarSVG data={asset.sub} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginTop: 16,
            }}
          >
            {[
              [
                "Health",
                `${asset.health}%`,
                asset.health >= 80
                  ? "#00e0a0"
                  : asset.health >= 60
                    ? "#f59e0b"
                    : "#f43f5e",
              ],
              [
                "RUL",
                `${asset.rul} days`,
                asset.rul < 14 ? "#f43f5e" : "#f59e0b",
              ],
              ["Odometer", `${(asset.km / 1000).toFixed(0)}k km`, "#00d4ff"],
              ["Age", `${asset.age} yrs`, "#4a6080"],
              [
                "Alerts",
                asset.alerts,
                asset.alerts > 0 ? "#f43f5e" : "#00e0a0",
              ],
              ["Manufacturer", asset.mfr, "#4a6080"],
            ].map(([k, v, c], i) => (
              <div
                key={i}
                style={{
                  background: "#0a1020",
                  borderRadius: 6,
                  padding: "9px 12px",
                }}
              >
                <div
                  style={{ fontSize: 8, color: "#4a6080", letterSpacing: 1 }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: c,
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          {asset.faults && asset.faults.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: "#f43f5e",
                  letterSpacing: 1.2,
                  marginBottom: 8,
                }}
              >
                ACTIVE FAULTS ({asset.faults.length})
              </div>
              {asset.faults.map((f, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 10,
                    color: "#b8cce8",
                    padding: "5px 0",
                    borderBottom: "1px solid #182845",
                  }}
                >
                  • {f}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#0e1830",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#4a6080",
              letterSpacing: 1.5,
              marginBottom: 18,
            }}
          >
            SUBSYSTEM HEALTH
          </div>
          {Object.entries(asset.sub)
            .filter(([, v]) => v !== null)
            .map(([k, v]) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color:
                        v >= 80 ? "#00e0a0" : v >= 60 ? "#f59e0b" : "#f43f5e",
                    }}
                  >
                    {v}%
                  </span>
                </div>
                <Hbar v={v} h={8} />
                <div style={{ fontSize: 9, color: "#4a6080", marginTop: 4 }}>
                  {v < 60
                    ? "CRITICAL - Immediate inspection required"
                    : v < 75
                      ? "DEGRADED - Schedule intervention"
                      : "Within operational parameters"}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        style={{
          background: "#0e1830",
          border: "1px solid #182845",
          borderRadius: 10,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#4a6080",
            letterSpacing: 1.5,
            marginBottom: 20,
          }}
        >
          MAINTENANCE TIMELINE
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 30,
              right: 30,
              height: 2,
              background: `linear-gradient(90deg,#00e0a0,#00d4ff,${asset.rul < 14 ? "#f43f5e" : "#f59e0b"})`,
            }}
          />
          {[
            {
              l: "Last Maintenance",
              d: "2026-03-15",
              c: "#00e0a0",
              icon: "CHECK",
            },
            { l: "TODAY", d: "2026-04-22", c: "#00d4ff", icon: "NOW" },
            {
              l: "Next Scheduled",
              d: asset.nextMaint || "TBC",
              c: asset.rul < 14 ? "#f43f5e" : "#f59e0b",
              icon: "SCHED",
            },
          ].map((e, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems:
                  i === 0 ? "flex-start" : i === 2 ? "flex-end" : "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#0a1020",
                  border: `2px solid ${e.c}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 700,
                  color: e.c,
                  zIndex: 1,
                  boxShadow: `0 0 14px ${e.c}55`,
                }}
              >
                {e.icon}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: e.c,
                  fontWeight: 700,
                  marginTop: 8,
                  letterSpacing: 1,
                }}
              >
                {e.l}
              </div>
              <div style={{ fontSize: 11, color: "#b8cce8" }}>{e.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
