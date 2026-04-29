// src/components/Shared.jsx — all shared UI primitives

export function Hbar({ v, h = 6 }) {
  const c = v >= 80 ? "#00e0a0" : v >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <div
      style={{
        background: "#182845",
        borderRadius: 9999,
        height: h,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${v}%`,
          height: "100%",
          background: c,
          transition: "width .8s ease",
          boxShadow: `0 0 5px ${c}66`,
        }}
      />
    </div>
  );
}

export function Badge({ s }) {
  const m = {
    Operational: { bg: "#00e0a018", c: "#00e0a0" },
    Warning: { bg: "#f59e0b18", c: "#f59e0b" },
    "At Risk": { bg: "#f43f5e18", c: "#f43f5e" },
    Critical: { bg: "#f43f5e28", c: "#f43f5e" },
  }[s] || { bg: "#ffffff11", c: "#ffffff" };
  return (
    <span
      style={{
        background: m.bg,
        color: m.c,
        border: `1px solid ${m.c}30`,
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.c,
          boxShadow: `0 0 5px ${m.c}`,
        }}
      />
      {s.toUpperCase()}
    </span>
  );
}

export function Kpi({
  label,
  value,
  unit = "",
  sub,
  color = "#00d4ff",
  icon = "",
}) {
  return (
    <div
      style={{
        background: "#0e1830",
        border: "1px solid #182845",
        borderRadius: 10,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,${color},transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 14,
          fontSize: 22,
          opacity: 0.1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#4a6080",
          letterSpacing: 1.5,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color,
          lineHeight: 1,
          fontFamily: "'Courier New',monospace",
        }}
      >
        {value}
        <span style={{ fontSize: 13, color: "#4a6080", marginLeft: 4 }}>
          {unit}
        </span>
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: "#4a6080", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function AssetPicker({ asset, setAsset, fleet }) {
  return (
    <div
      style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}
    >
      {fleet.map((a) => (
        <button
          key={a.id}
          onClick={() => setAsset(a)}
          style={{
            background: asset.id === a.id ? "#00d4ff18" : "#0e1830",
            color: asset.id === a.id ? "#00d4ff" : "#4a6080",
            border: `1px solid ${asset.id === a.id ? "#00d4ff" : "#182845"}`,
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all .15s",
            fontFamily: "inherit",
          }}
        >
          {a.id}{" "}
          <span
            style={{
              color:
                a.health < 60
                  ? "#f43f5e"
                  : a.health < 75
                    ? "#f59e0b"
                    : "#00e0a0",
            }}
          >
            ●
          </span>
        </button>
      ))}
    </div>
  );
}

export function RadarSVG({ data }) {
  const ents = Object.entries(data).filter(([, v]) => v !== null);
  if (!ents.length) return null;
  const n = ents.length,
    cx = 85,
    cy = 85,
    r = 58;
  const pts = ents.map(([k, v], i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const pct = v / 100;
    return {
      x: cx + Math.cos(a) * r * pct,
      y: cy + Math.sin(a) * r * pct,
      lx: cx + Math.cos(a) * (r + 20),
      ly: cy + Math.sin(a) * (r + 20),
      k: k.slice(0, 5).toUpperCase(),
    };
  });
  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const avg = Math.round(ents.reduce((s, [, v]) => s + v, 0) / ents.length);
  const color = avg >= 80 ? "#00e0a0" : avg >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <svg width={170} height={170} viewBox="0 0 170 170">
      {[0.25, 0.5, 0.75, 1].map((g) => {
        const gp = ents
          .map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * r * g},${cy + Math.sin(a) * r * g}`;
          })
          .join(" ");
        return (
          <polygon
            key={g}
            points={gp}
            fill="none"
            stroke="#182845"
            strokeWidth={0.6}
          />
        );
      })}
      {ents.map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
            stroke="#182845"
            strokeWidth={0.6}
          />
        );
      })}
      <polygon
        points={poly}
        fill={`${color}25`}
        stroke={color}
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill={color} opacity={0.9} />
          <text
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={7.5}
            fill="#4a6080"
          >
            {p.k}
          </text>
        </g>
      ))}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize={18}
        fontWeight={800}
        fill={color}
      >
        {avg}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize={7} fill="#4a6080">
        AVG HEALTH
      </text>
    </svg>
  );
}
