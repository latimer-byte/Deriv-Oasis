import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized for DerivOasis");
  } else {
    console.warn("GEMINI_API_KEY not found in environment, Gemini integrations will fall back gracefully.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

app.use(express.json());

// IN-MEMORY DATABASE FOR DERIVIANS LIFE HUB (SHOUTOUTS, SURVEYS, COFFEE matching)
interface SharedHubState {
  kudos: any[];
  polls: any[];
  coffeeMatches: any[];
  logs: any[];
  gameScores: any[];
}

let hubState: SharedHubState = {
  kudos: [
    {
      id: "kd-1",
      senderName: "Amanda Tan",
      senderOffice: "cyberjaya",
      recipientName: "Samuel Mutiso",
      recipientOffice: "kigali",
      badge: "Bug Squasher",
      message: "Absolute lifesaver! Samuel helped me track down a complex latency issue in the dev environment late Tuesday. Kudos, buddy!",
      timestamp: "2026-06-17T14:30:00.000Z",
      likes: 6
    },
    {
      id: "kd-2",
      senderName: "Luke Camilleri",
      senderOffice: "malta",
      recipientName: "Siti Nor",
      recipientOffice: "cyberjaya",
      badge: "PR Guru",
      message: "Incredible review on the front-end redesign PR! Siti suggested some brilliant accessible color pairings and code refactors that saved hours.",
      timestamp: "2026-06-16T09:12:00.000Z",
      likes: 8
    },
    {
      id: "kd-3",
      senderName: "Elena Vasileiou",
      senderOffice: "limassol",
      recipientName: "Diego Benitez",
      recipientOffice: "asuncion",
      badge: "Creative Catalyst",
      message: "Diego made the most amazing animated SVG designs for the local tech demo. Truly a wizard, the team was completely blown away!",
      timestamp: "2026-06-15T16:45:00.000Z",
      likes: 12
    }
  ],
  polls: [
    {
      id: "poll-1",
      question: "What's our focus for the next Global Derivians Social Gathering?",
      options: [
        { id: "opt-1", label: "Inter-Office Gaming Championship (Valorant/Fifa)", votes: 45 },
        { id: "opt-2", label: "Global Culinary Cook-Off & Recipes Class", votes: 29 },
        { id: "opt-3", label: "Virtual Escape Room & Puzzle Mixer", votes: 38 },
        { id: "opt-4", label: "Wellness Masterclass & Desk Yoga Session", votes: 12 }
      ],
      totalVotes: 124
    },
    {
      id: "poll-2",
      question: "Which office hobby club should receive the next core equipment package?",
      options: [
        { id: "opt-2a", label: "Cyberjaya Futsal & Badminton Club", votes: 32 },
        { id: "opt-2b", label: "Malta Sea Sports & Kayak Society", votes: 21 },
        { id: "opt-2c", label: "Kigali Running & Marathon Club", votes: 43 },
        { id: "opt-2d", label: "Limassol Beach Volleyball League", votes: 19 }
      ],
      totalVotes: 115
    }
  ],
  coffeeMatches: [
    {
      id: "match-1",
      timestamp: "2026-06-17T08:00:00.000Z",
      status: "matched",
      userOffice: "malta",
      matchedName: "Khairul Nizam",
      matchedOffice: "Cyberjaya Office",
      matchedRole: "Principal QA Engineer",
      matchedEmail: "khairul.nizam@deriv.com",
      avatarColor: "bg-teal-500"
    }
  ],
  logs: [
    {
      id: "log_initial",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "DerivOasis: Inbound Life Hub initialized. Serving global office coordinates."
    }
  ],
  gameScores: [
    { id: "score-1", gameId: "snake", playerName: "Siti Nor", playerOffice: "cyberjaya", score: 280, timestamp: "2026-06-17T11:20:00.000Z" },
    { id: "score-2", gameId: "breaker", playerName: "Luke Camilleri", playerOffice: "malta", score: 1850, timestamp: "2026-06-17T15:40:00.050Z" },
    { id: "score-3", gameId: "bugs", playerName: "Samuel Mutiso", playerOffice: "kigali", score: 3200, timestamp: "2026-06-16T10:15:00.000Z" },
    { id: "score-4", gameId: "memory", playerName: "Diego Benitez", playerOffice: "asuncion", score: 580, timestamp: "2026-06-16T14:22:00.000Z" },
    { id: "score-5", gameId: "snake", playerName: "Yiannis Georgiou", playerOffice: "limassol", score: 150, timestamp: "2026-06-15T18:10:00.000Z" },
    { id: "score-6", gameId: "breaker", playerName: "Fatima Al Mansoori", playerOffice: "dubai", score: 1420, timestamp: "2026-06-15T21:05:00.000Z" }
  ]
};

// Log helper
function addLog(level: "info" | "success" | "warn" | "error", message: string) {
  const logItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    level,
    message
  };
  hubState.logs.unshift(logItem);
  console.log(`[OASIS] ${level.toUpperCase()}: ${message}`);
  return logItem;
}

// REST ENDPOINTS

// 1. Get entire app state
app.get("/api/state", (req, res) => {
  res.json({
    kudos: hubState.kudos,
    polls: hubState.polls,
    coffeeMatches: hubState.coffeeMatches,
    logs: hubState.logs,
    gameScores: hubState.gameScores
  });
});

// 1b. Submit new Retro Arena score
app.post("/api/games/score", (req, res) => {
  const { gameId, playerName, playerOffice, score } = req.body;
  if (!gameId || !playerName || !playerOffice || score === undefined) {
    return res.status(400).json({ error: "Missing required game score fields." });
  }

  const newScore = {
    id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    gameId,
    playerName,
    playerOffice,
    score: Number(score),
    timestamp: new Date().toISOString()
  };

  hubState.gameScores.push(newScore);
  
  const niceGameNames: Record<string, string> = {
    snake: "Retro nokia Snake",
    breaker: "Deriv Brick Breaker",
    memory: "Munch Match memory",
    bugs: "Retro Bug Squasher"
  };
  const displayName = niceGameNames[gameId] || gameId;
  
  addLog("success", `🕹️ ${playerName} (${playerOffice.toUpperCase()}) scored a massive ${score} pts on ${displayName}!`);
  res.json(newScore);
});

// 2. Post a peer Cheers/Shoutout
app.post("/api/kudos", (req, res) => {
  const { senderName, senderOffice, recipientName, recipientOffice, badge, message } = req.body;
  if (!senderName || !recipientName || !message || !badge) {
    return res.status(400).json({ error: "Please fill out all Kudos field requirements." });
  }

  const newCheers = {
    id: `cheers-${Date.now()}`,
    senderName,
    senderOffice: senderOffice || "malta",
    recipientName,
    recipientOffice: recipientOffice || "cyberjaya",
    badge,
    message,
    timestamp: new Date().toISOString(),
    likes: 0
  };

  hubState.kudos.unshift(newCheers);
  addLog("success", `Kudos assigned from ${senderName} (${senderOffice}) to ${recipientName} (${recipientOffice}) with badge "${badge}"`);
  res.json(newCheers);
});

// 3. Like/Upvote Kudos Card
app.post("/api/kudos/like", (req, res) => {
  const { id } = req.body;
  const kudo = hubState.kudos.find(k => k.id === id);
  if (kudo) {
    kudo.likes = (kudo.likes || 0) + 1;
    res.json({ success: true, likes: kudo.likes });
  } else {
    res.status(404).json({ error: "Kudos card not found" });
  }
});

// 4. Record Poll Vote
app.post("/api/poll/vote", (req, res) => {
  const { pollId, optionId } = req.body;
  const poll = hubState.polls.find(p => p.id === pollId);
  if (!poll) {
    return res.status(404).json({ error: "Survey Poll not found" });
  }

  const option = poll.options.find(o => o.id === optionId);
  if (!option) {
    return res.status(400).json({ error: "Option code is invalid" });
  }

  option.votes += 1;
  poll.totalVotes += 1;
  addLog("info", `Integrated aggregate vote count (+1) for poll "${poll.question.slice(0, 30)}..." - Option: "${option.label}"`);
  res.json(poll);
});

// 5. Join Coffee Roulette & Simulate matchmaking trigger
app.post("/api/coffee/join", (req, res) => {
  const { userOffice } = req.body;
  
  // Sample pool of available Derivians
  const participants = [
    { name: "Fatima Al Mansoori", office: "Dubai Office", role: "UI Design Lead", email: "fatima.m@deriv.com", avatarColor: "bg-amber-500" },
    { name: "Marc Sant", office: "Malta Office", role: "Senior Backend Dev", email: "marc.s@deriv.com", avatarColor: "bg-blue-500" },
    { name: "Kimanuka Eric", office: "Kigali Office", role: "DevOps Engineer", email: "kimanuka.e@deriv.com", avatarColor: "bg-purple-500" },
    { name: "Zuhair Hilmi", office: "Cyberjaya Office", role: "Mobile Architect", email: "zuhair.h@deriv.com", avatarColor: "bg-teal-500" },
    { name: "Yiannis Georgiou", office: "Limassol Office", role: "Finance Operations", email: "yiannis.g@deriv.com", avatarColor: "bg-rose-500" },
    { name: "Sonia Gamarra", office: "Asunción Office", role: "HR & Talent Acquisition", email: "sonia.g@deriv.com", avatarColor: "bg-emerald-500" }
  ];

  // Pick a random colleague not in user's active office
  const candidates = participants.filter(p => !p.office.toLowerCase().includes((userOffice || "").toLowerCase()));
  const chosen = candidates[Math.floor(Math.random() * candidates.length)] || participants[0];

  const newMatch = {
    id: `coffeematch-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'matched',
    userOffice,
    matchedName: chosen.name,
    matchedOffice: chosen.office,
    matchedRole: chosen.role,
    matchedEmail: chosen.email,
    avatarColor: chosen.avatarColor
  };

  hubState.coffeeMatches.unshift(newMatch);
  addLog("success", `Coffee Roulette pairing established! Matched colleague: ${chosen.name} (${chosen.office}) with user`);
  res.json(newMatch);
});

// 6. Gemini-powered interactive slang and cultural coach (No trading/accounts!)
app.post("/api/ai/coach", async (req, res) => {
  const { phrase, targetOffice, targetCity, targetCountry } = req.body;
  if (!phrase || !targetOffice) {
    return res.status(400).json({ error: "Missing coach params" });
  }

  const backupSlang = {
    translation: phrase,
    pronunciation: "As written",
    culturalTip: "Try saying it with a big warm smile! Derivians prioritize openness, collaboration, and making friends across all global timezone gaps."
  };

  if (!ai) {
    addLog("warn", "Gemini API unavailable. Serving static local office guidelines.");
    return res.json(backupSlang);
  }

  try {
    const prompt = `You are the ultimate cultural buddy for "Deriv" (the global trading company workspace - though focus ONLY on workplace life, not trading details).
Translate this English phrase: "${phrase}" 
into the perfect colloquial slang or casual expression used by employees in our local office: "${targetOffice}" (located in ${targetCity || "Unknown"}, ${targetCountry || "Unknown"}).

Consider the local languages and custom workplace traditions there (e.g. Malay/Mamaks for Cyberjaya, Maltese elements for Malta, Kinyarwanda/Coffee for Kigali, Terere/Spanish for Paraguay, Arabic/Karak tea for Dubai, Greek/Frappe beach vibes for Cyprus).

Return exactly a JSON object matching this structure:
{
  "translation": "a friendly localized translation or equivalent slang",
  "pronunciation": "guide on how a foreigner would pronounce it with proper emphasis",
  "culturalTip": "a witty, warm piece of office trivia or local workplace custom related to this expression (e.g., getting pastizzi, having tea at the pantry, mamak food runs, or beach talk)"
}
Provide clean JSON. No markdown wrappers. No backticks.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(aiResponse.text || "{}");
    addLog("success", `AI Culture Coach generated custom localized phrase for "${targetOffice}" office`);
    res.json({
      translation: parsed.translation || phrase,
      pronunciation: parsed.pronunciation || "N/A",
      culturalTip: parsed.culturalTip || backupSlang.culturalTip
    });
  } catch (error: any) {
    console.error("AI Coach translation fail:", error);
    addLog("error", `AI Coach fail: ${error.message}`);
    res.json(backupSlang);
  }
});

// 7. Gemini-powered bonding icebreaker generator
app.post("/api/ai/generate-icebreaker", async (req, res) => {
  const { officeA, officeB } = req.body;
  
  const backupIce = {
    title: "The Ultimate Playlist Share",
    activity: "Share the most popular tune currently playing on your office speakers or local radio station. Let everyone play 30 seconds of their top track and guess which culture it derives from!"
  };

  if (!ai) {
    addLog("warn", "Gemini API unavailable for icebreakers. Serving static team bonds.");
    return res.json(backupIce);
  }

  try {
    const prompt = `Create a fun, non-technical, lightweight, offline or online watercooler team bonding game or icebreaker designed for employees of a progressive company.
This game is specifically tailored to run as a quick 10-minute mixer between colleagues in the "${officeA}" office and raw colleagues in the "${officeB}" office.
Integrate cultural reference markers or office work-life elements from both locations.

Provide a response as a structured JSON object:
{
  "title": "A short engaging title",
  "activity": "A clear, detailed description explaining how to run this 10-minute mixer, showing real empathy and fun energy. Keep it compact."
}
Return clean JSON. Do not include markdown backticks.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(aiResponse.text || "{}");
    addLog("success", `Created customized AI office-mixer code for ${officeA} & ${officeB}`);
    res.json(parsed);
  } catch (err: any) {
    console.error("AI Icebreaker generation fail:", err);
    res.json(backupIce);
  }
});

// 8. Gemini-powered Random Workspace Fortune / Chaos Oracle
app.get("/api/ai/fortune", async (req, res) => {
  const backupFortunes = [
    "Your code will compile on the first try today, but the kitchen tea dispenser will only dispense water. Perfect thermodynamic balance is restored.",
    "A colleague in Cyprus is thinking about frappes. A colleague in Cyberjaya is eating delicious Nasi Lemak. You are thinking about both. Global alignment established!",
    "Expect a random Slack message today containing only a custom emoji. It is of high spiritual and technical significance.",
    "A legendary bug you wrote in 2024 will suddenly become an undocumented core product feature. Do not explain how. Just say 'Working as intended.'",
    "Your next zoom meeting will end 4 minutes earlier than expected! Spend those 4 minutes doing a high-vibe desk dance. No one is watching except your keyboard cat.",
    "Kigali running club will send you positive energy. Consider adding a drop of Akabanga hot sauce to your coffee. (Disclaimer: Do not actually do this unless brave)."
  ];

  if (!ai) {
    const randomF = backupFortunes[Math.floor(Math.random() * backupFortunes.length)];
    addLog("warn", "Gemini API unavailable. Using static fortune registry.");
    return res.json({ fortune: randomF, vibeLevel: "Extremely Cozy" });
  }

  try {
    const prompt = `You are a humorous, extremely lighthearted, and slightly absurd "Office Chaos Fortune Teller" for the progressive workspace "Deriv".
Generate a hilarious, highly creative "watercooler workplace prediction" or "funny office fortune".
It must be playful, witty, and highly relatable to software development and modern office employee lifestyle (e.g. infinite loop checks, caffeine crashes, compiler errors, strange emoji threads, timezone differences, or regional office highlights like Malta pastizzi, Cyberjaya Mamak feasts, Kigali coffee, Cyprus shoreline).

Keep it optimistic, friendly, and clean. No professional trading or finance references.

Return exactly a JSON object matching this structure:
{
  "fortune": "the funny workspace prediction or fortune matching the prompt",
  "vibeLevel": "A funny rating representing the vibe, e.g. 'Absurdly Synced 110%', 'Slightly Caffeinated', 'Compiler Chaos', '99.9% Hydrated'"
}
Provide clean JSON. No markdown wrappers. No backticks.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(aiResponse.text || "{}");
    addLog("success", "Chaos Oracle generated custom workspace fortune");
    res.json({
      fortune: parsed.fortune || backupFortunes[Math.floor(Math.random() * backupFortunes.length)],
      vibeLevel: parsed.vibeLevel || "High Frequency"
    });
  } catch (error: any) {
    console.error("AI Fortune fail:", error);
    const randomF = backupFortunes[Math.floor(Math.random() * backupFortunes.length)];
    res.json({ fortune: randomF, vibeLevel: "Standard Cozy State" });
  }
});

// 9. Slack incoming webhook integration dispatcher
app.post("/api/slack/send", async (req, res) => {
  const { webhookUrl, message, type, data } = req.body;
  const targetWebhook = webhookUrl?.trim() || process.env.SLACK_WEBHOOK_URL;
  
  if (!targetWebhook) {
    return res.status(405).json({ 
      error: "No Slack Webhook URL found. Configure yours in the 'Slack Config & Chaos' tab!" 
    });
  }

  try {
    let payload: any = { text: message };

    if (type === "kudos") {
      payload = {
        text: `🎉 New Shoutout on DerivOasis!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*🎉 New Kudos Cheers Registered on DerivOasis!*`
            }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*From:* ${data.senderName} (${data.senderOffice.toUpperCase()})` },
              { type: "mrkdwn", text: `*To:* ${data.recipientName} (${data.recipientOffice.toUpperCase()})` },
              { type: "mrkdwn", text: `*Badge:* 🏅 _${data.badge}_` }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `>>> "${data.message}"`
            }
          },
          {
            type: "context",
            elements: [
              { type: "mrkdwn", text: `🌍 Forwarded automatically by Deriv Oasis Culture Hub` }
            ]
          }
        ]
      };
    } else if (type === "coffee") {
      payload = {
        text: `☕ Coffee Match Established!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*☕ Deriv Coffee Roulette Match Established!*`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${data.userOffice.toUpperCase()}* matched with *${data.matchedOffice}*!`
            }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Colleague:* ${data.matchedName}` },
              { type: "mrkdwn", text: `*Role:* ${data.matchedRole}` },
              { type: "mrkdwn", text: `*Email:* \`${data.matchedEmail}\`` }
            ]
          },
          {
            type: "context",
            elements: [
              { type: "mrkdwn", text: `Grab an espresso and have a great conversation!` }
            ]
          }
        ]
      };
    } else if (type === "fortune") {
      payload = {
        text: `🔮 Chaos Oracle Prediction!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*🔮 Deriv Oasis Chaos Oracle has spoken!*`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `>>> *Vibe Level:* ${data.vibeLevel}\n*Prediction:* ${data.fortune}`
            }
          }
        ]
      };
    } else {
      payload = {
        text: message,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `💬 *DerivOasis General Alert:* ${message}`
            }
          }
        ]
      };
    }

    const response = await fetch(targetWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      addLog("success", `Dispatched Slack notification (Type: ${type || 'general'}) successfully to configured webhook channel.`);
      res.json({ success: true });
    } else {
      const errorText = await response.text();
      addLog("error", `Slack Webhook returned error status ${response.status}: ${errorText}`);
      res.status(500).json({ error: `Slack returned error status ${response.status}` });
    }
  } catch (err: any) {
    addLog("error", `Failed forwarding message to Slack webhook: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite Dev server or Client bundle static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
