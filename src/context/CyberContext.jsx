import React, { createContext, useContext, useState, useEffect } from 'react';

const CyberContext = createContext();

// Scope values: 'ALL', a client name, or SECTOR_PREFIX + sector (e.g. 'SECTOR:Healthcare')
export const SECTOR_PREFIX = 'SECTOR:';
export const SECTOR_LABELS = {
  Healthcare: 'Healthcare Clients',
  Financial: 'Financial Institutions',
  Other: 'Other Commercial Clients'
};

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${options?.method || 'GET'} ${url} failed: ${res.status}`);
  return res.json();
}

const sendJson = (url, method, body) => fetchJson(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export function CyberProvider({ children }) {
  const [activeTab, setActiveTab] = useState('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState('ALL'); // Global scope filter (see SECTOR_PREFIX)

  // Data states
  const [stats, setStats] = useState({ avgRemediationDays: 0 });
  const [threatFeed, setThreatFeed] = useState([]);
  const [clients, setClients] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [findings, setFindings] = useState([]);
  const [risks, setRisks] = useState([]);
  const [managedIT, setManagedIT] = useState({ tickets: [], endpointHealth: [] });
  const [vendors, setVendors] = useState([]);
  const [tabletopExercises, setTabletopExercises] = useState([]);
  const [team, setTeam] = useState([]);

  // Active selections & Modals
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateEngModalOpen, setIsCreateEngModalOpen] = useState(false);
  const [isCreateFindingModalOpen, setIsCreateFindingModalOpen] = useState(false);
  const [isCreateRiskModalOpen, setIsCreateRiskModalOpen] = useState(false);
  const [isCreateVendorModalOpen, setIsCreateVendorModalOpen] = useState(false);
  const [isCreateTTXModalOpen, setIsCreateTTXModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetEngagement, setReportTargetEngagement] = useState(null);

  // Fetch initial data from API; each endpoint loads independently so one failure doesn't blank the rest
  useEffect(() => {
    const load = (url, apply) => fetchJson(url).then(apply).catch(err => console.error(err));
    load('/api/stats', ({ threatFeed, ...rest }) => {
      setStats(rest);
      setThreatFeed(threatFeed || []);
    });
    load('/api/clients', setClients);
    load('/api/engagements', setEngagements);
    load('/api/findings', setFindings);
    load('/api/risks', setRisks);
    load('/api/managed-it', setManagedIT);
    load('/api/vendors', setVendors);
    load('/api/tabletop', setTabletopExercises);
    load('/api/team', setTeam);
  }, []);

  // Resolve the scope to the set of clients it covers
  const isAllScope = selectedClient === 'ALL';
  const scopedSector = selectedClient.startsWith(SECTOR_PREFIX) ? selectedClient.slice(SECTOR_PREFIX.length) : null;
  const scopedClientName = isAllScope || scopedSector ? null : selectedClient;
  const scopeLabel = isAllScope ? 'All Clients' : scopedSector ? `All ${SECTOR_LABELS[scopedSector] || scopedSector}` : selectedClient;

  const scopedClients = clients.filter(c =>
    isAllScope ||
    (scopedSector ? c.sector === scopedSector : c.name.toLowerCase() === scopedClientName.toLowerCase())
  );
  const scopedNames = new Set(scopedClients.map(c => c.name.toLowerCase()));
  const scopedSectors = new Set(scopedClients.map(c => c.sector));

  // Records shared across clients (client 'All Clients' / 'All Accounts') stay visible unless they
  // belong to a client sector outside the scope; cross-sector ones (e.g. 'Enterprise') always show.
  const isScopedTo = (client, sharedLabel, itemSector) => {
    if (isAllScope) return true;
    if (sharedLabel && (!client || client === sharedLabel)) {
      return !itemSector || !(itemSector in SECTOR_LABELS) || scopedSectors.has(itemSector);
    }
    return scopedNames.has(client?.toLowerCase());
  };

  const clientFilteredEngagements = engagements.filter(e => isScopedTo(e.client));
  const clientFilteredFindings = findings.filter(f => isScopedTo(f.client));
  const clientFilteredTickets = managedIT.tickets.filter(t => isScopedTo(t.client));
  const clientFilteredTabletop = tabletopExercises.filter(t => isScopedTo(t.client));
  const clientFilteredRisks = risks.filter(r => isScopedTo(r.client, 'All Clients', r.sector));
  const clientFilteredVendors = vendors.filter(v => isScopedTo(v.client, 'All Accounts', v.sector));
  const clientFilteredThreats = threatFeed.filter(t => isAllScope || t.affectedClients?.some(name => scopedNames.has(name.toLowerCase())));

  // Action methods: POST a new record and prepend the server's copy to local state
  const createWith = (url, setter) => async (data) => {
    try {
      const created = await sendJson(url, 'POST', data);
      setter(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const addClient = createWith('/api/clients', setClients);
  const addEngagement = createWith('/api/engagements', setEngagements);
  const addFinding = createWith('/api/findings', setFindings);
  const addRisk = createWith('/api/risks', setRisks);
  const addVendor = createWith('/api/vendors', setVendors);
  const addTabletopExercise = createWith('/api/tabletop', setTabletopExercises);

  const addTicket = createWith('/api/managed-it/tickets', (update) =>
    setManagedIT(prev => ({ ...prev, tickets: update(prev.tickets) }))
  );

  // Optimistic update; the server's copy replaces it once the PATCH succeeds
  const updateWith = (url, setter) => async (id, changes) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
    try {
      const updated = await sendJson(`${url}/${id}`, 'PATCH', changes);
      setter(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      console.error(err);
    }
  };

  const updateEngagement = updateWith('/api/engagements', setEngagements);
  const updateFinding = updateWith('/api/findings', setFindings);
  const updateFindingStatus = (id, status) => updateFinding(id, { status });

  const openReportFor = (engagement) => {
    setReportTargetEngagement(engagement || engagements[0]);
    setIsReportModalOpen(true);
  };

  return (
    <CyberContext.Provider value={{
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedClient,
      setSelectedClient,
      scopeLabel,
      scopedSector,
      scopedClientName,
      scopedClients,
      clients,
      stats,
      clientFilteredThreats,
      engagements,
      clientFilteredEngagements,
      findings,
      clientFilteredFindings,
      clientFilteredRisks,
      managedIT,
      clientFilteredTickets,
      clientFilteredVendors,
      tabletopExercises,
      clientFilteredTabletop,
      team,
      selectedEngagement,
      setSelectedEngagement,
      isCreateClientModalOpen,
      setIsCreateClientModalOpen,
      isCreateEngModalOpen,
      setIsCreateEngModalOpen,
      isCreateFindingModalOpen,
      setIsCreateFindingModalOpen,
      isCreateRiskModalOpen,
      setIsCreateRiskModalOpen,
      isCreateVendorModalOpen,
      setIsCreateVendorModalOpen,
      isCreateTTXModalOpen,
      setIsCreateTTXModalOpen,
      isCreateTicketModalOpen,
      setIsCreateTicketModalOpen,
      isReportModalOpen,
      setIsReportModalOpen,
      reportTargetEngagement,
      openReportFor,
      addClient,
      addEngagement,
      updateEngagement,
      addFinding,
      updateFindingStatus,
      addRisk,
      addVendor,
      addTabletopExercise,
      addTicket
    }}>
      {children}
    </CyberContext.Provider>
  );
}

export function useCyber() {
  return useContext(CyberContext);
}
