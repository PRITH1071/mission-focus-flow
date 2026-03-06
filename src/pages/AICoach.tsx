import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are StudyOS AI Coach — a friendly, motivating study assistant. You help students:
- Explain difficult concepts in simple terms
- Create study plans and strategies
- Motivate and encourage them
- Quiz them on topics
- Give study tips and tricks
Keep responses concise, friendly, and encouraging. Use emojis occasionally. If asked non-study topics, gently redirect to studying.`;

const SUGGESTIONS = [
  "Explain the Pythagorean theorem simply",
  "Give me a 2-hour study plan for biology",
  "Quiz me on World War II",
  "How can I improve my focus?",
];

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Simple local response (no API needed for prototype)
    // In production, this would call an edge function
    setTimeout(() => {
      const responses = [
        `Great question! Let me break that down for you.\n\n${getStudyResponse(text)}`,
        `I love that you're curious about this! 🌟\n\n${getStudyResponse(text)}`,
        `Let's dive into this together! 💪\n\n${getStudyResponse(text)}`,
      ];
      const assistantMsg: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen max-h-screen">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border/50">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold">AI Study Coach</h1>
              <p className="text-xs text-muted-foreground">Ask anything — I'm here to help you learn</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 space-y-6">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold mb-2">Hey there! 👋</h2>
                  <p className="text-muted-foreground text-sm">I'm your AI study coach. Ask me anything about your studies!</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask your study coach..."
              className="bg-muted/50 border-border/50 rounded-xl"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="gradient-primary text-primary-foreground rounded-xl px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Simple response generator for prototype
function getStudyResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("plan") || q.includes("schedule")) {
    return "Here's a study plan I'd suggest:\n\n1. **Review notes** (20 min) — Skim through key concepts\n2. **Active recall** (25 min) — Test yourself without looking\n3. **Break** (5 min) — Stretch and hydrate 💧\n4. **Practice problems** (25 min) — Apply what you learned\n5. **Review mistakes** (10 min) — Learn from errors\n\nUse the Focus Mode timer to stay on track! 🎯";
  }
  if (q.includes("focus") || q.includes("concentrate") || q.includes("distract")) {
    return "Here are my top focus tips:\n\n- 📱 Put your phone in another room\n- 🎧 Try lo-fi music or white noise\n- 💧 Stay hydrated\n- ⏱️ Use the Pomodoro technique (25 min focus, 5 min break)\n- 📝 Write down distracting thoughts to address later\n\nTry the Focus Mode — it's designed exactly for this!";
  }
  if (q.includes("quiz") || q.includes("test")) {
    return "Let's do a quick quiz! 🧠\n\n**Question 1:** What study technique involves testing yourself without looking at notes?\n\na) Passive reading\nb) Active recall ✅\nc) Highlighting\nd) Copying notes\n\nActive recall is one of the most effective study methods. Try it with your next topic!";
  }
  if (q.includes("pythagorean") || q.includes("math")) {
    return "The **Pythagorean Theorem** states:\n\n> a² + b² = c²\n\nWhere `c` is the hypotenuse (longest side) of a right triangle, and `a` and `b` are the other two sides.\n\n**Example:** If a = 3 and b = 4:\n- 3² + 4² = 9 + 16 = 25\n- c = √25 = **5**\n\nIt's used everywhere — construction, navigation, physics! 📐";
  }
  return "That's a great topic to explore! Here are some tips:\n\n1. **Break it into chunks** — Don't try to learn everything at once\n2. **Use active recall** — Test yourself regularly\n3. **Teach someone else** — If you can explain it, you understand it\n4. **Space your learning** — Review over multiple days\n\nKeep going, you're doing amazing! 🚀";
}
