# CYBERPULSE // Cybersecurity & Compliance Operations Command Center

An enterprise-grade Project Management & Operations Command Center engineered for managed cybersecurity, compliance, and SOC operations providers.

Engineered with a **Client-Centric 360° Architecture** tailored to primary regulated client sectors:
- 🏥 **Healthcare Networks & Clinical Systems** (HIPAA Security Rule, HITECH, HITRUST, Medical IoMT Device Isolation)
- 🏦 **Financial Institutions & Banking** (FFIEC CAT, GLBA Safeguards, SEC 4-Day Incident Disclosure, PCI-DSS 4.0)
- 🌐 **Other Commercial & Enterprise** (SOC 2 Type II, NIST CSF, ISO 27001)

---

## 🛡️ Core Functional Modules

1. **Client Accounts 360° Hub**
   - Portfolio directory with sector filter tabs (`Healthcare`, `Financial`, `Other`)
   - Global scope picker in the top bar: all clients, a whole sector, or a single client. Every view, KPI, threat feed and roster follows the selected scope
   - Compliance posture meters, SLA response health, active engagement tracking
   - Interactive **360° Account Cockpit Modal** for full client drilldown across all operational practices

2. **Ops Telemetry (Executive Radar)**
   - Live Threat Intelligence Broadcast (CISA KEV, Global Threat Lab, MITRE ATT&CK)
   - Real-time KPI statistics: Active Engagements, Critical Findings Open, Monitored Endpoints, SLA compliance
   - Triage queue for high-priority CVSS 9.0+ vulnerabilities

3. **Engagements & Project Management**
   - Covers core advisory and technical service lines:
     - **vCISO Advisory Retainers** & Strategic Roadmaps
     - **Cybersecurity Risk Assessments & BIA**
     - **Healthcare HIPAA Technical Audits & Medical IoMT Reviews**
     - **FFIEC / GLBA Banking Examination Readiness**
     - **Network & Web Application Penetration Testing**
     - **24/7 Managed IT & SOC Onboarding**
   - Interactive Kanban milestone phases: *Scoping & Recon → Active Exploitation → Evidence Analysis → Executive Debrief → Retest & Sign-off → Completed*
   - Budget tracking, logged hours, and staff allocation

4. **Vulnerability Matrix & Findings Tracker**
   - Formal CVSS v3.1 / v4.0 scoring breakdown (Critical, High, Medium, Low)
   - Full CVSS vector strings, PoC notes, affected endpoints, and technical impact
   - Actionable remediation playbooks and SLA deadlines
   - Retest workflow: *Open → In Remediation → Retest Requested → Verified Mitigated*

5. **Cyber Risk Register & 5x5 Heatmap Matrix**
   - 5x5 Likelihood (1-5) vs. Impact (1-5) qualitative risk grid
   - Inherent Risk vs. Residual Risk scoring displaying percentage reduction achieved by defensive controls
   - Domain-specific scenarios: Clinical Ransomware & Ambulatory Outage, FFIEC/GLBA Non-Compliance, Deepfake Commercial Wire Fraud, Medical IoMT Tampering

6. **24/7 SecOps & Managed IT Operations**
   - Fleet telemetry across Windows Server, Windows 11 Enterprise, Ubuntu Linux, and macOS
   - Patch compliance tracking and EDR sensor health (SentinelOne, Microsoft Defender for Endpoint)
   - Active SLA queue with per-priority SLA targets (P1 1h, P2 4h, P3 8h, P4 24h)

7. **Vendor Management (TPRM)**
   - Sector-specific vendor risk assessments (e.g. *Epic Systems EHR*, *Oracle/Cerner*, *Fiserv DNA Core*, *Jack Henry*, *CrowdStrike*, *Cloudflare*)
   - SOC 2 Type II attestation status tracking and data access scopes
   - Rapid vendor onboarding modal

8. **BCM Tabletop Drills (TTX) & Incident Simulation**
   - Pre-configured crisis scenarios (*Operation Cerberus Black - Hospital Ransomware*, *Operation Sovereign Wire - Commercial Banking Clawback*)
   - Chronological inject timeline (T+00:00 Infiltration, T+00:45 Escalation, T+01:30 Darknet leak, T+02:45 Regulatory SEC/HHS countdown)
   - Participant department alignment (CEO, CISO, General Counsel, Clinical Ops, Outside Counsel)

9. **Cyber Advisory & Operations Roster**
   - Leadership & advisory practice leads (**Milton Bartley**, Managing Partner; **Andy Barker**, President & vCISO Practice Lead)
   - Specialized practice leads for Healthcare Compliance (HIPAA), Banking & Financial (FFIEC), and Offensive SecOps
   - Workload capacity % utilization meters and clearance levels

10. **Audit Deliverables & PDF Exporter**
    - Audit-grade client report generation with formal CyberPulse letterhead and SOC 2 Type II stamp
    - Executive attestation statement, assessment methodology, and scope verification
    - Severity distribution chart and technical findings breakdown
    - Digital cryptographic sign-offs (Lead Assessor & Andy Barker, Practice Lead)
    - One-click Print / Save to PDF and JSON export

---

## 🚀 Running the Application

### 1. Start the REST API Backend
```bash
npm run server
```
Runs Express on `http://localhost:5001`. Seed data lives in `server/data/database.json`; anything created through the UI is saved to `server/data/runtime.json` (gitignored). Delete that file to reset to the seed data.

### 2. Start the Frontend Development Server
```bash
npm run dev
```
Runs Vite on `http://localhost:5174` with automatic proxying to `/api`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, production-ready build in `dist/`. After building, `npm start` serves both the API and the built dashboard from `http://localhost:5001`.
