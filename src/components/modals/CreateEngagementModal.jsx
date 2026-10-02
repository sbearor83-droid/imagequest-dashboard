import React, { useState } from 'react';
import { X, ShieldAlert, Plus, Layers, Target, Clock, UserCheck } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateEngagementModal() {
  const { isCreateEngModalOpen, setIsCreateEngModalOpen, addEngagement, team } = useCyber();

  const [formData, setFormData] = useState({
    client: '',
    title: '',
    type: 'Penetration Testing',
    phase: 'Scoping & Recon',
    priority: 'High',
    leadAnalyst: team[0]?.name || 'Andy Barker',
    scope: '',
    budgetHours: 80,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-11-15'
  });

  if (!isCreateEngModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client || !formData.title) return;
    await addEngagement(formData);
    setIsCreateEngModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0b1a2d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              <Layers className="w-5 h-5 text-[#2365a3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Launch New Cyber Security Engagement</h2>
              <p className="text-xs text-slate-400">Initialize scoping, project parameters, and team allocation</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateEngModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Client Organization *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Apex Financial Holdings"
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Practice Service Line *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
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
            <label className="block text-slate-400 font-mono mb-1">Engagement Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. External Infrastructure & API Gateway Penetration Test"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Target Scope of Work *</label>
            <textarea
              required
              rows={2}
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              placeholder="e.g. 14 Public IP ranges, AWS production VPC, GraphQL auth endpoints..."
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Lead Analyst</label>
              <select
                value={formData.leadAnalyst}
                onChange={(e) => setFormData({ ...formData, leadAnalyst: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.clearance})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                <option value="Critical">Critical (Immediate SLA)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Budgeted Hours</label>
              <input
                type="number"
                value={formData.budgetHours}
                onChange={(e) => setFormData({ ...formData, budgetHours: Number(e.target.value) })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Target Delivery Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1d3e63] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateEngModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#132b47] hover:bg-[#1d3e63] text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/30"
            >
              Initialize Engagement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
