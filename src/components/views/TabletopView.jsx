import React, { useState } from 'react';
import { 
  Gamepad2, 
  Clock, 
  Users, 
  ShieldAlert, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function TabletopView() {
  const { tabletopExercises, setIsCreateTTXModalOpen, selectedClient, setSelectedClient } = useCyber();
  
  const clientExercises = selectedClient === 'ALL'
    ? tabletopExercises
    : tabletopExercises.filter(t => t.client.toLowerCase() === selectedClient.toLowerCase());

  const [activeExerciseId, setActiveExerciseId] = useState(clientExercises[0]?.id || tabletopExercises[0]?.id);

  const currentExercise = clientExercises.find(t => t.id === activeExerciseId) || clientExercises[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#2365a3]" />
            Executive Cyber Tabletop Exercises (TTX) & Simulation Planner
          </h1>
          <p className="text-xs text-slate-400">
            Facilitate real-world incident crisis simulations, inject timelines, and After-Action Reports (AAR)
          </p>
        </div>

        <button
          onClick={() => setIsCreateTTXModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Simulation Scenario</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#0f2238] border border-[#2365a3]/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#b4d5ff] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2365a3] animate-ping" />
            <span>Showing tabletop drills scoped for:</span>
            <strong className="text-white bg-[#132b47] px-2 py-0.5 rounded border border-[#2365a3]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear Filter (Show All Tabletop Drills)
          </button>
        </div>
      )}

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabletopExercises.map((ttx) => (
          <button
            key={ttx.id}
            onClick={() => setActiveExerciseId(ttx.id)}
            className={`px-4 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
              activeExerciseId === ttx.id
                ? 'bg-[#205588] border-[#2365a3] text-white shadow-md shadow-[#205588]/40'
                : 'bg-[#0f2238] border-[#1d3e63] text-slate-400 hover:text-white hover:bg-[#132b47]'
            }`}
          >
            <div className={`text-[10px] font-mono font-bold ${activeExerciseId === ttx.id ? 'text-[#b4d5ff]' : 'text-slate-400'}`}>
              {ttx.id} • {ttx.status}
            </div>
            <div className="text-xs font-semibold mt-0.5 truncate max-w-xs">{ttx.title}</div>
          </button>
        ))}
      </div>

      {currentExercise && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Scenario Overview Card */}
          <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#b4d5ff]">
                  <span className="font-bold">{currentExercise.id}</span>
                  <span>•</span>
                  <span>Client: <strong className="text-white">{currentExercise.client}</strong></span>
                  <span>•</span>
                  <span>Adversary: <strong className="text-rose-400">{currentExercise.threatActor}</strong></span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {currentExercise.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#0b1a2d] p-3.5 rounded-lg border border-[#1d3e63]">
                  {currentExercise.scenario}
                </p>
              </div>

              <div className="bg-[#0b1a2d] border border-[#1d3e63] rounded-xl p-4 shrink-0 font-mono text-xs space-y-2 min-w-[200px]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Scheduled Execution</span>
                  <div className="text-white font-bold">{currentExercise.scheduledDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Duration</span>
                  <div className="text-[#b4d5ff] font-bold">{currentExercise.duration}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Lead Facilitator</span>
                  <div className="text-white font-bold">{currentExercise.facilitator}</div>
                </div>
              </div>
            </div>

            {/* Participating Roles */}
            <div className="pt-2">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-[#2365a3]" /> Participating Executive Roles:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentExercise.participants.map((role, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-[#132b47] border border-[#1d3e63] text-slate-200 text-xs font-mono">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline of Injects */}
          <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Sequential Simulation Injects & Escalation Chronology
                </h3>
                <p className="text-xs text-slate-400">Chronological dilemmas presented to the executive response team</p>
              </div>
              <span className="text-xs font-mono text-[#b4d5ff] bg-[#132b47] px-2.5 py-1 rounded border border-[#2365a3]">
                {currentExercise.injects.length} Injects Configured
              </span>
            </div>

            <div className="relative border-l-2 border-[#2365a3] ml-4 pl-6 space-y-6 my-4">
              {currentExercise.injects.map((inject, idx) => (
                <div key={idx} className="relative group">
                  {/* Pin Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#0b1a2d] border-2 border-[#2365a3] group-hover:scale-125 transition-transform" />

                  <div className="bg-[#0b1a2d] border border-[#1d3e63] group-hover:border-[#2365a3] rounded-xl p-4 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#b4d5ff] bg-[#132b47] px-2 py-0.5 rounded border border-[#2365a3]">
                        {inject.time}
                      </span>
                      <span className="font-mono text-slate-300 text-xs font-semibold">
                        Phase: {inject.phase}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                      {inject.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AAR Summary */}
            {currentExercise.aarRating ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs">
                <div className="font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" /> After-Action Report (AAR) Assessment Score:
                </div>
                <p className="text-slate-200 font-medium">{currentExercise.aarRating}</p>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-xl bg-[#0b1a2d] border border-dashed border-[#1d3e63] text-xs text-slate-400 flex items-center justify-between">
                <span>Simulation scheduled. AAR report rating will unlock after session debrief.</span>
                <span className="text-xs font-mono text-[#b4d5ff] font-semibold">Facilitator Briefing Ready</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
