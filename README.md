# AxionRail AI
### Predictive & Prescriptive Fleet Analytics Platform for Rail Asset Management

---

## Overview

AxionRail AI is an enterprise-grade, AI-powered analytics platform that delivers **predictive and prescriptive intelligence** for rail fleet reliability, condition-based maintenance, failure prevention, and operational decision-making.

Built using a modern full-stack architecture, AxionRail AI ingests real-time IoT telemetry from onboard sensors, applies machine learning models to forecast failures before they occur, and prescribes prioritised maintenance actions to maximise fleet availability and minimise lifecycle costs.

---

## Project Structure

```
axionrail-ai/
├── public/
│   └── index.html                      # HTML entry point
├── src/
│   ├── components/
│   │   ├── Header.jsx                  # Top navigation bar & live status
│   │   ├── NavTabs.jsx                 # Tab navigation component
│   │   ├── FleetOverview.jsx           # Fleet dashboard & KPI cards
│   │   ├── AssetDeepDive.jsx           # Per-asset subsystem health view
│   │   ├── IoTTelemetry.jsx            # Real-time sensor stream & charts
│   │   ├── FMEAMatrix.jsx              # Failure Mode & Effects Analysis
│   │   ├── AIAnalytics.jsx             # Claude AI predictive/prescriptive engine
│   │   ├── DeploymentEvidence.jsx      # Tender case study registry
│   │   └── TenderExport.jsx            # PDF export controls
│   ├── data/
│   │   ├── fleetData.js                # 12-asset fleet registry
│   │   ├── sensorData.js               # IoT sensor definitions & simulation
│   │   ├── fmeaData.js                 # FMEA database (12 failure modes)
│   │   └── caseStudies.js              # 6 verified deployment case studies
│   ├── hooks/
│   │   ├── useSensorStream.js          # Real-time sensor streaming hook
│   │   └── useAIAnalysis.js            # Anthropic Claude API hook
│   ├── utils/
│   │   └── pdfExport.js                # jsPDF tender & fleet report generator
│   ├── styles/
│   │   └── tokens.css                  # CSS design tokens & theme variables
│   ├── App.jsx                         # Root application component
│   └── main.jsx                        # Vite entry point
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## Tech Stack

### Frontend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 | Component-based UI |
| Build Tool | Vite 5 | Fast dev server & bundling |
| Charts | Recharts 2.x | IoT telemetry visualisation |
| PDF Generation | jsPDF + AutoTable | Tender & report export |
| Styling | Tailwind CSS | Utility-first CSS |
| Icons | Lucide React | Icon library |
| Date Handling | date-fns | Date formatting |

### AI & Machine Learning
| Layer | Technology | Purpose |
|---|---|---|
| LLM Engine | Anthropic Claude (Sonnet 4) | Predictive & prescriptive analysis |
| Predictive Models | TensorFlow 2.x / LSTM | Time-series failure prediction |
| Classification | XGBoost + scikit-learn | Fault classification |
| Anomaly Detection | Isolation Forest | Sensor anomaly detection |
| Digital Twin | Custom Python engine | Asset state simulation |
| Model Serving | FastAPI + ONNX Runtime | Low-latency inference API |

### Backend & Data
| Layer | Technology | Purpose |
|---|---|---|
| API Server | Node.js + Express | REST API layer |
| ML API | FastAPI (Python) | ML model serving |
| Stream Processing | Apache Kafka | Real-time sensor ingestion |
| Time-Series DB | TimescaleDB | IoT telemetry storage |
| Relational DB | PostgreSQL 15 | Asset & maintenance records |
| Cache | Redis | Real-time dashboard caching |
| Big Data | Apache Spark | Historical batch analytics |

### Infrastructure & DevOps
| Layer | Technology | Purpose |
|---|---|---|
| Containerisation | Docker + Docker Compose | Local & staging deployment |
| Orchestration | Kubernetes (EKS/AKS) | Production scaling |
| Cloud | AWS / Azure | Compute & managed services |
| GPU Training | NVIDIA A100 / T4 | ML model training |
| Edge Compute | Raspberry Pi 4 / NVIDIA Jetson | Depot IoT gateways |
| CI/CD | GitHub Actions | Automated build & deploy |

### Monitoring & Observability
| Layer | Technology | Purpose |
|---|---|---|
| Metrics | Prometheus + Grafana | System & model monitoring |
| Logging | ELK Stack | Centralised log management |
| Alerting | PagerDuty | On-call incident management |
| APM | Datadog | Application performance |
| Model Monitoring | MLflow | Experiment tracking & drift |

### Security & Compliance
| Layer | Technology | Purpose |
|---|---|---|
| Authentication | OAuth 2.0 / Keycloak | Identity management |
| Authorisation | RBAC (Role-Based) | Permission model |
| Encryption | AES-256 at rest, TLS 1.3 transit | Data protection |
| Infrastructure | ISO 27001-certified hosting | Security baseline |
| Railway Standards | EN 50126 (RAMS), EN 50128 | Safety certification |
| Comms Security | IEC 62280 | Communication compliance |
| Condition Monitoring | ISO 13374 | CBM standard |

---

## Capabilities

### Predictive Analytics
- **Remaining Useful Life (RUL) estimation** — LSTM neural network per subsystem
- **Failure probability scoring** — 72-hour and 7-day failure risk windows
- **Anomaly detection** — real-time sensor deviation from baseline
- **Degradation trending** — health index trajectory with confidence bounds
- **Multi-variate correlation** — cross-subsystem failure propagation

### Prescriptive Analytics
- **Maintenance prioritisation** — AI-ranked work order queue
- **Parts requirement forecasting** — stock pre-positioning recommendations
- **Operational restriction advisories** — speed/load limits based on condition
- **Cost-benefit optimisation** — maintenance cost vs failure cost modelling
- **Maintenance scheduling** — slot recommendation against operational timetable

### IoT Telemetry
- Real-time ingestion from 7+ sensor channels per asset
- Streaming dashboard with 2-second refresh
- Threshold-based alerting with severity classification
- Historical trend analysis (60+ data points rolling)
- Sensor anomaly flagging with status indicators

### FMEA Matrix
- 12 pre-loaded failure modes across all major subsystems
- RPN (Risk Priority Number) calculation — Severity × Occurrence × Detection
- AI-augmented FMEA generation via Claude integration
- Colour-coded risk prioritisation (Critical / High / Medium / Low)
- Action tracking with responsibility assignment

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/axionrail/axionrail-ai.git
cd axionrail-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001/telemetry
VITE_SENSOR_POLL_MS=2000
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AxionRail AI Platform                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Frontend (Vite)                    │   │
│  │  Fleet Overview │ IoT Telemetry │ FMEA │ AI Analytics       │   │
│  └────────────────────────┬────────────────────────────────────┘   │
│                           │  REST / WebSocket                      │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │              API Gateway (Node.js + Express)                │   │
│  └───────┬──────────────────────────────────┬──────────────────┘   │
│          │                                  │                      │
│  ┌───────▼──────────┐            ┌──────────▼──────────────────┐   │
│  │  ML Serving API  │            │   Anthropic Claude API      │   │
│  │  (FastAPI+ONNX)  │            │   (Predictive/Prescriptive) │   │
│  └───────┬──────────┘            └─────────────────────────────┘   │
│          │                                                         │
│  ┌───────▼──────────────────────────────────────────────────── ┐   │
│  │            Data Layer                                        │   │
│  │   Kafka Stream │ TimescaleDB │ PostgreSQL │ Redis            │   │
│  └───────┬──────────────────────────────────────────────────── ┘   │
│          │                                                         │
│  ┌───────▼──────────────────────────────────────────────────── ┐   │
│  │            IoT Edge Layer                                    │   │
│  │   Depot Gateway │ Onboard ECU │ Lineside Sensors             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Contributing

Please read `CONTRIBUTING.md` before submitting pull requests. All ML model changes require peer review from a qualified reliability engineer.

## Licence

Proprietary — AxionRail AI Solutions. All rights reserved.

---

*Built for rail. Powered by AI. Engineered for reliability.*
