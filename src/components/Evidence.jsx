import { useState } from "react";
import { CASES } from "../data/CaseStudies.js";
import { FLEET } from "../data/FleetData.js";
import { FMEA_DATA, rpn, rpnLabel } from "../data/FmeaData.js";

async function loadPDF() {
  for (const src of [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js",
  ]) {
    if (!document.querySelector(`script[src="${src}"]`))
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
      });
  }
  return window.jspdf.jsPDF;
}

export default function Evidence() {
  const [exp, setExp] = useState(null);
  const [done, setDone] = useState(false);

  const doExport = async (type) => {
    setExp(type);
    try {
      const jsPDF = await loadPDF();
      type === "tender" ? await tenderPDF(jsPDF) : await fleetPDF(jsPDF);
      setDone(true);
      setTimeout(() => setDone(false), 3500);
    } catch (e) {
      alert("PDF error: " + e.message);
    }
    setExp(null);
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#0e1830,#0a1020)",
          border: "1px solid #00d4ff44",
          borderRadius: 12,
          padding: 26,
          marginBottom: 24,
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
                color: "#00d4ff",
                letterSpacing: 2.5,
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              TENDER SUBMISSION — EVIDENCE PACKAGE · REF: AXR-TENDER-2026-001
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#ddeeff",
                fontWeight: 700,
                marginBottom: 8,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              Six Verified AI/ML Deployments in Rail and Transport Sectors
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#4a6080",
                lineHeight: 1.8,
                maxWidth: 680,
              }}
            >
              Evidence for tender evaluating authorities. Demonstrates
              predictive analytics capability, model accuracy, measurable
              outcomes, and compliance with EN 50126/EN 50128.
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: "#4a6080" }}>
              github.com/KeyToTechSolutions/axionrail-ai
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 210,
            }}
          >
            <button
              onClick={() => doExport("tender")}
              disabled={!!exp}
              style={{
                background: done
                  ? "#00e0a018"
                  : exp
                    ? "#182845"
                    : "linear-gradient(135deg,#00d4ff,#0090bb)",
                color: done ? "#00e0a0" : exp ? "#4a6080" : "#05080f",
                border: done ? "1px solid #00e0a0" : "none",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 800,
                fontSize: 10,
                cursor: exp ? "not-allowed" : "pointer",
                letterSpacing: 1.5,
                fontFamily: "inherit",
                transition: "all .4s",
              }}
            >
              {done
                ? "PDF DOWNLOADED"
                : exp === "tender"
                  ? "GENERATING..."
                  : "EXPORT TENDER PDF"}
            </button>
            <button
              onClick={() => doExport("fleet")}
              disabled={!!exp}
              style={{
                background: "#0e1830",
                color: "#4a6080",
                border: "1px solid #182845",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 700,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: 1.2,
              }}
            >
              {exp === "fleet" ? "GENERATING..." : "EXPORT FLEET REPORT PDF"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          ["Verified Deployments", "6", "#00d4ff"],
          ["Avg Model Accuracy", "90.7%", "#00e0a0"],
          ["Avg Downtime Reduction", "38%", "#f59e0b"],
          ["Combined Savings", ">$293M USD", "#00e0a0"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: "#0e1830",
              border: "1px solid #182845",
              borderRadius: 10,
              padding: "18px 20px",
              textAlign: "center",
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
                background: `linear-gradient(90deg,${c},transparent)`,
              }}
            />
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
                color: "#4a6080",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {CASES.map((c, i) => (
        <div
          key={c.ref}
          style={{
            background: "#0e1830",
            border: "1px solid #182845",
            borderRadius: 10,
            padding: 24,
            marginBottom: 14,
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
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#00d4ff18",
                    border: "1px solid #00d4ff33",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🏢
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#f0f8ff",
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {c.org}
                  </div>
                  <div style={{ fontSize: 10, color: "#4a6080" }}>
                    {c.country} · {c.year} · {c.sector}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  fontSize: 12,
                  color: "#00e0a0",
                  fontWeight: 700,
                }}
              >
                ✓ {c.outcome}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 10,
                }}
              >
                {[
                  ["AI MODEL", c.model],
                  ["ACCURACY", c.accuracy],
                  ["SAVING", c.saving],
                  ["AVAILABILITY", c.avail],
                  ["LEAD TIME", c.leadTime],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      background: "#0a1020",
                      borderRadius: 6,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: "#4a6080",
                        letterSpacing: 1,
                        marginBottom: 3,
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#b8cce8",
                        fontWeight: 700,
                        lineHeight: 1.3,
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
                  background: "#00e0a018",
                  border: "1px solid #00e0a044",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 9,
                  color: "#00e0a0",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                VERIFIED
              </div>
              <div style={{ fontSize: 9, color: "#4a6080", marginTop: 6 }}>
                {c.ref}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function tenderPDF(jsPDF) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth(),
    H = doc.internal.pageSize.getHeight(),
    m = 18;
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(0, 70, 140);
  doc.rect(0, 0, 5, H, "F");
  doc.setFillColor(0, 212, 255);
  doc.rect(0, 0, W, 1.5, "F");
  doc.setTextColor(0, 212, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text("AXIONRAIL AI", m + 4, 52);
  doc.setFontSize(11);
  doc.setTextColor(74, 96, 128);
  doc.text("Predictive and Prescriptive Fleet Analytics Platform", m + 4, 63);
  doc.setFontSize(9);
  doc.setTextColor(100, 140, 180);
  doc.text(
    "KeyToTechSolutions  -  github.com/KeyToTechSolutions/axionrail-ai",
    m + 4,
    72,
  );
  doc.setFillColor(14, 24, 48);
  doc.roundedRect(m, 82, W - m * 2, 46, 3, 3, "F");
  doc.setTextColor(224, 240, 255);
  doc.setFontSize(16);
  doc.text("EVIDENCE OF AI MODEL DEPLOYMENTS", m + 10, 100, {
    maxWidth: W - m * 2 - 20,
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 212, 255);
  doc.text(
    "Rail and Transport Sector - Tender Submission Package",
    m + 10,
    113,
  );
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
    ["Organisation:", "KeyToTechSolutions"],
    ["Classification:", "Commercial Tender - Confidential"],
  ];
  let y = 142;
  meta.forEach(([k, v]) => {
    doc.setTextColor(74, 96, 128);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(k, m + 4, y);
    doc.setTextColor(224, 240, 255);
    doc.setFont("helvetica", "bold");
    doc.text(v, m + 52, y);
    y += 9;
  });
  doc.setTextColor(30, 50, 80);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "CONFIDENTIAL - FOR TENDER EVALUATION PURPOSES ONLY",
    W / 2,
    H - 10,
    { align: "center" },
  );
  CASES.forEach((c, idx) => {
    doc.addPage();
    doc.setFillColor(5, 8, 15);
    doc.rect(0, 0, W, 17, "F");
    doc.setFillColor(0, 212, 255);
    doc.rect(0, 17, W, 1, "F");
    doc.setTextColor(0, 212, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("AXIONRAIL AI", m, 11);
    doc.setTextColor(74, 96, 128);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("KeyToTechSolutions", m + 28, 11);
    doc.text(new Date().toLocaleDateString("en-ZA"), W - m, 11, {
      align: "right",
    });
    let cy = 30;
    doc.setFillColor(5, 8, 15);
    doc.rect(m, cy - 5, W - m * 2, 13, "F");
    doc.setTextColor(0, 212, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `DEPLOYMENT ${idx + 1}/${CASES.length}  -  REF: ${c.ref}`,
      m + 4,
      cy + 3,
    );
    cy += 16;
    doc.setTextColor(0, 80, 180);
    doc.setFontSize(14);
    doc.text(c.org, m, cy);
    doc.setTextColor(74, 96, 128);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${c.country}  -  ${c.year}  -  ${c.sector}`, m, cy + 7);
    cy += 18;
    doc.setFillColor(232, 242, 255);
    doc.rect(m, cy, W - m * 2, 10, "F");
    doc.setTextColor(0, 80, 180);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("OUTCOME:  " + c.outcome, m + 3, cy + 7);
    cy += 14;
    const mx = [
      ["AI MODEL", c.model],
      ["ACCURACY", c.accuracy],
      ["SAVING", c.saving],
      ["AVAILABILITY", c.avail],
      ["LEAD TIME", c.leadTime],
    ];
    const mw = (W - m * 2 - 8) / mx.length;
    mx.forEach(([k, v], i) => {
      const x = m + i * (mw + 2);
      doc.setFillColor(215, 228, 255);
      doc.roundedRect(x, cy, mw, 16, 1, 1, "F");
      doc.setTextColor(74, 96, 128);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(k, x + mw / 2, cy + 5, { align: "center" });
      doc.setTextColor(0, 80, 180);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(doc.splitTextToSize(v, mw - 3)[0], x + mw / 2, cy + 12, {
        align: "center",
      });
    });
    cy += 22;
    doc.setFillColor(0, 150, 100);
    doc.rect(m, cy, W - m * 2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("VERIFIED DEPLOYMENT - " + c.ref, m + 4, cy + 7);
    doc.setDrawColor(0, 70, 140);
    doc.setLineWidth(0.3);
    doc.line(m, H - 9, W - m, H - 9);
    doc.setTextColor(74, 96, 128);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      "AxionRail AI - github.com/KeyToTechSolutions/axionrail-ai",
      m,
      H - 4,
    );
    doc.text(
      `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
      W - m,
      H - 4,
      { align: "right" },
    );
  });
  doc.addPage();
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, W, 17, "F");
  doc.setFillColor(0, 212, 255);
  doc.rect(0, 17, W, 1, "F");
  doc.setTextColor(0, 212, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("AXIONRAIL AI", m, 11);
  doc.setTextColor(0, 80, 180);
  doc.setFontSize(13);
  doc.text("FLEET ASSET REGISTRY", m, 28);
  doc.autoTable({
    startY: 34,
    head: [
      ["Asset", "Type", "Route", "Health", "RUL", "Status", "Alerts", "Depot"],
    ],
    body: FLEET.map((a) => [
      a.id,
      a.type,
      a.route,
      `${a.health}%`,
      `${a.rul}d`,
      a.status,
      a.alerts,
      a.depot,
    ]),
    margin: { left: m, right: m },
    headStyles: {
      fillColor: [5, 8, 15],
      textColor: [0, 212, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: { fontSize: 7.5, cellPadding: 3 },
    alternateRowStyles: { fillColor: [235, 243, 255] },
    didParseCell: (d) => {
      if (d.section === "body") {
        const r = FLEET[d.row.index];
        if (d.column.index === 3) {
          const h = r?.health;
          d.cell.styles.textColor =
            h >= 80 ? [0, 180, 120] : h >= 60 ? [200, 120, 0] : [200, 40, 70];
          d.cell.styles.fontStyle = "bold";
        }
        if (d.column.index === 5) {
          const s = r?.status;
          d.cell.styles.textColor =
            s === "Operational"
              ? [0, 180, 120]
              : s === "Warning"
                ? [200, 120, 0]
                : [200, 40, 70];
          d.cell.styles.fontStyle = "bold";
        }
      }
    },
  });
  doc.save("AxionRail_AI_Tender_Evidence_Package.pdf");
}

async function fleetPDF(jsPDF) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth(),
    H = doc.internal.pageSize.getHeight(),
    m = 14;
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(0, 212, 255);
  doc.rect(0, 0, W, 3, "F");
  doc.setTextColor(0, 212, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("AXIONRAIL AI", m, 34);
  doc.setFontSize(10);
  doc.setTextColor(74, 96, 128);
  doc.text(
    "Fleet Reliability Report  -  KeyToTechSolutions  -  github.com/KeyToTechSolutions/axionrail-ai",
    m,
    44,
  );
  doc.setFontSize(8);
  doc.setTextColor(184, 204, 232);
  doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, m, 52);
  doc.addPage();
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, W, 15, "F");
  doc.setTextColor(0, 212, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("AXIONRAIL AI  -  KEYTOTECHSOLUTIONS", m, 10);
  doc.setTextColor(0, 80, 180);
  doc.setFontSize(12);
  doc.text("FLEET ASSET STATUS", m, 25);
  doc.autoTable({
    startY: 30,
    head: [
      [
        "Asset",
        "Type",
        "Class",
        "Route",
        "Health",
        "RUL",
        "Status",
        "Alerts",
        "Next Maint",
        "Km",
        "Depot",
      ],
    ],
    body: FLEET.map((a) => [
      a.id,
      a.type,
      a.cls,
      a.route,
      `${a.health}%`,
      `${a.rul}d`,
      a.status,
      a.alerts,
      a.nextMaint || "TBC",
      `${Math.round(a.km / 1000)}k`,
      a.depot,
    ]),
    margin: { left: m, right: m },
    headStyles: {
      fillColor: [5, 8, 15],
      textColor: [0, 212, 255],
      fontStyle: "bold",
      fontSize: 6.5,
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [230, 240, 255] },
    didParseCell: (d) => {
      if (d.section === "body") {
        const r = FLEET[d.row.index];
        if (d.column.index === 4) {
          const h = r?.health;
          d.cell.styles.textColor =
            h >= 80 ? [0, 160, 100] : h >= 60 ? [180, 110, 0] : [200, 40, 70];
          d.cell.styles.fontStyle = "bold";
        }
        if (d.column.index === 6) {
          const s = r?.status;
          d.cell.styles.textColor =
            s === "Operational"
              ? [0, 160, 100]
              : s === "Warning"
                ? [180, 110, 0]
                : [200, 40, 70];
          d.cell.styles.fontStyle = "bold";
        }
      }
    },
  });
  doc.addPage();
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, W, 15, "F");
  doc.setTextColor(0, 80, 180);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("FMEA - FAILURE MODE AND EFFECTS ANALYSIS", m, 25);
  doc.autoTable({
    startY: 30,
    head: [
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
        "Status",
      ],
    ],
    body: FMEA_DATA.map((f) => {
      const r = rpn(f);
      return [
        f.id,
        f.system,
        f.fm.slice(0, 40),
        f.effect.slice(0, 45),
        f.s,
        f.o,
        f.d,
        r,
        rpnLabel(r),
        f.status,
      ];
    }),
    margin: { left: m, right: m },
    headStyles: {
      fillColor: [5, 8, 15],
      textColor: [0, 212, 255],
      fontStyle: "bold",
      fontSize: 6.5,
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [230, 240, 255] },
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
            ? [200, 40, 70]
            : r >= 120
              ? [180, 110, 0]
              : r >= 60
                ? [160, 130, 0]
                : [0, 160, 100];
      }
    },
  });
  doc.save("AxionRail_AI_Fleet_Report.pdf");
}
