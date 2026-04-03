import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BookOpen, Briefcase, Search, Award, ArrowUpRight, Lightbulb, ChevronRight, Activity, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { scoreResume, scoreResumeWithDescription } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage, getResumeId, getResumeSkills, setJobDescription as setJdInStorage } from "@/lib/storage";

const scoreBreakdownConfig = [
  { label: "Skills", key: "skills_count", icon: BookOpen, color: "hsl(250, 85%, 67%)", bgColor: "bg-[hsl(250,85%,67%)]/10" },
  { label: "Experience", key: "experience_years", icon: Briefcase, color: "hsl(195, 90%, 55%)", bgColor: "bg-[hsl(195,90%,55%)]/10" },
  { label: "Keyword Match", key: "keyword_match_percent", icon: Search, color: "hsl(290, 75%, 67%)", bgColor: "bg-[hsl(290,75%,67%)]/10" },
];

const quickActions = [
  { label: "View AI Suggestions", icon: Lightbulb, to: "/suggestions", accent: "from-primary to-secondary" },
  { label: "Browse Jobs", icon: Briefcase, to: "/jobs", accent: "from-secondary to-[hsl(290,75%,67%)]" },
];

function CircularScore({ score, loading }: { score: number; loading: boolean }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  if (loading) {
    return (
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <Skeleton className="w-44 h-44 rounded-full" />
      </div>
    );
  }

  const scoreColor = score < 50 ? "hsl(0, 72%, 55%)" : score < 80 ? "hsl(45, 90%, 55%)" : "hsl(145, 70%, 50%)";

  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Glow behind */}
      <div className="absolute inset-4 rounded-full" style={{
        boxShadow: `0 0 40px ${scoreColor}22, 0 0 80px ${scoreColor}11`
      }} />
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="hsl(232, 35%, 22%)" strokeWidth="8" />
        <motion.circle
          cx="80" cy="80" r={r} fill="none"
          stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(250, 85%, 67%)" />
            <stop offset="50%" stopColor="hsl(195, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(290, 75%, 67%)" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-5xl font-extrabold text-foreground">{Math.round(score)}</span>
        <span className="text-xs text-muted-foreground mt-1 font-medium">out of 100</span>
      </motion.div>
    </div>
  );
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<Array<{ label: string; score: number; icon: any; color: string; bgColor: string }>>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detectedRole, setDetectedRole] = useState<string>("Software Engineer");
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [keywordMatchPercent, setKeywordMatchPercent] = useState<number>(0);
  const [jobMatchSuggestions, setJobMatchSuggestions] = useState<string[]>([]);

  const fetchScoreData = useCallback(async () => {
    try {
      const resumeId = getResumeId();
      if (!resumeId) {
        setError("No resume found. Please upload a resume first.");
        setLoading(false);
        return;
      }

      const response = await scoreResume(resumeId);
      setOverallScore(response.score);
      
      if (response.features?.detected_role) {
        setDetectedRole(response.features.detected_role);
      }

      const breakdown = scoreBreakdownConfig.map((config) => ({
        ...config,
        score: Math.min(Math.round(response.breakdown[config.key as keyof typeof response.breakdown] || 0), 100),
      }));
      setScoreBreakdown(breakdown);

      if (response.features) {
        const mk = response.features.missing_keywords || [];
        setMissingKeywords(mk);
        setKeywordMatchPercent(response.features.keyword_match_percent || 0);
        
        const suggestions: string[] = [];
        if (response.features.projects_count < 2) suggestions.push("Add more relevant projects to demonstrate practical experience.");
        if (mk.length > 0) suggestions.push(`Improve keywords by adding: ${mk.slice(0, 4).join(', ')}`);
        if (suggestions.length === 0) suggestions.push("Your resume is well optimized for this role!");
        setJobMatchSuggestions(suggestions);
      }

      const allSkills = getResumeSkills();
      setSkills(allSkills);
      setError(null);
      setLoading(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchScoreData();
  }, [fetchScoreData]);

  const handleAnalyze = async (jd: string) => {
    setJdInStorage(jd);
    setJobDescription(jd);
    setIsAnalyzing(true);
    try {
      const resumeId = getResumeId();
      if (!resumeId) {
        setError("No resume found. Please upload a resume first.");
        setIsAnalyzing(false);
        return;
      }

      const response = await scoreResumeWithDescription(resumeId, jd);
      setOverallScore(response.score);
      if (response.features?.detected_role) {
        setDetectedRole(response.features.detected_role);
      }
      const breakdown = scoreBreakdownConfig.map((config) => ({
        ...config,
        score: Math.min(Math.round(response.breakdown[config.key as keyof typeof response.breakdown] || 0), 100),
      }));
      setScoreBreakdown(breakdown);

      if (response.features) {
        const mk = response.features.missing_keywords || [];
        setMissingKeywords(mk);
        setKeywordMatchPercent(response.features.keyword_match_percent || 0);

        const suggestions: string[] = [];
        if (response.features.projects_count < 2) suggestions.push("Add more relevant projects to demonstrate practical experience.");
        if (mk.length > 0) suggestions.push(`Improve keywords by adding: ${mk.slice(0, 4).join(', ')}`);
        if (suggestions.length === 0) suggestions.push("Your resume is well optimized for this job description!");
        setJobMatchSuggestions(suggestions);
      }

      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setIsAnalyzing(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
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
            <Activity className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">{error}</p>
          <p className="text-muted-foreground text-sm mb-6">Try uploading a resume or refresh the page.</p>
          <Button onClick={() => { setError(null); fetchScoreData(); }} variant="outline" className="glass">
            Try Again
          </Button>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Your resume analysis overview</p>
            </div>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <Button key={action.label} asChild variant="outline" size="sm" className="gap-1.5 glass hover:scale-[1.03] transition-all duration-200">
                <Link to={action.to}>
                  <action.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Description Input */}
          <JobDescriptionInput onAnalyze={handleAnalyze} loading={isAnalyzing} className="lg:col-span-2" />

          {/* Resume Score */}
          <motion.div
            variants={item}
            whileHover={{ y: -2 }}
            className="lg:col-span-1 flex flex-col glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 gradient-hero opacity-[0.08] rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Award className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold">Resume Score</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <CircularScore score={overallScore} loading={loading} />
              <AnimatePresence>
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8"
                  >
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-foreground">Resume Strength</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        overallScore < 50 ? "bg-red-500/15 text-red-400" :
                        overallScore < 80 ? "bg-amber-500/15 text-amber-400" :
                        "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {overallScore < 50 ? "Needs Work" : overallScore < 80 ? "Good" : "Excellent"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: overallScore < 50
                            ? "linear-gradient(90deg, hsl(0,72%,55%), hsl(20,80%,55%))"
                            : overallScore < 80
                            ? "linear-gradient(90deg, hsl(40,90%,50%), hsl(50,90%,55%))"
                            : "linear-gradient(90deg, hsl(145,70%,45%), hsl(160,70%,50%))"
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${overallScore}%` }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div variants={item} className="lg:col-span-2 glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <ArrowUpRight className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold">Score Breakdown</h2>
            </div>
            <div className="space-y-5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-2.5 w-full rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                scoreBreakdown.map((bk, i) => (
                  <motion.div
                    key={bk.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 100 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className={`h-11 w-11 rounded-xl ${bk.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                      <bk.icon className="h-5 w-5" style={{ color: bk.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="font-medium text-sm">{bk.label}</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + i * 0.15 }}
                          className="font-bold text-sm"
                        >
                          {bk.score}%
                        </motion.span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${bk.color}, ${bk.color}bb)` }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${bk.score}%` }}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Career Role Info */}
        <motion.div variants={item} className="mt-6 glass rounded-2xl p-6 border-gradient shadow-card">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-secondary mb-1">Detected Career Role</h3>
                <p className="text-lg font-bold text-foreground">{detectedRole}</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
                  Your resume is being evaluated with keywords and criteria specific to {detectedRole.toLowerCase()} roles.
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground px-3 py-1.5 rounded-lg bg-primary/5">
              <p>Score is role-aware</p>
            </div>
          </div>
        </motion.div>

        {/* Job Match Analysis */}
        <motion.div variants={item} className="mt-6 glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Resume vs Job Match
              <Award className="h-4 w-4 text-secondary" />
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="font-medium">Match Score</span>
                <span className="text-2xl font-bold text-gradient">{keywordMatchPercent}%</span>
              </div>
              
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <span className="block font-medium mb-3 text-sm">Suggestions</span>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {!loading && jobMatchSuggestions.length > 0 ? jobMatchSuggestions.map((s, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <ArrowUpRight className="h-4 w-4 text-secondary shrink-0 mt-0.5" /> {s}
                    </li>
                  )) : (
                    loading ? <Skeleton className="h-4 w-full" /> : <li>No specific suggestions.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <span className="block font-medium mb-3 text-sm">Missing Skills</span>
              <div className="flex flex-wrap gap-2">
                {!loading && missingKeywords.length > 0 ? (
                  missingKeywords.map((kw, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/15"
                    >
                      {kw}
                    </motion.span>
                  ))
                ) : loading ? (
                    <Skeleton className="h-6 w-20 rounded-lg" />
                ) : (
                  <span className="text-sm text-muted-foreground italic">No critical missing skills — great match!</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div variants={item} className="mt-6 glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            Extracted Skills
            {!loading && skills.length > 0 && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{skills.length}</span>
            )}
          </h2>
          {loading ? (
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-lg" style={{ width: `${60 + Math.random() * 40}px` }} />
              ))}
            </div>
          ) : skills.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, type: "spring", stiffness: 200, damping: 15 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="px-4 py-2 rounded-xl glass text-sm font-medium hover:bg-primary/15 hover:text-primary transition-all duration-200 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No skills extracted. Upload a resume to get started.</p>
          )}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
