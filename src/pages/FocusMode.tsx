import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/gameStore";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

export default function FocusMode() {
  const { addXP, addFocusSession } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompleted(true);
      addXP(100);
      addFocusSession(25);
      toast.success("Focus session complete! +100 XP 🎉");
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100;

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
    setCompleted(false);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-3xl font-bold mb-1">Focus Mode</h1>
          <p className="text-muted-foreground">Stay locked in for 25 minutes and earn XP</p>
        </motion.div>

        {/* Timer circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 flex items-center justify-center"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="120" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" />
                <stop offset="100%" stopColor="hsl(160, 71%, 40%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center z-10">
            <div className="font-display text-5xl font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {completed ? "Session Complete!" : isRunning ? "Stay focused..." : "Ready?"}
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex gap-4">
          {!completed ? (
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className={`rounded-xl font-semibold px-8 ${isRunning ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "gradient-primary text-primary-foreground glow-primary"}`}
            >
              {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
            </Button>
          ) : (
            <div className="glass-card p-4 flex items-center gap-3 glow-primary">
              <Zap className="w-5 h-5 text-xp" />
              <span className="font-display font-semibold text-xp">+100 XP Earned!</span>
            </div>
          )}
          <Button onClick={reset} size="lg" variant="outline" className="rounded-xl border-border/50 text-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {/* Reward info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>🎯 Complete the session to earn <span className="text-xp font-medium">100 XP</span></p>
        </div>
      </div>
    </AppLayout>
  );
}
