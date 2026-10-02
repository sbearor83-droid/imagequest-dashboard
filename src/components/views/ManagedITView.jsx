import React, { useState } from 'react';
import { 
  Server,
  Clock,
  CheckCircle2,
  Plus,
  Activity
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function ManagedITView() {
  const { managedIT, clientFilteredTickets, setIsCreateTicketModalOpen, selectedClient, setSelectedClient, searchQuery } = useCyber();
  const [ticketFilter, setTicketFilter] = useState('ALL');

  const { summary, endpointHealth } = managedIT;

  const query = searchQuery.toLowerCase();
  const filteredTickets = clientFilteredTickets.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(query) ||
      t.client.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query);
    const matchesFilter = ticketFilter === 'ALL' || t.priority.includes(ticketFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-[#205588]" />
            Managed IT Operations & 24/7 SOC SLA Queue
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Monitor client infrastructure fleets, patch compliance rates, and real-time SLA incident escalations
          </p>
        </div>

        <button
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-[#205588]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch SLA Ticket</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-[#e8eff6] border border-[#b4d5ff] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#205588] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#205588] animate-ping" />
            <span className="text-[#475569]">Showing infrastructure & SLA tickets scoped for:</span>
            <strong className="text-[#205588] bg-white px-2 py-0.5 rounded border border-[#b4d5ff]">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-[#205588] hover:text-[#2365a3] font-semibold underline text-[11px]"
          >
            Clear Filter (Show All Tenants)
          </button>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Monitored Endpoints</div>
          <div className="text-2xl font-bold font-mono text-[#1b2a3a] mt-1">
            {summary.totalEndpoints?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> {summary.healthyEndpoints?.toLocaleString()} Healthy
          </div>
        </div>

        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Patch Compliance</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {summary.patchCompliance}%
          </div>
          <div className="text-[11px] text-[#64748b] font-mono mt-1">
            {summary.vulnerableEndpoints} Pending Reboot
          </div>
        </div>

        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Avg SOC Response</div>
          <div className="text-2xl font-bold font-mono text-[#205588] mt-1">
            {summary.avgResponseMinutes} min
          </div>
          <div className="text-[11px] text-[#64748b] font-mono mt-1">
            Target SLA: &lt;15 min
          </div>
        </div>

        <div className="bg-white border border-[#d8e5f2] rounded-xl p-4 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-[#64748b]">Overall SLA Met Rate</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {summary.slaMet}%
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 font-semibold">
            Zero SLA Breaches in 30d
          </div>
        </div>
      </div>

      {/* Fleet Telemetry & OS Breakdown */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#205588]" />
          Client Infrastructure & OS Fleet Health Telemetry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {endpointHealth.map((item, idx) => {
            const pct = Math.round((item.patched / item.count) * 100);
            return (
              <div key={idx} className="bg-[#f8fafc] border border-[#d8e5f2] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1b2a3a]">{item.os}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.status === 'Optimal' ? 'bg-[#e8eff6] text-[#205588] border border-[#b4d5ff]' :
                    item.status === 'Good' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-[#64748b]">{item.patched} / {item.count} agents</span>
                  <span className="font-bold text-[#1b2a3a]">{pct}%</span>
                </div>
                <div className="w-full bg-[#e8eff6] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#205588] to-[#2365a3] h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live SLA Tickets Queue */}
      <div className="bg-white border border-[#d8e5f2] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#1b2a3a] tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Active SOC Escalations & Ticket SLA Queue
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">Strict SLA timers tracked per client contract tier</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['ALL', 'P1', 'P2', 'P3', 'P4'].map(p => (
              <button
                key={p}
                onClick={() => setTicketFilter(p)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  ticketFilter === p
                    ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-sm'
                    : 'text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa] border border-transparent'
                }`}
              >
                {p === 'ALL' ? 'All Priorities' : `${p} Tickets`}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="bg-[#f8fafc] border border-[#d8e5f2] hover:border-[#205588] rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#64748b]">{ticket.id}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    ticket.priority.includes('P1') ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                    ticket.priority.includes('P2') ? 'bg-orange-100 text-orange-800 border-orange-300' :
                    'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs font-bold text-[#205588]">• {ticket.client}</span>
                  <span className="text-xs font-mono text-[#64748b]">({ticket.category})</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1b2a3a] mt-1">{ticket.title}</h3>
                <div className="text-xs text-[#64748b] font-mono mt-1">
                  Assigned Engineer: <strong className="text-[#1b2a3a]">{ticket.assignedTo}</strong> • Opened: {ticket.created}
                </div>
              </div>

              {/* SLA remaining pill & actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-[#64748b]">SLA REMAINING</div>
                  <div className={`text-sm font-black flex items-center gap-1 ${
                    ticket.priority.includes('P1') ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    <Clock className="w-3.5 h-3.5" /> {ticket.slaRemaining}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-[#d8e5f2] text-[#1b2a3a] font-semibold">
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
