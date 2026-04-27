// src/data/sensorData.js
// AxionRail AI — Real-Time IoT Sensor Data Simulation Engine

// Sensor channel definitions per asset type
export const SENSOR_CHANNELS = {
  "Electric Multiple Unit": [
    {
      key: "vibration",
      label: "Axle Vibration",
      unit: "mm/s²",
      nominal: [0, 4.5],
      warn: 5.5,
      crit: 7.0,
      color: "#00d4ff",
    },
    {
      key: "temperature",
      label: "Motor Temp",
      unit: "°C",
      nominal: [40, 75],
      warn: 85,
      crit: 95,
      color: "#ff9d00",
    },
    {
      key: "current",
      label: "Traction Current",
      unit: "A",
      nominal: [200, 420],
      warn: 480,
      crit: 520,
      color: "#00e5a0",
    },
    {
      key: "brakePress",
      label: "Brake Pressure",
      unit: "bar",
      nominal: [4.5, 6.5],
      warn: 3.8,
      crit: 3.0,
      color: "#ff3d5a",
    },
    {
      key: "doorCycles",
      label: "Door Cycle Count",
      unit: "/hr",
      nominal: [0, 80],
      warn: 95,
      crit: 110,
      color: "#c084fc",
    },
    {
      key: "pantVoltage",
      label: "Pantograph Voltage",
      unit: "V",
      nominal: [1450, 1650],
      warn: 1400,
      crit: 1350,
      color: "#fbbf24",
    },
    {
      key: "speed",
      label: "Operational Speed",
      unit: "km/h",
      nominal: [0, 120],
      warn: 130,
      crit: 140,
      color: "#38bdf8",
    },
  ],
  "Diesel Locomotive": [
    {
      key: "vibration",
      label: "Engine Vibration",
      unit: "mm/s²",
      nominal: [0, 6.0],
      warn: 7.5,
      crit: 9.0,
      color: "#00d4ff",
    },
    {
      key: "temperature",
      label: "Coolant Temp",
      unit: "°C",
      nominal: [75, 90],
      warn: 95,
      crit: 105,
      color: "#ff9d00",
    },
    {
      key: "oilPress",
      label: "Engine Oil Pressure",
      unit: "bar",
      nominal: [3.5, 6.0],
      warn: 3.0,
      crit: 2.5,
      color: "#00e5a0",
    },
    {
      key: "brakePress",
      label: "Brake Pressure",
      unit: "bar",
      nominal: [4.5, 6.5],
      warn: 3.8,
      crit: 3.0,
      color: "#ff3d5a",
    },
    {
      key: "fuelFlow",
      label: "Fuel Flow Rate",
      unit: "L/hr",
      nominal: [60, 150],
      warn: 165,
      crit: 180,
      color: "#c084fc",
    },
    {
      key: "exhaustTemp",
      label: "Exhaust Temperature",
      unit: "°C",
      nominal: [350, 520],
      warn: 560,
      crit: 600,
      color: "#fbbf24",
    },
    {
      key: "speed",
      label: "Operational Speed",
      unit: "km/h",
      nominal: [0, 100],
      warn: 110,
      crit: 120,
      color: "#38bdf8",
    },
  ],
  "Diesel-Electric Multiple Unit": [
    {
      key: "vibration",
      label: "Engine Vibration",
      unit: "mm/s²",
      nominal: [0, 5.5],
      warn: 7.0,
      crit: 8.5,
      color: "#00d4ff",
    },
    {
      key: "temperature",
      label: "Coolant Temp",
      unit: "°C",
      nominal: [75, 92],
      warn: 98,
      crit: 108,
      color: "#ff9d00",
    },
    {
      key: "current",
      label: "Traction Current",
      unit: "A",
      nominal: [150, 350],
      warn: 400,
      crit: 440,
      color: "#00e5a0",
    },
    {
      key: "brakePress",
      label: "Brake Pressure",
      unit: "bar",
      nominal: [4.5, 6.5],
      warn: 3.8,
      crit: 3.0,
      color: "#ff3d5a",
    },
    {
      key: "fuelFlow",
      label: "Fuel Flow Rate",
      unit: "L/hr",
      nominal: [50, 120],
      warn: 140,
      crit: 160,
      color: "#c084fc",
    },
    {
      key: "exhaustTemp",
      label: "Exhaust Temperature",
      unit: "°C",
      nominal: [300, 480],
      warn: 520,
      crit: 560,
      color: "#fbbf24",
    },
    {
      key: "speed",
      label: "Operational Speed",
      unit: "km/h",
      nominal: [0, 110],
      warn: 120,
      crit: 130,
      color: "#38bdf8",
    },
  ],
};

// Generate realistic sensor readings influenced by asset health
export function generateSensorReading(channel, assetHealth, assetType) {
  const degradation = (100 - assetHealth) / 100; // 0=perfect, 1=failed
  const channels =
    SENSOR_CHANNELS[assetType] || SENSOR_CHANNELS["Electric Multiple Unit"];
  const ch = channels.find((c) => c.key === channel.key);
  if (!ch) return channel.nominal?.[0] ?? 0;

  const [lo, hi] = ch.nominal;
  const range = hi - lo;
  const noise = (Math.random() - 0.5) * range * 0.08;
  let base;

  // Degrade toward warning/critical thresholds based on health
  if (
    [
      "vibration",
      "temperature",
      "exhaustTemp",
      "fuelFlow",
      "doorCycles",
    ].includes(ch.key)
  ) {
    // These increase with degradation
    base =
      lo + range * 0.5 + degradation * (ch.warn - (lo + range * 0.5)) * 1.2;
  } else if (["brakePress", "oilPress", "pantVoltage"].includes(ch.key)) {
    // These decrease with degradation
    base = hi - range * 0.3 - degradation * (hi - range * 0.3 - ch.warn) * 1.2;
  } else {
    base = lo + range * (0.4 + Math.random() * 0.3);
  }

  return Math.round((base + noise) * 10) / 10;
}

// Generate 60-point time-series (last 60 seconds / minutes)
export function generateTimeSeries(
  channel,
  assetHealth,
  assetType,
  points = 60,
) {
  const series = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    series.push({
      time: new Date(now - i * 5000).toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      value: generateSensorReading(channel, assetHealth, assetType),
    });
  }
  return series;
}

// Get status colour for a sensor value
export function getSensorStatus(value, channel) {
  if (!channel) return "nominal";
  const [lo, hi] = channel.nominal;
  const increasing = [
    "vibration",
    "temperature",
    "exhaustTemp",
    "fuelFlow",
    "doorCycles",
  ].includes(channel.key);
  if (increasing) {
    if (value >= channel.crit) return "critical";
    if (value >= channel.warn) return "warning";
    return "nominal";
  } else {
    if (value <= channel.crit) return "critical";
    if (value <= channel.warn) return "warning";
    return "nominal";
  }
}
