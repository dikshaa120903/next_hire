import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Ghost, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient background styling */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full gradient-hero pointer-events-none blur-[140px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="glass-strong rounded-3xl p-16 text-center max-w-lg mx-4 shadow-card-hover border-gradient relative"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-block mb-6"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <Ghost className="h-24 w-24 text-primary relative z-10" />
        </motion.div>
        
        <h1 className="mb-2 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
        <p className="mb-8 text-muted-foreground leading-relaxed">
          The career opportunity you're looking for seems to have moved or doesn't exist anymore. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto gradient-primary shadow-glow border-none">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass hover:bg-white/10">
            <Link to="/dashboard">
              <Compass className="mr-2 h-4 w-4" /> To Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
