import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Clock, 
  UserCheck, 
  FileText, 
  Bug, 
  ChevronRight, 
  Target,
  Shield,
  Layers
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { countFindingsBySeverity } from '../../utils/helpers';

const PHASES = [
  'Scoping & Recon',
  'Active Exploitation',
  'Evidence Analysis',
  'Executive Debrief',
  'Retest & Sign-off',
  'Completed'
];

const PHASE_PROGRESS = {
  'Scoping & Recon': 20,
  'Active Exploitation': 50,
  'Evidence Analysis': 75,
  'Executive Debrief': 90,
  'Retest & Sign-off': 95,
  'Completed': 100
};

function getPhaseIndex(eng) {
  const idx = PHASES.indexOf(eng.phase);
  if (idx !== -1) return idx;
  if (eng.status === 'Completed') return PHASES.length - 1;
  return Math.max(0, PHASES.findLastIndex(p => PHASE_PROGRESS[p] <= eng.progress));
}

export default function EngagementsView() {
  const { 
    engagements, 
    clientFilteredEngagements,
    findings,
    updateEngagement, 
    setIsCreateEngModalOpen, 
    openReportFor,
    setIsCreateFindingModalOpen,
    setSelectedEngagement,
    selectedClient,
    setSelectedClient,
    searchQuery
  } = useCyber();

  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const query = searchQuery.toLowerCase();
  const filtered = clientFilteredEngagements.filter((eng) => {
    const matchesSearch = 
      eng.title.toLowerCase().includes(query) ||
      eng.client.toLowerCase().includes(query) ||
      eng.id.toLowerCase().includes(query) ||
      eng.scope.toLowerCase().includes(query);

    const matchesType = selectedType === 'ALL' || eng.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || eng.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAdvancePhase = (eng) => {
    const nextPhase = PHASES[getPhaseIndex(eng) + 1];
    if (!nextPhase) return;
    updateEngagement(eng.id, {
      phase: nextPhase,
      progress: PHASE_PROGRESS[nextPhase],
      ...(nextPhase === 'Completed' && { status: 'Completed' })
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#205588]" />
            Cyber Security Engagements & Project Management
          </h1>
          <p className="text-xs text-[#64748b]">
            vCISO advisory, SOC onboarding, compliance audits, penetration testing, and delivery timelines
          </p>
        </div>

        <button
          onClick={() => setIsCreateEngModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Engagement</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono shadow-2xs">
          <span className="text-[#205588] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span>Showing security engagements scoped for:</span>
            <strong className="text-[#1b2a3a] bg-white px-2 py-0.5 rounded border border-[#b4d5ff]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-[#205588] hover:text-[#195589] font-bold underline text-[11px]"
          >
            Clear Filter (Show All {engagements.length} Engagements)
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-[#64748b] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#205588]" /> Practice:
          </span>
          {[
            { id: 'ALL', label: 'All Services' },
            { id: 'Penetration', label: 'Pen Testing' },
            { id: 'Red', label: 'Red Team' },
            { id: 'Compliance', label: 'Compliance & Audit' },
            { id: 'Managed', label: 'Managed IT & SOC' },
            { id: 'Vendor', label: 'Vendor TPRM' },
            { id: 'Tabletop', label: 'Tabletop' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedType === tab.id
                  ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-2xs'
                  : 'text-[#475569] hover:bg-[#e8eff6] hover:text-[#205588]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#64748b]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-md px-2.5 py-1 text-xs text-[#1b2a3a] font-mono focus:outline-none focus:border-[#205588]"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Engagement Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-[#d8e5f2] rounded-xl p-12 text-center shadow-2xs">
            <Shield className="w-10 h-10 text-[#64748b] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#1b2a3a]">No matching security engagements found</p>
            <p className="text-xs text-[#64748b] mt-1">Try changing your practice filter or search term</p>
          </div>
        ) : (
          filtered.map((eng) => {
            const phaseIndex = getPhaseIndex(eng);
            const counts = countFindingsBySeverity(findings.filter(f => f.engagementId === eng.id));
            return (
              <div 
                key={eng.id}
                className="bg-white border border-[#d8e5f2] hover:border-[#205588]/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header: ID, Client, Title, Type */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
                        {eng.id}
                      </span>
                      <span className="text-sm font-bold text-[#1b2a3a]">
                        {eng.client}
                      </span>
                      <span className="text-xs text-[#64748b] font-mono">• {eng.startDate} to {eng.endDate}</span>
                    </div>
                    <h2 className="text-base font-semibold text-[#1b2a3a] mt-1">
                      {eng.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md border ${
                      eng.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' :
                      eng.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200 font-bold' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {eng.priority} Priority
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#f0f5fa] text-[#475569] border border-[#d8e5f2]">
                      {eng.type}
                    </span>
                  </div>
                </div>

                {/* Scope definition */}
                <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-lg p-3 text-xs flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-[#205588] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono text-[#64748b] uppercase text-[11px] font-semibold">Scope of Work: </span>
                    <span className="text-[#1b2a3a]">{eng.scope}</span>
                  </div>
                </div>

                {/* Phase Progression Stepper */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b] font-mono">
                      Current Milestone: <strong className="text-[#205588]">{eng.phase}</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#1b2a3a] font-bold">{eng.progress}% Completed</span>
                      {phaseIndex < PHASES.length - 1 && (
                        <button
                          onClick={() => handleAdvancePhase(eng)}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white flex items-center gap-1 transition-colors font-semibold shadow-2xs"
                          title="Advance engagement to next milestone phase"
                        >
                          Advance Phase <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#e8eff6] rounded-full h-2 overflow-hidden border border-[#d8e5f2]">
                    <div 
                      className="bg-gradient-to-r from-[#205588] to-[#2365a3] h-full rounded-full transition-all duration-500"
                      style={{ width: `${eng.progress}%` }}
                    />
                  </div>

                  {/* Phase Steps Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 text-[10px] font-mono pt-1 text-[#64748b]">
                    {PHASES.map((p, idx) => {
                      const isDone = phaseIndex >= idx;
                      const isCurrent = eng.phase === p;
                      return (
                        <div 
                          key={p} 
                          className={`truncate text-center py-1 px-1 rounded ${
                            isCurrent ? 'bg-[#e8eff6] text-[#205588] font-bold border border-[#b4d5ff]' :
                            isDone ? 'text-[#1b2a3a] font-medium' : 'text-[#94a3b8]'
                          }`}
                        >
                          {idx + 1}. {p}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Footer: Budget Hours, Team, Findings, Deliverables */}
                <div className="pt-3 border-t border-[#d8e5f2] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  {/* Hours & Team */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 font-mono text-[#64748b]">
                      <Clock className="w-3.5 h-3.5 text-[#205588]" />
                      <span>{eng.spentHours} / {eng.budgetHours} hrs</span>
                      <span className="text-[11px] text-[#94a3b8]">
                        ({eng.budgetHours ? Math.round((eng.spentHours / eng.budgetHours) * 100) : 0}% budget)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[#64748b]">
                      <UserCheck className="w-3.5 h-3.5 text-[#205588]" />
                      <span>Lead: <strong className="text-[#1b2a3a]">{eng.leadAnalyst}</strong></span>
                    </div>

                    <div className="text-[11px] text-[#64748b] font-mono">
                      Team: {eng.team.join(', ')}
                    </div>
                  </div>

                  {/* Findings & Actions */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 font-mono text-[11px] mr-2">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        {counts.critical} Crit
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-bold">
                        {counts.high} High
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        {counts.medium} Med
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEngagement(eng);
                        setIsCreateFindingModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#1b2a3a] border border-[#d8e5f2] font-mono text-[11px] transition-colors"
                    >
                      <Bug className="w-3.5 h-3.5 text-rose-600" />
                      <span>+ Finding</span>
                    </button>

                    <button
                      onClick={() => openReportFor(eng)}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white font-mono text-[11px] transition-colors font-semibold shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
