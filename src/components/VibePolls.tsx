import React, { useState } from "react";
import { 
  BarChart, 
  Vote, 
  CheckCircle, 
  Users, 
  HelpCircle,
  TrendingUp,
  Flame,
  Award
} from "lucide-react";
import { OfficePoll } from "../types";

interface VibePollsProps {
  polls: OfficePoll[];
  onVotePoll: (pollId: string, optionId: string) => Promise<void>;
  onAddLog: (level: "info" | "success" | "warn" | "error", message: string) => void;
}

export default function VibePolls({ polls, onVotePoll, onAddLog }: VibePollsProps) {
  const [clickedOptionId, setClickedOptionId] = useState<{ [pollId: string]: string }>({});
  const [votingState, setVotingState] = useState<{ [pollId: string]: boolean }>({});

  const handleVoteCast = async (pollId: string, optionId: string, label: string) => {
    // Prevent double vote in exact session
    if (clickedOptionId[pollId]) return;

    setVotingState(prev => ({ ...prev, [pollId]: true }));
    onAddLog("info", `Casting local session vote for: "${label}"...`);

    try {
      await onVotePoll(pollId, optionId);
      setClickedOptionId(prev => ({ ...prev, [pollId]: optionId }));
      onAddLog("success", `Vote counted! Added successfully to global Derivian surveys.`);
    } catch (err: any) {
      onAddLog("error", `Wired connection error. Could not count vote: ${err.message}`);
    } finally {
      setVotingState(prev => ({ ...prev, [pollId]: false }));
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  return (
    <div id="vibe_scrutiny_box" className="space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Vote className="text-deriv-red shrink-0" size={18} />
          <span>Active Derivian Vibe Surveys</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Cast your vote on global office hobby budgets, lunch catering enhancements, and upcoming team socials. Our automated ledger polls coordinate decisions anonymously.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => {
            const hasVoted = !!clickedOptionId[poll.id];
            const activeVotedOptionId = clickedOptionId[poll.id];

            return (
              <div 
                key={poll.id} 
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-3xs"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs tracking-tight flex items-start gap-2 leading-relaxed">
                    <HelpCircle size={14} className="text-deriv-red shrink-0 mt-0.5" />
                    <span>{poll.question}</span>
                  </h4>

                  {/* Options List */}
                  <div className="space-y-2 py-3">
                    {poll.options.map((option) => {
                      const percentage = calculatePercentage(option.votes, poll.totalVotes);
                      const isOptionSelected = activeVotedOptionId === option.id;

                      return (
                        <div key={option.id} className="relative group">
                          {/* Progress bar background */}
                          {hasVoted && (
                            <div 
                              className={`absolute left-0 top-0 bottom-0 rounded-lg transition-all duration-700 ${
                                isOptionSelected ? "bg-rose-100/65" : "bg-slate-200/40"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <button
                            type="button"
                            disabled={hasVoted || votingState[poll.id]}
                            onClick={() => handleVoteCast(poll.id, option.id, option.label)}
                            className={`relative w-full text-left p-3 border rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                              hasVoted 
                                ? isOptionSelected 
                                  ? "border-deriv-red/60 font-extrabold text-deriv-red" 
                                  : "border-slate-100 text-slate-500"
                                : "bg-white border-slate-200 hover:border-deriv-red text-slate-705 active:scale-99"
                            }`}
                          >
                            <span className="truncate pr-4 z-10 flex items-center gap-1.5">
                              {isOptionSelected && <CheckCircle size={12} className="text-deriv-red shrink-0" />}
                              <span>{option.label}</span>
                            </span>

                            {hasVoted ? (
                              <span className="font-mono text-[10px] font-black shrink-0 text-slate-705 z-10">
                                {percentage}% ({option.votes})
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-300 font-semibold opacity-0 group-hover:opacity-100 transition z-10">
                                Cast Vote
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 font-semibold">
                    <Users size={11} className="text-slate-400" />
                    <span>Total Participants: <strong className="text-slate-600 font-extrabold">{poll.totalVotes}</strong></span>
                  </div>

                  {hasVoted && (
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-deriv-red">
                      ✓ Ballot recorded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Culture Clubs Spotlight Card */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-lg">
          <div className="p-3 bg-rose-500/10 text-deriv-red border border-rose-500/20 rounded-xl shrink-0">
            <Flame className="animate-pulse" size={20} />
          </div>
          <div>
            <h4 className="font-black text-deriv-red tracking-wider text-[10px] uppercase mb-0.5">culture club spotlight</h4>
            <h3 className="font-extrabold text-sm text-[#f6fcf9] tracking-tight">Kigali Running Club Leads in Engagement</h3>
            <p className="text-slate-450 text-xs mt-1 leading-relaxed">
              Kigali Running club is hosting its next sunset jog up Mt. Kigali on Friday. Grab local Rwandan espresso from the lounge coffee machine to charge up!
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center shrink-0">
          <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">next event date</span>
          <span className="font-mono text-deriv-red font-extrabold text-xs">FRI, 19th JUNE</span>
        </div>
      </div>
    </div>
  );
}
