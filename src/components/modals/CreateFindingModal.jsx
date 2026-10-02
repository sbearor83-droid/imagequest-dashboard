import React, { useState } from 'react';
import { X, Bug } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';
import { dateInDays } from '../../utils/helpers';

export default function CreateFindingModal() {
  const { isCreateFindingModalOpen } = useCyber();
  // Mount the form only while open so its defaults reflect current data and it resets between uses
  return isCreateFindingModalOpen ? <CreateFindingForm /> : null;
}

function CreateFindingForm() {
  const { 
    setIsCreateFindingModalOpen, 
    addFinding, 
    engagements,
    clientFilteredEngagements,
    selectedEngagement,
    setSelectedEngagement,
    team 
  } = useCyber();

  const [formData, setFormData] = useState({
    engagementId: selectedEngagement?.id || clientFilteredEngagements[0]?.id || engagements[0]?.id || '',
    title: '',
    cve: 'CVE-2026-',
    severity: 'HIGH',
    cvssScore: 8.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    asset: '',
    discoveredBy: team[0]?.name || 'Andy Barker',
    remediationDeadline: dateInDays(30),
    description: '',
    remediation: ''
  });

  const close = () => {
    setSelectedEngagement(null);
    setIsCreateFindingModalOpen(false);
  };

  const currentEng = engagements.find(e => e.id === formData.engagementId);

  const handleSeverityChange = (sev) => {
    let defaultScore = 8.5;
    if (sev === 'CRITICAL') defaultScore = 9.8;
    if (sev === 'HIGH') defaultScore = 8.4;
    if (sev === 'MEDIUM') defaultScore = 5.8;
    if (sev === 'LOW') defaultScore = 3.4;

    setFormData({
      ...formData,
      severity: sev,
      cvssScore: defaultScore
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.asset) return;

    await addFinding({
      ...formData,
      client: currentEng?.client || 'Client System'
    });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#d8e5f2] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#d8e5f2] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-300">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b2a3a]">Log Security Vulnerability / Finding</h2>
              <p className="text-xs text-[#64748b]">Record technical exploit evidence, CVSS v3.1 metrics, and remediation guidance</p>
            </div>
          </div>
          <button
            onClick={() => close()}
            className="text-[#64748b] hover:text-[#1b2a3a] p-1 rounded-lg hover:bg-[#e8eff6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto bg-white">
          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Target Engagement *</label>
            <select
              value={formData.engagementId}
              onChange={(e) => setFormData({ ...formData, engagementId: e.target.value })}
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            >
              {engagements.map(e => (
                <option key={e.id} value={e.id}>{e.id} - {e.client} ({e.title})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Finding Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Unauthenticated Remote Code Execution in API Gateway"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">CVE / ATT&CK ID</label>
              <input
                type="text"
                value={formData.cve}
                onChange={(e) => setFormData({ ...formData, cve: e.target.value })}
                placeholder="e.g. CVE-2026-4419"
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Severity Rating</label>
              <select
                value={formData.severity}
                onChange={(e) => handleSeverityChange(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              >
                <option value="CRITICAL">CRITICAL (9.0 - 10.0)</option>
                <option value="HIGH">HIGH (7.0 - 8.9)</option>
                <option value="MEDIUM">MEDIUM (4.0 - 6.9)</option>
                <option value="LOW">LOW (0.1 - 3.9)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">CVSS Base Score (0.0 - 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10.0"
                value={formData.cvssScore}
                onChange={(e) => setFormData({ ...formData, cvssScore: parseFloat(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-mono mb-1 font-semibold">Remediation SLA Date</label>
              <input
                type="date"
                value={formData.remediationDeadline}
                onChange={(e) => setFormData({ ...formData, remediationDeadline: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Affected Target Asset / URL / Port *</label>
            <input
              type="text"
              required
              value={formData.asset}
              onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
              placeholder="e.g. api.apexfin-core.com / /v1/telemetry-upload (Port 443)"
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Vulnerability Description & Proof-of-Concept (PoC)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the reproduction steps, payload structure, and exploit mechanics..."
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-mono mb-1 font-semibold">Remediation & Mitigation Recommendations</label>
            <textarea
              rows={2}
              value={formData.remediation}
              onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
              placeholder="Specific patch guidance, configuration changes, or WAF rules..."
              className="w-full bg-[#f8fafc] border border-[#d8e5f2] rounded-lg px-3 py-2 text-[#1b2a3a] placeholder-[#94a3b8] text-xs focus:outline-none focus:border-[#205588] focus:bg-white font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#d8e5f2] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => close()}
              className="px-4 py-2 rounded-lg bg-[#f0f5fa] hover:bg-[#e8eff6] text-[#475569] hover:text-[#1b2a3a] font-mono border border-[#d8e5f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold font-mono tracking-wider transition-all shadow-md shadow-[#205588]/20"
            >
              Commit Finding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
