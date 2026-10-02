import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateVendorModal() {
  const { isCreateVendorModalOpen, setIsCreateVendorModalOpen, addVendor } = useCyber();

  const [formData, setFormData] = useState({
    name: '',
    service: '',
    tier: 'Tier 1 - Mission Critical',
    riskScore: 82,
    soc2Status: 'Verified Current (Type II)',
    iso27001: true,
    dataAccess: 'Internal SaaS & Cloud APIs',
    contact: 'security@vendor.com'
  });

  if (!isCreateVendorModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await addVendor(formData);
    setIsCreateVendorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0b1a2d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              <Building2 className="w-5 h-5 text-[#2365a3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Onboard Third-Party Vendor (TPRM)</h2>
              <p className="text-xs text-slate-400">Record vendor supply chain tier, SOC 2 attestations, and risk rating</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateVendorModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Vendor / SaaS Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Epic Systems, Fiserv, AWS Cloud"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Service Provided</label>
            <input
              type="text"
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              placeholder="e.g. Healthcare Clinical EHR Infrastructure"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Vendor Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                <option value="Tier 1 - Mission Critical">Tier 1 - Mission Critical</option>
                <option value="Tier 2 - Operational">Tier 2 - Operational</option>
                <option value="Tier 3 - Support">Tier 3 - Support</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Security Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.riskScore}
                onChange={(e) => setFormData({ ...formData, riskScore: Number(e.target.value) })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">SOC 2 Type II Status</label>
              <select
                value={formData.soc2Status}
                onChange={(e) => setFormData({ ...formData, soc2Status: e.target.value })}
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              >
                <option value="Verified Current (Type II)">Verified Current (Type II)</option>
                <option value="Verified Current (Type I)">Verified Current (Type I)</option>
                <option value="In Review">In Review</option>
                <option value="Overdue / Gap Found">Overdue / Gap Found</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Security Liaison Email</label>
              <input
                type="email"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="security@vendor.com"
                className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Data Access Scope</label>
            <input
              type="text"
              value={formData.dataAccess}
              onChange={(e) => setFormData({ ...formData, dataAccess: e.target.value })}
              placeholder="e.g. Read-only application logs, ePHI, Core Banking GLBA"
              className="w-full bg-[#081320] border border-[#1d3e63] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2365a3] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 font-mono">
            <input
              type="checkbox"
              id="isoCheck"
              checked={formData.iso27001}
              onChange={(e) => setFormData({ ...formData, iso27001: e.target.checked })}
              className="rounded bg-[#081320] border-[#1d3e63] text-[#205588] focus:ring-0"
            />
            <label htmlFor="isoCheck" className="text-slate-300 cursor-pointer">
              Vendor has active ISO/IEC 27001:2022 Certification
            </label>
          </div>

          <div className="pt-4 border-t border-[#1d3e63] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateVendorModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#132b47] hover:bg-[#1d3e63] text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/30"
            >
              Onboard Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
