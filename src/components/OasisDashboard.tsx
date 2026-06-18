import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Clock, 
  CloudSun, 
  UtensilsCrossed, 
  Sparkles, 
  Languages, 
  Volume2, 
  ChevronRight,
  HelpCircle,
  MapPin
} from "lucide-react";
import { OfficeDetail } from "../types";

interface OasisDashboardProps {
  offices: OfficeDetail[];
  onAddLog: (level: "info" | "success" | "warn" | "error", message: string) => void;
}

export default function OasisDashboard({ offices, onAddLog }: OasisDashboardProps) {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("malta");
  const [timeTick, setTimeTick] = useState<Date>(new Date());

  // Updates live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(new Date());
    }, 1050);
    return () => clearInterval(timer);
  }, []);

  const getLocalOfficeTime = (tz: string) => {
    try {
      return timeTick.toLocaleTimeString("en-US", {
        timeZone: tz,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch {
      return timeTick.toLocaleTimeString();
    }
  };

  const selectedOffice = offices.find(o => o.id === selectedOfficeId) || offices[0];

  const handleSelectOffice = (id: string, name: string) => {
    setSelectedOfficeId(id);
    onAddLog("info", `Selected ${name} dashboard perspective! Loaded regional clocks and lunch schedules.`);
  };

  return (
    <div id="oasis_dashboard_wrapper" className="space-y-6 animate-fade-in">
      {/* Quick Office Switcher - Compact Pill Tray */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <label className="block text-[10px] font-extrabold text-deriv-red uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <MapPin size={11} className="text-deriv-red" />
          <span>Deriv Global Locations Oasis</span>
        </label>
        
        <div className="flex flex-wrap gap-2">
          {offices.map((office) => {
            const isActive = selectedOfficeId === office.id;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => handleSelectOffice(office.id, office.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isActive 
                    ? "bg-deriv-red text-white shadow-md shadow-deriv-red/20 ring-1 ring-deriv-red/50" 
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                <span>{office.city}</span>
                <span className="text-[10px] font-mono opacity-60">({office.country.slice(0,3).toUpperCase()})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Side: Specific Active Office details */}
        <div className="md:col-span-8 space-y-5">
          {/* Active Office Hero Board */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200">
            {/* Split top */}
            <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-deriv-red rounded px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider mb-2">
                  <Building2 size={10} /> Active Workplace View
                </span>
                <h2 className="font-extrabold text-slate-900 text-xl tracking-tight leading-none mb-1">
                  {selectedOffice?.name}
                </h2>
                <p className="text-slate-500 text-xs">
                  {selectedOffice?.city}, {selectedOffice?.country}
                </p>
              </div>

              {/* Dynamic live clock readout */}
              <div className="bg-slate-950 text-slate-100 rounded-2xl px-5 py-3 border border-slate-850 flex items-center gap-3 shadow-inner">
                <Clock className="text-deriv-red shrink-0 animate-spin-slow" size={20} />
                <div>
                  <div className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">Office time</div>
                  <div className="font-mono text-base font-black tracking-tight text-deriv-red select-all">
                    {getLocalOfficeTime(selectedOffice?.timezone)}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Weather & Vibe readout */}
              <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3.5">
                <div id="climate_icon_box" className="p-2.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-lg">
                  <CloudSun size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">climate & temperature</h4>
                  <div className="text-base font-black text-slate-800">
                    {selectedOffice?.temp}°C
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium leading-relaxed">
                    Condition: <strong className="text-slate-705 font-bold">{selectedOffice?.weatherDesc}</strong>. The outdoor lifestyle here heavily guides daily meeting sync locations!
                  </p>
                </div>
              </div>

              {/* Lunch Menu Schedule */}
              <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3.5">
                <div id="cuisine_icon_box" className="p-2.5 bg-rose-50 border border-rose-200 text-deriv-red rounded-lg">
                  <UtensilsCrossed size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Today's Catered Treats</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedOffice?.lunchMenu.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded px-1.5 py-0.5 shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    *Cuisine provided free at pantry areas to foster collaborative meal times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Local Office Trivia Card */}
          <div className="bg-rose-50/20 border border-rose-205/30 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-rose-50 text-deriv-red rounded-xl shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">
                Office Lifestyle Fact
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                {selectedOffice?.localTrivia}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Local Office Language / Slang Translator Mini-card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
              <Languages size={14} className="text-deriv-red" />
              <span>Office Slang Dictionary</span>
            </h3>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Every office has casual lingo we use to break the ice! Click any speech bubble below to check translation coordinates.
            </p>

            <div className="space-y-2.5">
              {selectedOffice?.localSlang.map((slang, index) => (
                <div 
                  key={index} 
                  className="bg-slate-50 hover:bg-rose-50/40 border border-slate-200/60 hover:border-rose-300 rounded-xl p-3 transition duration-150 cursor-pointer group"
                  onClick={() => onAddLog("info", `Pronunciation guide for "${slang.expression}": "${slang.pronunciation}"`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs font-mono bg-white border border-slate-200/50 px-1.5 py-0.5 rounded shadow-2xs group-hover:border-rose-300 transition-colors">
                      {slang.expression}
                    </span>
                    <button 
                      type="button" 
                      title="Audio Pronunciation"
                      className="text-slate-400 group-hover:text-deriv-red hover:scale-115 transition"
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 font-bold">
                    Meaning: <span className="text-slate-800 font-medium font-sans">{slang.meaning}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 font-mono italic">
                    Pronounce: "{slang.pronunciation}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats sidebar widget */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-white">
            <h3 className="text-deriv-red font-extrabold text-[10px] uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>derivian community stats</span>
              <span className="w-1.5 h-1.5 rounded-full bg-deriv-red animate-ping"></span>
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">Total Offices:</span>
                <span className="font-bold">6 Locations</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">Active Derivians:</span>
                <span className="font-mono font-bold text-deriv-red">1,500+ global dev files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Languages Shared:</span>
                <span className="font-bold">12+ Dialects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
