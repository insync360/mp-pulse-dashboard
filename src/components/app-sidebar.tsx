import { Link, useRouterState } from "@tanstack/react-router";
import {
  Gauge,
  Sun,
  Users,
  ClipboardList,
  FileSignature,
  Contact,
  Calendar,
  Mic,
  BarChart3,
  Smile,
  Radar,
  Target,
  Newspaper,
  TrendingUp,
  Landmark,
  Building2,
  FileText,
  Settings,
  Database,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { title: "Command Center", url: "/", icon: Gauge },
      { title: "Daily Briefing", url: "/daily-briefing", icon: Sun, badge: 5 },
    ],
  },
  {
    label: "Constituent Service",
    items: [
      { title: "Visitors & Appointments", url: "/visitors", icon: Users },
      { title: "Grievances", url: "/grievances", icon: ClipboardList, badge: 3 },
      { title: "Recommendation Letters", url: "/recommendation-letters", icon: FileSignature },
    ],
  },
  {
    label: "Relationships & Schedule",
    items: [
      { title: "Stakeholder CRM", url: "/stakeholder-crm", icon: Contact },
      { title: "Calendar & Visits", url: "/calendar", icon: Calendar },
      { title: "Briefings & Speeches", url: "/briefings-speeches", icon: Mic },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Post Analytics", url: "/post-analytics", icon: BarChart3 },
      { title: "Sentiment", url: "/sentiment", icon: Smile },
      { title: "Issue Radar", url: "/issue-radar", icon: Radar },
      { title: "Opportunities", url: "/opportunities", icon: Target },
      { title: "Media Watch", url: "/media-watch", icon: Newspaper },
      { title: "Positioning", url: "/positioning", icon: TrendingUp },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Funds & Projects", url: "/funds-projects", icon: Landmark },
      { title: "Parliament Tracker", url: "/parliament-tracker", icon: Building2 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Settings & Team", url: "/settings-team", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron text-saffron-foreground font-bold text-sm shadow-sm shrink-0">
            MP
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              MP Pulse
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              Intelligence Suite
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 overflow-y-auto">
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-[0.12em] font-medium group-data-[collapsible=icon]:hidden">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="relative data-[active=true]:bg-saffron/15 data-[active=true]:text-saffron data-[active=true]:font-medium hover:bg-sidebar-accent/60"
                      >
                        <Link to={item.url}>
                          {active && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-saffron"
                            />
                          )}
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge !== undefined && (
                            <>
                              <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-semibold text-saffron-foreground group-data-[collapsible=icon]:hidden">
                                {item.badge}
                              </span>
                              <span
                                aria-hidden
                                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-saffron hidden group-data-[collapsible=icon]:block"
                              />
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/80">
          <div className="font-medium text-sidebar-foreground">Live monitoring</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>14 sources active</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
