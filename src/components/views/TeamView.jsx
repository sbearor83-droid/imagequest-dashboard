import React, { useState } from 'react';
import { 
  Users,
  Award,
  Mail
} from 'lucide-react';
import { useCyber } from '../../context/CyberContext';

export default function TeamView() {
  const { team, searchQuery } = useCyber();
  const [clearanceFilter, setClearanceFilter] = useState('ALL');

  const query = searchQuery.toLowerCase();
  const filteredTeam = team.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.certifications.some(c => c.toLowerCase().includes(query));
    // startsWith so "Secret" doesn't also match "Top Secret / SCI"
    const matchesClearance = clearanceFilter === 'ALL' || member.clearance.startsWith(clearanceFilter);
    return matchesSearch && matchesClearance;
  });

  const getClearanceBadge = (clearance) => {
    if (clearance.includes('Top Secret')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (clearance.includes('Secret')) {
      return 'bg-[#e8eff6] text-[#205588] border-[#b4d5ff]';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8eff6] text-[#205588] border border-[#b4d5ff] uppercase">
              Security Operations HQ // Practice Leads
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1b2a3a] tracking-wide flex items-center gap-2">
            <Users className="w-5 h-5 text-[#205588]" />
            Cyber Advisory & Operations Roster
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Executive leadership, vCISO advisory directors, Healthcare (HIPAA) & Banking (FFIEC) practice leads, and offensive security specialists
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#64748b]">Filter Level:</span>
          {['ALL', 'Executive', 'Top Secret', 'Secret', 'Public Trust'].map(c => (
            <button
              key={c}
              onClick={() => setClearanceFilter(c)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                clearanceFilter === c
                  ? 'bg-[#205588] text-white border border-[#205588] font-bold shadow-sm'
                  : 'text-[#475569] hover:text-[#1b2a3a] hover:bg-[#f0f5fa] border border-transparent'
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
              className="bg-white border border-[#d8e5f2] hover:border-[#205588] rounded-xl p-5 shadow-sm transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${member.avatarColor || 'from-[#205588] to-[#2365a3]'} flex items-center justify-center text-white font-bold text-base shadow-sm font-mono shrink-0`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b2a3a]">{member.name}</h3>
                    <p className="text-xs text-[#64748b] font-medium">{member.role}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 ${getClearanceBadge(member.clearance)}`}>
                  {member.clearance}
                </span>
              </div>

              {/* Workload Utilization */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748b]">Workload Capacity:</span>
                  <span className={isHighUtilization ? 'text-amber-600 font-bold' : 'text-[#205588] font-bold'}>
                    {member.utilization}% {isHighUtilization ? '(Near Cap)' : ''}
                  </span>
                </div>
                <div className="w-full bg-[#f0f5fa] rounded-full h-2 overflow-hidden border border-[#d8e5f2]">
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
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#205588]" /> Validated Industry Certifications:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.certifications.map((cert) => (
                    <span 
                      key={cert}
                      className="px-2 py-0.5 rounded bg-[#f0f5fa] text-[#1b2a3a] border border-[#d8e5f2] text-[11px] font-mono font-semibold"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#d8e5f2] flex items-center justify-between text-xs text-[#64748b] font-mono">
                <span>{member.activeEngagements} Engagements Active</span>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-[#205588] hover:text-[#2365a3] flex items-center gap-1 font-semibold"
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
