import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameStore } from "@/lib/gameStore";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Square, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type TimerState = "idle" | "running" | "paused" | "completed";

export default function HomeworkTimer() {
  const { addXP } = useGameStore();
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timerState === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearTimer();
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [timerState]);

  const handleComplete = async () => {
    setTimerState("completed");
    addXP(10);
    toast.success("Homework Complete! +10 XP 🎉");

    const durationMin = Math.round(totalDuration / 60);
    const actualMin = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));

    await supabase.from("homework_sessions").insert({
      title: title || "Untitled",
      duration_minutes: durationMin,
      actual_time_spent_minutes: actualMin,
    });
  };

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds <= 0) {
      toast.error("Set a duration first");
      return;
    }
    setTotalDuration(totalSeconds);
    setTimeLeft(totalSeconds);
    setTimerState("running");
    startTimeRef.current = Date.now();
  };

  const handlePause = () => {
    clearTimer();
    setTimerState("paused");
  };

  const handleResume = () => {
    setTimerState("running");
  };

  const handleStop = () => {
    clearTimer();
    setTimeLeft(0);
    setTimerState("idle");
  };

  const handleReset = () => {
    clearTimer();
    setTimeLeft(0);
    setTimerState("idle");
    setTitle("");
    setHours(0);
    setMinutes(25);
  };

  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;
  const isLowTime = timerState === "running" && timeLeft > 0 && timeLeft < 300;
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-3xl font-bold mb-1">Homework Timer</h1>
          <p className="text-muted-foreground">Track your homework sessions and earn XP</p>
        </motion.div>

        {/* Inputs */}
        <AnimatePresence mode="wait">
          {timerState === "idle" && (
            <motion.div
              key="inputs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md space-y-4"
            >
              <div>
                <Label htmlFor="subject" className="text-muted-foreground">Subject / Title</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Math Assignment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 bg-secondary/50 border-border/50 rounded-xl"
                  maxLength={100}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-muted-foreground">Hours</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={hours}
                    onChange={(e) => setHours(Math.min(10, Math.max(0, Number(e.target.value))))}
                    className="mt-1.5 bg-secondary/50 border-border/50 rounded-xl text-center text-lg"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-muted-foreground">Minutes</Label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                    className="mt-1.5 bg-secondary/50 border-border/50 rounded-xl text-center text-lg"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Display */}
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
              stroke={isLowTime ? "hsl(0, 72%, 51%)" : "hsl(142, 71%, 45%)"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center z-10">
            <div
              className={`font-display text-5xl font-bold tabular-nums transition-colors duration-500 ${
                timerState === "completed"
                  ? "text-green-400"
                  : isLowTime
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {String(displayMinutes).padStart(2, "0")}:{String(displaySeconds).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {timerState === "idle" && "Set duration & start"}
              {timerState === "running" && (title || "Focusing...")}
              {timerState === "paused" && "Paused"}
              {timerState === "completed" && "Done!"}
            </div>
          </div>
        </motion.div>

        {/* Completion Message */}
        <AnimatePresence>
          {timerState === "completed" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-5 flex items-center gap-3 border border-green-500/30 bg-green-500/10 glow-primary"
            >
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-display font-bold text-green-400">Homework Complete!</p>
                <p className="text-sm text-green-400/80">+10 XP Earned</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap justify-center">
          {timerState === "idle" && (
            <Button onClick={handleStart} size="lg" className="rounded-xl gradient-primary text-primary-foreground glow-primary px-8 font-semibold">
              <Play className="w-4 h-4 mr-2" /> Start
            </Button>
          )}
          {timerState === "running" && (
            <>
              <Button onClick={handlePause} size="lg" className="rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold">
                <Pause className="w-4 h-4 mr-2" /> Pause
              </Button>
              <Button onClick={handleStop} size="lg" variant="outline" className="rounded-xl border-border/50 text-foreground font-semibold">
                <Square className="w-4 h-4 mr-2" /> Stop
              </Button>
            </>
          )}
          {timerState === "paused" && (
            <>
              <Button onClick={handleResume} size="lg" className="rounded-xl gradient-primary text-primary-foreground glow-primary px-8 font-semibold">
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
              <Button onClick={handleStop} size="lg" variant="outline" className="rounded-xl border-border/50 text-foreground font-semibold">
                <Square className="w-4 h-4 mr-2" /> Stop
              </Button>
            </>
          )}
          {timerState === "completed" && (
            <Button onClick={handleReset} size="lg" className="rounded-xl gradient-primary text-primary-foreground glow-primary px-8 font-semibold">
              <Clock className="w-4 h-4 mr-2" /> New Session
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>⏱️ Complete a session to earn <span className="text-xp font-medium">10 XP</span></p>
        </div>
      </div>
    </AppLayout>
  );
}
