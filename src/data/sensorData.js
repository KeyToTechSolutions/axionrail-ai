// src/data/SensorData.js
export const SENSORS_EMU = [
  {
    key: "vibration",
    label: "Axle Vibration",
    unit: "mm/s2",
    nom: [0, 4.5],
    warn: 5.5,
    crit: 7.0,
    color: "#00d4ff",
  },
  {
    key: "motorTemp",
    label: "Motor Temp",
    unit: "C",
    nom: [40, 75],
    warn: 85,
    crit: 95,
    color: "#f59e0b",
  },
  {
    key: "current",
    label: "Traction Current",
    unit: "A",
    nom: [200, 420],
    warn: 480,
    crit: 520,
    color: "#00e0a0",
  },
  {
    key: "brakePress",
    label: "Brake Pressure",
    unit: "bar",
    nom: [4.5, 6.5],
    warn: 3.8,
    crit: 3.0,
    color: "#f43f5e",
  },
  {
    key: "pantV",
    label: "Pantograph Voltage",
    unit: "V",
    nom: [1450, 1650],
    warn: 1400,
    crit: 1350,
    color: "#a78bfa",
  },
  {
    key: "doorCyc",
    label: "Door Cycles/hr",
    unit: "/hr",
    nom: [0, 80],
    warn: 95,
    crit: 110,
    color: "#fbbf24",
  },
];

export const SENSORS_DL = [
  {
    key: "vibration",
    label: "Engine Vibration",
    unit: "mm/s2",
    nom: [0, 6],
    warn: 7.5,
    crit: 9.0,
    color: "#00d4ff",
  },
  {
    key: "coolantT",
    label: "Coolant Temp",
    unit: "C",
    nom: [75, 90],
    warn: 95,
    crit: 105,
    color: "#f59e0b",
  },
  {
    key: "oilPress",
    label: "Oil Pressure",
    unit: "bar",
    nom: [3.5, 6],
    warn: 3.0,
    crit: 2.5,
    color: "#00e0a0",
  },
  {
    key: "brakePress",
    label: "Brake Pressure",
    unit: "bar",
    nom: [4.5, 6.5],
    warn: 3.8,
    crit: 3.0,
    color: "#f43f5e",
  },
  {
    key: "exhaustT",
    label: "Exhaust Temp",
    unit: "C",
    nom: [350, 520],
    warn: 560,
    crit: 600,
    color: "#fbbf24",
  },
  {
    key: "fuelFlow",
    label: "Fuel Flow",
    unit: "L/hr",
    nom: [60, 150],
    warn: 165,
    crit: 180,
    color: "#a78bfa",
  },
];

export function getSensors(asset) {
  return asset && (asset.type === "DL" || asset.type === "DEMU")
    ? SENSORS_DL
    : SENSORS_EMU;
}

export function genVal(sensor, health) {
  const deg = (100 - health) / 100;
  const [lo, hi] = sensor.nom;
  const rng = hi - lo;
  const noise = (Math.random() - 0.5) * rng * 0.07;
  const inc = [
    "vibration",
    "motorTemp",
    "coolantT",
    "exhaustT",
    "fuelFlow",
    "doorCyc",
  ].includes(sensor.key);
  const base = inc
    ? lo + rng * 0.45 + deg * (sensor.warn - lo) * 1.1
    : hi - rng * 0.3 - deg * (hi - sensor.warn) * 1.1;
  return Math.round((base + noise) * 10) / 10;
}

export function sensorStatus(value, sensor) {
  const inc = [
    "vibration",
    "motorTemp",
    "coolantT",
    "exhaustT",
    "fuelFlow",
    "doorCyc",
  ].includes(sensor.key);
  if (inc) {
    if (value >= sensor.crit) return "crit";
    if (value >= sensor.warn) return "warn";
    return "ok";
  }
  if (value <= sensor.crit) return "crit";
  if (value <= sensor.warn) return "warn";
  return "ok";
}
