import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  FileText, 
  Bell, 
  Radio, 
  Clock, 
  Crosshair, 
  Building2,
  ChevronDown,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCyber } from '../context/CyberContext';

export default function Navbar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    stats, 
    clients,
    selectedClient,
    setSelectedClient,
    setIsCreateEngModalOpen, 
    setIsCreateFindingModalOpen, 
    openReportFor,
    engagements,
    setActiveTab,
    setIsCreateClientModalOpen
  } = useCyber();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-16 border-b border-[#1d3e63] bg-[#0f2238]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Official ImageQuest Top Brand Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#205588] via-[#2365a3] to-[#3882c8] w-full absolute top-0 left-0" />

      {/* Brand & Client Scope Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => {
            setSelectedClient('ALL');
            setActiveTab('clients');
          }}
          className="flex items-center gap-3 cursor-pointer group"
          title="ImageQuest Client Operations Hub"
        >
          <div className="flex items-center gap-2.5">
            <img 
              src="/iq_footer_logo.png" 
              alt="ImageQuest" 
              className="h-7 w-auto group-hover:opacity-95 transition-opacity"
            />
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#2365a3]/25 text-[#b4d5ff] border border-[#2365a3]/50 font-bold tracking-wider hidden sm:inline-block">
              SOC 2 TYPE II
            </span>
          </div>
        </div>

        {/* Global Client Selector / Filter */}
        <div className="flex items-center gap-2 border-l border-[#1d3e63] pl-4">
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 text-[#b4d5ff] absolute left-2.5 pointer-events-none" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-[#0b1a2d] border border-[#1d3e63] hover:border-[#2365a3] rounded-lg pl-8 pr-7 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#2365a3] transition-all appearance-none cursor-pointer max-w-[210px] sm:max-w-xs truncate shadow-inner"
            >
              <option value="ALL">🌐 All Clients (Firm Portfolio)</option>
              <optgroup label="🏥 Healthcare & Hospital Networks" className="bg-[#0b1a2d] text-emerald-400 font-bold">
                {clients.filter(c => c.sector === 'Healthcare').map(c => (
                  <option key={c.id} value={c.name} className="bg-[#0f2238] text-slate-200">
                    🏥 {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏦 Financial Institutions & Banking" className="bg-[#0b1a2d] text-[#b4d5ff] font-bold">
                {clients.filter(c => c.sector === 'Financial').map(c => (
                  <option key={c.id} value={c.name} className="bg-[#0f2238] text-slate-200">
                    🏦 {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 Other Commercial Clients" className="bg-[#0b1a2d] text-slate-400 font-bold">
                {clients.filter(c => c.sector === 'Other').map(c => (
                  <option key={c.id} value={c.name} className="bg-[#0f2238] text-slate-200">
                    🌐 {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {selectedClient !== 'ALL' && (
            <button
              onClick={() => setSelectedClient('ALL')}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#132b47] hover:bg-[#195589] text-[11px] font-mono text-[#b4d5ff] border border-[#1d3e63] transition-colors"
              title="Reset view to all firm clients"
            >
              <span>Reset</span>
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-sm mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedClient === 'ALL' ? "Search client, CVE, engagement, or asset..." : `Search within ${selectedClient}...`}
            className="w-full bg-[#0b1a2d] border border-[#1d3e63] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#2365a3] transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Security Clock */}
        <div className="hidden xl:flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1.5 rounded bg-[#0b1a2d] border border-[#1d3e63] text-[#b4d5ff]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{currentTime || '00:00:00 UTC'}</span>
        </div>

        {/* Quick Action: Log Vulnerability */}
        <button
          onClick={() => setIsCreateFindingModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-all shadow-sm"
          title="Log a discovered security vulnerability"
        >
          <Crosshair className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">+ Finding</span>
        </button>

        {/* Quick Action: New Engagement */}
        <button
          onClick={() => setIsCreateEngModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#205588] hover:bg-[#2365a3] text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-[#205588]/40 border border-[#2365a3]/50"
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132b47] hover:bg-[#1a385c] border border-[#1d3e63] text-slate-200 hover:text-white text-xs font-medium transition-all"
          title="Generate Client Audit Deliverable"
        >
          <FileText className="w-3.5 h-3.5 text-[#b4d5ff]" />
          <span className="hidden md:inline">Audit Report</span>
        </button>
      </div>
    </header>
  );
}
