// src/hooks/useSensorStream.js
// AxionRail AI — Real-Time IoT Sensor Stream Hook

import { useState, useEffect, useRef, useCallback } from "react";
import {
  SENSOR_CHANNELS,
  generateSensorReading,
  generateTimeSeries,
  getSensorStatus,
} from "../data/sensorData";

const STREAM_INTERVAL_MS = 2000; // 2 second polling
const HISTORY_LENGTH = 60; // 60 data points

export function useSensorStream(asset) {
  const [sensorHistory, setSensorHistory] = useState({});
  const [latestReadings, setLatestReadings] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef(null);

  const getChannels = useCallback(() => {
    return (
      SENSOR_CHANNELS[asset?.type] || SENSOR_CHANNELS["Electric Multiple Unit"]
    );
  }, [asset?.type]);

  // Initialise with seed historical data
  const initHistory = useCallback(() => {
    if (!asset) return;
    const channels = getChannels();
    const history = {};
    const latest = {};
    channels.forEach((ch) => {
      history[ch.key] = generateTimeSeries(
        ch,
        asset.health,
        asset.type,
        HISTORY_LENGTH,
      );
      latest[ch.key] = history[ch.key][history[ch.key].length - 1]?.value;
    });
    setSensorHistory(history);
    setLatestReadings(latest);
  }, [asset, getChannels]);

  // Tick: append new reading, drop oldest
  const tick = useCallback(() => {
    if (!asset) return;
    const channels = getChannels();
    const newAlerts = [];
    setSensorHistory((prev) => {
      const updated = { ...prev };
      const newLatest = {};
      channels.forEach((ch) => {
        const val = generateSensorReading(ch, asset.health, asset.type);
        newLatest[ch.key] = val;
        const status = getSensorStatus(val, ch);
        if (status !== "nominal") {
          newAlerts.push({
            key: ch.key,
            label: ch.label,
            value: val,
            unit: ch.unit,
            status,
            time: new Date().toLocaleTimeString(),
          });
        }
        const point = {
          time: new Date().toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          value: val,
        };
        const history = prev[ch.key]
          ? [...prev[ch.key].slice(-(HISTORY_LENGTH - 1)), point]
          : [point];
        updated[ch.key] = history;
      });
      setLatestReadings(newLatest);
      return updated;
    });
    if (newAlerts.length)
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
  }, [asset, getChannels]);

  const startStream = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    initHistory();
    setIsStreaming(true);
    intervalRef.current = setInterval(tick, STREAM_INTERVAL_MS);
  }, [initHistory, tick]);

  const stopStream = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    initHistory();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [asset?.id]);

  return {
    sensorHistory,
    latestReadings,
    alerts,
    isStreaming,
    startStream,
    stopStream,
    channels: getChannels(),
  };
}

// src/hooks/useAIAnalysis.js
// AxionRail AI — Anthropic API Claude Integration Hook

export function useAIAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAnalysis = async (asset, mode = "predictive", sensorData = null) => {
    setLoading(true);
    setResult(null);
    setError(null);

    const sensorContext = sensorData
      ? `\nLive Sensor Readings:\n${Object.entries(sensorData)
          .map(([k, v]) => `  ${k}: ${v}`)
          .join("\n")}`
      : "";

    const prompts = {
      predictive: `You are AxionRail AI — an expert railway predictive analytics engine. Analyze this rail asset and provide structured PREDICTIVE analytics.

Asset ID: ${asset.id}
Type: ${asset.type}
Route: ${asset.route}
Fleet Health Score: ${asset.health}%
Remaining Useful Life: ${asset.rul} days
Odometer: ${asset.km?.toLocaleString()} km
Age: ${asset.age} years
Active Alerts: ${asset.alerts}
Known Faults: ${asset.faults?.join("; ") || "None"}
Subsystem Health: ${Object.entries(asset.subsystems || {})
        .filter(([k]) => k !== null)
        .map(([k, v]) => `${k}=${v}%`)
        .join(", ")}${sensorContext}

Provide structured predictive analysis covering:
## FAILURE RISK ASSESSMENT
(List top 3 failure risks with probability % and predicted timeframe)

## FAILURE MODE ANALYSIS  
(Most probable failure modes, root causes, and leading indicators)

## REMAINING USEFUL LIFE PROJECTION
(RUL breakdown per subsystem with confidence intervals)

## SENSOR ANOMALY INTERPRETATION
(Explain what the current sensor readings indicate about asset condition)

## RISK PRIORITY MATRIX
(Critical / High / Medium / Low items with recommended watch intervals)

Be specific, technical, and data-driven. Provide actual percentages and timeframes.`,

      prescriptive: `You are AxionRail AI — an expert railway prescriptive maintenance planning engine. Provide PRESCRIPTIVE action plans for this asset.

Asset ID: ${asset.id}
Type: ${asset.type}
Route: ${asset.route}
Fleet Health Score: ${asset.health}%
Remaining Useful Life: ${asset.rul} days
Odometer: ${asset.km?.toLocaleString()} km
Age: ${asset.age} years
Active Alerts: ${asset.alerts}
Known Faults: ${asset.faults?.join("; ") || "None"}
Subsystem Health: ${Object.entries(asset.subsystems || {})
        .filter(([k]) => k !== null)
        .map(([k, v]) => `${k}=${v}%`)
        .join(", ")}${sensorContext}

Provide structured prescriptive recommendations covering:
## IMMEDIATE ACTIONS (0–72 hours)
(What must be done now — safety-critical items)

## SHORT-TERM MAINTENANCE PLAN (7–30 days)
(Scheduled interventions with specific work scope)

## PARTS & MATERIALS REQUIRED
(Components to order/stage with estimated lead times)

## OPERATIONAL RESTRICTIONS
(Route/speed/load restrictions to apply pending maintenance)

## COST–BENEFIT ANALYSIS
(Estimated cost of recommended maintenance vs cost of failure in ZAR)

## POST-MAINTENANCE KPI TARGETS
(Expected health scores per subsystem after intervention)

Be actionable, prioritised, and specific. Include ZAR cost estimates.`,

      fmea: `You are AxionRail AI — a reliability engineering expert. Generate an additional FMEA entry for the highest-risk failure mode on this asset.

Asset: ${asset.id} (${asset.type})
Critical subsystem: ${Object.entries(asset.subsystems || {}).sort(([, a], [, b]) => a - b)[0]?.[0]}
Health: ${Object.entries(asset.subsystems || {}).sort(([, a], [, b]) => a - b)[0]?.[1]}%
Known fault: ${asset.faults?.[0] || "No specific fault recorded"}

Generate ONE FMEA entry in this exact format:
FUNCTION: [what the subsystem does]
FAILURE MODE: [specific failure mode]  
EFFECT: [consequence on operation/safety]
CAUSE: [root cause]
SEVERITY (1-10): [number]
OCCURRENCE (1-10): [number]
DETECTION (1-10): [number]
RPN: [calculated]
CURRENT CONTROLS: [existing safeguards]
RECOMMENDED ACTION: [specific maintenance action]
RESPONSIBILITY: [role title]
TARGET DATE: [realistic date]`,
    };

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompts[mode] || prompts.predictive },
          ],
        }),
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || "No analysis returned.");
    } catch (e) {
      setError(
        "Failed to connect to AI engine. Please check network and retry.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, runAnalysis };
}
