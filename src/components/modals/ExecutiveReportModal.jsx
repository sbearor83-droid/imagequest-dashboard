import React from 'react';
import { 
  X, 
  FileCheck2, 
  Printer, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Target 
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

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

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      engagement: eng,
      findings: relatedFindings,
      generatedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${eng.id}_Security_Deliverable.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f2238] border border-[#1d3e63] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1d3e63] flex items-center justify-between bg-[#0b1a2d] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#132b47] text-[#b4d5ff] border border-[#2365a3]">
              <FileCheck2 className="w-5 h-5 text-[#2365a3]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Client Audit Deliverable & Executive Attestation</h2>
              <p className="text-xs text-slate-400">Formal technical readout for {eng.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132b47] hover:bg-[#1d3e63] text-slate-300 text-xs font-mono transition-colors border border-[#1d3e63]"
            >
              <Download className="w-3.5 h-3.5 text-[#2365a3]" />
              <span>JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs font-mono transition-colors shadow-md shadow-[#205588]/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#132b47] ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans bg-[#081320]">
          {/* Classification Banner */}
          <div className="bg-[#0f2238] border border-[#2365a3]/50 rounded-xl p-3 flex items-center justify-between text-[#b4d5ff] font-mono">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              RESTRICTED CONFIDENTIAL // CYBER RISK ENGAGEMENT DELIVERABLE
            </div>
            <div className="text-[11px] text-[#b4d5ff]">
              AUDIT REF: {eng.id}
            </div>
          </div>

          {/* Assessment Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0f2238] p-4 rounded-xl border border-[#1d3e63] font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Client Organization</span>
              <div className="text-sm font-bold text-white">{eng.client}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Service Offering</span>
              <div className="text-sm font-bold text-[#b4d5ff]">{eng.type}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Lead Assessor</span>
              <div className="text-sm font-bold text-slate-200">{eng.leadAnalyst}</div>
            </div>
          </div>

          {/* Scope statement */}
          <div className="bg-[#0f2238]/60 border border-[#1d3e63] rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#2365a3]" /> Authorized Scope of Assessment:
            </div>
            <p className="text-slate-200 font-mono leading-relaxed">{eng.scope}</p>
          </div>

          {/* Findings Matrix Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              Identified Vulnerability Findings:
            </div>

            {relatedFindings.length === 0 ? (
              <div className="bg-[#0f2238]/60 border border-dashed border-[#1d3e63] rounded-xl p-6 text-center text-slate-400 font-mono">
                ✓ No high or critical severity vulnerabilities detected in this engagement scope.
              </div>
            ) : (
              <div className="space-y-2.5">
                {relatedFindings.map((f) => (
                  <div key={f.id} className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                          f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                          'bg-orange-950 text-orange-300 border-orange-800'
                        }`}>
                          {f.severity} (CVSS {f.cvssScore})
                        </span>
                        <span className="font-mono text-[#b4d5ff] font-bold">{f.cve}</span>
                        <span className="font-semibold text-white">{f.title}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px]">{f.status}</span>
                    </div>

                    <div className="font-mono text-[11px] text-slate-400">
                      Asset: <span className="text-slate-200">{f.asset}</span>
                    </div>

                    <p className="text-slate-300 text-[11px] bg-[#0b1a2d] p-2.5 rounded border border-[#1d3e63]">
                      {f.description}
                    </p>

                    <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
                      <strong>Remediation:</strong> {f.remediation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attestation & Signature block */}
          <div className="bg-[#0f2238] border border-[#1d3e63] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Engagement Lead Attestation</div>
              <div className="text-white font-bold mt-1">{eng.leadAnalyst}</div>
              <div className="text-emerald-400 text-[10px] mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Signed & Validated
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Status & Assurance</div>
              <div className="text-[#b4d5ff] font-bold mt-1">{eng.slaStatus}</div>
              <div className="text-slate-400 text-[10px] mt-1">NIST / OWASP Framework Standard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
