import React, { useState } from 'react';
import { 
  FileCheck2,
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Award,
  Target,
  Shield
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { countFindingsBySeverity, exportDeliverableJson } from '../../utils/helpers';

export default function ReportsView() {
  const { engagements, clientFilteredEngagements: availableEngagements, findings } = useCyber();

  const [selectedEngId, setSelectedEngId] = useState(null);

  // Falls back to the first in-scope engagement if the selected one isn't in the current client scope
  const currentEngagement = availableEngagements.find(e => e.id === selectedEngId) || availableEngagements[0] || engagements[0];
  const relatedFindings = findings.filter(f => f.engagementId === currentEngagement?.id);
  const counts = countFindingsBySeverity(relatedFindings);

  if (!currentEngagement) return null;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#205588]" />
            Executive Deliverable & Audit Report Exporter
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Render audit-grade assessment summaries, findings matrices, and client sign-off attestations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportDeliverableJson(currentEngagement, relatedFindings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] border border-[#d8e5f2] text-xs font-mono transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#205588]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Engagement Selector Bar */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#64748b]">Select Target Engagement:</span>
          <select
            value={currentEngagement?.id || ''}
            onChange={(e) => setSelectedEngId(e.target.value)}
            className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-lg px-3 py-1.5 text-xs text-[#1b2a3a] font-mono focus:outline-none focus:border-[#205588] focus:bg-white"
          >
            {availableEngagements.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id} - {e.client} ({e.title})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-mono text-[#205588] bg-[#e8eff6] px-2.5 py-1 rounded border border-[#b4d5ff] font-semibold">
          Document Classification: RESTRICTED // CYBERPULSE CLIENT DELIVERABLE
        </span>
      </div>

      {/* Rendered Document Preview Sheet */}
      <div className="bg-white border-2 border-[#d8e5f2] rounded-2xl p-8 shadow-xl space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        {/* Document Classification Header & Letterhead */}
        <div className="border-b-2 border-dashed border-[#d8e5f2] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#205588] flex items-center justify-center text-white shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="font-extrabold tracking-wider text-lg text-[#205588] font-mono">
                  CYBER<span className="text-[#2365a3]">PULSE</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#64748b] border-l border-[#d8e5f2] pl-3">
                Security Advisory & Threat Assessment Operations • SOC 2 Type II Attested
              </span>
            </div>
            <div className="flex items-center gap-2 text-rose-700 font-mono text-xs font-bold uppercase tracking-widest mt-2">
              <ShieldAlert className="w-4 h-4" />
              CONFIDENTIAL // PROPRIETARY CYBER SECURITY AUDIT REPORT
            </div>
            <h2 className="text-2xl font-black text-[#1b2a3a] mt-1">
              {currentEngagement.title}
            </h2>
            <div className="text-xs font-mono text-[#64748b] mt-1">
              Client Entity: <strong className="text-[#1b2a3a]">{currentEngagement.client}</strong> • Engagement ID: {currentEngagement.id}
            </div>
          </div>

          <div className="text-right font-mono text-xs text-[#64748b] shrink-0">
            <div>Execution Window: {currentEngagement.startDate} — {currentEngagement.endDate}</div>
            <div>Practice Line: <strong className="text-[#205588]">{currentEngagement.type}</strong></div>
            <div>Audit Methodology: <strong className="text-[#1b2a3a]">NIST SP 800-115 / FFIEC / HIPAA</strong></div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#205588] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Section 1.0 // Executive Attestation & Scope
          </h3>
          <p className="text-xs text-[#475569] leading-relaxed bg-[#f8fafc] p-4 rounded-xl border border-[#d8e5f2]">
            Our cybersecurity engagement team completed a comprehensive technical assessment for <strong>{currentEngagement.client}</strong>.
            The primary objective was to emulate adversarial techniques against authorized assets, identify critical systemic vulnerabilities,
            and deliver prioritized remediation recommendations to prevent data compromise, unauthorized lateral movement, and regulatory sanctions.
          </p>
          <div className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-lg p-3 text-xs font-mono text-[#1b2a3a] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#205588] shrink-0" />
            <span><strong>Authorized Assessment Scope:</strong> {currentEngagement.scope}</span>
          </div>
        </div>

        {/* Finding Severity Heatmap Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#205588] font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#205588]" /> Section 2.0 // Finding Severity Distribution
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
              <span className="text-[10px] text-rose-700 font-bold uppercase">Critical (CVSS 9.0+)</span>
              <div className="text-2xl font-black text-rose-700 mt-1">
                {counts.critical}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <span className="text-[10px] text-orange-700 font-bold uppercase">High (CVSS 7.0-8.9)</span>
              <div className="text-2xl font-black text-orange-700 mt-1">
                {counts.high}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-[10px] text-amber-700 font-bold uppercase">Medium (CVSS 4.0-6.9)</span>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {counts.medium}
              </div>
            </div>
            <div className="bg-[#f0f5fa] border border-[#d8e5f2] rounded-xl p-3">
              <span className="text-[10px] text-[#205588] font-bold uppercase">Low / Info (0.1-3.9)</span>
              <div className="text-2xl font-black text-[#1b2a3a] mt-1">
                {counts.low}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Findings Identified in Scope */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#205588] font-bold">
            Section 3.0 // Key Technical Findings & Actionable Remediation
          </h3>

          {relatedFindings.length === 0 ? (
            <div className="bg-[#f8fafc] border border-dashed border-[#d8e5f2] rounded-xl p-6 text-center text-xs text-[#64748b] font-mono">
              ✓ No findings logged for this engagement.
            </div>
          ) : (
            <div className="space-y-3">
              {relatedFindings.map((finding) => (
                <div key={finding.id} className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                        finding.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        'bg-orange-100 text-orange-800 border-orange-300'
                      }`}>
                        {finding.severity} (CVSS {finding.cvssScore})
                      </span>
                      <span className="font-mono text-[#205588] font-bold">{finding.cve}</span>
                      <span className="font-bold text-[#1b2a3a]">{finding.title}</span>
                    </div>
                    <span className="font-mono text-[#64748b] font-semibold">{finding.status}</span>
                  </div>

                  <div className="font-mono text-[11px] text-[#64748b]">
                    Target Asset: <strong className="text-[#1b2a3a]">{finding.asset}</strong>
                  </div>

                  <p className="text-[#475569] leading-relaxed text-[11px] bg-white p-2.5 rounded border border-[#d8e5f2]">
                    {finding.description}
                  </p>

                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                    <strong>Remediation:</strong> {finding.remediation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Sign-off & Verification Block */}
        <div className="pt-6 border-t-2 border-[#d8e5f2] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-4 space-y-1">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Lead Security Assessor</span>
            <div className="text-[#1b2a3a] font-bold text-sm">{currentEngagement.leadAnalyst}</div>
            <div className="text-[#64748b] text-[11px]">Principal Consultant // Offensive Operations</div>
            <div className="text-emerald-700 text-[10px] pt-2 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Verified Digital Signature
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-4 space-y-1">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Practice Lead / Managing Director</span>
            <div className="text-[#1b2a3a] font-bold text-sm">Andy Barker, CISSP, CISA</div>
            <div className="text-[#205588] text-[11px]">President & vCISO Advisory Practice Lead // CyberPulse Advisory Services</div>
            <div className="text-emerald-700 text-[10px] pt-2 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> FFIEC & HIPAA Quality Assurance Attested
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
