import { useState } from "react";
import { FLEET } from "../data/FleetData.js";
import { AssetPicker } from "./Shared.jsx";

// Pre-written realistic AI responses — no API key needed
const MOCK_RESPONSES = {
  predictive: {
    "EMU-001": `## FAILURE RISK ASSESSMENT

1. Door System Failure — Probability: 68% within 21 days
   Actuator sensor intermittent fault on Car 3 is a leading indicator of full actuator failure. Door systems at 79% health with active fault logged.

2. Brake Pad Replacement Due — Probability: 55% within 30 days
   Brake subsystem at 84% health. At current degradation rate, pads will reach minimum thickness threshold before next scheduled maintenance on 2026-05-02.

3. Bogie Primary Suspension Fatigue — Probability: 31% within 42 days
   Bogies at 89% health. 842,300km accumulated mileage indicates coil spring fatigue onset typical for Class 10M at this service age (8 years).

## FAILURE MODE ANALYSIS

- Door actuator solenoid burnout: Intermittent electrical fault pattern consistent with coil degradation. Early indicator: door cycle count increasing above 75/hr.
- Brake disc micro-cracking: Elevated thermal stress from hard braking on JHB-PTA gradient sections. Detection: vibration signature change during brake application.
- Wheel flange wear: Flange profile at 91% — nominal but approaching first re-profiling threshold at 800,000km.

## RUL PROJECTION BY SUBSYSTEM

- Wheel:      91% health — RUL 58 days (confidence +/-6 days)
- Brakes:     84% health — RUL 38 days (confidence +/-4 days)
- Traction:   88% health — RUL 52 days (confidence +/-5 days)
- HVAC:       92% health — RUL 64 days (confidence +/-7 days)
- Doors:      79% health — RUL 21 days (confidence +/-3 days) — PRIORITY
- Pantograph: 86% health — RUL 45 days (confidence +/-5 days)
- Bogies:     89% health — RUL 55 days (confidence +/-6 days)

## SENSOR ANOMALY INTERPRETATION

Overall health index of 87% indicates a well-maintained asset operating within acceptable parameters. The door subsystem at 79% is the only outlier requiring near-term attention. Traction current telemetry shows stable draw patterns with no inverter anomalies. Vibration signature on axle 3 shows 0.3mm/s² above baseline — within tolerance but trending upward.

## RISK PRIORITY MATRIX

CRITICAL: None
HIGH:     Door actuator Car 3 — inspect within 7 days
MEDIUM:   Brake pad thickness check — inspect within 21 days
MEDIUM:   Wheel profile gauge — check at next depot visit
LOW:      Pantograph contact strip — monitor monthly
LOW:      Bogie spring visual — check at 6-month service`,

    "EMU-007": `## FAILURE RISK ASSESSMENT

1. Total HVAC Failure — Probability: 91% within 7 days
   Compressor fault active. HVAC at 55% health — lowest subsystem. Refrigerant pressure drop detected. Passenger temperature regulatory compliance at risk.

2. Wheel Derailment Risk — Probability: 78% within 12 days
   Wheel flange wear exceeding 3mm actively logged. Wheel health at 58%. Immediate re-profiling required. Operating beyond this threshold violates EN 14363 safety limits.

3. Motor Thermal Shutdown — Probability: 83% within 10 days
   Motor overheating fault active. Traction at 72% health. Thermal protection will trigger automatic shutdown causing service cancellation.

## FAILURE MODE ANALYSIS

- HVAC compressor liquid slugging: Refrigerant leak causing liquid ingestion into compressor — catastrophic bearing failure imminent.
- Wheel flange fracture: Flange geometry outside SANS 3381 tolerance. Continued operation risks derailment at speed above 60km/h.
- Traction motor winding breakdown: Overheating indicates insulation degradation — risk of complete motor burnout within 2 service days.

## RUL PROJECTION BY SUBSYSTEM

- Wheel:      58% health — RUL 5 days  (confidence +/-1 day)  CRITICAL
- Brakes:     63% health — RUL 9 days  (confidence +/-2 days) HIGH
- Traction:   72% health — RUL 14 days (confidence +/-2 days) HIGH
- HVAC:       55% health — RUL 4 days  (confidence +/-1 day)  CRITICAL
- Doors:      61% health — RUL 8 days  (confidence +/-2 days) HIGH
- Pantograph: 68% health — RUL 11 days (confidence +/-2 days) HIGH
- Bogies:     59% health — RUL 6 days  (confidence +/-1 day)  CRITICAL

## SENSOR ANOMALY INTERPRETATION

Fleet health of 61% is critically low. Multiple concurrent subsystem failures indicate deferred maintenance backlog. Vibration telemetry shows axle bearing frequencies consistent with spalling onset. Brake pressure holding at lower boundary — hydraulic leak confirmed by progressive decay signature.

## RISK PRIORITY MATRIX

CRITICAL: Wheel flange — withdraw from service immediately
CRITICAL: HVAC compressor — failure imminent
CRITICAL: Bogie inspection — crack risk at 59% health
HIGH:     Traction motor overheating — thermal shutdown risk
HIGH:     Brake hydraulic leak — pressure loss progressive
HIGH:     Door system — multiple actuator faults
MEDIUM:   Pantograph contact strip — accelerated wear`,

    default: `## FAILURE RISK ASSESSMENT

1. Primary Subsystem Degradation — Probability: varies by asset health
   Current health index indicates progressive wear across multiple subsystems. Predictive model projects failure window based on degradation trajectory and accumulated mileage.

2. Brake System Wear — Probability: 60% within RUL window
   Brake subsystem health indicates pad thickness approaching minimum threshold. Hydraulic pressure trending downward.

3. Traction System Stress — Probability: 45% within RUL window
   Traction health indicates inverter thermal cycling stress. IGBT module monitoring recommended.

## FAILURE MODE ANALYSIS

- Primary wear mechanism: Normal service degradation accelerated by high-frequency stop-start operations on current route assignment.
- Secondary failure path: Deferred maintenance interval creating compounding subsystem stress.
- Tertiary risk: Environmental factors (temperature, track condition) contributing to accelerated degradation.

## RUL PROJECTION BY SUBSYSTEM

Projections based on current health scores and historical degradation rates for this asset class. Confidence intervals calculated using LSTM model trained on 15-year fleet maintenance dataset.

## SENSOR ANOMALY INTERPRETATION

Telemetry patterns consistent with mid-life asset degradation. No acute anomalies detected. Vibration baseline elevated 0.4mm/s above fleet average for asset class — indicative of normal wear progression.

## RISK PRIORITY MATRIX

Review subsystem health scores above. Any subsystem below 70% requires scheduled intervention within 30 days. Any subsystem below 60% requires immediate inspection.`,
  },

  prescriptive: {
    "EMU-007": `## IMMEDIATE ACTIONS (0-72 hours)

1. WITHDRAW EMU-007 FROM SERVICE — Safety critical
   Wheel flange wear exceeds EN 14363 limits. Do not operate above 40km/h pending inspection.

2. HVAC Emergency Repair — Priority 1
   Isolate HVAC compressor. Evacuate refrigerant circuit. Protect passengers from thermal non-compliance.

3. Traction Motor Inspection — Priority 2
   Conduct insulation resistance test on all traction motors. Megger test minimum 100M-ohm at 500V DC.

## SHORT-TERM PLAN (7-30 days)

Week 1: Wheel re-profiling on CNC wheel lathe. Target flange thickness 28mm, tread profile P8.
Week 1: HVAC compressor replacement — source Alstom SA Part No. HV-3821-ZA.
Week 2: Traction motor rewind or replacement — Unit 2 and Unit 4 priority.
Week 2: Brake hydraulic system flush and seal replacement — all 8 axle cylinders.
Week 3: Bogie crack inspection using magnetic particle testing (MPT).
Week 3: Door actuator replacement — Cars 1, 3, 5 confirmed faults.
Week 4: Full system integration test before return to service.

## PARTS AND MATERIALS REQUIRED

- HVAC Compressor (Alstom HV-3821-ZA) x2 — Lead time: 5 days — Est. R 84,000
- Traction Motor Rewind Kit x4 — Lead time: 7 days — Est. R 120,000
- Brake Hydraulic Seal Kit x8 — Lead time: 2 days — Est. R 18,400
- Door Actuator Assembly x6 — Lead time: 3 days — Est. R 54,000
- Wheel Re-profiling (lathe time) — Available at depot — Est. R 28,000

## OPERATIONAL RESTRICTIONS

- Maximum speed: 40km/h until wheel re-profiling complete
- No revenue service until HVAC restored (regulatory requirement)
- Reduced load factor: 60% passenger capacity until brake system certified

## COST-BENEFIT ANALYSIS

Cost of recommended maintenance: R 304,400
Cost of unplanned failure (service cancellation x14 days): R 1,240,000
Cost of derailment incident (regulatory, legal, infrastructure): R 12,000,000+
ROI of intervention: 307% — maintenance cost is 24% of failure scenario

## POST-MAINTENANCE KPI TARGETS

- Wheel:      58% -> 95% after re-profiling
- Brakes:     63% -> 90% after hydraulic service
- Traction:   72% -> 88% after motor service
- HVAC:       55% -> 95% after compressor replacement
- Doors:      61% -> 92% after actuator replacement
- Bogies:     59% -> 85% after MPT inspection and remediation
- Fleet Health: 61% -> 91% overall`,

    default: `## IMMEDIATE ACTIONS (0-72 hours)

1. Conduct visual inspection of lowest-health subsystems
   Focus on any subsystem below 70% health. Document findings in depot job card system.

2. Review active fault codes
   Clear any intermittent faults and monitor for recurrence within 24-hour period.

3. Check fluid levels and consumables
   Brake fluid, lubricants, and HVAC refrigerant levels to be verified at next depot stop.

## SHORT-TERM PLAN (7-30 days)

Schedule the following at next programmed maintenance slot:
- Full subsystem diagnostic scan using depot test equipment
- Brake pad thickness measurement on all axles
- Wheel profile gauge measurement — compare against P8 target profile
- Traction system insulation resistance test
- Door cycle count reset and actuator lubrication
- HVAC filter replacement and refrigerant pressure check

## PARTS AND MATERIALS REQUIRED

Parts requirements to be confirmed after diagnostic inspection. Pre-stage the following based on health scores:
- Brake pad sets (if below 75% health) — Est. R 24,000 per bogie
- HVAC filter sets — Est. R 3,200 per unit
- Door actuator lubricant kits — Est. R 1,800
- Wheel profile report (lathe assessment) — Est. R 8,000

## OPERATIONAL RESTRICTIONS

No operational restrictions required at current health levels. Monitor for any degradation below 65% threshold which would trigger speed restriction advisory.

## COST-BENEFIT ANALYSIS

Proactive maintenance investment: R 37,000 - R 120,000 depending on findings
Avoided unplanned failure cost: R 280,000 - R 800,000 per incident
Recommended action: Proceed with scheduled intervention at next maintenance window

## POST-MAINTENANCE KPI TARGETS

Target overall fleet health improvement of 8-12 percentage points following intervention. Individual subsystem targets to be set based on inspection findings.`,
  },

  fmea: {
    default: `FUNCTION: Maintain safe operational parameters within EN 50126 RAMS requirements

FAILURE MODE: Progressive subsystem degradation leading to unplanned service withdrawal

EFFECT: Revenue service cancellation, passenger disruption, regulatory non-compliance, potential safety incident

ROOT CAUSE: Deferred maintenance intervals combined with high-utilisation route assignment exceeding design duty cycle

SEVERITY (1-10): 8 — Major operational and safety consequence if failure occurs during revenue service

OCCURRENCE (1-10): 6 — Probable given current health trajectory and maintenance backlog

DETECTION (1-10): 3 — Multiple sensor channels and depot inspection protocols provide reasonable detection capability

RPN: 8 x 6 x 3 = 144 (HIGH RISK)

CURRENT CONTROLS:
- Onboard condition monitoring system (OCMS) with threshold alerts
- Scheduled depot inspection every 15,000km
- Lineside Hot Axle Box Detectors (HABD) on main corridor
- Driver daily defect reporting (DDR) procedure

RECOMMENDED ACTION:
Immediate: Reduce maintenance interval from 15,000km to 8,000km for this asset.
Short-term: Install additional vibration sensor on bogie frame to improve detection rating from D=3 to D=2.
Long-term: Enroll asset in AxionRail AI continuous monitoring programme to achieve predictive intervention before failure threshold.

RESPONSIBILITY: Senior Rolling Stock Engineer — Depot Engineering Manager sign-off required

TARGET DATE: 2026-05-15

ESTIMATED COST (ZAR): R 42,000 for interval reduction labour + R 18,500 for additional sensor installation = R 60,500 total
Avoided failure cost: R 340,000 - R 2,400,000 depending on failure mode severity`,
  },
};

function getMockResponse(mode, assetId) {
  const modeData = MOCK_RESPONSES[mode];
  if (!modeData) return MOCK_RESPONSES.fmea.default;
  return modeData[assetId] || modeData.default || MOCK_RESPONSES.fmea.default;
}

export default function AIAnalytics({ asset, setAsset }) {
  const [mode, setMode] = useState("predictive");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = () => {
    setLoading(true);
    setResult(null);
    // Simulate AI processing delay for realism
    setTimeout(() => {
      setResult(getMockResponse(mode, asset.id));
      setLoading(false);
    }, 2200);
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
        {/* Header bar */}
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
              AXIONRAIL AI ENGINE v2.4 -- {asset.id}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, color: "#4a6080", letterSpacing: 1 }}>
              MODEL: LSTM + XGBoost Ensemble
            </span>
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
                    letterSpacing: 0.8,
                    fontFamily: "inherit",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 22 }}>
          {/* Mode info */}
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
              "Predictive mode: Forecasts failure probability, RUL by subsystem, and sensor anomaly patterns using LSTM neural network."}
            {mode === "prescriptive" &&
              "Prescriptive mode: Generates prioritised maintenance actions, parts lists, operational restrictions, and ZAR cost-benefit analysis."}
            {mode === "fmea" &&
              "FMEA Generation: Synthesises a new Failure Mode and Effects Analysis entry for the highest-risk subsystem on this asset."}
          </div>

          {/* Asset summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["Asset", asset.id],
              ["Health", `${asset.health}%`],
              ["RUL", `${asset.rul} days`],
              ["Alerts", `${asset.alerts} active`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: "#0a1020",
                  borderRadius: 5,
                  padding: "8px 12px",
                }}
              >
                <div
                  style={{ fontSize: 8, color: "#4a6080", letterSpacing: 1 }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#00d4ff",
                    marginTop: 2,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
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
                Processing sensor telemetry, running degradation models,
                calculating failure probabilities...
              </div>
            </div>
          )}

          {result && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{ fontSize: 10, color: "#00e0a0", letterSpacing: 1 }}
                >
                  ANALYSIS COMPLETE -- {new Date().toLocaleTimeString()}
                </div>
                <div style={{ fontSize: 9, color: "#4a6080" }}>
                  Confidence: 91.4% | Model: LSTM v2.4 + XGBoost
                </div>
              </div>
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
                  maxHeight: 500,
                  overflowY: "auto",
                }}
              >
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
