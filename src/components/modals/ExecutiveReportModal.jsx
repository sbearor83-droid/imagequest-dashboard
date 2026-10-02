import React from 'react';
import { 
  X,
  FileCheck2,
  Printer,
  Download,
  ShieldAlert,
  CheckCircle2,
  Target
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { exportDeliverableJson } from '../../utils/helpers';

export default function ExecutiveReportModal() {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    reportTargetEngagement, 
    findings 
  } = useCyber();

  if (!isReportModalOpen || !reportTargetEngagement) return null;

  const eng = reportTargetEngagement;
  const relatedFindings = findings.filter(f => f.engagementId === eng.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:static print:block print:p-0 print:bg-transparent">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col print:max-h-none print:max-w-none print:border-none">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]">
              <FileCheck2 className="w-5 h-5 text-[#205588]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Client Audit Deliverable & Executive Attestation</h2>
              <p className="text-xs text-[#64748b]">Formal technical readout for {eng.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => exportDeliverableJson(eng, relatedFindings)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] text-xs font-mono transition-colors border border-[#d8e5f2] shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#205588]" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs font-mono transition-colors shadow-md shadow-[#205588]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6] ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto print:overflow-visible space-y-6 text-xs font-sans bg-white">
          {/* Classification Banner */}
          <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl p-3 flex items-center justify-between text-[#205588] font-mono">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              RESTRICTED CONFIDENTIAL // CYBER RISK ENGAGEMENT DELIVERABLE
            </div>
            <div className="text-[11px] text-[#205588] font-semibold">
              AUDIT REF: {eng.id}
            </div>
          </div>

          {/* Assessment Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f8fafc] p-4 rounded-xl border border-[#d8e5f2] font-mono">
            <div>
              <span className="text-[#64748b] text-[10px] uppercase">Client Organization</span>
              <div className="text-sm font-bold text-[#1b2a3a]">{eng.client}</div>
            </div>
            <div>
              <span className="text-[#64748b] text-[10px] uppercase">Service Offering</span>
              <div className="text-sm font-bold text-[#205588]">{eng.type}</div>
            </div>
            <div>
              <span className="text-[#64748b] text-[10px] uppercase">Lead Assessor</span>
              <div className="text-sm font-bold text-[#1b2a3a]">{eng.leadAnalyst}</div>
            </div>
          </div>

          {/* Scope statement */}
          <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-mono text-[#205588] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#205588]" /> Authorized Scope of Assessment:
            </div>
            <p className="text-[#475569] font-mono leading-relaxed">{eng.scope}</p>
          </div>

          {/* Findings Matrix Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#205588] font-bold uppercase tracking-wider">
              Identified Vulnerability Findings:
            </div>

            {relatedFindings.length === 0 ? (
              <div className="bg-[#f8fafc] border border-dashed border-[#d8e5f2] rounded-xl p-6 text-center text-[#64748b] font-mono">
                ✓ No findings logged for this engagement.
              </div>
            ) : (
              <div className="space-y-2.5">
                {relatedFindings.map((f) => (
                  <div key={f.id} className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                          f.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          'bg-orange-100 text-orange-800 border-orange-300'
                        }`}>
                          {f.severity} (CVSS {f.cvssScore})
                        </span>
                        <span className="font-mono text-[#205588] font-bold">{f.cve}</span>
                        <span className="font-semibold text-[#1b2a3a]">{f.title}</span>
                      </div>
                      <span className="font-mono text-[#64748b] text-[11px] font-semibold">{f.status}</span>
                    </div>

                    <div className="font-mono text-[11px] text-[#64748b]">
                      Asset: <span className="text-[#1b2a3a]">{f.asset}</span>
                    </div>

                    <p className="text-[#475569] text-[11px] bg-white p-2.5 rounded border border-[#d8e5f2]">
                      {f.description}
                    </p>

                    <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                      <strong>Remediation:</strong> {f.remediation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attestation & Signature block */}
          <div className="bg-[#f8fafc] border border-[#d8e5f2] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <div className="text-[#64748b] text-[10px] uppercase">Engagement Lead Attestation</div>
              <div className="text-[#1b2a3a] font-bold mt-1">{eng.leadAnalyst}</div>
              <div className="text-emerald-700 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Signed & Validated
              </div>
            </div>
            <div>
              <div className="text-[#64748b] text-[10px] uppercase">Status & Assurance</div>
              <div className="text-[#205588] font-bold mt-1">{eng.slaStatus}</div>
              <div className="text-[#64748b] text-[10px] mt-1">NIST / OWASP Framework Standard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
