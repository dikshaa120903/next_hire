import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, RefreshCw, Check, ArrowRight, Wand2, FileText, Award, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/AppLayout";
import { improveResume } from "@/lib/api";
import { getErrorMessage, getResumeText, getJobDescription } from "@/lib/storage";

type Suggestion = {
  title: string;
  before: string;
  after: string;
  suggestions: string[];
  icon: any;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
};

const sectionColors: Record<string, { gradient: string; badge: string; iconColor: string }> = {
  experience: { gradient: "from-primary to-secondary", badge: "bg-primary/10 text-primary", iconColor: "text-primary" },
  projects: { gradient: "from-secondary to-[hsl(290,75%,67%)]", badge: "bg-secondary/10 text-secondary", iconColor: "text-secondary" },
  skills: { gradient: "from-[hsl(290,75%,67%)] to-primary", badge: "bg-[hsl(290,75%,67%)]/10 text-[hsl(290,75%,67%)]", iconColor: "text-[hsl(290,75%,67%)]" },
  summary: { gradient: "from-primary to-[hsl(290,75%,67%)]", badge: "bg-primary/10 text-primary", iconColor: "text-primary" },
};

const AISuggestions = () => {
  const [regenerating, setRegenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState("");
  const { toast } = useToast();

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resumeText = getResumeText();
      if (!resumeText) {
        setError("No resume text found. Please upload a resume first.");
        setLoading(false);
        return;
      }

      const jobDescription = getJobDescription();
      const response = await improveResume(resumeText, `Analyze the resume and provide section-wise improvements. 
 
 🎯 Your task: 
 Rewrite the content to be more professional, concise, and impactful. 
 Use strong action verbs (e.g., Developed, Implemented, Designed).
 Add measurable results wherever possible (%, numbers, outcomes).
 
 ⚠️ MANDATORY SECTIONS: You MUST map the resume into EXACTLY these four sections, even if the original resume uses different titles:
 1. "Experience"
 2. "Projects"
 3. "Skills"
 4. "Summary"
 
 📄 Output Format (STRICTLY FOLLOW, return ONLY JSON, no other text): 
 { 
 "sections": [ 
 { 
 "title": "Experience", 
 "before": "Original content", 
 "after": "Improved content", 
 "suggestions": [ 
 "Suggestion 1", 
 "Suggestion 2", 
 "Suggestion 3" 
 ] 
 },
 { 
 "title": "Projects", 
 "before": "Original content", 
 "after": "Improved content", 
 "suggestions": [ 
 "Suggestion 1", 
 "Suggestion 2", 
 "Suggestion 3" 
 ] 
 },
 { 
 "title": "Skills", 
 "before": "Original content", 
 "after": "Improved content", 
 "suggestions": [ 
 "Suggestion 1", 
 "Suggestion 2", 
 "Suggestion 3" 
 ] 
 },
 { 
 "title": "Summary", 
 "before": "Original content", 
 "after": "Improved content", 
 "suggestions": [ 
 "Suggestion 1", 
 "Suggestion 2", 
 "Suggestion 3" 
 ] 
 }
 ] 
 } 
 
 ⚠️ Rules: 
 Do NOT return plain text.
 Do NOT mix sections or use generic names like "Section 1, 2, 3".
 Keep suggestions short and actionable.`, jobDescription || undefined);
      
      let rawJson = response.improved_resume;
      // Clean markdown code blocks if present
      if (rawJson.includes("```")) {
        rawJson = rawJson.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1");
      }
      
      const jsonResponse = JSON.parse(rawJson.trim());
      setSuggestions(jsonResponse.sections.map((s: any) => ({
        ...s,
        icon: s.title.toLowerCase().includes('experience') ? FileText : 
              s.title.toLowerCase().includes('project') ? Award : 
              s.title.toLowerCase().includes('skill') ? Sparkles : 
              s.title.toLowerCase().includes('summary') ? FileText : Wand2
      })));
      setLoading(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Copied!", description: "Suggestion copied to clipboard." });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setLoading(true);
    await fetchSuggestions();
    setRegenerating(false);
    toast({ title: "Regenerated!", description: "New AI suggestions are ready." });
  };

  if (error) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 text-center max-w-md mx-auto mt-20"
        >
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">{error}</p>
          <p className="text-muted-foreground text-sm mb-6">Upload a resume first to get suggestions.</p>
          <Button onClick={fetchSuggestions} variant="outline" className="glass">
            Try Again
          </Button>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={regenerating ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: regenerating ? Infinity : 0, ease: "linear" }}
              className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow"
            >
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">AI Suggestions</h1>
              <p className="text-muted-foreground text-sm">Improve your resume with AI-powered rewrites</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleRegenerate}
              disabled={regenerating || loading}
              variant="outline"
              className="gap-2 glass"
            >
              <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-16 rounded-lg" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="p-6 space-y-3 border-t md:border-t-0 md:border-l border-border/50">
                      <Skeleton className="h-5 w-20 rounded-lg" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : suggestions.length > 0 ? (
            <motion.div
              key="content"
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {suggestions.map((s, i) => {
                const titleKey = s.title.toLowerCase();
                const colors = sectionColors[titleKey] || sectionColors.summary;
                return (
                  <motion.div
                    key={s.title}
                    variants={item}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="glass rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden transition-shadow duration-300 group"
                  >
                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                          <s.icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg">{s.title}</h3>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(s.after, i)}
                          className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <AnimatePresence mode="wait">
                            {copiedIndex === i ? (
                              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check className="h-4 w-4 text-emerald-400" />
                              </motion.div>
                            ) : (
                              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Copy className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {copiedIndex === i ? "Copied" : "Copy"}
                        </Button>
                      </motion.div>
                    </div>

                    {/* Before / After comparison */}
                    <div className="grid md:grid-cols-2">
                      {/* Before */}
                      <div className="p-6 border-b md:border-b-0 md:border-r border-border/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">Before</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{s.before}</p>
                      </div>
                      {/* After */}
                      <div className="p-6 bg-primary/[0.03]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${colors.gradient} text-white text-xs font-semibold`}>
                            After ✨
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed font-medium">{s.after}</p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="p-6 border-t border-border/30 bg-card/30">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                        <Lightbulb className={`h-4 w-4 ${colors.iconColor}`} />
                        Key Improvements
                      </h4>
                      <ul className="space-y-2.5">
                        {s.suggestions.map((suggestion, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + j * 0.08 }}
                            className="flex items-start gap-2 text-muted-foreground text-sm"
                          >
                            <ArrowRight className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${colors.iconColor}`} />
                            {suggestion}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center shadow-card"
            >
              <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No suggestions available at the moment.</p>
              <p className="text-muted-foreground text-sm mt-1">Try regenerating or upload a new resume.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
};

export default AISuggestions;
