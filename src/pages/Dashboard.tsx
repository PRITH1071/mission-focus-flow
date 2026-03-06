import { motion } from "framer-motion";
import { useGameStore } from "@/lib/gameStore";
import { AppLayout } from "@/components/AppLayout";
import { Trophy, Zap, Flame, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { xp, level, streak, missions, studySessions, totalFocusMinutes } = useGameStore();
  const todayMissions = missions.filter((m) => !m.completed);
  const completedToday = missions.filter((m) => m.completed).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = studySessions.find((s) => s.date === today)?.minutes ?? 0;

  // Weekly study hours
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weeklyMinutes = studySessions
    .filter((s) => s.date >= weekAgo)
    .reduce((sum, s) => sum + s.minutes, 0);

  const stats = [
    { label: "Level", value: level, icon: Trophy, color: "text-level", bg: "bg-level/10", glow: "glow-level" },
    { label: "Total XP", value: `${xp + (level - 1) * 500}`, icon: Zap, color: "text-xp", bg: "bg-xp/10", glow: "glow-primary" },
    { label: "Streak", value: `${streak} days`, icon: Flame, color: "text-streak", bg: "bg-streak/10", glow: "glow-accent" },
    { label: "Focus Today", value: `${todayMinutes}m`, icon: Clock, color: "text-primary", bg: "bg-primary/10", glow: "" },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Keep the momentum going 💪</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 ${s.glow}`}
            >
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="font-display text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-semibold">Level {level} Progress</span>
            <span className="text-sm text-xp font-medium">{xp}/500 XP</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / 500) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Today's Missions */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Today's Missions
              </h2>
              <Link to="/missions" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {todayMissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending missions. <Link to="/missions" className="text-primary">Add some!</Link></p>
            ) : (
              <ul className="space-y-2">
                {todayMissions.slice(0, 4).map((m) => (
                  <li key={m.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="flex-1">{m.title}</span>
                    <span className="text-xs text-xp">+{m.xpReward} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="glass-card p-5">
            <h2 className="font-display font-semibold mb-4">Weekly Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Study Hours</span>
                  <span className="font-medium">{(weeklyMinutes / 60).toFixed(1)}h</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min(100, (weeklyMinutes / 600) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Missions Completed</span>
                  <span className="font-medium">{completedToday}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-accent rounded-full" style={{ width: `${Math.min(100, (completedToday / 10) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Total Focus</span>
                  <span className="font-medium">{totalFocusMinutes}m</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-level rounded-full" style={{ width: `${Math.min(100, (totalFocusMinutes / 300) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
