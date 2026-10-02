import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  FileText, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function ClientsView() {
  const { 
    clients, 
    engagements, 
    findings, 
    managedIT, 
    tabletopExercises, 
    setSelectedClient, 
    setActiveTab, 
    openReportFor,
    setIsCreateClientModalOpen,
    searchQuery
  } = useCyber();

  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [selectedClientModal, setSelectedClientModal] = useState(null);
  const [clientModalTab, setClientModalTab] = useState('engagements');

  const query = searchQuery.toLowerCase();
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(query) ||
      c.industry.toLowerCase().includes(query) ||
      c.primaryContact.toLowerCase().includes(query);
    const matchesSector = sectorFilter === 'ALL' || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const getClientMetrics = (clientName) => {
    const isClient = (item) => item.client.toLowerCase() === clientName.toLowerCase();
    const clientEngs = engagements.filter(isClient);
    const clientFindings = findings.filter(isClient);
    const clientTickets = managedIT.tickets.filter(isClient);
    const clientTTX = tabletopExercises.filter(isClient);
    const criticalFindings = clientFindings.filter(f => f.severity === 'CRITICAL' && f.status !== 'Verified Mitigated');

    return {
      engs: clientEngs,
      activeEngs: clientEngs.filter(e => e.status !== 'Completed'),
      findings: clientFindings,
      criticalFindings,
      tickets: clientTickets,
      ttx: clientTTX
    };
  };

  const handleSelectClientScope = (clientName) => {
    setSelectedClient(clientName);
    setActiveTab('overview');
  };

  const modalMetrics = selectedClientModal && getClientMetrics(selectedClientModal.name);

  const healthcareCount = clients.filter(c => c.sector === 'Healthcare').length;
  const financialCount = clients.filter(c => c.sector === 'Financial').length;
  const otherCount = clients.filter(c => c.sector === 'Other').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#b4d5ff]" />
            Client Accounts & Enterprise Portfolio Hub
          </h1>
          <p className="text-xs text-slate-400">
            ImageQuest specialized client practice management for Healthcare networks, Financial institutions, and Commercial accounts
          </p>
        </div>

        <button
          onClick={() => setIsCreateClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/40 border border-[#2365a3]/50 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client Account</span>
        </button>
      </div>

      {/* Sector Filter Bar */}
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400 mr-1">Client Sector:</span>
          
          <button
            onClick={() => setSectorFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              sectorFilter === 'ALL'
                ? 'bg-[#205588] text-white border border-[#2365a3] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#132b47]'
            }`}
          >
            All Accounts ({clients.length})
          </button>

          <button
            onClick={() => setSectorFilter('Healthcare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Healthcare'
                ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600 font-bold shadow-sm'
                : 'text-slate-300 hover:text-emerald-300 hover:bg-[#132b47]'
            }`}
          >
            <span>🏥 Healthcare</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              {healthcareCount}
            </span>
          </button>

          <button
            onClick={() => setSectorFilter('Financial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Financial'
                ? 'bg-[#2365a3]/40 text-[#b4d5ff] border border-[#3882c8] font-bold shadow-sm'
                : 'text-slate-300 hover:text-[#b4d5ff] hover:bg-[#132b47]'
            }`}
          >
            <span>🏦 Financial Institutions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              {financialCount}
            </span>
          </button>

          <button
            onClick={() => setSectorFilter('Other')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Other'
                ? 'bg-purple-900/50 text-purple-200 border border-purple-600 font-bold shadow-sm'
                : 'text-slate-300 hover:text-purple-300 hover:bg-[#132b47]'
            }`}
          >
            <span>🌐 Other Commercial</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
              {otherCount}
            </span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing <strong>{filteredClients.length}</strong> of {clients.length} Accounts
        </span>
      </div>

      {/* Client Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => {
          const metrics = getClientMetrics(client.name);
          const hasCritical = metrics.criticalFindings.length > 0;
          const isHealthcare = client.sector === 'Healthcare';
          const isFinancial = client.sector === 'Financial';

          return (
            <div
              key={client.id}
              className="bg-[#0f2238] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-5 shadow-sm hover:shadow-md hover:shadow-[#0b1a2d]/80 transition-all space-y-4 group relative"
            >
              {/* Header: Name, Sector Badge, Health Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-400">{client.id}</span>

                    {/* Sector Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      isHealthcare ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
                      isFinancial ? 'bg-[#2365a3]/30 text-[#b4d5ff] border-[#2365a3]/60' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {isHealthcare ? '🏥 Healthcare' : isFinancial ? '🏦 Financial' : '🌐 Other'}
                    </span>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0b1a2d] text-slate-300 border border-[#1d3e63]">
                      {client.tier}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white mt-1 group-hover:text-[#b4d5ff] transition-colors">
                    {client.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{client.industry}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Health Score</div>
                  <div className={`text-base font-black font-mono ${
                    client.healthScore >= 90 ? 'text-emerald-400' :
                    client.healthScore >= 75 ? 'text-[#b4d5ff]' :
                    'text-amber-400'
                  }`}>
                    {client.healthScore} / 100
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              {client.compliance && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Standards:</span>
                  {client.compliance.map(std => (
                    <span 
                      key={std}
                      className="px-2 py-0.5 rounded bg-[#132b47] border border-[#1d3e63] text-[10px] font-mono text-[#b4d5ff] font-semibold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              )}

              {/* Security Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-lg p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase">Engagements</span>
                  <div className="text-sm font-bold text-white mt-0.5">{metrics.activeEngs.length} Active</div>
                </div>

                <div className={`border rounded-lg p-2.5 ${
                  hasCritical ? 'bg-rose-950/30 border-rose-800/70 text-rose-300' : 'bg-[#0b1a2d] border-[#1d3e63] text-slate-300'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase">Vulnerabilities</span>
                  <div className="text-sm font-bold mt-0.5">
                    {metrics.findings.length} ({metrics.criticalFindings.length} Crit)
                  </div>
                </div>

                <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-lg p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase">SOC Tickets</span>
                  <div className="text-sm font-bold text-white mt-0.5">{metrics.tickets.length} Active</div>
                </div>
              </div>

              {/* Active Services List */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 font-semibold">Active Services Contracted:</div>
                <div className="flex flex-wrap gap-1.5">
                  {client.services.map((svc, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#0b1a2d] text-slate-300 border border-[#1d3e63] text-[11px] font-mono"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Account Contacts & Retainer */}
              <div className="text-xs font-mono text-slate-400 flex justify-between pt-1 border-t border-[#1d3e63]">
                <span>Lead: <strong className="text-slate-200">{client.leadPartner}</strong></span>
                <span className="text-emerald-400 font-semibold">{client.budget}</span>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedClientModal(client)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132b47] hover:bg-[#195589] text-[#b4d5ff] hover:text-white border border-[#1d3e63] text-xs font-mono transition-colors"
                >
                  <span>360° Account Hub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#b4d5ff]" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectClientScope(client.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white border border-[#2365a3]/50 text-xs font-mono transition-colors font-semibold shadow-sm"
                    title={`Scope entire dashboard to ${client.name}`}
                  >
                    <span>Filter Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const eng = metrics.engs[0] || engagements[0];
                      openReportFor(eng);
                    }}
                    className="p-1.5 rounded-lg bg-[#132b47] hover:bg-[#195589] text-slate-400 hover:text-white border border-[#1d3e63] transition-colors"
                    title="Generate Audit Deliverable"
                  >
                    <FileText className="w-4 h-4 text-[#b4d5ff]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 360° Client Detailed Drilldown Modal */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0f2238] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedClientModal.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63]">
                      {selectedClientModal.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedClientModal.industry} • Contact: {selectedClientModal.primaryContact} ({selectedClientModal.email})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSelectClientScope(selectedClientModal.name);
                    setSelectedClientModal(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs font-mono transition-colors border border-[#2365a3]/50 shadow-sm"
                >
                  Scope All Views to this Client
                </button>
                <button
                  onClick={() => setSelectedClientModal(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47] ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 py-2.5 bg-[#0f2238]/70 border-b border-[#1d3e63] flex items-center gap-2 shrink-0">
              {[
                { id: 'engagements', label: 'Engagements' },
                { id: 'findings', label: 'Vulnerabilities & PoCs' },
                { id: 'managedIT', label: 'SOC & SLA Tickets' },
                { id: 'tabletop', label: 'Crisis Simulations (TTX)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setClientModalTab(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    clientModalTab === tab.id
                      ? 'bg-[#205588] text-white border border-[#2365a3] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#132b47]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {clientModalTab === 'engagements' && (
                <div className="space-y-3">
                  {modalMetrics.engs.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-mono">No engagements on record for this client yet.</div>
                  )}
                  {modalMetrics.engs.map(e => (
                    <div key={e.id} className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[#b4d5ff] font-bold">{e.id}</span>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{e.title}</h4>
                        </div>
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {e.phase} ({e.progress}%)
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs font-mono">Scope: {e.scope}</p>
                      <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-1 border-t border-slate-800">
                        <span>Lead: {e.leadAnalyst}</span>
                        <span>{e.spentHours} / {e.budgetHours} hrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {clientModalTab === 'findings' && (
                <div className="space-y-3">
                  {modalMetrics.findings.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono">No vulnerabilities logged for this client yet.</div>
                  ) : (
                    modalMetrics.findings.map(f => (
                      <div key={f.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                              f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-orange-950 text-orange-300 border-orange-800'
                            }`}>
                              {f.severity} (CVSS {f.cvssScore})
                            </span>
                            <span className="font-mono text-[#b4d5ff]">{f.cve}</span>
                            <span className="font-semibold text-white">{f.title}</span>
                          </div>
                          <span className="font-mono text-xs text-slate-400">{f.status}</span>
                        </div>
                        <p className="text-slate-300 text-xs bg-slate-900 p-2.5 rounded border border-slate-800">{f.description}</p>
                        <p className="text-emerald-300 text-xs font-mono bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                          Remediation: {f.remediation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {clientModalTab === 'managedIT' && (
                <div className="space-y-3">
                  {modalMetrics.tickets.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono">Zero open SOC escalation tickets for this client. 100% SLA compliant.</div>
                  ) : (
                    modalMetrics.tickets.map(t => (
                      <div key={t.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">{t.id}</span>
                            <span className="font-mono text-xs text-rose-400 font-bold">{t.priority}</span>
                            <span className="font-semibold text-white">• {t.title}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-1">Assigned: {t.assignedTo}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-[10px] text-slate-500">SLA REMAINING</div>
                          <div className="text-amber-400 font-bold">{t.slaRemaining}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {clientModalTab === 'tabletop' && (
                <div className="space-y-3">
                  {modalMetrics.ttx.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono">No crisis simulations scheduled for this client yet.</div>
                  ) : (
                    modalMetrics.ttx.map(t => (
                      <div key={t.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-purple-400 font-bold">{t.id} • {t.status}</span>
                          <span className="font-mono text-xs text-slate-400">{t.scheduledDate}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white">{t.title}</h4>
                        <p className="text-slate-300 text-xs bg-slate-900 p-2.5 rounded border border-slate-800">{t.scenario}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
