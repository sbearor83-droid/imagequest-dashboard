import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateClientModal() {
  const { isCreateClientModalOpen, setIsCreateClientModalOpen, addClient, team } = useCyber();

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Financial & Banking',
    tier: 'Platinum Enterprise',
    leadPartner: team[0]?.name || 'Marcus Vance',
    primaryContact: '',
    email: '',
    slaTier: '1h P1 Guaranteed',
    endpoints: 1200,
    budget: '$150,000 / yr',
    servicesText: 'External & Internal Penetration Testing\n24/7 Managed IT & SOC Support\nAnnual Tabletop Crisis Simulation'
  });

  if (!isCreateClientModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const services = formData.servicesText.split('\n').filter(Boolean);
    await addClient({
      ...formData,
      services
    });
    setIsCreateClientModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Onboard New Client Organization</h2>
              <p className="text-xs text-slate-400">Initialize a client account workspace, contract tier, and scope</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateClientModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Client Organization Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Citadel Health Systems"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Industry Vertical</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Healthcare, Defense, SaaS, Retail"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Contract Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Platinum Enterprise">Platinum Enterprise (24/7 Dedicated)</option>
                <option value="Mission Critical">Mission Critical</option>
                <option value="Enterprise Compliance">Enterprise Compliance</option>
                <option value="Standard Retainer">Standard Retainer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Primary CISO / IT Contact</label>
              <input
                type="text"
                value={formData.primaryContact}
                onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                placeholder="e.g. Sarah Miller (CISO)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="smiller@client.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Lead Partner / Consultant</label>
              <select
                value={formData.leadPartner}
                onChange={(e) => setFormData({ ...formData, leadPartner: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Endpoints Monitored</label>
              <input
                type="number"
                value={formData.endpoints}
                onChange={(e) => setFormData({ ...formData, endpoints: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Annual Retainer Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="$150,000 / yr"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Contracted Security Services (One per line)</label>
            <textarea
              rows={3}
              value={formData.servicesText}
              onChange={(e) => setFormData({ ...formData, servicesText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateClientModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono tracking-wider transition-colors"
            >
              Onboard Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
