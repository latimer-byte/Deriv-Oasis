import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Slack, 
  Volume2, 
  VolumeX, 
  Smile, 
  Zap, 
  RefreshCw, 
  Send, 
  Play, 
  Pause, 
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

interface ChaosLoungeProps {
  onAddLog: (level: "info" | "success" | "warn" | "error", message: string) => void;
  onPostSlack: (message: string, type?: string, data?: any) => Promise<boolean>;
}

// Interactive poppable bubble item
interface VibeBubble {
  id: number;
  label: string;
  popped: boolean;
  vibe: string;
  color: string;
}

export default function ChaosLounge({ onAddLog, onPostSlack }: ChaosLoungeProps) {
  // --- STATE FOR SLACK INTEGRATION ---
  const [slackWebhook, setSlackWebhook] = useState<string>(() => {
    return localStorage.getItem("oasis_slack_webhook") || "";
  });
  const [autoAnnounceKudos, setAutoAnnounceKudos] = useState<boolean>(() => {
    return localStorage.getItem("oasis_auto_kudos") === "true";
  });
  const [autoAnnounceCoffee, setAutoAnnounceCoffee] = useState<boolean>(() => {
    return localStorage.getItem("oasis_auto_coffee") === "true";
  });
  const [slackSending, setSlackSending] = useState(false);
  const [slackSaved, setSlackSaved] = useState(false);

  // --- STATE FOR WATERCOOLER ORACLE ---
  const [currentFortune, setCurrentFortune] = useState<string>("");
  const [currentVibe, setCurrentVibe] = useState<string>("");
  const [fetchingFortune, setFetchingFortune] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<Array<{ text: string, vibe: string, time: string }>>(() => {
    const historical = localStorage.getItem("oasis_fortune_history");
    return historical ? JSON.parse(historical) : [];
  });

  // --- STATE FOR OFFICE STRESS POPPER ---
  const [bubbles, setBubbles] = useState<VibeBubble[]>([
    { id: 1, label: "☕", popped: false, vibe: "Double-shot Malta pastizzi energy incoming!", color: "bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-700" },
    { id: 2, label: "💻", popped: false, vibe: "Your next minor PR will be reviewed and merged in 8 minutes flat.", color: "bg-teal-100 border-teal-300 hover:bg-teal-200 text-teal-750" },
    { id: 3, label: "🌶️", popped: false, vibe: "A colleague will challenge you to Akabanga hot sauce. Accept gracefully!", color: "bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-700" },
    { id: 4, label: "🏸", popped: false, vibe: "Cyberjaya headquarters issues you a virtual invite to a high-temp badminton shootout.", color: "bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700" },
    { id: 5, label: "🏖️", popped: false, vibe: "Limassol office is looking at ocean webcams. Time to stretch your calves!", color: "bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700" },
    { id: 6, label: "🧘", popped: false, vibe: "Deep breath in for 4 seconds, hold for 4, release. Vibe aligned.", color: "bg-emerald-100 border-emerald-300 hover:bg-emerald-200 text-emerald-700" },
    { id: 7, label: "🧉", popped: false, vibe: "Asunción mates are loading their Tereré. Hydrate immediately to keep focus!", color: "bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-700" },
    { id: 8, label: "🔥", popped: false, vibe: "Kudos streaks are contagious. Go post one genuine Cheers to a foreign site teammate!", color: "bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-700" },
  ]);
  const [poppedCount, setPoppedCount] = useState(0);

  // --- STATE FOR WEB-AUDIO SYNTHESIZER MIXER ---
  const [synthActive, setSynthActive] = useState(false);
  const [seaVolume, setSeaVolume] = useState(40); // 0-100
  const [birdsFrequency, setBirdsFrequency] = useState(30); // 0-100
  const [keyboardRate, setKeyboardRate] = useState(25); // 0-100

  // Web Audio Nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const seaGainNodeRef = useRef<GainNode | null>(null);
  const synthTimerRef = useRef<any>(null);

  // Synchronize localStorage for Slack configuration
  const handleSaveSlackConfig = () => {
    localStorage.setItem("oasis_slack_webhook", slackWebhook);
    localStorage.setItem("oasis_auto_kudos", autoAnnounceKudos ? "true" : "false");
    localStorage.setItem("oasis_auto_coffee", autoAnnounceCoffee ? "true" : "false");
    setSlackSaved(true);
    onAddLog("success", `Oasis Slack webhook configuration cached locally. Webhook: ${slackWebhook ? "Connected" : "Inactive"}`);
    setTimeout(() => setSlackSaved(false), 2500);
  };

  // Trigger test message to Slack endpoint
  const handleSendTestWebhook = async () => {
    if (!slackWebhook.trim()) {
      onAddLog("error", "Cannot test Slack. Webhook URL string is empty.");
      return;
    }
    setSlackSending(true);
    onAddLog("info", "Dispatching test watercooler broadcast to custom Slack webhook...");
    try {
      const response = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: slackWebhook,
          message: "🚀 *Test announcement from DerivOasis!* Connection is live and global Derivians are syncing vibes.",
          type: "general"
        })
      });
      if (response.ok) {
        onAddLog("success", "Slack Test webhook successfully verified! Message posted.");
      } else {
        const errObj = await response.json();
        onAddLog("error", `Slack configuration test failed: ${errObj.error || "Bad status"}`);
      }
    } catch (err: any) {
      onAddLog("error", `Failed connection to Slack webhook: ${err.message}`);
    } finally {
      setSlackSending(false);
    }
  };

  // Retrieve Gemini chaotic workspace oracle fortune
  const handleFetchFortune = async () => {
    setFetchingFortune(true);
    onAddLog("info", "Consulting the Deriv watercooler oracle for custom predictions...");
    try {
      const response = await fetch("/api/ai/fortune");
      if (response.ok) {
        const data = await response.json();
        setCurrentFortune(data.fortune);
        setCurrentVibe(data.vibeLevel);
        onAddLog("success", `Watercooler Oracle cast a new fortune: "${data.fortune.slice(0, 40)}..."`);
        
        // Save to local history
        const newHistory = [{ text: data.fortune, vibe: data.vibeLevel, time: new Date().toLocaleTimeString() }, ...fortuneHistory].slice(0, 5);
        setFortuneHistory(newHistory);
        localStorage.setItem("oasis_fortune_history", JSON.stringify(newHistory));

        // Auto announce fortune to Slack if webhook URL exists and we want to share the fun!
        if (slackWebhook.trim()) {
          fetch("/api/slack/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              webhookUrl: slackWebhook,
              message: `🔮 *Office Oracle Predicts:* ${data.fortune}`,
              type: "fortune",
              data: { fortune: data.fortune, vibeLevel: data.vibeLevel }
            })
          }).catch(console.error);
        }
      }
    } catch {
      onAddLog("error", "Failed communicating with Workspace Oracle.");
    } finally {
      setFetchingFortune(false);
    }
  };

  // Audio helper: play popping beep
  const playPopSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Fun bubble-wrap pop harmonic sequence
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio Context beep fail:", e);
    }
  };

  // Perform bubble popping
  const handlePopBubble = (id: number, vibe: string) => {
    const bubble = bubbles.find(b => b.id === id);
    if (!bubble || bubble.popped) return;

    playPopSound();
    
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => prev + 1);

    onAddLog("success", `🎈 POPPED bubble index ${id}! Vibe rule: "${vibe}"`);
  };

  // Reset bubblewrap
  const handleResetBubbles = () => {
    setBubbles(prev => prev.map(b => ({ ...b, popped: false })));
    setPoppedCount(0);
    onAddLog("info", "Refreshed stress bubblewrap. Happy popping!");
  };

  // Web Audio Synth ambient sound generation loops
  const initializeAmbientSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // 1. Create filtered sea waves white noise
      const wavesNode = ctx.createGain();
      wavesNode.gain.setValueAtTime(0.0, ctx.currentTime);
      
      // Let's synthesize pseudo-sea noise using short noise cycles
      // To keep it simple & performant without large buffers, we build a gentle ocean sweep oscillator
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      filter.frequency.setValueAtTime(250, ctx.currentTime);

      const seaLfo = ctx.createOscillator();
      seaLfo.type = "sine";
      seaLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Slow sweep
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);

      // Low frequency oscillator modulates the sweep filter
      seaLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // We'll hook an actual low-volume oscillator to the filter to mimic beach spray
      const sprayNode = ctx.createOscillator();
      sprayNode.type = "sawtooth";
      sprayNode.frequency.setValueAtTime(45, ctx.currentTime); // very low rumble

      const sprayGain = ctx.createGain();
      sprayGain.gain.setValueAtTime(0.05, ctx.currentTime);

      sprayNode.connect(sprayGain);
      sprayGain.connect(filter);

      const seaMasterGain = ctx.createGain();
      seaMasterGain.gain.setValueAtTime((seaVolume / 100) * 0.12, ctx.currentTime);

      filter.connect(seaMasterGain);
      seaMasterGain.connect(ctx.destination);

      seaLfo.start();
      sprayNode.start();

      // Guard references so we can update volume or shut it down
      seaGainNodeRef.current = seaMasterGain;

      // 2. Start timer loop to play random bird chirping and keyboard terminal clicks
      const runPeriodicSounds = () => {
        if (!synthActive) return;

        // Bird chirping randomly (Kigali vibe!)
        if (Math.random() * 100 < birdsFrequency) {
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          chirpOsc.connect(chirpGain);
          chirpGain.connect(ctx.destination);

          chirpOsc.type = "sine";
          const chirpBaseFreq = 2200 + Math.random() * 800;
          chirpOsc.frequency.setValueAtTime(chirpBaseFreq, ctx.currentTime);
          chirpOsc.frequency.exponentialRampToValueAtTime(chirpBaseFreq + 400, ctx.currentTime + 0.15);

          chirpGain.gain.setValueAtTime(0.0, ctx.currentTime);
          chirpGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

          chirpOsc.start();
          chirpOsc.stop(ctx.currentTime + 0.16);
        }

        // Keyboard clicks (Cyberjaya dev speed!)
        if (Math.random() * 100 < keyboardRate) {
          const clickOsc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          clickOsc.connect(clickGain);
          clickGain.connect(ctx.destination);

          clickOsc.type = "triangle";
          clickOsc.frequency.setValueAtTime(150 + Math.random() * 300, ctx.currentTime);

          clickGain.gain.setValueAtTime(0.007, ctx.currentTime);
          clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

          clickOsc.start();
          clickOsc.stop(ctx.currentTime + 0.04);
        }

        synthTimerRef.current = setTimeout(runPeriodicSounds, 450);
      };

      // Set state and start scheduling timers
      setSynthActive(true);
      onAddLog("success", "🎧 Waveform synthesizer successfully activated! Enjoy procedural workspace melodies.");
      
      // Delay starting timer slighty to trigger properly
      setTimeout(runPeriodicSounds, 100);

    } catch (err: any) {
      console.error("Workspace Synth initialize failure:", err);
      onAddLog("error", "Web Audio API initialized in bad state. Click try again.");
    }
  };

  // Stop Synthesizer
  const stopAmbientSynth = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
    }
    if (seaGainNodeRef.current) {
      try {
        seaGainNodeRef.current.gain.setValueAtTime(0.0, audioCtxRef.current?.currentTime || 0);
      } catch {}
    }
    setSynthActive(false);
    onAddLog("info", "Mixer synthesiser set to standby.");
  };

  // Adjust ocean volume on-the-fly
  useEffect(() => {
    if (seaGainNodeRef.current && audioCtxRef.current) {
      try {
        seaGainNodeRef.current.gain.linearRampToValueAtTime((seaVolume / 100) * 0.12, audioCtxRef.current.currentTime + 0.2);
      } catch (e) {}
    }
  }, [seaVolume]);

  // Cleanup synthesizer audio channels on component unmount
  useEffect(() => {
    return () => {
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
    };
  }, []);

  return (
    <div id="chaos_lounge_mainframe" className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
      
      {/* COLUMN LEFT: Slack Switchboard Configuration */}
      <div className="md:col-span-6 space-y-6">
        
        {/* Slack Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Slack className="text-deriv-red" size={18} />
            <span>Slack Oasis Link</span>
          </h3>

          <p className="text-slate-500 text-xs leading-relaxed mb-4">
            DerivOasis connects culture across your teams! Paste your workspace 
            <strong> Incoming Webhook URL</strong> directly below to push Cheers, roulette match ups, 
            and oracle predictions into your actual team Slack channel dynamically.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-extrabold text-deriv-red uppercase tracking-wider mb-1.5">
                Incoming Webhook URL
              </label>
              <input
                type="url"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/T000/B000/XXXXXX"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-deriv-red focus:ring-1 focus:ring-deriv-red/25 rounded-xl p-3 font-semibold focus:outline-hidden transition text-slate-800"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={autoAnnounceKudos}
                  onChange={(e) => setAutoAnnounceKudos(e.target.checked)}
                  className="rounded border-slate-300 text-deriv-red focus:ring-deriv-red cursor-pointer mt-0.5"
                />
                <div className="leading-snug">
                  <div>Auto Announce Peer Kudos Shoutouts</div>
                  <span className="text-[10px] text-slate-400 font-normal block">Forwards all Cheers Board uploads directly to your channel</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={autoAnnounceCoffee}
                  onChange={(e) => setAutoAnnounceCoffee(e.target.checked)}
                  className="rounded border-slate-300 text-deriv-red focus:ring-deriv-red cursor-pointer mt-0.5"
                />
                <div className="leading-snug">
                  <div>Auto Announce Coffee Roulette Pairs</div>
                  <span className="text-[10px] text-slate-400 font-normal block">Announces global matches found during the office roulette cycle</span>
                </div>
              </label>
            </div>

            {/* Actions Panel */}
            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSlackConfig}
                className="flex-1 bg-deriv-red hover:bg-deriv-red-hover text-white text-xs font-extrabold uppercase tracking-widest py-2.5 px-4 rounded-xl shadow-md shadow-deriv-red/10 active:scale-[0.98] transition cursor-pointer"
              >
                {slackSaved ? "✓ Slack Webhook Saved" : "Save Webhook Settings"}
              </button>

              <button
                type="button"
                onClick={handleSendTestWebhook}
                disabled={slackSending || !slackWebhook.trim()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 text-xs font-extrabold uppercase tracking-widest py-2.5 px-4 rounded-xl border border-slate-200 active:scale-[0.98] transition cursor-pointer"
              >
                <Send size={11} />
                <span>{slackSending ? "Testing..." : "Send Test Hook"}</span>
              </button>
            </div>

            <div className="bg-slate-50/70 border border-slate-150 p-3 rounded-lg text-[10px] space-y-1 text-slate-500">
              <span className="font-extrabold text-[9px] text-slate-600 block uppercase tracking-wider mb-0.5">Quick setup guidelines:</span>
              <p>1. Go to your Slack Workspace admin dashboard or <span className="font-semibold text-slate-700">api.slack.com</span>.</p>
              <p>2. Create a lightweight App, select <span className="font-bold text-deriv-red">Incoming Webhooks</span>, and toggle ON.</p>
              <p>3. Generate your webhook URL, bind it to a channel, copy, and save it here!</p>
            </div>
          </div>
        </div>

        {/* Ambient Workspace Mixer soundboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Volume2 className="text-deriv-red animate-pulse" size={18} />
            <span>Interactive Ambient sound Mixer</span>
          </h3>

          <p className="text-slate-500 text-xs leading-relaxed mb-4">
            Let the sounds of our global workspaces inspire you! Turn on this procedural synth to mix ocean breeze from Cyprus, typing speed from Cyberjaya, and birds chirping from Rwanda.
          </p>

          <div className="space-y-4">
            {/* Master toggle */}
            <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <Sliders className="text-deriv-red shrink-0" size={18} />
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">Oasis Synthesizer Console</div>
                  <span className="text-[9px] text-slate-400 font-mono">Running custom browser code</span>
                </div>
              </div>

              {synthActive ? (
                <button
                  type="button"
                  onClick={stopAmbientSynth}
                  className="inline-flex items-center gap-1 bg-deriv-red hover:bg-deriv-red-hover text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
                >
                  <VolumeX size={11} /> Standby
                </button>
              ) : (
                <button
                  type="button"
                  onClick={initializeAmbientSynth}
                  className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-lg shadow-emerald-500/10 transition active:scale-95 cursor-pointer animate-bounce"
                >
                  <Volume2 size={11} /> Initialize Mixer
                </button>
              )}
            </div>

            {/* Sliders Grid */}
            <div className={`space-y-3 p-1.5 transition-opacity duration-300 ${synthActive ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              
              {/* Cyprus wave breeze */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">🌊 Cyprus Beach Breeze (Filtered Synth)</span>
                  <span className="font-mono text-[10px] text-deriv-red font-bold">{seaVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={seaVolume}
                  onChange={(e) => setSeaVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-deriv-red"
                />
              </div>

              {/* Rwanda birds */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">🐦 Kigali Morning Birds (Chirp Generator)</span>
                  <span className="font-mono text-[10px] text-deriv-red font-bold">{birdsFrequency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={birdsFrequency}
                  onChange={(e) => setBirdsFrequency(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-deriv-red"
                />
              </div>

              {/* Cyberjaya typing */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">⌨️ Cyberjaya Dev Keyboards (Click transient)</span>
                  <span className="font-mono text-[10px] text-deriv-red font-bold">{keyboardRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={keyboardRate}
                  onChange={(e) => setKeyboardRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-deriv-red"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono italic justify-center border-t border-slate-100 pt-2.5">
                <Lightbulb size={10} className="text-amber-500 animate-pulse" />
                <span>Ambient audio is fully synthesized in and won't consume data.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* COLUMN RIGHT: Chaos Oracle Prediction and Vibe Bubbles */}
      <div className="md:col-span-6 space-y-6">
        
        {/* Gemini powered Oracle */}
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
          {/* Subtle decor node */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-deriv-red/5 rounded-full blur-2xl"></div>

          <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3 relative z-10">
            <Sparkles className="text-deriv-red animate-spin-slow shrink-0" size={18} />
            <span>Watercooler Chaos Oracle</span>
            <span className="ml-auto font-mono text-[8px] bg-deriv-red/20 text-deriv-red border border-deriv-red/30 px-2 py-0.5 rounded uppercase tracking-wider font-extrabold">Gemini Powered</span>
          </h3>

          <p className="text-slate-400 text-xs leading-relaxed relative z-10">
            Roll for workplace predicting chaos! What strange, funny, or extremely positive events are waiting for you around the watercooler pantry today? Let Gemini foresee your vibe.
          </p>

          {/* Action Spin */}
          <div className="flex justify-center py-2">
            <button
              onClick={handleFetchFortune}
              disabled={fetchingFortune}
              className="px-6 py-3 bg-deriv-red hover:bg-deriv-red-hover disabled:bg-rose-950 disabled:text-rose-450 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-150 active:scale-95 shadow-lg shadow-deriv-red/15 inline-flex items-center gap-2 cursor-pointer z-10"
            >
              <RefreshCw className={`shrink-0 ${fetchingFortune ? "animate-spin" : ""}`} size={13} />
              <span>{fetchingFortune ? "Scanning Timelines..." : "Consult Watercooler Oracle 🔮"}</span>
            </button>
          </div>

          {/* Core Fortune Output Display */}
          {currentFortune ? (
            <div className="bg-slate-950/70 border border-slate-820 rounded-xl p-4.5 space-y-2.5 animate-fade-in relative z-10">
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase">
                <span className="text-slate-500">Predicted Fortune</span>
                <span className="text-deriv-red font-mono bg-rose-950/40 border border-rose-900 rounded-md px-2 py-0.5">
                  Vibe: {currentVibe}
                </span>
              </div>
              <p className="text-xs font-sans font-semibold italic text-slate-150 leading-relaxed">
                "{currentFortune}"
              </p>
              {slackWebhook.trim() && (
                <div className="text-[9px] text-slate-450 italic flex items-center gap-1 font-mono pt-1 border-t border-slate-800/40">
                  <CheckCircle2 size={9} className="text-emerald-500" />
                  <span>Automatically uploaded and announced to Slack!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500 relative z-10 leading-relaxed font-semibold">
              <HelpCircle className="mx-auto text-slate-700 mb-2 animate-bounce" size={28} />
              Click the button above to query the Gemini model for your workplace prediction.
            </div>
          )}

          {/* Predictions History logs */}
          {fortuneHistory.length > 0 && (
            <div className="space-y-2 pt-2 relative z-10">
              <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Oracle Log History</div>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto divide-y divide-slate-800/30">
                {fortuneHistory.map((item, index) => (
                  <div key={index} className="text-[11px] py-1.5 font-sans flex items-start gap-2 justify-between">
                    <span className="text-slate-300 leading-normal font-medium truncate max-w-[280px]">"{item.text}"</span>
                    <span className="text-[9px] font-mono text-deriv-red shrink-0 text-right opacity-80">{item.vibe}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bubble Wrap Popper Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Smile className="text-deriv-red shrink-0" size={18} />
            <span>Workspace Stress-Popper Wrap</span>
            <span className="ml-auto font-mono text-[9px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200/50">
              Popped: {poppedCount}/8
            </span>
          </h3>

          <p className="text-slate-500 text-xs leading-relaxed mb-4">
            Stressed over compilations or endless PR lines? Pop these digital bubblewrap bubbles to get procedural sound feedbacks and instant micro-challenges to break the ice across the lounge corridors!
          </p>

          {/* Popper Grid */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50/70 border border-slate-150 p-4 rounded-2xl shadow-inner">
            {bubbles.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handlePopBubble(b.id, b.vibe)}
                disabled={b.popped}
                className={`w-full aspect-square rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer focus:outline-hidden ${
                  b.popped 
                    ? "bg-slate-300 border-slate-400 opacity-45 transform scale-90 cursor-default shadow-inner" 
                    : `${b.color} font-black text-lg active:scale-90 active:bg-slate-300 shadow bg-white`
                }`}
              >
                <span>{b.label}</span>
                {b.popped && (
                  <span className="text-[7px] font-extrabold font-mono text-slate-600 block leading-none select-none uppercase mt-0.5 tracking-tighter">POP</span>
                )}
              </button>
            ))}
          </div>

          {/* Active Bubble Feedback line */}
          <div className="mt-4 min-h-[50px] bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 text-xs flex items-center justify-center font-bold text-slate-700 text-center leading-relaxed font-sans">
            {poppedCount === 0 ? (
              <span className="text-slate-450 italic font-medium">Click on any bubble above to pop it and release tension! 🎈</span>
            ) : (
              <div className="space-y-1">
                <span className="block text-[8px] font-extrabold text-deriv-red uppercase tracking-wider mb-0.5">POPPED BUBBLE VIBE ADVICE</span>
                <p className="text-slate-700 animate-fade-in font-bold">
                  {bubbles.filter(b => b.popped).slice(-1)[0]?.vibe}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-3.5 mt-2 border-t border-slate-100">
            <button
              onClick={handleResetBubbles}
              className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition duration-150 active:scale-95 border border-slate-205 cursor-pointer shadow-3xs"
            >
              <RefreshCw size={11} />
              <span>Reset Sandbox Bubble Wrap</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
