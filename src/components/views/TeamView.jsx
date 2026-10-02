import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Shield, 
  Mail, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function TeamView() {
  const { team, engagements, searchQuery } = useCyber();
  const [clearanceFilter, setClearanceFilter] = useState('ALL');

  const filteredTeam = team.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.certifications.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClearance = clearanceFilter === 'ALL' || member.clearance.includes(clearanceFilter);
    return matchesSearch && matchesClearance;
  });

  const getClearanceBadge = (clearance) => {
    if (clearance.includes('Top Secret')) {
      return 'bg-purple-950/80 text-purple-300 border-purple-800';
    }
    if (clearance.includes('Secret')) {
      return 'bg-[#205588]/50 text-[#b4d5ff] border-[#2365a3]';
    }
    return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#205588]/30 text-[#b4d5ff] border border-[#2365a3] uppercase">
              Nashville HQ // Practice Leads
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2365a3]" />
            ImageQuest Advisory & Cyber Operations Roster
          </h1>
          <p className="text-xs text-slate-400">
            Executive leadership, vCISO advisory directors, Healthcare (HIPAA) & Banking (FFIEC) practice leads, and offensive security specialists
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Filter Level:</span>
          {['ALL', 'Executive', 'Top Secret', 'Secret', 'Public Trust'].map(c => (
            <button
              key={c}
              onClick={() => setClearanceFilter(c)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                clearanceFilter === c
                  ? 'bg-[#205588] text-white border border-[#2365a3] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#132b47]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => {
          const isHighUtilization = member.utilization >= 90;
          return (
            <div 
              key={member.id}
              className="bg-[#0f2238] border border-[#1d3e63] hover:border-[#2365a3] rounded-xl p-5 shadow-sm transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${member.avatarColor || 'from-[#205588] to-[#2365a3]'} flex items-center justify-center text-white font-bold text-base shadow-md font-mono shrink-0`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{member.role}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 ${getClearanceBadge(member.clearance)}`}>
                  {member.clearance}
                </span>
              </div>

              {/* Workload Utilization */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Workload Capacity:</span>
                  <span className={isHighUtilization ? 'text-amber-400 font-bold' : 'text-[#b4d5ff] font-bold'}>
                    {member.utilization}% {isHighUtilization ? '(Near Cap)' : ''}
                  </span>
                </div>
                <div className="w-full bg-[#0b1a2d] rounded-full h-2 overflow-hidden border border-[#1d3e63]">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isHighUtilization ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-[#205588] to-[#2365a3]'
                    }`}
                    style={{ width: `${member.utilization}%` }}
                  />
                </div>
              </div>

              {/* Certifications Badges */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#2365a3]" /> Validated Industry Certifications:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.certifications.map((cert) => (
                    <span 
                      key={cert}
                      className="px-2 py-0.5 rounded bg-[#132b47] text-slate-200 border border-[#1d3e63] text-[11px] font-mono font-semibold"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#1d3e63] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{member.activeEngagements} Engagements Active</span>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-[#b4d5ff] hover:text-white flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Direct
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
