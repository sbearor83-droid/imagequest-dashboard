import React, { useState } from 'react';
import { 
  Building2,
  Plus,
  FileCheck2,
  Calendar,
  Lock
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function VendorRiskView() {
  const { 
    clientFilteredVendors, 
    selectedClient, 
    setSelectedClient, 
    setIsCreateVendorModalOpen, 
    searchQuery 
  } = useCyber();
  const [tierFilter, setTierFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  const vendors = clientFilteredVendors;
  const pct = (n) => vendors.length ? Math.round((n / vendors.length) * 100) : 0;

  const query = searchQuery.toLowerCase();
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(query) ||
      v.service.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query);
    const matchesTier = tierFilter === 'ALL' || v.tier.toLowerCase().includes(tierFilter.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || (v.sector && v.sector.toLowerCase() === sectorFilter.toLowerCase());
    return matchesSearch && matchesTier && matchesSector;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-800 bg-emerald-100 border-emerald-300';
    if (score >= 60) return 'text-amber-800 bg-amber-100 border-amber-300';
    return 'text-rose-800 bg-rose-100 border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Active Client Scope Alert */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span className="text-[#475569]">Scoped TPRM Registry:</span>
            <span className="text-[#1b2a3a] font-bold">{selectedClient}</span>
            <span className="text-[#205588]">({clientFilteredVendors.length} authorized vendors & suppliers)</span>
          </div>
          <button
            onClick={() => setSelectedClient('ALL')}
            className="text-xs font-mono text-[#205588] hover:text-[#2365a3] font-semibold underline"
          >
            Show All Accounts
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#205588]" />
            Third-Party Vendor Risk Management (TPRM)
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Enterprise supply chain due diligence, SOC 2 Type II validation, EHR/Core banking risk ratings, and security questionnaires
          </p>
        </div>

        <button
          onClick={() => setIsCreateVendorModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {/* TPRM Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Audited SaaS & Tech Vendors</span>
          <div className="text-2xl font-bold font-mono text-[#1b2a3a] mt-1">{vendors.length} Providers</div>
          <div className="text-[11px] text-[#64748b] font-mono mt-1">
            {vendors.filter(v => v.tier.includes('Tier 1')).length} Mission-Critical Tier 1
          </div>
        </div>

        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">SOC 2 Type II Verification</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {pct(vendors.filter(v => v.soc2Status.includes('Verified')).length)}%
          </div>
          <div className="text-[11px] text-[#64748b] font-mono mt-1">
            {vendors.filter(v => v.soc2Status.includes('Gap') || v.soc2Status.includes('Overdue')).length} Overdue Reviews
          </div>
        </div>

        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Average Security Score</span>
          <div className="text-2xl font-bold font-mono text-[#205588] mt-1">
            {vendors.length ? Math.round(vendors.reduce((acc, v) => acc + v.riskScore, 0) / vendors.length) : 0} / 100
          </div>
          <div className="text-[11px] text-[#64748b] font-mono mt-1">
            Continuous Security Questionnaire Audits
          </div>
        </div>
      </div>

      {/* Filters: Sector & Tier */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#64748b] mr-1">Sector:</span>
          {[
            { id: 'ALL', label: 'All Sectors' },
            { id: 'Healthcare', label: '🏥 Healthcare EHR' },
            { id: 'Financial', label: '🏦 Banking Core' },
            { id: 'Enterprise', label: '🌐 Cloud & SecOps' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSectorFilter(s.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                sectorFilter === s.id
                  ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-sm'
                  : 'text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa] border border-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#64748b]">Tier:</span>
          {['ALL', 'Tier 1', 'Tier 2'].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                tierFilter === tier
                  ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-sm'
                  : 'text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa] border border-transparent'
              }`}
            >
              {tier === 'ALL' ? 'All' : tier}
            </button>
          ))}
          <span className="text-xs font-mono text-[#205588] font-semibold ml-2">({filteredVendors.length} Providers)</span>
        </div>
      </div>

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVendors.map((vendor) => (
          <div 
            key={vendor.id}
            className="bg-white border border-[#d8e5f2] hover:border-[#205588] rounded-xl p-5 shadow-sm transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#64748b]">{vendor.id}</span>
                  <span className="text-base font-bold text-[#1b2a3a]">{vendor.name}</span>
                  {vendor.sector && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      vendor.sector === 'Healthcare' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      vendor.sector === 'Financial' ? 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]' :
                      'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]'
                    }`}>
                      {vendor.sector === 'Healthcare' ? '🏥 Healthcare EHR' :
                       vendor.sector === 'Financial' ? '🏦 Banking Core' : '🌐 Cloud Infra'}
                    </span>
                  )}
                  {vendor.client && vendor.client !== 'All Accounts' && (
                    <span className="text-[10px] font-mono text-[#205588] bg-[#e8eff6] px-2 py-0.5 rounded border border-[#b4d5ff]">
                      Client: {vendor.client}
                    </span>
                  )}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    vendor.tier.includes('Tier 1') ? 'bg-[#205588] text-white border-[#2365a3]' :
                    'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]'
                  }`}>
                    {vendor.tier}
                  </span>
                </div>
                <div className="text-xs text-[#475569] font-mono mt-1">
                  Service Category: <strong className="text-[#1b2a3a]">{vendor.service}</strong>
                </div>
              </div>

              {/* Risk Score Pill */}
              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-[#64748b] uppercase">Security Score</div>
                  <div className={`text-base font-black px-2.5 py-0.5 rounded border mt-0.5 ${getScoreColor(vendor.riskScore)}`}>
                    {vendor.riskScore} / 100
                  </div>
                </div>

                <span className={`text-xs font-mono px-2.5 py-1 rounded border font-semibold ${
                  vendor.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {vendor.status}
                </span>
              </div>
            </div>

            {/* Compliance badges & Data access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-[#f8fafc] p-3 rounded-lg border border-[#d8e5f2] font-mono">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#205588]" />
                <div>
                  <div className="text-[#64748b] text-[10px]">SOC 2 ATTESTATION</div>
                  <div className="text-[#1b2a3a] font-semibold">{vendor.soc2Status}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <div>
                  <div className="text-[#64748b] text-[10px]">DATA ACCESS LEVEL</div>
                  <div className="text-[#1b2a3a] font-semibold">{vendor.dataAccess}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-[#64748b] text-[10px]">NEXT RE-ASSESSMENT</div>
                  <div className="text-[#1b2a3a] font-semibold">{vendor.nextReview}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-[#64748b] flex justify-between">
              <span>Security Liaison: {vendor.contact}</span>
              <span>ISO 27001 Certified: <strong className={vendor.iso27001 ? "text-emerald-700 font-bold" : "text-[#64748b]"}>{vendor.iso27001 ? "YES" : "NO"}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
