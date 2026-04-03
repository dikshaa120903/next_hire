import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileSearch, Sparkles, Target, ArrowRight, Zap, Shield, BarChart3,
  Brain, Rocket, Users, CheckCircle, Globe, Clock, Star, Layers, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";

const features = [
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description: "Get instant AI-powered feedback on your resume with actionable insights and comprehensive score breakdowns.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Receive intelligent recommendations to elevate your resume with before/after comparisons and pro writing tips.",
    accent: "from-secondary to-[hsl(290,75%,67%)]",
  },
  {
    icon: Target,
    title: "Job Matching",
    description: "Find the best job opportunities that match your skills, experience, and long-term career goals.",
    accent: "from-[hsl(290,75%,67%)] to-primary",
  },
];

const stats = [
  { icon: Zap, value: "10K+", label: "Resumes Analyzed" },
  { icon: Shield, value: "95%", label: "Accuracy Rate" },
  { icon: BarChart3, value: "3x", label: "More Interviews" },
];

const trustedBy = [
  { icon: Globe, name: "Global Reach" },
  { icon: Users, name: "50K+ Users" },
  { icon: Clock, name: "Real-time" },
  { icon: CheckCircle, name: "Verified" },
];

const steps = [
  { number: "01", title: "Upload", description: "Upload your resume in PDF or DOCX format" },
  { number: "02", title: "Analyze", description: "Our AI engine scores and evaluates your resume" },
  { number: "03", title: "Improve", description: "Get actionable suggestions and land better jobs" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 12 } },
};

const floatVariants = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const floatSlow = {
  animate: {
    y: [0, -14, 0],
    x: [0, 8, 0],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const Index = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="min-h-screen gradient-surface overflow-hidden relative">
      {/* Top Navigation / Sign In */}
      <div className="absolute top-6 right-6 z-50 md:top-8 md:right-8">
        {isLoggedIn ? (
          <Button asChild variant="outline" className="glass hover:bg-white/10 text-white border-white/20">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button asChild className="gradient-primary hover:opacity-90 text-white shadow-glow">
            <Link to="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        )}
      </div>

      {/* Hero */}
      <section className="relative">
        {/* Animated gradient orbs */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="absolute top-10 right-[10%] w-96 h-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none"
        />
        <motion.div
          variants={floatSlow}
          animate="animate"
          className="absolute bottom-0 left-[5%] w-[500px] h-[500px] rounded-full bg-secondary/8 blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full gradient-hero pointer-events-none"
        />
        {/* Grid overlay pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, hsl(250, 85%, 67%) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] hidden lg:block"
        >
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow opacity-60">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-[12%] hidden lg:block"
        >
          <div className="h-11 w-11 rounded-xl glass flex items-center justify-center opacity-50">
            <Rocket className="h-5 w-5 text-secondary" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-[20%] hidden lg:block"
        >
          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center opacity-40">
            <Target className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-64 right-[25%] hidden lg:block"
        >
          <div className="h-9 w-9 rounded-lg glass flex items-center justify-center opacity-30">
            <Star className="h-4 w-4 text-[hsl(290,75%,67%)]" />
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 md:pt-32 md:pb-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium mb-8">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                </motion.div>
                <span className="text-muted-foreground">AI-Powered Career Platform</span>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              <span className="text-gradient">Next-Hire</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-xl md:text-2xl font-semibold tracking-tight text-foreground/80 mb-5"
            >
              Boost Your Career with AI
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Analyze your resume, get job recommendations, and improve your
              profile using cutting-edge artificial intelligence.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-glow hover:opacity-90 transition-all duration-300 hover:scale-[1.03]">
                <Link to="/upload">
                  Upload Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base font-semibold rounded-xl glass hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.03]">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ scale: 1.05, y: -4 }}
                className="text-center glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted strip */}
      <section className="py-8 border-y border-border/40 glass">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 md:gap-16 flex-wrap"
          >
            {trustedBy.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <t.icon className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">{t.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3 w-3 text-secondary" /> How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Simple Steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Go from raw resume to polished profile in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center glass rounded-2xl p-8 shadow-card relative overflow-hidden group hover:shadow-card-hover transition-all duration-300"
              >
                <div className="absolute inset-0 gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <span className="text-5xl font-extrabold text-gradient opacity-40">{step.number}</span>
                  <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 relative">
        <motion.div
          variants={floatSlow}
          animate="animate"
          className="absolute top-20 right-0 w-60 h-60 rounded-full bg-primary/5 blur-[100px] pointer-events-none"
        />
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3 w-3 text-secondary" /> Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to land your dream job, powered by AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group glass rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient bg on hover */}
                <div className="absolute inset-0 gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <motion.div
                    className="mt-5 flex items-center gap-1 text-sm font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none"
            />
            <div className="relative">
              <Rocket className="h-10 w-10 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Supercharge Your Career?
              </h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
                Join thousands of professionals who've improved their resumes and landed better jobs.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:scale-[1.03] transition-all duration-300 border border-white/20"
              >
                <Link to="/upload">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 glass">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">CareerBoost AI</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link to="/upload" className="hover:text-foreground transition-colors duration-200">Upload</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors duration-200">Dashboard</Link>
              <Link to="/jobs" className="hover:text-foreground transition-colors duration-200">Jobs</Link>
              <Link to="/suggestions" className="hover:text-foreground transition-colors duration-200">AI Suggestions</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 CareerBoost AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
