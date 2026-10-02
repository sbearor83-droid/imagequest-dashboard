import React, { createContext, useContext, useState, useEffect } from 'react';

const CyberContext = createContext();

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
  const [selectedClient, setSelectedClient] = useState('ALL'); // Global Client Filter: 'ALL' or Client Name

  // Data states
  const [stats, setStats] = useState({
    slaComplianceRate: 0,
    endpointsMonitored: 0,
    managedTenants: 0,
    avgRemediationDays: 0
  });
  const [threatFeed, setThreatFeed] = useState([]);
  const [clients, setClients] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [findings, setFindings] = useState([]);
  const [risks, setRisks] = useState([]);
  const [managedIT, setManagedIT] = useState({ summary: { openTickets: 0 }, tickets: [], endpointHealth: [] });
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

  // Filtered dataset helpers based on selectedClient
  const isScopedTo = (client, sharedLabel) =>
    selectedClient === 'ALL' ||
    (sharedLabel && (!client || client === sharedLabel)) ||
    client?.toLowerCase() === selectedClient.toLowerCase();

  const clientFilteredEngagements = engagements.filter(e => isScopedTo(e.client));
  const clientFilteredFindings = findings.filter(f => isScopedTo(f.client));
  const clientFilteredTickets = managedIT.tickets.filter(t => isScopedTo(t.client));
  const clientFilteredTabletop = tabletopExercises.filter(t => isScopedTo(t.client));
  const clientFilteredRisks = risks.filter(r => isScopedTo(r.client, 'All Clients'));
  const clientFilteredVendors = vendors.filter(v => isScopedTo(v.client, 'All Accounts'));

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

  const addTicket = async (ticketData) => {
    try {
      const created = await sendJson('/api/managed-it/tickets', 'POST', ticketData);
      setManagedIT(prev => ({
        ...prev,
        summary: { ...prev.summary, openTickets: prev.summary.openTickets + 1 },
        tickets: [created, ...prev.tickets]
      }));
      return created;
    } catch (err) {
      console.error(err);
    }
  };

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
      clients,
      stats,
      threatFeed,
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
