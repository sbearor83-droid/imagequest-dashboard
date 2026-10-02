import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

// Industry option -> sector key used by the client filters and navbar selector
const INDUSTRY_SECTOR = {
  'Healthcare (HIPAA / EHR)': 'Healthcare',
  'Financial & Banking (FFIEC / GLBA)': 'Financial',
  'Other Commercial (SOC 2 / ISO)': 'Other'
};

export default function CreateClientModal() {
  const { isCreateClientModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateClientModalOpen ? <CreateClientForm /> : null;
}

function CreateClientForm() {
  const { setIsCreateClientModalOpen, addClient, team } = useCyber();

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Healthcare (HIPAA / EHR)',
    tier: 'Platinum Enterprise',
    leadPartner: team[0]?.name || 'Andy Barker',
    primaryContact: '',
    email: '',
    slaTier: '1h P1 Guaranteed',
    endpoints: 1200,
    budget: '$150,000 / yr',
    servicesText: 'vCISO Advisory & Regulatory Compliance\nManaged IT & 24/7 SOC Operations\nPenetration Testing & Red Teaming\nTabletop Crisis Simulation Drills'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const { servicesText, ...client } = formData;
    await addClient({
      ...client,
      sector: INDUSTRY_SECTOR[client.industry] || 'Other',
      services: servicesText.split('\n').filter(Boolean)
    });
    setIsCreateClientModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
              <Building2 className="w-5 h-5 text-[#205588]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Onboard New Client Organization</h2>
              <p className="text-xs text-[#64748b]">Initialize a client account workspace, contract tier, and scope</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateClientModalOpen(false)}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto bg-white">
          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Client Organization Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Citadel Health Systems"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Industry Vertical</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Healthcare (HIPAA / EHR)">Healthcare (HIPAA / EHR)</option>
                <option value="Financial & Banking (FFIEC / GLBA)">Financial & Banking (FFIEC / GLBA)</option>
                <option value="Other Commercial (SOC 2 / ISO)">Other Commercial (SOC 2 / ISO)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Contract Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
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
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Primary CISO / IT Contact</label>
              <input
                type="text"
                value={formData.primaryContact}
                onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                placeholder="e.g. Sarah Miller (CISO)"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="smiller@client.com"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Lead Partner / Consultant</label>
              <select
                value={formData.leadPartner}
                onChange={(e) => setFormData({ ...formData, leadPartner: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                {team.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Endpoints Monitored</label>
              <input
                type="number"
                value={formData.endpoints}
                onChange={(e) => setFormData({ ...formData, endpoints: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Annual Retainer Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="$150,000 / yr"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Contracted Security Services (One per line)</label>
            <textarea
              rows={3}
              value={formData.servicesText}
              onChange={(e) => setFormData({ ...formData, servicesText: e.target.value })}
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateClientModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Onboard Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
