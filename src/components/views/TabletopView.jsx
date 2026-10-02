import React, { useState } from 'react';
import { 
  Gamepad2,
  Clock,
  Users,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function TabletopView() {
  const { clientFilteredTabletop: clientExercises, setIsCreateTTXModalOpen, selectedClient, setSelectedClient } = useCyber();
  const [activeExerciseId, setActiveExerciseId] = useState(null);

  const currentExercise = clientExercises.find(t => t.id === activeExerciseId) || clientExercises[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#205588]" />
            Executive Cyber Tabletop Exercises (TTX) & Simulation Planner
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Facilitate real-world incident crisis simulations, inject timelines, and After-Action Reports (AAR)
          </p>
        </div>

        <button
          onClick={() => setIsCreateTTXModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Simulation Scenario</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#205588] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span className="text-[#475569]">Showing tabletop drills scoped for:</span>
            <strong className="text-[#205588] bg-white px-2 py-0.5 rounded border border-[#b4d5ff]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-[#205588] hover:text-[#2365a3] font-semibold underline text-[11px]"
          >
            Clear Filter (Show All Tabletop Drills)
          </button>
        </div>
      )}

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {clientExercises.map((ttx) => (
          <button
            key={ttx.id}
            onClick={() => setActiveExerciseId(ttx.id)}
            className={`px-4 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
              currentExercise?.id === ttx.id
                ? 'bg-[#205588] border-[#205588] text-white shadow-md shadow-[#205588]/20'
                : 'bg-white border-[#d8e5f2] text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa]'
            }`}
          >
            <div className={`text-[10px] font-mono font-bold ${currentExercise?.id === ttx.id ? 'text-[#b4d5ff]' : 'text-[#64748b]'}`}>
              {ttx.id} • {ttx.status}
            </div>
            <div className="text-xs font-semibold mt-0.5 truncate max-w-xs">{ttx.title}</div>
          </button>
        ))}
      </div>

      {currentExercise && (
        <div className="space-y-6">
          {/* Main Scenario Overview Card */}
          <div className="bg-white border border-[#d8e5f2] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#205588] flex-wrap">
                  <span className="font-bold">{currentExercise.id}</span>
                  <span>•</span>
                  <span>Client: <strong className="text-[#1b2a3a]">{currentExercise.client}</strong></span>
                  <span>•</span>
                  <span>Adversary: <strong className="text-rose-600 font-semibold">{currentExercise.threatActor}</strong></span>
                </div>
                <h2 className="text-lg font-bold text-[#1b2a3a] mt-1">
                  {currentExercise.title}
                </h2>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed bg-[#f8fafc] p-3.5 rounded-lg border border-[#d8e5f2]">
                  {currentExercise.scenario}
                </p>
              </div>

              <div className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-xl p-4 shrink-0 font-mono text-xs space-y-2 min-w-[200px]">
                <div>
                  <span className="text-[#64748b] text-[10px] uppercase">Scheduled Execution</span>
                  <div className="text-[#1b2a3a] font-bold">{currentExercise.scheduledDate}</div>
                </div>
                <div>
                  <span className="text-[#64748b] text-[10px] uppercase">Duration</span>
                  <div className="text-[#205588] font-bold">{currentExercise.duration}</div>
                </div>
                <div>
                  <span className="text-[#64748b] text-[10px] uppercase">Lead Facilitator</span>
                  <div className="text-[#1b2a3a] font-bold">{currentExercise.facilitator}</div>
                </div>
              </div>
            </div>

            {/* Participating Roles */}
            <div className="pt-2">
              <span className="text-xs font-mono text-[#64748b] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-[#205588]" /> Participating Executive Roles:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentExercise.participants.map((role, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-[#e8eff6] border border-[#b4d5ff] text-[#205588] text-xs font-mono font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline of Injects */}
          <div className="bg-white border border-[#d8e5f2] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Sequential Simulation Injects & Escalation Chronology
                </h3>
                <p className="text-xs text-[#475569] mt-0.5">Chronological dilemmas presented to the executive response team</p>
              </div>
              <span className="text-xs font-mono text-[#205588] bg-[#e8eff6] px-2.5 py-1 rounded border border-[#b4d5ff] font-semibold">
                {currentExercise.injects.length} Injects Configured
              </span>
            </div>

            <div className="relative border-l-2 border-[#205588] ml-4 pl-6 space-y-6 my-4">
              {currentExercise.injects.map((inject, idx) => (
                <div key={idx} className="relative group">
                  {/* Pin Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#205588] group-hover:scale-125 transition-transform" />

                  <div className="bg-[#f8fafc] border border-[#d8e5f2] group-hover:border-[#205588] rounded-xl p-4 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#205588] bg-[#e8eff6] px-2 py-0.5 rounded border border-[#b4d5ff]">
                        {inject.time}
                      </span>
                      <span className="font-mono text-[#64748b] text-xs font-semibold">
                        Phase: {inject.phase}
                      </span>
                    </div>
                    <p className="text-xs text-[#1b2a3a] mt-2 leading-relaxed">
                      {inject.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AAR Summary */}
            {currentExercise.aarRating ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="font-mono text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> After-Action Report (AAR) Assessment Score:
                </div>
                <p className="text-[#1b2a3a] font-medium">{currentExercise.aarRating}</p>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-xl bg-[#f8fafc] border border-dashed border-[#d8e5f2] text-xs text-[#64748b] flex items-center justify-between">
                <span>Simulation scheduled. AAR report rating will unlock after session debrief.</span>
                <span className="text-xs font-mono text-[#205588] font-semibold">Facilitator Briefing Ready</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
