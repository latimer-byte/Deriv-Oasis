import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Map, 
  Gift, 
  CupSoda, 
  Vote, 
  FileText, 
  Menu, 
  Terminal, 
  HelpCircle,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  Info,
  Slack,
  Sliders,
  X,
  Volume2,
  VolumeX,
  Radio,
  Share2,
  Gamepad2
} from "lucide-react";
import OasisDashboard from "./components/OasisDashboard";
import CheersBoard from "./components/CheersBoard";
import CoffeeRoulette from "./components/CoffeeRoulette";
import VibePolls from "./components/VibePolls";
import ChaosLounge from "./components/ChaosLounge";
import RetroGames from "./components/RetroGames";
import { OfficeDetail, KudosCheers, OfficePoll, CoffeeMatch, ScannerLog, GameScore } from "./types";

// PRE-DEFINED DETAILED DERIV REGIONAL OFFICE INFORMATION
const DERIV_OFFICES: OfficeDetail[] = [
  {
    id: "malta",
    name: "Deriv Malta Office",
    city: "Mosta",
    country: "Malta",
    timezone: "Europe/Malta",
    temp: 22,
    weatherDesc: "Sunny Mediterranean Breeze",
    lunchMenu: ["Ftira Maltese Bread", "Fresh pastizzi", "Rabbit Stew (Fenkata)", "Kinnie juices"],
    localTrivia: "Located at the historic Mosta Valley! Derivians here are famous for sunset shoreline runs, rooftop happy hours on Thursdays, and quick dips in the Mediterranean Sea on warm days.",
    localSlang: [
      { expression: "Mela!", meaning: "Alright! / Indeed! (functions as the ultimate Maltese multi-purpose agreement word)", pronunciation: "Meh-lah!" },
      { expression: "Aw ħabib", meaning: "Hey friend! (the classic warm casual call-out starting coffee breaks)", pronunciation: "Ow ha-beeb" },
      { expression: "Grazzi ħafna", meaning: "Thank you very much (perfect for closing an elaborate PR review session)", pronunciation: "Grat-see haf-nah" }
    ]
  },
  {
    id: "cyberjaya",
    name: "Deriv Malaysia Headquarters",
    city: "Cyberjaya",
    country: "Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    temp: 29,
    weatherDesc: "Tropical Sunlight / Passing Rain",
    lunchMenu: ["Nasi Lemak Ayam Goreng", "Beef Rendang & Roti Canai", "Char Kway Teow", "Iced Milo dinosaur"],
    localTrivia: "Based in Malaysia's core tech hub! Derivians here love having late-night spicy food feasts at local Mamak stalls, hosting intense badminton gaming leagues, and deep-diving on frontend state architectures.",
    localSlang: [
      { expression: "Makan Lah!", meaning: "Let's go eat! (food is almost a religion for team co-working bonding here)", pronunciation: "Mah-kan lah!" },
      { expression: "Abang / Kakak", meaning: "Brother / Sister (polite, extremely friendly way to call pantry teams or peers)", pronunciation: "Ah-bang / Kah-kak" },
      { expression: "Tapau", meaning: "Takeaway packing (vital slang when formatting order lists for Friday communal lunches)", pronunciation: "Tah-pao" }
    ]
  },
  {
    id: "kigali",
    name: "Deriv Rwanda Office",
    city: "Kigali",
    country: "Rwanda",
    timezone: "Africa/Kigali",
    temp: 24,
    weatherDesc: "Eternal Spring / Breezy Warmth",
    lunchMenu: ["Beef Brochettes", "Fried Plantains", "Rwandan Local Espresso", "Akabanga Chilli"],
    localTrivia: "In one of Africa's cleanest and greenest smart cities! Famous for organizing active morning coffee workshops, community fitness drives, and hosting superb inter-office coding bootcamps.",
    localSlang: [
      { expression: "Muraho!", meaning: "Hello! (polite, warm Kinyarwanda greeting to jumpstart your daily team syncs)", pronunciation: "Moo-rah-ho!" },
      { expression: "Amakuru?", meaning: "How are you? (translates literally to 'what is the news?' - highly conversational)", pronunciation: "Ah-mah-koo-roo?" },
      { expression: "Urakoze", meaning: "Thank you (perfect appreciation to wrap up paired desk design efforts)", pronunciation: "Oo-rah-koh-zeh" }
    ]
  },
  {
    id: "dubai",
    name: "Deriv Dubai Office",
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    temp: 34,
    weatherDesc: "Warm Desert Heat",
    lunchMenu: ["Chicken Shawarma wrap", "Creamy Hummus & Falafel", "Saffron Rice", "Chai Karak tea"],
    localTrivia: "Housed in a gorgeous high-altitude skyscraper. Famous for high-tech conference spaces, taking desk stretches looking at the futuristic skyline, and weekend indoor winter skiing outings.",
    localSlang: [
      { expression: "Yalla!", meaning: "Let's go! / Move fast! (constantly used before strolling out to get some Karak Tea)", pronunciation: "Yah-lah!" },
      { expression: "Habibi", meaning: "My friend (brotherly workplace term of endearment and collaboration)", pronunciation: "Ha-bee-bee" },
      { expression: "Shukran", meaning: "Thank you (for stepping in on live hotfixes)", pronunciation: "Shoo-kran" }
    ]
  },
  {
    id: "limassol",
    name: "Deriv Cyprus Beachside Hub",
    city: "Limassol",
    country: "Cyprus",
    timezone: "Asia/Nicosia",
    temp: 26,
    weatherDesc: "Coastal Coastal Sunshine",
    lunchMenu: ["Halloumi wraps", "Pork Souvlaki", "Greek Olives Salad", "Iced Frappé Coffee"],
    localTrivia: "Steps away from the beautiful Limassol beach marina! Derivians here are avid beach volleyball players, frappe coffee specialists, and prioritize oceanfront brainstorming walks.",
    localSlang: [
      { expression: "Kalimera!", meaning: "Good morning! (for an energetic, positive start in the Slack channels)", pronunciation: "Kah-lee-meh-rah!" },
      { expression: "Efcharisto", meaning: "Thank you (for helping with API endpoint routing design)", pronunciation: "Ef-ha-ree-sto" },
      { expression: "Pame!", meaning: "Let's go! (great cue to leave the desk for fresh air or a quick coffee)", pronunciation: "Pah-meh!" }
    ]
  },
  {
    id: "asuncion",
    name: "Deriv Paraguay Office",
    city: "Asunción",
    country: "Paraguay",
    timezone: "America/Asuncion",
    temp: 25,
    weatherDesc: "Tropical Humidity / Cloudy skies",
    lunchMenu: ["Sopa Paraguaya", "Chipa Guasú pies", "Crispy Empanadas", "Tereré Cold Herbal Tea"],
    localTrivia: "Passionate about passing around the custom Tereré double-walled cup during afternoon coding iterations, and holding delicious weekend asado barbecues for team celebrations.",
    localSlang: [
      { expression: "¡Hola amigo!", meaning: "Hello friend! (classic welcoming vibe)", pronunciation: "Oh-lah ah-mee-goh" },
      { expression: "Tereré", meaning: "Traditional ice-cold yerba mate tea (an absolute bonding ritual in the Paraguayan office)", pronunciation: "Teh-reh-reh" },
      { expression: "¡Gracias kape!", meaning: "Thanks buddy! (casual local slang expression to show rapid appreciation to friends)", pronunciation: "Grah-see-as kah-peh" }
    ]
  }
];

export default function App() {
  const [kudos, setKudos] = useState<KudosCheers[]>([]);
  const [polls, setPolls] = useState<OfficePoll[]>([]);
  const [coffeeMatches, setCoffeeMatches] = useState<CoffeeMatch[]>([]);
  const [logs, setLogs] = useState<ScannerLog[]>([]);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "kudos" | "coffee" | "polls" | "chaos" | "games" | "logs">("dashboard");
  
  // Immersive App states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chaosCatalyst, setChaosCatalyst] = useState<number>(75);
  const [customStatus, setCustomStatus] = useState("");
  const [statusStatus, setStatusStatus] = useState("");

  // Helper code to post events to the configured Slack Webhook securely
  const handlePostSlack = async (message: string, type?: string, data?: any): Promise<boolean> => {
    const webhookUrl = localStorage.getItem("oasis_slack_webhook") || "";
    try {
      const response = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          message,
          type,
          data
        })
      });
      return response.ok;
    } catch (err) {
      console.error("Slack integration post fail:", err);
      return false;
    }
  };

  // Fetch initial state on startup
  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      if (response.ok) {
        const data = await response.json();
        setKudos(data.kudos || []);
        setPolls(data.polls || []);
        setCoffeeMatches(data.coffeeMatches || []);
        setLogs(data.logs || []);
        setGameScores(data.gameScores || []);
      }
    } catch (err) {
      console.error("Error retrieving DerivOasis backend state:", err);
    }
  };

  useEffect(() => {
    fetchState();
    // Poll logs and updates occasionally to keep the feeds fresh
    const interval = setInterval(fetchState, 35000);
    return () => clearInterval(interval);
  }, []);

  // Post logging message locally to display in visual event logs tab
  const addClientLog = (level: "info" | "success" | "warn" | "error", message: string) => {
    const newLogItem: ScannerLog = {
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      level,
      message
    };
    setLogs(prev => [newLogItem, ...prev]);
  };

  // Callback to post Kudos
  const handleAddKudos = async (newKudosFields: any) => {
    addClientLog("info", "Sending new Cheers Kudos package to server...");
    try {
      const response = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKudosFields)
      });
      if (response.ok) {
        addClientLog("success", `Kudos successfully registered in the Deriv global watercooler feed.`);
        fetchState();

        // Push to Slack if set to auto-dispatch
        const isSlackAutoEnabled = localStorage.getItem("oasis_auto_kudos") === "true";
        if (isSlackAutoEnabled) {
          handlePostSlack(
            `🎉 New Kudos Cheers on DerivOasis!`,
            "kudos",
            newKudosFields
          );
        }
      } else {
        addClientLog("error", "Failed posting Kudos to server endpoint.");
      }
    } catch (err: any) {
      addClientLog("error", `Network fail posting Kudos: ${err.message}`);
    }
  };

  // Callback to Like/Upvote Kudos
  const handleLikeKudos = async (id: string) => {
    try {
      const response = await fetch("/api/kudos/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        fetchState();
      }
    } catch (err) {
      console.error("Error liking Kudos:", err);
    }
  };

  // Callback to Vote on Poll
  const handleVotePoll = async (pollId: string, optionId: string) => {
    try {
      const response = await fetch("/api/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionId })
      });
      if (response.ok) {
        fetchState();
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    }
  };

  // Join Coffee Roulette Pool & get Match
  const handleTriggerJoinPool = async (office: string) => {
    const response = await fetch("/api/coffee/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userOffice: office })
    });
    if (!response.ok) {
      throw new Error("Could not find matching peer in Coffee Roulette pool.");
    }
    const match = await response.json();
    fetchState();

    // Push to Slack if set to auto-dispatch
    const isSlackAutoEnabled = localStorage.getItem("oasis_auto_coffee") === "true";
    if (isSlackAutoEnabled) {
      handlePostSlack(
        `☕ Coffee Match Established on DerivOasis!`,
        "coffee",
        match
      );
    }

    return match;
  };

  // Custom live status broadcast
  const handleBroadcastStatus = async () => {
    if (!customStatus.trim()) return;
    setStatusStatus("Broadcasting...");
    addClientLog("info", `📣 Thought Broadcast: "${customStatus}"`);
    
    const isSlackWebhookSet = !!(localStorage.getItem("oasis_slack_webhook") || "").trim();
    if (isSlackWebhookSet) {
      await handlePostSlack(`📣 *Teammate status broadcast:* "${customStatus}"`, "general");
    }

    setCustomStatus("");
    setStatusStatus("Broadcasted! 🚀");
    setTimeout(() => setStatusStatus(""), 2000);
  };

  // Styling helper for tabs
  const getTabClass = (tab: typeof activeTab) => {
    const isSelected = activeTab === tab;
    return `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 select-none cursor-pointer group ${
      isSelected 
        ? "bg-deriv-red text-white shadow-lg shadow-deriv-red/20 transform scale-[1.02]" 
        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
    }`;
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "success": return "text-emerald-400 border-emerald-950/30 bg-emerald-950/20";
      case "warn": return "text-amber-400 border-amber-950/30 bg-amber-950/20";
      case "error": return "text-deriv-red border-red-950/30 bg-red-950/20";
      default: return "text-slate-300 border-slate-850 bg-slate-900/40";
    }
  };

  return (
    <div 
      id="deriv_oasis_mainframe" 
      className={`min-h-screen bg-slate-100 flex flex-col font-sans md:h-screen md:overflow-hidden transition-all duration-300 ${
        chaosCatalyst > 92 ? "bg-red-50/5" : ""
      }`}
    >
      {/* Mobile Top Header Banner bar */}
      <div className="md:hidden bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-900 z-30 shrink-0 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-deriv-red rounded-lg flex items-center justify-center shadow-md shadow-deriv-red/20">
            <span className="text-white text-xs font-black">D</span>
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-white leading-tight">Deriv<span className="text-deriv-red">Oasis</span></span>
            <span className="text-[7px] text-deriv-red/80 font-black block tracking-widest uppercase leading-none">Culture app</span>
          </div>
        </div>

        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition active:scale-95"
          title="Open Menu"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Outer Flex Container for Sidebar + Content */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        
        {/* Mobile Flyout Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-950/70 z-40 md:hidden animate-fade-in"
          ></div>
        )}

        {/* SIDEBAR NAVIGATION - Rich Dark theme, premium static feel */}
        <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-950 text-slate-150 flex flex-col justify-between shrink-0 border-r border-slate-900 shadow-2xl md:shadow-xs transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0 animate-fade-in-right" : "-translate-x-full md:translate-x-0"
        }`}>
          <div>
            {/* Logo Heading area */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-deriv-red rounded-lg flex items-center justify-center shadow-md shadow-deriv-red/20 animate-pulse">
                  <div className="w-5 h-5 bg-slate-950 rounded-md flex items-center justify-center text-deriv-red text-[13px] font-black">
                    D
                  </div>
                </div>
                <div>
                  <h1 className="font-extrabold text-sm leading-tight tracking-tight text-white hover:text-deriv-red transition-colors duration-200">
                    <span className="font-extrabold text-slate-100">Deriv</span><span className="text-deriv-red">Oasis</span>
                  </h1>
                  <p className="text-[9px] text-deriv-red font-black uppercase tracking-widest mt-0.5">Global Culture Hub</p>
                </div>
              </div>

              {/* Close Drawer Button on Mobile */}
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition"
                title="Close drawer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Sync connection status card */}
            <div className="px-5 pt-4">
              <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/65">
                <Clock size={11} className="text-deriv-red animate-spin-slow text-xs shrink-0" />
                <span className="text-slate-350">Workspace Sync: <span className="text-emerald-400 font-bold">Active</span></span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="p-4 space-y-1.5">
              <button 
                type="button" 
                onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
                className={getTabClass("dashboard")}
              >
                <Building2 size={16} className={activeTab === "dashboard" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Global Oasis Desk</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("kudos"); setSidebarOpen(false); }}
                className={getTabClass("kudos")}
              >
                <Gift size={16} className={activeTab === "kudos" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Cheers & Kudos Board</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("coffee"); setSidebarOpen(false); }}
                className={getTabClass("coffee")}
              >
                <CupSoda size={16} className={activeTab === "coffee" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Coffee Roulette Match</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("polls"); setSidebarOpen(false); }}
                className={getTabClass("polls")}
              >
                <Vote size={16} className={activeTab === "polls" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Vibe Survey Polls</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("chaos"); setSidebarOpen(false); }}
                className={getTabClass("chaos")}
              >
                <Slack size={16} className={activeTab === "chaos" ? "text-white" : "group-hover:text-deriv-red transition text-deriv-red"} />
                <span>Slack & Chaos Lounge</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("games"); setSidebarOpen(false); }}
                className={getTabClass("games")}
              >
                <Gamepad2 size={16} className={activeTab === "games" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Retro Games Arena</span>
              </button>

              <button 
                type="button" 
                onClick={() => { setActiveTab("logs"); setSidebarOpen(false); }}
                className={getTabClass("logs")}
              >
                <Terminal size={16} className={activeTab === "logs" ? "text-white" : "group-hover:text-deriv-red transition"} />
                <span>Watercooler Logs</span>
                {logs.length > 0 && (
                  <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold transition-colors ${activeTab === 'logs' ? 'bg-slate-900 text-white' : 'bg-slate-800 text-deriv-red'}`}>
                    {logs.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Sidebar Footer and Auth status indicator */}
          <div className="p-4 border-t border-white/5 space-y-3 bg-slate-900/30">
            <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 space-y-1.5">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Desk Link Status</span>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span>Security Auth</span>
                <span className="text-deriv-red flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-deriv-red animate-ping"></span> SECURE
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-normal flex items-start gap-1">
              <Info size={11} className="text-slate-400 shrink-0 mt-0.5" />
              <span>DerivOasis brings global Derivians close together without financial or account clutter.</span>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CANVAS - True viewport content box */}
        <main className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-hidden relative">
          
          {/* Header Bar panel controls */}
          <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap gap-4 items-center justify-between shadow-2xs shrink-0 z-10">
            
            {/* Viewport label & Tab tag */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hidden sm:inline-flex">
                <Map size={13} className="text-slate-400 shrink-0" />
                <span>WORKSPACE:</span>
              </span>
              <span className="text-deriv-red font-black text-[11px] uppercase bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                {activeTab === "dashboard" && "Office Switchboard"}
                {activeTab === "kudos" && "Team Peer Shoutout Matrix"}
                {activeTab === "coffee" && "Watercooler Matchmaking Hub"}
                {activeTab === "polls" && "Lifestyle Vote Ledger"}
                {activeTab === "chaos" && "Slack Desk & Chaos Lounge"}
                {activeTab === "games" && "Retro Childhood Games Arena"}
                {activeTab === "logs" && "Live Event Logs Console"}
              </span>
            </div>

            {/* Quick Status broadcaster field */}
            <div className="flex flex-wrap items-center gap-2.5 ml-auto">
              
              {/* Teammate Broadcast Form */}
              <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 transition border border-slate-200 px-2.5 py-1 rounded-xl text-xs shadow-3xs max-w-[280px]">
                <Share2 size={12} className="text-slate-400 animate-pulse" />
                <input 
                  type="text"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  placeholder="Share quick status thought..."
                  className="bg-transparent text-xs text-slate-850 font-bold focus:outline-hidden w-40 placeholder:text-slate-400 text-ellipsis truncate"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleBroadcastStatus();
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={handleBroadcastStatus}
                  disabled={!customStatus.trim()}
                  className="bg-deriv-red hover:bg-deriv-red-hover disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold uppercase text-[9px] px-2.5 py-1 rounded-lg active:scale-95 transition cursor-pointer shrink-0"
                >
                  {statusStatus || "Post"}
                </button>
              </div>

              {/* Chaos Regulator Dial */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-xs shadow-3xs">
                <div className="flex items-center gap-1 text-slate-500 font-mono text-[9px] font-extrabold">
                  <Sliders size={12} className="text-deriv-red animate-pulse" />
                  <span>CHAOS:</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={chaosCatalyst} 
                  onChange={(e) => {
                    const newVal = Number(e.target.value);
                    setChaosCatalyst(newVal);
                    if (newVal === 100) {
                      addClientLog("warn", "☢️ MAXIMUM CHAOS MODE ENFORCED! Fastened caffeine timelines activated.");
                    } else if (newVal === 0) {
                      addClientLog("info", "❄️ Absolut Zero Chaos alignment configured. Calm zen state initiated.");
                    }
                  }} 
                  className="w-16 xl:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-deriv-red"
                  title="Chaos catalyst level changer"
                />
                <span className="font-bold text-deriv-red font-mono text-[9px] w-6 text-center">
                  {chaosCatalyst}%
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 capitalize hidden xl:inline">
                  {chaosCatalyst < 20 ? "Zen🧘" : chaosCatalyst < 50 ? "Relaxed🍌" : chaosCatalyst < 85 ? "Espresso☕" : "Chaos🚀"}
                </span>
              </div>

              {/* Active Teammate indicator badge */}
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-3xs shrink-0">
                <Users size={11} className="text-slate-400 shrink-0" />
                <span>Oasis online</span>
              </span>
            </div>
          </header>

          {/* Dynamic Content Panel view boundaries */}
          <div className="flex-1 overflow-y-auto app-scrollbar p-6 bg-slate-50/50">
            
            {/* View Tab screens mapping layout */}
            <div className="max-w-7xl w-full mx-auto space-y-6 pb-8 animate-fade-in">
              {activeTab === "dashboard" && (
                <OasisDashboard 
                  offices={DERIV_OFFICES} 
                  onAddLog={addClientLog} 
                />
              )}

              {activeTab === "kudos" && (
                <CheersBoard 
                  kudos={kudos} 
                  onAddKudos={handleAddKudos}
                  onLikeKudos={handleLikeKudos}
                />
              )}

              {activeTab === "coffee" && (
                <CoffeeRoulette
                  coffeeMatches={coffeeMatches}
                  onTriggerJoinPool={handleTriggerJoinPool}
                  onAddLog={addClientLog}
                />
              )}

              {activeTab === "polls" && (
                <VibePolls
                  polls={polls}
                  onVotePoll={handleVotePoll}
                  onAddLog={addClientLog}
                />
              )}

              {activeTab === "chaos" && (
                <ChaosLounge
                  onAddLog={addClientLog}
                  onPostSlack={handlePostSlack}
                />
              )}

              {activeTab === "games" && (
                <RetroGames
                  onAddLog={addClientLog}
                  gameScores={gameScores}
                  onRefreshScores={fetchState}
                />
              )}

              {activeTab === "logs" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  <div className="bg-slate-950 p-4 border-b border-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-deriv-red" />
                      <span className="font-mono text-xs font-bold text-slate-100">DerivOasis Global Event Logs</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Updated automatically
                    </div>
                  </div>

                  <div className="p-5 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto divide-y divide-slate-800/40">
                    {logs.length === 0 ? (
                      <div className="text-slate-500 italic py-6 text-center">
                        No logs collected today. Try matching on Coffee Roulette or posting peer kudos!
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div 
                          key={log.id} 
                          className={`py-2 px-3 border rounded-lg transition-colors flex items-start gap-3 justify-between ${getLogLevelColor(log.level)}`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] opacity-50 block mb-0.5">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="font-semibold leading-relaxed font-mono">
                              {log.message}
                            </span>
                          </div>
                          <span className={`text-[9px] font-black uppercase font-mono tracking-widest opacity-80 shrink-0 px-1.5 py-0.5 border rounded-sm ml-4 ${
                            log.level === 'success' ? 'border-emerald-700/50 text-emerald-300' :
                            log.level === 'warn' ? 'border-amber-700/50 text-amber-300' :
                            log.level === 'error' ? 'border-deriv-red/50 text-deriv-red' :
                            'border-slate-700/50 text-slate-350'
                          }`}>
                            {log.level}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Real-time News Ticker Banner tape */}
          <footer className="bg-slate-950 text-white h-10 flex items-center overflow-hidden border-t border-slate-900 text-[10px] uppercase font-mono tracking-wider shrink-0 z-20 shadow-inner">
            <div className="bg-deriv-red text-white h-full px-4 flex items-center font-black select-none z-30 whitespace-nowrap shadow-md shadow-deriv-red/20 shrink-0 gap-1.5">
              <Radio size={12} className="animate-pulse text-white-500 shrink-0" />
              <span>OASIS LIVE WIRE</span>
            </div>
            
            <div className="flex-1 relative overflow-hidden h-full flex items-center bg-slate-950">
              <div className="absolute whitespace-nowrap animate-marquee flex gap-12 items-center pl-4 font-bold text-slate-200">
                <span>✨ SPECIAL CORRIDOR RUNWAY NEWS: MEDITERRANEAN BEACH RUN MEETS SHORELINE SUNSETS DESK IN MALTA ☀️</span>
                <span>⭐ PEER CHEERS HIGHLIGHT: "{kudos.length > 0 ? kudos[0].message : 'Keep coding with high frequencies across Rwanda and Cyberjaya!'}" 🚀</span>
                <span>✨ WATERCOOLER COFFEE ROULETTE IS ACTIVELY BINDING IN ASUNCIÓN, CYPRUS, AND MALTA OFFICES ☕</span>
                <span>🔮 ORACLE DECREE: "{chaosCatalyst > 80 ? 'HIGH CAFFEINATED TIMELINES ARE OPEN. DANCE AT YOUR DESK' : 'RELAX AND SWELL VIBES CORRIDOR OPEN'}" ✨</span>
                <span>⌨️ WEB AUDIO DESK SYNTH ACTIVE IN THE SLACK CHAOS LOUNGE - PLUG IN AND BREATHE🧘</span>
                
                {/* Marquee duplicate loops */}
                <span>✨ SPECIAL CORRIDOR RUNWAY NEWS: MEDITERRANEAN BEACH RUN MEETS SHORELINE SUNSETS DESK IN MALTA ☀️</span>
                <span>⭐ PEER CHEERS HIGHLIGHT: "{kudos.length > 0 ? kudos[0].message : 'Keep coding with high frequencies across Rwanda and Cyberjaya!'}" 🚀</span>
                <span>✨ WATERCOOLER COFFEE ROULETTE IS ACTIVELY BINDING IN ASUNCIÓN, CYPRUS, AND MALTA OFFICES ☕</span>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
