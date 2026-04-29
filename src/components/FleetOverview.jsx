import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { FLEET } from "../data/FleetData.js";
import { Kpi, Hbar, Badge } from "./Shared.jsx";

export default function FleetOverview({ asset, setAsset, setTab }) {
  const [sortBy, setSortBy] = useState("health");

  const sorted = [...FLEET].sort((a, b) =>
    sortBy === "health"
      ? a.health - b.health
      : sortBy === "rul"
        ? a.rul - b.rul
        : b.alerts - a.alerts,
  );
  const avgH = Math.round(
    FLEET.reduce((s, a) => s + a.health, 0) / FLEET.length,
  );
  const opCount = FLEET.filter((a) => a.status === "Operational").length;
  const critCount = FLEET.filter((a) => a.health < 60).length;
  const totalAlerts = FLEET.reduce((s, a) => s + a.alerts, 0);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <Kpi
          label="Fleet Health Index"
          value={avgH}
          unit="%"
          sub={`${FLEET.length} assets rolling average`}
          color={avgH >= 70 ? "#00e0a0" : "#f59e0b"}
          icon="📊"
        />
        <Kpi
          label="Assets Available"
          value={`${opCount}/${FLEET.length}`}
          sub="Operational right now"
          color="#00d4ff"
          icon="✅"
        />
        <Kpi
          label="Active Alerts"
          value={totalAlerts}
          sub={`${critCount} critical/at-risk`}
          color="#f43f5e"
          icon="⚠️"
        />
        <Kpi
          label="Avg Remaining Life"
          value={Math.round(
            FLEET.reduce((s, a) => s + a.rul, 0) / FLEET.length,
          )}
          unit="days"
          sub="Until next overhaul"
          color="#00e0a0"
          icon="⏱️"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            background: "#0e1830",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: 18,
            gridColumn: "span 2",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#4a6080",
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            FLEET HEALTH DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart
              data={FLEET.map((a) => ({ id: a.id, h: a.health }))}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="id"
                tick={{ fill: "#4a6080", fontSize: 7 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#4a6080", fontSize: 7 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0e1830",
                  border: "1px solid #182845",
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(v) => [`${v}%`, "Health"]}
              />
              <ReferenceLine
                y={60}
                stroke="#f59e0b"
                strokeDasharray="3 2"
                strokeWidth={1}
              />
              <Bar dataKey="h" radius={[3, 3, 0, 0]}>
                {FLEET.map((a) => (
                  <Cell
                    key={a.id}
                    fill={
                      a.health >= 80
                        ? "#00e0a0"
                        : a.health >= 60
                          ? "#f59e0b"
                          : "#f43f5e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            background: "#0e1830",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#4a6080",
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            STATUS BREAKDOWN
          </div>
          {[
            ["Operational", opCount, "#00e0a0"],
            [
              "Warning",
              FLEET.filter((a) => a.status === "Warning").length,
              "#f59e0b",
            ],
            [
              "Critical / At Risk",
              FLEET.filter((a) => ["At Risk", "Critical"].includes(a.status))
                .length,
              "#f43f5e",
            ],
          ].map(([l, v, c]) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 10, color: "#4a6080" }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: c }}>
                  {v}
                </span>
              </div>
              <Hbar v={Math.round((v / FLEET.length) * 100)} h={5} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 10, color: "#4a6080", letterSpacing: 1.5 }}>
          FLEET REGISTRY — {FLEET.length} ASSETS · CLICK ROW TO INSPECT
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["health", "Health"],
            ["rul", "RUL"],
            ["alerts", "Alerts"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              style={{
                background: sortBy === k ? "#00d4ff18" : "#0e1830",
                color: sortBy === k ? "#00d4ff" : "#4a6080",
                border: `1px solid ${sortBy === k ? "#00d4ff" : "#182845"}`,
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 9,
                cursor: "pointer",
                letterSpacing: 1,
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "110px 55px 200px 1fr 88px 66px 60px 90px",
          gap: 10,
          padding: "5px 14px",
          marginBottom: 5,
        }}
      >
        {[
          "ASSET ID",
          "TYPE",
          "ROUTE",
          "HEALTH",
          "RUL",
          "ALERTS",
          "STATUS",
          "",
        ].map((h, i) => (
          <span
            key={i}
            style={{
              fontSize: 8,
              color: "#4a6080",
              letterSpacing: 1.2,
              fontWeight: 700,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {sorted.map((a) => (
        <div
          key={a.id}
          className="row"
          onClick={() => {
            setAsset(a);
            setTab("asset");
          }}
          style={{
            background: "#0e1830",
            border: `1px solid ${a.health < 60 ? "#f43f5e33" : "#182845"}`,
            borderRadius: 8,
            padding: "13px 14px",
            marginBottom: 7,
            transition: "all .15s",
            display: "grid",
            gridTemplateColumns: "110px 55px 200px 1fr 88px 66px 60px 90px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#00d4ff",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {a.id}
            </div>
            <div style={{ fontSize: 9, color: "#4a6080", marginTop: 1 }}>
              {a.cls}
            </div>
          </div>
          <div
            style={{
              background: "#182845",
              borderRadius: 3,
              padding: "2px 6px",
              fontSize: 9,
              fontWeight: 700,
              color: "#4a6080",
              textAlign: "center",
            }}
          >
            {a.type}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#b8cce8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {a.route}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 9, color: "#4a6080" }}>HEALTH</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color:
                    a.health >= 80
                      ? "#00e0a0"
                      : a.health >= 60
                        ? "#f59e0b"
                        : "#f43f5e",
                }}
              >
                {a.health}%
              </span>
            </div>
            <Hbar v={a.health} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color:
                  a.rul < 14 ? "#f43f5e" : a.rul < 30 ? "#f59e0b" : "#00e0a0",
                fontFamily: "'Courier New',monospace",
              }}
            >
              {a.rul}
            </div>
            <div style={{ fontSize: 8, color: "#4a6080" }}>DAYS</div>
          </div>
          <div style={{ textAlign: "center" }}>
            {a.alerts > 0 ? (
              <span
                style={{
                  background: "#f43f5e18",
                  color: "#f43f5e",
                  border: "1px solid #f43f5e33",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                ⚠ {a.alerts}
              </span>
            ) : (
              <span style={{ color: "#00e0a0", fontSize: 12 }}>✓</span>
            )}
          </div>
          <div>
            <Badge s={a.status} />
          </div>
          <div style={{ fontSize: 9, color: "#0090bb", textAlign: "right" }}>
            VIEW →
          </div>
        </div>
      ))}
    </div>
  );
}
