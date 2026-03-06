import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/gameStore";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Check, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Missions() {
  const { missions, addMission, completeMission, deleteMission } = useGameStore();
  const [newTask, setNewTask] = useState("");
  const [xpReward, setXpReward] = useState(50);

  const pending = missions.filter((m) => !m.completed);
  const completed = missions.filter((m) => m.completed);
  const totalXP = missions.reduce((s, m) => s + (m.completed ? m.xpReward : 0), 0);
  const progress = missions.length > 0 ? (completed.length / missions.length) * 100 : 0;

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addMission(newTask.trim(), xpReward);
    setNewTask("");
    toast.success("Mission added! 🎯");
  };

  const handleComplete = (id: string) => {
    const m = missions.find((m) => m.id === id);
    completeMission(id);
    toast.success(`+${m?.xpReward} XP earned! ⚡`);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-1">Study Missions</h1>
          <p className="text-muted-foreground">Complete tasks to earn XP and level up</p>
        </motion.div>

        {/* Progress bar */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Mission Progress</span>
            <span className="text-sm text-xp">{totalXP} XP earned</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{completed.length}/{missions.length} missions completed</p>
        </div>

        {/* Add mission */}
        <div className="glass-card p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a study mission..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="bg-muted/50 border-border/50 rounded-xl"
            />
            <select
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="bg-muted/50 border border-border/50 rounded-xl px-3 text-sm text-foreground"
            >
              <option value={25}>25 XP</option>
              <option value={50}>50 XP</option>
              <option value={100}>100 XP</option>
              <option value={200}>200 XP</option>
            </select>
            <Button onClick={handleAdd} className="gradient-primary text-primary-foreground rounded-xl px-4">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide">Active Missions</h2>
            <AnimatePresence>
              {pending.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass-card p-4 flex items-center gap-3"
                >
                  <button
                    onClick={() => handleComplete(m.id)}
                    className="w-6 h-6 rounded-full border-2 border-primary/50 hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Check className="w-3 h-3 text-primary opacity-0 hover:opacity-100" />
                  </button>
                  <span className="flex-1 text-sm">{m.title}</span>
                  <span className="text-xs font-medium text-xp flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {m.xpReward}
                  </span>
                  <button onClick={() => deleteMission(m.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide">Completed</h2>
            {completed.map((m) => (
              <div key={m.id} className="glass-card p-4 flex items-center gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="flex-1 text-sm line-through">{m.title}</span>
                <span className="text-xs text-xp">+{m.xpReward}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
