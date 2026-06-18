import React, { useState } from "react";
import { 
  Award, 
  Heart, 
  Send, 
  User, 
  Building, 
  Search, 
  Filter, 
  Gift, 
  CheckCircle,
  Sparkles
} from "lucide-react";
import { KudosCheers, BadgeType } from "../types";

interface CheersBoardProps {
  kudos: KudosCheers[];
  onAddKudos: (data: any) => Promise<void>;
  onLikeKudos: (id: string) => Promise<void>;
}

const BADGES_CONFIG: { badge: BadgeType; desc: string; color: string; iconBg: string }[] = [
  { badge: "Bug Squasher", desc: "For tracking and squashing critical bugs", color: "text-red-600 border-red-200 bg-red-50", iconBg: "bg-red-500" },
  { badge: "Code Craftsman", desc: "For clean, elegant, pristine pull requests", color: "text-blue-600 border-blue-200 bg-blue-50", iconBg: "bg-blue-500" },
  { badge: "Helpful Hero", desc: "Always around to answer questions & support", color: "text-amber-600 border-amber-200 bg-amber-50", iconBg: "bg-amber-500" },
  { badge: "PR Guru", desc: "For deep, highly detailed code feedback", color: "text-purple-600 border-purple-200 bg-purple-50", iconBg: "bg-purple-500" },
  { badge: "Coffee Buddy", desc: "Great conversationalist & quick coffee breaks", color: "text-indigo-600 border-indigo-200 bg-indigo-50", iconBg: "bg-indigo-500" },
  { badge: "Creative Catalyst", desc: "For thinking outside the box with styling", color: "text-emerald-600 border-emerald-200 bg-emerald-50", iconBg: "bg-emerald-500" },
  { badge: "Zen Master", desc: "Brings calm, steady focus during deployment runs", color: "text-teal-600 border-teal-200 bg-teal-50", iconBg: "bg-teal-500" },
  { badge: "Lego Master", desc: "A superb builder of systems & UI assemblies", color: "text-pink-600 border-pink-200 bg-pink-50", iconBg: "bg-pink-500" }
];

export default function CheersBoard({ kudos, onAddKudos, onLikeKudos }: CheersBoardProps) {
  // Query Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>("All");

  // Form State
  const [senderName, setSenderName] = useState("");
  const [senderOffice, setSenderOffice] = useState("malta");
  const [recipientName, setRecipientName] = useState("");
  const [recipientOffice, setRecipientOffice] = useState("cyberjaya");
  const [selectedBadge, setSelectedBadge] = useState<BadgeType>("Helpful Hero");
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Office choices
  const officesList = [
    { value: "malta", label: "Malta Office (Mosta)" },
    { value: "cyberjaya", label: "Malaysia Office (Cyberjaya)" },
    { value: "kigali", label: "Rwanda Office (Kigali)" },
    { value: "dubai", label: "Dubai Office (UAE)" },
    { value: "limassol", label: "Cyprus Office (Limassol)" },
    { value: "asuncion", label: "Paraguay Office (Asunción)" }
  ];

  const handlePublishKudos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !recipientName || !messageText) return;

    setIsSubmitting(true);
    try {
      await onAddKudos({
        senderName,
        senderOffice,
        recipientName,
        recipientOffice,
        badge: selectedBadge,
        message: messageText
      });
      setSubmitSuccess(true);
      setMessageText("");
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering list locally
  const filteredKudos = kudos.filter(k => {
    const matchesText = 
      k.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBadge = selectedBadgeFilter === "All" || k.badge === selectedBadgeFilter;
    return matchesText && matchesBadge;
  });

  const getBadgeConfig = (badgeName: string) => {
    return BADGES_CONFIG.find(bc => bc.badge === badgeName) || BADGES_CONFIG[2];
  };

  return (
    <div id="kudos_board_parent" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* LEFT: Shoutout Entry Form */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-fit sticky top-4 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
          <Gift className="text-deriv-red shrink-0" size={18} />
          <span>Award Peer Kudos & Cheers</span>
        </h3>

        <form onSubmit={handlePublishKudos} className="space-y-4 text-xs font-semibold text-slate-700">
          {/* Sender inputs group */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Sender name"
                className="w-full bg-slate-50 border border-slate-200 focus:border-deriv-red focus:ring-1 focus:ring-deriv-red/20 rounded-lg p-2 font-bold text-slate-705 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Your location</label>
              <select
                value={senderOffice}
                onChange={(e) => setSenderOffice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-705 focus:outline-hidden cursor-pointer"
              >
                {officesList.map(o => (
                  <option key={o.value} value={o.value}>{o.label.split(' ')[0]} Office</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient inputs group */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Colleague Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient name"
                className="w-full bg-slate-50 border border-slate-200 focus:border-deriv-red focus:ring-1 focus:ring-deriv-red/20 rounded-lg p-2 font-bold text-slate-705 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Colleague location</label>
              <select
                value={recipientOffice}
                onChange={(e) => setRecipientOffice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-705 focus:outline-hidden cursor-pointer"
              >
                {officesList.map(o => (
                  <option key={o.value} value={o.value}>{o.label.split(' ')[0]} Office</option>
                ))}
              </select>
            </div>
          </div>

          {/* Badges Select Grid */}
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Recognition Badge</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {BADGES_CONFIG.map((bc) => {
                const isSelected = selectedBadge === bc.badge;
                return (
                  <button
                    key={bc.badge}
                    type="button"
                    onClick={() => setSelectedBadge(bc.badge)}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition text-[10px] ${
                      isSelected 
                        ? "bg-rose-50 border-rose-350 text-deriv-red" 
                        : "bg-white border-slate-150 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${bc.iconBg}`} />
                    <span className="font-bold truncate">{bc.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Appreciation Message</label>
            <textarea
              required
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="What did they do to help out? Write a warm message to highlight their impact..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-deriv-red focus:ring-1 focus:ring-deriv-red/20 rounded-lg p-2.5 font-sans font-medium text-slate-700 leading-normal focus:outline-hidden transition"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-deriv-red hover:bg-deriv-red-hover disabled:bg-rose-350 text-white font-extrabold uppercase tracking-wider rounded-xl transition duration-150 active:scale-95 shadow-md shadow-deriv-red/10 cursor-pointer"
          >
            <Send size={12} />
            <span>{isSubmitting ? "Publishing Shoutout..." : "Publish Kudos"}</span>
          </button>

          {submitSuccess && (
            <div className="mt-2 text-center text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle size={12} />
              <span>Kudos added successfully!</span>
            </div>
          )}
        </form>
      </div>

      {/* RIGHT: Kudos Ledger list */}
      <div className="lg:col-span-8 space-y-4">
        {/* Search and Filters toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          {/* Text search */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, office, or praise notes..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-3 rounded-lg focus:border-deriv-red focus:ring-1 focus:ring-deriv-red/20 pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-705 shadow-inner focus:outline-hidden transition"
            />
            <Search className="absolute left-2.5 top-2 text-slate-400 shrink-0" size={13} />
          </div>

          {/* Badge Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
              <Filter size={11} /> Filter Badge:
            </span>
            <select
              value={selectedBadgeFilter}
              onChange={(e) => setSelectedBadgeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Praise badges</option>
              {BADGES_CONFIG.map(bc => (
                <option key={bc.badge} value={bc.badge}>{bc.badge}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kudos Cards list */}
        {filteredKudos.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-16 text-center space-y-3">
            <Award className="mx-auto text-slate-300 animate-pulse" size={40} />
            <h4 className="font-extrabold text-slate-700 text-sm">No Shoutouts Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
              No kudos found for current search parameters. Be the first to start a chain of kindness by awarding some kudos on the left panel!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKudos.map((kudo) => {
              const bgConf = getBadgeConfig(kudo.badge);
              return (
                <div 
                  key={kudo.id} 
                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Header: Colleague Names */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-deriv-red shadow-2xs">
                          <User size={12} />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">
                            {kudo.recipientName}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Building size={10} />
                            <span className="capitalize">{kudo.recipientOffice} Office</span>
                          </div>
                        </div>
                      </div>

                      {/* Badge badge! */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${bgConf.color}`}>
                        <div className={`w-1 h-1 rounded-full ${bgConf.iconBg}`} />
                        <span>{kudo.badge}</span>
                      </span>
                    </div>

                    {/* Praise Message contents */}
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed font-sans">
                      "{kudo.message}"
                    </p>
                  </div>

                  {/* Footer: Sender details & Likes */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400">
                      Shared by <strong className="text-slate-500 font-bold">{kudo.senderName}</strong> ({kudo.senderOffice.toUpperCase()})
                    </div>

                    <button
                      type="button"
                      onClick={() => onLikeKudos(kudo.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50 border border-slate-200/50 hover:border-red-200/50 rounded-lg text-xs font-bold transition active:scale-95 shrink-0 shadow-2xs"
                    >
                      <Heart size={11} className="fill-current text-deriv-red" />
                      <span>{kudo.likes || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
