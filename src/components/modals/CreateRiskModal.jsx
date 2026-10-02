import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { dateInDays } from '../../utils/helpers';

export default function CreateRiskModal() {
  const { isCreateRiskModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateRiskModalOpen ? <CreateRiskForm /> : null;
}

function CreateRiskForm() {
  const { setIsCreateRiskModalOpen, addRisk, team } = useCyber();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ransomware & Malware',
    description: '',
    likelihood: 3,
    impact: 4,
    owner: team[0]?.name || 'Andy Barker',
    mitigationsText: 'EDR continuous monitoring\nAir-gapped backups\nRole-based access control',
    nextAudit: dateInDays(60)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const mitigations = formData.mitigationsText.split('\n').filter(Boolean);
    await addRisk({
      ...formData,
      mitigations
    });
    setIsCreateRiskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-300">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Add Enterprise Cyber Risk</h2>
              <p className="text-xs text-[#64748b]">Map threat probability and severity into the 5x5 matrix</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateRiskModalOpen(false)}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans bg-white max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Risk Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Active Directory Kerberos Compromise"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Ransomware & Malware">Ransomware & Malware</option>
                <option value="Supply Chain & TPRM">Supply Chain & TPRM</option>
                <option value="Cloud & Identity">Cloud & Identity</option>
                <option value="Compliance & Regulatory">Compliance & Regulatory</option>
                <option value="Operational & Human">Operational & Human</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Risk Owner</label>
              <select
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Likelihood (1: Rare → 5: Almost Certain)</label>
              <select
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value={1}>1 - Rare</option>
                <option value={2}>2 - Unlikely</option>
                <option value={3}>3 - Possible</option>
                <option value={4}>4 - Likely</option>
                <option value={5}>5 - Almost Certain</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Impact (1: Minor → 5: Catastrophic)</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value={1}>1 - Minor</option>
                <option value={2}>2 - Moderate</option>
                <option value={3}>3 - Major</option>
                <option value={4}>4 - Severe</option>
                <option value={5}>5 - Catastrophic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Risk Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Potential vector, vulnerability chain, and business consequence..."
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Mitigating Safeguards (One per line)</label>
            <textarea
              rows={3}
              value={formData.mitigationsText}
              onChange={(e) => setFormData({ ...formData, mitigationsText: e.target.value })}
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateRiskModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Register Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
