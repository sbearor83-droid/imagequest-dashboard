# CYBERPULSE // Cyber Security Project Operations & MSSP Dashboard

An enterprise-grade Project Management & Operations Command Center built specifically for full-service Cybersecurity firms, MSSPs, and Security Advisory practices.

---

## 🛡️ Core Functional Modules

1. **Operations Overview (Executive Telemetry)**
   - Live Threat Intelligence Broadcast (CISA KEV, MITRE ATT&CK, NIST CVEs)
   - Real-time KPI statistics: Active Engagements, Critical Findings Open, Monitored Endpoints, SLA compliance
   - Triage queue for high-priority CVSS 9.0+ vulnerabilities
   - Quick practice navigation across all service lines

2. **Engagements & Project Management**
   - Covers all cybersecurity service lines:
     - **Penetration Testing** (External/Internal Network, Web Applications, Cloud, APIs)
     - **Red Teaming & Adversary Emulation** (Lateral movement, assumed breach)
     - **Compliance & Audits** (SOC 2 Type II, ISO/IEC 27001, CMMC Level 2, NIST 800-171, PCI-DSS 4.0)
     - **Managed IT & 24/7 SOC Onboarding**
     - **Third-Party Vendor Risk Management (TPRM)**
     - **Crisis Tabletop Exercises (TTX)**
   - Interactive milestone phase progression: *Scoping & Recon → Active Exploitation → Evidence Analysis → Executive Debrief → Retest & Sign-off → Completed*
   - Budget vs. logged hours tracking and team allocation
   - Direct launch of client executive deliverable audit reports

3. **Vulnerability Matrix & Findings Tracker**
   - Formal CVSS v3.1 / v4.0 scoring breakdown (Critical, High, Medium, Low)
   - Full CVSS vector strings (e.g. `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`)
   - Proof-of-concept (PoC) notes, affected asset endpoints, and technical impact
   - Actionable remediation playbooks and SLA deadlines
   - Retest workflow: *Open → In Remediation → Retest Requested → Verified Mitigated*

4. **Enterprise Risk Register & 5x5 Heatmap Matrix**
   - 5x5 Likelihood (1-5) vs. Impact (1-5) qualitative risk grid
   - Inherent Risk vs. Residual Risk scoring displaying percentage reduction achieved by defensive controls
   - Categorization: Ransomware, Supply Chain & TPRM, Cloud IAM Identity, SEC Regulatory Incident Disclosure (4-Day Rule), AI Deepfake & Social Engineering

5. **Managed IT Operations & 24/7 SOC SLAs**
   - Fleet telemetry across Windows Server, Windows 11 Enterprise, Ubuntu Linux, and macOS
   - Patch compliance tracking and EDR sensor health
   - Active SOC Escalations & Ticket SLA queue with live countdown timers (P1 Critical 1-hour SLA, P2 High 4-hour SLA, P3 Medium)
   - Interactive SLA ticket dispatch modal

6. **Third-Party Vendor Risk Management (TPRM)**
   - Vendor supply chain tiering (Tier 1 Mission Critical, Tier 2 Operational, Tier 3 Support)
   - Continuous vendor risk scoring (0-100) and ISO 27001 validation
   - SOC 2 Type II attestation status tracking and data access scopes
   - Rapid vendor onboarding modal

7. **Tabletop Exercises (TTX) & Incident Simulation Planner**
   - Pre-configured and custom crisis scenarios (*Operation Cerberus Black - Clinical Ransomware*, *Operation Sovereign Ghost - SWIFT Wire Interception*)
   - Chronological inject timeline (T+00:00 Infiltration, T+00:45 Escalation, T+01:30 Public Darknet leak, T+02:45 Regulatory SEC/HHS countdown)
   - Participant department alignment (CEO, CISO, General Counsel, Clinical Ops, PR)
   - After-Action Report (AAR) rating and debrief summaries

8. **Security Analyst Roster & Resource Allocation**
   - Government clearance level tracking (Top Secret / SCI, Secret, Public Trust)
   - Industry credentials (OSCP, OSEP, CISSP, GCFA, CISA, CEH, CCNA Security, AWS Security)
   - Workload capacity % utilization meters with high-utilization indicators
   - Active engagement count and direct comms

9. **Executive Deliverables & Audit Report Exporter**
   - Audit-grade client report generation with formal classification headers
   - Executive attestation statement, assessment methodology, and scope verification
   - Severity distribution chart and technical findings breakdown
   - Digital cryptographic signature sign-off blocks (Lead Assessor & Managing Director CISO)
   - One-click Print / Save to PDF and JSON export

---

## 🚀 Running the Application

### 1. Start the REST API Backend
```bash
npm run server
```
Runs Express on `http://localhost:5001` with seed data persistence in `server/data/database.json`.

### 2. Start the Frontend Development Server
```bash
npm run dev
```
Runs Vite on `http://localhost:5174` with automatic proxying to `/api`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, production-ready build in `dist/`.
