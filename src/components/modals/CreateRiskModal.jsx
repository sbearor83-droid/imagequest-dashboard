import React, { useState } from 'react';
import { X, ShieldAlert, Plus } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateRiskModal() {
  const { isCreateRiskModalOpen, setIsCreateRiskModalOpen, addRisk, team } = useCyber();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ransomware & Malware',
    description: '',
    likelihood: 3,
    impact: 4,
    owner: team[0]?.name || 'David Okafor',
    mitigationsText: 'EDR continuous monitoring\nAir-gapped backups\nRole-based access control',
    nextAudit: '2026-11-30'
  });

  if (!isCreateRiskModalOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Enterprise Cyber Risk</h2>
              <p className="text-xs text-slate-400">Map threat probability and severity into the 5x5 matrix</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateRiskModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Risk Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Active Directory Kerberos Compromise"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="Ransomware & Malware">Ransomware & Malware</option>
                <option value="Supply Chain & TPRM">Supply Chain & TPRM</option>
                <option value="Cloud & Identity">Cloud & Identity</option>
                <option value="Compliance & Regulatory">Compliance & Regulatory</option>
                <option value="Operational & Human">Operational & Human</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Risk Owner</label>
              <select
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Likelihood (1: Rare → 5: Almost Certain)</label>
              <select
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={1}>1 - Rare</option>
                <option value={2}>2 - Unlikely</option>
                <option value={3}>3 - Possible</option>
                <option value={4}>4 - Likely</option>
                <option value={5}>5 - Almost Certain</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Impact (1: Minor → 5: Catastrophic)</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
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
            <label className="block text-slate-400 font-mono mb-1">Risk Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Potential vector, vulnerability chain, and business consequence..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Mitigating Safeguards (One per line)</label>
            <textarea
              rows={3}
              value={formData.mitigationsText}
              onChange={(e) => setFormData({ ...formData, mitigationsText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateRiskModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono tracking-wider transition-colors"
            >
              Register Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
