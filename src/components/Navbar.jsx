import React, { useState, useEffect } from 'react';
import { 
  Search,
  Plus,
  FileText,
  Clock,
  Crosshair,
  Building2,
  ChevronDown,
  X,
  ShieldCheck
} from 'lucide-react';
import { useCyber } from '../context/CyberContext';

export default function Navbar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    clients,
    selectedClient,
    setSelectedClient,
    setIsCreateEngModalOpen, 
    setIsCreateFindingModalOpen, 
    openReportFor,
    engagements,
    setActiveTab
  } = useCyber();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-[#d8e5f2] bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 print:hidden shadow-xs">
      {/* Top Brand Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#205588] via-[#2365a3] to-[#3882c8] w-full absolute top-0 left-0" />

      {/* Brand & Client Scope Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => {
            setSelectedClient('ALL');
            setActiveTab('clients');
          }}
          className="flex items-center gap-3 cursor-pointer group"
          title="Cyber Security Operations Hub"
        >
          <div className="flex items-center gap-2.5">
            {/* CyberPulse Modern Brand Shield */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#205588] to-[#2365a3] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-[#1b2a3a]">
                CYBER<span className="text-[#205588]">PULSE</span>
              </span>
              <span className="text-[10px] font-mono text-[#64748b] block leading-none">
                Security Operations
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#e8eff6] text-[#205588] border border-[#b4d5ff] font-bold tracking-wider hidden sm:inline-block ml-1">
              SOC 2 TYPE II
            </span>
          </div>
        </div>

        {/* Global Client Selector / Filter */}
        <div className="flex items-center gap-2 border-l border-[#d8e5f2] pl-4">
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 text-[#205588] absolute left-2.5 pointer-events-none" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-[#f0f5fa] border border-[#d8e5f2] hover:border-[#205588] rounded-lg pl-8 pr-7 py-1.5 text-xs text-[#1b2a3a] font-mono focus:outline-none focus:border-[#205588] focus:bg-white transition-all appearance-none cursor-pointer max-w-[210px] sm:max-w-xs truncate shadow-2xs font-semibold"
            >
              <option value="ALL">🌐 All Clients (Firm Portfolio)</option>
              <optgroup label="🏥 Healthcare & Hospital Networks" className="font-bold text-emerald-700">
                {clients.filter(c => c.sector === 'Healthcare').map(c => (
                  <option key={c.id} value={c.name} className="text-[#1b2a3a]">
                    🏥 {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏦 Financial Institutions & Banking" className="font-bold text-[#205588]">
                {clients.filter(c => c.sector === 'Financial').map(c => (
                  <option key={c.id} value={c.name} className="text-[#1b2a3a]">
                    🏦 {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 Other Commercial Clients" className="font-bold text-slate-700">
                {clients.filter(c => c.sector === 'Other').map(c => (
                  <option key={c.id} value={c.name} className="text-[#1b2a3a]">
                    🌐 {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-2.5 pointer-events-none" />
          </div>

          {selectedClient !== 'ALL' && (
            <button
              onClick={() => setSelectedClient('ALL')}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#e8eff6] hover:bg-[#d8e7f5] text-[11px] font-mono text-[#205588] border border-[#b4d5ff] transition-colors font-semibold"
              title="Reset view to all firm clients"
            >
              <span>Reset</span>
              <X className="w-3 h-3 text-[#205588]" />
            </button>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedClient === 'ALL' ? "Search client, CVE, engagement, or asset..." : `Search within ${selectedClient}...`}
            className="w-full bg-[#f0f5fa] border border-[#d8e5f2] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#1b2a3a] placeholder-[#64748b] focus:outline-none focus:border-[#205588] focus:bg-white transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-[#1b2a3a]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Security Clock */}
        <div className="hidden xl:flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1.5 rounded bg-[#f0f5fa] border border-[#d8e5f2] text-[#205588] font-semibold">
          <Clock className="w-3 h-3 text-[#205588]" />
          <span>{currentTime || '00:00:00 UTC'}</span>
        </div>

        {/* Quick Action: Log Vulnerability */}
        <button
          onClick={() => setIsCreateFindingModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all shadow-2xs"
          title="Log a discovered security vulnerability"
        >
          <Crosshair className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">+ Finding</span>
        </button>

        {/* Quick Action: New Engagement */}
        <button
          onClick={() => setIsCreateEngModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wide transition-all shadow-sm"
          title="Launch new client security engagement"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Engagement</span>
        </button>

        {/* Report Button */}
        <button
          onClick={() => {
            const targetEng = engagements.find(e => selectedClient === 'ALL' || e.client === selectedClient) || engagements[0];
            openReportFor(targetEng);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8eff6] hover:bg-[#d8e7f5] border border-[#b4d5ff] text-[#205588] hover:text-[#195589] text-xs font-semibold transition-all shadow-2xs"
          title="Generate Client Audit Deliverable"
        >
          <FileText className="w-3.5 h-3.5 text-[#205588]" />
          <span className="hidden md:inline">Audit Report</span>
        </button>
      </div>
    </header>
  );
}
