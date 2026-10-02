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
      badgeColor: 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]'
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
      badgeColor: 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]'
    },
    {
      id: 'findings',
      label: 'Vulnerability Matrix',
      subtitle: 'CVSS & Finding Remediation',
      icon: Bug,
      badge: criticalCount > 0 ? `${criticalCount} Crit` : null,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse font-bold'
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
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 font-bold'
    },
    {
      id: 'vendors',
      label: 'Vendor Risk (TPRM)',
      subtitle: 'Supply Chain & SOC 2 Reviews',
      icon: Layers,
      badge: `${clientFilteredVendors.length} Org`,
      badgeColor: 'bg-[#f0f5fa] text-[#475569] border-[#d8e5f2]'
    },
    {
      id: 'tabletop',
      label: 'BCM Tabletop Drills',
      subtitle: 'Incident Simulations (TTX)',
      icon: Gamepad2,
      badge: `${clientFilteredTabletop.length} TTX`,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'team',
      label: 'vCISO & Staff Roster',
      subtitle: 'Advisory Team & Clearances',
      icon: Users,
      badge: null
    },
    {
      id: 'reports',
      label: 'Audit Deliverables',
      subtitle: 'Board & Executive Reports',
      icon: FileCheck2,
      badge: 'PDF / Export',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#d8e5f2] flex flex-col justify-between shrink-0 select-none print:hidden shadow-xs">
      <div className="p-3 space-y-1">
        {/* Active Client Scope Banner */}
        {selectedClient !== 'ALL' && (
          <div className="mx-1 mb-3 p-2.5 rounded-lg bg-[#e8eff6] border border-[#b4d5ff] text-xs font-mono shadow-2xs">
            <div className="flex items-center justify-between text-[10px] text-[#205588] font-bold uppercase tracking-wider">
              <span>Scoped Client</span>
              <button 
                onClick={() => setSelectedClient('ALL')}
                className="hover:text-[#195589] transition-colors"
                title="Reset to All Clients"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[#1b2a3a] font-bold truncate mt-0.5">{selectedClient}</div>
          </div>
        )}

        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
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
                    ? 'bg-[#205588] text-white shadow-sm font-semibold'
                    : 'text-[#475569] hover:text-[#205588] hover:bg-[#e8eff6] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-[#2365a3] text-white' 
                      : 'bg-[#f0f5fa] text-[#205588] group-hover:bg-[#e8eff6]'
                  }`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className={`text-xs font-semibold tracking-wide truncate ${isActive ? 'text-white' : 'text-[#1b2a3a]'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] font-mono truncate ${isActive ? 'text-[#b4d5ff]' : 'text-[#64748b]'}`}>
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
      <div className="p-3 border-t border-[#d8e5f2] bg-[#f8fafc]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#64748b] flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SIEM & EDR Sensor Feed
          </span>
          <span className="font-mono text-[10px] text-emerald-700 font-bold">ONLINE</span>
        </div>
        <div className="w-full bg-[#e8eff6] rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-[#205588] to-[#2365a3] h-full rounded-full w-[98%]"></div>
        </div>
        <div className="mt-1.5 text-[10px] font-mono text-[#64748b] flex justify-between">
          <span>{clients.length} Accounts Synced</span>
          <span className="text-[#205588] font-semibold">SOC 2 Type II</span>
        </div>
      </div>
    </aside>
  );
}
