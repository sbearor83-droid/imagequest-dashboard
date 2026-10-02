import React, { useState } from 'react';
import { 
  ShieldAlert,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function RiskRegisterView() {
  const { 
    clientFilteredRisks, 
    selectedClient, 
    setSelectedClient, 
    setIsCreateRiskModalOpen 
  } = useCyber();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [highlightedRiskId, setHighlightedRiskId] = useState(null);

  const categories = ['ALL', ...new Set(clientFilteredRisks.map(r => r.category))];

  const filteredRisks = clientFilteredRisks.filter(r => 
    selectedCategory === 'ALL' || r.category === selectedCategory
  );

  // Helper for 5x5 matrix score color
  const getScoreColor = (score) => {
    if (score >= 15) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (score >= 10) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  const getHeatmapCellColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 15) return 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-800';
    if (score >= 10) return 'bg-orange-50 hover:bg-orange-100/80 border-orange-200 text-orange-800';
    if (score >= 5) return 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-800';
    return 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-800';
  };

  return (
    <div className="space-y-6">
      {/* Active Client Scope Alert */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span className="text-[#475569]">Scoped Risk Register:</span>
            <span className="text-[#1b2a3a] font-bold">{selectedClient}</span>
            <span className="text-[#205588]">({clientFilteredRisks.length} relevant risks identified)</span>
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
            <ShieldAlert className="w-5 h-5 text-[#205588]" />
            Cyber Risk & BIA Matrix (5x5 Heatmap)
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Enterprise qualitative risk rating, threat likelihood vs impact, and compensating control residual scores
          </p>
        </div>

        <button
          onClick={() => setIsCreateRiskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Enterprise Risk</span>
        </button>
      </div>

      {/* Heatmap & Matrix Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Heatmap Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              5x5 Qualitative Cyber Risk Heatmap
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Med
              </span>
              <span className="flex items-center gap-1 text-orange-700">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical
              </span>
            </div>
          </div>

          {/* Matrix table */}
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              {/* Likelihood on Y axis (5 down to 1), Impact on X axis (1 to 5) */}
              <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                {/* Header Row */}
                <div className="p-2 text-[10px] text-[#64748b] font-bold uppercase">L \ I</div>
                <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold">1 (Minor)</div>
                <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold">2 (Mod)</div>
                <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold">3 (Major)</div>
                <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold">4 (Severe)</div>
                <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold">5 (Catastr)</div>

                {/* Rows from Likelihood 5 down to 1 */}
                {[5, 4, 3, 2, 1].map((lh) => (
                  <React.Fragment key={lh}>
                    <div className="p-2 text-[11px] text-[#1b2a3a] font-semibold flex items-center justify-center bg-[#f0f5fa] rounded border border-[#d8e5f2]">
                      {lh} {lh === 5 ? '(Almost)' : lh === 1 ? '(Rare)' : ''}
                    </div>
                    {[1, 2, 3, 4, 5].map((imp) => {
                      const score = lh * imp;
                      const matchingRisks = clientFilteredRisks.filter(r => r.likelihood === lh && r.impact === imp);
                      return (
                        <div
                          key={`${lh}-${imp}`}
                          className={`p-2 rounded border transition-all min-h-[50px] flex flex-col items-center justify-center relative cursor-pointer ${getHeatmapCellColor(lh, imp)}`}
                        >
                          <span className="text-[10px] font-mono opacity-70 font-bold">{score}</span>
                          {matchingRisks.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 justify-center">
                              {matchingRisks.map(r => (
                                <span
                                  key={r.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHighlightedRiskId(highlightedRiskId === r.id ? null : r.id);
                                  }}
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shadow-sm ${
                                    highlightedRiskId === r.id
                                      ? 'bg-[#205588] text-white ring-2 ring-[#2365a3] scale-110 font-black'
                                      : 'bg-white text-[#205588] border border-[#b4d5ff]'
                                  }`}
                                  title={`${r.id}: ${r.title}`}
                                >
                                  {r.id}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-center text-[11px] font-mono text-[#64748b] mt-2">
                Horizontal: Impact Rating (1-5)  •  Vertical: Likelihood Rating (1-5)
              </div>
            </div>
          </div>
        </div>

        {/* Residual Reduction Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            Control Effectiveness & Residual Risk
          </h2>
          <p className="text-xs text-[#475569]">
            Shows quantified risk reduction before and after deploying managed security controls
          </p>

          <div className="space-y-3">
            {clientFilteredRisks.slice(0, 4).map((risk) => {
              const reduction = Math.round(((risk.inherentScore - risk.residualScore) / risk.inherentScore) * 100);
              return (
                <div 
                  key={risk.id}
                  className={`bg-[#f8fafc] border rounded-lg p-3 transition-all ${
                    highlightedRiskId === risk.id ? 'border-[#205588] ring-1 ring-[#205588] bg-white' : 'border-[#d8e5f2]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#1b2a3a]">{risk.id}: {risk.title}</span>
                    <span className="font-mono text-emerald-700 text-[11px] font-bold">-{reduction}% Risk</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#64748b] text-[11px]">Inherent:</span>
                      <span className={`px-2 py-0.2 rounded font-bold border ${getScoreColor(risk.inherentScore)}`}>
                        {risk.inherentScore}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#64748b] text-[11px]">Residual:</span>
                      <span className={`px-2 py-0.2 rounded font-bold border ${getScoreColor(risk.residualScore)}`}>
                        {risk.residualScore}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Filter & Full Register Table */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[#64748b]">Filter Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-sm'
                    : 'text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Register Detailed Cards */}
        <div className="space-y-3">
          {filteredRisks.map((risk) => (
            <div 
              key={risk.id}
              className={`bg-[#f8fafc] border rounded-xl p-4 transition-all ${
                highlightedRiskId === risk.id ? 'border-[#205588] shadow-md shadow-[#205588]/10 bg-white' : 'border-[#d8e5f2]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
                      {risk.id}
                    </span>
                    {risk.sector && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        risk.sector === 'Healthcare' 
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : risk.sector === 'Financial'
                          ? 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]'
                          : 'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]'
                      }`}>
                        {risk.sector === 'Healthcare' ? '🏥 Healthcare' : risk.sector === 'Financial' ? '🏦 Financial' : '🌐 Enterprise'}
                      </span>
                    )}
                    {risk.client && (
                      <span className="text-[11px] font-mono text-[#205588] bg-white px-2 py-0.5 rounded border border-[#d8e5f2]">
                        {risk.client}
                      </span>
                    )}
                    <span className="text-xs font-mono text-[#475569]">{risk.category}</span>
                    <span className="text-xs font-mono text-[#64748b]">• Owner: {risk.owner}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1b2a3a] mt-1">{risk.title}</h3>
                  <p className="text-xs text-[#475569] mt-1">{risk.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right font-mono text-xs">
                    <div className="text-[#64748b] text-[10px]">INHERENT / RESIDUAL</div>
                    <div className="font-bold text-[#1b2a3a] mt-0.5">
                      <span className="text-rose-600">{risk.inherentScore}</span> / <span className="text-emerald-700">{risk.residualScore}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-[#d8e5f2] text-[#1b2a3a] font-semibold">
                    {risk.status}
                  </span>
                </div>
              </div>

              {/* Mitigations */}
              <div className="mt-3 pt-3 border-t border-[#d8e5f2]">
                <div className="text-[11px] font-mono text-[#475569] font-semibold mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Active Mitigation Controls & Compensating Safeguards:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {risk.mitigations.map((m, idx) => (
                    <div key={idx} className="bg-white border border-[#d8e5f2] rounded p-2 text-xs text-[#1b2a3a] flex items-start gap-1.5 font-mono">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2.5 text-[11px] font-mono text-[#64748b] flex justify-between">
                <span>Next Formal Audit Review: {risk.nextAudit}</span>
                <span className="text-[#205588] font-semibold">Likelihood: {risk.likelihood}/5 • Impact: {risk.impact}/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
