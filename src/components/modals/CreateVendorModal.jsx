import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateVendorModal() {
  const { isCreateVendorModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateVendorModalOpen ? <CreateVendorForm /> : null;
}

function CreateVendorForm() {
  const { setIsCreateVendorModalOpen, addVendor } = useCyber();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await addVendor(formData);
    setIsCreateVendorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
              <Building2 className="w-5 h-5 text-[#205588]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Onboard Third-Party Vendor (TPRM)</h2>
              <p className="text-xs text-[#64748b]">Record vendor supply chain tier, SOC 2 attestations, and risk rating</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateVendorModalOpen(false)}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans bg-white max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Vendor / SaaS Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Epic Systems, Fiserv, AWS Cloud"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Service Provided</label>
            <input
              type="text"
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              placeholder="e.g. Healthcare Clinical EHR Infrastructure"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Vendor Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Tier 1 - Mission Critical">Tier 1 - Mission Critical</option>
                <option value="Tier 2 - Operational">Tier 2 - Operational</option>
                <option value="Tier 3 - Support">Tier 3 - Support</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Security Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.riskScore}
                onChange={(e) => setFormData({ ...formData, riskScore: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">SOC 2 Type II Status</label>
              <select
                value={formData.soc2Status}
                onChange={(e) => setFormData({ ...formData, soc2Status: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="Verified Current (Type II)">Verified Current (Type II)</option>
                <option value="Verified Current (Type I)">Verified Current (Type I)</option>
                <option value="In Review">In Review</option>
                <option value="Overdue / Gap Found">Overdue / Gap Found</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Security Liaison Email</label>
              <input
                type="email"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="security@vendor.com"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Data Access Scope</label>
            <input
              type="text"
              value={formData.dataAccess}
              onChange={(e) => setFormData({ ...formData, dataAccess: e.target.value })}
              placeholder="e.g. Read-only application logs, ePHI, Core Banking GLBA"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 font-mono">
            <input
              type="checkbox"
              id="isoCheck"
              checked={formData.iso27001}
              onChange={(e) => setFormData({ ...formData, iso27001: e.target.checked })}
              className="rounded bg-[#f8fafc] border-[#d8e5f2] text-[#205588] focus:ring-0"
            />
            <label htmlFor="isoCheck" className="text-[#475569] cursor-pointer">
              Vendor has active ISO/IEC 27001:2022 Certification
            </label>
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateVendorModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Onboard Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
