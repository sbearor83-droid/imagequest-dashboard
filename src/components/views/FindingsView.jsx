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
        return 'bg-rose-950/80 text-rose-300 border-rose-700/80';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-700/80';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80';
      case 'LOW':
        return 'bg-[#132b47] text-[#b4d5ff] border-[#2365a3]';
      default:
        return 'bg-[#132b47] text-slate-300 border-[#1d3e63]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified Mitigated':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Retest Requested':
        return 'bg-[#205588]/40 text-[#b4d5ff] border-[#2365a3] animate-pulse';
      case 'In Remediation':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Open':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      default:
        return 'bg-[#132b47] text-slate-300 border-[#1d3e63]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            Vulnerability Matrix & Security Findings
          </h1>
          <p className="text-xs text-slate-400">
            CVSS v3.1/v4.0 scoring, proof-of-concepts, affected target assets, and retest pipelines
          </p>
        </div>

        <button
          onClick={() => setIsCreateFindingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Discovered Vulnerability</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#0f2238] border border-[#2365a3]/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#b4d5ff] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2365a3] animate-ping" />
            <span>Showing security vulnerabilities scoped for:</span>
            <strong className="text-white bg-[#132b47] px-2 py-0.5 rounded border border-[#2365a3]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear Filter (Show All {findings.length} Findings)
          </button>
        </div>
      )}

      {/* Severity Filter Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'CRITICAL (9.0 - 10.0)', sev: 'CRITICAL', color: 'border-rose-800/80 bg-rose-950/30 text-rose-300 ring-[#2365a3]' },
          { label: 'HIGH (7.0 - 8.9)', sev: 'HIGH', color: 'border-orange-800/80 bg-orange-950/30 text-orange-300 ring-[#2365a3]' },
          { label: 'MEDIUM (4.0 - 6.9)', sev: 'MEDIUM', color: 'border-amber-800/80 bg-amber-950/30 text-amber-300 ring-[#2365a3]' },
          { label: 'LOW (0.1 - 3.9)', sev: 'LOW', color: 'border-[#1d3e63] bg-[#0f2238] text-[#b4d5ff] ring-[#2365a3]' },
        ].map(item => {
          const count = clientFilteredFindings.filter(f => f.severity.toUpperCase() === item.sev).length;
          const isSelected = selectedSeverity === item.sev;
          return (
            <button
              key={item.sev}
              onClick={() => setSelectedSeverity(isSelected ? 'ALL' : item.sev)}
              className={`p-3 rounded-xl border text-left transition-all ${item.color} ${
                isSelected ? 'ring-2 shadow-md shadow-[#2365a3]/30 scale-[1.02]' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider font-semibold">{item.label}</div>
              <div className="text-2xl font-bold font-mono mt-1">{count} Findings</div>
            </button>
          );
        })}
      </div>

      {/* Filter and Status Controls */}
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Status Filter:</span>
          {['ALL', 'Open', 'In Remediation', 'Retest Requested', 'Verified Mitigated'].map(stat => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedStatus === stat
                  ? 'bg-[#205588] text-white border border-[#2365a3] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#132b47]'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing <strong className="text-[#b4d5ff]">{filtered.length}</strong> findings
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0f2238]/60 border border-dashed border-[#1d3e63] rounded-xl p-12 text-center">
            <Bug className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No security vulnerabilities match the filter</p>
            <p className="text-xs text-slate-500 mt-1">Adjust severity or status filters to view logged findings</p>
          </div>
        ) : (
          filtered.map((vuln) => {
            const isExpanded = expandedFindingId === vuln.id;
            return (
              <div
                key={vuln.id}
                className="bg-[#0f2238] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-4 shadow-sm transition-all"
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
                        <span className="font-mono text-xs font-bold text-slate-400">{vuln.id}</span>
                        <span className="font-mono text-xs font-semibold px-2 py-0.2 rounded bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63]">
                          {vuln.cve}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">• {vuln.client}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({vuln.engagementId})</span>
                      </div>
                      <h2 className="text-sm font-semibold text-white mt-1 hover:text-[#b4d5ff] transition-colors cursor-pointer"
                          onClick={() => setExpandedFindingId(isExpanded ? null : vuln.id)}>
                        {vuln.title}
                      </h2>
                      <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                        <span className="text-slate-500">Asset:</span>
                        <span className="text-slate-300 bg-[#0b1a2d] px-2 py-0.5 rounded border border-[#1d3e63] truncate max-w-md">
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
                      className="p-1.5 rounded-lg bg-[#132b47] hover:bg-[#205588] text-slate-400 hover:text-white transition-colors"
                      title="Expand finding technical details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Technical Details & PoC */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1d3e63] space-y-4">
                    {/* CVSS Vector */}
                    <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">CVSS v3.1 Vector String:</span>
                      <span className="text-[#b4d5ff] font-semibold select-all">{vuln.cvssVector}</span>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-[#2365a3]" /> Vulnerability Description & Impact
                      </h4>
                      <p className="text-xs text-slate-300 bg-[#0b1a2d] p-3 rounded-lg border border-[#1d3e63] leading-relaxed">
                        {vuln.description}
                      </p>
                    </div>

                    {/* Remediation Guidance */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Recommended Remediation & Patching
                      </h4>
                      <p className="text-xs text-slate-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 leading-relaxed font-mono">
                        {vuln.remediation}
                      </p>
                    </div>

                    {/* Status transition action bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                        <span>Discovered: {vuln.discoveredDate} ({vuln.discoveredBy})</span>
                        <span>•</span>
                        <span className="text-rose-400">Deadline: {vuln.remediationDeadline}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">Update State:</span>
                        {vuln.status !== 'In Remediation' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'In Remediation')}
                            className="px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-mono transition-colors"
                          >
                            Mark In Remediation
                          </button>
                        )}
                        {vuln.status !== 'Retest Requested' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'Retest Requested')}
                            className="px-2.5 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white border border-[#2365a3] text-[11px] font-mono transition-colors"
                          >
                            Request Retest
                          </button>
                        )}
                        {vuln.status !== 'Verified Mitigated' && (
                          <button
                            onClick={() => updateFindingStatus(vuln.id, 'Verified Mitigated')}
                            className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-mono transition-colors font-bold"
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
