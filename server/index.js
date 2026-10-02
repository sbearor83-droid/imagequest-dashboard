import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'database.json');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper to read and write database
function getDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err);
    return false;
  }
}

// 1. Overall stats & Threat Feed
app.get('/api/stats', (req, res) => {
  const db = getDb();
  if (!db) return res.status(500).json({ error: 'DB error' });

  // Dynamically compute active counts
  const activeEngagements = db.engagements.filter(e => e.status !== 'Completed').length;
  const criticalFindings = db.findings.filter(f => f.severity === 'CRITICAL' && f.status !== 'Verified Mitigated').length;

  res.json({
    ...db.stats,
    activeEngagements,
    criticalFindings,
    totalEngagements: db.engagements.length,
    totalFindings: db.findings.length,
    threatFeed: db.threatFeed
  });
});

// Clients Hub API
app.get('/api/clients', (req, res) => {
  const db = getDb();
  if (!db) return res.status(500).json({ error: 'DB error' });
  res.json(db.clients || []);
});

app.post('/api/clients', (req, res) => {
  const db = getDb();
  const newId = `CLI-${String((db.clients || []).length + 1).padStart(2, '0')}`;
  const newClient = {
    id: newId,
    name: req.body.name || 'New Client Enterprise',
    industry: req.body.industry || 'Technology & Financial',
    tier: req.body.tier || 'Enterprise Tier',
    leadPartner: req.body.leadPartner || 'Marcus Vance',
    services: req.body.services || ['Security Assessment'],
    healthScore: 85,
    riskLevel: 'Under Assessment',
    primaryContact: req.body.primaryContact || 'SecOps Contact',
    email: req.body.email || 'contact@client.com',
    slaTier: req.body.slaTier || 'Standard SLA',
    endpoints: Number(req.body.endpoints) || 500,
    budget: req.body.budget || '$100,000 / yr'
  };
  if (!db.clients) db.clients = [];
  db.clients.unshift(newClient);
  saveDb(db);
  res.status(201).json(newClient);
});

// 2. Engagements
app.get('/api/engagements', (req, res) => {
  const db = getDb();
  const { type, status } = req.query;
  let engagements = db.engagements;
  if (type) engagements = engagements.filter(e => e.type.toLowerCase().includes(type.toLowerCase()));
  if (status) engagements = engagements.filter(e => e.status.toLowerCase() === status.toLowerCase());
  res.json(engagements);
});

app.post('/api/engagements', (req, res) => {
  const db = getDb();
  const newId = `ENG-${new Date().getFullYear()}-${String(db.engagements.length + 81).padStart(3, '0')}`;
  const newEngagement = {
    id: newId,
    client: req.body.client || 'New Client Enterprise',
    title: req.body.title || 'Security Engagement',
    type: req.body.type || 'Penetration Testing',
    status: req.body.status || 'In Progress',
    phase: req.body.phase || 'Scoping & Recon',
    leadAnalyst: req.body.leadAnalyst || 'Marcus Vance',
    team: req.body.team || ['Marcus Vance'],
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    endDate: req.body.endDate || '2026-11-30',
    progress: req.body.progress || 10,
    findingsCount: { critical: 0, high: 0, medium: 0, low: 0 },
    scope: req.body.scope || 'Standard Security Scope',
    budgetHours: Number(req.body.budgetHours) || 80,
    spentHours: Number(req.body.spentHours) || 0,
    priority: req.body.priority || 'High',
    slaStatus: 'On Schedule'
  };

  db.engagements.unshift(newEngagement);
  saveDb(db);
  res.status(201).json(newEngagement);
});

app.patch('/api/engagements/:id', (req, res) => {
  const db = getDb();
  const index = db.engagements.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Engagement not found' });

  db.engagements[index] = { ...db.engagements[index], ...req.body };
  saveDb(db);
  res.json(db.engagements[index]);
});

// 3. Vulnerability & Findings Matrix
app.get('/api/findings', (req, res) => {
  const db = getDb();
  const { severity, status, engagementId } = req.query;
  let findings = db.findings;
  if (severity) findings = findings.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
  if (status) findings = findings.filter(f => f.status.toLowerCase() === status.toLowerCase());
  if (engagementId) findings = findings.filter(f => f.engagementId === engagementId);
  res.json(findings);
});

app.post('/api/findings', (req, res) => {
  const db = getDb();
  const newId = `VULN-${new Date().getFullYear()}-${String(db.findings.length + 41).padStart(3, '0')}`;
  const newFinding = {
    id: newId,
    engagementId: req.body.engagementId || 'ENG-2026-081',
    client: req.body.client || 'Client System',
    title: req.body.title || 'Discovered Vulnerability',
    cve: req.body.cve || 'N/A',
    severity: req.body.severity || 'HIGH',
    cvssScore: Number(req.body.cvssScore) || 7.5,
    cvssVector: req.body.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    asset: req.body.asset || 'Target Asset',
    status: 'Open',
    discoveredBy: req.body.discoveredBy || 'Security Team',
    discoveredDate: new Date().toISOString().split('T')[0],
    remediationDeadline: req.body.remediationDeadline || '2026-10-31',
    description: req.body.description || '',
    remediation: req.body.remediation || ''
  };

  db.findings.unshift(newFinding);

  // Update engagement finding counter if matching
  const eng = db.engagements.find(e => e.id === newFinding.engagementId);
  if (eng && eng.findingsCount) {
    const sevKey = newFinding.severity.toLowerCase();
    if (eng.findingsCount[sevKey] !== undefined) {
      eng.findingsCount[sevKey] += 1;
    }
  }

  saveDb(db);
  res.status(201).json(newFinding);
});

app.patch('/api/findings/:id', (req, res) => {
  const db = getDb();
  const index = db.findings.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Finding not found' });

  db.findings[index] = { ...db.findings[index], ...req.body };
  saveDb(db);
  res.json(db.findings[index]);
});

// 4. Risk Assessments & Heatmap
app.get('/api/risks', (req, res) => {
  const db = getDb();
  res.json(db.risks);
});

app.post('/api/risks', (req, res) => {
  const db = getDb();
  const newId = `RISK-${String(db.risks.length + 1).padStart(2, '0')}`;
  const likelihood = Number(req.body.likelihood) || 3;
  const impact = Number(req.body.impact) || 3;
  const newRisk = {
    id: newId,
    category: req.body.category || 'Operational',
    title: req.body.title || 'Security Risk',
    description: req.body.description || '',
    likelihood,
    impact,
    inherentScore: likelihood * impact,
    residualScore: Math.round((likelihood * impact) * 0.5),
    status: 'Active Review',
    owner: req.body.owner || 'Security Lead',
    mitigations: req.body.mitigations || ['Implement baseline controls'],
    nextAudit: req.body.nextAudit || '2026-11-30'
  };

  db.risks.unshift(newRisk);
  saveDb(db);
  res.status(201).json(newRisk);
});

// 5. Managed IT & Ticket SLAs
app.get('/api/managed-it', (req, res) => {
  const db = getDb();
  res.json(db.managedIT);
});

app.post('/api/managed-it/tickets', (req, res) => {
  const db = getDb();
  const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: newId,
    client: req.body.client || 'Apex Financial Holdings',
    priority: req.body.priority || 'P2 - High',
    title: req.body.title || 'Endpoint incident',
    category: req.body.category || 'SOC Escalation',
    assignedTo: req.body.assignedTo || 'David Okafor',
    created: 'Just now',
    slaRemaining: req.body.priority.includes('P1') ? '1h' : '4h',
    status: 'Investigating'
  };
  db.managedIT.tickets.unshift(newTicket);
  db.managedIT.summary.openTickets += 1;
  saveDb(db);
  res.status(201).json(newTicket);
});

// 6. Vendor Risk Management (TPRM)
app.get('/api/vendors', (req, res) => {
  const db = getDb();
  res.json(db.vendors);
});

app.post('/api/vendors', (req, res) => {
  const db = getDb();
  const newId = `VND-${String(db.vendors.length + 1).padStart(2, '0')}`;
  const score = Number(req.body.riskScore) || 75;
  const newVendor = {
    id: newId,
    name: req.body.name,
    service: req.body.service,
    tier: req.body.tier || 'Tier 2 - Operational',
    riskScore: score,
    riskLevel: score > 80 ? 'Low' : score > 55 ? 'Medium' : 'High',
    soc2Status: req.body.soc2Status || 'In Review',
    iso27001: Boolean(req.body.iso27001),
    lastAudit: new Date().toISOString().split('T')[0],
    nextReview: '2027-10-01',
    dataAccess: req.body.dataAccess || 'Internal Services',
    contact: req.body.contact || 'security@vendor.com',
    status: req.body.status || 'Approved'
  };
  db.vendors.unshift(newVendor);
  saveDb(db);
  res.status(201).json(newVendor);
});

// 7. Tabletop Exercises
app.get('/api/tabletop', (req, res) => {
  const db = getDb();
  res.json(db.tabletopExercises);
});

app.post('/api/tabletop', (req, res) => {
  const db = getDb();
  const newId = `TTX-${String(db.tabletopExercises.length + 1).padStart(2, '0')}`;
  const newExercise = {
    id: newId,
    client: req.body.client || 'Partner Enterprise',
    title: req.body.title || 'Tabletop Simulation Exercise',
    scenario: req.body.scenario || 'Scenario outline',
    threatActor: req.body.threatActor || 'APT Threat Group',
    status: 'Scheduled',
    scheduledDate: req.body.scheduledDate || '2026-10-30',
    duration: req.body.duration || '3.5 Hours',
    facilitator: req.body.facilitator || 'Maya Lin',
    participants: req.body.participants || ['CISO', 'General Counsel', 'SecOps Lead'],
    injects: req.body.injects || [
      { time: 'T+00:00', phase: 'Infiltration', event: 'Initial alert triggered' },
      { time: 'T+01:00', phase: 'Escalation', event: 'Executive extortion communication' }
    ],
    aarRating: null
  };
  db.tabletopExercises.unshift(newExercise);
  saveDb(db);
  res.status(201).json(newExercise);
});

// 8. Team Allocation & Certifications
app.get('/api/team', (req, res) => {
  const db = getDb();
  res.json(db.team);
});

app.listen(PORT, () => {
  console.log(`[CyberPulse Backend] REST API listening on port ${PORT}`);
});
