import { useState } from "react";
import { FLEET } from "../data/FleetData.js";
import { AssetPicker } from "./Shared.jsx";

export default function AIAnalytics({ asset, setAsset }) {
  const [mode, setMode] = useState("predictive");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    const subs = Object.entries(asset.sub)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => `${k}=${v}%`)
      .join(", ");
    const faults = asset.faults.join("; ") || "None";
    const prompts = {
      predictive: `You are AxionRail AI, a railway predictive analytics engine.\n\nAsset: ${asset.id} (${asset.cls} ${asset.type})\nRoute: ${asset.route} | Depot: ${asset.depot}\nHealth: ${asset.health}% | RUL: ${asset.rul} days | Odometer: ${(asset.km / 1000).toFixed(0)}k km | Age: ${asset.age} yrs\nAlerts: ${asset.alerts} | Faults: ${faults}\nSubsystems: ${subs}\n\nProvide structured PREDICTIVE analytics:\n\n## FAILURE RISK ASSESSMENT\nTop 3 risks with % probability and timeframe\n\n## FAILURE MODE ANALYSIS\nSpecific failure modes, root causes, early indicators\n\n## RUL PROJECTION BY SUBSYSTEM\nPer-subsystem RUL with confidence bounds\n\n## SENSOR ANOMALY INTERPRETATION\nWhat current health scores reveal\n\n## RISK PRIORITY MATRIX\nCritical/High/Medium/Low items and inspection intervals\n\nUse real percentages and technical specifics.`,
      prescriptive: `You are AxionRail AI, a railway prescriptive maintenance engine.\n\nAsset: ${asset.id} (${asset.cls} ${asset.type})\nRoute: ${asset.route} | Health: ${asset.health}% | RUL: ${asset.rul} days\nFaults: ${faults}\nSubsystems: ${subs}\n\nProvide structured PRESCRIPTIVE action plan:\n\n## IMMEDIATE ACTIONS (0-72 hours)\nSafety-critical items\n\n## SHORT-TERM PLAN (7-30 days)\nScheduled work scope and sequence\n\n## PARTS AND MATERIALS\nComponents with lead times\n\n## OPERATIONAL RESTRICTIONS\nSpeed/load/route limits pending maintenance\n\n## COST-BENEFIT ANALYSIS\nMaintenance cost vs failure cost in ZAR\n\n## POST-MAINTENANCE KPI TARGETS\nExpected health scores per subsystem`,
      fmea: `You are AxionRail AI, a railway reliability engineer.\n\nAsset: ${asset.id} (${asset.type})\nWeakest subsystem: ${
        Object.entries(asset.sub)
          .filter(([, v]) => v !== null)
          .sort(([, a], [, b]) => a - b)[0]?.[0]
      } at ${
        Object.entries(asset.sub)
          .filter(([, v]) => v !== null)
          .sort(([, a], [, b]) => a - b)[0]?.[1]
      }%\nFault: ${asset.faults[0] || "None"}\n\nGenerate ONE new FMEA entry:\nFUNCTION: [subsystem purpose]\nFAILURE MODE: [specific failure]\nEFFECT: [consequence]\nROOT CAUSE: [cause]\nSEVERITY (1-10): [number with reason]\nOCCURRENCE (1-10): [number with reason]\nDETECTION (1-10): [number with reason]\nRPN: [S x O x D]\nCURRENT CONTROLS: [safeguards]\nACTION: [specific step]\nRESPONSIBILITY: [role]\nTARGET DATE: [date]\nESTIMATED COST (ZAR): [estimate]`,
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompts[mode] }],
        }),
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "No response received.");
    } catch {
      setResult(
        "Connection failed. Check your VITE_ANTHROPIC_API_KEY in .env and retry.",
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <AssetPicker asset={asset} setAsset={setAsset} fleet={FLEET} />
      <div
        style={{
          background: "#0e1830",
          border: "1px solid #182845",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#0a1020",
            padding: "14px 20px",
            borderBottom: "1px solid #182845",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: loading ? "#f59e0b" : "#00e0a0",
                display: "inline-block",
                boxShadow: `0 0 8px ${loading ? "#f59e0b" : "#00e0a0"}`,
              }}
            />
            <span
              style={{
                color: "#00d4ff",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1.5,
              }}
            >
              AXIONRAIL AI ENGINE — {asset.id}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["predictive", "Predictive"],
              ["prescriptive", "Prescriptive"],
              ["fmea", "FMEA Gen"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => {
                  setMode(k);
                  setResult(null);
                }}
                style={{
                  background: mode === k ? "#00d4ff" : "transparent",
                  color: mode === k ? "#05080f" : "#4a6080",
                  border: `1px solid ${mode === k ? "#00d4ff" : "#182845"}`,
                  borderRadius: 4,
                  padding: "5px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: 22 }}>
          <div
            style={{
              background: "#0a1020",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 11,
              color: "#4a6080",
              borderLeft: "3px solid #00d4ff",
            }}
          >
            {mode === "predictive" &&
              "Predictive: Forecasts failure probability, RUL by subsystem, and anomaly patterns."}
            {mode === "prescriptive" &&
              "Prescriptive: Prioritised maintenance actions, parts lists, restrictions, and cost-benefit in ZAR."}
            {mode === "fmea" &&
              "FMEA Generation: AI synthesises a new FMEA entry for the highest-risk subsystem."}
          </div>
          <button
            onClick={run}
            disabled={loading}
            style={{
              background: loading
                ? "#182845"
                : "linear-gradient(135deg,#00d4ff,#0090bb)",
              color: loading ? "#4a6080" : "#05080f",
              border: "none",
              borderRadius: 7,
              padding: "11px 28px",
              fontWeight: 800,
              fontSize: 11,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "inherit",
              boxShadow: loading ? "none" : "0 0 24px #00d4ff55",
              transition: "all .2s",
            }}
          >
            {loading
              ? "RUNNING AI ANALYSIS..."
              : `RUN ${mode.toUpperCase()} ANALYSIS`}
          </button>
          {loading && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  height: 3,
                  background: "#182845",
                  borderRadius: 9999,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#00d4ff",
                    width: "70%",
                    borderRadius: 9999,
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: "#4a6080" }}>
                Processing sensor telemetry and failure patterns...
              </div>
            </div>
          )}
          {result && (
            <div
              style={{
                background: "#05080f",
                border: "1px solid #2a4878",
                borderRadius: 7,
                padding: "18px 20px",
                fontSize: 11.5,
                color: "#b8cce8",
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
                fontFamily: "'IBM Plex Mono','Courier New',monospace",
                maxHeight: 460,
                overflowY: "auto",
              }}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
