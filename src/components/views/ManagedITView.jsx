import React, { useState } from 'react';
import { 
  Server, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  HardDrive,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function ManagedITView() {
  const { managedIT, setIsCreateTicketModalOpen, selectedClient, setSelectedClient, searchQuery } = useCyber();
  const [ticketFilter, setTicketFilter] = useState('ALL');

  const { summary, tickets = [], endpointHealth = [] } = managedIT;

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'ALL' || t.client.toLowerCase() === selectedClient.toLowerCase();
    const matchesFilter = ticketFilter === 'ALL' || t.priority.includes(ticketFilter);
    return matchesSearch && matchesClient && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            Managed IT Operations & 24/7 SOC SLA Queue
          </h1>
          <p className="text-xs text-slate-400">
            Monitor client infrastructure fleets, patch compliance rates, and real-time SLA incident escalations
          </p>
        </div>

        <button
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md shadow-emerald-900/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch SLA Ticket</span>
        </button>
      </div>

      {/* Scoped Client Banner */}
      {selectedClient !== 'ALL' && (
        <div className="bg-emerald-950/30 border border-emerald-800/70 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-300 flex items-center gap-2">
            <span>Showing infrastructure & SLA tickets scoped for:</span>
            <strong className="text-white bg-slate-900 px-2 py-0.5 rounded border border-emerald-800">{selectedClient}</strong>
          </span>
          <button 
            onClick={() => setSelectedClient('ALL')}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear Filter (Show All Tenants)
          </button>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Monitored Endpoints</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {summary.totalEndpoints?.toLocaleString() || 8420}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {summary.healthyEndpoints?.toLocaleString() || 8312} Healthy
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Patch Compliance</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {summary.patchCompliance || 98.7}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {summary.vulnerableEndpoints || 108} Pending Reboot
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Avg SOC Response</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {summary.avgResponseMinutes || 11.4} min
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Target SLA: &lt;15 min
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Overall SLA Met Rate</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {summary.slaMet || 99.4}%
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Zero SLA Breaches in 30d
          </div>
        </div>
      </div>

      {/* Fleet Telemetry & OS Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Client Infrastructure & OS Fleet Health Telemetry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {endpointHealth.map((item, idx) => {
            const pct = Math.round((item.patched / item.count) * 100);
            return (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.os}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.status === 'Optimal' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    item.status === 'Good' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">{item.patched} / {item.count} agents</span>
                  <span className="font-bold text-white">{pct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live SLA Tickets Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Active SOC Escalations & Ticket SLA Queue
            </h2>
            <p className="text-xs text-slate-400">Strict SLA timers tracked per client contract tier</p>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'P1', 'P2', 'P3'].map(p => (
              <button
                key={p}
                onClick={() => setTicketFilter(p)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  ticketFilter === p
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
              className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">{ticket.id}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    ticket.priority.includes('P1') ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' :
                    ticket.priority.includes('P2') ? 'bg-orange-950 text-orange-300 border-orange-800' :
                    'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-200">• {ticket.client}</span>
                  <span className="text-xs font-mono text-slate-500">({ticket.category})</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">{ticket.title}</h3>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Assigned Engineer: <strong className="text-slate-300">{ticket.assignedTo}</strong> • Opened: {ticket.created}
                </div>
              </div>

              {/* SLA remaining pill & actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">SLA REMAINING</div>
                  <div className={`text-sm font-black flex items-center gap-1 ${
                    ticket.priority.includes('P1') ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    <Clock className="w-3.5 h-3.5" /> {ticket.slaRemaining}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
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
