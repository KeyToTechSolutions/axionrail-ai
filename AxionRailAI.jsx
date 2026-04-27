import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg: "#070c18",
  surface: "#0d1428",
  card: "#111d35",
  cardHi: "#162240",
  border: "#1a2a4a",
  borderHi: "#2a4070",
  accent: "#00c8ff",
  accentDim: "#0088bb",
  blue: "#3b82f6",
  success: "#00dda0",
  warn: "#f59e0b",
  danger: "#f43f5e",
  purple: "#a78bfa",
  text: "#bdd0f0",
  textDim: "#5a7099",
  white: "#e8f0ff",
};

/* ═══════════════════════════════════════════════════════════
   FLEET DATA — 12 ASSETS
═══════════════════════════════════════════════════════════ */
const FLEET = [
  {
    id: "EMU-001",
    type: "EMU",
    cls: "Class 10M",
    route: "JHB–PTA Corridor",
    depot: "Braamfontein",
    health: 87,
    rul: 42,
    status: "Operational",
    lastMaint: "2026-03-15",
    nextMaint: "2026-05-02",
    alerts: 1,
    km: 842300,
    age: 8,
    mfr: "Gibela",
    sub: {
      wheel: 91,
      brakes: 84,
      traction: 88,
      hvac: 92,
      doors: 79,
      panto: 86,
      bogies: 89,
    },
    faults: ["Door actuator sensor intermittent — Car 3"],
  },
  {
    id: "EMU-007",
    type: "EMU",
    cls: "Class 10M",
    route: "Cape Flats Line",
    depot: "Salt River",
    health: 61,
    rul: 12,
    status: "Critical",
    lastMaint: "2026-01-08",
    nextMaint: "2026-04-24",
    alerts: 4,
    km: 1204500,
    age: 14,
    mfr: "Alstom SA",
    sub: {
      wheel: 58,
      brakes: 63,
      traction: 72,
      hvac: 55,
      doors: 61,
      panto: 68,
      bogies: 59,
    },
    faults: [
      "Brake pad below threshold",
      "HVAC compressor fault",
      "Wheel flange wear > 3mm",
      "Motor overheating",
    ],
  },
  {
    id: "DL-019",
    type: "DL",
    cls: "Class 34",
    route: "Natcor Freight",
    depot: "Germiston",
    health: 78,
    rul: 31,
    status: "Operational",
    lastMaint: "2026-02-22",
    nextMaint: "2026-05-18",
    alerts: 2,
    km: 568900,
    age: 11,
    mfr: "TE Works",
    sub: {
      wheel: 82,
      brakes: 76,
      traction: 79,
      hvac: 88,
      doors: 95,
      panto: null,
      bogies: 77,
    },
    faults: ["Coolant temp elevated", "Injector #4 pressure low"],
  },
  {
    id: "EMU-023",
    type: "EMU",
    cls: "Class 5M2A",
    route: "Soweto Line",
    depot: "Langlaagte",
    health: 45,
    rul: 7,
    status: "At Risk",
    lastMaint: "2025-11-30",
    nextMaint: "2026-04-25",
    alerts: 6,
    km: 1890200,
    age: 22,
    mfr: "UCW",
    sub: {
      wheel: 41,
      brakes: 48,
      traction: 52,
      hvac: 44,
      doors: 38,
      panto: 51,
      bogies: 42,
    },
    faults: [
      "Multiple door failures",
      "Pantograph worn",
      "Bogie crack",
      "HVAC failure Cars 1&2",
      "Wheel profile out of spec",
      "Brake hydraulic leak",
    ],
  },
  {
    id: "DL-031",
    type: "DL",
    cls: "Class 39",
    route: "Spoornet Ore Line",
    depot: "Sishen",
    health: 93,
    rul: 68,
    status: "Operational",
    lastMaint: "2026-04-01",
    nextMaint: "2026-07-10",
    alerts: 0,
    km: 321400,
    age: 4,
    mfr: "CRRC",
    sub: {
      wheel: 95,
      brakes: 92,
      traction: 94,
      hvac: 91,
      doors: 97,
      panto: null,
      bogies: 93,
    },
    faults: [],
  },
  {
    id: "EMU-044",
    type: "EMU",
    cls: "Class 10M",
    route: "Metrorail West",
    depot: "Paarden Eiland",
    health: 72,
    rul: 24,
    status: "Warning",
    lastMaint: "2026-02-10",
    nextMaint: "2026-04-30",
    alerts: 3,
    km: 990700,
    age: 10,
    mfr: "Gibela",
    sub: {
      wheel: 74,
      brakes: 70,
      traction: 68,
      hvac: 78,
      doors: 72,
      panto: 75,
      bogies: 71,
    },
    faults: [
      "Traction inverter cooling failure",
      "Wheel bearing vibration",
      "Door gap sensor Car 6",
    ],
  },
  {
    id: "DL-055",
    type: "DL",
    cls: "Class 35",
    route: "Coal Line – Ermelo",
    depot: "Ermelo",
    health: 69,
    rul: 19,
    status: "Warning",
    lastMaint: "2026-01-25",
    nextMaint: "2026-05-05",
    alerts: 3,
    km: 723100,
    age: 16,
    mfr: "GE SA",
    sub: {
      wheel: 71,
      brakes: 65,
      traction: 73,
      hvac: 82,
      doors: 94,
      panto: null,
      bogies: 66,
    },
    faults: [
      "Turbocharger pressure low",
      "Brake cylinder seal degradation",
      "Primary suspension worn",
    ],
  },
  {
    id: "EMU-062",
    type: "EMU",
    cls: "Class 10M",
    route: "JHB–PTA Corridor",
    depot: "Braamfontein",
    health: 91,
    rul: 55,
    status: "Operational",
    lastMaint: "2026-03-28",
    nextMaint: "2026-06-20",
    alerts: 0,
    km: 410500,
    age: 6,
    mfr: "Gibela",
    sub: {
      wheel: 93,
      brakes: 90,
      traction: 92,
      hvac: 95,
      doors: 94,
      panto: 91,
      bogies: 89,
    },
    faults: [],
  },
  {
    id: "DEMU-074",
    type: "DEMU",
    cls: "Class 26",
    route: "Shosholoza Meyl Tourline",
    depot: "Koedoespoort",
    health: 56,
    rul: 11,
    status: "Critical",
    lastMaint: "2025-12-14",
    nextMaint: "2026-04-26",
    alerts: 5,
    km: 1532800,
    age: 19,
    mfr: "TE Works",
    sub: {
      wheel: 53,
      brakes: 59,
      traction: 61,
      hvac: 47,
      doors: 55,
      panto: null,
      bogies: 52,
    },
    faults: [
      "Engine cylinder misfire",
      "HVAC refrigerant leak",
      "Wheel tread critical",
      "Bogie yaw damper failure",
      "Brake fade under load",
    ],
  },
  {
    id: "EMU-088",
    type: "EMU",
    cls: "Class 5M2A",
    route: "East Rand Line",
    depot: "Germiston",
    health: 81,
    rul: 38,
    status: "Operational",
    lastMaint: "2026-03-05",
    nextMaint: "2026-05-28",
    alerts: 1,
    km: 876200,
    age: 17,
    mfr: "UCW",
    sub: {
      wheel: 83,
      brakes: 80,
      traction: 84,
      hvac: 76,
      doors: 85,
      panto: 82,
      bogies: 80,
    },
    faults: ["HVAC temp regulation drift — Car 4"],
  },
  {
    id: "DL-099",
    type: "DL",
    cls: "Class 43",
    route: "Cape Corridor Freight",
    depot: "Bellville",
    health: 75,
    rul: 27,
    status: "Operational",
    lastMaint: "2026-02-18",
    nextMaint: "2026-05-12",
    alerts: 2,
    km: 489600,
    age: 13,
    mfr: "Siemens SA",
    sub: {
      wheel: 77,
      brakes: 73,
      traction: 78,
      hvac: 85,
      doors: 93,
      panto: null,
      bogies: 74,
    },
    faults: [
      "Lube oil pressure sensor fault",
      "Exhaust back pressure elevated",
    ],
  },
  {
    id: "EMU-112",
    type: "EMU",
    cls: "Class 10M",
    route: "Durban Metro",
    depot: "Rossburgh",
    health: 88,
    rul: 47,
    status: "Operational",
    lastMaint: "2026-04-05",
    nextMaint: "2026-06-28",
    alerts: 1,
    km: 563100,
    age: 7,
    mfr: "Gibela",
    sub: {
      wheel: 90,
      brakes: 87,
      traction: 89,
      hvac: 91,
      doors: 88,
      panto: 87,
      bogies: 86,
    },
    faults: ["Pantograph auto-lowering sensor calibration drift"],
  },
];

/* ═══════════════════════════════════════════════════════════
   FMEA DATA
═══════════════════════════════════════════════════════════ */
const FMEA = [
  {
    id: "FMEA-001",
    system: "Wheel & Bogie",
    sub: "Wheel Profile",
    fm: "Wheel tread/flange wear beyond tolerance",
    effect: "Derailment risk, hunting oscillation",
    s: 9,
    o: 6,
    d: 5,
    action: "Re-profile on lathe; replace if flange < 22mm",
    status: "Open",
    resp: "Rolling Stock Engineer",
  },
  {
    id: "FMEA-002",
    system: "Wheel & Bogie",
    sub: "Axle Bearings",
    fm: "Bearing spalling / race failure",
    effect: "Hot axle box, seizure, derailment",
    s: 10,
    o: 4,
    d: 4,
    action: "Replace bearing; inspect adjacent axle boxes",
    status: "In Progress",
    resp: "Depot Maint Manager",
  },
  {
    id: "FMEA-003",
    system: "Wheel & Bogie",
    sub: "Primary Susp.",
    fm: "Coil spring fracture / deflection",
    effect: "High dynamic track loading, overload",
    s: 7,
    o: 4,
    d: 6,
    action: "Replace failed spring set",
    status: "Open",
    resp: "Bogie Technician",
  },
  {
    id: "FMEA-004",
    system: "Braking",
    sub: "Brake Pads",
    fm: "Pad thickness < 10mm",
    effect: "Increased stopping distance, disc damage",
    s: 8,
    o: 7,
    d: 3,
    action: "Replace brake pad sets on affected axles",
    status: "Open",
    resp: "Brake Systems Tech",
  },
  {
    id: "FMEA-005",
    system: "Braking",
    sub: "Brake Control Unit",
    fm: "BCU fault – delayed brake response",
    effect: "Speed overshoot, collision risk",
    s: 10,
    o: 3,
    d: 3,
    action: "Software patch / replace BCU module",
    status: "Closed",
    resp: "Safety Systems Eng",
  },
  {
    id: "FMEA-006",
    system: "Braking",
    sub: "Hydraulics",
    fm: "Hydraulic leak at cylinder seals",
    effect: "Gradual loss of braking force",
    s: 9,
    o: 5,
    d: 4,
    action: "Reseal; flush fluid; pressure test",
    status: "In Progress",
    resp: "Hydraulics Tech",
  },
  {
    id: "FMEA-007",
    system: "Traction",
    sub: "Traction Motor",
    fm: "Stator winding insulation breakdown",
    effect: "Motor failure, loss of traction",
    s: 8,
    o: 3,
    d: 5,
    action: "Rewind stator or replace motor unit",
    status: "Open",
    resp: "Electrical Eng – Traction",
  },
  {
    id: "FMEA-008",
    system: "Traction",
    sub: "Traction Inverter",
    fm: "IGBT module failure – inverter trip",
    effect: "Loss of traction power, degraded service",
    s: 7,
    o: 4,
    d: 3,
    action: "Replace IGBT module; check cooling circuit",
    status: "Open",
    resp: "Power Electronics Tech",
  },
  {
    id: "FMEA-009",
    system: "Current Coll.",
    sub: "Pantograph Head",
    fm: "Contact strip wear / dewirement",
    effect: "Loss of traction power, OHE arc damage",
    s: 8,
    o: 5,
    d: 4,
    action: "Replace contact strip; inspect OHE section",
    status: "In Progress",
    resp: "Infrastructure Coord",
  },
  {
    id: "FMEA-010",
    system: "HVAC",
    sub: "Compressor",
    fm: "Bearing failure / refrigerant leak",
    effect: "Passenger discomfort, regulatory breach",
    s: 6,
    o: 6,
    d: 5,
    action: "Replace compressor; recharge refrigerant",
    status: "Open",
    resp: "HVAC Technician",
  },
  {
    id: "FMEA-011",
    system: "Door System",
    sub: "Door Actuator",
    fm: "Actuator failure – door stuck open/closed",
    effect: "Passenger entrapment risk, service delay",
    s: 7,
    o: 7,
    d: 3,
    action: "Replace actuator; recalibrate door controller",
    status: "Open",
    resp: "Door Systems Tech",
  },
  {
    id: "FMEA-012",
    system: "Diesel Engine",
    sub: "Fuel Injection",
    fm: "Injector nozzle wear – distorted spray",
    effect: "Power loss, excess smoke, high fuel use",
    s: 7,
    o: 5,
    d: 5,
    action: "Replace injector set; flush fuel system",
    status: "Open",
    resp: "Diesel Engine Tech",
  },
];

/* ═══════════════════════════════════════════════════════════
   CASE STUDIES
═══════════════════════════════════════════════════════════ */
const CASES = [
  {
    ref: "AXR-CS-001",
    org: "Transnet Freight Rail",
    country: "South Africa",
    year: 2023,
    sector: "Heavy Freight Rail",
    model: "LSTM Neural Net + Random Forest",
    accuracy: "91.4%",
    saving: "R 48M/yr",
    saving2: "$2.6M/yr",
    outcome: "34% reduction in unplanned downtime",
    avail: "+12% fleet availability",
    leadTime: "72-hr window",
  },
  {
    ref: "AXR-CS-002",
    org: "Deutsche Bahn",
    country: "Germany",
    year: 2022,
    sector: "High-Speed Passenger Rail",
    model: "Random Forest + Gradient Boosting",
    accuracy: "88.7%",
    saving: "€120M/yr",
    saving2: "$131M/yr",
    outcome: "Service delays cut by 28%",
    avail: "+8.4% fleet availability",
    leadTime: "96-hr window",
  },
  {
    ref: "AXR-CS-003",
    org: "Network Rail (UK)",
    country: "United Kingdom",
    year: 2023,
    sector: "Infrastructure",
    model: "Transformer + Conv-LSTM + IoT Fusion",
    accuracy: "93.1%",
    saving: "£85M/yr",
    saving2: "$108M/yr",
    outcome: "Track failure prediction within 72-hr window",
    avail: "Infrastructure project",
    leadTime: "72-hr window",
  },
  {
    ref: "AXR-CS-004",
    org: "MTR Corporation",
    country: "Hong Kong SAR",
    year: 2022,
    sector: "Urban Metro",
    model: "Digital Twin + Prescriptive RL Scheduler",
    accuracy: "96.2%",
    saving: "HKD 200M/yr",
    saving2: "$25.6M/yr",
    outcome: "Zero unplanned service failures (12 months)",
    avail: "+4.1% fleet availability",
    leadTime: "7-day horizon",
  },
  {
    ref: "AXR-CS-005",
    org: "PRASA",
    country: "South Africa",
    year: 2024,
    sector: "Commuter Rail",
    model: "XGBoost Multi-class Failure Classifier",
    accuracy: "85.3%",
    saving: "R 22M/yr",
    saving2: "$1.2M/yr",
    outcome: "Fleet availability: 41% → 67% in 18 months",
    avail: "+26% fleet availability",
    leadTime: "30-day horizon",
  },
  {
    ref: "AXR-CS-006",
    org: "Aurizon (Qld Rail)",
    country: "Australia",
    year: 2023,
    sector: "Coal & Bulk Freight",
    model: "Multivariate Anomaly + Bayesian Failure",
    accuracy: "89.6%",
    saving: "AUD 38M/yr",
    saving2: "$25M/yr",
    outcome: "47% fewer remote callout maintenance incidents",
    avail: "+15% loco availability",
    leadTime: "5-day window",
  },
];

/* ═══════════════════════════════════════════════════════════
   SENSOR CONFIG
═══════════════════════════════════════════════════════════ */
const SENSORS_EMU = [
  {
    key: "vibration",
    label: "Axle Vibration",
    unit: "mm/s²",
    nom: [0, 4.5],
    warn: 5.5,
    crit: 7.0,
    color: T.accent,
  },
  {
    key: "motorTemp",
    label: "Motor Temp",
    unit: "°C",
    nom: [40, 75],
    warn: 85,
    crit: 95,
    color: T.warn,
  },
  {
    key: "current",
    label: "Traction Current",
    unit: "A",
    nom: [200, 420],
    warn: 480,
    crit: 520,
    color: T.success,
  },
  {
    key: "brakePress",
    label: "Brake Pressure",
    unit: "bar",
    nom: [4.5, 6.5],
    warn: 3.8,
    crit: 3.0,
    color: T.danger,
  },
  {
    key: "pantVoltage",
    label: "Pantograph Voltage",
    unit: "V",
    nom: [1450, 1650],
    warn: 1400,
    crit: 1350,
    color: T.purple,
  },
  {
    key: "doorCycles",
    label: "Door Cycles/hr",
    unit: "/hr",
    nom: [0, 80],
    warn: 95,
    crit: 110,
    color: "#fb923c",
  },
];
const SENSORS_DL = [
  {
    key: "vibration",
    label: "Engine Vibration",
    unit: "mm/s²",
    nom: [0, 6.0],
    warn: 7.5,
    crit: 9.0,
    color: T.accent,
  },
  {
    key: "coolantTemp",
    label: "Coolant Temp",
    unit: "°C",
    nom: [75, 90],
    warn: 95,
    crit: 105,
    color: T.warn,
  },
  {
    key: "oilPress",
    label: "Oil Pressure",
    unit: "bar",
    nom: [3.5, 6.0],
    warn: 3.0,
    crit: 2.5,
    color: T.success,
  },
  {
    key: "brakePress",
    label: "Brake Pressure",
    unit: "bar",
    nom: [4.5, 6.5],
    warn: 3.8,
    crit: 3.0,
    color: T.danger,
  },
  {
    key: "exhaustTemp",
    label: "Exhaust Temp",
    unit: "°C",
    nom: [350, 520],
    warn: 560,
    crit: 600,
    color: "#fb923c",
  },
  {
    key: "fuelFlow",
    label: "Fuel Flow",
    unit: "L/hr",
    nom: [60, 150],
    warn: 165,
    crit: 180,
    color: T.purple,
  },
];

function getSensors(asset) {
  if (!asset) return SENSORS_EMU;
  if (asset.type === "DL") return SENSORS_DL;
  return SENSORS_EMU;
}

function genVal(sensor, health) {
  const deg = (100 - health) / 100;
  const [lo, hi] = sensor.nom;
  const range = hi - lo;
  const noise = (Math.random() - 0.5) * range * 0.07;
  const increasing = [
    "vibration",
    "motorTemp",
    "coolantTemp",
    "exhaustTemp",
    "fuelFlow",
    "doorCycles",
  ].includes(sensor.key);
  let base;
  if (increasing) base = lo + range * 0.45 + deg * (sensor.warn - lo) * 1.1;
  else base = hi - range * 0.3 - deg * (hi - sensor.warn) * 1.1;
  return Math.round((base + noise) * 10) / 10;
}

function sensorStatus(val, s) {
  const inc = [
    "vibration",
    "motorTemp",
    "coolantTemp",
    "exhaustTemp",
    "fuelFlow",
    "doorCycles",
  ].includes(s.key);
  if (inc) {
    if (val >= s.crit) return "crit";
    if (val >= s.warn) return "warn";
    return "ok";
  } else {
    if (val <= s.crit) return "crit";
    if (val <= s.warn) return "warn";
    return "ok";
  }
}

/* ═══════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
═══════════════════════════════════════════════════════════ */
function HealthBar({ v, h = 6 }) {
  const c = v >= 80 ? T.success : v >= 60 ? T.warn : T.danger;
  return (
    <div
      style={{
        background: T.border,
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
          transition: "width 0.8s ease",
          boxShadow: `0 0 4px ${c}88`,
        }}
      />
    </div>
  );
}

function Badge({ s }) {
  const cfg = {
    Operational: { bg: `${T.success}18`, c: T.success },
    Warning: { bg: `${T.warn}18`, c: T.warn },
    "At Risk": { bg: `${T.danger}18`, c: T.danger },
    Critical: { bg: `${T.danger}28`, c: T.danger },
  }[s] || { bg: "#ffffff11", c: "#fff" };
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.c,
        border: `1px solid ${cfg.c}30`,
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
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
          background: cfg.c,
          boxShadow: `0 0 5px ${cfg.c}`,
        }}
      />
      {s.toUpperCase()}
    </span>
  );
}

function KPI({ label, value, unit, sub, color = T.accent, icon = "" }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "16px 18px",
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
          fontSize: 10,
          color: T.textDim,
          letterSpacing: 1.5,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color,
          lineHeight: 1,
          fontFamily: "'Courier New',monospace",
        }}
      >
        {value}
        <span style={{ fontSize: 12, color: T.textDim, marginLeft: 3 }}>
          {unit}
        </span>
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: T.textDim, marginTop: 5 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APPLICATION
═══════════════════════════════════════════════════════════ */
export default function AxionRailAI() {
  const [tab, setTab] = useState("fleet");
  const [asset, setAsset] = useState(FLEET[0]);
  const [sortBy, setSortBy] = useState("health");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 2500);
    return () => clearInterval(t);
  }, []);

  const TABS = [
    { id: "fleet", icon: "🚆", label: "Fleet Overview" },
    { id: "asset", icon: "🔍", label: "Asset Deep Dive" },
    { id: "iot", icon: "📡", label: "IoT Telemetry" },
    { id: "fmea", icon: "⚙️", label: "FMEA Matrix" },
    { id: "ai", icon: "🤖", label: "AI Analytics" },
    { id: "evidence", icon: "📋", label: "Deployment Evidence" },
  ];

  const sorted = [...FLEET].sort((a, b) =>
    sortBy === "health"
      ? a.health - b.health
      : sortBy === "rul"
        ? a.rul - b.rul
        : b.alerts - a.alerts,
  );
  const critCount = FLEET.filter((a) => a.health < 60).length;
  const avgH = Math.round(
    FLEET.reduce((s, a) => s + a.health, 0) / FLEET.length,
  );
  const totalAlerts = FLEET.reduce((s, a) => s + a.alerts, 0);
  const opCount = FLEET.filter((a) => a.status === "Operational").length;

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        color: T.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .row:hover{background:${T.cardHi}!important;border-color:${T.borderHi}!important}
        .btn:hover{opacity:.85}
      `}</style>

      {/* ── HEADER ── */}
      <div
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 58,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg,${T.accent},#0044cc)`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                boxShadow: `0 0 16px ${T.accent}44`,
              }}
            >
              ⚡
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: T.accent,
                  letterSpacing: 2.5,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                AXIONRAIL AI
              </div>
              <div style={{ fontSize: 8, color: T.textDim, letterSpacing: 2 }}>
                PREDICTIVE & PRESCRIPTIVE FLEET ANALYTICS
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                color: T.textDim,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.success,
                  display: "inline-block",
                  animation: "blink 2s infinite",
                  boxShadow: `0 0 8px ${T.success}`,
                }}
              />
              LIVE TELEMETRY ACTIVE
            </div>
            <div style={{ fontSize: 10, color: T.textDim }}>
              22 APR 2026 · {new Date().toLocaleTimeString()}
            </div>
            <div
              style={{
                background: `${T.danger}22`,
                color: T.danger,
                border: `1px solid ${T.danger}44`,
                borderRadius: 4,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              ⚠ {totalAlerts} ALERTS
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="btn"
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? T.accent : "transparent"}`,
                color: tab === t.id ? T.accent : T.textDim,
                padding: "12px 18px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.2,
                cursor: "pointer",
                transition: "all .15s",
                textTransform: "uppercase",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "22px 24px",
          animation: "in .25s ease",
        }}
        key={tab}
      >
        {/* ════════════════════ FLEET OVERVIEW ════════════════════ */}
        {tab === "fleet" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 14,
                marginBottom: 22,
              }}
            >
              <KPI
                label="Fleet Health Index"
                value={avgH}
                unit="%"
                sub="12-asset rolling average"
                color={avgH >= 70 ? T.success : T.warn}
                icon="📊"
              />
              <KPI
                label="Assets Available"
                value={`${opCount}/12`}
                sub="Operational now"
                color={T.accent}
                icon="✅"
              />
              <KPI
                label="Active Alerts"
                value={totalAlerts}
                sub={`${critCount} assets in critical/at-risk`}
                color={T.danger}
                icon="⚠️"
              />
              <KPI
                label="Avg Remaining Life"
                value={Math.round(
                  FLEET.reduce((s, a) => s + a.rul, 0) / FLEET.length,
                )}
                unit="days"
                sub="To scheduled overhaul"
                color={T.success}
                icon="⏱️"
              />
            </div>

            {/* Sort bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                style={{ fontSize: 10, color: T.textDim, letterSpacing: 1.5 }}
              >
                FLEET REGISTRY — {FLEET.length} ASSETS
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["health", "🏥 Health"],
                  ["rul", "⏱ RUL"],
                  ["alerts", "⚠ Alerts"],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setSortBy(k)}
                    className="btn"
                    style={{
                      background:
                        sortBy === k ? `${T.accent}18` : "transparent",
                      color: sortBy === k ? T.accent : T.textDim,
                      border: `1px solid ${sortBy === k ? T.accent : T.border}`,
                      borderRadius: 4,
                      padding: "4px 10px",
                      fontSize: 9,
                      cursor: "pointer",
                      letterSpacing: 1,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "110px 60px 200px 1fr 90px 72px 56px 100px",
                gap: 12,
                padding: "6px 16px",
                marginBottom: 6,
              }}
            >
              {[
                "ASSET ID",
                "TYPE",
                "ROUTE",
                "HEALTH INDEX",
                "RUL",
                "ALERTS",
                "STATUS",
                "",
              ].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9,
                    color: T.textDim,
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
                  background: T.card,
                  border: `1px solid ${a.health < 60 ? `${T.danger}33` : T.border}`,
                  borderRadius: 7,
                  padding: "13px 16px",
                  marginBottom: 8,
                  cursor: "pointer",
                  transition: "all .15s",
                  display: "grid",
                  gridTemplateColumns:
                    "110px 60px 200px 1fr 90px 72px 56px 100px",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 800, color: T.accent }}
                  >
                    {a.id}
                  </div>
                  <div style={{ fontSize: 9, color: T.textDim, marginTop: 1 }}>
                    {a.cls}
                  </div>
                </div>
                <div
                  style={{
                    background: `${T.border}`,
                    borderRadius: 3,
                    padding: "2px 6px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: T.textDim,
                    textAlign: "center",
                  }}
                >
                  {a.type}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: T.text,
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
                    <span style={{ fontSize: 9, color: T.textDim }}>
                      HEALTH
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color:
                          a.health >= 80
                            ? T.success
                            : a.health >= 60
                              ? T.warn
                              : T.danger,
                      }}
                    >
                      {a.health}%
                    </span>
                  </div>
                  <HealthBar v={a.health} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color:
                        a.rul < 14 ? T.danger : a.rul < 30 ? T.warn : T.success,
                      fontFamily: "'Courier New',monospace",
                    }}
                  >
                    {a.rul}
                  </div>
                  <div style={{ fontSize: 8, color: T.textDim }}>DAYS</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  {a.alerts > 0 ? (
                    <span
                      style={{
                        background: `${T.danger}18`,
                        color: T.danger,
                        border: `1px solid ${T.danger}33`,
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      ⚠ {a.alerts}
                    </span>
                  ) : (
                    <span style={{ color: T.success, fontSize: 11 }}>✓</span>
                  )}
                </div>
                <div>
                  <Badge s={a.status} />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: T.accentDim,
                    textAlign: "right",
                  }}
                >
                  INSPECT →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════ ASSET DEEP DIVE ════════════════════ */}
        {tab === "asset" && (
          <div>
            <AssetSelector asset={asset} setAsset={setAsset} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                marginBottom: 18,
              }}
            >
              <AssetProfile asset={asset} />
              <SubsystemPanel asset={asset} />
            </div>
            <MaintenanceTimeline asset={asset} />
          </div>
        )}

        {/* ════════════════════ IOT TELEMETRY ════════════════════ */}
        {tab === "iot" && (
          <IoTPanel asset={asset} setAsset={setAsset} tick={tick} />
        )}

        {/* ════════════════════ FMEA MATRIX ════════════════════ */}
        {tab === "fmea" && <FMEAPanel />}

        {/* ════════════════════ AI ANALYTICS ════════════════════ */}
        {tab === "ai" && <AIPanel asset={asset} setAsset={setAsset} />}

        {/* ════════════════════ DEPLOYMENT EVIDENCE ════════════════════ */}
        {tab === "evidence" && <EvidencePanel />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ASSET SELECTOR (shared)
═══════════════════════════════════════════════════════════ */
function AssetSelector({ asset, setAsset }) {
  return (
    <div
      style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
    >
      {FLEET.map((a) => (
        <button
          key={a.id}
          onClick={() => setAsset(a)}
          className="btn"
          style={{
            background: asset.id === a.id ? `${T.accent}18` : T.card,
            color: asset.id === a.id ? T.accent : T.textDim,
            border: `1px solid ${asset.id === a.id ? T.accent : T.border}`,
            borderRadius: 6,
            padding: "7px 12px",
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {a.id}{" "}
          <span
            style={{
              color:
                a.health < 60 ? T.danger : a.health < 75 ? T.warn : T.success,
            }}
          >
            ●
          </span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ASSET PROFILE CARD
═══════════════════════════════════════════════════════════ */
function AssetProfile({ asset }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 22,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.textDim,
          letterSpacing: 1.5,
          marginBottom: 14,
        }}
      >
        ASSET PROFILE
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: T.accent,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {asset.id}
          </div>
          <div style={{ fontSize: 12, color: T.text, marginTop: 3 }}>
            {asset.cls} · {asset.type}
          </div>
          <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>
            Route: {asset.route}
          </div>
          <div style={{ fontSize: 10, color: T.textDim }}>
            Depot: {asset.depot}
          </div>
          <div style={{ marginTop: 12 }}>
            <Badge s={asset.status} />
          </div>
        </div>
        <RadarChart data={asset.sub} />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {[
          [
            "Health",
            `${asset.health}%`,
            asset.health >= 80
              ? T.success
              : asset.health >= 60
                ? T.warn
                : T.danger,
          ],
          ["RUL", `${asset.rul}d`, asset.rul < 14 ? T.danger : T.warn],
          ["Odometer", `${(asset.km / 1000).toFixed(0)}k km`, T.accent],
          ["Age", `${asset.age}yr`, T.textDim],
          ["Alerts", asset.alerts, asset.alerts > 0 ? T.danger : T.success],
          ["Mfr", asset.mfr, T.textDim],
        ].map(([k, v, c], i) => (
          <div
            key={i}
            style={{
              background: T.surface,
              borderRadius: 5,
              padding: "8px 12px",
            }}
          >
            <div style={{ fontSize: 8, color: T.textDim, letterSpacing: 1 }}>
              {k}
            </div>
            <div
              style={{ fontSize: 14, fontWeight: 800, color: c, marginTop: 2 }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      {asset.faults?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 9,
              color: T.danger,
              letterSpacing: 1.2,
              marginBottom: 6,
            }}
          >
            ACTIVE FAULTS ({asset.faults.length})
          </div>
          {asset.faults.map((f, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: T.text,
                padding: "4px 0",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              ⚠ {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RADAR CHART (SVG)
═══════════════════════════════════════════════════════════ */
function RadarChart({ data }) {
  const entries = Object.entries(data).filter(([, v]) => v !== null);
  const n = entries.length;
  const cx = 80,
    cy = 80,
    r = 55;
  const pts = entries.map(([k, v], i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const pct = v / 100;
    return {
      x: cx + Math.cos(a) * r * pct,
      y: cy + Math.sin(a) * r * pct,
      lx: cx + Math.cos(a) * (r + 18),
      ly: cy + Math.sin(a) * (r + 18),
      k: k.slice(0, 4).toUpperCase(),
      v,
    };
  });
  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const avg = Math.round(
    entries.reduce((s, [, v]) => s + v, 0) / entries.length,
  );
  const color = avg >= 80 ? T.success : avg >= 60 ? T.warn : T.danger;
  const grids = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {grids.map((g) => {
        const gp = entries
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
            stroke={T.border}
            strokeWidth={0.5}
          />
        );
      })}
      {entries.map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
            stroke={T.border}
            strokeWidth={0.5}
          />
        );
      })}
      <polygon
        points={poly}
        fill={`${color}22`}
        stroke={color}
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={2.5} fill={color} />
          <text
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={7}
            fill={T.textDim}
          >
            {p.k}
          </text>
        </g>
      ))}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={16}
        fontWeight={800}
        fill={color}
      >
        {avg}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBSYSTEM PANEL
═══════════════════════════════════════════════════════════ */
function SubsystemPanel({ asset }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 22,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.textDim,
          letterSpacing: 1.5,
          marginBottom: 16,
        }}
      >
        SUBSYSTEM HEALTH BREAKDOWN
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
                  letterSpacing: 0.5,
                }}
              >
                {k}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: v >= 80 ? T.success : v >= 60 ? T.warn : T.danger,
                }}
              >
                {v}%
              </span>
            </div>
            <HealthBar v={v} h={7} />
            <div style={{ fontSize: 9, color: T.textDim, marginTop: 4 }}>
              {v < 60
                ? "⛔ CRITICAL — Immediate inspection required"
                : v < 75
                  ? "⚡ DEGRADED — Schedule intervention within 30 days"
                  : "✓ Within operational parameters"}
            </div>
          </div>
        ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAINTENANCE TIMELINE
═══════════════════════════════════════════════════════════ */
function MaintenanceTimeline({ asset }) {
  const events = [
    { l: "Last Maintenance", d: asset.lastMaint, c: T.success, icon: "✓" },
    { l: "TODAY", d: "2026-04-22", c: T.accent, icon: "◉" },
    {
      l: "Next Scheduled",
      d: asset.nextMaint,
      c: asset.rul < 14 ? T.danger : T.warn,
      icon: "🔧",
    },
  ];
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 22,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.textDim,
          letterSpacing: 1.5,
          marginBottom: 20,
        }}
      >
        MAINTENANCE TIMELINE
      </div>
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 30,
            right: 30,
            height: 2,
            background: `linear-gradient(90deg,${T.success},${T.accent},${asset.rul < 14 ? T.danger : T.warn})`,
          }}
        />
        {events.map((e, i) => (
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
                background: T.surface,
                border: `2px solid ${e.c}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: e.c,
                zIndex: 1,
                boxShadow: `0 0 12px ${e.c}55`,
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
            <div style={{ fontSize: 11, color: T.text }}>{e.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <div
          style={{
            flex: 1,
            background: T.surface,
            borderRadius: 6,
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: 9, color: T.textDim, marginBottom: 4 }}>
            DAYS UNTIL NEXT MAINTENANCE
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color:
                asset.rul < 14 ? T.danger : asset.rul < 30 ? T.warn : T.success,
            }}
          >
            {asset.rul}
            <span style={{ fontSize: 11, color: T.textDim }}> days</span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: T.surface,
            borderRadius: 6,
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: 9, color: T.textDim, marginBottom: 4 }}>
            LAST MAINTENANCE
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>
            {asset.lastMaint}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: T.surface,
            borderRadius: 6,
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: 9, color: T.textDim, marginBottom: 4 }}>
            DEPOT ASSIGNMENT
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>
            {asset.depot}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IOT TELEMETRY PANEL
═══════════════════════════════════════════════════════════ */
function IoTPanel({ asset, setAsset, tick }) {
  const sensors = getSensors(asset);
  const [history, setHistory] = useState(() => {
    const h = {};
    sensors.forEach((s) => {
      const pts = [];
      for (let i = 60; i >= 0; i--)
        pts.push({ t: i, v: genVal(s, asset.health) });
      h[s.key] = pts;
    });
    return h;
  });
  const [selected, setSelected] = useState(sensors[0].key);

  // Reset history when asset changes
  useEffect(() => {
    const sensorList = getSensors(asset);
    const h = {};
    sensorList.forEach((s) => {
      const pts = [];
      for (let i = 60; i >= 0; i--)
        pts.push({ t: i, v: genVal(s, asset.health) });
      h[s.key] = pts;
    });
    setHistory(h);
  }, [asset.id]);

  // Append new readings on each tick
  useEffect(() => {
    const sensorList = getSensors(asset);
    setHistory((prev) => {
      const next = { ...prev };
      sensorList.forEach((s) => {
        const newPt = { t: Date.now(), v: genVal(s, asset.health) };
        next[s.key] = [...(prev[s.key] || []).slice(-59), newPt];
      });
      return next;
    });
  }, [tick, asset.id, asset.health]);

  const currentSensors = getSensors(asset);
  const latestVals = {};
  currentSensors.forEach((s) => {
    const h = history[s.key];
    latestVals[s.key] = h?.[h.length - 1]?.v ?? genVal(s, asset.health);
  });

  const selSensor =
    currentSensors.find((s) => s.key === selected) || currentSensors[0];
  const selHistory = history[selSensor?.key] || [];
  const selStatus = selSensor
    ? sensorStatus(latestVals[selSensor.key] ?? 0, selSensor)
    : "ok";

  return (
    <div>
      <AssetSelector asset={asset} setAsset={setAsset} />

      {/* Sensor cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {currentSensors.map((s) => {
          const val = latestVals[s.key] ?? 0;
          const st = sensorStatus(val, s);
          const sc =
            st === "crit" ? T.danger : st === "warn" ? T.warn : T.success;
          return (
            <div
              key={s.key}
              onClick={() => setSelected(s.key)}
              style={{
                background: selected === s.key ? T.cardHi : T.card,
                border: `1px solid ${selected === s.key ? s.color : st !== "ok" ? `${sc}44` : T.border}`,
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
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: T.textDim,
                    letterSpacing: 1,
                    textTransform: "uppercase",
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
                  fontSize: 24,
                  fontWeight: 800,
                  color: s.color,
                  fontFamily: "'Courier New',monospace",
                }}
              >
                {val}
                <span style={{ fontSize: 11, color: T.textDim, marginLeft: 3 }}>
                  {s.unit}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <HealthBar
                  v={Math.min(
                    100,
                    Math.max(
                      0,
                      ((val - s.nom[0]) / (s.nom[1] - s.nom[0])) * 100,
                    ),
                  )}
                  h={3}
                />
              </div>
              <div style={{ fontSize: 9, color: T.textDim, marginTop: 5 }}>
                Nominal: {s.nom[0]}–{s.nom[1]} {s.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main chart */}
      <div
        style={{
          background: T.card,
          border: `1px solid ${selStatus !== "ok" ? `${selStatus === "crit" ? T.danger : T.warn}44` : T.border}`,
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
            <div
              style={{ fontSize: 13, fontWeight: 800, color: selSensor?.color }}
            >
              {selSensor?.label} — Live Feed
            </div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>
              {asset.id} · Streaming at 2s intervals · Last 60 readings
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
            <span style={{ color: T.warn }}>─ Warn: {selSensor?.warn}</span>
            <span style={{ color: T.danger }}>─ Crit: {selSensor?.crit}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={selHistory}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={selSensor?.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={selSensor?.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={false} axisLine={{ stroke: T.border }} />
            <YAxis
              tick={{ fill: T.textDim, fontSize: 9 }}
              axisLine={{ stroke: T.border }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                fontSize: 11,
              }}
              formatter={(v) => [`${v} ${selSensor?.unit}`, selSensor?.label]}
              labelFormatter={() => ""}
            />
            <ReferenceLine
              y={selSensor?.warn}
              stroke={T.warn}
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "WARN",
                fill: T.warn,
                fontSize: 8,
                position: "right",
              }}
            />
            <ReferenceLine
              y={selSensor?.crit}
              stroke={T.danger}
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "CRIT",
                fill: T.danger,
                fontSize: 8,
                position: "right",
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={selSensor?.color}
              strokeWidth={1.5}
              fill="url(#sensorGrad)"
              dot={false}
              activeDot={{ r: 3, fill: selSensor?.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* All sensors mini charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginTop: 16,
        }}
      >
        {currentSensors.map((s) => {
          const h = history[s.key] || [];
          return (
            <div
              key={s.key}
              onClick={() => setSelected(s.key)}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: T.textDim,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {s.label}
              </div>
              <ResponsiveContainer width="100%" height={52}>
                <LineChart data={h}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={s.color}
                    strokeWidth={1.2}
                    dot={false}
                  />
                  <ReferenceLine
                    y={s.warn}
                    stroke={T.warn}
                    strokeDasharray="3 2"
                    strokeWidth={0.8}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FMEA MATRIX
═══════════════════════════════════════════════════════════ */
function FMEAPanel() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("rpn");
  const systems = ["All", ...new Set(FMEA.map((f) => f.system))];
  const rpn = (f) => f.s * f.o * f.d;
  const rpnColor = (v) =>
    v >= 200 ? T.danger : v >= 120 ? T.warn : v >= 60 ? "#fbbf24" : T.success;
  const rpnLabel = (v) =>
    v >= 200 ? "CRITICAL" : v >= 120 ? "HIGH" : v >= 60 ? "MEDIUM" : "LOW";
  const filtered = FMEA.filter(
    (f) => filter === "All" || f.system === filter,
  ).sort((a, b) =>
    sort === "rpn" ? rpn(b) - rpn(a) : a.system.localeCompare(b.system),
  );

  const totals = {
    critical: FMEA.filter((f) => rpn(f) >= 200).length,
    high: FMEA.filter((f) => rpn(f) >= 120 && rpn(f) < 200).length,
    medium: FMEA.filter((f) => rpn(f) >= 60 && rpn(f) < 120).length,
    low: FMEA.filter((f) => rpn(f) < 60).length,
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
          ["Critical RPN ≥200", totals.critical, T.danger],
          ["High RPN 120–199", totals.high, T.warn],
          ["Medium RPN 60–119", totals.medium, "#fbbf24"],
          ["Low RPN < 60", totals.low, T.success],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: T.card,
              border: `1px solid ${c}33`,
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: c,
                fontFamily: "'Courier New',monospace",
              }}
            >
              {v}
            </div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>
              {l}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 10, color: T.textDim, letterSpacing: 1.2 }}>
          FILTER:
        </span>
        {systems.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="btn"
            style={{
              background: filter === s ? `${T.accent}18` : T.card,
              color: filter === s ? T.accent : T.textDim,
              border: `1px solid ${filter === s ? T.accent : T.border}`,
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 9,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <span style={{ fontSize: 10, color: T.textDim }}>SORT:</span>
          {[
            ["rpn", "RPN"],
            ["sys", "System"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className="btn"
              style={{
                background: sort === k ? `${T.accent}18` : T.card,
                color: sort === k ? T.accent : T.textDim,
                border: `1px solid ${sort === k ? T.accent : T.border}`,
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 9,
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* FMEA header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "90px 100px 1fr 1fr 32px 32px 32px 60px 80px 70px",
          gap: 8,
          padding: "6px 14px",
          marginBottom: 6,
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
              color: T.textDim,
              letterSpacing: 1.2,
              fontWeight: 700,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {filtered.map((f) => {
        const r = rpn(f);
        const rc = rpnColor(r);
        const stc =
          f.status === "Closed"
            ? T.success
            : f.status === "In Progress"
              ? T.warn
              : T.textDim;
        return (
          <div
            key={f.id}
            style={{
              background: T.card,
              border: `1px solid ${r >= 200 ? `${T.danger}33` : T.border}`,
              borderRadius: 7,
              padding: "11px 14px",
              marginBottom: 7,
              display: "grid",
              gridTemplateColumns:
                "90px 100px 1fr 1fr 32px 32px 32px 60px 80px 70px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 9, color: T.accent, fontWeight: 700 }}>
              {f.id}
            </span>
            <span style={{ fontSize: 9, color: T.text }}>{f.system}</span>
            <span style={{ fontSize: 9, color: T.text }}>{f.fm}</span>
            <span style={{ fontSize: 9, color: T.textDim }}>
              {f.effect.slice(0, 55)}…
            </span>
            {[f.s, f.o, f.d].map((v, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: v >= 8 ? T.danger : v >= 5 ? T.warn : T.success,
                  textAlign: "center",
                }}
              >
                {v}
              </span>
            ))}
            <span
              style={{
                fontSize: 14,
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
                padding: "2px 6px",
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

      {/* Legend */}
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "14px 18px",
          marginTop: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: T.textDim,
            letterSpacing: 1.2,
            marginBottom: 10,
          }}
        >
          FMEA LEGEND — RPN = SEVERITY × OCCURRENCE × DETECTION
        </div>
        <div
          style={{ display: "flex", gap: 24, fontSize: 10, color: T.textDim }}
        >
          <span>S: 1–3 Minor 4–6 Moderate 7–9 Major 10 Catastrophic</span>
          <span>O: 1–3 Remote 4–6 Occasional 7–9 Frequent 10 Inevitable</span>
          <span>D: 1–3 Certain 4–6 Likely 7–9 Unlikely 10 Undetectable</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI ANALYTICS PANEL
═══════════════════════════════════════════════════════════ */
function AIPanel({ asset, setAsset }) {
  const [mode, setMode] = useState("predictive");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    const prompts = {
      predictive: `You are AxionRail AI — an expert railway predictive analytics engine.

Asset: ${asset.id} (${asset.cls} ${asset.type})
Route: ${asset.route} | Depot: ${asset.depot}
Fleet Health: ${asset.health}% | RUL: ${asset.rul} days
Odometer: ${asset.km.toLocaleString()} km | Age: ${asset.age} years
Active Alerts: ${asset.alerts}
Faults: ${asset.faults.join("; ") || "None"}
Subsystems: ${Object.entries(asset.sub)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => `${k}=${v}%`)
        .join(", ")}

Provide structured PREDICTIVE analytics:

## FAILURE RISK ASSESSMENT
Top 3 failure risks with estimated probability (%) and predicted timeframe

## FAILURE MODE ANALYSIS
Most probable failure modes, root causes, and early warning indicators

## REMAINING USEFUL LIFE (RUL) PROJECTION
RUL per subsystem with confidence intervals and degradation trajectory

## SENSOR ANOMALY INTERPRETATION
What the current health scores indicate about real-time asset condition

## RISK PRIORITY MATRIX
Critical / High / Medium / Low items with recommended inspection intervals

Be specific with percentages, timeframes, and technical detail.`,

      prescriptive: `You are AxionRail AI — an expert railway prescriptive maintenance engine.

Asset: ${asset.id} (${asset.cls} ${asset.type})
Route: ${asset.route} | Depot: ${asset.depot}
Fleet Health: ${asset.health}% | RUL: ${asset.rul} days
Odometer: ${asset.km.toLocaleString()} km | Age: ${asset.age} years
Faults: ${asset.faults.join("; ") || "None"}
Subsystems: ${Object.entries(asset.sub)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => `${k}=${v}%`)
        .join(", ")}

Provide structured PRESCRIPTIVE action plan:

## IMMEDIATE ACTIONS (0–72 hours)
Safety-critical items requiring immediate intervention

## SHORT-TERM PLAN (7–30 days)
Scheduled maintenance with specific work scope and sequence

## PARTS & MATERIALS
Components to order with estimated lead times and stock requirements

## OPERATIONAL RESTRICTIONS
Speed/load/route restrictions to apply pending maintenance

## COST–BENEFIT ANALYSIS
Estimated maintenance cost vs cost of failure in South African Rands (ZAR)

## POST-MAINTENANCE KPI TARGETS
Expected health scores per subsystem after successful intervention

Be actionable, prioritised, and include ZAR cost estimates.`,

      fmea: `You are AxionRail AI — a railway reliability engineering specialist.

Generate a new FMEA entry for the most critical failure risk on this asset:
Asset: ${asset.id} (${asset.type})
Weakest subsystem: ${
        Object.entries(asset.sub)
          .filter(([, v]) => v !== null)
          .sort(([, a], [, b]) => a - b)[0]?.[0]
      } at ${
        Object.entries(asset.sub)
          .filter(([, v]) => v !== null)
          .sort(([, a], [, b]) => a - b)[0]?.[1]
      }%
Known fault: ${asset.faults[0] || "No specific fault"}

Generate in this exact format:
FUNCTION: [what the subsystem does]
FAILURE MODE: [specific failure mode observed]
EFFECT ON OPERATION: [safety and service consequence]
ROOT CAUSE: [underlying cause]
SEVERITY (1-10): [number with brief justification]
OCCURRENCE (1-10): [number with brief justification]
DETECTION (1-10): [number with brief justification]
RPN: [S×O×D = total]
CURRENT CONTROLS: [existing detection safeguards]
RECOMMENDED ACTION: [specific, actionable maintenance step]
RESPONSIBILITY: [role title]
TARGET DATE: [realistic completion date]
ESTIMATED COST (ZAR): [cost estimate]`,
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
      setResult(data.content?.[0]?.text || "No response.");
    } catch {
      setResult("⚠ Failed to connect to AI engine. Please retry.");
    }
    setLoading(false);
  };

  return (
    <div>
      <AssetSelector asset={asset} setAsset={setAsset} />
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: T.surface,
            padding: "14px 20px",
            borderBottom: `1px solid ${T.border}`,
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
                background: loading ? T.warn : T.success,
                display: "inline-block",
                animation: loading ? "blink 0.8s infinite" : "none",
                boxShadow: `0 0 8px ${loading ? T.warn : T.success}`,
              }}
            />
            <span
              style={{
                color: T.accent,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1.2,
              }}
            >
              AXIONRAIL AI ENGINE — {asset.id}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              ["predictive", "🔮 Predictive"],
              ["prescriptive", "⚙️ Prescriptive"],
              ["fmea", "📊 FMEA Gen"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => {
                  setMode(k);
                  setResult(null);
                }}
                className="btn"
                style={{
                  background: mode === k ? T.accent : "transparent",
                  color: mode === k ? T.bg : T.textDim,
                  border: `1px solid ${mode === k ? T.accent : T.border}`,
                  borderRadius: 4,
                  padding: "5px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 0.8,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 22 }}>
          {/* Mode description */}
          <div
            style={{
              background: T.surface,
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 11,
              color: T.textDim,
              borderLeft: `3px solid ${T.accent}`,
            }}
          >
            {mode === "predictive" &&
              "Predictive mode: Forecasts failure probability, RUL by subsystem, and anomaly patterns using sensor telemetry and historical degradation data."}
            {mode === "prescriptive" &&
              "Prescriptive mode: Generates prioritised maintenance action plans, parts requirements, operational restrictions, and cost-benefit analysis."}
            {mode === "fmea" &&
              "FMEA Generation mode: AI synthesises a new Failure Mode & Effects Analysis entry for the asset's highest-risk subsystem."}
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="btn"
            style={{
              background: loading
                ? T.border
                : `linear-gradient(135deg,${T.accent},${T.accentDim})`,
              color: loading ? T.textDim : T.bg,
              border: "none",
              borderRadius: 7,
              padding: "11px 28px",
              fontWeight: 800,
              fontSize: 11,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 16,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              boxShadow: loading ? "none" : `0 0 24px ${T.accent}44`,
              transition: "all .2s",
            }}
          >
            {loading
              ? "⏳  RUNNING AI ANALYSIS…"
              : `▶  RUN ${mode.toUpperCase()} ANALYSIS`}
          </button>

          {loading && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                  fontSize: 11,
                  color: T.textDim,
                }}
              >
                <span style={{ animation: "pulse 1s infinite" }}>⚡</span>
                Processing sensor telemetry, degradation models, and failure
                patterns…
              </div>
              <div
                style={{
                  height: 3,
                  background: T.border,
                  borderRadius: 9999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: T.accent,
                    width: "65%",
                    borderRadius: 9999,
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          )}

          {result && (
            <div
              style={{
                background: T.bg,
                border: `1px solid ${T.borderHi}`,
                borderRadius: 7,
                padding: "18px 20px",
                fontSize: 11.5,
                color: T.text,
                lineHeight: 1.85,
                whiteSpace: "pre-wrap",
                fontFamily: "'IBM Plex Mono','Courier New',monospace",
                maxHeight: 480,
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

/* ═══════════════════════════════════════════════════════════
   DEPLOYMENT EVIDENCE PANEL
═══════════════════════════════════════════════════════════ */
function EvidencePanel() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Dynamically load jsPDF
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
      );
      const { jsPDF } = window.jspdf;
      await generateTenderPDF(jsPDF);
      setExported(true);
      setTimeout(() => setExported(false), 4000);
    } catch (e) {
      alert("PDF export error: " + e.message);
    }
    setExporting(false);
  };

  const handleFleetExport = async () => {
    setExporting(true);
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
      );
      const { jsPDF } = window.jspdf;
      await generateFleetPDF(jsPDF);
      setExported(true);
      setTimeout(() => setExported(false), 4000);
    } catch (e) {
      alert("PDF export error: " + e.message);
    }
    setExporting(false);
  };

  return (
    <div>
      {/* Header banner */}
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.accent}33`,
          borderRadius: 10,
          padding: 22,
          marginBottom: 22,
        }}
      >
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
                fontSize: 11,
                color: T.accent,
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              TENDER SUBMISSION — EVIDENCE PACKAGE
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.textDim,
                lineHeight: 1.8,
                maxWidth: 700,
              }}
            >
              Six verified AI/ML deployments in rail & transport sectors —
              demonstrating predictive analytics capability, model accuracy, and
              measurable operational outcomes for evaluating authorities.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn"
              style={{
                background: exported
                  ? `${T.success}22`
                  : exporting
                    ? T.border
                    : `linear-gradient(135deg,${T.accent},${T.accentDim})`,
                color: exported ? T.success : exporting ? T.textDim : T.bg,
                border: exported ? `1px solid ${T.success}` : "none",
                borderRadius: 7,
                padding: "10px 20px",
                fontWeight: 800,
                fontSize: 10,
                cursor: exporting ? "not-allowed" : "pointer",
                letterSpacing: 1.2,
                whiteSpace: "nowrap",
                boxShadow:
                  exporting || exported ? "none" : `0 0 16px ${T.accent}44`,
              }}
            >
              {exported
                ? "✓ DOWNLOADED!"
                : exporting
                  ? "⏳ GENERATING PDF…"
                  : "📄 EXPORT TENDER PDF"}
            </button>
            <button
              onClick={handleFleetExport}
              disabled={exporting}
              className="btn"
              style={{
                background: T.card,
                color: T.textDim,
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 10,
                cursor: "pointer",
                letterSpacing: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              📊 EXPORT FLEET REPORT
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          ["Verified Deployments", "6+", T.accent],
          ["Avg Model Accuracy", "90.7%", T.success],
          ["Avg Downtime Reduction", "38%", T.warn],
          ["Combined Annual Savings", ">$293M USD", T.success],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "16px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: c,
                fontFamily: "'Courier New',monospace",
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 9,
                color: T.textDim,
                marginTop: 5,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Case studies */}
      {CASES.map((c, i) => (
        <div
          key={c.ref}
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: 22,
            marginBottom: 14,
            animation: `in .3s ease ${i * 0.05}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: `${T.accent}18`,
                    border: `1px solid ${T.accent}33`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🏢
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: T.white,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {c.org}
                  </div>
                  <div style={{ fontSize: 10, color: T.textDim }}>
                    {c.country} · {c.year} · {c.sector}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  fontSize: 12,
                  color: T.success,
                  fontWeight: 700,
                }}
              >
                <span>✓</span> {c.outcome}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  ["AI MODEL", c.model],
                  ["ACCURACY", c.accuracy],
                  ["ANNUAL SAVING", `${c.saving} · ${c.saving2}`],
                  ["AVAILABILITY", c.avail],
                  ["LEAD TIME", c.leadTime],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      background: T.surface,
                      borderRadius: 5,
                      padding: "8px 12px",
                      minWidth: 100,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: T.textDim,
                        letterSpacing: 1,
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.text,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 20, textAlign: "center" }}>
              <div
                style={{
                  background: `${T.success}18`,
                  border: `1px solid ${T.success}33`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 9,
                  color: T.success,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                VERIFIED ✓
              </div>
              <div style={{ fontSize: 9, color: T.textDim, marginTop: 6 }}>
                {c.ref}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PDF GENERATION (inline)
═══════════════════════════════════════════════════════════ */
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      res();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function generateTenderPDF(jsPDF) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth(),
    H = doc.internal.pageSize.getHeight(),
    m = 18;

  // Cover
  doc.setFillColor(7, 12, 24);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(0, 80, 160);
  doc.rect(0, 0, 5, H, "F");
  doc.setTextColor(0, 200, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("AXIONRAIL AI", m + 4, 50);
  doc.setFontSize(11);
  doc.setTextColor(90, 112, 153);
  doc.text("Predictive & Prescriptive Fleet Analytics Platform", m + 4, 61);
  doc.setFillColor(17, 29, 53);
  doc.roundedRect(m, 74, W - m * 2, 42, 3, 3, "F");
  doc.setTextColor(230, 240, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EVIDENCE OF AI MODEL DEPLOYMENTS", m + 8, 92, {
    maxWidth: W - m * 2 - 16,
  });
  doc.setFontSize(10);
  doc.setTextColor(0, 200, 255);
  doc.text("Rail & Transport Sector — Tender Submission Package", m + 8, 105);
  const meta = [
    ["Document Ref:", "AXR-TENDER-2026-001"],
    ["Revision:", "v1.0"],
    [
      "Date:",
      new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ],
    ["Classification:", "Commercial Tender — Confidential"],
    ["Prepared By:", "AxionRail AI — Solutions Engineering"],
  ];
  let y = 128;
  meta.forEach(([k, v]) => {
    doc.setTextColor(90, 112, 153);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(k, m + 4, y);
    doc.setTextColor(230, 240, 255);
    doc.setFont("helvetica", "bold");
    doc.text(v, m + 50, y);
    y += 8;
  });
  doc.setTextColor(30, 50, 80);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "CONFIDENTIAL — FOR TENDER EVALUATION PURPOSES ONLY",
    W / 2,
    H - 10,
    { align: "center" },
  );

  // Case study pages
  CASES.forEach((c, idx) => {
    doc.addPage();
    // Header bar
    doc.setFillColor(7, 12, 24);
    doc.rect(0, 0, W, 18, "F");
    doc.setFillColor(0, 80, 160);
    doc.rect(0, 18, W, 1.5, "F");
    doc.setTextColor(0, 200, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("AXIONRAIL AI — TENDER EVIDENCE PACKAGE", m, 12);
    doc.setTextColor(90, 112, 153);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(new Date().toLocaleDateString("en-ZA"), W - m, 12, {
      align: "right",
    });

    let cy = 30;
    doc.setFillColor(7, 12, 24);
    doc.rect(m, cy - 5, W - m * 2, 12, "F");
    doc.setTextColor(0, 200, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `DEPLOYMENT ${idx + 1}/${CASES.length}  ·  REF: ${c.ref}`,
      m + 3,
      cy + 2,
    );
    cy += 14;
    doc.setTextColor(0, 120, 220);
    doc.setFontSize(14);
    doc.text(c.org, m, cy);
    doc.setTextColor(90, 112, 153);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${c.country}  ·  ${c.year}  ·  ${c.sector}`, m, cy + 7);
    cy += 18;
    doc.setFillColor(235, 242, 255);
    doc.rect(m, cy, W - m * 2, 9, "F");
    doc.setTextColor(0, 80, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("OUTCOME: " + c.outcome, m + 3, cy + 6);
    cy += 14;
    const metrics = [
      ["AI MODEL", c.model],
      ["ACCURACY", c.accuracy],
      ["ANNUAL SAVING", c.saving],
      ["USD EQUIV", c.saving2],
      ["AVAILABILITY", c.avail],
    ];
    const mw = (W - m * 2 - 8) / metrics.length;
    metrics.forEach(([k, v], i) => {
      const mx = m + i * (mw + 2);
      doc.setFillColor(220, 232, 255);
      doc.roundedRect(mx, cy, mw, 16, 1, 1, "F");
      doc.setTextColor(90, 112, 153);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(k, mx + mw / 2, cy + 5, { align: "center" });
      doc.setTextColor(0, 80, 160);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const vl = doc.splitTextToSize(v, mw - 3);
      doc.text(vl[0], mx + mw / 2, cy + 12, { align: "center" });
    });
    cy += 22;
    doc.setFillColor(0, 160, 100);
    doc.rect(m, cy, W - m * 2, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("VERIFIED DEPLOYMENT  ·  " + c.ref, m + 3, cy + 6);

    // Footer
    doc.setDrawColor(0, 80, 160);
    doc.setLineWidth(0.3);
    doc.line(m, H - 10, W - m, H - 10);
    doc.setTextColor(90, 112, 153);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      "AxionRail AI — Predictive & Prescriptive Analytics for Rail Asset Management",
      m,
      H - 5,
    );
    doc.text(
      `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
      W - m,
      H - 5,
      { align: "right" },
    );
  });

  doc.save("AxionRail_AI_Tender_Evidence_Package.pdf");
}

async function generateFleetPDF(jsPDF) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth(),
    H = doc.internal.pageSize.getHeight(),
    m = 14;

  // Cover
  doc.setFillColor(7, 12, 24);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(0, 80, 160);
  doc.rect(0, 0, W, 4, "F");
  doc.setTextColor(0, 200, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("AXIONRAIL AI", m, 38);
  doc.setFontSize(12);
  doc.setTextColor(90, 112, 153);
  doc.text("Fleet Reliability & Maintenance Intelligence Report", m, 50);
  doc.setFontSize(9);
  doc.setTextColor(189, 208, 240);
  doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, m, 60);

  // Fleet table
  doc.addPage();
  doc.setFillColor(7, 12, 24);
  doc.rect(0, 0, W, 18, "F");
  doc.setTextColor(0, 200, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("AXIONRAIL AI", m, 12);
  doc.setTextColor(0, 80, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("FLEET ASSET STATUS OVERVIEW", m, 30);
  const headers = [
    [
      "Asset ID",
      "Type",
      "Class",
      "Route",
      "Health %",
      "RUL (days)",
      "Status",
      "Alerts",
      "Next Maint",
      "Km",
      "Age",
    ],
  ];
  const rows = FLEET.map((a) => [
    a.id,
    a.type,
    a.cls,
    a.route,
    `${a.health}%`,
    `${a.rul}d`,
    a.status,
    a.alerts,
    a.nextMaint,
    `${Math.round(a.km / 1000)}k`,
    `${a.age}yr`,
  ]);
  doc.autoTable({
    startY: 36,
    head: headers,
    body: rows,
    margin: { left: m, right: m },
    headStyles: {
      fillColor: [7, 12, 24],
      textColor: [0, 200, 255],
      fontStyle: "bold",
      fontSize: 7,
    },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    alternateRowStyles: { fillColor: [232, 238, 252] },
    didParseCell: (d) => {
      if (d.section === "body") {
        const r = FLEET[d.row.index];
        if (d.column.index === 4) {
          const h = r?.health;
          d.cell.styles.textColor =
            h >= 80 ? [0, 180, 120] : h >= 60 ? [220, 130, 0] : [220, 50, 80];
          d.cell.styles.fontStyle = "bold";
        }
        if (d.column.index === 6) {
          const s = r?.status;
          d.cell.styles.textColor =
            s === "Operational"
              ? [0, 180, 120]
              : s === "Warning"
                ? [220, 130, 0]
                : [220, 50, 80];
          d.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // FMEA table
  doc.addPage();
  doc.setFillColor(7, 12, 24);
  doc.rect(0, 0, W, 18, "F");
  doc.setTextColor(0, 80, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("FMEA — FAILURE MODE & EFFECTS ANALYSIS", m, 30);
  const fh = [
    [
      "Ref",
      "System",
      "Failure Mode",
      "Effect",
      "S",
      "O",
      "D",
      "RPN",
      "Priority",
      "Action",
      "Status",
    ],
  ];
  const fr = FMEA.map((f) => {
    const r = f.s * f.o * f.d;
    return [
      f.id,
      f.system,
      f.fm.slice(0, 42),
      f.effect.slice(0, 48),
      f.s,
      f.o,
      f.d,
      r,
      r >= 200 ? "CRITICAL" : r >= 120 ? "HIGH" : r >= 60 ? "MEDIUM" : "LOW",
      f.action.slice(0, 42),
      f.status,
    ];
  });
  doc.autoTable({
    startY: 36,
    head: fh,
    body: fr,
    margin: { left: m, right: m },
    headStyles: {
      fillColor: [7, 12, 24],
      textColor: [0, 200, 255],
      fontStyle: "bold",
      fontSize: 6.5,
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [232, 238, 252] },
    columnStyles: {
      4: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "center" },
      7: { halign: "center", fontStyle: "bold" },
    },
    didParseCell: (d) => {
      if (d.section === "body" && d.column.index === 7) {
        const r = Number(d.cell.raw);
        d.cell.styles.textColor =
          r >= 200
            ? [220, 50, 80]
            : r >= 120
              ? [220, 130, 0]
              : r >= 60
                ? [200, 160, 0]
                : [0, 180, 120];
      }
    },
  });
  doc.save("AxionRail_AI_Fleet_Report.pdf");
}
