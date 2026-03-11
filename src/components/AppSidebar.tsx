import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Target, Timer, BarChart3, MessageCircle, Home, Trophy, X, Menu, Clock } from "lucide-react";
import { useGameStore } from "@/lib/gameStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Missions", url: "/missions", icon: Target },
  { title: "Focus Mode", url: "/focus", icon: Timer },
  { title: "Progress", url: "/progress", icon: BarChart3 },
  { title: "AI Coach", url: "/coach", icon: MessageCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const { level, xp, streak } = useGameStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">StudyOS</span>
        </Link>
      </div>

      <div className="p-4">
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Level {level}</span>
            <span className="text-xs font-medium text-xp">{xp}/500 XP</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${(xp / 500) * 100}%` }} />
          </div>
          <div className="flex items-center gap-1 text-xs text-streak">
            🔥 {streak} day streak
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-xl bg-card border border-border/50"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-card border-r border-border/50 z-50 md:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] min-h-screen bg-card/50 border-r border-border/50 flex-shrink-0">
        {content}
      </aside>
    </>
  );
}
