import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Bug, 
  Server, 
  Clock, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Layers,
  Radio
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { countFindingsBySeverity } from '../../utils/helpers';

export default function OverviewView() {
  const { 
    stats, 
    threatFeed, 
    findings, 
    managedIT,
    selectedClient,
    setSelectedClient,
    clientFilteredEngagements,
    clientFilteredFindings,
    setActiveTab, 
    openReportFor,
    updateFindingStatus
  } = useCyber();

  const criticalFindings = clientFilteredFindings.filter(f => f.severity === 'CRITICAL' && f.status !== 'Verified Mitigated');
  const activeEngagements = clientFilteredEngagements.filter(e => e.status !== 'Completed');

  return (
    <div className="space-y-6">
      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#132b47] border border-[#2365a3]/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2 text-[#b4d5ff]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2365a3] animate-pulse"></span>
            <span>Operations Telemetry scoped for: <strong className="text-white text-sm bg-[#0b1a2d] px-2 py-0.5 rounded border border-[#2365a3]/60">{selectedClient}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('clients')}
              className="px-2.5 py-1 rounded bg-[#0b1a2d] hover:bg-[#1a385c] text-[#b4d5ff] text-xs transition-colors border border-[#1d3e63]"
            >
              360° Client Profile
            </button>
            <button 
              onClick={() => setSelectedClient('ALL')}
              className="px-2.5 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white text-xs transition-colors font-semibold"
            >
              Reset to All Accounts
            </button>
          </div>
        </div>
      )}
      {/* Top Banner: Threat Intel Stream */}
      <div className="bg-gradient-to-r from-[#0f2238] via-[#0f2238] to-[#132b47] border border-[#1d3e63] rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> LIVE THREAT INTELLIGENCE BROADCAST
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Source: CISA KEV & ImageQuest Threat Lab // Real-Time Pulse
          </span>
        </div>

        {/* Ticker Items */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {threatFeed.map((threat) => (
            <div 
              key={threat.id}
              className="bg-[#0b1a2d] border border-[#1d3e63] rounded-lg p-2.5 flex items-start gap-2.5 hover:border-[#2365a3] transition-colors"
            >
              <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                threat.severity === 'CRITICAL' 
                  ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                  : threat.severity === 'HIGH' 
                  ? 'bg-orange-950 text-orange-400 border border-orange-800' 
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {threat.severity}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-200 font-medium line-clamp-1">
                  {threat.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex justify-between">
                  <span>{threat.source}</span>
                  <span>{threat.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Engagements */}
        <div 
          onClick={() => setActiveTab('engagements')}
          className="bg-[#0f2238] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#0b1a2d]/80 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Engagements</span>
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{activeEngagements.length}</span>
            <span className="text-xs text-[#b4d5ff] font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% On-Track
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>{activeEngagements.filter(e => e.type.includes('Penetration')).length} Pen Tests</span>
            <span>{activeEngagements.filter(e => e.type.includes('Compliance')).length} Audits</span>
          </div>
        </div>

        {/* Critical Vulnerabilities */}
        <div 
          onClick={() => setActiveTab('findings')}
          className="bg-[#0f2238] border border-[#1d3e63] hover:border-rose-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-rose-950/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Open Critical CVSS</span>
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/50 group-hover:scale-110 transition-transform">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">{criticalFindings.length}</span>
            <span className="text-xs text-rose-400 font-mono">CVSS 9.0+</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>Avg MTTR: {stats.avgRemediationDays} Days</span>
            <span className="text-rose-400 font-mono font-medium">Urgent Triage</span>
          </div>
        </div>

        {/* Managed IT & Endpoints */}
        <div 
          onClick={() => setActiveTab('managedIT')}
          className="bg-[#0f2238] border border-[#1d3e63] hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-950/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Managed IT Endpoints</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 group-hover:scale-110 transition-transform">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.endpointsMonitored.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-mono">{stats.managedTenants} Tenants</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>{managedIT.summary.patchCompliance}% Patch Compliance</span>
            <span className="text-emerald-400 font-mono">EDR Active</span>
          </div>
        </div>

        {/* Incident Response & SLA */}
        <div 
          onClick={() => setActiveTab('managedIT')}
          className="bg-[#0f2238] border border-[#1d3e63] hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-950/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">SOC SLA Met Rate</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/50 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{stats.slaComplianceRate}%</span>
            <span className="text-xs text-slate-400 font-mono">Target: 99.0%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>Avg Response: {managedIT.summary.avgResponseMinutes} min</span>
            <span className="text-[#b4d5ff] font-mono">Tier 1-3 Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Engagements vs. Critical Findings Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Engagements Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f2238] border border-[#1d3e63] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#b4d5ff]" />
                Active Cyber Engagements & Milestones
              </h2>
              <p className="text-xs text-slate-400">Current offensive and defensive security operations</p>
            </div>
            <button
              onClick={() => setActiveTab('engagements')}
              className="text-xs text-[#b4d5ff] hover:text-white font-mono flex items-center gap-1 group"
            >
              View All ({clientFilteredEngagements.length})
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {activeEngagements.slice(0, 4).map((eng) => {
              const counts = countFindingsBySeverity(findings.filter(f => f.engagementId === eng.id));
              return (
                <div 
                  key={eng.id}
                  className="bg-[#0b1a2d] border border-[#1d3e63] hover:border-[#2365a3] rounded-lg p-3.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#b4d5ff]">{eng.id}</span>
                        <span className="text-xs font-medium text-slate-400">• {eng.client}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-0.5">{eng.title}</h3>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                      eng.type.includes('Penetration') ? 'bg-[#2365a3]/30 text-[#b4d5ff] border border-[#2365a3]/60' :
                      eng.type.includes('Red') ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      eng.type.includes('Compliance') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63]'
                    }`}>
                      {eng.type}
                    </span>
                  </div>

                  {/* Phase & Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-mono">
                        Phase: <strong className="text-slate-200">{eng.phase}</strong>
                      </span>
                      <span className="font-mono text-[#b4d5ff]">{eng.progress}%</span>
                    </div>
                    <div className="w-full bg-[#132b47] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#205588] to-[#2365a3] h-full rounded-full transition-all" 
                        style={{ width: `${eng.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer metrics */}
                  <div className="mt-3 pt-2.5 border-t border-[#1d3e63] flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono">Lead: {eng.leadAnalyst}</span>
                      <span>•</span>
                      <span className="text-[11px] font-mono">{eng.spentHours}/{eng.budgetHours} hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        {counts.critical > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60">
                            {counts.critical} Crit
                          </span>
                        )}
                        {counts.high > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800/60">
                            {counts.high} High
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => openReportFor(eng)}
                        className="text-xs text-[#b4d5ff] hover:text-white font-mono underline underline-offset-2 ml-1"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Critical Findings Immediate Triage (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f2238] border border-[#1d3e63] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Critical Vulnerability Queue
              </h2>
              <p className="text-xs text-slate-400">High impact exploits awaiting remediation or re-test</p>
            </div>
            <button
              onClick={() => setActiveTab('findings')}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 group"
            >
              All Findings
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalFindings.map((vuln) => (
              <div 
                key={vuln.id}
                className="bg-slate-950/70 border border-rose-950/80 hover:border-rose-800/60 rounded-lg p-3.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-900/80 text-rose-200 border border-rose-700">
                      CVSS {vuln.cvssScore}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{vuln.cve}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    vuln.status === 'Retest Requested' 
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {vuln.status}
                  </span>
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-100 line-clamp-2">
                  {vuln.title}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
                  Asset: {vuln.asset}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Client: <strong className="text-slate-300">{vuln.client}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {vuln.status !== 'Verified Mitigated' && (
                      <button
                        onClick={() => updateFindingStatus(vuln.id, 'Verified Mitigated')}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/70 transition-colors"
                      >
                        ✓ Verify Fix
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cyber Services Hub Quick Cards */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Enterprise Cybersecurity Service Practice Lines
          </h2>
          <span className="text-xs text-slate-400 font-mono">Full-Scope Operations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'Penetration Testing', icon: Bug, tab: 'engagements', desc: 'Web, Network, API & Cloud' },
            { title: 'Managed IT & SOC', icon: Server, tab: 'managedIT', desc: '24/7 EDR & Ticket SLAs' },
            { title: 'Compliance & Audits', icon: CheckCircle2, tab: 'engagements', desc: 'SOC 2, ISO 27001, CMMC' },
            { title: 'Vendor TPRM', icon: ArrowUpRight, tab: 'vendors', desc: 'Supply Chain Risk Scoring' },
            { title: 'Risk Assessments', icon: AlertTriangle, tab: 'risks', desc: '5x5 Enterprise Risk Matrix' },
            { title: 'Tabletop Exercises', icon: Sparkles, tab: 'tabletop', desc: 'Simulated Crisis Drills' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.tab)}
                className="bg-[#0f2238] hover:bg-[#132b47] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-3.5 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#0b1a2d] border border-[#1d3e63] w-fit text-[#b4d5ff] group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-2.5 text-xs font-semibold text-white group-hover:text-[#b4d5ff] transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
