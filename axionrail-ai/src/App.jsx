import { useState, useEffect } from "react";
import { FLEET } from "./data/FleetData.js";
import SplashScreen from "./components/Splashscreen.jsx";
import Header from "./components/Header.jsx";
import FleetOverview from "./components/FleetOverview.jsx";
import AssetDeepDive from "./components/AssetDeepDive.jsx";
import IoTTelemetry from "./components/IoTTelemetry.jsx";
import FMEAMatrix from "./components/FMEAMatrix.jsx";
import AIAnalytics from "./components/AIAnalytics.jsx";
import Evidence from "./components/Evidence.jsx";

const TABS = [
  { id: "fleet", label: "Fleet Overview" },
  { id: "asset", label: "Asset Deep Dive" },
  { id: "iot", label: "IoT Telemetry" },
  { id: "fmea", label: "FMEA Matrix" },
  { id: "ai", label: "AI Analytics" },
  { id: "evidence", label: "Deployment Evidence" },
];

export default function App() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("fleet");
  const [asset, setAsset] = useState(FLEET[0]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 2200);
    return () => clearInterval(t);
  }, []);

  if (splash) return <SplashScreen onEnter={() => setSplash(false)} />;

  const totalAlerts = FLEET.reduce((s, a) => s + a.alerts, 0);

  return (
    <div
      style={{
        background: "#05080f",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        color: "#b8cce8",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:#182845; border-radius:2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pulse  { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes glow   { 0%,100%{box-shadow:0 0 14px #00d4ff44} 50%{box-shadow:0 0 30px #00d4ff88} }
        .row:hover   { background:#142040 !important; border-color:#2a4878 !important; cursor:pointer }
        .nav-btn:hover { color:#00d4ff !important }
      `}</style>

      <Header totalAlerts={totalAlerts} />

      <nav
        style={{
          background: "#0a1020",
          borderBottom: "1px solid #182845",
          padding: "0 22px",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="nav-btn"
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? "#00d4ff" : "transparent"}`,
                color: tab === t.id ? "#00d4ff" : "#4a6080",
                padding: "11px 18px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.2,
                cursor: "pointer",
                transition: "all .15s",
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: 22,
          animation: "fadeUp .25s ease",
        }}
        key={tab}
      >
        {tab === "fleet" && (
          <FleetOverview asset={asset} setAsset={setAsset} setTab={setTab} />
        )}
        {tab === "asset" && <AssetDeepDive asset={asset} setAsset={setAsset} />}
        {tab === "iot" && (
          <IoTTelemetry asset={asset} setAsset={setAsset} tick={tick} />
        )}
        {tab === "fmea" && <FMEAMatrix />}
        {tab === "ai" && <AIAnalytics asset={asset} setAsset={setAsset} />}
        {tab === "evidence" && <Evidence />}
      </main>
    </div>
  );
}
