import { LayoutDashboard, Upload, Briefcase, Sparkles, Home, ChevronLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Resume", url: "/upload", icon: Upload },
  { title: "Job Recommendations", url: "/jobs", icon: Briefcase },
  { title: "AI Suggestions", url: "/suggestions", icon: Sparkles },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow"
          >
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </motion.div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-lg text-foreground tracking-tight"
            >
              Next-Hire
            </motion.span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground group"
                      activeClassName="glass text-foreground font-semibold shadow-card"
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0 group-hover:text-primary transition-colors duration-200" />
                      {!collapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar bottom decoration */}
      {!collapsed && (
        <div className="mt-auto p-4">
          <div className="rounded-xl glass p-4">
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              🚀 Boost your career with AI-powered resume analysis
            </p>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
