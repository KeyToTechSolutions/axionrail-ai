import { useState, useEffect } from "react";

const CHECKS = [
  "IoT Telemetry Engine - Online",
  "Predictive ML Models - Loaded",
  "Prescriptive Analytics - Ready",
  "FMEA Database - Initialised",
  "AI Analysis Engine - Connected",
  "Fleet Registry - 12 Assets Loaded",
];

export default function SplashScreen({ onEnter }) {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    CHECKS.forEach((_, i) =>
      setTimeout(() => setStep((s) => s + 1), 300 + i * 400),
    );
    setTimeout(() => setReady(true), 300 + CHECKS.length * 400 + 200);
  }, []);

  return (
    <div
      style={{
        background: "#05080f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Syne:wght@800;900&display=swap');
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulseBig { 0%,100%{opacity:.12} 50%{opacity:.35} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 14px #00d4ff44} 50%{box-shadow:0 0 30px #00d4ff88} }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#182845 1px,transparent 1px),linear-gradient(90deg,#182845 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle,#00d4ff08,transparent 70%)",
          animation: "pulseBig 4s ease infinite",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 700,
          padding: "0 24px",
          animation: "fadeIn .8s ease",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg,#00d4ff,#0044cc)",
              borderRadius: 20,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              marginBottom: 20,
              animation: "float 4s ease infinite, glow 3s ease infinite",
            }}
          >
            *
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#00d4ff",
              letterSpacing: 6,
              fontFamily: "'Syne',sans-serif",
              lineHeight: 1,
              textShadow: "0 0 60px #00d4ff66",
            }}
          >
            AXIONRAIL AI
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4a6080",
              letterSpacing: 4,
              marginTop: 10,
            }}
          >
            PREDICTIVE AND PRESCRIPTIVE FLEET ANALYTICS PLATFORM
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#0090bb",
              letterSpacing: 2,
              marginTop: 6,
            }}
          >
            KeyToTechSolutions - github.com/KeyToTechSolutions/axionrail-ai
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#00d4ff12",
            border: "1px solid #00d4ff44",
            borderRadius: 8,
            padding: "10px 24px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#00d4ff",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            TENDER DEMO - REF: AXR-TENDER-2026-001
          </span>
        </div>

        <div
          style={{
            background: "#0a1020",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: "20px 28px",
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#4a6080",
              letterSpacing: 2,
              marginBottom: 14,
            }}
          >
            SYSTEM INITIALISATION
          </div>
          {CHECKS.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 9,
                opacity: step > i ? 1 : 0.2,
                transition: `opacity .4s ${i * 0.08}s`,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: step > i ? "#00e0a0" : "#4a6080",
                  minWidth: 14,
                }}
              >
                {step > i ? "OK" : "..."}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: step > i ? "#b8cce8" : "#4a6080",
                }}
              >
                {c}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onEnter}
          disabled={!ready}
          style={{
            background: ready
              ? "linear-gradient(135deg,#00d4ff,#0090bb)"
              : "transparent",
            color: ready ? "#05080f" : "#4a6080",
            border: ready ? "none" : "1px solid #182845",
            borderRadius: 10,
            padding: "16px 52px",
            fontSize: 13,
            fontWeight: 800,
            cursor: ready ? "pointer" : "default",
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "inherit",
            boxShadow: ready ? "0 0 32px #00d4ff66" : "none",
            transition: "all .6s",
          }}
        >
          {ready ? "ENTER PLATFORM" : "INITIALISING..."}
        </button>

        <div
          style={{
            marginTop: 20,
            fontSize: 9,
            color: "#4a6080",
            letterSpacing: 1.5,
          }}
        >
          Copyright 2026 KeyToTechSolutions -
          github.com/KeyToTechSolutions/axionrail-ai
        </div>
      </div>
    </div>
  );
}
