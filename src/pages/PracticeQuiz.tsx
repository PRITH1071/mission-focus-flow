import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGameStore } from "@/lib/gameStore";
import { supabase } from "@/integrations/supabase/client";
import { getQuestionsForSubject, type Question } from "@/lib/quizData";
import { BookOpen, CheckCircle2, XCircle, Trophy, PartyPopper, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type QuizState = "select" | "playing" | "result";

interface SubjectOption {
  subject: string;
}

export default function PracticeQuiz() {
  const { addXP } = useGameStore();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizSubject, setQuizSubject] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from("homework_submissions")
      .select("subject")
      .order("submitted_at", { ascending: false })
      .limit(50);

    if (data && data.length > 0) {
      const unique = Array.from(new Set(data.map((d) => d.subject)));
      setSubjects(unique.map((s) => ({ subject: s })));
    } else {
      setSubjects([
        { subject: "Math" },
        { subject: "Science" },
        { subject: "English" },
        { subject: "History" },
      ]);
    }
  };

  const startQuiz = (subject: string) => {
    const { quizSubject: qs, questions: qq } = getQuestionsForSubject(subject);
    setQuizSubject(qs);
    setQuestions(qq);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setQuizState("playing");
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const finishQuiz = async () => {
    const finalScore = score + (selected === questions[currentQ]?.correctIndex && !answered ? 0 : 0);
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;

    setQuizState("result");
    addXP(25);
    toast.success("Quiz Complete! +25 XP 🎉");

    if (passed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    await supabase.from("quiz_attempts").insert({
      subject: quizSubject,
      score: pct,
      passed,
    });
  };

  const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = scorePct >= 70;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8 min-h-[80vh] flex flex-col">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-3xl font-bold mb-1">Practice Quiz</h1>
          <p className="text-muted-foreground">Test your knowledge and earn XP</p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* Subject Selection */}
            {quizState === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-center text-muted-foreground font-medium">Choose a subject</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjects.map((s) => (
                    <motion.button
                      key={s.subject}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startQuiz(s.subject)}
                      className="glass-card p-5 flex items-center gap-3 border border-border/30 hover:border-primary/40 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">{s.subject} Quiz</p>
                        <p className="text-xs text-muted-foreground">5 questions</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quiz Question */}
            {quizState === "playing" && questions.length > 0 && (
              <motion.div
                key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <span className="text-xp font-medium">{score} correct</span>
                  </div>
                  <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
                </div>

                {/* Question */}
                <div className="glass-card p-6 border border-border/30">
                  <p className="font-display text-lg font-semibold text-foreground">{questions[currentQ].question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === questions[currentQ].correctIndex;
                    const isSelected = idx === selected;
                    let optClass = "glass-card p-4 border cursor-pointer transition-all";

                    if (answered) {
                      if (isCorrect) {
                        optClass += " border-green-500/50 bg-green-500/10";
                      } else if (isSelected && !isCorrect) {
                        optClass += " border-red-500/50 bg-red-500/10";
                      } else {
                        optClass += " border-border/20 opacity-50";
                      }
                    } else {
                      optClass += " border-border/30 hover:border-primary/40";
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileTap={!answered ? { scale: 0.98 } : undefined}
                        onClick={() => handleSelect(idx)}
                        disabled={answered}
                        className={`${optClass} w-full text-left flex items-center gap-3`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-sm font-display font-bold text-muted-foreground shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-foreground font-medium">{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto shrink-0" />}
                        {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Next button */}
                {answered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full rounded-xl gradient-primary text-primary-foreground glow-primary font-semibold"
                    >
                      {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {quizState === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                {/* Celebration particles */}
                <AnimatePresence>
                  {showCelebration && (
                    <>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                          }}
                          animate={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 300,
                            y: -Math.random() * 400 - 50,
                            scale: Math.random() * 1.5 + 0.5,
                            rotate: Math.random() * 720,
                          }}
                          transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
                          className="absolute left-1/2 top-1/2 pointer-events-none"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {["🎉", "⭐", "🏆", "✨", "🎊", "💎"][i % 6]}
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                  className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center ${
                    passed ? "bg-green-500/15 border-2 border-green-500/30" : "bg-muted border-2 border-border/30"
                  }`}
                >
                  {passed ? (
                    <Trophy className="w-12 h-12 text-green-400" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  )}
                </motion.div>

                <div>
                  <p className="font-display text-4xl font-bold text-foreground">{scorePct}%</p>
                  <p className="text-muted-foreground mt-1">
                    {score} of {questions.length} correct
                  </p>
                </div>

                {passed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-5 border border-green-500/30 bg-green-500/10 space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PartyPopper className="w-5 h-5 text-green-400" />
                      <p className="font-display font-bold text-green-400">You Passed!</p>
                    </div>
                    <p className="text-sm text-green-400/80">+25 XP Earned</p>
                    <Button
                      asChild
                      className="rounded-xl gradient-primary text-primary-foreground glow-primary font-semibold"
                    >
                      <a href="https://www.khanacademy.org" target="_blank" rel="noopener noreferrer">
                        🎓 Unlock Free Video Course
                      </a>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-5 border border-border/30 space-y-2"
                  >
                    <p className="font-display font-semibold text-foreground">Keep Practicing!</p>
                    <p className="text-sm text-muted-foreground">Score 70% or higher to unlock a free video course</p>
                    <p className="text-sm text-xp">+25 XP Earned</p>
                  </motion.div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => startQuiz(quizSubject)}
                    variant="outline"
                    className="rounded-xl border-border/50 font-semibold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
                  </Button>
                  <Button
                    onClick={() => setQuizState("select")}
                    className="rounded-xl gradient-primary text-primary-foreground glow-primary font-semibold"
                  >
                    Choose Another
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>🧠 Complete a quiz to earn <span className="text-xp font-medium">25 XP</span></p>
        </div>
      </div>
    </AppLayout>
  );
}
