import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { FLEET } from "../data/FleetData.js";
import { getSensors, genVal, sensorStatus } from "../data/SensorData.js";
import { AssetPicker } from "./Shared.jsx";

function initHist(sensors, asset) {
  const h = {};
  sensors.forEach((s) => {
    const pts = [];
    for (let i = 60; i >= 0; i--)
      pts.push({ t: i, v: genVal(s, asset.health) });
    h[s.key] = pts;
  });
  return h;
}

export default function IoTTelemetry({ asset, setAsset, tick }) {
  const sensors = getSensors(asset);
  const [sel, setSel] = useState(sensors[0].key);
  const [hist, setHist] = useState(() => initHist(sensors, asset));

  useEffect(() => {
    const s = getSensors(asset);
    setHist(initHist(s, asset));
    setSel(s[0].key);
  }, [asset.id]);

  useEffect(() => {
    const s = getSensors(asset);
    setHist((prev) => {
      const next = { ...prev };
      s.forEach((sensor) => {
        next[sensor.key] = [
          ...(prev[sensor.key] || []).slice(-59),
          { t: Date.now(), v: genVal(sensor, asset.health) },
        ];
      });
      return next;
    });
  }, [tick, asset.id]);

  const cur = getSensors(asset);
  const latest = {};
  cur.forEach((s) => {
    const h = hist[s.key];
    latest[s.key] = h?.[h.length - 1]?.v ?? genVal(s, asset.health);
  });
  const selS = cur.find((s) => s.key === sel) || cur[0];
  const selH = hist[selS?.key] || [];

  return (
    <div>
      <AssetPicker asset={asset} setAsset={setAsset} fleet={FLEET} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {cur.map((s) => {
          const v = latest[s.key] ?? 0,
            st = sensorStatus(v, s),
            sc =
              st === "crit" ? "#f43f5e" : st === "warn" ? "#f59e0b" : "#00e0a0";
          return (
            <div
              key={s.key}
              onClick={() => setSel(s.key)}
              style={{
                background: sel === s.key ? "#142040" : "#0e1830",
                border: `1px solid ${sel === s.key ? s.color : st !== "ok" ? `${sc}44` : "#182845"}`,
                borderRadius: 8,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: "#4a6080",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: sc,
                    background: `${sc}18`,
                    padding: "2px 6px",
                    borderRadius: 3,
                  }}
                >
                  {st.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "'Courier New',monospace",
                }}
              >
                {v}
                <span style={{ fontSize: 11, color: "#4a6080", marginLeft: 3 }}>
                  {s.unit}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={hist[s.key] || []}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={s.color}
                    strokeWidth={1.2}
                    dot={false}
                  />
                  <ReferenceLine
                    y={s.warn}
                    stroke="#f59e0b"
                    strokeDasharray="3 2"
                    strokeWidth={0.7}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 9, color: "#4a6080", marginTop: 4 }}>
                Nominal: {s.nom[0]}-{s.nom[1]} {s.unit}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "#0e1830",
          border: "1px solid #182845",
          borderRadius: 10,
          padding: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: selS?.color }}>
              {selS?.label} — Live Feed
            </div>
            <div style={{ fontSize: 10, color: "#4a6080", marginTop: 2 }}>
              {asset.id} · 2-second refresh · Last 60 readings
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 10 }}>
            <span style={{ color: "#f59e0b" }}>
              Warn: {selS?.warn} {selS?.unit}
            </span>
            <span style={{ color: "#f43f5e" }}>
              Critical: {selS?.crit} {selS?.unit}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={selH}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selS?.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={selS?.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={false} axisLine={{ stroke: "#182845" }} />
            <YAxis
              tick={{ fill: "#4a6080", fontSize: 9 }}
              axisLine={{ stroke: "#182845" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0e1830",
                border: "1px solid #182845",
                borderRadius: 6,
                fontSize: 11,
              }}
              formatter={(v) => [`${v} ${selS?.unit}`, selS?.label]}
              labelFormatter={() => ""}
            />
            <ReferenceLine
              y={selS?.warn}
              stroke="#f59e0b"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "WARN",
                fill: "#f59e0b",
                fontSize: 8,
                position: "right",
              }}
            />
            <ReferenceLine
              y={selS?.crit}
              stroke="#f43f5e"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "CRIT",
                fill: "#f43f5e",
                fontSize: 8,
                position: "right",
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={selS?.color}
              strokeWidth={1.8}
              fill="url(#sg)"
              dot={false}
              activeDot={{ r: 3, fill: selS?.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
