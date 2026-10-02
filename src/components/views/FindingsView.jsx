import React, { useState } from 'react';
import { 
  Bug,
  ShieldCheck,
  Plus,
  FileCode,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function FindingsView() {
  const { 
    findings, 
    clientFilteredFindings,
    updateFindingStatus, 
    setIsCreateFindingModalOpen, 
    selectedClient,
    setSelectedClient,
    searchQuery 
  } = useCyber();

  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [expandedFindingId, setExpandedFindingId] = useState(null);

  // Filter
  const query = searchQuery.toLowerCase();
  const filtered = clientFilteredFindings.filter((f) => {
    const matchesSearch = 
      f.title.toLowerCase().includes(query) ||
      f.cve.toLowerCase().includes(query) ||
      f.asset.toLowerCase().includes(query) ||
      f.client.toLowerCase().includes(query) ||
      f.id.toLowerCase().includes(query);

    const matchesSev = selectedSeverity === 'ALL' || f.severity.toUpperCase() === selectedSeverity.toUpperCase();
    const matchesStat = selectedStatus === 'ALL' || f.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesSev && matchesStat;
  });

  const getSeverityStyle = (sev) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
        return 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]';
      default:
        return 'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified Mitigated':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Retest Requested':
        return 'bg-[#e8eff6] text-[#205588] border-[#205588] animate-pulse font-bold';
      case 'In Remediation':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Open':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-600" />
            Vulnerability Matrix & Security Findings
          </h1>
          <p className="text-xs text-[#64748b]">
            CVSS v3.1/v4.0 scoring, proof-of-concepts, affected target assets, and retest pipelines
          </p>
        </div>

        <button
          onClick={() => setIsCreateFindingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Discovered Vulnerability</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono shadow-2xs">
          <span className="text-[#205588] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span>Showing security vulnerabilities scoped for:</span>
            <strong className="text-[#1b2a3a] bg-white px-2 py-0.5 rounded border border-[#b4d5ff]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-[#205588] hover:text-[#195589] font-bold underline text-[11px]"
          >
            Clear Filter (Show All {findings.length} Findings)
          </button>
        </div>
      )}

      {/* Severity Filter Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'CRITICAL (9.0 - 10.0)', sev: 'CRITICAL', color: 'border-rose-200 bg-rose-50/60 text-rose-900 ring-rose-400' },
          { label: 'HIGH (7.0 - 8.9)', sev: 'HIGH', color: 'border-orange-200 bg-orange-50/60 text-orange-900 ring-orange-400' },
          { label: 'MEDIUM (4.0 - 6.9)', sev: 'MEDIUM', color: 'border-amber-200 bg-amber-50/60 text-amber-900 ring-amber-400' },
          { label: 'LOW (0.1 - 3.9)', sev: 'LOW', color: 'border-[#b4d5ff] bg-[#e8eff6] text-[#205588] ring-[#205588]' },
        ].map(item => {
          const count = clientFilteredFindings.filter(f => f.severity.toUpperCase() === item.sev).length;
          const isSelected = selectedSeverity === item.sev;
          return (
            <button
              key={item.sev}
              onClick={() => setSelectedSeverity(isSelected ? 'ALL' : item.sev)}
              className={`p-3 rounded-xl border text-left transition-all ${item.color} ${
                isSelected ? 'ring-2 shadow-sm scale-[1.02] font-bold' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider font-semibold">{item.label}</div>
              <div className="text-2xl font-bold font-mono mt-1">{count} Findings</div>
            </button>
          );
        })}
      </div>

      {/* Filter and Status Controls */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#64748b]">Status Filter:</span>
          {['ALL', 'Open', 'In Remediation', 'Retest Requested', 'Verified Mitigated'].map(stat => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedStatus === stat
                  ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-2xs'
                  : 'text-[#475569] hover:text-[#205588] hover:bg-[#e8eff6]'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#64748b]">
          Showing <strong className="text-[#205588]">{filtered.length}</strong> findings
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-[#d8e5f2] rounded-xl p-12 text-center shadow-2xs">
            <Bug className="w-10 h-10 text-[#64748b] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#1b2a3a]">No security vulnerabilities match the filter</p>
            <p className="text-xs text-[#64748b] mt-1">Adjust severity or status filters to view logged findings</p>
          </div>
        ) : (
          filtered.map((vuln) => {
            const isExpanded = expandedFindingId === vuln.id;
            return (
              <div
                key={vuln.id}
                className="bg-white border border-[#d8e5f2] hover:border-[#205588]/60 rounded-xl p-4 shadow-xs hover:shadow-md transition-all"
              >
                {/* Main Card Line */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* CVSS Badge */}
                    <div className={`px-2.5 py-1.5 rounded-lg border font-mono text-center shrink-0 ${getSeverityStyle(vuln.severity)}`}>
                      <div className="text-[10px] font-bold uppercase">{vuln.severity}</div>
                      <div className="text-lg font-black">{vuln.cvssScore}</div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#64748b]">{vuln.id}</span>
                        <span className="font-mono text-xs font-semibold px-2 py-0.2 rounded bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
                          {vuln.cve}
                        </span>
                        <span className="text-xs text-[#64748b] font-mono">• {vuln.client}</span>
                        <span className="text-[11px] text-[#94a3b8] font-mono">({vuln.engagementId})</span>
                      </div>
                      <h2 className="text-sm font-semibold text-[#1b2a3a] mt-1 hover:text-[#205588] transition-colors cursor-pointer"
                          onClick={() => setExpandedFindingId(isExpanded ? null : vuln.id)}>
                        {vuln.title}
                      </h2>
                      <div className="text-xs text-[#64748b] font-mono mt-1 flex items-center gap-2">
                        <span className="text-[#64748b]">Asset:</span>
                        <span className="text-[#1b2a3a] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#d8e5f2] truncate max-w-md font-semibold">
                          {vuln.asset}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Toggle */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-md border font-semibold ${getStatusBadge(vuln.status)}`}>
                      {vuln.status}
                    </span>

                    <button
                      onClick={() => setExpandedFindingId(isExpanded ? null : vuln.id)}
                      className="p-1.5 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#64748b] hover:text-[#205588] transition-colors border border-[#d8e5f2]"
                      title="Expand finding technical details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Technical Details & PoC */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#d8e5f2] space-y-4 animate-in fade-in duration-200">
                    {/* CVSS Vector */}
                    <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748b]">CVSS v3.1 Vector String:</span>
                      <span className="text-[#205588] font-semibold select-all">{vuln.cvssVector}</span>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#64748b] font-semibold mb-1 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-[#205588]" /> Vulnerability Description & Impact
                      </h4>
                      <p className="text-xs text-[#1b2a3a] bg-[#f8fafc] p-3 rounded-lg border border-[#d8e5f2] leading-relaxed">
                        {vuln.description}
                      </p>
                    </div>

                    {/* Remediation Guidance */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#64748b] font-semibold mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Recommended Remediation & Patching
                      </h4>
                      <p className="text-xs text-emerald-900 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 leading-relaxed font-mono">
                        {vuln.remediation}
                      </p>
                    </div>

                    {/* Status transition action bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-3 text-[#64748b] font-mono text-[11px]">
                        <span>Discovered: {vuln.discoveredDate} ({vuln.discoveredBy})</span>
                        <span>•</span>
                        <span className="text-rose-700 font-bold">Deadline: {vuln.remediationDeadline}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748b] font-mono">Update State:</span>
                        {vuln.status !== 'In Remediation' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'In Remediation')}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-mono font-semibold transition-colors"
                          >
                            Mark In Remediation
                          </button>
                        )}
                        {vuln.status !== 'Retest Requested' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'Retest Requested')}
                            className="px-2.5 py-1 rounded bg-[#e8eff6] hover:bg-[#d8e7f5] text-[#205588] border border-[#b4d5ff] text-[11px] font-mono font-semibold transition-colors"
                          >
                            Request Retest
                          </button>
                        )}
                        {vuln.status !== 'Verified Mitigated' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'Verified Mitigated')}
                            className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-[11px] font-mono transition-colors font-bold"
                          >
                            ✓ Verify Mitigated
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
