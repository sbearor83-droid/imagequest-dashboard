import React, { useState } from 'react';
import { X, Gamepad2, Plus } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateTTXModal() {
  const { isCreateTTXModalOpen, setIsCreateTTXModalOpen, addTabletopExercise, team } = useCyber();

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    threatActor: 'APT29 / Russian SVR Emulation',
    scenario: '',
    scheduledDate: '2026-11-12',
    duration: '4.0 Hours',
    facilitator: team.find(t => t.name.includes('Maya'))?.name || 'Andy Barker',
    participantsText: 'Chief Executive Officer\nChief Information Security Officer\nGeneral Counsel\nHead of Communications',
    inject1: 'Initial Alert: Ransomware note found on financial controller workstation.',
    inject2: 'Escalation: Darknet leak site lists client logo with 48h timer countdown.'
  });

  if (!isCreateTTXModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client) return;

    const participants = formData.participantsText.split('\n').filter(Boolean);
    const injects = [
      { time: 'T+00:00', phase: 'Detection', event: formData.inject1 },
      { time: 'T+01:15', phase: 'Containment Crisis', event: formData.inject2 }
    ];

    await addTabletopExercise({
      ...formData,
      participants,
      injects
    });
    setIsCreateTTXModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0b1a2d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              <Gamepad2 className="w-5 h-5 text-[#2365a3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Tabletop Simulation (TTX)</h2>
              <p className="text-xs text-slate-400">Design crisis scenarios, executive dilemmas, and timeline injects</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateTTXModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Scenario Operation Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operation Crimson Vault: Multi-Stage Ransomware Outbreak"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Client Organization *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. BioNova Pharmaceuticals"
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Simulated Threat Actor</label>
              <input
                type="text"
                value={formData.threatActor}
                onChange={(e) => setFormData({ ...formData, threatActor: e.target.value })}
                placeholder="e.g. LockBit 3.0 / Scattered Spider"
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Scenario Narrative & Ground Truth</label>
            <textarea
              rows={3}
              required
              value={formData.scenario}
              onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
              placeholder="Detail the breach vector, impact on business operations, and initial conditions..."
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Execution Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Estimated Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4.0 Hours"
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Participating Executive Roles (One per line)</label>
            <textarea
              rows={3}
              value={formData.participantsText}
              onChange={(e) => setFormData({ ...formData, participantsText: e.target.value })}
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#1d3e63] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateTTXModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#132b47] hover:bg-[#1d3e63] text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/30"
            >
              Schedule Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
