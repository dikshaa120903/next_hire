import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2, CloudUpload, FileUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/AppLayout";
import { uploadResume } from "@/lib/api";

const tips = [
  { icon: Sparkles, text: "Use action verbs like 'developed', 'architected', 'optimized'", color: "text-primary" },
  { icon: FileUp, text: "Include measurable achievements with numbers and percentages", color: "text-secondary" },
  { icon: CloudUpload, text: "Tailor your resume keywords to match job descriptions", color: "text-[hsl(290,75%,67%)]" },
];

const isValidResumeFile = (candidate: File) => (
  candidate.type === "application/pdf" || candidate.name.toLowerCase().endsWith(".docx")
);

const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && isValidResumeFile(dropped)) {
      setFile(dropped);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!isValidResumeFile(selected)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum allowed file size is 5MB.", variant: "destructive" });
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadResume(file, "");
      localStorage.setItem("resume_id", String(response.resume_id));
      localStorage.setItem("resume_skills", JSON.stringify(response.skills));
      localStorage.setItem("resume_text", response.extracted_text);
      toast({ title: "Resume analyzed!", description: "Resume uploaded to backend and processed successfully." });
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to analyze resume.";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Upload Resume</h1>
              <p className="text-muted-foreground text-sm">Get AI-powered analysis and recommendations</p>
            </div>
          </div>

          {/* Drop zone */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative mt-8 rounded-2xl p-14 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
              dragOver
                ? "glass-strong shadow-card-hover"
                : "glass shadow-card hover:shadow-card-hover"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            {/* Animated dashed border */}
            <div className={`absolute inset-0 rounded-2xl border-2 border-dashed transition-colors duration-300 ${
              dragOver ? "border-secondary" : "border-border hover:border-primary/40"
            }`} />

            {/* Animated bg gradient */}
            <motion.div
              animate={{ opacity: dragOver ? 0.12 : 0.04 }}
              className="absolute inset-0 gradient-hero pointer-events-none rounded-2xl"
            />

            <input id="file-input" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileSelect} />
            <div className="relative flex flex-col items-center gap-5">
              <motion.div
                animate={dragOver ? { scale: 1.12, y: -6, rotate: 5 } : { scale: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-18 w-18 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
                style={{ width: 72, height: 72 }}
              >
                <Upload className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <div>
                <p className="font-semibold text-lg">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground mt-1.5">Supports PDF and DOCX files • Max 5MB</p>
              </div>
              <Button variant="outline" className="mt-1 glass hover:scale-[1.03] transition-all duration-200 gap-2">
                <FileText className="h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </motion.div>

          {/* File preview */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mt-6"
              >
                <div className="flex items-center gap-3 glass rounded-xl p-4 shadow-card border-gradient">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    className="h-11 w-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0"
                  >
                    <FileText className="h-5 w-5 text-secondary" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <div className="mt-8">
            <motion.div whileHover={file && !uploading ? { scale: 1.01 } : {}} whileTap={file && !uploading ? { scale: 0.99 } : {}}>
              <Button
                onClick={handleAnalyze}
                disabled={!file || uploading}
                className="w-full gradient-primary text-primary-foreground py-6 text-base font-semibold rounded-xl shadow-glow hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:shadow-none gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Analyze Resume
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Loading skeleton state */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 space-y-4"
              >
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary rounded-full shimmer"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">Processing your resume with AI...</p>
                <div className="glass rounded-2xl p-6 shadow-card space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips section */}
          {!uploading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                Pro Tips
              </h3>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <motion.div
                    key={tip.text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl glass hover:shadow-card transition-all duration-200 group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-card/80 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <tip.icon className={`h-4 w-4 ${tip.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default UploadResume;
