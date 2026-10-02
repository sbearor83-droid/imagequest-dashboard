import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  FileCheck2, 
  Calendar,
  Lock,
  Layers,
  Search
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function VendorRiskView() {
  const { 
    vendors, 
    clientFilteredVendors, 
    selectedClient, 
    setSelectedClient, 
    setIsCreateVendorModalOpen, 
    searchQuery 
  } = useCyber();
  const [tierFilter, setTierFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  const filteredVendors = clientFilteredVendors.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || v.tier.toLowerCase().includes(tierFilter.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || (v.sector && v.sector.toLowerCase() === sectorFilter.toLowerCase());
    return matchesSearch && matchesTier && matchesSector;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    if (score >= 60) return 'text-amber-400 bg-amber-950/80 border-amber-800';
    return 'text-rose-400 bg-rose-950/80 border-rose-800';
  };

  return (
    <div className="space-y-6">
      {/* Active Client Scope Alert */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#002244] border border-[#0096c7]/40 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-ping" />
            <span className="text-slate-400">Scoped TPRM Registry:</span>
            <span className="text-white font-bold">{selectedClient}</span>
            <span className="text-[#00b4d8]">({clientFilteredVendors.length} authorized vendors & suppliers)</span>
          </div>
          <button
            onClick={() => setSelectedClient('ALL')}
            className="text-xs font-mono text-[#00b4d8] hover:text-white underline"
          >
            Show All Accounts
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#00b4d8]" />
            Third-Party Vendor Risk Management (TPRM)
          </h1>
          <p className="text-xs text-slate-400">
            ImageQuest supply chain due diligence, SOC 2 Type II validation, EHR/Core banking risk ratings, and security questionnaires
          </p>
        </div>

        <button
          onClick={() => setIsCreateVendorModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0096c7] hover:bg-[#00b4d8] text-[#001224] font-bold text-xs tracking-wider transition-all shadow-md shadow-[#0096c7]/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {/* TPRM Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Audited SaaS & Tech Vendors</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{vendors.length} Providers</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            {vendors.filter(v => v.tier.includes('Tier 1')).length} Mission-Critical Tier 1
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">SOC 2 Type II Verification</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {Math.round((vendors.filter(v => v.soc2Status.includes('Verified')).length / vendors.length) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {vendors.filter(v => v.soc2Status.includes('Gap') || v.soc2Status.includes('Overdue')).length} Overdue Reviews
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Average Security Score</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {Math.round(vendors.reduce((acc, v) => acc + v.riskScore, 0) / vendors.length)} / 100
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Continuous Security Questionnaire Audits
          </div>
        </div>
      </div>

      {/* Filters: Sector & Tier */}
      <div className="bg-[#00172e] border border-[#0e3966] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-slate-400 mr-1">Sector:</span>
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
                  ? 'bg-[#0096c7]/25 text-[#00b4d8] border border-[#0096c7]/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#001c38]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400">Tier:</span>
          {['ALL', 'Tier 1', 'Tier 2'].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                tierFilter === tier
                  ? 'bg-[#0096c7]/25 text-[#00b4d8] border border-[#0096c7]/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#001c38]'
              }`}
            >
              {tier === 'ALL' ? 'All' : tier}
            </button>
          ))}
          <span className="text-xs font-mono text-[#00b4d8] ml-2">({filteredVendors.length} Providers)</span>
        </div>
      </div>

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVendors.map((vendor) => (
          <div 
            key={vendor.id}
            className="bg-[#00172e] border border-[#0e3966] hover:border-[#0096c7]/50 rounded-xl p-5 shadow-sm transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">{vendor.id}</span>
                  <span className="text-base font-bold text-white">{vendor.name}</span>
                  {vendor.sector && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      vendor.sector === 'Healthcare' ? 'bg-rose-950/60 text-rose-300 border-rose-800' :
                      vendor.sector === 'Financial' ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {vendor.sector === 'Healthcare' ? '🏥 Healthcare EHR' :
                       vendor.sector === 'Financial' ? '🏦 Banking Core' : '🌐 Cloud Infra'}
                    </span>
                  )}
                  {vendor.client && vendor.client !== 'All Accounts' && (
                    <span className="text-[10px] font-mono text-[#00b4d8] bg-[#002244] px-2 py-0.5 rounded border border-[#0096c7]/30">
                      Client: {vendor.client}
                    </span>
                  )}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    vendor.tier.includes('Tier 1') ? 'bg-purple-950 text-purple-300 border-purple-800' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {vendor.tier}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Service Category: <strong className="text-slate-300">{vendor.service}</strong>
                </div>
              </div>

              {/* Risk Score Pill */}
              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-500 uppercase">Security Score</div>
                  <div className={`text-base font-black px-2.5 py-0.5 rounded border mt-0.5 ${getScoreColor(vendor.riskScore)}`}>
                    {vendor.riskScore} / 100
                  </div>
                </div>

                <span className={`text-xs font-mono px-2.5 py-1 rounded border font-semibold ${
                  vendor.status === 'Approved' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
                  'bg-rose-950/80 text-rose-300 border-rose-800'
                }`}>
                  {vendor.status}
                </span>
              </div>
            </div>

            {/* Compliance badges & Data access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-slate-500 text-[10px]">SOC 2 ATTESTATION</div>
                  <div className="text-slate-200">{vendor.soc2Status}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-slate-500 text-[10px]">DATA ACCESS LEVEL</div>
                  <div className="text-slate-200">{vendor.dataAccess}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-slate-500 text-[10px]">NEXT RE-ASSESSMENT</div>
                  <div className="text-slate-200">{vendor.nextReview}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Security Liaison: {vendor.contact}</span>
              <span>ISO 27001 Certified: <strong className={vendor.iso27001 ? "text-emerald-400" : "text-slate-400"}>{vendor.iso27001 ? "YES" : "NO"}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
