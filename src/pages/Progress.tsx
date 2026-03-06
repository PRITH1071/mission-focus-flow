import { motion } from "framer-motion";
import { useGameStore } from "@/lib/gameStore";
import { AppLayout } from "@/components/AppLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Trophy, Zap, Flame, Clock } from "lucide-react";

export default function Progress() {
  const { xp, level, streak, studySessions, totalFocusMinutes, missions } = useGameStore();

  // Last 7 days chart data
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toISOString().slice(0, 10);
    const dayLabel = date.toLocaleDateString("en", { weekday: "short" });
    const session = studySessions.find((s) => s.date === dateStr);
    chartData.push({ day: dayLabel, minutes: session?.minutes ?? 0 });
  }

  const totalXP = xp + (level - 1) * 500;
  const completedMissions = missions.filter((m) => m.completed).length;

  // Streak history (last 14 days)
  const streakDays = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toISOString().slice(0, 10);
    const active = studySessions.some((s) => s.date === dateStr);
    streakDays.push({ date: dateStr, active, label: date.getDate().toString() });
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-1">Progress</h1>
          <p className="text-muted-foreground">Track your study journey and achievements</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Trophy, label: "Level", value: level, color: "text-level" },
            { icon: Zap, label: "Total XP", value: totalXP, color: "text-xp" },
            { icon: Flame, label: "Streak", value: `${streak}d`, color: "text-streak" },
            { icon: Clock, label: "Focus Time", value: `${totalFocusMinutes}m`, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <div className="font-display text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold mb-4">Weekly Study Minutes</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 47%, 9%)",
                    border: "1px solid hsl(222, 30%, 16%)",
                    borderRadius: "12px",
                    color: "hsl(210, 40%, 96%)",
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Progress */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display font-semibold">XP to Next Level</h2>
            <span className="text-sm text-xp">{xp}/500 XP</span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${(xp / 500) * 100}%` }} transition={{ duration: 0.8 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{500 - xp} XP until Level {level + 1}</p>
        </div>

        {/* Streak history */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold mb-4">Streak History (14 days)</h2>
          <div className="flex gap-2 justify-center flex-wrap">
            {streakDays.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                    d.active ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji: "🎯", title: "First Mission", unlocked: completedMissions >= 1 },
              { emoji: "⚡", title: "10 Missions", unlocked: completedMissions >= 10 },
              { emoji: "🔥", title: "3-Day Streak", unlocked: streak >= 3 },
              { emoji: "🏆", title: "Level 5", unlocked: level >= 5 },
              { emoji: "⏱️", title: "1hr Focus", unlocked: totalFocusMinutes >= 60 },
              { emoji: "💪", title: "7-Day Streak", unlocked: streak >= 7 },
              { emoji: "🌟", title: "Level 10", unlocked: level >= 10 },
              { emoji: "🧠", title: "5hr Focus", unlocked: totalFocusMinutes >= 300 },
            ].map((a) => (
              <div key={a.title} className={`p-3 rounded-xl text-center ${a.unlocked ? "glass-card" : "bg-muted/30 opacity-40"}`}>
                <div className="text-2xl mb-1">{a.emoji}</div>
                <div className="text-xs font-medium">{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
