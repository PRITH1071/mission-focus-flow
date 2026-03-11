import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/lib/gameStore";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle2, FileText, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  subject: string;
  description: string;
  file_name: string | null;
  file_url: string | null;
  time_spent_minutes: number;
  submitted_at: string;
}

export default function SubmitHomework() {
  const { addXP } = useGameStore();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("homework_submissions")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(20);
    if (data) setSubmissions(data);
  };

  const getLastSessionMinutes = async (): Promise<number> => {
    const { data } = await supabase
      .from("homework_sessions")
      .select("actual_time_spent_minutes")
      .order("completed_at", { ascending: false })
      .limit(1);
    return data?.[0]?.actual_time_spent_minutes ?? 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Enter a subject");
      return;
    }

    setSubmitting(true);
    try {
      let fileName: string | null = null;
      let fileUrl: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("homework-files")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("homework-files")
          .getPublicUrl(path);
        fileName = file.name;
        fileUrl = urlData.publicUrl;
      }

      const timeSpent = await getLastSessionMinutes();

      const { error } = await supabase.from("homework_submissions").insert({
        subject: subject.trim(),
        description: description.trim(),
        file_name: fileName,
        file_url: fileUrl,
        time_spent_minutes: timeSpent,
      });
      if (error) throw error;

      addXP(5);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      toast.success("Homework submitted! +5 XP 🎉");

      setSubject("");
      setDescription("");
      setFile(null);
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-3xl font-bold mb-1">Submit Homework</h1>
          <p className="text-muted-foreground">Upload your completed work and earn XP</p>
        </motion.div>

        {/* Success */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-5 flex items-center gap-3 border border-green-500/30 bg-green-500/10 glow-primary"
            >
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-display font-bold text-green-400">Homework Submitted!</p>
                <p className="text-sm text-green-400/80">+5 XP Earned</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 space-y-5 border border-border/30"
        >
          <div>
            <Label htmlFor="hw-subject" className="text-muted-foreground">Subject</Label>
            <Input
              id="hw-subject"
              placeholder="e.g. Math Assignment Ch. 5"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 bg-secondary/50 border-border/50 rounded-xl"
              maxLength={120}
            />
          </div>

          <div>
            <Label htmlFor="hw-desc" className="text-muted-foreground">Description</Label>
            <Textarea
              id="hw-desc"
              placeholder="Brief notes about this submission..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 bg-secondary/50 border-border/50 rounded-xl min-h-[100px]"
              maxLength={500}
            />
          </div>

          <div>
            <Label className="text-muted-foreground">Attach File (optional)</Label>
            <label className="mt-1.5 flex items-center gap-3 p-4 rounded-xl border border-dashed border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : "Click to upload image or PDF"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full rounded-xl gradient-primary text-primary-foreground glow-primary font-semibold"
          >
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {submitting ? "Submitting..." : "Submit Homework"}
          </Button>
        </motion.form>

        {/* Previous submissions */}
        {submissions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Previous Submissions</h2>
            {submissions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-start gap-3 border border-border/30"
              >
                <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-foreground truncate">{s.subject}</p>
                  {s.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{s.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.submitted_at).toLocaleDateString()}
                    </span>
                    {s.time_spent_minutes > 0 && (
                      <Badge variant="outline" className="text-xs gap-1 border-border/50">
                        <Clock className="w-3 h-3" /> {s.time_spent_minutes} min
                      </Badge>
                    )}
                    {s.file_name && (
                      <a
                        href={s.file_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate max-w-[150px]"
                      >
                        📎 {s.file_name}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>📝 Submit homework to earn <span className="text-xp font-medium">5 XP</span></p>
        </div>
      </div>
    </AppLayout>
  );
}
