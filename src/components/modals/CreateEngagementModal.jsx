import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { dateInDays } from '../../utils/helpers';

export default function CreateEngagementModal() {
  const { isCreateEngModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateEngModalOpen ? <CreateEngagementForm /> : null;
}

function CreateEngagementForm() {
  const { setIsCreateEngModalOpen, addEngagement, team, scopedClientName } = useCyber();

  const [formData, setFormData] = useState({
    client: scopedClientName || '',
    title: '',
    type: 'Penetration Testing',
    phase: 'Scoping & Recon',
    priority: 'High',
    leadAnalyst: team[0]?.name || 'Andy Barker',
    scope: '',
    budgetHours: 80,
    startDate: dateInDays(0),
    endDate: dateInDays(45)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client || !formData.title) return;
    await addEngagement(formData);
    setIsCreateEngModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
              <Layers className="w-5 h-5 text-[#205588]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Launch New Cyber Security Engagement</h2>
              <p className="text-xs text-[#64748b]">Initialize scoping, project parameters, and team allocation</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateEngModalOpen(false)}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans bg-white max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Client Organization *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Apex Financial Holdings"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Practice Service Line *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Penetration Testing">Penetration Testing (Web/Network/API)</option>
                <option value="Red Teaming">Red Teaming & Adversary Emulation</option>
                <option value="Compliance & Audit">Compliance & Audit (SOC2/FFIEC/HIPAA)</option>
                <option value="Managed IT & SOC">Managed IT & 24/7 SOC Operations</option>
                <option value="Vendor Management">Vendor Risk Management (TPRM)</option>
                <option value="Tabletop Exercise">Tabletop Incident Simulation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Engagement Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. External Infrastructure & API Gateway Penetration Test"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Target Scope of Work *</label>
            <textarea
              required
              rows={2}
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              placeholder="e.g. 14 Public IP ranges, AWS production VPC, GraphQL auth endpoints..."
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Lead Analyst</label>
              <select
                value={formData.leadAnalyst}
                onChange={(e) => setFormData({ ...formData, leadAnalyst: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.clearance})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Critical">Critical (Immediate SLA)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Budgeted Hours</label>
              <input
                type="number"
                value={formData.budgetHours}
                onChange={(e) => setFormData({ ...formData, budgetHours: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Target Delivery Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateEngModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Initialize Engagement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
