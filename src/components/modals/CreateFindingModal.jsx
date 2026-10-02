import React, { useState } from 'react';
import { X, Bug, ShieldAlert, Crosshair, Sparkles } from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function CreateFindingModal() {
  const { 
    isCreateFindingModalOpen, 
    setIsCreateFindingModalOpen, 
    addFinding, 
    engagements,
    selectedEngagement,
    team 
  } = useCyber();

  const [formData, setFormData] = useState({
    engagementId: selectedEngagement?.id || engagements[0]?.id || 'ENG-2026-081',
    title: '',
    cve: 'CVE-2026-',
    severity: 'HIGH',
    cvssScore: 8.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    asset: '',
    discoveredBy: team[0]?.name || 'Marcus Vance',
    remediationDeadline: '2026-10-25',
    description: '',
    remediation: ''
  });

  if (!isCreateFindingModalOpen) return null;

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
    setIsCreateFindingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Security Vulnerability / Finding</h2>
              <p className="text-xs text-slate-400">Record technical exploit evidence, CVSS v3.1 metrics, and remediation guidance</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateFindingModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-slate-400 font-mono mb-1">Target Engagement *</label>
            <select
              value={formData.engagementId}
              onChange={(e) => setFormData({ ...formData, engagementId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
            >
              {engagements.map(e => (
                <option key={e.id} value={e.id}>{e.id} - {e.client} ({e.title})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono mb-1">Finding Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Unauthenticated Remote Code Execution in API Gateway"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">CVE / ATT&CK ID</label>
              <input
                type="text"
                value={formData.cve}
                onChange={(e) => setFormData({ ...formData, cve: e.target.value })}
                placeholder="e.g. CVE-2026-4419"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Severity Rating</label>
              <select
                value={formData.severity}
                onChange={(e) => handleSeverityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="CRITICAL">CRITICAL (9.0 - 10.0)</option>
                <option value="HIGH">HIGH (7.0 - 8.9)</option>
                <option value="MEDIUM">MEDIUM (4.0 - 6.9)</option>
                <option value="LOW">LOW (0.1 - 3.9)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">CVSS Base Score (0.0 - 10.0)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10.0"
                value={formData.cvssScore}
                onChange={(e) => setFormData({ ...formData, cvssScore: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Remediation SLA Date</label>
              <input
                type="date"
                value={formData.remediationDeadline}
                onChange={(e) => setFormData({ ...formData, remediationDeadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Affected Target Asset / URL / Port *</label>
            <input
              type="text"
              required
              value={formData.asset}
              onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
              placeholder="e.g. api.apexfin-core.com / /v1/telemetry-upload (Port 443)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Vulnerability Description & Proof-of-Concept (PoC)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the reproduction steps, payload structure, and exploit mechanics..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Remediation & Mitigation Recommendations</label>
            <textarea
              rows={2}
              value={formData.remediation}
              onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
              placeholder="Specific patch guidance, configuration changes, or WAF rules..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateFindingModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono tracking-wider transition-colors shadow-md shadow-rose-900/30"
            >
              Commit Finding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
