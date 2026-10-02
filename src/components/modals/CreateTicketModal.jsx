import React, { useState } from 'react';
import { X, Server, Clock, Plus } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateTicketModal() {
  const { isCreateTicketModalOpen, setIsCreateTicketModalOpen, addTicket, engagements, team } = useCyber();

  const [formData, setFormData] = useState({
    client: engagements[0]?.client || 'Apex Financial Holdings',
    priority: 'P1 - Critical (1h SLA)',
    title: '',
    category: 'SOC Escalation',
    assignedTo: team.find(t => t.role.includes('MSSP'))?.name || 'Andy Barker'
  });

  if (!isCreateTicketModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    await addTicket(formData);
    setIsCreateTicketModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0b1a2d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              <Server className="w-5 h-5 text-[#2365a3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dispatch SOC / Managed IT Ticket</h2>
              <p className="text-xs text-slate-400">Initiate SLA response countdown timer and assign on-call analyst</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateTicketModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Client Tenant *</label>
            <input
              type="text"
              required
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Incident / Ticket Subject *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Cobalt Strike Beacon detected on Domain Controller"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Priority / SLA Target</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                <option value="P1 - Critical">P1 - Critical (1 Hour SLA)</option>
                <option value="P2 - High">P2 - High (4 Hour SLA)</option>
                <option value="P3 - Medium">P3 - Medium (8 Hour SLA)</option>
                <option value="P4 - Low">P4 - Low (24 Hour SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Incident Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                <option value="SOC Escalation">SOC Escalation</option>
                <option value="Endpoint Defense">Endpoint Defense</option>
                <option value="Network Infrastructure">Network Infrastructure</option>
                <option value="Disaster Recovery">Disaster Recovery</option>
                <option value="Identity & Access">Identity & Access</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Assigned SOC Engineer</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
            >
              {team.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-[#1d3e63] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateTicketModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#132b47] hover:bg-[#1d3e63] text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/30"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
