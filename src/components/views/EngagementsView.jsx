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

// Engagements can carry practice-specific phase names (e.g. "Lateral Movement");
// place those on the standard track by their progress so advancing never moves backwards.
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

  // Filter logic
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
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#b4d5ff]" />
            Cyber Security Engagements & Project Management
          </h1>
          <p className="text-xs text-slate-400">
            ImageQuest vCISO advisory, SOC onboarding, compliance audits, penetration testing, and delivery timelines
          </p>
        </div>

        <button
          onClick={() => setIsCreateEngModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/40 border border-[#2365a3]/50 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Engagement</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#132b47] border border-[#2365a3]/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono shadow-sm">
          <span className="text-[#b4d5ff] flex items-center gap-2">
            <span>Showing security engagements scoped for:</span>
            <strong className="text-white bg-[#0b1a2d] px-2 py-0.5 rounded border border-[#2365a3]/50">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear Filter (Show All {engagements.length} Engagements)
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#b4d5ff]" /> Practice:
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
                  ? 'bg-[#205588] text-white border border-[#2365a3] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#132b47]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
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
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-12 text-center">
            <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No matching security engagements found</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your practice filter or search term</p>
          </div>
        ) : (
          filtered.map((eng) => {
            const phaseIndex = getPhaseIndex(eng);
            const counts = countFindingsBySeverity(findings.filter(f => f.engagementId === eng.id));
            return (
              <div 
                key={eng.id}
                className="bg-[#0f2238] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-5 shadow-sm transition-all space-y-4"
              >
                {/* Header: ID, Client, Title, Type */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#132b47] text-[#b4d5ff] border border-[#1d3e63]">
                        {eng.id}
                      </span>
                      <span className="text-sm font-bold text-slate-200">
                        {eng.client}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• {eng.startDate} to {eng.endDate}</span>
                    </div>
                    <h2 className="text-base font-semibold text-white mt-1">
                      {eng.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md border ${
                      eng.priority === 'Critical' ? 'bg-rose-950/80 text-rose-300 border-rose-800' :
                      eng.priority === 'High' ? 'bg-orange-950/80 text-orange-300 border-orange-800' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {eng.priority} Priority
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#0b1a2d] text-slate-300 border border-[#1d3e63]">
                      {eng.type}
                    </span>
                  </div>
                </div>

                {/* Scope definition */}
                <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-lg p-3 text-xs flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-[#b4d5ff] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono text-slate-400 uppercase text-[11px] font-semibold">Scope of Work: </span>
                    <span className="text-slate-200">{eng.scope}</span>
                  </div>
                </div>

                {/* Phase Progression Stepper */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      Current Milestone: <strong className="text-[#b4d5ff]">{eng.phase}</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-300">{eng.progress}% Completed</span>
                      {phaseIndex < PHASES.length - 1 && (
                        <button
                          onClick={() => handleAdvancePhase(eng)}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white border border-[#2365a3]/60 flex items-center gap-1 transition-colors font-semibold shadow-sm"
                          title="Advance engagement to next milestone phase"
                        >
                          Advance Phase <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#0b1a2d] rounded-full h-2 overflow-hidden border border-[#1d3e63]">
                    <div 
                      className="bg-gradient-to-r from-[#205588] via-[#2365a3] to-[#3882c8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${eng.progress}%` }}
                    />
                  </div>

                  {/* Phase Steps Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 text-[10px] font-mono pt-1 text-slate-400">
                    {PHASES.map((p, idx) => {
                      const isDone = phaseIndex >= idx;
                      const isCurrent = eng.phase === p;
                      return (
                        <div 
                          key={p} 
                          className={`truncate text-center py-1 px-1 rounded ${
                            isCurrent ? 'bg-[#132b47] text-[#b4d5ff] font-bold border border-[#2365a3]/60' :
                            isDone ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {idx + 1}. {p}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Footer: Budget Hours, Team, Findings, Deliverables */}
                <div className="pt-3 border-t border-[#1d3e63] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  {/* Hours & Team */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{eng.spentHours} / {eng.budgetHours} hrs</span>
                      <span className="text-[11px] text-slate-500">
                        ({eng.budgetHours ? Math.round((eng.spentHours / eng.budgetHours) * 100) : 0}% budget)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-[#b4d5ff]" />
                      <span>Lead: <strong className="text-slate-200">{eng.leadAnalyst}</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Team: {eng.team.join(', ')}
                    </div>
                  </div>

                  {/* Findings & Actions */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 font-mono text-[11px] mr-2">
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {counts.critical} Crit
                      </span>
                      <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                        {counts.high} High
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        {counts.medium} Med
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEngagement(eng);
                        setIsCreateFindingModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#132b47] hover:bg-[#195589] text-slate-200 border border-[#1d3e63] font-mono text-[11px] transition-colors"
                    >
                      <Bug className="w-3.5 h-3.5 text-rose-400" />
                      <span>+ Finding</span>
                    </button>

                    <button
                      onClick={() => openReportFor(eng)}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-[#205588] hover:bg-[#2365a3] text-white border border-[#2365a3]/60 font-mono text-[11px] transition-colors font-semibold shadow-sm"
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
