import React, { useState, useEffect, useRef } from "react";
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Flame, 
  ShieldAlert, 
  Award, 
  Coins, 
  User, 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  PartyPopper,
  Info
} from "lucide-react";
import { GameScore } from "../types";

// Dynamic Web Audio API sound synthesizer
class SoundFX {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Lazy initialize to bypass user-interaction autoplay restrictions
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playEat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio exception:", e);
    }
  }

  playBreak() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, this.ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.1); 
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playLaser() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playExplosion() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playFlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playMatchSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playGameOver() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Synthesize sad sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(330, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.55);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {}
  }
}

const sfx = new SoundFX();

interface RetroGamesProps {
  onAddLog: (level: "info" | "success" | "warn" | "error", message: string) => void;
  gameScores: GameScore[];
  onRefreshScores: () => void;
}

const OFFICE_NAMES: Record<string, string> = {
  malta: "🧠 Malta (Mosta)",
  cyberjaya: "⚡ Malaysia (Cyberjaya)",
  kigali: "☕ Rwanda (Kigali)",
  dubai: "🏙️ UAE (Dubai)",
  limassol: "🏖️ Cyprus (Limassol)",
  asuncion: "🧉 Paraguay (Asunción)"
};

const FOODS_LIST = [
  { name: "Ftira 🥪", office: "malta" },
  { name: "Pastizzi 🥐", office: "malta" },
  { name: "Nasi Lemak 🍛", office: "cyberjaya" },
  { name: "Roti Canai 🫓", office: "cyberjaya" },
  { name: "Brochettes 🍢", office: "kigali" },
  { name: "Coffee ☕", office: "kigali" },
  { name: "Shawarma 🌯", office: "dubai" },
  { name: "Karak Tea 🧋", office: "dubai" },
  { name: "Halloumi 🧀", office: "limassol" },
  { name: "Souvlaki 🍢", office: "limassol" },
  { name: "Chipa Pies 🥧", office: "asuncion" },
  { name: "Tereré 🧉", office: "asuncion" }
];

export default function RetroGames({ onAddLog, gameScores, onRefreshScores }: RetroGamesProps) {
  // Profiles settings
  const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem("oasis_game_player_name") || "");
  const [playerOffice, setPlayerOffice] = useState<string>(() => localStorage.getItem("oasis_game_player_office") || "cyberjaya");
  const [isProfileSaved, setIsProfileSaved] = useState<boolean>(() => !!localStorage.getItem("oasis_game_player_name"));
  
  const [activeGameId, setActiveGameId] = useState<"snake" | "breaker" | "memory" | "bugs">("snake");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Game states and high scores submitted
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [submittedScore, setSubmittedScore] = useState<boolean>(false);

  // Snake specific states
  const [snake, setSnake] = useState<[number, number][]>([[10, 10], [10, 11], [10, 12]]);
  const [snakeFood, setSnakeFood] = useState<[number, number]>([5, 5]);
  const [snakeDir, setSnakeDir] = useState<[number, number]>([0, -1]); // moving UP initially

  // Memory matching specific states
  const [memoryCards, setMemoryCards] = useState<{ id: number; symbol: string; isMatched: boolean; isFlipped: boolean }[]>([]);
  const [flippedCardIndexes, setFlippedCardIndexes] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const [memoryTime, setMemoryTime] = useState<number>(0);

  // References for HTML canvases
  const breakerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bugsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Timers references
  const mainLoopRef = useRef<any>(null);
  const memoryTimerRef = useRef<any>(null);

  // Toggle Mute
  const toggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    sfx.isMuted = nextVal;
  };

  // Handle profile saved
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem("oasis_game_player_name", playerName.trim());
    localStorage.setItem("oasis_game_player_office", playerOffice);
    setIsProfileSaved(true);
    onAddLog("success", `🎮 Retro Games player registered: ${playerName} (${playerOffice.toUpperCase()})`);
  };

  // Reset or logout profile
  const handleResetProfile = () => {
    localStorage.removeItem("oasis_game_player_name");
    setIsProfileSaved(false);
    setPlayerName("");
    setIsPlaying(false);
  };

  // GAME SUBMISSION ENDPOINT INTEGRATOR
  const submitHighScore = async () => {
    if (!playerName.trim() || !playerOffice || currentScore <= 0 || submittedScore) return;
    try {
      const response = await fetch("/api/games/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: activeGameId,
          playerName: playerName.trim(),
          playerOffice,
          score: currentScore
        })
      });
      if (response.ok) {
        setSubmittedScore(true);
        onRefreshScores();
        onAddLog("success", `🏆 Submitted score of ${currentScore} as highscore for ${playerName} (${playerOffice.toUpperCase()})!`);
      }
    } catch (err) {
      console.error("Score submit error:", err);
    }
  };

  // -------------------------------------------------------------
  // GAME 1: RETRO NOKIA SNAKE
  // -------------------------------------------------------------
  const initSnakeGame = () => {
    setSnake([[10, 10], [10, 11], [10, 12]]);
    setSnakeFood([Math.floor(Math.random() * 19), Math.floor(Math.random() * 19)]);
    setSnakeDir([0, -1]);
    setCurrentScore(0);
    setIsGameOver(false);
    setSubmittedScore(false);
    setIsPlaying(true);
  };

  // Keyboard navigation for Snake
  useEffect(() => {
    const handleSnakeKeys = (e: KeyboardEvent) => {
      if (activeGameId !== "snake" || !isPlaying) return;
      if (e.key === "ArrowUp" && snakeDir[1] !== 1) setSnakeDir([0, -1]);
      else if (e.key === "ArrowDown" && snakeDir[1] !== -1) setSnakeDir([0, 1]);
      else if (e.key === "ArrowLeft" && snakeDir[0] !== 1) setSnakeDir([-1, 0]);
      else if (e.key === "ArrowRight" && snakeDir[0] !== -1) setSnakeDir([1, 0]);
    };
    window.addEventListener("keydown", handleSnakeKeys);
    return () => window.removeEventListener("keydown", handleSnakeKeys);
  }, [snakeDir, isPlaying, activeGameId]);

  // Snake game loops
  useEffect(() => {
    if (activeGameId !== "snake" || !isPlaying || isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead: [number, number] = [head[0] + snakeDir[0], head[1] + snakeDir[1]];

        // Wall collisions
        if (nextHead[0] < 0 || nextHead[0] >= 20 || nextHead[1] < 0 || nextHead[1] >= 20) {
          sfx.playGameOver();
          setIsPlaying(false);
          setIsGameOver(true);
          clearInterval(gameInterval);
          return prevSnake;
        }

        // Self collision
        for (const segment of prevSnake) {
          if (segment[0] === nextHead[0] && segment[1] === nextHead[1]) {
            sfx.playGameOver();
            setIsPlaying(false);
            setIsGameOver(true);
            clearInterval(gameInterval);
            return prevSnake;
          }
        }

        const newSnake = [nextHead, ...prevSnake];

        // Eat food checks
        if (nextHead[0] === snakeFood[0] && nextHead[1] === snakeFood[1]) {
          sfx.playEat();
          setCurrentScore((prev) => prev + 10);
          setSnakeFood([
            Math.floor(Math.random() * 19),
            Math.floor(Math.random() * 19)
          ]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(gameInterval);
  }, [snakeDir, snakeFood, isPlaying, isGameOver, activeGameId]);


  // -------------------------------------------------------------
  // GAME 2: DERIV BRICK BREAKER (Breakout on Canvas)
  // -------------------------------------------------------------
  const initBreakerGame = () => {
    setCurrentScore(0);
    setIsGameOver(false);
    setSubmittedScore(false);
    setIsPlaying(true);
    setTimeout(() => startBreakerCanvasLoop(), 100);
  };

  const startBreakerCanvasLoop = () => {
    const canvas = breakerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let score = 0;

    // Dimensions
    const width = canvas.width = 440;
    const height = canvas.height = 320;

    // Paddle
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (width - paddleWidth) / 2;

    // Ball
    let x = width / 2;
    let y = height - 30;
    let dx = 2.5;
    let dy = -2.5;
    const ballRadius = 6;

    // Bricks
    const brickRowCount = 4;
    const brickColumnCount = 6;
    const brickWidth = 60;
    const brickHeight = 16;
    const brickPadding = 6;
    const brickOffsetTop = 35;
    const brickOffsetLeft = 24;

    const bricks: any[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, type: r };
      }
    }

    // Input handlers
    let rightPressed = false;
    let leftPressed = false;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };
    const touchHandler = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length > 0) {
        const relativeX = e.touches[0].clientX - rect.left;
        if (relativeX > 0 && relativeX < width) {
          paddleX = relativeX - paddleWidth / 2;
        }
      }
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    canvas.addEventListener("touchmove", touchHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score += 20;
              setCurrentScore(score);
              sfx.playBreak();

              // Check win
              let allCleared = true;
              for (let i = 0; i < brickColumnCount; i++) {
                for (let j = 0; j < brickRowCount; j++) {
                  if (bricks[i][j].status === 1) allCleared = false;
                }
              }
              if (allCleared) {
                // Next wave
                sfx.playMatchSuccess();
                dy = -Math.abs(dy) - 0.5; // speedup
                dx = dx > 0 ? dx + 0.5 : dx - 0.5;
                for (let i = 0; i < brickColumnCount; i++) {
                  for (let j = 0; j < brickRowCount; j++) {
                    bricks[i][j].status = 1;
                  }
                }
              }
            }
          }
        }
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ff444f"; // Deriv red
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      // Rounded corner paddle
      ctx.roundRect(paddleX, height - paddleHeight - 8, paddleWidth, paddleHeight, 5);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      const rowColors = ["#ef4444", "#fb923c", "#ecebeb", "#22c55e"]; // Red, orange, white, green
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 3);
            ctx.fillStyle = rowColors[bricks[c][r].type % rowColors.length];
            ctx.fill();
            // Subtle border
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw retro styled background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = "rgba(226, 232, 240, 0.5)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // Wall checking
      if (x + dx > width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > height - ballRadius - 10) {
        // Paddle intersection check
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          sfx.playFlip();
        } else {
          // Bottom collision
          sfx.playGameOver();
          setIsPlaying(false);
          setIsGameOver(true);
          cancelAnimationFrame(animId);
          cleanup();
          return;
        }
      }

      if (rightPressed && paddleX < width - paddleWidth) {
        paddleX += 5.5;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 5.5;
      }

      x += dx;
      y += dy;
      animId = requestAnimationFrame(draw);
    }

    function cleanup() {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("touchmove", touchHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    }

    mainLoopRef.current = { cleanup };
    draw();
  };

  // -------------------------------------------------------------
  // GAME 3: MUNCH MATCH (Retro Corporate Memory Matching)
  // -------------------------------------------------------------
  const initMemoryGame = () => {
    // Generate pair matched pairs of localized items
    setMemoryMoves(0);
    setMemoryTime(0);
    setCurrentScore(0);
    setIsGameOver(false);
    setSubmittedScore(false);

    // Pick 8 random foods and double them
    const shuffledSymbols = [...FOODS_LIST]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8); // Need 8 unique cards for 4x4 layout (16 total cards)
    
    const doubleCards = [...shuffledSymbols, ...shuffledSymbols]
      .map((item, index) => ({
        id: index,
        symbol: `${item.name}`,
        isMatched: false,
        isFlipped: false
      }))
      .sort(() => 0.5 - Math.random());

    setMemoryCards(doubleCards);
    setFlippedCardIndexes([]);
    setIsPlaying(true);

    if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    memoryTimerRef.current = setInterval(() => {
      setMemoryTime((prev) => prev + 1);
    }, 1000);
  };

  // Card Flip interaction
  const handleMemoryCardClick = (index: number) => {
    if (!isPlaying || isGameOver || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;
    if (flippedCardIndexes.length >= 2) return;

    sfx.playFlip();
    const updated = [...memoryCards];
    updated[index].isFlipped = true;
    setMemoryCards(updated);

    const nextFlipped = [...flippedCardIndexes, index];
    setFlippedCardIndexes(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [idx1, idx2] = nextFlipped;
      if (updated[idx1].symbol === updated[idx2].symbol) {
        // MATCH DETECTED!
        setTimeout(() => {
          sfx.playMatchSuccess();
          const matchedSet = updated.map((card, i) => {
            if (i === idx1 || i === idx2) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          setMemoryCards(matchedSet);
          setFlippedCardIndexes([]);

          // Check if all matched
          const isVictory = matchedSet.every(c => c.isMatched);
          if (isVictory) {
            clearInterval(memoryTimerRef.current);
            const calculatedScore = Math.max(100, Math.round(5000 - (memoryTime * 20) - (memoryMoves * 45)));
            setCurrentScore(calculatedScore);
            setIsPlaying(false);
            setIsGameOver(true);
          }
        }, 300);
      } else {
        // NO MATCH, flip back down after delay
        setTimeout(() => {
          const resetSet = updated.map((card, i) => {
            if (i === idx1 || i === idx2) {
              return { ...card, isFlipped: false };
            }
            return card;
          });
          setMemoryCards(resetSet);
          setFlippedCardIndexes([]);
        }, 1000);
      }
    }
  };

  // -------------------------------------------------------------
  // GAME 4: RETRO BUG SQUASHER (Galaga/Space Invaders)
  // -------------------------------------------------------------
  const initBugsGame = () => {
    setCurrentScore(0);
    setIsGameOver(false);
    setSubmittedScore(false);
    setIsPlaying(true);
    setTimeout(() => startBugsCanvasLoop(), 100);
  };

  const startBugsCanvasLoop = () => {
    const canvas = bugsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let score = 0;

    const width = canvas.width = 440;
    const height = canvas.height = 320;

    // Player spaceship
    let playerX = width / 2;
    const playerWidth = 32;
    const playerHeight = 24;
    const playerY = height - playerHeight - 10;

    // Input
    let leftPressed = false;
    let rightPressed = false;
    let spacePressed = false;

    // Projectils
    const lasers: { x: number; y: number; active: boolean }[] = [];
    let lastZapped = 0;

    // Falling Bugs
    const bugs: { x: number; y: number; active: boolean; type: string; speed: number }[] = [];
    const bugTypes = ["🐛", "🐜", "🐞", "🕷️", "👾"];
    let bugSpawnTimer = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      if (e.key === " " || e.key === "Spacebar") spacePressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      if (e.key === " " || e.key === "Spacebar") spacePressed = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Mobile buttons trigger callbacks directly
    const mouseAndTouchMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      if (e instanceof TouchEvent) {
        if (e.touches.length > 0) clientX = e.touches[0].clientX;
        else return;
      } else {
        clientX = e.clientX;
      }
      const relativeX = clientX - rect.left;
      if (relativeX > 0 && relativeX < width) {
        playerX = relativeX - playerWidth / 2;
      }
    };
    canvas.addEventListener("mousemove", mouseAndTouchMove);
    canvas.addEventListener("touchmove", mouseAndTouchMove);

    // Click canvas triggers shooting
    const handleShootClick = () => {
      if (Date.now() - lastZapped > 180) {
        lasers.push({ x: playerX + playerWidth / 2, y: playerY, active: true });
        sfx.playLaser();
        lastZapped = Date.now();
      }
    };
    canvas.addEventListener("click", handleShootClick);

    function gameLoop() {
      ctx.clearRect(0, 0, width, height);

      // Starfield simulation
      ctx.fillStyle = "#0f172a"; // Deep space
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 20; i++) {
        const starX = (Math.sin(i * 452) * 0.5 + 0.5) * width;
        const starY = ((Date.now() / 40 + i * 45) % height);
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Draw Player Spaceship as cute geometric pod
      ctx.fillStyle = "#3b82f6"; // neon blue
      ctx.beginPath();
      ctx.moveTo(playerX + playerWidth / 2, playerY);
      ctx.lineTo(playerX, playerY + playerHeight);
      ctx.lineTo(playerX + playerWidth, playerY + playerHeight);
      ctx.fill();
      ctx.closePath();

      // Canopy glow
      ctx.fillStyle = "#22c55e"; // bright green phosphor
      ctx.beginPath();
      ctx.arc(playerX + playerWidth / 2, playerY + playerHeight - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Handle continuous auto-shooting on space pressed
      if (spacePressed && Date.now() - lastZapped > 180) {
        lasers.push({ x: playerX + playerWidth / 2, y: playerY, active: true });
        sfx.playLaser();
        lastZapped = Date.now();
      }

      // Render/update lasers
      ctx.fillStyle = "#ff444f"; // lasers
      for (const laser of lasers) {
        if (laser.active) {
          laser.y -= 7.5;
          ctx.fillRect(laser.x - 2, laser.y - 10, 4, 12);
          if (laser.y < 0) laser.active = false;
        }
      }

      // Spawn falling bugs
      bugSpawnTimer++;
      if (bugSpawnTimer > 35) {
        bugSpawnTimer = 0;
        bugs.push({
          x: Math.random() * (width - 40) + 15,
          y: -15,
          active: true,
          type: bugTypes[Math.floor(Math.random() * bugTypes.length)],
          speed: Math.random() * 1.5 + 1.2
        });
      }

      // Render/update bugs
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      for (const bug of bugs) {
        if (bug.active) {
          bug.y += bug.speed;
          ctx.fillText(bug.type, bug.x, bug.y);

          // Check hit by player
          if (
            Math.abs(bug.x - (playerX + playerWidth / 2)) < playerWidth &&
            bug.y > playerY &&
            bug.y < playerY + playerHeight
          ) {
            // Player struck! Game Over
            sfx.playGameOver();
            setIsPlaying(false);
            setIsGameOver(true);
            cancelAnimationFrame(animId);
            cleanup();
            return;
          }

          // Check laser collisions
          for (const laser of lasers) {
            if (laser.active) {
              const dx = Math.abs(laser.x - bug.x);
              const dy = Math.abs(laser.y - bug.y);
              if (dx < 15 && dy < 15) {
                laser.active = false;
                bug.active = false;
                score += 50;
                setCurrentScore(score);
                sfx.playExplosion();
              }
            }
          }

          // Check boundary limit
          if (bug.y > height) {
            // Escaped bug subtract points or lose
            bug.active = false;
            score = Math.max(0, score - 20);
            setCurrentScore(score);
          }
        }
      }

      // Controls
      if (leftPressed && playerX > 0) playerX -= 5;
      if (rightPressed && playerX < width - playerWidth) playerX += 5;

      animId = requestAnimationFrame(gameLoop);
    }

    function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", mouseAndTouchMove);
      canvas.removeEventListener("touchmove", mouseAndTouchMove);
      canvas.removeEventListener("click", handleShootClick);
    }

    mainLoopRef.current = { cleanup };
    gameLoop();
  };

  // Cleanup effects on unmount
  useEffect(() => {
    return () => {
      if (mainLoopRef.current) mainLoopRef.current.cleanup();
      if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
    };
  }, []);

  // Soft directional pad triggers for Mobile Snake & shooters
  const triggerMobileInput = (direction: string) => {
    if (activeGameId === "snake" && isPlaying) {
      if (direction === "up" && snakeDir[1] !== 1) setSnakeDir([0, -1]);
      else if (direction === "down" && snakeDir[1] !== -1) setSnakeDir([0, 1]);
      else if (direction === "left" && snakeDir[0] !== 1) setSnakeDir([-1, 0]);
      else if (direction === "right" && snakeDir[0] !== -1) setSnakeDir([1, 0]);
    }
  };

  // Filter leaderboard scores
  const scoreFilterSorted = gameScores
    .filter((s) => s.gameId === activeGameId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

  // Group aggregate points per office
  const officePointsBreakdown = gameScores.reduce((acc: Record<string, number>, s) => {
    acc[s.playerOffice] = (acc[s.playerOffice] || 0) + s.score;
    return acc;
  }, {});

  const sortedOfficesLeaderboard = Object.entries(officePointsBreakdown)
    .map(([id, score]) => ({ id, name: OFFICE_NAMES[id] || id, score: Number(score) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div id="retro_games_arena_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: GAME BOY SCREEN & CONTROLS (8-cols on desk) */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        
        {/* Game selection Header cards */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="text-deriv-red w-6 h-6 animate-bounce" />
              <div>
                <h2 className="text-sm font-black font-mono tracking-tight text-white uppercase">CHILDHOOD RETRO GAMES ARENA</h2>
                <p className="text-[10px] text-slate-400 font-mono tracking-wide">Multi-Office Global Watercooler Tourney</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute} 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX size={14} className="text-deriv-red" /> : <Volume2 size={14} className="text-emerald-400" />}
              </button>
              
              {isProfileSaved && (
                <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-slate-400">Representative:</span>
                  <span className="text-deriv-red font-black uppercase text-ellipsis overflow-hidden max-w-[80px]">{playerName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 border-t border-slate-800/80 pt-3">
            {[
              { id: "snake", name: "Retro Snake 🐍", color: "hover:border-emerald-500", activeBg: "border-emerald-500 bg-emerald-950/20 text-emerald-400" },
              { id: "breaker", name: "Brick Out 🧱", color: "hover:border-amber-500", activeBg: "border-amber-500 bg-amber-950/20 text-amber-400" },
              { id: "memory", name: "Food Match 🥪", color: "hover:border-sky-500", activeBg: "border-sky-500 bg-sky-950/20 text-sky-400" },
              { id: "bugs", name: "Squasher 👾", color: "hover:border-deriv-red", activeBg: "border-deriv-red bg-red-950/20 text-deriv-red" }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  if (isPlaying) {
                    if (confirm("Switching games will abort your current session! Proceed?")) {
                      setIsPlaying(false);
                      setActiveGameId(g.id as any);
                    }
                  } else {
                    setActiveGameId(g.id as any);
                    setIsGameOver(false);
                    setSubmittedScore(false);
                  }
                }}
                className={`flex flex-col items-center justify-center p-3.5 border border-slate-800 rounded-xl transition font-mono text-[10px] text-center select-none ${g.color} ${
                  activeGameId === g.id ? g.activeBg : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                }`}
              >
                <span className="font-bold leading-normal truncate">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ----------------- IF NOT LOGGED IN / REGISTERED ----------------- */}
        {!isProfileSaved ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 bg-red-50 text-deriv-red border border-red-100 rounded-2xl flex items-center justify-center">
              <Gamepad2 size={32} className="animate-spin-slow" />
            </div>

            <div className="max-w-md">
              <h3 className="font-black text-slate-800 text-base font-mono uppercase tracking-tight">CHOOSE YOUR IDENTITY TO COMPETE</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Rep your local Deriv branch! Enter your workplace nickname and select your home base office. Every high score you secure appends directly to your office's global score tally!
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="max-w-sm w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 font-mono">
                  <User size={11} className="text-deriv-red" /> Nickname
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  placeholder="e.g. CodeBoss"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-mono text-xs focus:ring-1 focus:ring-deriv-red focus:outline-hidden font-bold"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 font-mono">
                  <Building size={11} className="text-deriv-red" /> Representing Office
                </label>
                <select
                  value={playerOffice}
                  onChange={(e) => setPlayerOffice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-mono text-xs focus:ring-1 focus:ring-deriv-red focus:outline-hidden font-bold"
                >
                  {Object.entries(OFFICE_NAMES).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-deriv-red hover:bg-deriv-red-hover text-white text-xs py-3 rounded-xl font-black font-mono tracking-wider active:scale-[0.98] transition shadow-md shadow-deriv-red/10 cursor-pointer"
              >
                PROCEED TO RETRO CORNER 🕹️
              </button>
            </form>
          </div>
        ) : (
          /* ----------------- MAIN PLAYING CANVAS STAGE ----------------- */
          <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between items-center relative overflow-hidden h-[460px]">
            
            {/* Ambient Grid Lines Background on arcade board */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,68,79,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,68,79,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Top Stats HUD line */}
            <div className="w-full flex justify-between items-center bg-slate-900/80 px-4 py-2 border border-slate-850 rounded-xl z-10 font-mono text-[10px] text-slate-300 select-none">
              <div className="flex items-center space-x-1">
                <span className="text-slate-500">Rep:</span>
                <span className="text-slate-100 font-bold">{playerName} ({playerOffice.toUpperCase()})</span>
              </div>
              
              <div className="flex items-center gap-4">
                {activeGameId === "memory" && isPlaying && (
                  <>
                    <div>Moves: <span className="text-sky-400 font-bold">{memoryMoves}</span></div>
                    <div>Time: <span className="text-sky-400 font-bold">{memoryTime}s</span></div>
                  </>
                )}
                <div className="flex items-center space-x-1 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                  <span className="text-slate-500">Score:</span>
                  <span className="text-deriv-red font-black animate-pulse">{currentScore}</span>
                </div>
              </div>
            </div>

            {/* ---------------- GAMEPLAY RENDER SCREEN ---------------- */}
            <div className="flex-1 w-full flex items-center justify-center relative my-3 max-h-[330px]">
              
              {/* PLAYING SCREENS OVERLAYS (START, GAMEOVER) */}
              {!isPlaying && !isGameOver && (
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center flex flex-col items-center space-y-4 max-w-sm z-10 select-none animate-fade-in shadow-xl">
                  <span className="text-3xl">🕹️</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100 uppercase font-mono tracking-wide">
                      {activeGameId === "snake" && "Retro Nokia Grid Snake"}
                      {activeGameId === "breaker" && "Deriv Brick Breakout"}
                      {activeGameId === "memory" && "Corporate Munch Match"}
                      {activeGameId === "bugs" && "Space Bug Squasher"}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {activeGameId === "snake" && "Control with arrows or mobile D-pad. Eat food dots without smacking screens walls or self body!"}
                      {activeGameId === "breaker" && "Destroy the vibrant office blocks! Control the modern sleek paddle with cursor mouse or arrow keys!"}
                      {activeGameId === "memory" && "Standard card pairing board! Find the matched regional pantry treats and foods under moves & speed limits!"}
                      {activeGameId === "bugs" && "Retro 80s Bug shooting matrix! Left/Right to guide spacecraft. Shoot fire zappers at buggy lines!"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (activeGameId === "snake") initSnakeGame();
                      else if (activeGameId === "breaker") initBreakerGame();
                      else if (activeGameId === "memory") initMemoryGame();
                      else if (activeGameId === "bugs") initBugsGame();
                    }}
                    className="w-full bg-deriv-red hover:bg-deriv-red-hover text-white py-2.5 rounded-xl font-bold font-mono text-[10px] active:scale-95 transition cursor-pointer"
                  >
                    START GAME INJECT 🚀
                  </button>
                </div>
              )}

              {isGameOver && (
                <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl text-center flex flex-col items-center space-y-4 max-w-sm z-10 select-none animate-fade-in shadow-xl">
                  {currentScore > 1000 || (activeGameId === "snake" && currentScore > 100) ? (
                    <div className="text-3xl animate-bounce">🏆</div>
                  ) : (
                    <span className="text-3xl">💀</span>
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100 uppercase font-mono tracking-wide">
                      SESSION FINALIZED
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                      Your high score is: <span className="text-deriv-red font-black text-lg">{currentScore} pts</span>
                    </p>
                  </div>

                  <div className="w-full space-y-2 pt-2 border-t border-slate-800">
                    {!submittedScore ? (
                      <button
                        onClick={submitHighScore}
                        disabled={currentScore <= 0}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 py-2 rounded-xl font-bold font-mono text-[10px] active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trophy size={12} /> SUBMIT HIGH SCORE
                      </button>
                    ) : (
                      <div className="text-[9px] text-emerald-400 font-mono py-2 bg-emerald-950/20 border border-emerald-950/40 rounded-xl">
                        ✓ SCORE DISPATCHED TO PLATFORM LEADERBOARD!
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (activeGameId === "snake") initSnakeGame();
                        else if (activeGameId === "breaker") initBreakerGame();
                        else if (activeGameId === "memory") initMemoryGame();
                        else if (activeGameId === "bugs") initBugsGame();
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-white py-2 rounded-xl font-bold font-mono text-[10px] active:scale-95 transition"
                    >
                      PLAY AGAIN 🔄
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------ ACTIVE SCREEN: SNAKE GRID RENDER ------------------ */}
              {activeGameId === "snake" && isPlaying && (
                <div className="grid grid-cols-20 grid-rows-20 w-[240px] h-[240px] bg-slate-950 border border-emerald-950 rounded-lg overflow-hidden relative shadow-inner">
                  {/* Food */}
                  <div
                    style={{ gridColumnStart: snakeFood[0] + 1, gridRowStart: snakeFood[1] + 1 }}
                    className="bg-deriv-red rounded-full flex items-center justify-center w-full h-full p-0.5"
                  >
                    <div className="bg-white rounded-full w-full h-full animate-pulse"></div>
                  </div>

                  {/* Snake Segment */}
                  {snake.map((segment, i) => (
                    <div
                      key={i}
                      style={{ gridColumnStart: segment[0] + 1, gridRowStart: segment[1] + 1 }}
                      className={`${
                        i === 0 
                          ? "bg-emerald-400 border border-emerald-900 rounded-sm z-5 shadow-sm" 
                          : "bg-emerald-600 border border-emerald-950/40 rounded-xs"
                      } w-full h-full`}
                    ></div>
                  ))}
                </div>
              )}

              {/* ------------------ ACTIVE SCREEN: CANVASES (BREAKER / BUGS) ------------------ */}
              {activeGameId === "breaker" && isPlaying && !isGameOver && (
                <canvas 
                  ref={breakerCanvasRef} 
                  className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl max-w-full block"
                  width={440}
                  height={320}
                />
              )}

              {activeGameId === "bugs" && isPlaying && !isGameOver && (
                <canvas 
                  ref={bugsCanvasRef} 
                  className="rounded-xl border border-slate-800 bg-slate-950 shadow-xl max-w-full block cursor-crosshair"
                  width={440}
                  height={320}
                />
              )}

              {/* ------------------ ACTIVE SCREEN: MEMORY CARDS MATCHING GRID ------------------ */}
              {activeGameId === "memory" && isPlaying && (
                <div className="grid grid-cols-4 gap-2 w-full max-w-[280px]">
                  {memoryCards.map((card, idx) => {
                    const shown = card.isFlipped || card.isMatched;
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleMemoryCardClick(idx)}
                        className={`h-14 rounded-xl border font-mono text-xs font-black transition-all duration-300 transform select-none ${
                          shown 
                            ? "bg-slate-900 text-slate-100 border-sky-900 rotate-180" 
                            : "bg-radial from-slate-800 to-slate-950 text-sky-400 hover:text-white border-slate-800 hover:border-sky-500 scale-100 cursor-pointer hover:shadow-sky-950/20 hover:shadow-lg"
                        }`}
                      >
                        <span className={`block transform ${shown ? "scale-x-[-1] scale-y-[-1]" : ""}`}>
                          {shown ? card.symbol : "❓"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Bottom controllers for mobile/touch users */}
            <div className="w-full flex items-center justify-between mt-1 z-10">
              
              <div className="flex flex-col items-start font-mono text-[8px] text-slate-500 leading-tight">
                <span>Console Controls:</span>
                <span className="text-slate-400">Mouse move / Arrow keys binded</span>
                <span>Touch/tap to steer & slide</span>
              </div>

              {/* Digital Direction keyboard triggers */}
              {activeGameId === "snake" && isPlaying && (
                <div className="grid grid-cols-3 gap-1 z-20 shrink-0 transform scale-90 md:scale-100">
                  <div></div>
                  <button 
                    onClick={() => triggerMobileInput("up")} 
                    className="w-8 h-8 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-90 select-none cursor-pointer rounded-lg flex items-center justify-center text-slate-300"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <div></div>

                  <button 
                    onClick={() => triggerMobileInput("left")} 
                    className="w-8 h-8 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-90 select-none cursor-pointer rounded-lg flex items-center justify-center text-slate-300"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    onClick={() => triggerMobileInput("down")} 
                    className="w-8 h-8 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-90 select-none cursor-pointer rounded-lg flex items-center justify-center text-slate-300"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button 
                    onClick={() => triggerMobileInput("right")} 
                    className="w-8 h-8 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-90 select-none cursor-pointer rounded-lg flex items-center justify-center text-slate-300"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {/* Reset credentials action */}
              <button
                onClick={handleResetProfile}
                className="text-[9px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-3 py-1.5 border border-slate-800/80 rounded-xl transition"
              >
                Change Player 👤
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: TOURNEY TROPHY CUP & HIGHSCORES BOARDS (4-cols) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        
        {/* Tourney Cup Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-500 border border-amber-100 rounded-xl">
              <Trophy size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-xs font-mono tracking-tight uppercase">GLOBAL OFFICE CHALLENGE</h3>
              <p className="text-[9px] text-slate-400 font-mono block">Aggregate Scores across games</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {sortedOfficesLeaderboard.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic py-5 text-center">
                Submit score to raise your office flag high!
              </div>
            ) : (
              sortedOfficesLeaderboard.map((office, idx) => {
                const colors = [
                  "bg-amber-500 text-white", // Gold 1
                  "bg-slate-300 text-slate-700", // Silver 2
                  "bg-orange-400 text-white" // Bronze 3
                ];
                const pillColor = colors[idx] || "bg-slate-50 border border-slate-150 text-slate-500";
                return (
                  <div 
                    key={office.id} 
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-xs hover:border-slate-300 transition"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold font-mono text-[10px] ${pillColor}`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-850 font-mono lowercase capitalize">
                        {office.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 font-mono">
                      <span className="text-slate-400 text-[10px]">Total:</span>
                      <span className="font-extrabold text-deriv-red">{office.score} pts</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Game specific high score ledger */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-950/40 text-deriv-red border border-red-950/50 rounded-xl">
              <Award size={18} className="animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-xs font-mono tracking-tight uppercase">
                {activeGameId === "snake" && "Snake Board"}
                {activeGameId === "breaker" && "Brick Out Board"}
                {activeGameId === "memory" && "Food Match Board"}
                {activeGameId === "bugs" && "Squasher Board"}
              </h3>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Global Highscores</p>
            </div>
          </div>

          <div className="space-y-2 divide-y divide-slate-850">
            {scoreFilterSorted.length === 0 ? (
              <div className="text-[10px] text-slate-500 italic py-8 text-center font-mono">
                None submitted yet. Be the pioneer scorer!
              </div>
            ) : (
              scoreFilterSorted.map((record, index) => (
                <div key={record.id} className="pt-2.5 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] text-slate-400">#{index + 1}</span>
                    <div>
                      <span className="font-extrabold text-slate-100 uppercase">{record.playerName}</span>
                      <span className="text-[8px] text-slate-400 block tracking-wide uppercase font-black">
                        {record.playerOffice} branch
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-deriv-red font-mono text-xs">{record.score} pts</span>
                    <span className="block text-[8px] text-slate-500">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-850 flex items-start gap-2 text-[9px] text-slate-400 font-mono leading-normal">
            <Info size={11} className="text-deriv-red shrink-0 mt-0.5" />
            <span>Scores are shared in real-time across the platform database. Encourage your colleagues to beat other offices!</span>
          </div>
        </div>

      </div>

    </div>
  );
}
