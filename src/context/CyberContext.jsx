import React, { createContext, useContext, useState, useEffect } from 'react';

const CyberContext = createContext();

export function CyberProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients'); // default to clients hub or overview
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState('ALL'); // Global Client Filter: 'ALL' or Client Name
  
  // Data states
  const [stats, setStats] = useState({
    activeEngagements: 14,
    criticalVulnerabilities: 9,
    slaComplianceRate: 98.4,
    endpointsMonitored: 8420,
    managedTenants: 12,
    avgRemediationDays: 6.2,
    threatLevel: 'ELEVATED',
    tabletopsScheduled: 3
  });
  const [threatFeed, setThreatFeed] = useState([]);
  const [clients, setClients] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [findings, setFindings] = useState([]);
  const [risks, setRisks] = useState([]);
  const [managedIT, setManagedIT] = useState({
    summary: {
      totalEndpoints: 8420,
      healthyEndpoints: 8312,
      vulnerableEndpoints: 108,
      patchCompliance: 98.7,
      avgResponseMinutes: 11.4,
      openTickets: 18,
      slaMet: 99.4
    },
    tickets: [],
    endpointHealth: []
  });
  const [vendors, setVendors] = useState([]);
  const [tabletopExercises, setTabletopExercises] = useState([]);
  const [team, setTeam] = useState([]);

  // Active selections & Modals
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateEngModalOpen, setIsCreateEngModalOpen] = useState(false);
  const [isCreateFindingModalOpen, setIsCreateFindingModalOpen] = useState(false);
  const [isCreateRiskModalOpen, setIsCreateRiskModalOpen] = useState(false);
  const [isCreateVendorModalOpen, setIsCreateVendorModalOpen] = useState(false);
  const [isCreateTTXModalOpen, setIsCreateTTXModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetEngagement, setReportTargetEngagement] = useState(null);

  // Fetch initial data from API
  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, clientRes, engRes, vulnRes, riskRes, itRes, venRes, ttxRes, teamRes] = await Promise.all([
          fetch('/api/stats').then(r => r.json()).catch(() => null),
          fetch('/api/clients').then(r => r.json()).catch(() => []),
          fetch('/api/engagements').then(r => r.json()).catch(() => []),
          fetch('/api/findings').then(r => r.json()).catch(() => []),
          fetch('/api/risks').then(r => r.json()).catch(() => []),
          fetch('/api/managed-it').then(r => r.json()).catch(() => null),
          fetch('/api/vendors').then(r => r.json()).catch(() => []),
          fetch('/api/tabletop').then(r => r.json()).catch(() => []),
          fetch('/api/team').then(r => r.json()).catch(() => [])
        ]);

        if (statsRes) {
          setStats(statsRes);
          if (statsRes.threatFeed) setThreatFeed(statsRes.threatFeed);
        }
        if (clientRes && clientRes.length) setClients(clientRes);
        if (engRes && engRes.length) setEngagements(engRes);
        if (vulnRes && vulnRes.length) setFindings(vulnRes);
        if (riskRes && riskRes.length) setRisks(riskRes);
        if (itRes && itRes.summary) setManagedIT(itRes);
        if (venRes && venRes.length) setVendors(venRes);
        if (ttxRes && ttxRes.length) setTabletopExercises(ttxRes);
        if (teamRes && teamRes.length) setTeam(teamRes);
      } catch (err) {
        console.error('Error fetching cyber ops data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtered dataset helpers based on selectedClient
  const clientFilteredEngagements = selectedClient === 'ALL'
    ? engagements
    : engagements.filter(e => e.client.toLowerCase() === selectedClient.toLowerCase());

  const clientFilteredFindings = selectedClient === 'ALL'
    ? findings
    : findings.filter(f => f.client.toLowerCase() === selectedClient.toLowerCase());

  const clientFilteredTickets = selectedClient === 'ALL'
    ? managedIT.tickets
    : managedIT.tickets.filter(t => t.client.toLowerCase() === selectedClient.toLowerCase());

  const clientFilteredTabletop = selectedClient === 'ALL'
    ? tabletopExercises
    : tabletopExercises.filter(t => t.client.toLowerCase() === selectedClient.toLowerCase());

  const clientFilteredRisks = selectedClient === 'ALL'
    ? risks
    : risks.filter(r => !r.client || r.client === 'All Clients' || r.client.toLowerCase() === selectedClient.toLowerCase());

  const clientFilteredVendors = selectedClient === 'ALL'
    ? vendors
    : vendors.filter(v => !v.client || v.client === 'All Accounts' || v.client.toLowerCase() === selectedClient.toLowerCase());

  // Action methods
  const addClient = async (clientData) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      const created = await res.json();
      setClients(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const addEngagement = async (engagementData) => {
    try {
      const res = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(engagementData)
      });
      const created = await res.json();
      setEngagements(prev => [created, ...prev]);
      setStats(prev => ({ ...prev, activeEngagements: prev.activeEngagements + 1 }));
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const updateEngagementPhase = async (id, phase, progress) => {
    try {
      setEngagements(prev => prev.map(e => e.id === id ? { ...e, phase, progress } : e));
      await fetch(`/api/engagements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase, progress })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addFinding = async (findingData) => {
    try {
      const res = await fetch('/api/findings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findingData)
      });
      const created = await res.json();
      setFindings(prev => [created, ...prev]);
      if (created.severity === 'CRITICAL') {
        setStats(prev => ({ ...prev, criticalVulnerabilities: prev.criticalVulnerabilities + 1 }));
      }
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const updateFindingStatus = async (id, status) => {
    try {
      setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
      await fetch(`/api/findings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addRisk = async (riskData) => {
    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riskData)
      });
      const created = await res.json();
      setRisks(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const addVendor = async (vendorData) => {
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });
      const created = await res.json();
      setVendors(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const addTabletopExercise = async (ttxData) => {
    try {
      const res = await fetch('/api/tabletop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ttxData)
      });
      const created = await res.json();
      setTabletopExercises(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err);
    }
  };

  const addTicket = async (ticketData) => {
    try {
      const res = await fetch('/api/managed-it/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      const created = await res.json();
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

  const openReportFor = (engagement) => {
    setReportTargetEngagement(engagement || engagements[0]);
    setIsReportModalOpen(true);
  };

  return (
    <CyberContext.Provider value={{
      loading,
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
      risks,
      clientFilteredRisks,
      managedIT,
      clientFilteredTickets,
      vendors,
      clientFilteredVendors,
      tabletopExercises,
      clientFilteredTabletop,
      team,
      selectedEngagement,
      setSelectedEngagement,
      selectedFinding,
      setSelectedFinding,
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
      setReportTargetEngagement,
      openReportFor,
      addClient,
      addEngagement,
      updateEngagementPhase,
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
