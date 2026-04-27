// src/data/fmeaData.js
// AxionRail AI — Failure Mode & Effects Analysis (FMEA) Database

export const FMEA_DATA = [
  // ── WHEEL & BOGIE SYSTEM ──
  {
    id: "FMEA-001",
    system: "Wheel & Bogie",
    subsystem: "Wheel Profile",
    function: "Maintain safe wheel-rail interface and guidance",
    failureMode: "Wheel tread wear / flange wear beyond tolerance",
    effect:
      "Derailment risk, increased rolling resistance, hunting oscillation at speed",
    cause:
      "Excessive mileage without re-profiling, poor lubrication, hard braking",
    severity: 9,
    occurrence: 6,
    detection: 5,
    controls: "Monthly profile gauging, automated ultrasonic scanning at depot",
    action:
      "Re-profiling on lathe, replace if below minimum flange thickness (22mm)",
    responsibility: "Rolling Stock Engineer",
    targetDate: "2026-05-10",
    status: "Open",
  },
  {
    id: "FMEA-002",
    system: "Wheel & Bogie",
    subsystem: "Axle Bearings",
    function: "Support axle rotation under load with minimal friction",
    failureMode: "Bearing spalling / race failure",
    effect: "Hot axle box, smoke emission, potential axle seizure, derailment",
    cause:
      "Contamination ingress, inadequate lubrication interval, overloading",
    severity: 10,
    occurrence: 4,
    detection: 4,
    controls: "Lineside hot axle box detectors (HABD), vibration monitoring",
    action: "Replace bearing assembly; inspect adjacent axle boxes",
    responsibility: "Depot Maintenance Manager",
    targetDate: "2026-04-30",
    status: "In Progress",
  },
  {
    id: "FMEA-003",
    system: "Wheel & Bogie",
    subsystem: "Primary Suspension",
    function: "Absorb vertical dynamic loads between axle and bogie frame",
    failureMode: "Coil spring fracture or progressive deflection",
    effect:
      "Increased dynamic track loading, passenger discomfort, secondary suspension overload",
    cause: "Fatigue cycling, corrosion, foreign object impact",
    severity: 7,
    occurrence: 4,
    detection: 6,
    controls: "Visual inspection at depot, bogie vibration signature analysis",
    action: "Replace failed spring set; inspect adjacent springs",
    responsibility: "Bogie Technician",
    targetDate: "2026-05-20",
    status: "Open",
  },

  // ── BRAKING SYSTEM ──
  {
    id: "FMEA-004",
    system: "Braking System",
    subsystem: "Brake Pads",
    function: "Generate controlled friction force to decelerate vehicle",
    failureMode: "Brake pad thickness below minimum (< 10mm)",
    effect: "Increased stopping distance, wheel damage, brake disc overheating",
    cause: "Normal wear, exceeding scheduled replacement interval",
    severity: 8,
    occurrence: 7,
    detection: 3,
    controls:
      "Automated pad thickness sensors, scheduled inspection every 15 000 km",
    action: "Replace brake pad sets on affected axles",
    responsibility: "Brake Systems Technician",
    targetDate: "2026-04-28",
    status: "Open",
  },
  {
    id: "FMEA-005",
    system: "Braking System",
    subsystem: "Brake Control Unit",
    function: "Electronically modulate brake application per ETCS/WSP demands",
    failureMode: "BCU software fault causing delayed brake response",
    effect: "Speed overshoot, station overrun, collision risk",
    cause: "Software bug, EMI interference, memory corruption",
    severity: 10,
    occurrence: 3,
    detection: 3,
    controls: "Redundant BCU architecture, self-diagnostic routines, test mode",
    action: "Software patch/rollback; replace BCU module",
    responsibility: "Systems Engineer – Safety",
    targetDate: "2026-05-01",
    status: "Closed",
  },
  {
    id: "FMEA-006",
    system: "Braking System",
    subsystem: "Brake Hydraulics",
    function: "Transmit hydraulic force to brake cylinders",
    failureMode: "Hydraulic fluid leak at cylinder seals",
    effect: "Gradual loss of braking force, potential complete brake failure",
    cause: "Seal ageing, thermal cycling, incorrect fluid specification",
    severity: 9,
    occurrence: 5,
    detection: 4,
    controls:
      "Fluid level sensor, pressure decay monitoring, inspection every 3 months",
    action: "Reseal cylinders; flush and replace fluid; pressure test",
    responsibility: "Hydraulics Technician",
    targetDate: "2026-05-08",
    status: "In Progress",
  },

  // ── TRACTION SYSTEM ──
  {
    id: "FMEA-007",
    system: "Traction System",
    subsystem: "Traction Motor",
    function: "Convert electrical energy to mechanical tractive effort",
    failureMode: "Stator winding insulation breakdown",
    effect: "Motor failure, loss of traction on affected bogie, service delay",
    cause: "Thermal overstress, moisture ingress, vibration fatigue",
    severity: 8,
    occurrence: 3,
    detection: 5,
    controls:
      "Insulation resistance testing every 6 months, motor temperature monitoring",
    action: "Rewind stator or replace motor unit; root cause investigation",
    responsibility: "Electrical Engineer – Traction",
    targetDate: "2026-06-01",
    status: "Open",
  },
  {
    id: "FMEA-008",
    system: "Traction System",
    subsystem: "Traction Inverter",
    function: "Convert DC link voltage to 3-phase AC for traction motors",
    failureMode: "IGBT module failure causing inverter trip",
    effect: "Loss of traction power on one bogie, service degraded mode",
    cause: "Overcurrent event, cooling failure, thermal cycling fatigue",
    severity: 7,
    occurrence: 4,
    detection: 3,
    controls:
      "Current overload protection, IGBT thermal sensors, gate driver fault detection",
    action: "Replace IGBT module; check cooling circuit; diagnostic readout",
    responsibility: "Power Electronics Technician",
    targetDate: "2026-05-15",
    status: "Open",
  },

  // ── PANTOGRAPH / CURRENT COLLECTION ──
  {
    id: "FMEA-009",
    system: "Current Collection",
    subsystem: "Pantograph Head",
    function: "Maintain continuous electrical contact with overhead catenary",
    failureMode: "Contact strip wear to minimum / dewirement",
    effect: "Loss of traction power, arc damage to OHE, service disruption",
    cause: "High mileage, stagger misalignment, catenary sag",
    severity: 8,
    occurrence: 5,
    detection: 4,
    controls:
      "Contact strip thickness gauge, auto-lowering on detection, SCADA monitoring",
    action: "Replace contact strip assembly; inspect OHE section for damage",
    responsibility: "Infrastructure & Rolling Stock Coordinator",
    targetDate: "2026-04-29",
    status: "In Progress",
  },

  // ── HVAC SYSTEM ──
  {
    id: "FMEA-010",
    system: "HVAC",
    subsystem: "Compressor",
    function: "Circulate refrigerant to maintain cabin temperature",
    failureMode: "Compressor bearing failure / refrigerant leak",
    effect:
      "Passenger discomfort, regulatory non-compliance (temp >26°C), service complaints",
    cause: "Bearing fatigue, refrigerant leak leading to liquid slugging",
    severity: 6,
    occurrence: 6,
    detection: 5,
    controls: "Refrigerant pressure transducers, discharge temperature sensors",
    action:
      "Replace compressor unit; recharge refrigerant; check for leak source",
    responsibility: "HVAC Technician",
    targetDate: "2026-05-25",
    status: "Open",
  },

  // ── DOOR SYSTEM ──
  {
    id: "FMEA-011",
    system: "Door System",
    subsystem: "Door Drive & Actuator",
    function: "Reliably open and close passenger doors within dwell time",
    failureMode: "Door actuator failure causing door jammed open or closed",
    effect: "Service delay, potential passenger entrapment risk, missed stops",
    cause: "Solenoid burnout, gear strip, foreign object in door channel",
    severity: 7,
    occurrence: 7,
    detection: 3,
    controls:
      "Door obstruction sensors, door bypass mode, daily functional test",
    action: "Replace actuator; recalibrate door controller; clear door channel",
    responsibility: "Door Systems Technician",
    targetDate: "2026-05-02",
    status: "Open",
  },

  // ── DIESEL ENGINE (freight locos) ──
  {
    id: "FMEA-012",
    system: "Diesel Engine",
    subsystem: "Fuel Injection",
    function:
      "Deliver precise fuel quantity at correct timing to combustion chamber",
    failureMode: "Injector nozzle wear causing spray pattern distortion",
    effect:
      "Incomplete combustion, power loss, excessive smoke, high fuel consumption",
    cause: "Fuel contamination, normal service wear, overdue replacement",
    severity: 7,
    occurrence: 5,
    detection: 5,
    controls: "Fuel analysis at oil sampling, exhaust opacity monitoring",
    action: "Replace injector set; flush fuel system; update service interval",
    responsibility: "Diesel Engine Technician",
    targetDate: "2026-05-30",
    status: "Open",
  },
];

export const FMEA_COLUMNS = [
  "id",
  "system",
  "subsystem",
  "function",
  "failureMode",
  "effect",
  "cause",
  "severity",
  "occurrence",
  "detection",
  "controls",
  "action",
  "responsibility",
  "targetDate",
  "status",
];

// RPN = Severity × Occurrence × Detection
export function calcRPN(item) {
  return item.severity * item.occurrence * item.detection;
}

export function getRPNColor(rpn) {
  if (rpn >= 200) return "#ff3d5a";
  if (rpn >= 120) return "#ff9d00";
  if (rpn >= 60) return "#fbbf24";
  return "#00e5a0";
}

export function getRPNLabel(rpn) {
  if (rpn >= 200) return "CRITICAL";
  if (rpn >= 120) return "HIGH";
  if (rpn >= 60) return "MEDIUM";
  return "LOW";
}
