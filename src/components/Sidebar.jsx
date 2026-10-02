import React from 'react';
import { 
  Building2,
  LayoutDashboard,
  FolderKanban,
  Bug,
  ShieldAlert,
  Server,
  Gamepad2,
  Users,
  FileCheck2,
  Layers,
  X
} from 'lucide-react';
import { useCyber } from '../context/CyberContext';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    clients,
    selectedClient,
    setSelectedClient,
    clientFilteredEngagements,
    clientFilteredFindings,
    clientFilteredTickets,
    clientFilteredVendors,
    clientFilteredTabletop
  } = useCyber();

  const criticalCount = clientFilteredFindings.filter(f => f.severity === 'CRITICAL' && f.status !== 'Verified Mitigated').length;

  const navItems = [
    {
      id: 'clients',
      label: 'Client Accounts 360°',
      subtitle: 'Healthcare & Banking Hub',
      icon: Building2,
      badge: `${clients.length} Orgs`,
      badgeColor: 'bg-[#2365a3]/25 text-[#b4d5ff] border-[#2365a3]/40'
    },
    {
      id: 'overview',
      label: 'Ops Telemetry',
      subtitle: selectedClient === 'ALL' ? 'Multi-Client Executive Radar' : `Telemetry // ${selectedClient}`,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'engagements',
      label: 'Engagements & PM',
      subtitle: 'vCISO, Audits & Pentests',
      icon: FolderKanban,
      badge: clientFilteredEngagements.length,
      badgeColor: 'bg-[#2365a3]/25 text-[#b4d5ff] border-[#2365a3]/40'
    },
    {
      id: 'findings',
      label: 'Vulnerability Matrix',
      subtitle: 'CVSS & Finding Remediation',
      icon: Bug,
      badge: criticalCount > 0 ? `${criticalCount} Crit` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
    },
    {
      id: 'risks',
      label: 'Risk & BIA Matrix',
      subtitle: '5x5 Heatmap & Impact Matrix',
      icon: ShieldAlert,
      badge: null
    },
    {
      id: 'managedIT',
      label: '24/7 SecOps & Managed IT',
      subtitle: 'M365, Endpoints & SLAs',
      icon: Server,
      badge: clientFilteredTickets.length > 0 ? `${clientFilteredTickets.length} SLAs` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'vendors',
      label: 'Vendor Risk (TPRM)',
      subtitle: 'Supply Chain & SOC 2 Reviews',
      icon: Layers,
      badge: `${clientFilteredVendors.length} Org`,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    {
      id: 'tabletop',
      label: 'BCM Tabletop Drills',
      subtitle: 'Incident Simulations (TTX)',
      icon: Gamepad2,
      badge: `${clientFilteredTabletop.length} TTX`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'team',
      label: 'vCISO & Staff Roster',
      subtitle: 'ImageQuest Team & Clearances',
      icon: Users,
      badge: null
    },
    {
      id: 'reports',
      label: 'Audit Deliverables',
      subtitle: 'Board & Executive Reports',
      icon: FileCheck2,
      badge: 'PDF / Export',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <aside className="w-64 bg-[#0f2238] border-r border-[#1d3e63] flex flex-col justify-between shrink-0 select-none print:hidden">
      <div className="p-3 space-y-1">
        {/* Active Client Scope Banner */}
        {selectedClient !== 'ALL' && (
          <div className="mx-1 mb-3 p-2.5 rounded-lg bg-[#132b47] border border-[#2365a3]/60 text-xs font-mono shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-[#b4d5ff] font-bold uppercase tracking-wider">
              <span>Scoped Client</span>
              <button 
                onClick={() => setSelectedClient('ALL')}
                className="hover:text-white transition-colors"
                title="Reset to All Clients"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-white font-bold truncate mt-0.5">{selectedClient}</div>
          </div>
        )}

        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#b4d5ff]">
          Practices & Operations
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group ${
                  isActive
                    ? 'bg-[#205588] text-white border border-[#2365a3] shadow-md shadow-[#0b1a2d]'
                    : 'text-slate-300 hover:text-white hover:bg-[#132b47] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-[#2365a3] text-white border border-[#3882c8]' 
                      : 'bg-[#132b47] text-slate-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className={`text-xs font-semibold tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-[#1d3e63] bg-[#0b1a2d]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SIEM & EDR Sensor Feed
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold">ONLINE</span>
        </div>
        <div className="w-full bg-[#132b47] rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-[#2365a3] to-[#b4d5ff] h-full rounded-full w-[98%]"></div>
        </div>
        <div className="mt-1.5 text-[10px] font-mono text-slate-400 flex justify-between">
          <span>{clients.length} Accounts Synced</span>
          <span className="text-[#b4d5ff] font-semibold">SOC 2 Type II</span>
        </div>
      </div>
    </aside>
  );
}
