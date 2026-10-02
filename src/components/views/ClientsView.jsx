import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  FileText, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
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
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#205588]" />
            Client Accounts & Enterprise Portfolio Hub
          </h1>
          <p className="text-xs text-[#64748b]">
            Enterprise cybersecurity practice management for Healthcare networks, Financial institutions, and Commercial accounts
          </p>
        </div>

        <button
          onClick={() => setIsCreateClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client Account</span>
        </button>
      </div>

      {/* Sector Filter Bar */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#64748b] mr-1">Client Sector:</span>
          
          <button
            onClick={() => setSectorFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              sectorFilter === 'ALL'
                ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-2xs'
                : 'text-[#475569] hover:bg-[#e8eff6] hover:text-[#205588]'
            }`}
          >
            All Accounts ({clients.length})
          </button>

          <button
            onClick={() => setSectorFilter('Healthcare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Healthcare'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs'
                : 'text-[#475569] hover:text-emerald-700 hover:bg-emerald-50/60'
            }`}
          >
            <span>🏥 Healthcare</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {healthcareCount}
            </span>
          </button>

          <button
            onClick={() => setSectorFilter('Financial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Financial'
                ? 'bg-[#e8eff6] text-[#205588] border border-[#b4d5ff] font-bold shadow-2xs'
                : 'text-[#475569] hover:text-[#205588] hover:bg-[#e8eff6]'
            }`}
          >
            <span>🏦 Financial Institutions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-[#205588] border border-[#b4d5ff]">
              {financialCount}
            </span>
          </button>

          <button
            onClick={() => setSectorFilter('Other')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              sectorFilter === 'Other'
                ? 'bg-purple-50 text-purple-800 border border-purple-300 font-bold shadow-2xs'
                : 'text-[#475569] hover:text-purple-700 hover:bg-purple-50/60'
            }`}
          >
            <span>🌐 Other Commercial</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {otherCount}
            </span>
          </button>
        </div>

        <span className="text-xs font-mono text-[#64748b]">
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
              className="bg-white border border-[#d8e5f2] hover:border-[#205588]/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 group relative"
            >
              {/* Header: Name, Sector Badge, Health Score */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#64748b]">{client.id}</span>

                    {/* Sector Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      isHealthcare ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      isFinancial ? 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {isHealthcare ? '🏥 Healthcare' : isFinancial ? '🏦 Financial' : '🌐 Other'}
                    </span>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f0f5fa] text-[#475569] border border-[#d8e5f2]">
                      {client.tier}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#1b2a3a] mt-1 group-hover:text-[#205588] transition-colors">
                    {client.name}
                  </h2>
                  <p className="text-xs text-[#64748b] font-mono mt-0.5 truncate">{client.industry}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-[#64748b] uppercase">Health Score</div>
                  <div className={`text-base font-black font-mono ${
                    client.healthScore >= 90 ? 'text-emerald-700' :
                    client.healthScore >= 75 ? 'text-[#205588]' :
                    'text-amber-700'
                  }`}>
                    {client.healthScore} / 100
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              {client.compliance && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase font-semibold">Standards:</span>
                  {client.compliance.map(std => (
                    <span 
                      key={std}
                      className="px-2 py-0.5 rounded bg-[#e8eff6] border border-[#b4d5ff] text-[10px] font-mono text-[#205588] font-semibold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              )}

              {/* Security Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-lg p-2.5">
                  <span className="text-[10px] text-[#64748b] uppercase">Engagements</span>
                  <div className="text-sm font-bold text-[#1b2a3a] mt-0.5">{metrics.activeEngs.length} Active</div>
                </div>

                <div className={`border rounded-lg p-2.5 ${
                  hasCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-[#f0f5fa] border-[#d8e5f2] text-[#1b2a3a]'
                }`}>
                  <span className="text-[10px] text-[#64748b] uppercase">Vulnerabilities</span>
                  <div className="text-sm font-bold mt-0.5">
                    {metrics.findings.length} ({metrics.criticalFindings.length} Crit)
                  </div>
                </div>

                <div className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-lg p-2.5">
                  <span className="text-[10px] text-[#64748b] uppercase">SOC Tickets</span>
                  <div className="text-sm font-bold text-[#1b2a3a] mt-0.5">{metrics.tickets.length} Active</div>
                </div>
              </div>

              {/* Active Services List */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-[#64748b] font-semibold">Active Services Contracted:</div>
                <div className="flex flex-wrap gap-1.5">
                  {client.services.map((svc, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#f0f5fa] text-[#475569] border border-[#d8e5f2] text-[11px] font-mono"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Account Contacts & Retainer */}
              <div className="text-xs font-mono text-[#64748b] flex justify-between pt-1 border-t border-[#d8e5f2]">
                <span>Lead: <strong className="text-[#1b2a3a]">{client.leadPartner}</strong></span>
                <span className="text-emerald-700 font-bold">{client.budget}</span>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedClientModal(client)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8eff6] hover:bg-[#d8e7f5] text-[#205588] border border-[#b4d5ff] text-xs font-mono font-semibold transition-colors"
                >
                  <span>360° Account Hub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#205588]" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectClientScope(client.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white text-xs font-mono transition-colors font-semibold shadow-2xs"
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
                    className="p-1.5 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#205588] border border-[#d8e5f2] transition-colors"
                    title="Generate Audit Deliverable"
                  >
                    <FileText className="w-4 h-4 text-[#205588]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 360° Client Detailed Drilldown Modal */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#1b2a3a]">{selectedClientModal.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8eff6] text-[#205588] border border-[#b4d5ff] font-semibold">
                      {selectedClientModal.tier}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] font-mono">
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
                  className="px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs font-mono transition-colors shadow-2xs"
                >
                  Scope All Views to this Client
                </button>
                <button
                  onClick={() => setSelectedClientModal(null)}
                  className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#f0f5fa] ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="px-6 py-2.5 bg-white border-b border-[#d8e5f2] flex items-center gap-2 shrink-0">
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
                      ? 'bg-[#205588] text-white font-bold'
                      : 'text-[#475569] hover:bg-[#e8eff6] hover:text-[#205588]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans bg-[#f8fafc]">
              {clientModalTab === 'engagements' && (
                <div className="space-y-3">
                  {modalMetrics.engs.length === 0 && (
                    <div className="p-8 text-center text-[#64748b] font-mono">No engagements on record for this client yet.</div>
                  )}
                  {modalMetrics.engs.map(e => (
                    <div key={e.id} className="bg-white border border-[#d8e5f2] rounded-xl p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[#205588] font-bold">{e.id}</span>
                          <h4 className="text-sm font-semibold text-[#1b2a3a] mt-0.5">{e.title}</h4>
                        </div>
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#f0f5fa] border border-[#d8e5f2] text-[#475569] font-semibold">
                          {e.phase} ({e.progress}%)
                        </span>
                      </div>
                      <p className="text-[#64748b] text-xs font-mono">Scope: {e.scope}</p>
                      <div className="text-[11px] font-mono text-[#64748b] flex justify-between pt-1 border-t border-[#d8e5f2]">
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
                    <div className="p-8 text-center text-[#64748b] font-mono">No vulnerabilities logged for this client yet.</div>
                  ) : (
                    modalMetrics.findings.map(f => (
                      <div key={f.id} className="bg-white border border-[#d8e5f2] rounded-xl p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                              f.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {f.severity} (CVSS {f.cvssScore})
                            </span>
                            <span className="font-mono text-[#205588] font-semibold">{f.cve}</span>
                            <span className="font-semibold text-[#1b2a3a]">{f.title}</span>
                          </div>
                          <span className="font-mono text-xs text-[#64748b]">{f.status}</span>
                        </div>
                        <p className="text-[#475569] text-xs bg-[#f8fafc] p-2.5 rounded border border-[#d8e5f2]">{f.description}</p>
                        <p className="text-emerald-800 text-xs font-mono bg-emerald-50 p-2 rounded border border-emerald-200">
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
                    <div className="p-8 text-center text-[#64748b] font-mono">Zero open SOC escalation tickets for this client. 100% SLA compliant.</div>
                  ) : (
                    modalMetrics.tickets.map(t => (
                      <div key={t.id} className="bg-white border border-[#d8e5f2] rounded-xl p-4 flex items-center justify-between shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#64748b]">{t.id}</span>
                            <span className="font-mono text-xs text-rose-700 font-bold">{t.priority}</span>
                            <span className="font-semibold text-[#1b2a3a]">• {t.title}</span>
                          </div>
                          <div className="text-xs text-[#64748b] font-mono mt-1">Assigned: {t.assignedTo}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-[10px] text-[#64748b]">SLA REMAINING</div>
                          <div className="text-amber-700 font-bold">{t.slaRemaining}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {clientModalTab === 'tabletop' && (
                <div className="space-y-3">
                  {modalMetrics.ttx.length === 0 ? (
                    <div className="p-8 text-center text-[#64748b] font-mono">No crisis simulations scheduled for this client yet.</div>
                  ) : (
                    modalMetrics.ttx.map(t => (
                      <div key={t.id} className="bg-white border border-[#d8e5f2] rounded-xl p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-purple-700 font-bold">{t.id} • {t.status}</span>
                          <span className="font-mono text-xs text-[#64748b]">{t.scheduledDate}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#1b2a3a]">{t.title}</h4>
                        <p className="text-[#475569] text-xs bg-[#f8fafc] p-2.5 rounded border border-[#d8e5f2]">{t.scenario}</p>
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
