import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Crown } from "lucide-react";

type TimeRange = "week" | "all";

const mockStudents = [
  { name: "Alex Rivera", xp: 4820, level: 10, badge: "Top Contributor" },
  { name: "Priya Sharma", xp: 4350, level: 9, badge: "On Fire" },
  { name: "Jordan Lee", xp: 3900, level: 8, badge: "Consistent" },
  { name: "Mia Chen", xp: 3670, level: 7, badge: "On Fire" },
  { name: "Ethan Brooks", xp: 3200, level: 6, badge: "Consistent" },
  { name: "Sofia Martinez", xp: 2850, level: 6, badge: "Top Contributor" },
  { name: "Liam Okafor", xp: 2400, level: 5, badge: "Consistent" },
  { name: "Ava Nguyen", xp: 2100, level: 4, badge: "On Fire" },
  { name: "Noah Patel", xp: 1750, level: 4, badge: "Consistent" },
  { name: "Emma Wilson", xp: 1300, level: 3, badge: "Consistent" },
];

const weekStudents = mockStudents.map((s, i) => ({
  ...s,
  xp: Math.round(s.xp * (0.15 + Math.random() * 0.15)),
})).sort((a, b) => b.xp - a.xp);

const badgeConfig: Record<string, { icon: typeof Flame; className: string }> = {
  "Top Contributor": { icon: Crown, className: "bg-primary/20 text-primary border-primary/30" },
  "On Fire": { icon: Flame, className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  "Consistent": { icon: Star, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

const rankStyles: Record<number, string> = {
  0: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
  1: "from-slate-300/15 to-slate-300/5 border-slate-400/25",
  2: "from-amber-700/15 to-amber-700/5 border-amber-700/25",
};

export default function Leaderboard() {
  const [range, setRange] = useState<TimeRange>("all");
  const data = range === "all" ? mockStudents : weekStudents;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-3xl font-bold mb-1">Leaderboard</h1>
          <p className="text-muted-foreground">See who's crushing it</p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center gap-2">
          {(["all", "week"] as TimeRange[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "outline"}
              onClick={() => setRange(r)}
              className={`rounded-xl font-semibold ${range === r ? "gradient-primary text-primary-foreground glow-primary" : "border-border/50"}`}
            >
              {r === "all" ? "All Time" : "This Week"}
            </Button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {data.map((student, i) => {
            const badge = badgeConfig[student.badge];
            const BadgeIcon = badge.icon;
            const isTop3 = i < 3;

            return (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex items-center gap-4 border ${
                  isTop3 ? `bg-gradient-to-r ${rankStyles[i]}` : "border-border/30"
                }`}
              >
                {/* Rank */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                  i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                  i === 1 ? "bg-slate-400/20 text-slate-300" :
                  i === 2 ? "bg-amber-700/20 text-amber-500" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i === 0 ? <Trophy className="w-4 h-4" /> : `#${i + 1}`}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">Level {student.level}</p>
                </div>

                {/* Badge */}
                <Badge variant="outline" className={`hidden sm:inline-flex gap-1 text-xs ${badge.className}`}>
                  <BadgeIcon className="w-3 h-3" />
                  {student.badge}
                </Badge>

                {/* XP */}
                <span className="font-display font-bold text-xp tabular-nums shrink-0">
                  {student.xp.toLocaleString()} XP
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
