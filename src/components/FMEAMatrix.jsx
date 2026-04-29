import { useState } from "react";
import { FMEA_DATA, rpn, rpnColor, rpnLabel } from "../data/FmeaData.js";

export default function FMEAMatrix() {
  const [filt, setFilt] = useState("All");
  const [srt, setSrt] = useState("rpn");
  const systems = ["All", ...new Set(FMEA_DATA.map((f) => f.system))];
  const filtered = FMEA_DATA.filter(
    (f) => filt === "All" || f.system === filt,
  ).sort((a, b) =>
    srt === "rpn" ? rpn(b) - rpn(a) : a.system.localeCompare(b.system),
  );
  const tots = {
    crit: FMEA_DATA.filter((f) => rpn(f) >= 200).length,
    high: FMEA_DATA.filter((f) => rpn(f) >= 120 && rpn(f) < 200).length,
    med: FMEA_DATA.filter((f) => rpn(f) >= 60 && rpn(f) < 120).length,
    low: FMEA_DATA.filter((f) => rpn(f) < 60).length,
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          ["Critical 200+", tots.crit, "#f43f5e"],
          ["High 120-199", tots.high, "#f59e0b"],
          ["Medium 60-119", tots.med, "#fbbf24"],
          ["Low below 60", tots.low, "#00e0a0"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: "#0e1830",
              border: `1px solid ${c}33`,
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: c,
                fontFamily: "'Courier New',monospace",
              }}
            >
              {v}
            </div>
            <div style={{ fontSize: 10, color: "#4a6080", marginTop: 4 }}>
              RPN {l}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {systems.map((s) => (
          <button
            key={s}
            onClick={() => setFilt(s)}
            style={{
              background: filt === s ? "#00d4ff18" : "#0e1830",
              color: filt === s ? "#00d4ff" : "#4a6080",
              border: `1px solid ${filt === s ? "#00d4ff" : "#182845"}`,
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {[
            ["rpn", "RPN"],
            ["sys", "System"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSrt(k)}
              style={{
                background: srt === k ? "#00d4ff18" : "#0e1830",
                color: srt === k ? "#00d4ff" : "#4a6080",
                border: `1px solid ${srt === k ? "#00d4ff" : "#182845"}`,
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 9,
                cursor: "pointer",
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
          gridTemplateColumns:
            "88px 110px 1fr 1fr 28px 28px 28px 60px 80px 70px",
          gap: 8,
          padding: "5px 12px",
          marginBottom: 5,
        }}
      >
        {[
          "REF",
          "SYSTEM",
          "FAILURE MODE",
          "EFFECT",
          "S",
          "O",
          "D",
          "RPN",
          "PRIORITY",
          "STATUS",
        ].map((h, i) => (
          <span
            key={i}
            style={{
              fontSize: 8,
              color: "#4a6080",
              letterSpacing: 1.2,
              fontWeight: 700,
              textAlign: i >= 4 && i <= 7 ? "center" : "left",
            }}
          >
            {h}
          </span>
        ))}
      </div>
      {filtered.map((f) => {
        const r = rpn(f),
          rc = rpnColor(r),
          stc =
            f.status === "Closed"
              ? "#00e0a0"
              : f.status === "In Progress"
                ? "#f59e0b"
                : "#4a6080";
        return (
          <div
            key={f.id}
            style={{
              background: "#0e1830",
              border: `1px solid ${r >= 200 ? "#f43f5e33" : "#182845"}`,
              borderRadius: 7,
              padding: "10px 12px",
              marginBottom: 7,
              display: "grid",
              gridTemplateColumns:
                "88px 110px 1fr 1fr 28px 28px 28px 60px 80px 70px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 9, color: "#00d4ff", fontWeight: 700 }}>
              {f.id}
            </span>
            <span style={{ fontSize: 9, color: "#b8cce8" }}>{f.system}</span>
            <span style={{ fontSize: 9, color: "#b8cce8" }}>{f.fm}</span>
            <span style={{ fontSize: 9, color: "#4a6080" }}>
              {f.effect.slice(0, 52)}...
            </span>
            {[f.s, f.o, f.d].map((v, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: v >= 8 ? "#f43f5e" : v >= 5 ? "#f59e0b" : "#00e0a0",
                  textAlign: "center",
                }}
              >
                {v}
              </span>
            ))}
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: rc,
                textAlign: "center",
              }}
            >
              {r}
            </span>
            <span
              style={{
                background: `${rc}18`,
                color: rc,
                border: `1px solid ${rc}33`,
                borderRadius: 3,
                padding: "2px 5px",
                fontSize: 8,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {rpnLabel(r)}
            </span>
            <span style={{ color: stc, fontSize: 9, fontWeight: 700 }}>
              {f.status}
            </span>
          </div>
        );
      })}
      <div
        style={{
          background: "#0e1830",
          border: "1px solid #182845",
          borderRadius: 8,
          padding: "12px 16px",
          marginTop: 14,
          fontSize: 9,
          color: "#4a6080",
        }}
      >
        RPN = Severity x Occurrence x Detection · 1-3 Minor · 4-6 Moderate · 7-9
        Major · 10 Catastrophic
      </div>
    </div>
  );
}
