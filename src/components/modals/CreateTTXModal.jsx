import React, { useState } from 'react';
import { X, Gamepad2 } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { dateInDays } from '../../utils/helpers';

export default function CreateTTXModal() {
  const { isCreateTTXModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateTTXModalOpen ? <CreateTTXForm /> : null;
}

function CreateTTXForm() {
  const { setIsCreateTTXModalOpen, addTabletopExercise, team, scopedClientName } = useCyber();

  const [formData, setFormData] = useState({
    title: '',
    client: scopedClientName || '',
    threatActor: 'APT29 / Russian SVR Emulation',
    scenario: '',
    scheduledDate: dateInDays(30),
    duration: '4.0 Hours',
    facilitator: team.find(t => t.name.includes('Maya'))?.name || 'Andy Barker',
    participantsText: 'Chief Executive Officer\nChief Information Security Officer\nGeneral Counsel\nHead of Communications',
    inject1: 'Initial Alert: Ransomware note found on financial controller workstation.',
    inject2: 'Escalation: Darknet leak site lists client logo with 48h timer countdown.'
  });

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
              <Gamepad2 className="w-5 h-5 text-[#205588]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Create Tabletop Simulation (TTX)</h2>
              <p className="text-xs text-[#64748b]">Design crisis scenarios, executive dilemmas, and timeline injects</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateTTXModalOpen(false)}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto bg-white">
          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Scenario Operation Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operation Crimson Vault: Multi-Stage Ransomware Outbreak"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Client Organization *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. BioNova Pharmaceuticals"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Simulated Threat Actor</label>
              <input
                type="text"
                value={formData.threatActor}
                onChange={(e) => setFormData({ ...formData, threatActor: e.target.value })}
                placeholder="e.g. LockBit 3.0 / Scattered Spider"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Scenario Narrative & Ground Truth</label>
            <textarea
              rows={3}
              required
              value={formData.scenario}
              onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
              placeholder="Detail the breach vector, impact on business operations, and initial conditions..."
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Execution Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Estimated Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4.0 Hours"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Participating Executive Roles (One per line)</label>
            <textarea
              rows={3}
              value={formData.participantsText}
              onChange={(e) => setFormData({ ...formData, participantsText: e.target.value })}
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateTTXModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Schedule Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
