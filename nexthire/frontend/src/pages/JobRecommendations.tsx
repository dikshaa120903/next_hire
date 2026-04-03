import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Star, Filter, Search, Building2, ExternalLink, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/AppLayout";
import { recommendJobs } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage, getResumeId } from "@/lib/storage";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  match_percent: number;
  missing_skills: string[];
  why_recommended: string;
};

const roles = ["All", "Backend", "Full Stack", "Frontend", "Data", "DevOps"];
const locations = ["All", "Remote", "Bangalore", "Hyderabad", "Pune"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
};

function MatchBadge({ percent }: { percent: number }) {
  const isTop = percent >= 80;
  const isMid = percent >= 50;
  const color = isTop ? "from-emerald-400 to-emerald-500" : isMid ? "from-amber-400 to-amber-500" : "from-red-400 to-red-500";
  const bgColor = isTop ? "bg-emerald-500/10" : isMid ? "bg-amber-500/10" : "bg-red-500/10";
  const textColor = isTop ? "text-emerald-400" : isMid ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className={`text-3xl font-extrabold ${textColor}`}>
        {Math.round(percent)}%
      </div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Match</div>
      <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const JobRecommendations = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resumeId = getResumeId();
      if (!resumeId) {
        setError("No resume found. Please upload a resume first.");
        setLoading(false);
        return;
      }

      const response = await recommendJobs(resumeId);
      const jobsWithId = response.recommendations.map((job, index) => ({
        ...job,
        id: index + 1,
      }));
      setAllJobs(jobsWithId);
      setLoading(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [toast]);

  const filteredJobs = allJobs.filter((job) => {
    const roleMatch = roleFilter === "All" || job.title.toLowerCase().includes(roleFilter.toLowerCase());
    const locMatch = locationFilter === "All" || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return roleMatch && locMatch;
  });

  if (error) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 text-center max-w-md mx-auto mt-20"
        >
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-semibold mb-2">{error}</p>
          <p className="text-muted-foreground text-sm mb-6">Upload a resume to see job recommendations.</p>
          <Button onClick={fetchJobs} variant="outline" className="glass">
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
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Job Recommendations</h1>
            <p className="text-muted-foreground text-sm">AI-matched jobs based on your resume</p>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 shadow-card mb-6"
        >
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4 text-secondary" /> Filters
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <motion.div key={r} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant={roleFilter === r ? "default" : "outline"} size="sm"
                    onClick={() => setRoleFilter(r)}
                    className={`transition-all duration-200 text-xs ${roleFilter === r ? "gradient-primary text-primary-foreground shadow-sm" : "glass"}`}
                  >{r}</Button>
                </motion.div>
              ))}
            </div>
            <div className="h-8 w-px bg-border/50 hidden sm:block" />
            <div className="flex flex-wrap gap-1.5">
              {locations.map((l) => (
                <motion.div key={l} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant={locationFilter === l ? "default" : "outline"} size="sm"
                    onClick={() => setLocationFilter(l)}
                    className={`transition-all duration-200 text-xs ${locationFilter === l ? "gradient-primary text-primary-foreground shadow-sm" : "glass"}`}
                  >{l}</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-2 sm:text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                    <Skeleton className="h-2 w-28 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> {filteredJobs.length === 1 ? "job" : "jobs"}
            </div>

            <AnimatePresence mode="wait">
              {filteredJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-2xl p-14 shadow-card text-center"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Search className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <p className="font-semibold text-lg">No matching jobs found</p>
                  <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
                </motion.div>
              ) : (
                <motion.div key="list" variants={container} initial="hidden" animate="show" className="grid gap-4">
                  {filteredJobs.map((job) => {
                    const isTopMatch = job.match_percent >= 80;
                    return (
                      <motion.div
                        key={job.id}
                        variants={item}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        className={`glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                          isTopMatch ? "border-gradient" : ""
                        }`}
                      >
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                        <div className="relative flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {isTopMatch && (
                                <motion.span
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg gradient-primary text-white text-xs font-semibold"
                                >
                                  <Star className="h-3 w-3" /> Top Match
                                </motion.span>
                              )}
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                                  <span className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-secondary" /> {job.company}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-secondary" /> {job.location}
                                  </span>
                                </div>
                              </div>
                              <MatchBadge percent={job.match_percent} />
                            </div>

                            <div className="mt-4 pt-4 border-t border-border/30">
                              <p className="text-sm text-muted-foreground mb-3">
                                <span className="font-medium text-foreground">Why recommended:</span> {job.why_recommended}
                              </p>
                              
                              <div className="flex items-start flex-col gap-1.5">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Missing Skills</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {job.missing_skills.length > 0 ? (
                                    job.missing_skills.map((skill, idx) => (
                                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/15">
                                        {skill}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                      <Zap className="h-3 w-3" /> Perfect match! No missing skills.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="h-4 w-4 text-secondary" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default JobRecommendations;
