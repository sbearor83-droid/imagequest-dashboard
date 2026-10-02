import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, 'data', 'database.json');
// Runtime writes go to a separate (gitignored) file so the committed seed data stays untouched.
const DB_PATH = path.join(__dirname, 'data', 'runtime.json');
const DIST_PATH = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Load once at startup and keep in memory; persist to disk after each mutation.
const db = JSON.parse(fs.readFileSync(fs.existsSync(DB_PATH) ? DB_PATH : SEED_PATH, 'utf-8'));
db.clients ??= [];

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

const today = () => new Date().toISOString().split('T')[0];

const SECTOR_COMPLIANCE = {
  Healthcare: ['HIPAA', 'HITECH'],
  Financial: ['FFIEC', 'GLBA'],
  Other: ['SOC 2 Type II', 'NIST CSF']
};

const SLA_BY_PRIORITY = { P1: '1h', P2: '4h', P3: '8h', P4: '24h' };

// Apply a partial update to a record without letting the client rewrite its id.
function patchRecord(collection, req, res, label) {
  const record = collection.find(item => item.id === req.params.id);
  if (!record) return res.status(404).json({ error: `${label} not found` });
  const { id, ...changes } = req.body;
  Object.assign(record, changes);
  saveDb();
  res.json(record);
}

// 1. Overall stats & Threat Feed
app.get('/api/stats', (req, res) => {
  res.json({ ...db.stats, threatFeed: db.threatFeed });
});

// Clients Hub API
app.get('/api/clients', (req, res) => {
  res.json(db.clients);
});

app.post('/api/clients', (req, res) => {
  const sector = req.body.sector || 'Other';
  const newClient = {
    id: `CLI-${String(db.clients.length + 1).padStart(2, '0')}`,
    name: req.body.name || 'New Client Enterprise',
    sector,
    industry: req.body.industry || 'Other Commercial (SOC 2 / ISO)',
    tier: req.body.tier || 'Enterprise Tier',
    leadPartner: req.body.leadPartner || 'Andy Barker',
    compliance: req.body.compliance || SECTOR_COMPLIANCE[sector] || [],
    services: req.body.services || ['Security Assessment'],
    healthScore: 85,
    riskLevel: 'Under Assessment',
    primaryContact: req.body.primaryContact || 'SecOps Contact',
    email: req.body.email || 'contact@client.com',
    slaTier: req.body.slaTier || 'Standard SLA',
    endpoints: Number(req.body.endpoints) || 500,
    budget: req.body.budget || '$100,000 / yr'
  };
  db.clients.unshift(newClient);
  saveDb();
  res.status(201).json(newClient);
});

// 2. Engagements
app.get('/api/engagements', (req, res) => {
  res.json(db.engagements);
});

app.post('/api/engagements', (req, res) => {
  const newEngagement = {
    id: `ENG-${new Date().getFullYear()}-${String(db.engagements.length + 81).padStart(3, '0')}`,
    client: req.body.client || 'New Client Enterprise',
    title: req.body.title || 'Security Engagement',
    type: req.body.type || 'Penetration Testing',
    status: req.body.status || 'In Progress',
    phase: req.body.phase || 'Scoping & Recon',
    leadAnalyst: req.body.leadAnalyst || 'Andy Barker',
    team: req.body.team || [req.body.leadAnalyst || 'Andy Barker'],
    startDate: req.body.startDate || today(),
    endDate: req.body.endDate || today(),
    progress: Number(req.body.progress) || 20,
    scope: req.body.scope || 'Standard Security Scope',
    budgetHours: Number(req.body.budgetHours) || 80,
    spentHours: Number(req.body.spentHours) || 0,
    priority: req.body.priority || 'High',
    slaStatus: 'On Schedule'
  };
  db.engagements.unshift(newEngagement);
  saveDb();
  res.status(201).json(newEngagement);
});

app.patch('/api/engagements/:id', (req, res) => patchRecord(db.engagements, req, res, 'Engagement'));

// 3. Vulnerability & Findings Matrix
app.get('/api/findings', (req, res) => {
  res.json(db.findings);
});

app.post('/api/findings', (req, res) => {
  const newFinding = {
    id: `VULN-${new Date().getFullYear()}-${String(db.findings.length + 41).padStart(3, '0')}`,
    engagementId: req.body.engagementId,
    client: req.body.client || 'Client System',
    title: req.body.title || 'Discovered Vulnerability',
    cve: req.body.cve || 'N/A',
    severity: req.body.severity || 'HIGH',
    cvssScore: Number(req.body.cvssScore) || 7.5,
    cvssVector: req.body.cvssVector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    asset: req.body.asset || 'Target Asset',
    status: 'Open',
    discoveredBy: req.body.discoveredBy || 'Security Team',
    discoveredDate: today(),
    remediationDeadline: req.body.remediationDeadline || today(),
    description: req.body.description || '',
    remediation: req.body.remediation || ''
  };
  db.findings.unshift(newFinding);
  saveDb();
  res.status(201).json(newFinding);
});

app.patch('/api/findings/:id', (req, res) => patchRecord(db.findings, req, res, 'Finding'));

// 4. Risk Assessments & Heatmap
app.get('/api/risks', (req, res) => {
  res.json(db.risks);
});

app.post('/api/risks', (req, res) => {
  const likelihood = Number(req.body.likelihood) || 3;
  const impact = Number(req.body.impact) || 3;
  const newRisk = {
    id: `RISK-${String(db.risks.length + 1).padStart(2, '0')}`,
    category: req.body.category || 'Operational',
    sector: req.body.sector,
    client: req.body.client || 'All Clients',
    title: req.body.title || 'Security Risk',
    description: req.body.description || '',
    likelihood,
    impact,
    inherentScore: likelihood * impact,
    residualScore: Math.round((likelihood * impact) * 0.5),
    status: 'Active Review',
    owner: req.body.owner || 'Security Lead',
    mitigations: req.body.mitigations || ['Implement baseline controls'],
    nextAudit: req.body.nextAudit || today()
  };
  db.risks.unshift(newRisk);
  saveDb();
  res.status(201).json(newRisk);
});

// 5. Managed IT & Ticket SLAs
app.get('/api/managed-it', (req, res) => {
  res.json(db.managedIT);
});

app.post('/api/managed-it/tickets', (req, res) => {
  const priority = req.body.priority || 'P2 - High';
  const newTicket = {
    id: `TKT-${Date.now().toString().slice(-6)}`,
    client: req.body.client || 'Unassigned Client',
    priority,
    title: req.body.title || 'Endpoint incident',
    category: req.body.category || 'SOC Escalation',
    assignedTo: req.body.assignedTo || 'Unassigned',
    created: 'Just now',
    slaRemaining: SLA_BY_PRIORITY[priority.slice(0, 2)] || '4h',
    status: 'Investigating'
  };
  db.managedIT.tickets.unshift(newTicket);
  db.managedIT.summary.openTickets += 1;
  saveDb();
  res.status(201).json(newTicket);
});

// 6. Vendor Risk Management (TPRM)
app.get('/api/vendors', (req, res) => {
  res.json(db.vendors);
});

app.post('/api/vendors', (req, res) => {
  const score = Number(req.body.riskScore) || 75;
  const newVendor = {
    id: `VND-${String(db.vendors.length + 1).padStart(2, '0')}`,
    name: req.body.name || 'New Vendor',
    sector: req.body.sector || 'Enterprise',
    client: req.body.client || 'All Accounts',
    service: req.body.service || 'Unspecified Service',
    tier: req.body.tier || 'Tier 2 - Operational',
    riskScore: score,
    riskLevel: score > 80 ? 'Low' : score > 55 ? 'Medium' : 'High',
    soc2Status: req.body.soc2Status || 'In Review',
    iso27001: Boolean(req.body.iso27001),
    lastAudit: today(),
    nextReview: `${new Date().getFullYear() + 1}${today().slice(4)}`,
    dataAccess: req.body.dataAccess || 'Internal Services',
    contact: req.body.contact || 'security@vendor.com',
    status: req.body.status || 'Approved'
  };
  db.vendors.unshift(newVendor);
  saveDb();
  res.status(201).json(newVendor);
});

// 7. Tabletop Exercises
app.get('/api/tabletop', (req, res) => {
  res.json(db.tabletopExercises);
});

app.post('/api/tabletop', (req, res) => {
  const newExercise = {
    id: `TTX-${String(db.tabletopExercises.length + 1).padStart(2, '0')}`,
    client: req.body.client || 'Partner Enterprise',
    title: req.body.title || 'Tabletop Simulation Exercise',
    scenario: req.body.scenario || 'Scenario outline',
    threatActor: req.body.threatActor || 'APT Threat Group',
    status: 'Scheduled',
    scheduledDate: req.body.scheduledDate || today(),
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
  saveDb();
  res.status(201).json(newExercise);
});

// 8. Team Allocation & Certifications
app.get('/api/team', (req, res) => {
  res.json(db.team);
});

// Serve the production build (npm run build) from the same server.
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`[CyberPulse API] listening on http://localhost:${PORT}`);
});
