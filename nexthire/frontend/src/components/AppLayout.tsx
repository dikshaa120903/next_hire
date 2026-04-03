import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden bg-background">
        {/* Animated ambient orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] -left-[8%] w-[45%] h-[45%] rounded-full bg-primary/8 blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-[15%] -right-[8%] w-[40%] h-[40%] rounded-full bg-secondary/8 blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full bg-[hsl(290,75%,67%)]/5 blur-[120px] pointer-events-none"
        />

        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Top header bar */}
          <header className="h-16 flex items-center glass-strong sticky top-0 z-20 px-6 shrink-0">
            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200" />
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm font-medium tracking-wide text-muted-foreground hidden sm:inline-block">
                CareerBoost AI
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {/* User avatar */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shadow-glow cursor-pointer select-none"
              >
                U
              </motion.div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
