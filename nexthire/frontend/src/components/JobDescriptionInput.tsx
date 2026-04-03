import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardPaste, Compass } from "lucide-react";

interface JobDescriptionInputProps {
  onAnalyze: (jobDescription: string) => void;
  loading: boolean;
  className?: string;
}

export const JobDescriptionInput = ({ onAnalyze, loading, className = "" }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyzeClick = () => {
    if (jobDescription.trim()) {
      onAnalyze(jobDescription);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
      }}
      className={`glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 gradient-hero opacity-[0.05] rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          Analyze Job Description
        </h2>
        <Button variant="ghost" size="sm" onClick={handlePaste} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ClipboardPaste className="h-4 w-4" />
          Paste
        </Button>
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Paste the job description here to get a tailored analysis..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[150px] text-sm bg-card/40 border-border/50 focus-visible:ring-primary/50 resize-none rounded-xl"
        />
      </div>
      
      <div className="mt-4 flex justify-end relative">
        <Button 
          onClick={handleAnalyzeClick} 
          disabled={!jobDescription.trim() || loading}
          className="gradient-primary text-white shadow-glow hover:opacity-90 transition-opacity"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </motion.div>
  );
};
