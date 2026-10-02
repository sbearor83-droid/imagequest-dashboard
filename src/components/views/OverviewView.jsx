import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Bug, 
  Server, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight, 
  Activity, 
  Radio, 
  Terminal,
  Layers,
  Sparkles,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { countFindingsBySeverity } from '../../utils/helpers';

export default function OverviewView() {
  const { 
    stats, 
    threatFeed, 
    engagements, 
    findings, 
    managedIT, 
    setActiveTab, 
    updateFindingStatus, 
    openReportFor,
    selectedClient,
    setSelectedClient,
    clientFilteredEngagements,
    clientFilteredFindings
  } = useCyber();

  const activeEngagements = clientFilteredEngagements.filter(e => e.status !== 'Completed');
  const criticalFindings = clientFilteredFindings.filter(f => f.severity === 'CRITICAL' && f.status !== 'Verified Mitigated');

  return (
    <div className="space-y-6">
      {/* Scoped Client Alert Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span className="text-[#64748b]">Scoped Operational Dashboard:</span>
            <span className="text-[#1b2a3a] font-bold">{selectedClient}</span>
            <span className="text-[#205588] font-semibold">({clientFilteredEngagements.length} Engagements • {clientFilteredFindings.length} Vulnerabilities)</span>
          </div>
          <button
            onClick={() => setSelectedClient('ALL')}
            className="text-xs font-mono text-[#205588] hover:text-[#195589] font-bold underline"
          >
            Show All Accounts
          </button>
        </div>
      )}

      {/* Top Banner: Threat Intel Stream */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> LIVE THREAT INTELLIGENCE BROADCAST
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#64748b]">
            Source: CISA KEV & Global Threat Intelligence Lab // Real-Time Pulse
          </span>
        </div>

        {/* Ticker Items */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {threatFeed.map((threat) => (
            <div 
              key={threat.id}
              className="bg-[#f8fafc] border border-[#d8e5f2] rounded-lg p-2.5 flex items-start gap-2.5 hover:border-[#205588] transition-colors"
            >
              <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                threat.severity === 'CRITICAL' 
                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                  : threat.severity === 'HIGH' 
                  ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {threat.severity}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[#1b2a3a] font-medium line-clamp-1">
                  {threat.title}
                </div>
                <div className="text-[10px] text-[#64748b] font-mono mt-0.5 flex justify-between">
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
          className="bg-white border border-[#d8e5f2] hover:border-[#205588] rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Active Engagements</span>
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b2a3a] font-mono">{activeEngagements.length}</span>
            <span className="text-xs text-[#205588] font-mono flex items-center font-semibold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% On-Track
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748b] flex justify-between">
            <span>{activeEngagements.filter(e => e.type.includes('Penetration')).length} Pen Tests</span>
            <span>{activeEngagements.filter(e => e.type.includes('Compliance')).length} Audits</span>
          </div>
        </div>

        {/* Critical Vulnerabilities */}
        <div 
          onClick={() => setActiveTab('findings')}
          className="bg-white border border-[#d8e5f2] hover:border-rose-400 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Open Critical CVSS</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 group-hover:scale-110 transition-transform">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700 font-mono">{criticalFindings.length}</span>
            <span className="text-xs text-rose-700 font-mono font-bold">CVSS 9.0+</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748b] flex justify-between">
            <span>Avg MTTR: {stats.avgRemediationDays} Days</span>
            <span className="text-rose-700 font-mono font-bold">Urgent Triage</span>
          </div>
        </div>

        {/* Managed IT & Endpoints */}
        <div 
          onClick={() => setActiveTab('managedIT')}
          className="bg-white border border-[#d8e5f2] hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Managed IT Endpoints</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-110 transition-transform">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b2a3a] font-mono">{stats.endpointsMonitored.toLocaleString()}</span>
            <span className="text-xs text-emerald-700 font-mono font-semibold">{stats.managedTenants} Tenants</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748b] flex justify-between">
            <span>{managedIT.summary?.patchCompliance || 98.7}% Patch Compliance</span>
            <span className="text-emerald-700 font-mono font-semibold">EDR Active</span>
          </div>
        </div>

        {/* Incident Response & SLA */}
        <div 
          onClick={() => setActiveTab('managedIT')}
          className="bg-white border border-[#d8e5f2] hover:border-amber-500 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">SOC SLA Met Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono">{stats.slaComplianceRate}%</span>
            <span className="text-xs text-[#64748b] font-mono">Target: 99.0%</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748b] flex justify-between">
            <span>Avg Response: {managedIT.summary?.avgResponseMinutes || 11.4} min</span>
            <span className="text-[#205588] font-mono font-semibold">Tier 1-3 Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Engagements vs. Critical Findings Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Engagements Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#205588]" />
                Active Cyber Engagements & Milestones
              </h2>
              <p className="text-xs text-[#64748b]">Current offensive and defensive security operations</p>
            </div>
            <button
              onClick={() => setActiveTab('engagements')}
              className="text-xs text-[#205588] hover:text-[#195589] font-mono flex items-center gap-1 font-bold group"
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
                  className="bg-[#f8fafc] border border-[#d8e5f2] hover:border-[#205588] rounded-lg p-3.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#205588]">{eng.id}</span>
                        <span className="text-xs font-medium text-[#64748b]">• {eng.client}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1b2a3a] mt-0.5">{eng.title}</h3>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                      eng.type.includes('Penetration') ? 'bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]' :
                      eng.type.includes('Red') ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      eng.type.includes('Compliance') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-[#f0f5fa] text-[#475569] border border-[#d8e5f2]'
                    }`}>
                      {eng.type}
                    </span>
                  </div>

                  {/* Phase & Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748b] font-mono">
                        Phase: <strong className="text-[#1b2a3a]">{eng.phase}</strong>
                      </span>
                      <span className="font-mono text-[#205588] font-bold">{eng.progress}%</span>
                    </div>
                    <div className="w-full bg-[#e8eff6] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#205588] to-[#2365a3] h-full rounded-full transition-all" 
                        style={{ width: `${eng.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer metrics */}
                  <div className="mt-3 pt-2.5 border-t border-[#d8e5f2] flex items-center justify-between text-xs text-[#64748b]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono">Lead: {eng.leadAnalyst}</span>
                      <span>•</span>
                      <span className="text-[11px] font-mono">{eng.spentHours}/{eng.budgetHours} hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        {counts.critical > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                            {counts.critical} Crit
                          </span>
                        )}
                        {counts.high > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 font-bold">
                            {counts.high} High
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => openReportFor(eng)}
                        className="text-xs text-[#205588] hover:text-[#195589] font-mono font-bold underline underline-offset-2 ml-1"
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
        <div className="lg:col-span-5 bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Critical Vulnerability Queue
              </h2>
              <p className="text-xs text-[#64748b]">High impact exploits awaiting remediation or re-test</p>
            </div>
            <button
              onClick={() => setActiveTab('findings')}
              className="text-xs text-rose-700 hover:text-rose-800 font-mono font-bold flex items-center gap-1 group"
            >
              All Findings
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalFindings.map((vuln) => (
              <div 
                key={vuln.id}
                className="bg-rose-50/40 border border-rose-200 hover:border-rose-400 rounded-lg p-3.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-600 text-white">
                      CVSS {vuln.cvssScore}
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">{vuln.cve}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    vuln.status === 'Retest Requested' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {vuln.status}
                  </span>
                </div>

                <div className="mt-2 text-xs font-semibold text-[#1b2a3a] line-clamp-2">
                  {vuln.title}
                </div>
                <div className="mt-1 text-[11px] text-[#64748b] font-mono truncate">
                  Asset: {vuln.asset}
                </div>

                <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#64748b] font-mono">
                    Client: <strong className="text-[#1b2a3a]">{vuln.client}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {vuln.status !== 'Verified Mitigated' && (
                      <button
                        onClick={() => updateFindingStatus(vuln.id, 'Verified Mitigated')}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-bold transition-colors"
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
          <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide">
            Enterprise Cybersecurity Service Practice Lines
          </h2>
          <span className="text-xs text-[#64748b] font-mono">Full-Scope Operations</span>
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
                className="bg-white hover:bg-[#e8eff6] border border-[#d8e5f2] hover:border-[#205588] rounded-xl p-3.5 text-left transition-all group shadow-2xs"
              >
                <div className="p-2 rounded-lg bg-[#f0f5fa] border border-[#d8e5f2] w-fit text-[#205588] group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-2.5 text-xs font-semibold text-[#1b2a3a] group-hover:text-[#205588] transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] text-[#64748b] font-mono mt-0.5">
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
