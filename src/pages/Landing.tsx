import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Target, Timer, BarChart3, MessageCircle, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Target, title: "Study Missions", desc: "Turn your tasks into XP-earning quests" },
  { icon: Timer, title: "Focus Mode", desc: "25-min Pomodoro sessions with rewards" },
  { icon: BarChart3, title: "Progress Tracking", desc: "Visualize your study streaks and growth" },
  { icon: MessageCircle, title: "AI Study Coach", desc: "Get instant help and motivation from AI" },
  { icon: Zap, title: "XP & Levels", desc: "Earn XP, level up, build unstoppable habits" },
  { icon: Star, title: "Daily Streaks", desc: "Maintain your streak and stay consistent" },
];

const steps = [
  { num: "01", title: "Add Your Missions", desc: "Create study tasks and set XP rewards" },
  { num: "02", title: "Enter Focus Mode", desc: "Start a 25-minute deep focus session" },
  { num: "03", title: "Earn XP & Level Up", desc: "Complete tasks, earn XP, track progress" },
];

const testimonials = [
  { name: "Alex M.", text: "StudyOS turned my boring study routine into something I actually look forward to!", avatar: "🎓" },
  { name: "Sara K.", text: "The focus timer with XP rewards keeps me so motivated. 30-day streak and counting!", avatar: "🔥" },
  { name: "James L.", text: "The AI coach explains things better than my textbook. Game changer for exam prep.", avatar: "🧠" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">StudyOS</span>
        </div>
        <Link to="/dashboard">
          <Button size="sm" className="gradient-primary text-primary-foreground border-0 rounded-xl font-semibold">
            Get Started
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> Level up your learning
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn studying into{" "}
            <span className="text-gradient-primary">a game</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            StudyOS gamifies your study sessions with XP, levels, streaks, and an AI coach — making studying as addictive as your favorite game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 rounded-xl font-semibold text-base px-8 glow-primary">
                Start Studying <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/focus">
              <Button size="lg" variant="outline" className="rounded-xl text-base px-8 border-border/50 text-foreground hover:bg-secondary">
                Try Focus Mode
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Everything you need to study smarter</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="text-4xl font-display font-bold text-primary/20 mb-3">{s.num}</div>
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12">What students say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.avatar}</span>
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="glass-card p-10 glow-primary">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to level up?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of students who made studying fun.</p>
          <Link to="/dashboard">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 rounded-xl font-semibold text-base px-8">
              Start Now — It's Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        © 2026 StudyOS. Built to make studying addictive.
      </footer>
    </div>
  );
}
